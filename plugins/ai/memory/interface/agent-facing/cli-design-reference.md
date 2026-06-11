---
kind: knowledge
when-and-why-to-read: When you are applying the cli-design skill and follow its pointers to worked examples, the full catalog, or the annotated reference, this reference should be read because it holds the deep-dive material the skill body links to.
short-form: Deep-dive companion to the cli-design skill — worked examples and the full catalog the skill body points to.
system-prompt-visibility: none
file-read-visibility: none
---
# Annotated Example: `crtr`

A worked example of the patterns from [cli-design.md](cli-design.md). `crtr` is a fictional agentic planning runtime — plans get decomposed into tasks, tasks get claimed by spawned workers, workers emit results.

The example surfaces every major pattern from the guide: root structure, branch nodes with dynamic content, synchronous mutators, long-running spawns, paginated queries, and streaming output. Annotations after each block flag the design choices.

---

## Root

```
$ crtr -h
crtr: agentic planning runtime.

<command name="plan">
durable intent, decomposed into tasks
use when shaping work
</command>

<command name="task">
leaf unit of work, claimed against a plan
use when executing work
</command>

<command name="job">
a running worker, executing a claimed task
use when monitoring or collecting
<jobs count="3">
`crtr job list` to see them; `crtr job result ID` to collect
</jobs>
</command>

<command name="state">
the world the runtime sees
use when reasoning about the system
</command>

Globals
  help    print -h for any node or leaf

I/O contract: flags and positional args on input; stdout is agent-ready markdown/XML you
act on directly — read it as a continuation of your prompt, don't parse it as data.
Exit 0 on success, non-zero on failure. Schemas appear at leaf -h.
```

- Each subtree is one `<command name="…">` block: its concept (what it is) on the first line, its selection rubric (`use when …`) on the second, and any live state nested below. The uniform wrapper *states* "this is a command, invoked as `crtr <name>`" — the model reads them by one rule instead of inferring command-ness from six different tag names, and a nested state element (never a `<command>`) can't be misread as a sibling command.
- Root hardcodes none of this. It owns the tagline, globals, and I/O contract; every command block — concept, rubric, state tag, and dynamic block — is declared by the subtree it describes and *assembled* here (principle 16). Adding a subtree surfaces its block at root automatically.
- State lives with the command it describes: the running-jobs block nests inside `<job>`, not in a shared section elsewhere. Reading a command means reading its current state in the same breath (principle 17).
- The state block is a self-named element — the tag (`<jobs>`) carries the label and the count is an attribute (`count="3"`), so the body never repeats either; the body is just how to collect. That same element appears identically at root and at `crtr job -h`. When `-h` is consumed inside a system prompt, each command block is a fenced domain the model reads as one unit; the nested element reads as *current state*, not standing instructions. Two levels of nesting max (`<command>` → `<state>`); the consuming harness adds at most one outer guide tag (e.g. `<crtr-tool-guide>`) (principle 18).
- The `<jobs>` block is aggregate, not enumerated: running jobs are volatile and unbounded, so it carries a count attribute plus how to collect, never the list (principle 15). Falls back to omission when the backend is unreachable.
- I/O contract is stated once. Never repeated downstream.
- Globals appears once. Currently only `help`; the section exists so the agent learns the convention.

---

## Branch node

```
$ crtr plan -h
plan: durable intent, decomposed into tasks.

<plans draft="2" active="1" handed-off="4"/>

Lifecycle: draft -> active -> handed-off.

Branches
  new       draft a plan from raw intent      | use when starting fresh work
  show      read a plan by id                  | use when reasoning about an existing plan
  handoff   submit a finished plan upstream    | use after all child tasks reach `done`
```

- Dynamic content leads here too: the state element renders right after the name, *before* the hardcoded model line, so the live distribution is read first (principle 17). It is the subtree's own self-named element — here `<plans>` with the distribution carried as attributes (scalars belong in attributes; only prose and lists go in element bodies) — the same element the block carries when it appears at root (principle 18).
- The model line (lifecycle) extends the root's definition, not redefining it. It follows the state block: state is what's true now, the model is the standing shape.
- Dynamic content: state distribution. Pre-empts a separate `state show` call for the common case. Aggregates only — at 4000 plans it would still read "2 draft, 1 active, 3997 handed-off," never enumerate.
- Falls back to static (omitting the `<runtime-state>` block) when the backend is unreachable.
- Branch format places the selection discriminator inline. No trailing paragraphs.

---

## Synchronous mutator

```
$ crtr plan new -h
plan new: create a draft plan from intent. Reads intent from stdin.

Input
  stdin              required. One paragraph describing desired outcome.
                     Treated as the planner's north star; not parsed further.
  --context-file PATH  optional. Path to a text file with additional facts the
                     planner treats as ground truth. Use for constraints, prior
                     decisions, or environmental assumptions. Hard cap: 8k tokens.
  --parent-id ID     optional. Must reference a plan in `active` state.

Output (fields carried in the rendered result)
  id          string. Plan id. Use with crtr plan show and crtr task *.
  task_ids    string[]. Generated tasks in topological order (parents first).
              Order is the only safe claim sequence.

Effects
  Persists a plan in `draft` state.
  Generates tasks in `draft` state. Tasks become claimable when the plan
  transitions to `active` (automatic on first crtr task claim).
```

