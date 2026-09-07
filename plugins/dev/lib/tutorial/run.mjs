// Tutorial leaf implementations for the `dev` plugin.
//
// The track leaves are PROMPT SERVERS: each invocation returns one lesson as
// instruction-shaped prose the teaching agent acts on, plus the exact command
// for the next step. They hold no progress state — the agent tracks where it is
// in its own conversation, which is where that belongs, and which is what makes
// `--step` safe to jump with.
//
// Scenarios build disposable canvas state so the graph and inbox lessons have
// something real to point at. They drive the PUBLIC `crtr` CLI rather than any
// crouter internal, because a plugin is an external command source and the CLI
// is the only contract it is entitled to. Everything created is recorded in one
// ledger, and teardown removes exactly what that ledger names.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { lessonsFor, tableOfContents } from './lessons.mjs';

export class TutorialError extends Error {
  constructor(code, message, next) {
    super(message);
    this.code = code;
    this.next = next;
  }
}

// Tracks

const TEACHING_CONTRACT = [
  'Teach this conversationally, in your own words — do not paste this lesson at the user.',
  'Ask before you change anything on their machine, and show the exact diff you propose.',
  'Let the user actually try each thing and confirm it worked before you move on.',
].join(' ');

export function runTrack(track, input) {
  const lessons = lessonsFor(track);
  const total = lessons.length;
  const raw = input.step;
  const step = raw === undefined || raw === null ? 1 : Number(raw);
  if (!Number.isInteger(step) || step < 1 || step > total) {
    throw new TutorialError(
      'step_out_of_range',
      `--step must be between 1 and ${total} (got ${String(raw)})`,
      `Run \`crtr dev tutorial ${track} -h\` to see the contents, then pick a lesson in range.`,
    );
  }
  const lesson = lessons[step - 1];
  const next = step < total ? `crtr dev tutorial ${track} --step ${step + 1}` : undefined;
  return {
    track,
    step,
    total,
    title: lesson.title,
    body: lesson.body,
    ...(next === undefined ? {} : { next }),
    teaching_contract: TEACHING_CONTRACT,
    ...(step === 1 ? { contents: tableOfContents(track) } : {}),
  };
}

// Scenario definitions

const SCENARIOS = {
  'idle-nodes': {
    title: 'Three idle nodes on the canvas',
    teaches: 'the graph lesson — j/k navigation is unteachable against a single row',
    builds: 'three independent nodes that never run a turn, so they cost nothing',
  },
  'pending-ask': {
    title: 'A question waiting in the inbox',
    teaches: 'the inbox lesson — reading a pending item and answering it',
    builds: 'one durable pending request in the human inbox',
  },
};

function scenarioDef(id) {
  const def = SCENARIOS[id];
  if (def === undefined) {
    throw new TutorialError(
      'unknown_scenario',
      `no tutorial scenario named '${id}'`,
      `Known scenarios: ${Object.keys(SCENARIOS).join(', ')}. Run \`crtr dev tutorial scenario list\` for what each one builds.`,
    );
  }
  return def;
}

// Ledger

function ledgerPath() {
  return join(homedir(), '.crouter', 'dev-tutorial-scenarios.json');
}

function readLedger() {
  try {
    return JSON.parse(readFileSync(ledgerPath(), 'utf8'));
  } catch {
    return {};
  }
}

function writeLedger(ledger) {
  const path = ledgerPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(ledger, null, 2)}\n`);
}

// crtr invocation

/** Run a `crtr` subcommand with --json and parse its result. The plugin is an
 *  external command source, so the public CLI is the only surface it may use. */
function crtrJson(args) {
  let stdout;
  try {
    stdout = execFileSync('crtr', [...args, '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    const detail = (error.stderr ?? error.message ?? '').toString().trim();
    throw new TutorialError(
      'crtr_command_failed',
      `\`crtr ${args.join(' ')}\` failed: ${detail}`,
      'Check that the crtr daemon is running, then retry.',
    );
  }
  try {
    return JSON.parse(stdout);
  } catch {
    throw new TutorialError(
      'crtr_output_unparsed',
      `\`crtr ${args.join(' ')}\` did not return JSON`,
      'Report this with `crtr sys feedback` — the command contract changed.',
    );
  }
}

