import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';
import { spawn } from 'node:child_process';

const GITHUB_URL = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/(?:pull|issues)\/\d+(?:[/?#]|$)/;
const MAX_FILE_BYTES = 1024 * 1024;
const SIGNED_IN_LOGIN = 'const deadline = Date.now() + 15000; let login = null; while (Date.now() < deadline) { login = document.querySelector("meta[name=user-login]")?.content ?? null; if (login) break; await new Promise(resolve => setTimeout(resolve, 250)); } return login;'

export class PluginError extends Error {
  constructor(code, message, { field, next } = {}) {
    super(message);
    this.code = code;
    this.field = field;
    this.next = next;
  }
}

export async function attachAsset(input) {
  const file = requireString(input.file, 'file');
  const number = requirePositiveInteger(input.pr, 'pr');
  const source = await readUploadSource(file);
  const repo = await resolveRepo(input.repo);
  const target = await resolveTarget(repo, number);
  const uploadPage = target.kind === 'issue' ? await resolveIssueUploadPage(repo, target.url) : target.url;
  const browser = await findSignedInBrowser();

  const targetTab = await captureJson(['tab', 'open', uploadPage, '--new', '--port', String(browser.port)], 20_000);
  const openedTarget = targetTab?.attrs?.target;
  if (typeof openedTarget !== 'string' || openedTarget.length < 4) {
    throw new PluginError('target_open_failed', 'Capture did not return a target tab after opening the GitHub page', {
      next: `Open ${uploadPage} in the signed-in browser, then retry.`,
    });
  }

  await delay(3_000);
  const uploaded = await uploadInPage(openedTarget.slice(0, 8), source);
  if (typeof uploaded?.href !== 'string' || !uploaded.href.startsWith('https://github.com/user-attachments/assets/')) {
    const detail = typeof uploaded?.error === 'string' ? `: ${uploaded.error}` : '';
    throw new PluginError('upload_failed', `GitHub did not return an attachment URL${detail}`, {
      next: `Open ${uploadPage} in the signed-in browser and verify its comment editor is available, then retry.`,
    });
  }

  return { url: uploaded.href, target: target.url, browser: `CDP port ${browser.port}` };
}

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new PluginError('invalid_input', `${field} is required`, { field });
  }
  return value;
}

function requirePositiveInteger(value, field) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new PluginError('invalid_input', `${field} must be a positive integer`, { field });
  }
  return value;
}

async function resolveRepo(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    if (!/^[\w.-]+\/[\w.-]+$/.test(value)) {
      throw new PluginError('invalid_input', 'repo must be owner/name', { field: 'repo' });
    }
    return value;
  }
  return runGh(['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner'], 'repo');
}

async function resolveTarget(repo, number) {
  const pr = await tryGh(['pr', 'view', String(number), '--repo', repo, '--json', 'url', '--jq', '.url']);
  if (pr.ok && GITHUB_URL.test(pr.stdout)) return { kind: 'pull_request', url: pr.stdout };

  const issue = await tryGh(['issue', 'view', String(number), '--repo', repo, '--json', 'url', '--jq', '.url']);
  if (issue.ok && GITHUB_URL.test(issue.stdout)) return { kind: 'issue', url: issue.stdout };

  throw new PluginError('target_not_found', `no pull request or issue #${number} was found in ${repo}`, {
    field: 'pr',
    next: 'Pass an existing pull request or issue number and the correct --repo owner/name.',
  });
}

async function resolveIssueUploadPage(repo, issueUrl) {
  const pullRequest = await tryGh(['pr', 'list', '--repo', repo, '--state', 'open', '--limit', '1', '--json', 'url', '--jq', '.[0].url']);
  if (pullRequest.ok && GITHUB_URL.test(pullRequest.stdout)) return pullRequest.stdout;
  throw new PluginError('issue_upload_page_not_found', `no open pull request in ${repo} can provide GitHub's attachment form for ${issueUrl}`, {
    next: 'Use a pull request number, or open a pull request in this repository before attaching to an issue.',
  });
}

