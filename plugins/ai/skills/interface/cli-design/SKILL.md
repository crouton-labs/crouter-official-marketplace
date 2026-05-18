---
name: cli-design
description: Design CLIs for humans and LLM agents — subcommand shape, output streams, exit codes, JSON modes, TTY-aware color, structured errors, mutation safety. Use when building or refactoring a CLI, adding machine-readable output, writing --help, deciding stdout vs stderr, or making a tool agent-friendly.
type: playbook
keywords: [cli, agent-friendly, exit-codes, stdout-stderr, json-output, tty]
---
# CLI Design for Agents

A CLI consumed only by an agent is a different artifact from one used by a human. The agent reads every token; there's no skimming, no tab completion, no visual scanning. `-h` is the only documentation that gets read. Output is parsed, not displayed. Shell ergonomics that matter for humans (color, pagers, interactive prompts, terseness for typing) are noise to an agent; the things that matter for agents (deterministic output, structured errors, complete specs at `-h`, cheap discovery) are afterthoughts in human-first CLIs.

This guide treats the single-reader-is-an-agent case as the design target. Human ergonomics are absent intentionally, not by oversight.

This file is the spec. **`reference.md` (sibling) is the spec applied** — a fully worked, annotated CLI (the fictional `crtr` runtime) with every pattern below instantiated and each design choice called out. Read it when you need a concrete instance of any rule here: root/branch/leaf shape, dynamic `-h`, long-running spawns, pagination, JSONL streaming. Design from the principles; consult `reference.md` for what a correct realization looks like.

## Principles

1. **Context is the scarce resource.** Every token in `-h` permanently costs budget for the rest of the agent's task. Minimize *tokens-to-correct-invocation*.

2. **Information must precede invocation.** If a leaf can fail because the agent lacked information, the design failed — not the agent. World-state failures (network, contention, race) are a separate category.

3. **Spec, not example.** Examples invite pattern-matching, which is lossy and bias-prone. A complete schema with semantic constraints is shorter and more reliable.

4. **Standard input, structured output.** Parameters arrive via flags and positional arguments. Stdout is JSON for single responses, JSONL for streams; no format negotiation, no `--text` mode, no plain-text alternative.

5. **Selection is the work.** Agents spend more cognition choosing the right leaf than constructing the invocation. The selection rubric at each node is the highest-leverage content in the tree.

6. **The tree is an API surface.** Subcommand structure is the agent's mental map. Design it like a public API: orthogonal, minimal, named for concepts. One canonical name per operation, no aliases.

7. **Noun-verb structure. Verbs always last.** `tool plan new`, not `tool new plan`. For deeper trees, nest more nouns: `tool plan task list` reads cleanly. An agent's reasoning composes noun-first ("I need to do something to a plan") and then picks the verb. Verb-first forces selection without an object in hand.

8. **5–7 children per node, hard cap.** Past that, the selection space stops fitting in working context. The fix is always the same: introduce a sub-noun. If you have 12 verbs on one noun, you have two nouns hiding.

9. **Effects are part of the contract.** Anything the world remembers after invocation — state changes, spawned processes, persisted files — is declared at the leaf.

10. **Output is input.** Stdout is the next caller's stdin. Typed contract, not display. Deterministic order, no decoration.

11. **Redundancy is leakage.** Each fact lives at the highest applicable node and is never restated. Globals appear only at root.

12. **Errors carry recovery information.** Every failure says what was received, what was expected, and what to do next.

13. **State is passed, not smuggled.** No command silently depends on another's side effects.

14. **Long-running operations return a pointer, not a wait.** Operations exceeding a couple of seconds return a handle immediately. Progress accumulates in a log file. Final result writes atomically to a sidecar.

15. **Dynamic content never balloons.** `-h` content reflecting runtime state has a per-node token budget. Aggregates only; never enumerates.

