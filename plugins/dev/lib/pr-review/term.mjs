// term.mjs — the raw terminal under the review surface: alternate screen,
// keystroke and mouse decoding, and a full repaint of exactly `rows` lines.
//
// Zero dependencies by design (marketplace plugins carry no node_modules).
// The width helpers are approximations good enough for diff text: East Asian
// wide characters count 2, combining marks 0, everything else 1.

import { StringDecoder } from 'node:string_decoder';

// ── ANSI ────────────────────────────────────────────────────────────────────

export const ESC = '\x1b[';
export const RESET = `${ESC}0m`;
export const BOLD = `${ESC}1m`;
export const DIM = `${ESC}2m`;
export const ITALIC = `${ESC}3m`;
export const REVERSE = `${ESC}7m`;
export const RED = `${ESC}31m`;
export const GREEN = `${ESC}32m`;
export const YELLOW = `${ESC}33m`;
export const BLUE = `${ESC}34m`;
export const MAGENTA = `${ESC}35m`;
export const CYAN = `${ESC}36m`;
export const GRAY = `${ESC}90m`;
export const WHITE = `${ESC}97m`;
export const BG_CARD = `${ESC}48;5;234m`;
export const BG_SELECT = `${ESC}48;5;237m`;
// Muted truecolor tints a step off the card (#1c1c1c): readable as green
// and red without lighting the line up. Selection lifts the same tint
// instead of swapping to gray, so the text keeps its color contrast.
export const BG_ADD = `${ESC}48;2;30;58;30m`;
export const BG_DEL = `${ESC}48;2;70;30;30m`;
export const BG_SELECT_ADD = `${ESC}48;2;44;84;44m`;
export const BG_SELECT_DEL = `${ESC}48;2;96;44;44m`;
export const FG_ADD = `${ESC}38;2;180;240;180m`;
export const FG_DEL = `${ESC}38;2;250;170;170m`;
export const BG_COMMENT = `${ESC}48;5;236m`;

