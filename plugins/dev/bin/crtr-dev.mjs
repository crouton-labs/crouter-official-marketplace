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
import { realpath } from 'node:fs/promises';
import { relative } from 'node:path';

import { launchReview, PrReviewError } from '../lib/pr-review/launch.mjs';
import { runTrack, TutorialError } from '../lib/tutorial/run.mjs';

const PROTOCOL_VERSION = 1;
const GROVE_CREATE_OP = 'grove.one-resident-owner';
const GROVE_START_OP = 'grove.stamp-owner';
const GROVE_CLOSE_OP = 'grove.cleanup-owned-instances';

/** Full command path → handler. */
const LEAVES = new Map([
  ['human pr review', (input) => launchReview(input, process.cwd())],
  ['sys tutorial dev', (input) => runTrack(input)],
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

function runProcess(command, args, { cwd, env } = {}) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
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

function runGrove(args, options) {
  return runProcess('grove', args, options);
}

function groveDirectoryResolutionOptions(cwd) {
  const { GROVE_INSTANCE: _groveInstance, ...env } = process.env;
  return { cwd, env };
}

function groveUnavailable(result) {
  return result.error !== undefined && result.error.code === 'ENOENT';
}

function parseJson(stdout, description) {
  try {
    return JSON.parse(stdout);
  } catch {
    throw new Error(`${description} did not return JSON`);
  }
}

function instanceFromOpen(result) {
  const value = parseJson(result.stdout, 'grove open --json');
  if (!isRecord(value) || typeof value.project !== 'string' || value.project === '' || typeof value.name !== 'string' || value.name === '' || typeof value.slot !== 'number' || typeof value.path !== 'string' || value.path === '') {
    throw new Error('grove open --json returned an invalid instance');
  }
  return value;
}

function cwdIsInstancePath(cwd, instancePath) {
  const path = relative(instancePath, cwd);
  return path === '' || (path !== '..' && !path.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !path.includes(`..${process.platform === 'win32' ? '\\' : '/'}`));
}

function createRequestIsResidentRoot(request) {
  return isRecord(request)
    && request.protocolVersion === PROTOCOL_VERSION
    && request.event === 'node:create'
    && request.phase === 'before'
    && request.op === GROVE_CREATE_OP
    && isRecord(request.create)
    && typeof request.create.cwd === 'string'
    && request.create.root === true
    && request.create.lifecycle === 'resident';
}

function lifecycleRequestIsValid(request, event, op) {
  return isRecord(request)
    && request.protocolVersion === PROTOCOL_VERSION
    && request.event === event
    && request.phase === 'on'
    && request.op === op
    && isRecord(request.node)
    && typeof request.node.id === 'string'
    && request.node.id !== ''
    && typeof request.node.cwd === 'string'
    && isRecord(request.runtime);
}

async function guardOneResidentOwner(request) {
  if (!createRequestIsResidentRoot(request)) {
    if (isRecord(request) && request.protocolVersion === PROTOCOL_VERSION && request.event === 'node:create' && request.phase === 'before' && request.op === GROVE_CREATE_OP) return ok();
    return fail('invalid_hook_request', 'expected a protocolVersion 1 node:create request with the Grove resident-owner operation');
  }

  const openResult = await runGrove(['open', '--json'], groveDirectoryResolutionOptions(request.create.cwd));
  if (groveUnavailable(openResult) || openResult.code === 4) return ok();
  if (openResult.error !== undefined || openResult.code !== 0 || openResult.signal !== null) {
    return fail('grove_open_failed', `grove open --json failed: ${executionDetail(openResult)}`);
  }

  let instance;
  try {
    instance = instanceFromOpen(openResult);
  } catch (error) {
    return fail('grove_open_invalid', error instanceof Error ? error.message : String(error));
  }
  if (instance.slot === 0) return ok();

  let instancePath;
  try {
    instancePath = await realpath(instance.path);
  } catch (error) {
    return fail('grove_instance_path_unresolved', `grove open --json returned an instance path that cannot be resolved: ${instance.path}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const rootsResult = await runProcess('crtr', ['--json', 'node', 'inspect', 'list', '--status', 'active,idle']);
  if (rootsResult.error !== undefined || rootsResult.code !== 0 || rootsResult.signal !== null) {
    return fail('crtr_roots_failed', `crtr --json node inspect list --status active,idle failed: ${executionDetail(rootsResult)}`);
  }

  let nodes;
  try {
    const value = parseJson(rootsResult.stdout, 'crtr --json node inspect list --status active,idle');
    if (!isRecord(value) || !Array.isArray(value.nodes)) throw new Error('crtr --json node inspect list --status active,idle returned an invalid node list');
    nodes = value.nodes;
  } catch (error) {
    return fail('crtr_roots_invalid', error instanceof Error ? error.message : String(error));
  }

  let owner;
  for (const node of nodes) {
    if (!isRecord(node)
      || node.parent !== null
      || node.lifecycle !== 'resident'
      || typeof node.node_id !== 'string'
      || node.node_id === request.create.replaces
      || typeof node.cwd !== 'string') continue;
    let rootPath;
    try {
      rootPath = await realpath(node.cwd);
    } catch {
      process.stderr.write(`grove.one-resident-owner: skipping live root ${node.node_id} because its cwd no longer resolves: ${node.cwd}\n`);
      continue;
    }
    if (cwdIsInstancePath(rootPath, instancePath)) {
      owner = node;
      break;
    }
  }
  if (owner === undefined) return ok();
  return fail('resident_owner_exists', `${instance.project}/${instance.name} already has a resident owner: ${owner.node_id} (${typeof owner.name === 'string' ? owner.name : 'unnamed'}). Reopen it with \`crtr surface node focus ${owner.node_id}\`, or finish it with \`grove finish ${instance.project}/${instance.name}\`.`);
}

async function stampGroveOwner(request) {
  if (!lifecycleRequestIsValid(request, 'node:start', GROVE_START_OP)) {
    return fail('invalid_hook_request', 'expected a protocolVersion 1 node:start request with the Grove owner-stamp operation');
  }
  if (request.runtime.isBirth !== true || request.node.lifecycle !== 'resident') return ok();

  const openResult = await runGrove(['open', '--json'], groveDirectoryResolutionOptions(request.node.cwd));
  if (groveUnavailable(openResult) || openResult.code === 4) return ok();
  if (openResult.error !== undefined || openResult.code !== 0 || openResult.signal !== null) {
    return fail('grove_open_failed', `grove open --json failed: ${executionDetail(openResult)}`);
  }

  let instance;
  try {
    instance = instanceFromOpen(openResult);
  } catch (error) {
    return fail('grove_open_invalid', error instanceof Error ? error.message : String(error));
  }
  if (instance.slot === 0) return ok();

  const nodeResult = await runProcess('crtr', ['--json', 'node', 'inspect', 'show', request.node.id]);
  if (nodeResult.error !== undefined || nodeResult.code !== 0 || nodeResult.signal !== null) {
    return fail('crtr_node_failed', `crtr --json node inspect show ${request.node.id} failed: ${executionDetail(nodeResult)}`);
  }

  let node;
  try {
    const value = parseJson(nodeResult.stdout, `crtr --json node inspect show ${request.node.id}`);
    if (!isRecord(value) || !isRecord(value.node)) throw new Error(`crtr --json node inspect show ${request.node.id} returned an invalid node`);
    node = value.node;
  } catch (error) {
    return fail('crtr_node_invalid', error instanceof Error ? error.message : String(error));
  }
  if (node.parent !== null) return ok();

  const labelResult = await runGrove(['label', `${instance.project}/${instance.name}`, `owner=${request.node.id}`]);
  if (groveUnavailable(labelResult)) return ok();
  if (labelResult.error !== undefined || labelResult.code !== 0 || labelResult.signal !== null) {
    return fail('grove_label_failed', `grove label ${instance.project}/${instance.name} owner=${request.node.id} failed: ${executionDetail(labelResult)}`);
  }
  return ok();
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

async function finishOwnedTarget(target, nodeId) {
  const result = await runGrove(['finish', target, '--owner', nodeId, '--json']);
  if (result.error !== undefined || result.signal !== null || (result.code !== 0 && result.code !== 3)) {
    return { target, failure: executionDetail(result) };
  }
  try {
    const output = parseJson(result.stdout, `grove finish ${target} --owner ${nodeId} --json`);
    if (!isRecord(output) || output.instance !== target || typeof output.finished !== 'boolean' || (output.reason !== null && typeof output.reason !== 'string')) {
      throw new Error('returned an invalid finish result');
    }
    if (result.code === 0 && output.finished !== true) throw new Error('exited 0 without a finished result');
    if (result.code === 3 && (output.finished !== false || output.reason === null)) throw new Error('exited 3 without a kept reason');
    return output.finished ? { target, removed: target } : { target, kept: { instance: target, reason: output.reason } };
  } catch (error) {
    return { target, failure: error instanceof Error ? error.message : String(error) };
  }
}

async function cleanupOwnedGroveInstances(request) {
  if (!lifecycleRequestIsValid(request, 'node:close', GROVE_CLOSE_OP)) {
    return fail('invalid_hook_request', 'expected a protocolVersion 1 node:close request with the Grove cleanup operation and node.id');
  }

  const inventoryResult = await runGrove(['list', '--json']);
  if (groveUnavailable(inventoryResult)) return ok();
  if (inventoryResult.error !== undefined || inventoryResult.code !== 0 || inventoryResult.signal !== null) {
    return fail('grove_list_failed', `grove list --json failed: ${executionDetail(inventoryResult)}`);
  }

  let targets;
  try {
    targets = ownedGroveTargets(parseJson(inventoryResult.stdout, 'grove list --json'), request.node.id);
  } catch (error) {
    return fail('grove_inventory_invalid', `grove list --json returned invalid inventory: ${error instanceof Error ? error.message : String(error)}`);
  }

  const results = await Promise.all(targets.map((target) => finishOwnedTarget(target, request.node.id)));
  const failures = results.filter((result) => result.failure !== undefined);
  if (failures.length > 0) return fail('grove_finish_failed', `could not finish Grove instances owned by ${request.node.id}: ${failures.map((result) => `${result.target}: ${result.failure}`).join('; ')}`);
  // The lifecycle envelope allows only { protocolVersion, ok } on success (crtr's
  // exec-lifecycle transport rejects any other key), so which instances were
  // removed or kept is reported to stderr rather than in the envelope.
  const removed = results.flatMap((result) => result.removed === undefined ? [] : [result.removed]);
  const kept = results.flatMap((result) => result.kept === undefined ? [] : [result.kept]);
  process.stderr.write(`grove.cleanup-owned-instances: removed [${removed.join(', ')}]; kept [${kept.map((entry) => `${entry.instance} (${entry.reason})`).join(', ')}]\n`);
  return ok();
}

async function runCommand(request) {
  if (request?.protocolVersion !== PROTOCOL_VERSION) {
    return fail('unsupported_protocol', `unsupported request protocolVersion ${String(request?.protocolVersion)}`, {
      next: `This plugin speaks protocol version ${PROTOCOL_VERSION}. Update crtr or the plugin.`,
    });
  }

  const path = (request.command ?? []).join(' ');
  const handler = LEAVES.get(path);
  if (handler === undefined) {
    return fail('unknown_command', `no such command: ${(request.command ?? []).join(' ') || '(empty)'}`, {
      next: 'Run `crtr human pr review -h` or `crtr sys tutorial dev -h` for this plugin\'s commands.',
    });
  }

  const input = request.input && typeof request.input === 'object' ? request.input : {};
  try {
    return ok(await handler(input));
  } catch (err) {
    if (err instanceof TutorialError || err instanceof PrReviewError) {
      return fail(err.code, err.message, { next: err.next });
    }
    const message = err instanceof Error ? err.message : String(err);
    return fail('command_failed', message, {
      next: 'Retry the command. If it persists, report the failing invocation.',
    });
  }
}

async function runHook(request) {
  if (process.argv[3] !== String(PROTOCOL_VERSION)) return fail('unsupported_protocol', `unsupported hook protocol ${String(process.argv[3])}`);
  switch (request?.event) {
    case 'node:create': return guardOneResidentOwner(request);
    case 'node:start': return stampGroveOwner(request);
    case 'node:close': return cleanupOwnedGroveInstances(request);
    default: return fail('unsupported_hook_event', `no lifecycle handler is registered for ${String(request?.event)}`);
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

  if (process.argv[2] === '--crtr-hook-protocol') return runHook(request);
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
