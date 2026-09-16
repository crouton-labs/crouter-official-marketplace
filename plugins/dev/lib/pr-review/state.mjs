// state.mjs — the review's state and the moves over it. No terminal here.
//
// The diff is presented as ONE continuous row list across every file (a file
// header, its hunks, their lines, and any comments under them), so scrolling
// reads the PR top to bottom like a review page while the sidebar tracks which
// file the cursor is in. A comment is anchored to a hunk by line index, which
// is stable for as long as the diff is.

import { randomUUID } from 'node:crypto';
import { wrapText } from './term.mjs';

/**
 * @typedef {{ kind: 'file', file: number }
 *   | { kind: 'hunk', file: number, hunk: number }
 *   | { kind: 'line', file: number, hunk: number, line: number }
 *   | { kind: 'comment', file: number, id: string, part: number, total: number, text: string }
 *   | { kind: 'gap' }} Row
 *
 * A comment occupies one row per wrapped line at `state.commentWidth`, so the
 * row list is rebuilt when the pane width changes. A `gap` row is the blank
 * line between files: painted, never landed on. A file with nothing to expand
 * (binary, mode change, pure rename) is its header row alone.
 */

export function createState({ range, files, commits, comments }) {
  const state = {
    range,
    files,
    commits,
    comments,
    folded: new Set(),
    focus: files.length > 0 ? 'diff' : 'files',
    fileIndex: 0,
    cursor: 0,
    anchor: null,
    scroll: 0,
    fileScroll: 0,
    mode: 'view',
    compose: null,
    notice: null,
    rows: [],
    rowOfFile: [],
    commentWidth: 80,
    dirty: false,
  };
  rebuildRows(state);
  // Open on the first change, selected as a block.
  if (!nextChange(state, 1, { from: -1 })) jumpTo(state, 0);
  return state;
}

function landable(row) {
  return row !== undefined && row.kind !== 'gap';
}

export function setCommentWidth(state, width) {
  const next = Math.max(10, width);
  if (next === state.commentWidth) return;
  state.commentWidth = next;
  rebuildRows(state);
}

export function rebuildRows(state) {
  const rows = [];
  const rowOfFile = [];
  const pushComment = (fi, c) => {
    const lines = wrapText(c.text, state.commentWidth);
    lines.forEach((text, part) => rows.push({ kind: 'comment', file: fi, id: c.id, part, total: lines.length, text }));
  };
  state.files.forEach((file, fi) => {
    if (fi > 0) rows.push({ kind: 'gap' });
    rowOfFile[fi] = rows.length;
    rows.push({ kind: 'file', file: fi });
    for (const c of state.comments) if (c.path === file.path && c.hunk === null) pushComment(fi, c);
    if (state.folded.has(fi)) return;
    file.hunks.forEach((hunk, hi) => {
      rows.push({ kind: 'hunk', file: fi, hunk: hi });
      hunk.lines.forEach((l, li) => {
        rows.push({ kind: 'line', file: fi, hunk: hi, line: li, lineKind: l.kind });
        for (const c of state.comments) {
          if (c.path === file.path && c.hunk === hi && c.lineTo === li) pushComment(fi, c);
        }
      });
    });
  });
  state.rows = rows;
  state.rowOfFile = rowOfFile;
  clampCursor(state);
}

export function clampCursor(state) {
  const max = Math.max(0, state.rows.length - 1);
  state.cursor = Math.max(0, Math.min(state.cursor, max));
  if (state.rows[state.cursor]?.kind === 'gap') state.cursor = Math.min(max, state.cursor + 1);
  if (state.anchor !== null) state.anchor = Math.max(0, Math.min(state.anchor, max));
  const row = state.rows[state.cursor];
  if (landable(row)) state.fileIndex = row.file;
}

export function commentById(state, id) {
  return state.comments.find((c) => c.id === id) ?? null;
}

/** Row indices covered by the current selection, inclusive. */
export function selectionBounds(state) {
  if (state.anchor === null) return { lo: state.cursor, hi: state.cursor };
  return { lo: Math.min(state.anchor, state.cursor), hi: Math.max(state.anchor, state.cursor) };
}

