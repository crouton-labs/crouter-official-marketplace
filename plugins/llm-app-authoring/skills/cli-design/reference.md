# Annotated Example: `crtr`

A worked example of the patterns from [SKILL.md](SKILL.md). `crtr` is a fictional agentic planning runtime — plans get decomposed into tasks, tasks get claimed by spawned workers, workers emit results.

The example surfaces every major pattern from the guide: root structure, branch nodes with dynamic content, synchronous mutators, long-running spawns, paginated queries, and JSONL streaming. Annotations after each block flag the design choices.

---

## Root

```
$ crtr -h
crtr: agentic planning runtime.

Concepts
  plan    durable intent, decomposed into tasks
  task    leaf unit of work, claimed against a plan
  job     a running worker, executing a claimed task
  state   the world the runtime sees

Subtrees
  plan    create, read, handoff plans                  | use when shaping work
  task    claim, list, inspect tasks                    | use when executing work
  job     read logs and results from running workers    | use when monitoring or collecting
  state   inspect runtime state                         | use when reasoning about the system

Globals
  help    print -h for any node or leaf

I/O contract: JSON on stdin, JSON on stdout (JSONL for streams).
Exit 0 on success, non-zero on failure. Schemas appear at leaf -h.
```

- Concepts precede subtrees because selecting a subtree requires vocabulary.
- Subtree lines include selection discriminators on the same line. This is the rubric at root level.
- I/O contract is stated once. Never repeated downstream.
- Globals appears once. Currently only `help`; the section exists so the agent learns the convention.

---

## Branch node

```
$ crtr plan -h
plan: durable intent, decomposed into tasks.
Lifecycle: draft -> active -> handed-off.
Current: 2 draft, 1 active, 4 handed-off.

Branches
  new       draft a plan from raw intent      | use when starting fresh work
  show      read a plan by id                  | use when reasoning about an existing plan
  handoff   submit a finished plan upstream    | use after all child tasks reach `done`
```

- Opening line extends the root's definition with the local model (lifecycle), not redefining it.
- Dynamic content: state distribution. Pre-empts a separate `state show` call for the common case. Aggregates only — at 4000 plans it would still read "2 draft, 1 active, 3997 handed-off," never enumerate.
- Falls back to static (omitting the `Current:` line) when the backend is unreachable.
- Branch format places the selection discriminator inline. No trailing paragraphs.

---

## Synchronous mutator

```
$ crtr plan new -h
plan new: create a draft plan from intent.

Input (stdin, JSON)
  intent      string, required. One paragraph describing desired outcome.
              Treated as the planner's north star; not parsed further.
  context     string, optional. Additional facts the planner treats as ground truth.
              Use for constraints, prior decisions, or environmental assumptions.
              Hard cap: 8k tokens.
  parent_id   string, optional. Must reference a plan in `active` state.

Output (stdout, JSON)
  id          string. Plan id. Use with crtr plan show and crtr task *.
  task_ids    string[]. Generated tasks in topological order (parents first).
              Order is the only safe claim sequence.

Effects
  Persists a plan in `draft` state.
  Generates tasks in `draft` state. Tasks become claimable when the plan
  transitions to `active` (automatic on first crtr task claim).
```

- Field constraints (required, "must reference active plan," "8k tokens") live inline with the field. No separate `Preconditions` section.
- Output fields carry *useful properties* of return values, not just types. `task_ids` in topological order is what makes downstream claiming safe.
- Effects pre-empts the likely wrong next move: claiming a task before the plan transitions to active.

---

## Long-running spawn

```
$ crtr task claim -h
task claim: claim a draft task and spawn a worker. Returns immediately.

Input (stdin, JSON)
  task_id     string, required. Task in `draft` state.
  worker      string, optional. Worker template. Default: matches task.kind.
  context     object, optional. Additional facts injected into the worker's prompt.

Output (stdout, JSON)
  job_id      string. Use with crtr job logs, crtr job result, crtr job status.
  task_id     string. Echo of input.
  worker      string. Template selected.
  follow_up   string. Recommended next action. Typical: `crtr job result` with
              stdin {"job_id": "<id>", "wait": true} to block until the worker
              emits a result.

Effects
  Marks task `claimed`. Spawns a worker process.
  Allocates a log file at $XDG_STATE_HOME/crtr/jobs/<job_id>.log.
  On termination, a result file appears atomically at <job_id>.result.json.
  Worker runs until termination or cancellation.
```

