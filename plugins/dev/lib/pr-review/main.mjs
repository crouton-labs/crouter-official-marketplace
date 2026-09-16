#!/usr/bin/env node
// main.mjs — `dev pr review [branch] [--base <ref>]`: review a branch's diff
// against its base, lazygit-style, and leave comments on it.
//
// Comments are written to <git-dir>/crtr/pr-review/<base>...<branch>.json as
// they are made, so quitting and reopening resumes the review. With
// --companion <node-id> (how `crtr dev pr review` launches it) each saved,
// revised, or deleted comment is also delivered to that node's inbox.

import { formatComment, sendToCompanion } from './companion.mjs';
import { GitError, branchCommits, collectDiff, resolveRange } from './git.mjs';
import { commentWidthFor, renderFrame } from './render.mjs';
import {
  anchorLabel, closeCompose, commentsAtCursor, commitCompose, composeTarget, deleteComment, extendSelection,
  cursorAfterMove, foldAll, followCursor, followFile, jumpTo, moveCursor, nextChange, nextComment, nextFile, openCompose, selectChangeAtCursor,
  createState, selectFile, setCommentWidth, textBackspace, textDelete, textInsert, textLineEnd, textLineHome,
  textMove, textVertical, textWordBackspace, textWordMove, toggleFold,
} from './state.mjs';
import { loadComments, saveComments, storePath } from './store.mjs';
import { openScreen } from './term.mjs';

const USAGE = `usage: dev pr review [<branch>] [--base <ref>] [-C <dir>] [--companion <node-id>]

Review the changes <branch> would bring to <ref> (default: the checked-out
branch against origin's default branch), file by file, and comment on them.
Comments are saved under the repository's .git directory as you write them.
With --companion, each comment is also delivered to that crtr node's inbox;
\`crtr dev pr review\` opens this surface beside such a node.`;

function parseArgs(argv) {
  const opts = { branch: null, base: null, cwd: process.cwd(), companion: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') { process.stdout.write(`${USAGE}\n`); process.exit(0); }
    else if (a === '--base') opts.base = argv[++i] ?? null;
    else if (a.startsWith('--base=')) opts.base = a.slice('--base='.length);
    else if (a === '--companion') opts.companion = argv[++i] ?? null;
    else if (a.startsWith('--companion=')) opts.companion = a.slice('--companion='.length);
    else if (a === '-C') opts.cwd = argv[++i] ?? opts.cwd;
    else if (a.startsWith('-')) { process.stderr.write(`unknown option: ${a}\n${USAGE}\n`); process.exit(2); }
    else if (opts.branch === null) opts.branch = a;
    else { process.stderr.write(`unexpected argument: ${a}\n${USAGE}\n`); process.exit(2); }
  }
  if (opts.base === null && opts.branch !== null && opts.branch.includes('...')) {
    const [base, branch] = opts.branch.split('...');
    opts.base = base;
    opts.branch = branch;
  }
  return opts;
}

// ── Main ───────────────────────────────────────────────────────────────────

const opts = parseArgs(process.argv.slice(2));

let range;
let files;
let commits;
try {
  range = resolveRange({ cwd: opts.cwd, base: opts.base, branch: opts.branch });
  files = collectDiff(range, range.top);
  commits = branchCommits(range, range.top);
} catch (error) {
  if (error instanceof GitError) { process.stderr.write(`pr review: ${error.message}\n`); process.exit(1); }
  throw error;
}

const store = storePath(range);
const loaded = loadComments(store, files);
const state = createState({ range, files, commits, comments: loaded.comments });
if (loaded.dropped > 0) state.notice = `${loaded.dropped} saved comment${loaded.dropped === 1 ? '' : 's'} no longer match the diff and were dropped`;

let screen;
let quitting = false;

function quit() {
  if (quitting) return;
  quitting = true;
  if (state.dirty) saveComments(store, state);
  screen.close();
  const n = state.comments.length;
  if (n === 0) process.stdout.write(`pr review: ${range.branch} → ${range.base}, no comments.\n`);
  else {
    process.stdout.write(`pr review: ${range.branch} → ${range.base}, ${n} comment${n === 1 ? '' : 's'} saved to ${store}\n`);
    for (const c of state.comments) process.stdout.write(`  • ${anchorLabel(c)}: ${c.text.split('\n')[0]}\n`);
  }
  if (opts.companion) process.stdout.write(`companion node ${opts.companion} is still open; close it from its viewer when the review is done.\n`);
  // A comment sent in the last moment is still on its way; give it a beat.
  const deadline = Date.now() + 3000;
  const exit = () => { if (inFlight > 0 && Date.now() < deadline) setTimeout(exit, 50); else process.exit(0); };
  exit();
}

// ── Companion delivery ─────────────────────────────────────────────────────

// Sends run in the background so a slow daemon never stalls a keypress; the
// footer reports each outcome when it lands.
let inFlight = 0;

