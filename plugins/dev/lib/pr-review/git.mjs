// git.mjs — the branch diff a PR review is over.
//
// Everything here is plain `git`. The diff is `base...branch` (the branch's
// changes since its merge-base with the base), which is exactly the set a pull
// request page shows. Rename detection, binary handling, and any `-diff`
// attribute in .gitattributes are left to git, so what appears here is what
// `git diff` itself would show.

import { spawnSync } from 'node:child_process';

export class GitError extends Error {}

function git(args, cwd) {
  const result = spawnSync('git', ['-c', 'core.quotePath=false', ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, GIT_PAGER: 'cat', PAGER: 'cat' },
    maxBuffer: 512 * 1024 * 1024,
  });
  if (result.error) throw new GitError(`git ${args[0]}: ${result.error.message}`);
  if (result.status !== 0) throw new GitError((result.stderr || `git ${args.join(' ')} exited ${result.status}`).trim());
  return result.stdout;
}

/** Repository facts the review needs: the top level, the git dir (for the
 *  comment store), and the checked-out branch. */
export function repoInfo(cwd) {
  const top = git(['rev-parse', '--show-toplevel'], cwd).trim();
  const gitDir = git(['rev-parse', '--absolute-git-dir'], cwd).trim();
  const head = git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd).trim();
  return { top, gitDir, head: head === 'HEAD' ? null : head };
}