- Constraints (required, "must reference active plan," "8k tokens") live inline with each parameter. No separate `Preconditions` section.
- Stdin carries the primary content blob (the intent prose). Atomic parameters are flags; long-form text goes through `--context-file` rather than a value flag.
- Output fields carry *useful properties* of return values, not just types. `task_ids` in topological order is what makes downstream claiming safe.
- Effects pre-empts the likely wrong next move: claiming a task before the plan transitions to active.

---

## Long-running spawn

```
$ crtr task claim -h
task claim: claim a draft task and spawn a worker. Returns immediately.

Input
  TASK_ID                positional, required. Task in `draft` state.
  --worker NAME          optional. Worker template. Default: matches task.kind.
  --context-file PATH    optional. Path to a JSON file with additional facts
                         injected into the worker's prompt. Object shape;
                         worker-template-specific keys.

Output (fields carried in the rendered result)
  job_id      string. Use with crtr job logs, crtr job result, crtr job status.
  task_id     string. Echo of input.
  worker      string. Template selected.
  follow_up   string. Recommended next action. Typical:
              `crtr job result <job_id> --wait` to block until the worker
              emits a result.

Effects
  Marks task `claimed`. Spawns a worker process.
  Allocates a log file at $XDG_STATE_HOME/crtr/jobs/<job_id>.log.
  On termination, a result file appears atomically at <job_id>.result.json.
  Worker runs until termination or cancellation.
```

- `task_id` is the obvious primary target, so it's positional. Everything else is a flag.
- `--context-file` takes a path because the value is a structured JSON object; the leaf's `-h` documents the file's shape.
- The kickoff result is a *handle*, not the work itself. Returns in milliseconds.
- `follow_up` tells the agent the recommended next call as a literal command string. Cheaper than the agent rederiving it from scratch.
- Effects names every persistent change. Paths are informational — the agent reads via `crtr job`, not the filesystem directly.
- No `--wait` flag on `claim`. If the agent wants to block, it composes: `claim` then `job result --wait`. The primitive stays simple; composition handles policy.
- `claim` is a verb on `task` — the producer — and it *creates* a job; `crtr job` stays the producer-agnostic monitoring surface (logs/result/status/cancel). If a second producer of jobs appeared (a scheduler, a queue), it would compose with the same `crtr job` leaves rather than wedging its creation verbs into `job`. See *Creator verbs on the primitive* in SKILL.md.

---

## Paginated list — simple pattern

The simplest list shape: every item carries only the discriminators the agent uses to pick the next call. There's no payload toggle, so the leaf has nothing to advertise beyond the canonical drill-in.

```
$ crtr task list -h
task list: filtered, paginated list of tasks.

Input
  --plan-id ID         optional. Restrict to one plan.
  --status STATE       optional. One of: draft, claimed, done, failed. Omit for all.
  --worker NAME        optional. Restrict to tasks claimed by a specific worker.
  --limit N            optional. Default 20, max 100.
  --cursor TOKEN       optional. Opaque token from a previous response's next_cursor.
                       Omit on the first call.

Output (fields carried in the rendered result)
  items       object[]. Each: {id, plan_id, status, worker?, created_at}.
              Sorted by created_at ascending. Stable order across pages.
  next_cursor string | null. Pass on the next call to continue. null means no more.
  total       integer | null. Total matching the filter when cheap to compute.
              May be null for large or filtered result sets; do not retry to force it.
  follow_up   string. "Use `crtr task show <id>` for full task content."
```

- All filters are flags; no positional because there is no single obvious target.
- The whole response is one value, so it's a single rendered response, not a stream. Streaming is for incremental emission over time.
- Cursor is opaque — the runtime owns its encoding. Resilient to inserts and deletes between pages.
- `--limit` has a default and a hard cap. Agents can't accidentally pull 10k results.
- `next_cursor: null` is the only end-of-list signal. No separate `has_more` flag.
- `total` is nullable because exact counts on filtered sets are expensive at scale. Better to expose the truth than to lie.
- Sort order is part of the contract. Resumption requires it.
- Items carry only structural fields — id, plan_id, status, worker, created_at. The heavier payload (prompt text, accumulated summaries, worker output) sits behind `crtr task show <id>`. Per Principle 19, that payload would otherwise multiply by `--limit`; composition keeps the cost paid only for the one item that mattered.
- `follow_up` is a single concrete pointer at the detail leaf. No `-h` reference because this leaf has no payload toggle and no filters worth re-advertising — they're already visible in this `-h` output the agent just rendered.

---

## Paginated search — rich pattern (filters + opt-in payload)

When inline payload genuinely speeds selection, gate it behind `--full`, default it off, pair it with a small `--limit` and filters, and route `follow_up` at `-h` instead of enumerating the option surface.