function deliver(comment, action) {
  if (!opts.companion) return;
  inFlight++;
  state.notice = action === 'withdrawn' ? 'comment deleted — telling the companion…' : 'comment saved — sending to the companion…';
  sendToCompanion(opts.companion, formatComment(comment, files, action)).then((failure) => {
    inFlight--;
    if (quitting) return;
    state.notice = failure === null
      ? (action === 'withdrawn' ? 'companion told the comment was withdrawn' : `comment ${action === 'revised' ? 'revision ' : ''}sent to the companion`)
      : `send failed: ${failure}`;
    paint();
  });
}

function paint() {
  const { cols, rows } = screen.size();
  setCommentWidth(state, commentWidthFor(cols));
  // Follow needs the body height, which the frame computes; render twice
  // only when the follow moved the viewport.
  const before = renderFrame(state, cols, rows);
  const { bodyHeight } = state.layout;
  const scroll = state.scroll;
  const fileScroll = state.fileScroll;
  followCursor(state, bodyHeight);
  followFile(state, bodyHeight);
  const lines = scroll === state.scroll && fileScroll === state.fileScroll ? before : renderFrame(state, cols, rows);
  screen.paint(lines);
}

function halfPage() {
  return Math.max(1, Math.floor((state.layout?.bodyHeight ?? 20) / 2));
}

// A half-page move is painted in steps so the eye can follow where the
// viewport went: three midpoints, then the destination, 24ms apart. A key
// pressed mid-animation lands the move immediately and handles the key.
const SCROLL_STEPS = 4;
const SCROLL_STEP_MS = 24;
let animation = null;

function finishAnimation() {
  if (animation === null) return;
  clearTimeout(animation.timer);
  jumpTo(state, animation.target);
  animation = null;
}

function animateCursorTo(target) {
  finishAnimation();
  const from = state.cursor;
  const distance = target - from;
  const steps = Math.min(SCROLL_STEPS, Math.abs(distance));
  if (steps <= 1) { jumpTo(state, target); return; }
  let step = 0;
  const tick = () => {
    step++;
    if (step >= steps) { animation = null; jumpTo(state, target); paint(); return; }
    jumpTo(state, from + Math.round((distance * step) / steps));
    paint();
    animation.timer = setTimeout(tick, SCROLL_STEP_MS);
  };
  animation = { target, timer: setTimeout(tick, SCROLL_STEP_MS) };
}

function beginCompose(editing = null) {
  if (editing) { openCompose(state, editing, editing); return; }
  const target = composeTarget(state);
  if (target.error) { state.notice = target.error; return; }
  openCompose(state, target);
}

function editUnderCursor() {
  const here = commentsAtCursor(state);
  if (here.length === 0) { state.notice = 'no comment under the cursor — c adds one'; return; }
  beginCompose(here[0]);
}

function deleteUnderCursor() {
  const here = commentsAtCursor(state);
  if (here.length === 0) { state.notice = 'no comment under the cursor'; return; }
  const row = state.rows[state.cursor];
  const target = row.kind === 'comment' ? here[0] : here[here.length - 1];
  deleteComment(state, target.id);
  state.notice = `deleted comment on ${anchorLabel(target)}`;
  deliver(target, 'withdrawn');
}

function onComposeKey(ev) {
  const c = state.compose;
  if (ev.type === 'paste') { textInsert(c, ev.text.replace(/\r\n?/g, '\n')); return; }
  if (ev.type !== 'key') return;
  const { name, ctrl, alt } = ev;
  if (name === 'escape') { closeCompose(state); state.notice = c.editingId ? 'edit canceled' : 'comment canceled'; return; }
  if (name === 'enter' && !alt) {
    const editing = c.editingId;
    if (commitCompose(state)) {
      state.notice = 'comment saved';
      const saved = editing === null ? state.comments[state.comments.length - 1] : state.comments.find((k) => k.id === editing);
      if (saved) deliver(saved, editing === null ? 'new' : 'revised');
    }
    return;
  }
  if ((name === 'enter' && alt) || (name === 'j' && ctrl)) { textInsert(c, '\n'); return; }
  if (name === 'backspace' && (alt || ctrl)) { textWordBackspace(c); return; }
  if (name === 'w' && ctrl) { textWordBackspace(c); return; }
  if (name === 'backspace') { textBackspace(c); return; }
  if (name === 'delete') { textDelete(c); return; }
  if (name === 'left' && (alt || ctrl)) { textWordMove(c, -1); return; }
  if (name === 'right' && (alt || ctrl)) { textWordMove(c, 1); return; }
  if ((name === 'b' && alt)) { textWordMove(c, -1); return; }
  if ((name === 'f' && alt)) { textWordMove(c, 1); return; }
  if (name === 'left') { textMove(c, -1); return; }
  if (name === 'right') { textMove(c, 1); return; }
  if (name === 'up') { textVertical(c, -1); return; }
  if (name === 'down') { textVertical(c, 1); return; }
  if (name === 'home' || (name === 'a' && ctrl)) { textLineHome(c); return; }
  if (name === 'end' || (name === 'e' && ctrl)) { textLineEnd(c); return; }
  if (name === 'c' && ctrl) { quit(); return; }
  if (name === 'tab') { textInsert(c, '  '); return; }
  if (!ctrl && !alt && name.length >= 1 && ![...name].some((ch) => ch.charCodeAt(0) < 32) && name.length <= 2) { textInsert(c, name); }
}