16. **List output is for selection, not consumption.** Per-item field count multiplied by result count is the agent's token cost — a 200-token field across 20 hits is 4k tokens spent choosing which item to read in full. Default lists carry only the discriminators the agent uses to pick the next call: ids/names, status, ranking, and *one* short field that distinguishes hits (a description, headline, or summary). Heavier payload (full bodies, prompts, all keywords/metadata) lives one composition step away behind a sibling leaf (`show`, `read`).

    Inline bulk content is allowed when it genuinely speeds selection, but gate it behind an opt-in flag (`--full`, `--with-bodies`) — off by default, paired with a small `--limit` default and filtering flags so the agent can bound cost in both axes before opting in. Every list leaf attaches a top-level `follow_up` string. When the leaf is a simple primitive with no payload toggle and no filtering flags worth advertising, `follow_up` names the detail leaf (`Use \`tool noun show <id>\` for full content.`). When the leaf has filters or a `--full`-style toggle, `follow_up` points at `-h` instead of enumerating them inline (`Run \`tool noun search -h\` for filters and verbosity.`). Inline enumeration multiplies per-call cost; `-h` is the canonical reference.

---

## The tree

Three node types: root, branch nodes, leaves.

**Root** establishes vocabulary and the I/O contract. Lists subtrees with selection discriminators. Lists globals once. States the input-via-flags / JSON-on-stdout convention once.

**Branch nodes** extend the parent's definition with a *local model* — short prose orienting the agent to what the subtree contains, how children differ, and what each child is for — followed by the children list in `name short-description | use when X` form. The local model describes *what's inside and why an agent would descend into each child*, never whether the agent should be at this branch in the first place: by the time `-h` runs, that decision is past, so entry-gating prose ("run only when…") wastes the slot. Depth lives on the leaves, reachable via `-h` from here; the branch model points the agent at the right one. May include bounded dynamic content (state counts, aggregate signals) that pre-empts downstream calls.

**Leaves** are the action surface. Each leaf declares:
- One-line summary.
- Input schema, with semantic constraints inline on each parameter. Flags, positional args, and stdin are all parameters and live in the same schema block.
- Output schema, with *useful properties* of return values (sort order, semantic meaning), not just types.
- Effects — every persistent change in the world.

Subcommand path is the navigation; flags and positional args are the parameters.

### Branch format

```
Branches
  name      short description    | use when X
```

The `| use when X` portion is the selection rubric. It's higher-leverage than the description because the question the agent is answering is "would I pick this?" not "what does this do?" Once the agent picks a branch, the leaf's own `-h` answers "what does this do?" in depth.

### Node sizing

A node with 5–7 children fits in working context. Past that, selection rubrics stop differentiating — too many similar lines. Always split into sub-nouns:

Wrong: `tool task claim, done, list, show, abandon, retry, restart, archive, export, import`.

Right: `tool task lifecycle {claim, done, abandon, retry}` and `tool task inspect {show, list, export}`.

---

## I/O contract

**Input.** Flags and positional arguments. Required, optional, and semantic constraints all live in the leaf's `-h`.

- *Positional argument* — at most one per leaf, used only when the leaf has an obvious primary target (a plan id, a task id, a file path). When in doubt, use a flag.
- *Flags* — long-form only (`--task-id`, `--limit`). No short aliases. Boolean flags take no value (`--follow`), set to true when present. Repeatable flags (`--tag foo --tag bar`) appear as arrays in the leaf's input schema.
- *Stdin* — reserved for piped content blobs (a document body, a prompt, raw text). If the leaf accepts stdin, the schema names it `stdin` alongside the flags and states what kind of content is expected.
- *Structured input* — when a parameter is itself structured (an object, a heterogeneous array), accept it as a path to a JSON file: `--context-file PATH`. The leaf's `-h` states the file's JSON shape.

**Output.**

- *Single-shot operations* (`plan new`, `task list`, `job status`) — one JSON object on stdout. The whole response is one value.
- *Streams* (`job logs --follow`, anything emitting events over time) — JSONL. One complete JSON object per line, newline-delimited. Partial reads don't break parsing. No closing bracket to wait for.

A paginated list is not a stream — it's a single response containing many items. JSONL is for incremental emission over time, not for "a lot of stuff at once."