```
$ crtr plan search -h
plan search: rank plans by text in intent and task summaries. Returns hits in score order.

Input
  QUERY              positional, required. Whitespace-separated terms matched case-insensitively
                     against intent and task summaries; plans matching more terms rank higher.
  --status STATE     optional. One of: draft, active, handed-off. Omit for all.
  --since ISO        optional. ISO 8601 timestamp. Restrict to plans created at or after.
  --limit N          optional. Default 5, max 50.
  --cursor TOKEN     optional. Opaque token from a previous response's next_cursor.
  --full             optional boolean. When present, each hit includes the full intent paragraph
                     and matched task summaries. Off by default; pair with --limit to bound cost.

Output (fields carried in the rendered result)
  hits         object[]. Each: {id, status, score, headline}. Sorted by score descending.
               headline is a one-line excerpt drawn from intent — the always-cheap discriminator.
               With --full, each hit also contains: {intent, matched_summaries[]}.
  next_cursor  string | null. null means no more hits.
  follow_up    string. "Use `crtr plan show <id>` for the full plan with task tree.
                Run `crtr plan search -h` for filters and verbosity."
```

- Default hits include `headline` because it's bounded per-item (one short sentence) and is the discriminator the agent needs to pick. The full intent paragraph is 200–500 tokens — it stays out unless the agent opted in.
- `--full` is the opt-in payload toggle. Default off; with default `--limit` of 5, even `--full` stays bounded. Together they cap cost in both axes before the agent commits.
- `--limit` default is small (5) because this is a ranked search — the top few are usually all the agent reads. `task list` defaulted to 20 because enumeration over a known plan often wants the full set.
- `follow_up` does not enumerate `--status`, `--since`, `--full`, or any other flag. Listing them inline would multiply per-call cost; `-h` is already the canonical reference and the agent can render it on demand. The `plan show <id>` pointer stays because it's a different command tree the agent wouldn't find by re-reading this `-h`.
- The contrast with `task list`: `task list` has no payload-toggle, so `follow_up` is a single pointer. `plan search` adds `--full` and a richer filter set, so `follow_up` adds the `-h` route.

---

## Streaming output

```
$ crtr job logs -h
job logs: read log events from a job. Emits one record per line.

Input
  JOB_ID            positional, required. Job id from crtr task claim.
  --since ISO       optional. ISO 8601 timestamp. Only emit events at or after.
  --until ISO       optional. ISO 8601 timestamp. Only emit events before.
  --level LEVEL     optional. Minimum severity: debug, info, warn, error.
                    Default: info. Lower severities are dropped.
  --follow          optional boolean. When present, stream new events as they're
                    appended until the job terminates, then close stdout.

Output (one record per line, emitted incrementally)
  One self-contained event record per line. Each carries:
    ts        string. ISO 8601 timestamp.
    level     string. debug | info | warn | error.
    event     string. Stable event type (e.g. "worker_started", "tool_call",
              "tool_result"). Vocabulary is small and bounded.
    message   string. Human-readable summary.
    data      object, optional. Event-specific structured payload.

Effects
  None. Read-only.
```

- `job_id` is the obvious primary target — positional. Everything else is a flag.
- `--follow` is a boolean flag: present means true, absent means false. No `--no-follow`.
- Streamed because events are emitted incrementally. Each line is a self-contained record, independently parseable — a partial read still yields whole records.
- Without `--follow`, returns historical events from the file and exits. With `--follow`, continues streaming until the job terminates. The agent picks the mode.
- `--level` defaults to `info`, dropping debug noise from the default reading path. Agents asking explicitly for debug get it.
- `event` is a stable vocabulary the agent can branch on — separate from the free-form `message`. Code reads `event`; logs read `message`.
- Effects explicitly states "None. Read-only." Worth declaring rather than leaving silent — confirms the agent can call freely without side effects.

---

## Patterns demonstrated

| Pattern | Example | Guide section |
|---|---|---|
| Root structure | `crtr -h` | The tree |
| Parent-level representation assembled from children | `crtr -h` listing + `Jobs:` block | Principle 16, Each node owns its parent-level representation |
| Subtree-contributed dynamic block at root | `crtr -h` `Jobs:` line | Each node owns its parent-level representation |
| Branch node with dynamic content | `crtr plan -h` | The tree, Dynamic `-h` |
| Selection rubric | All branch listings | Principles 5, The tree |
| Synchronous mutator | `crtr plan new` | The tree |
| Stdin as content blob | `crtr plan new` intent | I/O contract |
| File-path flag for structured input | `crtr plan new --context-file` | I/O contract |
| Positional + flags | `crtr task claim`, `crtr job logs` | I/O contract |
| Long-running operation | `crtr task claim` | Long-running operations |
| Sidecar result file | `crtr task claim` effects | Long-running operations |
| Paginated list (simple, follow_up → show-leaf) | `crtr task list` | Pagination, Principle 19 |
| Paginated search (rich, --full opt-in, follow_up → -h) | `crtr plan search` | Pagination, Principle 19 |
| Streaming output | `crtr job logs` | I/O contract |
| Boolean flag | `crtr job logs --follow` | I/O contract |
| Read-only declaration | `crtr job logs` effects | Principle 9 |
| Inline field constraints | All leaves | The tree |
| Effects as contract | All leaves | Principle 9 |
