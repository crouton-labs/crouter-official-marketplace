#!/usr/bin/env node
// Exec-transport and lifecycle-hook entrypoint for the `dev` plugin.
//
// crtr writes exactly one JSON request to stdin and reads exactly one JSON
// envelope from stdout. Diagnostics go to stderr — anything else on stdout is
// a protocol violation.
//
// Every path returns an envelope rather than exiting: stdout is a pipe, so its
// write is asynchronous, and a `process.exit()` behind it would truncate a
// large result into a protocol error. The one writer below emits the envelope,
// sets `process.exitCode`, and lets Node exit once stdout has drained.
//
// This is separate from `bin/dev`, the bare-binary shell dispatcher. That one
// is a contributed binary on the broker's PATH; this one speaks crtr protocols
// and is never invoked by a human.

import { spawn } from 'node:child_process';

import { runTrack, scenarioList, scenarioStart, scenarioClean, TutorialError } from '../lib/tutorial/run.mjs';

const PROTOCOL_VERSION = 1;
const GROVE_CLOSE_OP = 'grove.cleanup-owned-instances';

/** Command path (after the `dev` root) → handler. */
const LEAVES = new Map([
  ['tutorial basic', (input) => runTrack('basic', input)],
  ['tutorial advanced', (input) => runTrack('advanced', input)],
  ['tutorial scenario list', () => scenarioList()],
  ['tutorial scenario start', (input) => scenarioStart(input)],
  ['tutorial scenario clean', (input) => scenarioClean(input)],
]);

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function ok(result) {
  return { protocolVersion: PROTOCOL_VERSION, ok: true, result };
}

function fail(code, message, { field, next } = {}) {
  return {
    protocolVersion: PROTOCOL_VERSION,
    ok: false,
    error: {
      code,
      message,
      ...(field !== undefined ? { field } : {}),
      ...(next !== undefined ? { next } : {}),
    },
  };
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function executionDetail(result) {
  if (result.error !== undefined) return result.error.message;
  return result.stderr.trim() || result.stdout.trim() || `Grove exited with ${result.signal ?? result.code ?? 'an unknown status'}`;
}

function runGrove(args) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn('grove', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (error) {
      resolve({ code: null, signal: null, stdout: '', stderr: '', error: error instanceof Error ? error : new Error(String(error)) });
      return;
    }
    let stdout = '';
    let stderr = '';
    let settled = false;
    const settle = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', (error) => settle({ code: null, signal: null, stdout, stderr, error }));
    child.once('close', (code, signal) => settle({ code, signal, stdout, stderr }));
  });
}

function ownedGroveTargets(inventory, nodeId) {
  if (!isRecord(inventory) || inventory.version !== 1 || !Array.isArray(inventory.projects)) {
    throw new Error('expected a version 1 inventory object with a projects array');
  }
  const targets = [];
  for (const project of inventory.projects) {
    if (!isRecord(project) || typeof project.name !== 'string' || project.name === '' || !Array.isArray(project.instances)) {
      throw new Error('every project must have a non-empty name and an instances array');
    }
    for (const instance of project.instances) {
      if (!isRecord(instance) || typeof instance.name !== 'string' || instance.name === '' || typeof instance.slot !== 'number' || !isRecord(instance.spec) || !isRecord(instance.spec.labels) || !Object.values(instance.spec.labels).every((value) => typeof value === 'string')) {
        throw new Error(`project ${project.name} has an invalid instance`);
      }
      if (instance.spec.labels.owner === nodeId) targets.push(`${project.name}/${instance.name}`);
    }
  }
  return targets.sort();
}

async function cleanupOwnedGroveInstances(request) {
  if (!isRecord(request) || request.protocolVersion !== PROTOCOL_VERSION || request.event !== 'node:close' || request.phase !== 'on' || request.op !== GROVE_CLOSE_OP || !isRecord(request.node) || typeof request.node.id !== 'string' || request.node.id === '') {
    return fail('invalid_hook_request', 'expected a protocolVersion 1 node:close request with the Grove cleanup operation and node.id');
  }

  const inventoryResult = await runGrove(['list', '--json']);
  if (inventoryResult.error !== undefined && inventoryResult.error.code === 'ENOENT') {
    return fail('grove_unavailable', 'Grove is not available on PATH.', { next: 'Install Grove, then run `grove setup` in the source repository.' });
  }
  if (inventoryResult.error !== undefined || inventoryResult.code !== 0 || inventoryResult.signal !== null) {
    return fail('grove_list_failed', `grove list --json failed: ${executionDetail(inventoryResult)}`);
  }

  let targets;
  try {
    targets = ownedGroveTargets(JSON.parse(inventoryResult.stdout), request.node.id);
  } catch (error) {
    return fail('grove_inventory_invalid', `grove list --json returned invalid inventory: ${error instanceof Error ? error.message : String(error)}`);
  }

  const failures = [];
  for (const target of targets) {
    const result = await runGrove(['uproot', target, '--force']);
    if (result.error !== undefined || result.code !== 0 || result.signal !== null) failures.push(`${target}: ${executionDetail(result)}`);
  }
  if (failures.length > 0) return fail('grove_uproot_failed', `could not uproot Grove instances owned by ${request.node.id}: ${failures.join('; ')}`);
  return { protocolVersion: PROTOCOL_VERSION, ok: true };
}

async function runCommand(request) {
  if (request?.protocolVersion !== PROTOCOL_VERSION) {
    return fail('unsupported_protocol', `unsupported request protocolVersion ${String(request?.protocolVersion)}`, {
      next: `This plugin speaks protocol version ${PROTOCOL_VERSION}. Update crtr or the plugin.`,
    });
  }

  const path = (request.command ?? []).slice(1).join(' ');
  const handler = LEAVES.get(path);
  if (handler === undefined) {
    return fail('unknown_command', `no such command: ${(request.command ?? []).join(' ') || '(empty)'}`, {
      next: 'Run `crtr dev tutorial -h` to list this plugin\'s commands.',
    });
  }

  const input = request.input && typeof request.input === 'object' ? request.input : {};
  try {
    return ok(await handler(input));
  } catch (err) {
    if (err instanceof TutorialError) {
      return fail(err.code, err.message, { next: err.next });
    }
    const message = err instanceof Error ? err.message : String(err);
    return fail('command_failed', message, {
      next: 'Retry the command. If it persists, report the failing invocation.',
    });
  }
}

async function run() {
  const raw = await readStdin();

  let request;
  try {
    request = JSON.parse(raw);
  } catch {
    return process.argv[2] === '--crtr-hook-protocol'
      ? fail('malformed_request', 'stdin did not carry a single JSON request object')
      : fail('malformed_request', 'stdin did not carry a single JSON request object', {
        next: 'Invoke this executable through crtr, which writes the protocol request.',
      });
  }

  if (process.argv[2] === '--crtr-hook-protocol') {
    if (process.argv[3] !== String(PROTOCOL_VERSION)) return fail('unsupported_protocol', `unsupported hook protocol ${String(process.argv[3])}`);
    return cleanupOwnedGroveInstances(request);
  }
  return runCommand(request);
}

const envelope = await run().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
  return process.argv[2] === '--crtr-hook-protocol'
    ? fail('hook_failed', 'the dev plugin crashed before producing a hook result')
    : fail('command_failed', 'the dev plugin crashed before producing a result', {
      next: 'Check stderr for the stack trace and report it.',
    });
});

process.stdout.write(`${JSON.stringify(envelope)}\n`);
process.exitCode = envelope.ok ? 0 : 1;
