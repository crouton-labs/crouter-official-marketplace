#!/usr/bin/env node
// Exec-transport entrypoint for the `search` plugin.
//
// crtr spawns this with `--crtr-command-protocol 1`, writes exactly one JSON
// request to stdin, and reads exactly one JSON envelope from stdout. Diagnostics
// go to stderr — anything else on stdout is a protocol violation.

import { findLeaf } from '../lib/commands.mjs';
import { PluginError } from '../lib/exa.mjs';

const PROTOCOL_VERSION = 1;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function emit(envelope) {
  process.stdout.write(`${JSON.stringify(envelope)}\n`);
}

function ok(result) {
  emit({ protocolVersion: PROTOCOL_VERSION, ok: true, result });
  process.exit(0);
}

function fail(code, message, { field, next } = {}) {
  emit({
    protocolVersion: PROTOCOL_VERSION,
    ok: false,
    error: {
      code,
      message,
      ...(field !== undefined ? { field } : {}),
      ...(next !== undefined ? { next } : {}),
    },
  });
  process.exit(1);
}

async function main() {
  const raw = await readStdin();

  let request;
  try {
    request = JSON.parse(raw);
  } catch {
    fail('malformed_request', 'stdin did not carry a single JSON request object', {
      next: 'Invoke this executable through crtr, which writes the protocol request.',
    });
    return;
  }

  if (request?.protocolVersion !== PROTOCOL_VERSION) {
    fail('unsupported_protocol', `unsupported request protocolVersion ${String(request?.protocolVersion)}`, {
      next: `This plugin speaks protocol version ${PROTOCOL_VERSION}. Update crtr or the plugin.`,
    });
    return;
  }

  const leaf = findLeaf(request.command);
  if (leaf === null) {
    fail('unknown_command', `no such command: ${(request.command ?? []).join(' ') || '(empty)'}`, {
      next: 'Run `crtr search -h` to list this plugin\'s commands.',
    });
    return;
  }

  const input = request.input && typeof request.input === 'object' ? request.input : {};
  try {
    ok(await leaf.run(input));
  } catch (err) {
    if (err instanceof PluginError) {
      fail(err.code, err.message, { field: err.field, next: err.next });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    fail('command_failed', message, {
      next: 'Retry the command. If it persists, report the failing invocation.',
    });
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`${message}\n`);
  fail('command_failed', 'the search plugin crashed before producing a result', {
    next: 'Check stderr for the stack trace and report it.',
  });
});