const ANSI_RE = /\x1b\[[0-9;?]*[ -/]*[@-~]/g;

export function stripAnsi(s) {
  return s.replace(ANSI_RE, '');
}

const WIDE_RE = /[\u1100-\u115F\u2E80-\u303E\u3041-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6\u{1F300}-\u{1F64F}\u{1F900}-\u{1F9FF}\u{20000}-\u{3FFFD}]/u;
const ZERO_RE = /[\p{M}\u200B-\u200F\u2060\uFE0F]/u;

export function charWidth(ch) {
  const code = ch.codePointAt(0);
  if (code < 32 || (code >= 0x7f && code < 0xa0)) return 0;
  if (ZERO_RE.test(ch)) return 0;
  if (WIDE_RE.test(ch)) return 2;
  return 1;
}

/** Display width of plain (ANSI-free) text. */
export function textWidth(s) {
  let w = 0;
  for (const ch of s) w += charWidth(ch);
  return w;
}

/** Display width of possibly-styled text. */
export function visibleWidth(s) {
  return textWidth(stripAnsi(s));
}

/** Clip a styled line to `width` cells, keeping escape sequences intact and
 *  closing with a reset so the clip never bleeds style into the next row. */
export function clipAnsi(line, width) {
  if (width <= 0) return '';
  let out = '';
  let w = 0;
  let i = 0;
  while (i < line.length) {
    if (line[i] === '\x1b') {
      ANSI_RE.lastIndex = i;
      const m = ANSI_RE.exec(line);
      if (m && m.index === i) { out += m[0]; i += m[0].length; continue; }
      i++;
      continue;
    }
    const cp = line.codePointAt(i);
    const ch = String.fromCodePoint(cp);
    const cw = charWidth(ch);
    if (w + cw > width) break;
    out += ch;
    w += cw;
    i += ch.length;
  }
  return out + RESET;
}

/** Pad a styled line to exactly `width` cells (clip or fill). */
export function padAnsi(line, width) {
  const w = visibleWidth(line);
  if (w > width) return clipAnsi(line, width);
  return line + ' '.repeat(width - w);
}

/** Truncate plain text to `width` with an ellipsis. */
export function truncate(text, width) {
  if (width < 1) return '';
  if (textWidth(text) <= width) return text;
  let out = '';
  let w = 0;
  for (const ch of text) {
    const cw = charWidth(ch);
    if (w + cw + 1 > width) break;
    out += ch;
    w += cw;
  }
  return `${out}…`;
}

/** Truncate a path keeping its tail: `…/dir/file.ts`. */
export function truncateLeft(text, width) {
  if (width < 1) return '';
  if (textWidth(text) <= width) return text;
  const chars = [...text];
  let out = '';
  let w = 0;
  for (let i = chars.length - 1; i >= 0; i--) {
    const cw = charWidth(chars[i]);
    if (w + cw + 1 > width) break;
    out = chars[i] + out;
    w += cw;
  }
  return `…${out}`;
}

/** Hard-wrap plain text to `width` cells, breaking on spaces when possible. */
export function wrapText(text, width) {
  const out = [];
  for (const para of text.split('\n')) {
    if (para === '') { out.push(''); continue; }
    let line = '';
    let lineW = 0;
    for (const word of para.split(' ')) {
      const ww = textWidth(word);
      if (lineW === 0) {
        if (ww <= width) { line = word; lineW = ww; continue; }
        // A single word wider than the row: hard split.
        let chunk = '';
        let cw = 0;
        for (const ch of word) {
          const c = charWidth(ch);
          if (cw + c > width) { out.push(chunk); chunk = ''; cw = 0; }
          chunk += ch;
          cw += c;
        }
        line = chunk;
        lineW = cw;
        continue;
      }
      if (lineW + 1 + ww <= width) { line += ` ${word}`; lineW += 1 + ww; continue; }
      out.push(line);
      if (ww <= width) { line = word; lineW = ww; continue; }
      let chunk = '';
      let cw = 0;
      for (const ch of word) {
        const c = charWidth(ch);
        if (cw + c > width) { out.push(chunk); chunk = ''; cw = 0; }
        chunk += ch;
        cw += c;
      }
      line = chunk;
      lineW = cw;
    }
    out.push(line);
  }
  return out;
}

export function expandTabs(text, tabWidth = 4) {
  if (!text.includes('\t')) return text;
  let out = '';
  let col = 0;
  for (const ch of text) {
    if (ch === '\t') {
      const n = tabWidth - (col % tabWidth);
      out += ' '.repeat(n);
      col += n;
    } else {
      out += ch;
      col += charWidth(ch);
    }
  }
  return out;
}

// ── Input decoding ──────────────────────────────────────────────────────────

/**
 * @typedef {{ type: 'key', name: string, ctrl?: boolean, alt?: boolean, shift?: boolean }} KeyEvent
 * @typedef {{ type: 'paste', text: string }} PasteEvent
 * @typedef {{ type: 'mouse', kind: 'wheelUp'|'wheelDown'|'click', x: number, y: number }} MouseEvent
 */

const CSI_FINAL = {
  A: 'up', B: 'down', C: 'right', D: 'left', H: 'home', F: 'end', Z: 'shifttab',
};
const CSI_TILDE = { 1: 'home', 2: 'insert', 3: 'delete', 4: 'end', 5: 'pageup', 6: 'pagedown', 7: 'home', 8: 'end' };

function modifiers(param) {
  const m = (Number(param) || 1) - 1;
  return { shift: (m & 1) !== 0, alt: (m & 2) !== 0, ctrl: (m & 4) !== 0 };
}

/** Decode one stdin chunk into a list of events. A chunk may carry several
 *  keystrokes (fast typing, a paste, a mouse drag). */
export function decodeInput(data) {
  const events = [];
  let i = 0;
  const push = (name, mods = {}) => events.push({ type: 'key', name, ...mods });
  while (i < data.length) {
    const ch = data[i];
    if (ch === '\x1b') {
      const rest = data.slice(i);
      // Bracketed paste.
      if (rest.startsWith('\x1b[200~')) {
        const end = rest.indexOf('\x1b[201~');
        const text = end === -1 ? rest.slice(6) : rest.slice(6, end);
        events.push({ type: 'paste', text });
        i += end === -1 ? rest.length : end + 6;
        continue;
      }
      // SGR mouse: ESC [ < b ; x ; y (M|m)
      const mouse = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])/.exec(rest);
      if (mouse) {
        const b = Number(mouse[1]);
        const x = Number(mouse[2]);
        const y = Number(mouse[3]);
        if (b === 64) events.push({ type: 'mouse', kind: 'wheelUp', x, y });
        else if (b === 65) events.push({ type: 'mouse', kind: 'wheelDown', x, y });
        else if ((b & 3) === 0 && mouse[4] === 'M' && (b & 32) === 0) events.push({ type: 'mouse', kind: 'click', x, y });
        i += mouse[0].length;
        continue;
      }
      // CSI sequences.
      const csi = /^\x1b\[([0-9;]*)([A-Za-z~])/.exec(rest);
      if (csi) {
        const params = csi[1].split(';');
        const final = csi[2];
        if (final === '~') {
          const name = CSI_TILDE[params[0]];
          if (name) push(name, modifiers(params[1]));
        } else if (CSI_FINAL[final]) {
          push(CSI_FINAL[final], final === 'Z' ? {} : modifiers(params[1]));
        }
        i += csi[0].length;
        continue;
      }
      // SS3 (application cursor keys).
      const ss3 = /^\x1bO([A-Z])/.exec(rest);
      if (ss3) {
        const name = CSI_FINAL[ss3[1]] ?? null;
        if (name) push(name);
        i += ss3[0].length;
        continue;
      }
      // Alt+key: ESC followed by one ordinary character.
      if (rest.length >= 2 && rest[1] !== '\x1b') {
        const next = rest[1];
        if (next === '\r' || next === '\n') push('enter', { alt: true });
        else if (next === '\x7f' || next === '\x08') push('backspace', { alt: true });
        else push(next, { alt: true });
        i += 2;
        continue;
      }
      push('escape');
      i += 1;
      continue;
    }
    if (ch === '\r') { push('enter'); i++; continue; }
    if (ch === '\n') { push('j', { ctrl: true }); i++; continue; }
    if (ch === '\t') { push('tab'); i++; continue; }
    if (ch === '\x7f' || ch === '\x08') { push('backspace'); i++; continue; }
    const code = ch.charCodeAt(0);
    if (code < 32) { push(String.fromCharCode(code + 96), { ctrl: true }); i++; continue; }
    // Printable: take the whole code point.
    const cp = data.codePointAt(i);
    const full = String.fromCodePoint(cp);
    push(full);
    i += full.length;
  }
  return events;
}

