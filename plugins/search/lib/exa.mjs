// The only module that talks to api.exa.ai. Owns credential resolution, the
// three endpoint calls (/search, /answer, /contents), request shaping, and
// translation of HTTP/transport failures into typed plugin errors. Leaves never
// build HTTP requests directly. Node built-ins and global fetch only — this
// plugin has no dependencies and no build step.

import { homedir } from 'node:os';
import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

const EXA_BASE = 'https://api.exa.ai';

/** Cap (characters) applied to full-text extraction so a single call cannot
 *  blow up the caller's context. Highlights remain the default content mode. */
export const TEXT_MAX_CHARACTERS = 4000;

/** A recoverable failure the executable reports as a protocol error envelope:
 *  `{ ok: false, error: { code, message, field?, next } }`. `code` is lowercase
 *  snake_case and never one of crtr's reserved codes. */
export class PluginError extends Error {
  constructor(code, message, { field, next } = {}) {
    super(message);
    this.code = code;
    this.field = field;
    this.next = next;
  }
}

/** Absolute path of the local key file, second in the resolution order. */
export function keyFilePath() {
  return join(homedir(), '.crouter', 'exa.key');
}

/** Resolve the Exa API key: EXA_API_KEY first, then ~/.crouter/exa.key. Never
 *  prompts and never proceeds keyless — throws a typed error naming both
 *  options when neither holds a non-empty value. */
export function resolveApiKey() {
  const env = process.env['EXA_API_KEY'];
  if (typeof env === 'string' && env.trim() !== '') return env.trim();

  const keyFile = keyFilePath();
  if (existsSync(keyFile)) {
    const fromFile = readFileSync(keyFile, 'utf8').trim();
    if (fromFile !== '') return fromFile;
  }

  throw new PluginError('missing_credential', 'no Exa API key found', {
    next: `Set the EXA_API_KEY environment variable, or write the key to ${keyFile}.`,
  });
}

/** POST a JSON body to an Exa endpoint and return the parsed JSON. The key is
 *  resolved before the request is built, so a keyless invocation never reaches
 *  the network. Any non-2xx response or transport failure becomes a typed
 *  plugin error carrying Exa's status and a concrete next action. */
async function exaPost(endpoint, body) {
  const apiKey = resolveApiKey();

  let res;
  try {
    res = await fetch(`${EXA_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new PluginError('exa_unreachable', `Exa request failed: ${detail}`, {
      next: 'Check network connectivity and retry. If it persists, simplify the query or reduce --num.',
    });
  }

  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 500);
    } catch {
      /* body unreadable — the status line is enough */
    }
    const message = `Exa returned ${res.status} ${res.statusText}${detail ? `: ${detail}` : ''}`;
    if (res.status === 401 || res.status === 403) {
      throw new PluginError('credential_rejected', message, {
        next: `Exa rejected the API key. Verify EXA_API_KEY or ${keyFilePath()}.`,
      });
    }
    throw new PluginError('exa_request_failed', message, {
      next: 'Retry; if it persists, simplify the query, reduce --num, or drop domain filters.',
    });
  }

  try {
    return await res.json();
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new PluginError('exa_request_failed', `Exa returned a non-JSON body: ${detail}`, {
      next: 'Retry the request. If it persists, report the failing query.',
    });
  }
}

export function exaSearch(body) {
  return exaPost('/search', body);
}

export function exaAnswer(body) {
  return exaPost('/answer', body);
}

export function exaContents(body) {
  return exaPost('/contents', body);
}

/** Split a URL token on commas or whitespace into a clean list. */
export function parseUrls(raw) {
  return String(raw)
    .split(/[\s,]+/)
    .map((u) => u.trim())
    .filter((u) => u !== '');
}

/** Split a comma-separated domain flag into a clean list, or undefined when it
 *  holds no non-empty entry — an empty array must never reach Exa. */
export function parseDomains(raw) {
  if (raw === undefined || raw === null) return undefined;
  const list = String(raw)
    .split(',')
    .map((d) => d.trim())
    .filter((d) => d !== '');
  return list.length > 0 ? list : undefined;
}

/** Project one Exa row onto exactly the contract's result fields, keeping only
 *  those the API actually supplied. Exa's extra row keys (score, id, image, …)
 *  are dropped so the structured output stays the declared shape. */
export function projectResult(row) {
  const out = {};
  if (!row || typeof row !== 'object') return out;
  for (const key of ['title', 'url', 'publishedDate', 'author']) {
    if (typeof row[key] === 'string' && row[key] !== '') out[key] = row[key];
  }
  if (Array.isArray(row.highlights) && row.highlights.length > 0) out.highlights = row.highlights;
  if (typeof row.text === 'string' && row.text !== '') out.text = row.text;
  return out;
}

/** Project one Exa citation onto the contract's citation fields. */
export function projectCitation(row) {
  const out = {};
  if (!row || typeof row !== 'object') return out;
  for (const key of ['title', 'url']) {
    if (typeof row[key] === 'string' && row[key] !== '') out[key] = row[key];
  }
  return out;
}