**Stderr.** In-flight diagnostic output the agent may capture if it wants. Never carries the result. Contract test: `cmd > /dev/null` should hide all of the result; `cmd 2> /dev/null` should hide only diagnostic chatter.

**Exit codes.** 0 on success, non-zero on failure. Specific non-zero codes are worth defining only if the agent will branch on them — almost never in practice. The structured error payload is what the agent reads.

---

## Errors

An error is feedback for correction. Opaque errors produce retry loops; structured errors produce recovery. Every error includes:

- **What was received.** The input the agent gave.
- **What was expected.** The constraint that wasn't met.
- **What to do next.** A concrete action.

Shape (in the JSON response when the failure is at the command level, on stderr when the failure is at the runtime level):

```json
{
  "error": "invalid_status",
  "message": "status must be one of: draft, claimed, done, failed",
  "received": "drafted",
  "field": "status",
  "next": "Retry with one of the listed values, or omit to include all statuses."
}
```

The `error` field is a stable string the agent can branch on. The `message` is for the human reading the agent's logs. `next` is the road sign.

Internal failures — panics, unhandled exceptions — never reach the agent raw. Wrap as `{"error": "internal", ...}` with a stable code. Full traces gate behind an explicit debug invocation, not stderr leakage.

---

## Long-running operations

Anything exceeding a couple of seconds separates kickoff from collection.

1. **The kickoff leaf returns a job handle immediately.** Under a second. Output JSON includes `job_id`, anything immediately known about the spawn, and a `follow_up` string telling the agent the recommended next call.

2. **Progress accumulates in a structured log file** at `$XDG_STATE_HOME/<tool>/jobs/<job_id>.log`. Each line is a JSON event with at minimum:
    - `ts` — ISO 8601 timestamp.
    - `level` — `debug | info | warn | error`.
    - `event` — short stable string identifying the kind of event.
    - `message` — human-readable summary.
    - Event-specific structured payload as needed.

3. **The final result writes atomically to a sidecar** at `<job_id>.result.json`. Appearance of the file is the terminal signal. No scanning logs for a sentinel.

4. **A separate subtree reads both.** Typically `tool job` with:
    - `logs` — stream JSONL from the log file (optionally filtered or followed).
    - `result` — read the sidecar; optional `wait` field blocks until appearance.
    - `status` — `live | done | failed | canceled`, plus age and last-event signals.
    - `cancel` — best-effort.

5. **Files are the source of truth.** No in-memory job registry to lose. An agent can pick up an existing job by id without coordination. Crashes recover by reading files.

`cancel` is best-effort: some workers expose cancellation hooks, others run to completion. Success means the signal was delivered, not that execution stopped. Worth knowing internally; not worth doc tokens at the call site.

---

## Pagination

Any leaf returning a list takes:
- `limit` — integer, with default and hard max.
- `cursor` — opaque string from a previous response's `next_cursor`, omitted on first call.