// ── Screen ──────────────────────────────────────────────────────────────────

/** Take over the terminal. Returns a handle with `paint(lines)`, `size()`,
 *  and `close()`. Events flow to `onEvent`; resizes to `onResize`. */
export function openScreen({ onEvent, onResize }) {
  const { stdin, stdout } = process;
  if (!stdin.isTTY || !stdout.isTTY) throw new Error('pr review needs an interactive terminal');
  const decoder = new StringDecoder('utf8');
  stdin.setRawMode(true);
  stdin.resume();
  stdout.write('\x1b[?1049h\x1b[?25l\x1b[?1000h\x1b[?1006h\x1b[?2004h\x1b[H\x1b[2J');

  const onData = (buf) => {
    const text = decoder.write(buf);
    if (text === '') return;
    for (const event of decodeInput(text)) onEvent(event);
  };
  stdin.on('data', onData);
  const onSize = () => onResize();
  stdout.on('resize', onSize);

  let closed = false;
  let last = [];
  return {
    size: () => ({ cols: stdout.columns ?? 80, rows: stdout.rows ?? 24 }),
    /** Paint exactly `rows` lines. Unchanged rows are skipped. */
    paint(lines, { force = false } = {}) {
      if (closed) return;
      const rows = stdout.rows ?? 24;
      let out = '';
      for (let r = 0; r < rows; r++) {
        const line = lines[r] ?? '';
        if (!force && last[r] === line) continue;
        out += `\x1b[${r + 1};1H${line}\x1b[K`;
      }
      last = lines.slice(0, rows);
      if (out !== '') stdout.write(out);
    },
    invalidate() { last = []; },
    close() {
      if (closed) return;
      closed = true;
      stdin.off('data', onData);
      stdout.off('resize', onSize);
      stdout.write('\x1b[?2004l\x1b[?1006l\x1b[?1000l\x1b[?25h\x1b[?1049l');
      try { stdin.setRawMode(false); } catch { /* not a tty any more */ }
      stdin.pause();
    },
  };
}