function refExists(ref, cwd) {
  const r = spawnSync('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], { cwd, encoding: 'utf8' });
  return r.status === 0;
}

/** The base a PR would target when none is given: origin's HEAD branch, else
 *  `main`, else `master`. */
export function defaultBase(cwd) {
  const r = spawnSync('git', ['symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD'], { cwd, encoding: 'utf8' });
  if (r.status === 0) {
    const remote = r.stdout.trim(); // origin/main
    const local = remote.replace(/^origin\//, '');
    if (refExists(local, cwd)) return local;
    return remote;
  }
  for (const candidate of ['main', 'master']) if (refExists(candidate, cwd)) return candidate;
  throw new GitError('no base branch found — pass --base <ref>');
}

export function resolveRange({ cwd, base, branch }) {
  const info = repoInfo(cwd);
  const resolvedBranch = branch ?? info.head;
  if (resolvedBranch === null) throw new GitError('HEAD is detached — pass a branch to review');
  const resolvedBase = base ?? defaultBase(cwd);
  if (!refExists(resolvedBranch, cwd)) throw new GitError(`branch not found: ${resolvedBranch}`);
  if (!refExists(resolvedBase, cwd)) throw new GitError(`base not found: ${resolvedBase}`);
  const mergeBase = git(['merge-base', resolvedBase, resolvedBranch], cwd).trim();
  const commitCount = Number(git(['rev-list', '--count', `${resolvedBase}..${resolvedBranch}`], cwd).trim());
  return { ...info, base: resolvedBase, branch: resolvedBranch, mergeBase, commitCount };
}

/** Commit subjects on the branch, oldest first — the PR's commit list. */
export function branchCommits(range, cwd) {
  const out = git(['log', '--reverse', '--format=%h%x00%s', `${range.base}..${range.branch}`], cwd);
  return out.split('\n').filter(Boolean).map((line) => {
    const [sha, subject] = line.split('\0');
    return { sha, subject };
  });
}

// ── Unified diff parsing ─────────────────────────────────────────────────────

/**
 * @typedef {{ kind: ' '|'+'|'-'|'\\', text: string, oldNo: number|null, newNo: number|null }} DiffLine
 * @typedef {{ header: string, oldStart: number, oldCount: number, newStart: number, newCount: number, lines: DiffLine[] }} Hunk
 * @typedef {{ path: string, oldPath: string|null, status: 'A'|'M'|'D'|'R'|'C'|'T', binary: boolean, hunks: Hunk[], additions: number, deletions: number, note: string|null }} DiffFile
 */

const HUNK_RE = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@ ?(.*)$/;

function unquotePath(raw) {
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try { return JSON.parse(raw); } catch { return raw.slice(1, -1); }
  }
  return raw;
}

/** Parse `git diff` output into files → hunks → lines. */
export function parseUnifiedDiff(text) {
  const files = [];
  let file = null;
  let hunk = null;
  let oldNo = 0;
  let newNo = 0;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('diff --git ')) {
      // `diff --git a/x b/x` — paths are re-read from ---/+++ or rename lines.
      file = { path: null, oldPath: null, status: 'M', binary: false, hunks: [], additions: 0, deletions: 0, note: null };
      const m = /^diff --git a\/(.*) b\/(.*)$/.exec(line);
      if (m) { file.oldPath = unquotePath(m[1]); file.path = unquotePath(m[2]); }
      files.push(file);
      hunk = null;
      continue;
    }
    if (file === null) continue;
    if (hunk === null || !(line.startsWith(' ') || line.startsWith('+') || line.startsWith('-') || line.startsWith('\\'))) {
      if (line.startsWith('new file mode')) { file.status = 'A'; continue; }
      if (line.startsWith('deleted file mode')) { file.status = 'D'; continue; }
      if (line.startsWith('rename from ')) { file.oldPath = unquotePath(line.slice('rename from '.length)); file.status = 'R'; continue; }
      if (line.startsWith('rename to ')) { file.path = unquotePath(line.slice('rename to '.length)); continue; }
      if (line.startsWith('copy from ')) { file.oldPath = unquotePath(line.slice('copy from '.length)); file.status = 'C'; continue; }
      if (line.startsWith('copy to ')) { file.path = unquotePath(line.slice('copy to '.length)); continue; }
      if (line.startsWith('old mode') || line.startsWith('new mode')) { if (file.status === 'M') file.status = 'T'; continue; }
      if (line.startsWith('Binary files')) { file.binary = true; file.note = 'binary file'; continue; }
      if (line.startsWith('--- ')) { const p = line.slice(4); if (p !== '/dev/null') file.oldPath = unquotePath(p.replace(/^a\//, '')); continue; }
      if (line.startsWith('+++ ')) { const p = line.slice(4); if (p !== '/dev/null') file.path = unquotePath(p.replace(/^b\//, '')); continue; }
      const h = HUNK_RE.exec(line);
      if (h) {
        hunk = {
          header: h[5] ?? '',
          oldStart: Number(h[1]), oldCount: h[2] === undefined ? 1 : Number(h[2]),
          newStart: Number(h[3]), newCount: h[4] === undefined ? 1 : Number(h[4]),
          lines: [],
        };
        oldNo = hunk.oldStart;
        newNo = hunk.newStart;
        file.hunks.push(hunk);
        continue;
      }
      continue;
    }
    // Inside a hunk.
    const kind = line[0];
    const body = line.slice(1);
    if (kind === ' ') { hunk.lines.push({ kind, text: body, oldNo, newNo }); oldNo++; newNo++; }
    else if (kind === '-') { hunk.lines.push({ kind, text: body, oldNo, newNo: null }); oldNo++; file.deletions++; }
    else if (kind === '+') { hunk.lines.push({ kind, text: body, oldNo: null, newNo }); newNo++; file.additions++; }
    else if (kind === '\\') { hunk.lines.push({ kind, text: body.trim(), oldNo: null, newNo: null }); }
  }
  for (const f of files) {
    if (f.path === null) f.path = f.oldPath ?? '(unknown)';
    if (f.status === 'D') f.path = f.oldPath ?? f.path;
    if (f.status !== 'R' && f.status !== 'C') f.oldPath = null;
    if (!f.binary && f.hunks.length === 0 && f.status === 'M') f.note = 'no textual change';
    if (f.status === 'T' && f.hunks.length === 0) f.note = 'mode change only';
    if (f.status === 'R' && f.hunks.length === 0) f.note = 'renamed, no content change';
  }
  return files;
}

/** Collect the PR diff: `base...branch`, honoring the repository's diff
 *  configuration (attributes, algorithm, rename detection). */
export function collectDiff(range, cwd) {
  const out = git([
    'diff', '--no-color', '--no-ext-diff', '--find-renames', '--src-prefix=a/', '--dst-prefix=b/',
    `${range.base}...${range.branch}`,
  ], cwd);
  return parseUnifiedDiff(out);
}