// Build

function startIdleNodes() {
  const names = ['tutorial-demo-one', 'tutorial-demo-two', 'tutorial-demo-three'];
  const nodes = [];
  for (const name of names) {
    // --root --no-kickoff is the only zero-cost create the public CLI offers:
    // the broker boots and the row renders, but no turn ever runs. It also
    // forces independent roots rather than a parent/child tree, which is why
    // the graph lesson teaches j/k here and defers h/l to real work.
    const created = crtrJson(['node', 'new', '--root', '--no-kickoff', '--name', name]);
    nodes.push(created.node_id);
  }
  return { started: new Date().toISOString(), nodes };
}

const DEMO_PAGE = [
  'export default function TutorialAsk() {',
  '  return (',
  '    <Page title="A question from the tutorial" subtitle="This is what an agent waiting on you looks like.">',
  '      <UserQuestion',
  '        id="answer"',
  '        label="Which of these should the tutorial cover next?"',
  '        body="Nothing depends on this answer — it exists so you can practice responding to a real inbox item."',
  '        mode="single"',
  '        options={[',
  "          { id: 'orchestration', label: 'Delegating work to other agents' },",
  "          { id: 'memory', label: 'Teaching it my preferences' },",
  "          { id: 'done', label: 'Nothing — I want to start working' },",
  '        ]}',
  '      />',
  '    </Page>',
  '  );',
  '}',
].join('\n');

function startPendingAsk() {
  const dir = mkdtempSync(join(tmpdir(), 'crtr-tutorial-'));
  const file = join(dir, 'request.json');
  try {
    writeFileSync(
      file,
      JSON.stringify({
        page: { dialect: 'jsx', source: DEMO_PAGE },
        delivery: { placement: 'inline' },
        source: { askedBy: 'crtr dev tutorial', sessionName: 'tutorial' },
      }),
    );
    const created = crtrJson(['human', 'request', 'create', '--request-file', file]);
    return { started: new Date().toISOString(), requests: [created.request_id] };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Scenario leaves

export function scenarioList() {
  const ledger = readLedger();
  const scenarios = Object.entries(SCENARIOS).map(([id, def]) => ({
    id,
    title: def.title,
    teaches: def.teaches,
    builds: def.builds,
    standing: ledger[id] !== undefined,
  }));
  return { scenarios, standing: scenarios.filter((s) => s.standing).length };
}

export function scenarioStart(input) {
  const id = input.scenario;
  scenarioDef(id);
  const ledger = readLedger();
  if (ledger[id] !== undefined) {
    throw new TutorialError(
      'scenario_already_standing',
      `the '${id}' scenario is already standing (started ${ledger[id].started})`,
      `Run \`crtr dev tutorial scenario clean ${id}\` first, then start it again.`,
    );
  }
  const record = id === 'idle-nodes' ? startIdleNodes() : startPendingAsk();
  ledger[id] = record;
  writeLedger(ledger);
  return {
    scenario: id,
    ...(record.nodes === undefined ? {} : { nodes: record.nodes }),
    ...(record.requests === undefined ? {} : { requests: record.requests }),
    clean_with: `crtr dev tutorial scenario clean ${id}`,
    look_at: id === 'idle-nodes' ? 'Open the graph with `Alt+C` then `g`.' : 'Open the inbox with `Alt+I`.',
  };
}

export function scenarioClean(input) {
  const id = input.scenario;
  scenarioDef(id);
  const ledger = readLedger();
  const standing = ledger[id];
  if (standing === undefined) return { scenario: id, was_standing: false };

  let closedNodes = 0;
  let canceledRequests = 0;
  for (const nodeId of standing.nodes ?? []) {
    crtrJson(['node', 'lifecycle', 'close', '--node', nodeId]);
    closedNodes += 1;
  }
  for (const requestId of standing.requests ?? []) {
    crtrJson(['human', 'request', 'cancel', requestId, '--reason', 'Tutorial scenario cleaned up.']);
    canceledRequests += 1;
  }
  delete ledger[id];
  writeLedger(ledger);
  return { scenario: id, was_standing: true, closed_nodes: closedNodes, canceled_requests: canceledRequests };
}
