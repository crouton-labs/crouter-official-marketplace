#!/usr/bin/env node
// Exec-transport entrypoint for the `dev` plugin's native leaves.
//
// crtr spawns this with `--crtr-command-protocol 1`, writes exactly one JSON
// request to stdin, and reads exactly one JSON envelope from stdout.
// Diagnostics go to stderr — anything else on stdout is a protocol violation.
//
// Every path returns an envelope rather than exiting: stdout is a pipe, so its
// write is asynchronous, and a `process.exit()` behind it would truncate a
// large result into a protocol error. The one writer below emits the envelope,
// sets `process.exitCode`, and lets Node exit once stdout has drained.
//
// This is separate from `bin/dev`, the bare-binary shell dispatcher. That one
// is a contributed binary on the broker's PATH; this one speaks the crtr
// command protocol and is never invoked by a human.

import { runTrack, scenarioList, scenarioStart, scenarioClean, TutorialError } from '../lib/tutorial/run.mjs';

const PROTOCOL_VERSION = 1;

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

async function run() {
  const raw = await readStdin();

  let request;
  try {
    request = JSON.parse(raw);
  } catch {
    return fail('malformed_request', 'stdin did not carry a single JSON request object', {
      next: 'Invoke this executable through crtr, which writes the protocol request.',
    });
  }

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

const envelope = await run().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
  return fail('command_failed', 'the dev plugin crashed before producing a result', {
    next: 'Check stderr for the stack trace and report it.',
  });
});

process.stdout.write(`${JSON.stringify(envelope)}\n`);
process.exitCode = envelope.ok ? 0 : 1;