/** Comments anchored on the row under the cursor (line rows and file rows). */
export function commentsAtCursor(state) {
  const row = state.rows[state.cursor];
  if (!row) return [];
  const file = state.files[row.file];
  if (row.kind === 'comment') return [commentById(state, row.id)].filter(Boolean);
  if (row.kind === 'file') return state.comments.filter((c) => c.path === file.path && c.hunk === null);
  if (row.kind === 'line') return state.comments.filter((c) => c.path === file.path && c.hunk === row.hunk && row.line >= c.lineFrom && row.line <= c.lineTo);
  return [];
}

/** The set of row indices any comment covers, for the gutter marker. */
export function commentedRows(state) {
  const set = new Set();
  state.rows.forEach((row, i) => {
    if (row.kind !== 'line') return;
    const file = state.files[row.file];
    for (const c of state.comments) {
      if (c.path === file.path && c.hunk === row.hunk && row.line >= c.lineFrom && row.line <= c.lineTo) { set.add(i); break; }
    }
  });
  return set;
}

// ── Movement ───────────────────────────────────────────────────────────────

/** Move by `delta` landable rows. From a block selection, one step down
 *  leaves from the block's end and one step up from its start, so a selected
 *  change is stepped over rather than re-walked. */
export function moveCursor(state, delta) {
  const { lo, hi } = selectionBounds(state);
  state.anchor = null;
  let cursor = delta > 0 ? hi : lo;
  const step = Math.sign(delta);
  for (let n = Math.abs(delta); n > 0; n--) {
    let next = cursor + step;
    while (state.rows[next] !== undefined && !landable(state.rows[next])) next += step;
    if (state.rows[next] === undefined) break;
    cursor = next;
  }
  state.cursor = cursor;
  clampCursor(state);
}

/** The cursor `delta` landable rows away, without moving — the target an
 *  animated move paints toward. */
export function cursorAfterMove(state, delta) {
  const saved = { cursor: state.cursor, anchor: state.anchor, fileIndex: state.fileIndex };
  moveCursor(state, delta);
  const target = state.cursor;
  Object.assign(state, saved);
  return target;
}

/** Extend the selection over line rows within one hunk. The anchor is set on
 *  the first extension; header/comment rows stop the extension. */
export function extendSelection(state, delta) {
  const rows = state.rows;
  const here = rows[state.cursor];
  if (!here || here.kind !== 'line') return;
  if (state.anchor === null) state.anchor = state.cursor;
  let next = state.cursor + delta;
  while (next >= 0 && next < rows.length && rows[next].kind === 'comment') next += delta;
  const target = rows[next];
  if (!target || target.kind !== 'line' || target.file !== here.file || target.hunk !== here.hunk) return;
  state.cursor = next;
}

export function jumpTo(state, row) {
  state.anchor = null;
  state.cursor = row;
  clampCursor(state);
}

function findRow(state, from, delta, pred) {
  for (let i = from + delta; i >= 0 && i < state.rows.length; i += delta) if (pred(state.rows[i], i)) return i;
  return null;
}

function isChange(row) {
  return row.kind === 'line' && row.lineKind !== ' ';
}

/** Bounds of the run of changed lines containing row `i`. */
function changeBlockAt(state, i) {
  const rows = state.rows;
  const same = (j) => rows[j] !== undefined && (isChange(rows[j]) || rows[j].kind === 'comment') && rows[j].file === rows[i].file && rows[j].hunk === rows[i].hunk;
  let lo = i;
  let hi = i;
  while (same(lo - 1)) lo--;
  while (same(hi + 1)) hi++;
  // Comments hang under the block; the selection covers only the lines.
  while (rows[hi].kind === 'comment') hi--;
  while (rows[lo].kind === 'comment') lo++;
  return { lo, hi };
}

/** Jump to the next/previous run of changed lines and select the whole run.
 *  Returns false when there is none in that direction. */
export function nextChange(state, delta, { from = null } = {}) {
  const { lo, hi } = selectionBounds(state);
  const start = from ?? (delta > 0 ? hi : lo);
  const i = findRow(state, start, delta, (r) => isChange(r));
  if (i === null) return false;
  const block = changeBlockAt(state, i);
  state.anchor = block.lo;
  state.cursor = block.hi;
  clampCursor(state);
  return true;
}

