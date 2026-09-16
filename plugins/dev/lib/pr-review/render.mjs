// render.mjs — the frame: (state, cols, rows) → exactly `rows` clipped lines.
//
// Top to bottom: a one-line header (what is being reviewed, totals), a
// divider, the body (file sidebar | continuous diff), and a footer that is
// key hints in view mode, the compose box while writing a comment, or the
// key table when help is open. The footer is the only region whose height
// changes, and the body absorbs the difference.

import {
  BG_ADD, BG_CARD, BG_COMMENT, BG_DEL, BG_SELECT, BG_SELECT_ADD, BG_SELECT_DEL, BOLD, CYAN, DIM, FG_ADD, FG_DEL, GRAY, GREEN, MAGENTA, RED, RESET, REVERSE, YELLOW,
  clipAnsi, expandTabs, padAnsi, textWidth, truncate, truncateLeft, visibleWidth, wrapText,
} from './term.mjs';
import { commentById, commentedRows, selectionBounds } from './state.mjs';

const SIDEBAR_MIN_COLS = 96;
const STATUS_COLOR = { A: GREEN, M: YELLOW, D: RED, R: CYAN, C: CYAN, T: MAGENTA };

export function sidebarWidth(cols) {
  if (cols < SIDEBAR_MIN_COLS) return 0;
  return Math.max(26, Math.min(40, Math.floor(cols * 0.27)));
}

/** Cells a comment's text may use in the diff column: the column minus the
 *  marker, indent, bar, and a space. */
export function commentWidthFor(cols) {
  const sw = sidebarWidth(cols);
  const diffWidth = sw > 0 ? cols - sw - 3 : cols;
  return Math.max(10, diffWidth - 6);
}

function hline(width, ch = '─') {
  return width < 1 ? '' : ch.repeat(width);
}

function statusChip(status) {
  return `${BOLD}${STATUS_COLOR[status] ?? ''}${status}${RESET}`;
}

function counts(file) {
  const parts = [];
  if (file.additions > 0) parts.push(`${GREEN}+${file.additions}${RESET}`);
  if (file.deletions > 0) parts.push(`${RED}−${file.deletions}${RESET}`);
  if (file.binary) parts.push(`${DIM}bin${RESET}`);
  return parts.join(' ');
}

function totals(files) {
  let a = 0;
  let d = 0;
  for (const f of files) { a += f.additions; d += f.deletions; }
  return { a, d };
}

// ── Compose buffer ──────────────────────────────────────────────────────────

/** Wrapped buffer lines with the cursor cell shown in reverse video. */
export function renderBuffer(text, cursor, width) {
  const out = [];
  let index = 0;
  let cursorDrawn = false;
  for (const logical of text.split('\n')) {
    const chars = [...logical];
    let chunk = '';
    let w = 0;
    let chunkStart = index;
    const flush = (withCursorAt) => {
      if (withCursorAt === null) { out.push(chunk); return; }
      const before = [...chunk].slice(0, withCursorAt).join('');
      const at = [...chunk][withCursorAt] ?? ' ';
      const after = [...chunk].slice(withCursorAt + 1).join('');
      out.push(`${before}${REVERSE}${at}${RESET}${after}`);
      cursorDrawn = true;
    };
    let cursorCol = null;
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const cw = textWidth(ch);
      if (w + cw > width) {
        flush(cursorCol);
        chunk = '';
        w = 0;
        cursorCol = null;
        chunkStart = index;
      }
      if (index === cursor) cursorCol = [...chunk].length;
      chunk += ch;
      w += cw;
      index += ch.length;
    }
    if (index === cursor) cursorCol = [...chunk].length;
    flush(cursorCol);
    index += 1; // the newline
    void chunkStart;
  }
  if (!cursorDrawn) out.push(`${REVERSE} ${RESET}`);
  return out;
}

// ── Footer ──────────────────────────────────────────────────────────────────

function hint(key, label) {
  return `${CYAN}${key}${RESET} ${DIM}${label}${RESET}`;
}