Returns:
- `items` — the page, sorted by a stable field (sort order is part of the leaf's contract).
- `next_cursor` — string or null. Null is the only end-of-list signal.
- `total` — nullable integer. Exact when cheap; null when expensive on filtered or large result sets.

Cursor-based, not page-numbered: stable under inserts and deletes between pages. Cursor is opaque — the runtime owns its encoding, the agent treats it as a token.

---

## Dynamic `-h`

`-h` may include content reflecting runtime state when it earns its tokens — typically a state-distribution summary on a branch node. Constraints:

- **Bounded by a token budget per node.** When data exceeds the budget, aggregate.
- **Never enumerate.** Listing 4000 plans by id in `-h` is a failure mode. Counts and aggregate signals only.
- **Fail soft.** When the backend is unreachable, fall back to static `-h` with a note that the snapshot is unavailable. Discovery breaking because state is unreachable is a worse failure mode than slightly less informative `-h`.

The test for whether dynamic content earns its slot: does it pre-empt a call the agent would otherwise make? Counts of plans by state save a separate `state show` call. A list of currently-running jobs would not — it unbounds quickly and is better fetched explicitly.

---

## Anti-patterns

Each is a real failure mode.

- **stdout pollution.** Status messages, progress indicators, or decorations on stdout corrupt downstream parsing. All of it belongs on stderr or in the log file.
- **Decorated JSON.** Table borders, banners, ANSI escapes inside structured output. Plain JSON only.
- **Plain-text output modes.** No "friendly" alternative format. The agent doesn't need one; supporting it forks the surface.
- **Stack traces leaked raw.** Internal panics surface as opaque noise. Wrap as structured errors.
- **Smuggled state.** Command B depending on `cd`, env, or a hidden cache from command A. Pass state explicitly.
- **Auto-launching pagers, interactive prompts, TTY-detection-dependent behavior.** There is no terminal; these hang the agent.
- **Aliases.** Same operation under multiple names forces the agent to memorize three things for one operation. Pick one canonical name.
- **Short flag aliases.** `-t` for `--task-id` saves a human three keystrokes; for an agent it doubles the name surface — two strings to remember for one parameter, two strings to grep across docs. Long-form only.
- **Inline structured values.** `--filter '{"status":"open"}'` breaks under shell quoting. Structured parameters take a file path; the leaf's `-h` documents the file's shape.
- **Color, TTY detection, terminal-width truncation.** No reader needs any of it. Truncation silently corrupts machine consumption.
- **Fuzzy-match "did you mean" suggestions.** If the agent reached an invalid invocation, the discovery layer failed. Suggestions paper over the bug.
- **Unstable output order.** Random or insertion-order results break diffs and resumable pagination. Sort by a stable field.
- **Examples in `-h`.** Pattern-matching bypasses the constraint spec. The spec is the contract.
- **`--dry-run` / `--verbose` / `--quiet`.** If preview matters, it's a separate leaf (`tool plan simulate`). Severity lives in the log file.
- **`SEE ALSO`-style cross-refs.** The tree is its own cross-reference.
- **Branch help framed as an entry gate.** "Run only when X" prose in a branch node's `-h`. The decision to be at that branch already happened; the slot is for child distinctions and subtree shape, not for re-litigating whether the parent should have been invoked. Symptom: the model field reads as guidance to the *caller of the parent* rather than the *agent now choosing a child*.
- **Separate `Preconditions` sections.** Field constraints live inline with the field they apply to.

---

## A note on what's missing

This guide has no section on workflow discovery — no "common patterns," no `tool how`, no epilogue on root `-h` showing a typical call chain. That's deliberate. The tree with good selection rubrics gives the agent enough to compose workflows from primitives. Scaffolding "typical flows" couples documentation to a moment-in-time understanding of how the tool is used, ages badly, and costs tokens at every discovery step. Trust the tree.

---

## When the agent doesn't walk the tree

"Trust the tree" assumes the agent *walks* it: root → branch → leaf, reading each node's selection rubric on the way down. An agent driving a shell does not. It emits the full `tool noun verb {…}` in one shot from priors and never renders the branch node — so progressive disclosure degrades to nothing for every leaf reachable directly, which is exactly the high-consequence mutating leaves whose branch rubric (edit-vs-create, irreversibility, required structure) mattered most.

When consumption is shell-style one-shot invocation, push the branch rubric into context instead of waiting for traversal. Cheapest sufficient lever first: a scoped, *reasoned* rule in the agent's prompt — "read the leaf's `-h` before any create/update/delete/archive; reads exempt." State the why, not just the imperative; a reasoned rule survives task pressure that a bare order does not. The read-only carve-out is load-bearing: without it the rule reads as overkill on cheap commands, the model downgrades it to advisory, and the downgrade leaks to the commands that mattered.

Do not reach for a fail-closed gate (a leaf that errors until acknowledged) or a blanket preload first. Ship the scoped rule, run the actual failing scenario, and escalate to enforcement only if it empirically fails. A prompt rule is usually enough; enforcement machinery you didn't need is its own anti-pattern.
