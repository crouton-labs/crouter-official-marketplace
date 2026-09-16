// launch.mjs — `crtr dev pr review`: open the review surface beside a
// companion node.
//
// One tmux window: the diff review surface on the left, a viewer on the
// companion node on the right. The companion is a resident root created
// through the public `crtr` CLI with the brief (framing + diff) as its first
// message; comments the reviewer writes reach it as inbox messages from the
// surface itself (see main.mjs, --companion).

import { execFileSync, spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildBrief } from './companion.mjs';
import { GitError, branchCommits, collectDiff, rawDiff, resolveRange } from './git.mjs';
import { loadComments, storePath } from './store.mjs';

export class PrReviewError extends Error {
  constructor(code, message, next) {
    super(message);
    this.code = code;
    this.next = next;
  }
}

const HERE = dirname(fileURLToPath(import.meta.url));
const SURFACE = join(HERE, 'main.mjs');
const REVIEW_PANE_PERCENT = 58;

function sh(arg) {
  return `'${String(arg).replaceAll("'", `'\\''`)}'`;
}

function tmux(args) {
  const r = spawnSync('tmux', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error) throw new PrReviewError('no_tmux', `tmux could not be run: ${r.error.message}`, 'Install tmux and run this from a shell inside a tmux session.');
  if (r.status !== 0) throw new PrReviewError('tmux_failed', `tmux ${args[0]} failed: ${(r.stderr || '').trim()}`, 'Run this from a shell inside a tmux session.');
  return r.stdout.trim();
}

function createCompanion({ range, brief }) {
  const args = ['--json', 'node', 'new', '--root', '--kind', 'general', '--cwd', range.top, '--name', `PR review: ${range.branch}`];
  let stdout;
  try {
    stdout = execFileSync('crtr', args, { input: brief, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (error) {
    const detail = (error.stderr ?? '').toString().trim().split('\n').pop() || error.message;
    throw new PrReviewError('companion_failed', `crtr node new failed: ${detail}`, 'Check that crtrd is running (`crtr sys doctor`), then retry.');
  }
  let parsed;
  try { parsed = JSON.parse(stdout); } catch { throw new PrReviewError('companion_failed', 'crtr node new did not return JSON', 'Retry; if it persists, report the failing invocation.'); }
  if (typeof parsed.node_id !== 'string' || parsed.node_id === '') throw new PrReviewError('companion_failed', 'crtr node new returned no node id', 'Retry; if it persists, report the failing invocation.');
  return { nodeId: parsed.node_id, window: typeof parsed.window === 'string' && parsed.window !== '' ? parsed.window : null };
}

/** Put the review surface on the left of the companion's viewer. `crtr node
 *  new --root` opens that viewer in its own tmux window and reports the
 *  window id, so the surface splits into it; when no window was reported the
 *  launcher opens one itself and attaches a viewer on the right. */
function openWindow({ range, nodeId, window }) {
  const surfaceCmd = [process.execPath, SURFACE, range.branch, '--base', range.base, '-C', range.top, '--companion', nodeId].map(sh).join(' ');
  const title = `review ${range.branch}`;
  if (window !== null) {
    const pane = tmux(['split-window', '-h', '-b', '-t', window, '-l', `${REVIEW_PANE_PERCENT}%`, '-c', range.top, '-P', '-F', '#{pane_id}', surfaceCmd]);
    tmux(['rename-window', '-t', window, title]);
    tmux(['select-window', '-t', window]);
    tmux(['select-pane', '-t', pane]);
    return window;
  }
  const viewerCmd = ['crtr', 'surface', 'attach', 'to', nodeId].map(sh).join(' ');
  const pane = tmux(['new-window', '-c', range.top, '-n', title, '-P', '-F', '#{pane_id}', surfaceCmd]);
  tmux(['split-window', '-h', '-d', '-t', pane, '-l', `${100 - REVIEW_PANE_PERCENT}%`, '-c', range.top, viewerCmd]);
  tmux(['select-pane', '-t', pane]);
  return tmux(['display', '-p', '-t', pane, '#{window_id}']);
}

export function launchReview(input, cwd) {
  if (!process.env.TMUX) {
    throw new PrReviewError('no_tmux', 'pr review opens a tmux window, and this shell is not inside tmux', 'Start or attach a tmux session, then run the command again from inside it.');
  }

  let range;
  let files;
  let commits;
  let raw;
  try {
    range = resolveRange({ cwd, base: input.base ?? null, branch: input.branch ?? null });
    raw = rawDiff(range, range.top);
    files = collectDiff(range, range.top);
    commits = branchCommits(range, range.top);
  } catch (error) {
    if (error instanceof GitError) throw new PrReviewError('git_failed', error.message, 'Run this inside the repository, with both refs present locally (fetch first if the base is a remote branch).');
    throw error;
  }
  if (files.length === 0) {
    throw new PrReviewError('no_changes', `${range.branch} has no changes against ${range.base}`, 'Pick a branch with commits the base does not have, or a different --base.');
  }

  const store = storePath(range);
  const { comments } = loadComments(store, files);
  const brief = buildBrief({ range, files, commits, comments, raw });
  const { nodeId, window } = createCompanion({ range, brief });
  const opened = openWindow({ range, nodeId, window });

  return {
    node_id: nodeId,
    window: opened,
    branch: range.branch,
    base: range.base,
    files: files.length,
    commits: commits.length,
    brief_chars: brief.length,
    comments_store: store,
    guidance: `The review window is open: the diff on the left, the companion node ${nodeId} on the right. Comments written in the review reach the companion as they are saved; press ? in the review for keys.`,
  };
}

// Run directly (`node launch.mjs [branch] [--base ref]`) to open the review
// window without going through crtr's command tree — the same launch, printed
// as JSON.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const input = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--base') input.base = argv[++i];
    else if (argv[i].startsWith('--base=')) input.base = argv[i].slice('--base='.length);
    else input.branch = argv[i];
  }
  try {
    process.stdout.write(`${JSON.stringify(launchReview(input, process.cwd()), null, 2)}\n`);
  } catch (error) {
    if (!(error instanceof PrReviewError)) throw error;
    process.stderr.write(`pr review: ${error.message}\n${error.next}\n`);
    process.exitCode = 1;
  }
}