function viewHints(state) {
  const sep = `${DIM} · ${RESET}`;
  if (state.focus === 'files') {
    return [
      hint('j/k', 'move'), hint('enter', 'open'), hint('c', 'comment file'), hint('z', 'fold'), hint('Z', 'fold all'),
      hint('tab', 'diff'), hint('?', 'help'), hint('q', 'quit'),
    ].join(sep);
  }
  return [
    hint('j/k', 'move'), hint('J/K', 'select'), hint('c', 'comment'), hint('e', 'edit'), hint('x', 'delete'),
    hint(']/[', 'change'), hint('}/{', 'file'), hint('n/N', 'comment'), hint('z', 'fold'), hint('tab', 'files'),
    hint('?', 'help'), hint('q', 'quit'),
  ].join(sep);
}

function helpLines() {
  const k = (key, label) => `  ${CYAN}${key.padEnd(11)}${RESET}${label}`;
  const row = (a, b) => `${padAnsi(a, 44)}${b}`;
  return [
    `  ${BOLD}Diff${RESET}`,
    row(k('j/k ↑/↓', 'move one row'), k('J/K', 'extend the selection (same hunk)')),
    row(k('d/u ^d/^u', 'half page down/up'), k('g/G', 'top / bottom')),
    row(k(']/[', 'next / previous change, selected'), k('}/{', 'next / previous file')),
    row(k('n/N', 'next / previous comment'), k('z  Z', 'fold file and move on / fold or unfold all')),
    row(k('c', 'comment on the selection'), k('e / enter', 'edit the comment under the cursor')),
    row(k('v', 'select the change block under the cursor'), k('esc', 'clear the selection')),
    row(k('x', 'delete the comment here'), k('tab h/l', 'switch between files and diff')),
    `  ${BOLD}Files${RESET}`,
    row(k('j/k', 'move'), k('enter l', 'open the file in the diff')),
    row(k('c', 'comment on the whole file'), k('z  Z', 'fold this file / fold or unfold all')),
    `  ${BOLD}Compose${RESET}`,
    row(k('enter', 'save'), k('^j ⌥enter', 'newline')),
    row(k('esc', 'cancel'), k('⌥⌫ ^w', 'delete word')),
    `  ${DIM}Mouse: wheel scrolls, click selects.  Comments are saved as you write them.${RESET}`,
    `  ${CYAN}?${RESET} ${DIM}close help${RESET}`,
  ];
}

function composeLines(state, width) {
  const c = state.compose;
  const t = c.target;
  let where;
  if (t.hunk === null) where = `${t.path} ${DIM}(whole file)${RESET}`;
  else {
    const from = t.newFrom ?? t.oldFrom;
    const to = t.newTo ?? t.oldTo;
    const side = t.newFrom === null ? ` ${DIM}(removed lines)${RESET}` : '';
    const n = t.lines > 1 ? ` ${DIM}· ${t.lines} lines selected${RESET}` : '';
    where = `${t.path} ${DIM}L${from === to ? from : `${from}–${to}`}${RESET}${side}${n}`;
  }
  const label = c.editingId !== null ? 'Edit comment' : 'Comment';
  const lines = [`  ${YELLOW}${label} on${RESET} ${where}`];
  for (const l of renderBuffer(c.text, c.cursor, Math.max(10, width - 4))) lines.push(`  ${YELLOW}┃${RESET} ${l}`);
  lines.push(`  ${hint('enter', 'save')}${DIM} · ${RESET}${hint('^j', 'newline')}${DIM} · ${RESET}${hint('esc', 'cancel')}`);
  return lines;
}

function footerLines(state, cols) {
  if (state.mode === 'compose' && state.compose) return composeLines(state, cols);
  if (state.mode === 'help') return helpLines();
  return [`  ${viewHints(state)}`];
}

// ── Sidebar ─────────────────────────────────────────────────────────────────