function onViewKey(ev) {
  const { name, ctrl, alt } = ev;
  if (name === 'c' && ctrl) { quit(); return; }
  if (name === 'q') { quit(); return; }
  if (name === '?') { state.mode = 'help'; return; }
  if (name === 'tab' || name === 'shifttab') { state.focus = state.focus === 'diff' ? 'files' : 'diff'; return; }
  if (name === 'z' && state.files.length > 0) { toggleFold(state); return; }
  if (name === 'v') { if (!selectChangeAtCursor(state)) state.notice = 'not on a changed line'; return; }
  if (name === 'Z') { foldAll(state, state.folded.size < state.files.length); return; }
  if (name === 'c' && !alt) { beginCompose(); return; }

  if (state.focus === 'files') {
    if (name === 'j' || name === 'down') { selectFile(state, state.fileIndex + 1); return; }
    if (name === 'k' || name === 'up') { selectFile(state, state.fileIndex - 1); return; }
    if (name === 'g' || name === 'home') { selectFile(state, 0); return; }
    if (name === 'G' || name === 'end') { selectFile(state, state.files.length - 1); return; }
    if (name === 'd' || name === 'pagedown' || (name === 'd' && ctrl)) { selectFile(state, state.fileIndex + halfPage()); return; }
    if (name === 'u' || name === 'pageup' || (name === 'u' && ctrl)) { selectFile(state, state.fileIndex - halfPage()); return; }
    if (name === 'enter' || name === 'l' || name === 'right') { selectFile(state, state.fileIndex); state.focus = 'diff'; return; }
    return;
  }

  if (name === 'j' || name === 'down') { moveCursor(state, 1); return; }
  if (name === 'k' || name === 'up') { moveCursor(state, -1); return; }
  if (name === 'J') { extendSelection(state, 1); return; }
  if (name === 'K') { extendSelection(state, -1); return; }
  if (name === 'd' || name === 'pagedown') { animateCursorTo(cursorAfterMove(state, halfPage())); return; }
  if (name === 'u' || name === 'pageup') { animateCursorTo(cursorAfterMove(state, -halfPage())); return; }
  if (name === 'g' || name === 'home') { jumpTo(state, 0); return; }
  if (name === 'G' || name === 'end') { jumpTo(state, state.rows.length - 1); return; }
  if (name === ']') { if (!nextChange(state, 1)) state.notice = 'no more changes below'; return; }
  if (name === '[') { if (!nextChange(state, -1)) state.notice = 'no more changes above'; return; }
  if (name === '}') { nextFile(state, 1); return; }
  if (name === '{') { nextFile(state, -1); return; }
  if (name === 'n') { nextComment(state, 1); return; }
  if (name === 'N') { nextComment(state, -1); return; }
  if (name === 'e' || name === 'enter') { editUnderCursor(); return; }
  if (name === 'x') { deleteUnderCursor(); return; }
  if (name === 'h' || name === 'left') { if (state.layout.sidebarWidth > 0) state.focus = 'files'; return; }
  if (name === 'escape') { state.anchor = null; return; }
}

function onMouse(ev) {
  const { bodyTop, bodyHeight, sidebarWidth } = state.layout;
  const y = ev.y - 1 - bodyTop;
  const inBody = y >= 0 && y < bodyHeight;
  if (ev.kind === 'wheelUp' || ev.kind === 'wheelDown') {
    const delta = ev.kind === 'wheelUp' ? -3 : 3;
    if (sidebarWidth > 0 && ev.x - 1 < sidebarWidth) selectFile(state, state.fileIndex + Math.sign(delta));
    else moveCursor(state, delta);
    return;
  }
  if (ev.kind === 'click' && inBody) {
    if (sidebarWidth > 0 && ev.x - 1 < sidebarWidth) {
      const fi = state.fileScroll + y;
      if (fi < state.files.length) { selectFile(state, fi); state.focus = 'files'; }
      return;
    }
    const row = state.scroll + y;
    if (row < state.rows.length) { jumpTo(state, row); state.focus = 'diff'; }
  }
}

function onEvent(ev) {
  state.notice = null;
  finishAnimation();
  if (state.mode === 'compose') onComposeKey(ev);
  else if (state.mode === 'help') {
    if (ev.type === 'key' && (ev.name === '?' || ev.name === 'escape' || ev.name === 'q' || ev.name === 'enter')) state.mode = 'view';
    else if (ev.type === 'key' && ev.name === 'c' && ev.ctrl) quit();
  } else if (ev.type === 'mouse') onMouse(ev);
  else if (ev.type === 'key') onViewKey(ev);
  if (quitting) return;
  if (state.dirty) saveComments(store, state);
  paint();
}

screen = openScreen({ onEvent, onResize: () => { screen.invalidate(); paint(); } });
process.on('SIGINT', quit);
process.on('SIGTERM', quit);
process.on('uncaughtException', (error) => {
  screen.close();
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exit(1);
});
paint();
