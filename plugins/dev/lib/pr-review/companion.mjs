// companion.mjs — what the review agent is told, and how comments reach it.
//
// The companion is an ordinary resident root node created through the public
// `crtr` CLI. Its first message (the brief) frames the job — a PR review, a
// reader who has not read the code — and carries the diff. Each comment the
// reviewer writes afterwards is one inbox message: the file, the line range,
// the diff lines under the comment verbatim, and the comment text.

import { spawn } from 'node:child_process';

/** Diff text handed to the companion at most, in characters. Past this the
 *  remaining files are named with their +/- counts and the companion reads
 *  them itself with git. */
export const DIFF_BUDGET = 160_000;

// ── Brief ──────────────────────────────────────────────────────────────────

/** Split the raw diff into one chunk per file, in the order git printed them
 *  (the same order `files` holds). */
function fileChunks(raw) {
  const chunks = [];
  let start = -1;
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('diff --git ')) continue;
    if (start >= 0) chunks.push(lines.slice(start, i).join('\n'));
    start = i;
  }
  if (start >= 0) chunks.push(lines.slice(start).join('\n'));
  return chunks;
}

function fileStat(f) {
  if (f.binary) return `${f.status}  ${f.path}  (binary)`;
  return `${f.status}  ${f.path}  +${f.additions} −${f.deletions}`;
}

export function buildBrief({ range, files, commits, comments, raw }) {
  const chunks = fileChunks(raw);
  const included = [];
  const omitted = [];
  let used = 0;
  for (let i = 0; i < files.length; i++) {
    const chunk = chunks[i] ?? '';
    if (omitted.length === 0 && used + chunk.length <= DIFF_BUDGET) { included.push(chunk); used += chunk.length; }
    else omitted.push(files[i]);
  }

  const out = [];
  out.push(`# PR review companion: \`${range.branch}\` → \`${range.base}\``);
  out.push('');
  out.push(`You are the companion for a pull-request review of branch \`${range.branch}\` against \`${range.base}\` in the repository at \`${range.top}\`. The person reviewing sits in the pane beside yours, reading the diff for the first time in a review surface. **They have not read this code.** They did not write it and may not know the surrounding codebase; they are deciding whether this change is safe and correct to merge.`);
  out.push('');
  out.push('Their comments and questions arrive as inbox messages, each anchored to a file and a line range with the diff lines under it quoted verbatim. Treat every one as a reviewer thinking aloud at a PR page:');
  out.push('');
  out.push('- A question ("why is this here?", "what does this do?") wants the actual answer from the code and history — read the repository, the surrounding files, and `git log` for the branch — not a guess from the diff alone.');
  out.push('- A concern ("this looks wrong", "what if X is null?") wants you to check whether it is real: trace the code, and say plainly whether the concern holds, with the evidence.');
  out.push('- A note ("nit: rename this") wants an acknowledgement and, if useful, a sharper wording they could post.');
  out.push('');
  out.push('Answer in plain, literal language, short enough to read beside a diff. Lead with the answer. Quote line numbers and paths so they can find what you mean. Do not edit the branch unless they ask you to; this is a review, and the author is not you. When they ask for a review summary, produce one they could post as-is: what the change does, what you verified, what needs work, ordered by severity.');
  out.push('');
  out.push(`Read the full diff any time with \`git diff ${range.base}...${range.branch}\`, one file with \`git diff ${range.base}...${range.branch} -- <path>\`, and the branch history with \`git log ${range.base}..${range.branch}\`.`);
  out.push('');
  out.push(`## Commits (${commits.length})`);
  out.push('');
  for (const c of commits) out.push(`- ${c.sha} ${c.subject}`);
  out.push('');
  out.push(`## Files (${files.length})`);
  out.push('');
  for (const f of files) out.push(`- ${fileStat(f)}`);
  out.push('');
  if (comments.length > 0) {
    out.push(`## Comments already written (${comments.length})`);
    out.push('');
    out.push('The reviewer started this review earlier. These comments exist already; new ones arrive as messages.');
    out.push('');
    for (const c of comments) out.push(formatComment(c, files, 'existing'));
    out.push('');
  }
  out.push('## Diff');
  out.push('');
  if (omitted.length > 0) {
    out.push(`The diff is large. The first ${included.length} of ${files.length} files are below; these ${omitted.length} are omitted and you read them with git as needed:`);
    out.push('');
    for (const f of omitted) out.push(`- ${fileStat(f)}`);
    out.push('');
  }
  out.push('```diff');
  out.push(included.join('\n'));
  out.push('```');
  return `${out.join('\n')}\n`;
}

// ── Comments ───────────────────────────────────────────────────────────────

function rangeLabel(c) {
  if (c.hunk === null) return 'whole file';
  const parts = [];
  if (c.newFrom !== null) parts.push(c.newFrom === c.newTo ? `new line ${c.newFrom}` : `new lines ${c.newFrom}–${c.newTo}`);
  if (c.oldFrom !== null) parts.push(c.oldFrom === c.oldTo ? `old line ${c.oldFrom}` : `old lines ${c.oldFrom}–${c.oldTo}`);
  return parts.join(', ');
}

function quotedLines(c, files) {
  if (c.hunk === null) return null;
  const file = files.find((f) => f.path === c.path);
  const hunk = file?.hunks[c.hunk];
  if (!hunk) return null;
  return hunk.lines.slice(c.lineFrom, c.lineTo + 1).map((l) => `${l.kind}${l.text}`).join('\n');
}

const VERBS = {
  existing: 'PR review comment',
  new: 'PR review comment',
  revised: 'PR review comment revised',
  withdrawn: 'PR review comment withdrawn',
};

/** One comment as the companion reads it. `action` is new | revised |
 *  withdrawn for messages, existing for the brief. */
export function formatComment(c, files, action) {
  const out = [];
  out.push(`${VERBS[action]} — \`${c.path}\`, ${rangeLabel(c)}`);
  const quoted = quotedLines(c, files);
  if (quoted !== null && action !== 'withdrawn') {
    out.push('');
    out.push('```diff');
    out.push(quoted);
    out.push('```');
  }
  out.push('');
  out.push(action === 'withdrawn' ? `Withdrawn: ${c.text.split('\n')[0]}` : c.text);
  return `${out.join('\n')}\n`;
}

/** Deliver one message to the companion node. Resolves to null on success or
 *  a one-line failure detail; never throws, so the review surface stays up. */
export function sendToCompanion(nodeId, body) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn('crtr', ['node', 'message', 'send', '--to', nodeId], { stdio: ['pipe', 'ignore', 'pipe'] });
    } catch (error) {
      resolve(error instanceof Error ? error.message : String(error));
      return;
    }
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', (error) => resolve(error.message));
    child.once('close', (code) => resolve(code === 0 ? null : (stderr.trim().split('\n').pop() || `crtr exited ${code}`)));
    child.stdin.end(body);
  });
}