/** Select the whole change block under the cursor, if it is on one. */
export function selectChangeAtCursor(state) {
  const row = state.rows[state.cursor];
  if (!row || !isChange(row)) return false;
  const block = changeBlockAt(state, state.cursor);
  state.anchor = block.lo;
  state.cursor = block.hi;
  return true;
}

export function nextFile(state, delta) {
  const i = findRow(state, state.cursor, delta, (r) => r.kind === 'file');
  if (i !== null) jumpTo(state, i);
  else if (delta > 0) jumpTo(state, state.rows.length - 1);
  else jumpTo(state, 0);
}

export function nextComment(state, delta) {
  const i = findRow(state, state.cursor, delta, (r) => r.kind === 'comment' && r.part === 0);
  if (i !== null) jumpTo(state, i);
  else state.notice = delta > 0 ? 'no more comments below' : 'no more comments above';
}

export function selectFile(state, fileIndex) {
  const fi = Math.max(0, Math.min(state.files.length - 1, fileIndex));
  state.fileIndex = fi;
  const row = state.rowOfFile[fi];
  if (row !== undefined) { state.anchor = null; state.cursor = row; }
}

/** Fold the file under the cursor and move on to the next file; unfolding
 *  stays put. Returns which happened. */
export function toggleFold(state) {
  const row = state.rows[state.cursor];
  if (!row || row.kind === 'gap') return null;
  const fi = row.file;
  if (state.folded.has(fi)) {
    state.folded.delete(fi);
    rebuildRows(state);
    jumpTo(state, state.rowOfFile[fi]);
    return 'unfolded';
  }
  state.folded.add(fi);
  rebuildRows(state);
  const next = state.rowOfFile[fi + 1] ?? state.rowOfFile[fi];
  jumpTo(state, next);
  return 'folded';
}

export function foldAll(state, folded) {
  state.folded = folded ? new Set(state.files.map((_, i) => i)) : new Set();
  const fi = state.fileIndex;
  rebuildRows(state);
  jumpTo(state, state.rowOfFile[fi] ?? 0);
}

/** Keep the cursor inside the viewport with a small margin. */
export function followCursor(state, bodyRows) {
  const margin = Math.min(2, Math.floor(bodyRows / 4));
  if (state.cursor < state.scroll + margin) state.scroll = Math.max(0, state.cursor - margin);
  if (state.cursor > state.scroll + bodyRows - 1 - margin) state.scroll = state.cursor - bodyRows + 1 + margin;
  state.scroll = Math.max(0, Math.min(state.scroll, Math.max(0, state.rows.length - bodyRows)));
}

export function followFile(state, listRows) {
  if (state.fileIndex < state.fileScroll) state.fileScroll = state.fileIndex;
  if (state.fileIndex >= state.fileScroll + listRows) state.fileScroll = state.fileIndex - listRows + 1;
  state.fileScroll = Math.max(0, Math.min(state.fileScroll, Math.max(0, state.files.length - listRows)));
}

// ── Comments ───────────────────────────────────────────────────────────────

/** Where a new comment from the current cursor/selection would anchor, or a
 *  reason it cannot. */
export function composeTarget(state) {
  const row = state.rows[state.cursor];
  if (!row || row.kind === 'gap') return { error: 'nothing to comment on here' };
  const file = state.files[row.file];
  if (row.kind === 'file' || row.kind === 'hunk') {
    return { path: file.path, hunk: null, lineFrom: null, lineTo: null, oldFrom: null, newFrom: null, oldTo: null, newTo: null };
  }
  if (row.kind === 'comment') return { error: 'press e to edit this comment' };
  const { lo, hi } = selectionBounds(state);
  const first = state.rows[lo];
  const last = state.rows[hi];
  const hunk = file.hunks[row.hunk];
  const a = hunk.lines[first.line];
  const b = hunk.lines[last.line];
  let lines = 0;
  for (let i = lo; i <= hi; i++) if (state.rows[i].kind === 'line') lines++;
  return {
    path: file.path, hunk: row.hunk, lineFrom: first.line, lineTo: last.line, lines,
    oldFrom: a.oldNo, newFrom: a.newNo, oldTo: b.oldNo, newTo: b.newNo,
  };
}

export function openCompose(state, target, editing = null) {
  state.mode = 'compose';
  state.compose = { text: editing ? editing.text : '', cursor: editing ? editing.text.length : 0, editingId: editing ? editing.id : null, target };
}