- The kickoff result is a *handle*, not the work itself. Returns in milliseconds.
- `follow_up` tells the agent the recommended next call. Cheaper than the agent rederiving it from scratch.
- Effects names every persistent change. Paths are informational — the agent reads via `crtr job`, not the filesystem directly.
- No `wait` flag on `claim`. If the agent wants to block, it composes: `claim` then `job result` with `wait: true`. The primitive stays simple; composition handles policy.

---

## Paginated query

```
$ crtr task list -h
task list: filtered, paginated list of tasks.

Input (stdin, JSON)
  plan_id     string, optional. Restrict to one plan.
  status      string, optional. One of: draft, claimed, done, failed. Omit for all.
  worker      string, optional. Restrict to tasks claimed by a specific worker.
  limit       integer, optional. Default 20, max 100.
  cursor      string, optional. Opaque token from a previous response's next_cursor.
              Omit on the first call.

Output (stdout, JSON)
  items       object[]. Each: {id, plan_id, status, worker?, created_at}.
              Sorted by created_at ascending. Stable order across pages.
  next_cursor string | null. Pass on the next call to continue. null means no more.
  total       integer | null. Total matching the filter when cheap to compute.
              May be null for large or filtered result sets; do not retry to force it.
```

- The whole response is one value, so this is JSON, not JSONL. JSONL is for incremental emission over time.
- Cursor is opaque — the runtime owns its encoding. Resilient to inserts and deletes between pages.
- `limit` has a default and a hard cap. Agents can't accidentally pull 10k results.
- `next_cursor: null` is the only end-of-list signal. No separate `has_more` flag.
- `total` is nullable because exact counts on filtered sets are expensive at scale. Better to expose the truth than to lie.
- Sort order is part of the contract. Resumption requires it.

---

## JSONL stream

```
$ crtr job logs -h
job logs: read log events from a job. Emits JSONL.

Input (stdin, JSON)
  job_id      string, required. Job id from crtr task claim.
  since       string, optional. ISO 8601 timestamp. Only emit events at or after.
  until       string, optional. ISO 8601 timestamp. Only emit events before.
  level       string, optional. Minimum severity: debug, info, warn, error.
              Default: info. Lower severities are dropped.
  follow      boolean, optional. Default false. When true, stream new events as
              they're appended until the job terminates, then close stdout.

Output (stdout, JSONL)
  One JSON event per line. Each line:
    ts        string. ISO 8601 timestamp.
    level     string. debug | info | warn | error.
    event     string. Stable event type (e.g. "worker_started", "tool_call",
              "tool_result"). Vocabulary is small and bounded.
    message   string. Human-readable summary.
    data      object, optional. Event-specific structured payload.

Effects
  None. Read-only.
```

- JSONL because events are emitted incrementally. Each line is independently parseable.
- Without `follow`, returns historical events from the file and exits. With `follow: true`, continues streaming until the job terminates. The agent picks the mode.
- `level` defaults to `info`, dropping debug noise from the default reading path. Agents asking explicitly for debug get it.
- `event` is a stable vocabulary the agent can branch on — separate from the free-form `message`. Code reads `event`; logs read `message`.
- Effects explicitly states "None. Read-only." Worth declaring rather than leaving silent — confirms the agent can call freely without side effects.

---

## Patterns demonstrated

| Pattern | Example | Guide section |
|---|---|---|
| Root structure | `crtr -h` | The tree |
| Branch node with dynamic content | `crtr plan -h` | The tree, Dynamic `-h` |
| Selection rubric | All branch listings | Principles 5, The tree |
| Synchronous mutator | `crtr plan new` | The tree |
| Long-running operation | `crtr task claim` | Long-running operations |
| Sidecar result file | `crtr task claim` effects | Long-running operations |
| Paginated query | `crtr task list` | Pagination |
| JSONL streaming output | `crtr job logs` | I/O contract |
| Read-only declaration | `crtr job logs` effects | Principle 9 |
| Inline field constraints | All leaves | The tree |
| Effects as contract | All leaves | Principle 9 |