async function runGh(args, field) {
  const result = await tryGh(args);
  if (result.ok && result.stdout !== '') return result.stdout;
  throw new PluginError('github_cli_failed', `gh ${args.slice(0, 2).join(' ')} failed${result.stderr ? `: ${result.stderr}` : ''}`, {
    field,
    next: 'Check that gh is installed, authenticated, and can access this repository.',
  });
}

async function tryGh(args) {
  const result = await runProcess('gh', args, { timeoutMs: 20_000 });
  return { ...result, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

async function readUploadSource(file) {
  let info;
  try {
    info = await stat(file);
  } catch {
    throw new PluginError('file_not_found', `file does not exist: ${file}`, { field: 'file' });
  }
  if (!info.isFile()) {
    throw new PluginError('invalid_input', `file is not a regular file: ${file}`, { field: 'file' });
  }
  if (info.size === 0) {
    throw new PluginError('invalid_input', `file is empty: ${file}`, { field: 'file' });
  }
  if (info.size > MAX_FILE_BYTES) {
    throw new PluginError('file_too_large', `file is larger than the 1 MiB upload limit: ${file}`, {
      field: 'file',
      next: 'Trim or compress the file to 1 MiB or less before uploading it.',
    });
  }
  return {
    name: basename(file),
    type: contentType(file),
    base64: (await readFile(file)).toString('base64'),
  };
}

function contentType(file) {
  const extension = extname(file).toLowerCase();
  return {
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.webm': 'video/webm',
    '.webp': 'image/webp',
  }[extension] ?? 'application/octet-stream';
}

async function findSignedInBrowser() {
  const tabs = await captureJson(['tab', 'list'], 20_000);
  const firstTabByPort = new Map();
  for (const candidate of parseGitHubTabs(tabs)) {
    if (!firstTabByPort.has(candidate.port)) firstTabByPort.set(candidate.port, candidate);
  }
  if (firstTabByPort.size === 0) {
    throw new PluginError('github_login_not_found', 'no existing GitHub tab was found on a discovered CDP endpoint', {
      next: 'Open github.com in the browser where you are signed in, then retry. The plugin checks existing GitHub tabs across discovered CDP endpoints and never launches a browser.',
    });
  }

  const candidates = [...firstTabByPort.values()].sort((left, right) => Number(right.preferred) - Number(left.preferred));
  for (const { port } of candidates) {
    try {
      const tab = await captureJson(['tab', 'open', 'https://github.com/', '--new', '--port', String(port)], 20_000);
      const target = tab?.attrs?.target;
      if (typeof target !== 'string' || target.length < 4) continue;
      await delay(3_000);
      const login = await pageResult(target.slice(0, 8), SIGNED_IN_LOGIN, 20_000);
      if (typeof login === 'string' && login !== '') return { port, target, url: 'https://github.com/' };
    } catch {
      // The next endpoint may be the browser with the usable GitHub session.
    }
  }

  throw new PluginError('github_login_not_found', 'no responsive GitHub tab had a signed-in user', {
    next: 'Open github.com in the browser where you are signed in, then retry. The plugin checks existing GitHub tabs across discovered CDP endpoints and never launches a browser.',
  });
}

function parseGitHubTabs(list) {
  const candidates = [];
  for (const section of list?.sections ?? []) {
    const portMatch = /^port (\d+) —/.exec(section);
    if (portMatch === null) continue;
    const port = Number(portMatch[1]);
    for (const line of section.split('\n').slice(1)) {
      const match = /^\s+([A-F0-9]{8})\s+".*"\s+(https:\/\/github\.com\/\S+)$/i.exec(line);
      if (match !== null) candidates.push({ port, target: match[1], url: match[2], preferred: section.includes('[preferred]') });
    }
  }
  return candidates;
}

async function uploadInPage(target, source) {
  const directory = await mkdtemp(join(tmpdir(), 'github-asset-'));
  const scriptPath = join(directory, 'upload.mjs');
  try {
    await writeFile(scriptPath, uploadScript(source));
    return await pageResult(target, undefined, 60_000, scriptPath);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function pageResult(target, code, timeoutMs, scriptPath) {
  const args = ['page', 'exec'];
  if (scriptPath === undefined) args.push(code);
  else args.push('--file', scriptPath);
  args.push('--target', target, '--timeout', String(timeoutMs), '--settle', '0');
  const response = await captureJson(args, timeoutMs + 5_000);
  const result = response?.sections?.find(section => section.startsWith('result: '));
  if (typeof result !== 'string') {
    throw new PluginError('capture_failed', 'Capture did not return the page script result', {
      next: 'Check that the selected GitHub tab is still open and responsive, then retry.',
    });
  }
  try {
    return JSON.parse(result.slice('result: '.length));
  } catch {
    throw new PluginError('capture_failed', 'Capture returned an unreadable page script result', {
      next: 'Check that the selected GitHub tab is still open and responsive, then retry.',
    });
  }
}

async function captureJson(args, timeoutMs) {
  const result = await runProcess('capture', [...args, '--json'], { timeoutMs });
  if (!result.ok) {
    throw new PluginError('capture_failed', `Capture failed${result.stderr ? `: ${result.stderr.trim()}` : ''}`, {
      next: 'Install the Capture CLI (`crtr capture`), then confirm a CDP-enabled browser is already running.',
    });
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new PluginError('capture_failed', 'Capture did not return JSON output', {
      next: 'Run `crtr capture tab list` to verify the Capture CLI is available.',
    });
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runProcess(command, args, { timeoutMs }) {
  return new Promise(resolve => {
    let settled = false;
    let stdout = '';
    let stderr = '';
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const finish = result => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, ...result });
    };
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      finish({ ok: false, timedOut: true });
    }, timeoutMs);
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', error => finish({ ok: false, stderr: `${stderr}${error.message}` }));
    child.on('close', code => finish({ ok: code === 0, code }));
  });
}

function uploadScript({ name, type, base64 }) {
  return `
const NAME = ${JSON.stringify(name)};
const TYPE = ${JSON.stringify(type)};
const B64 = ${JSON.stringify(base64)};
const bytes = Uint8Array.from(atob(B64), character => character.charCodeAt(0));
const file = new File([bytes], NAME, { type: TYPE });
const attachmentDeadline = Date.now() + 5000;
let attachment = null;
while (Date.now() < attachmentDeadline) {
  attachment = [...document.querySelectorAll('file-attachment')].find(element => element.getClientRects().length > 0) || null;
  if (attachment) break;
  await new Promise(resolve => setTimeout(resolve, 250));
}
if (!attachment) return { error: 'no visible file-attachment element' };
const csrf = attachment.querySelector('input.js-data-upload-policy-url-csrf')?.value;
const repositoryId = attachment.getAttribute('data-upload-repository-id');
const policyUrl = attachment.getAttribute('data-upload-policy-url');
if (!csrf || !repositoryId || !policyUrl) return { error: 'the file attachment element lacks GitHub upload policy data' };
const policyForm = new FormData();
policyForm.append('name', file.name);
policyForm.append('size', String(file.size));
policyForm.append('content_type', file.type);
policyForm.append('authenticity_token', csrf);
policyForm.append('repository_id', repositoryId);
const policyResponse = await fetch(policyUrl, { method: 'POST', body: policyForm, credentials: 'include', headers: { Accept: 'application/json' } });
if (!policyResponse.ok) return { error: 'upload policy request failed: ' + policyResponse.status };
const policy = await policyResponse.json();
const uploadForm = new FormData();
for (const [key, value] of Object.entries(policy.form || {})) uploadForm.append(key, value);
uploadForm.append('file', file);
const storageResponse = await fetch(policy.upload_url, { method: 'POST', body: uploadForm, headers: policy.header || {} });
if (![200, 201, 204].includes(storageResponse.status)) return { error: 'storage upload failed: ' + storageResponse.status };
const finalizeForm = new FormData();
finalizeForm.append('authenticity_token', policy.asset_upload_authenticity_token);
const finalizeResponse = await fetch(policy.asset_upload_url, { method: 'PUT', body: finalizeForm, credentials: 'include', headers: { Accept: 'application/json' } });
if (!finalizeResponse.ok) return { error: 'attachment finalization failed: ' + finalizeResponse.status };
const finalized = await finalizeResponse.json();
return { href: finalized.href || policy.asset?.href || null };
`;
}