export function closeCompose(state) {
  state.mode = 'view';
  state.compose = null;
}

export function commitCompose(state) {
  const c = state.compose;
  if (!c) return false;
  const text = c.text.replace(/\s+$/, '');
  if (text === '') { closeCompose(state); state.notice = 'empty comment discarded'; return false; }
  if (c.editingId !== null) {
    const existing = commentById(state, c.editingId);
    if (existing) { existing.text = text; existing.updatedAt = new Date().toISOString(); }
  } else {
    state.comments.push({ id: randomUUID().slice(0, 8), ...c.target, text, createdAt: new Date().toISOString() });
  }
  state.dirty = true;
  closeCompose(state);
  state.anchor = null;
  rebuildRows(state);
  return true;
}

export function deleteComment(state, id) {
  const i = state.comments.findIndex((c) => c.id === id);
  if (i === -1) return;
  state.comments.splice(i, 1);
  state.dirty = true;
  rebuildRows(state);
}

/** Describe a comment's anchor for labels: `src/a.ts L12–15` or `src/a.ts (file)`. */
export function anchorLabel(comment) {
  if (comment.hunk === null) return `${comment.path} (file)`;
  const from = comment.newFrom ?? comment.oldFrom;
  const to = comment.newTo ?? comment.oldTo;
  const side = comment.newFrom === null ? ' (removed)' : '';
  return from === to ? `${comment.path} L${from}${side}` : `${comment.path} L${from}–${to}${side}`;
}

// ── Compose text editing ───────────────────────────────────────────────────

export function textInsert(c, s) {
  c.text = c.text.slice(0, c.cursor) + s + c.text.slice(c.cursor);
  c.cursor += s.length;
}

export function textBackspace(c) {
  if (c.cursor === 0) return;
  const before = [...c.text.slice(0, c.cursor)];
  const removed = before.pop();
  c.text = before.join('') + c.text.slice(c.cursor);
  c.cursor -= removed.length;
}

export function textDelete(c) {
  if (c.cursor >= c.text.length) return;
  const cp = c.text.codePointAt(c.cursor);
  const len = String.fromCodePoint(cp).length;
  c.text = c.text.slice(0, c.cursor) + c.text.slice(c.cursor + len);
}

export function textWordBackspace(c) {
  if (c.cursor === 0) return;
  const before = c.text.slice(0, c.cursor);
  const m = /(\s*\S+|\s+)$/.exec(before);
  const cut = m ? m[0].length : 1;
  c.text = before.slice(0, -cut) + c.text.slice(c.cursor);
  c.cursor -= cut;
}

export function textMove(c, delta) {
  if (delta < 0 && c.cursor > 0) { const prev = [...c.text.slice(0, c.cursor)].pop(); c.cursor -= prev.length; }
  if (delta > 0 && c.cursor < c.text.length) { const cp = c.text.codePointAt(c.cursor); c.cursor += String.fromCodePoint(cp).length; }
}

export function textWordMove(c, delta) {
  if (delta < 0) {
    const before = c.text.slice(0, c.cursor);
    const m = /(\S+\s*|\s+)$/.exec(before);
    c.cursor -= m ? m[0].length : 0;
  } else {
    const after = c.text.slice(c.cursor);
    const m = /^(\s*\S+|\s+)/.exec(after);
    c.cursor += m ? m[0].length : 0;
  }
}

export function textLineHome(c) {
  const nl = c.text.lastIndexOf('\n', c.cursor - 1);
  c.cursor = nl === -1 ? 0 : nl + 1;
}

export function textLineEnd(c) {
  const nl = c.text.indexOf('\n', c.cursor);
  c.cursor = nl === -1 ? c.text.length : nl;
}

export function textVertical(c, delta) {
  const lines = c.text.split('\n');
  let idx = 0;
  let li = 0;
  for (; li < lines.length; li++) {
    if (c.cursor <= idx + lines[li].length) break;
    idx += lines[li].length + 1;
  }
  const col = c.cursor - idx;
  const target = li + delta;
  if (target < 0 || target >= lines.length) return false;
  let start = 0;
  for (let i = 0; i < target; i++) start += lines[i].length + 1;
  c.cursor = start + Math.min(col, lines[target].length);
  return true;
}
