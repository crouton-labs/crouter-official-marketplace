// store.mjs — where a review's comments live between sessions.
//
// One JSON file per base...branch pair under the repository's git dir, so
// quitting and reopening resumes the review, and the launcher can hand a
// companion node the comments already written.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export function storePath(range) {
  const slug = `${range.base}...${range.branch}`.replaceAll('/', '__');
  return join(range.gitDir, 'crtr', 'pr-review', `${slug}.json`);
}

/** Saved comments that still anchor to the current diff; the rest are counted. */
export function loadComments(path, files) {
  let raw;
  try { raw = JSON.parse(readFileSync(path, 'utf8')); } catch { return { comments: [], dropped: 0 }; }
  const known = new Map(files.map((f) => [f.path, f]));
  const comments = [];
  let dropped = 0;
  for (const c of Array.isArray(raw.comments) ? raw.comments : []) {
    const file = known.get(c.path);
    const ok = file !== undefined && (c.hunk === null || (file.hunks[c.hunk] !== undefined && c.lineTo < file.hunks[c.hunk].lines.length));
    if (ok) comments.push(c); else dropped++;
  }
  return { comments, dropped };
}

export function saveComments(path, state) {
  mkdirSync(dirname(path), { recursive: true });
  const doc = {
    version: 1,
    base: state.range.base,
    branch: state.range.branch,
    mergeBase: state.range.mergeBase,
    savedAt: new Date().toISOString(),
    comments: state.comments,
  };
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`);
  state.dirty = false;
}
