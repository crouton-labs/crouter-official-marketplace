#!/usr/bin/env node
import { findLeaf } from '../lib/commands.mjs';
import { PluginError } from '../lib/attach.mjs';

const PROTOCOL_VERSION = 1;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function fail(code, message, { field, next } = {}) {
  return {
    protocolVersion: PROTOCOL_VERSION,
    ok: false,
    error: {
      code,
      message,
      ...(field === undefined ? {} : { field }),
      ...(next === undefined ? {} : { next }),
    },
  };
}

async function run() {
  let request;
  try {
    request = JSON.parse(await readStdin());
  } catch {
    return fail('malformed_request', 'stdin did not carry a single JSON request object', {
      next: 'Invoke this executable through crtr.',
    });
  }

  if (request?.protocolVersion !== PROTOCOL_VERSION) {
    return fail('unsupported_protocol', `unsupported request protocolVersion ${String(request?.protocolVersion)}`, {
      next: `This plugin speaks protocol version ${PROTOCOL_VERSION}. Update crtr or the plugin.`,
    });
  }

  const leaf = findLeaf(request.command);
  if (leaf === null) {
    return fail('unknown_command', `no such command: ${(request.command ?? []).join(' ') || '(empty)'}`, {
      next: 'Run `crtr github-asset -h` to list this plugin’s commands.',
    });
  }

  try {
    const input = request.input && typeof request.input === 'object' ? request.input : {};
    return { protocolVersion: PROTOCOL_VERSION, ok: true, result: await leaf.run(input) };
  } catch (error) {
    if (error instanceof PluginError) return fail(error.code, error.message, error);
    const message = error instanceof Error ? error.message : String(error);
    return fail('command_failed', message, {
      next: 'Retry the command. If it persists, inspect the Capture CLI output and report the invocation.',
    });
  }
}

const envelope = await run().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  return fail('command_failed', 'the github-asset plugin crashed before producing a result', {
    next: 'Check stderr for the stack trace and report it.',
  });
});

process.stdout.write(`${JSON.stringify(envelope)}\n`);
process.exitCode = envelope.ok ? 0 : 1;