function sidebarLines(state, width, height) {
  const lines = [];
  const commentCounts = new Map();
  for (const c of state.comments) commentCounts.set(c.path, (commentCounts.get(c.path) ?? 0) + 1);
  const focused = state.focus === 'files';
  for (let i = 0; i < height; i++) {
    const fi = state.fileScroll + i;
    const file = state.files[fi];
    if (!file) { lines.push(''); continue; }
    const selected = fi === state.fileIndex;
    const n = commentCounts.get(file.path) ?? 0;
    const tail = `${counts(file)}${n > 0 ? ` ${YELLOW}●${n}${RESET}` : ''}`;
    const tailW = visibleWidth(tail);
    const fold = state.folded.has(fi) ? `${DIM}▸${RESET}` : ' ';
    const pathW = Math.max(6, width - 5 - tailW - 1);
    const path = truncateLeft(file.path, pathW);
    const body = `${statusChip(file.status)} ${fold}${padAnsi(path, pathW)} ${tail}`;
    const cursor = selected ? (focused ? `${CYAN}▸${RESET}` : `${GRAY}▸${RESET}`) : ' ';
    let line = `${cursor} ${body}`;
    if (selected && focused) line = `${BG_SELECT}${padAnsi(line, width).replaceAll(RESET, RESET + BG_SELECT)}${RESET}`;
    lines.push(padAnsi(line, width));
  }
  if (state.files.length > height) {
    const above = state.fileScroll;
    const below = state.files.length - height - state.fileScroll;
    if (above > 0) lines[0] = padAnsi(`${DIM}  ↑ ${above} more${RESET}`, width);
    if (below > 0) lines[height - 1] = padAnsi(`${DIM}  ↓ ${below} more${RESET}`, width);
  }
  return lines;
}

// ── Diff body ───────────────────────────────────────────────────────────────

function lineNoWidth(files) {
  let max = 0;
  for (const f of files) for (const h of f.hunks) max = Math.max(max, h.oldStart + h.oldCount, h.newStart + h.newCount);
  return Math.max(3, String(max).length);
}

function tint(line, width, bg) {
  return `${bg}${padAnsi(line, width).replaceAll(RESET, RESET + bg)}${RESET}`;
}

function diffRow(state, rowIndex, width, gw, commented, sel) {
  const row = state.rows[rowIndex];
  if (!row) return '';
  if (row.kind === 'gap') return '';
  const file = state.files[row.file];
  const focused = state.focus === 'diff';
  const isCursor = rowIndex === state.cursor;
  const inSel = rowIndex >= sel.lo && rowIndex <= sel.hi;
  const marker = inSel ? (focused ? `${CYAN}▌${RESET}` : `${GRAY}▌${RESET}`) : commented.has(rowIndex) ? `${YELLOW}▎${RESET}` : ' ';

  if (row.kind === 'file') {
    const fold = state.folded.has(row.file) ? '▸' : '▾';
    const rename = file.oldPath !== null ? `${DIM}${file.oldPath} → ${RESET}` : '';
    const note = file.note !== null ? `${DIM}(${file.note})${RESET} ` : '';
    const head = `${marker} ${DIM}${fold}${RESET} ${statusChip(file.status)} ${rename}${BOLD}${file.path}${RESET}  ${counts(file)} ${note}`;
    const fill = Math.max(0, width - visibleWidth(head));
    const line = `${head}${DIM}${hline(fill)}${RESET}`;
    return tint(line, width, isCursor ? BG_SELECT : BG_CARD);
  }
  if (row.kind === 'hunk') {
    const h = file.hunks[row.hunk];
    const line = `${marker} ${CYAN}@@ -${h.oldStart},${h.oldCount} +${h.newStart},${h.newCount} @@${RESET} ${DIM}${truncate(h.header, Math.max(0, width - 30))}${RESET}`;
    return tint(line, width, isCursor ? BG_SELECT : BG_CARD);
  }
  if (row.kind === 'comment') {
    const c = commentById(state, row.id);
    if (!c) return '';
    const bar = `${YELLOW}┃${RESET}`;
    const line = `${marker}   ${bar} ${row.text}`;
    return tint(line, width, isCursor ? BG_SELECT : BG_COMMENT);
  }
  // line
  const l = file.hunks[row.hunk].lines[row.line];
  const oldNo = l.oldNo === null ? ' '.repeat(gw) : String(l.oldNo).padStart(gw);
  const newNo = l.newNo === null ? ' '.repeat(gw) : String(l.newNo).padStart(gw);
  const text = expandTabs(l.text);
  let sign;
  let body;
  let bg = null;
  let selBg = BG_SELECT;
  if (l.kind === '+') { sign = `${FG_ADD}+${RESET}`; body = `${FG_ADD}${text}${RESET}`; bg = BG_ADD; selBg = BG_SELECT_ADD; }
  else if (l.kind === '-') { sign = `${FG_DEL}-${RESET}`; body = `${FG_DEL}${text}${RESET}`; bg = BG_DEL; selBg = BG_SELECT_DEL; }
  else if (l.kind === '\\') { sign = ' '; body = `${DIM}${text}${RESET}`; }
  else { sign = ' '; body = text; }
  const line = `${marker} ${DIM}${oldNo} ${newNo}${RESET} ${sign} ${body}`;
  // Every row of a file sits on the card background; the blank row between
  // files stays on the terminal's own, so each file reads as one block.
  return tint(line, width, inSel ? selBg : bg ?? BG_CARD);
}

// ── Frame ───────────────────────────────────────────────────────────────────

export function renderFrame(state, cols, rows) {
  const { range, files } = state;
  const t = totals(files);
  const nComments = state.comments.length;
  const header = `  ${BOLD}PR review${RESET}  ${CYAN}${range.branch}${RESET} ${DIM}→${RESET} ${CYAN}${range.base}${RESET}`
    + `   ${DIM}${range.commitCount} commit${range.commitCount === 1 ? '' : 's'} · ${files.length} file${files.length === 1 ? '' : 's'}${RESET}`
    + `  ${GREEN}+${t.a}${RESET} ${RED}−${t.d}${RESET}`
    + `   ${nComments > 0 ? YELLOW : DIM}${nComments} comment${nComments === 1 ? '' : 's'}${RESET}`;
  const footer = footerLines(state, cols);
  if (state.notice !== null && footer.length > 0) footer[footer.length - 1] = `  ${YELLOW}${state.notice}${RESET}`;

  const top = [header, `  ${DIM}${hline(cols - 4)}${RESET}`];
  const bodyHeight = Math.max(1, rows - top.length - footer.length);
  const sw = sidebarWidth(cols);
  const diffWidth = sw > 0 ? cols - sw - 3 : cols;
  state.layout = { sidebarWidth: sw, bodyTop: top.length, bodyHeight, diffWidth };

  const sel = state.focus === 'diff' || state.anchor !== null ? selectionBounds(state) : { lo: state.cursor, hi: state.cursor };
  const commented = commentedRows(state);
  const gw = lineNoWidth(files);

  const body = [];
  if (files.length === 0) {
    body.push('');
    body.push(`    ${DIM}No changes between ${range.base} and ${range.branch}.${RESET}`);
  } else {
    const side = sw > 0 ? sidebarLines(state, sw, bodyHeight) : null;
    for (let i = 0; i < bodyHeight; i++) {
      const rowIndex = state.scroll + i;
      let diff = rowIndex >= state.rows.length ? '' : diffRow(state, rowIndex, diffWidth, gw, commented, sel);
      // Scroll indicators replace the edge rows; they keep the card
      // background of the row they cover so a file's block stays whole.
      const onCard = state.rows[rowIndex] !== undefined && state.rows[rowIndex].kind !== 'gap';
      if (i === 0 && state.scroll > 0) diff = tint(`${DIM}   ↑ ${state.scroll} more${RESET}`, diffWidth, onCard ? BG_CARD : '');
      const remaining = state.rows.length - (state.scroll + bodyHeight);
      if (i === bodyHeight - 1 && remaining > 0) diff = tint(`${DIM}   ↓ ${remaining} more${RESET}`, diffWidth, onCard ? BG_CARD : '');
      diff = padAnsi(diff, diffWidth);
      body.push(side ? `${side[i]}${DIM} │ ${RESET}${diff}` : diff);
    }
  }
  while (body.length < bodyHeight) body.push('');

  const lines = [...top, ...body.slice(0, bodyHeight), ...footer];
  while (lines.length < rows) lines.push('');
  return lines.slice(0, rows).map((l) => clipAnsi(l, cols));
}
