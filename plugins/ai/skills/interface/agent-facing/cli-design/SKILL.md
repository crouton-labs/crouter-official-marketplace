---
name: cli-design
description: Design CLIs consumed by an LLM agent (the agent is the user driving a shell, not a human at a TTY) — subcommand-tree shape, -h progressive disclosure, prompt-shaped stdout, stdout-vs-stderr, exit codes, structured errors, long-running job handles, pagination. Use when building or refactoring a CLI for an agent to drive, shaping output for a model to act on, or writing --help. For capability exposed as structured tool-calls (function calling / MCP) rather than a shell command, see tool-design.
type: playbook
keywords: [cli, agent-friendly, exit-codes, stdout-stderr, prompt-output, tty]
---
# CLI Design for Agents

A CLI consumed only by an agent is a different artifact from one used by a human. The agent reads every token; there's no skimming, no tab completion, no visual scanning. `-h` is the only documentation that gets read. Output is read by a model and acted on, not displayed to a person. Shell ergonomics that matter for humans (color, pagers, interactive prompts, terseness for typing) are noise to an agent; the things that matter for agents (deterministic output, structured errors, complete specs at `-h`, cheap discovery) are afterthoughts in human-first CLIs.

This guide treats the single-reader-is-an-agent case as the design target. Human ergonomics are absent intentionally, not by oversight.

This file is the spec. **`reference.md` (sibling) is the spec applied** — a fully worked, annotated CLI (the fictional `crtr` runtime) with every pattern below instantiated and each design choice called out. Read it when you need a concrete instance of any rule here: root/branch/leaf shape, dynamic `-h`, long-running spawns, pagination, streaming output. Design from the principles; consult `reference.md` for what a correct realization looks like.

**Sibling surface.** This skill is one of two ways to expose capability to an agent: the shell-driven CLI. For capability the agent calls as a structured tool (function calling / MCP), see [tool-design](../tool-design/SKILL.md). The theory is shared — selection is the work, errors carry recovery, focused over broad, output is minimally sufficient — but the delivery mechanics differ (subcommand tree + `-h` + stdout here; JSON schema + descriptions there). This skill owns the CLI mechanics; don't re-derive the shared theory from it when designing a tool-call.

## Principles

1. **Context is the scarce resource.** Every token in `-h` permanently costs budget for the rest of the agent's task. Minimize *tokens-to-correct-invocation*.

2. **Information must precede invocation.** If a leaf can fail because the agent lacked information, the design failed — not the agent. World-state failures (network, contention, race) are a separate category.

3. **Spec, not example.** Examples invite pattern-matching, which is lossy and bias-prone. A complete schema with semantic constraints is shorter and more reliable.

4. **Standard input, prompt-shaped output.** Parameters arrive via flags and positional arguments. Stdout is the result rendered *for the model to act on* — markdown fenced with light XML, read as a continuation of the agent's prompt, not a data structure it parses. Decision-first prose where prose belongs; named blocks (`<spawned>`, `<feed>`) and short attributes for the scalars (ids, statuses, counts). A raw-JSON form exists behind an opt-in global for programmatic consumers, but it is not the agent contract and is never documented at the call site.

5. **Selection is the work.** Agents spend more cognition choosing the right leaf than constructing the invocation. The selection rubric at each node is the highest-leverage content in the tree.

6. **The tree is an API surface.** Subcommand structure is the agent's mental map. Design it like a public API: orthogonal, minimal, named for concepts. One canonical name per operation, no aliases.

7. **Noun-verb structure. Verbs always last.** `tool plan new`, not `tool new plan`. For deeper trees, nest more nouns: `tool plan task list` reads cleanly. An agent's reasoning composes noun-first ("I need to do something to a plan") and then picks the verb. Verb-first forces selection without an object in hand.

8. **5–7 children per node, hard cap.** Past that, the selection space stops fitting in working context. The fix is always the same: introduce a sub-noun. If you have 12 verbs on one noun, you have two nouns hiding.

9. **Effects are part of the contract.** Anything the world remembers after invocation — state changes, spawned processes, persisted files — is declared at the leaf.

10. **Output is the next prompt.** Stdout flows straight into the next reader's context — usually the model's. Write it to be acted on, not parsed: instruction-shaped, deterministic field order, no decoration. Light structure (named XML blocks around markdown) carries the scalars; prose carries the actual signal.

11. **Redundancy is leakage.** Each fact lives at the highest applicable node and is never restated. Globals appear only at root.

12. **Errors carry recovery information.** Every failure says what was received, what was expected, and what to do next.

13. **State is passed, not smuggled.** No command silently depends on another's side effects.

14. **Long-running operations return a pointer, not a wait.** Operations exceeding a couple of seconds return a handle immediately. Progress accumulates in a log file. Final result writes atomically to a sidecar.

15. **Dynamic content never balloons.** `-h` content reflecting runtime state has a per-node token budget. Aggregates only; never enumerates.

16. **Each node owns its representation one level up.** A node declares two things: its own `-h`, and the content that stands for it in its parent — its line in the parent's listing plus any bounded block it contributes to the parent's `-h`. The parent *assembles* its help by walking its children; it never hardcodes a child's description. Co-located declaration is what makes principle 11 hold across levels: the upstream line can't drift from the node, because they are one source.

17. **State lives with the thing it describes.** A node's bounded runtime block is grouped with the node it belongs to — nested inside that command's block at the parent level, and rendered right after the name at the node's own `-h`. It is never pooled into a shared "state" section away from the command it describes. Grouping is the point: the live job count sits inside `<job>`, the loaded-skill catalog inside `<skill>`, so reading one command means reading its current state in the same breath. The header (tagline) and footer (globals + I/O contract) are the only non-command areas.

18. **Each command is its own fenced block; volatile state nests as a self-named element.** When `-h` is consumed inside a system prompt, each subtree renders as a uniform `<command name="…">` block — concept, rubric, and any state — so the model reads one self-contained concern domain per command, the same way a prompt separates identity from data. The uniform wrapper is load-bearing: it *states* command-ness ("invoke as `tool <name>`") instead of leaving the model to infer it from a different tag per command, and it makes a nested state element — never itself a `<command>` — impossible to misread as a sibling command. State nests as a self-named element the subtree authors: the **tag carries the label** (`<skills>`, `<jobs>`) so the body never repeats it, and **scalars ride in attributes** (`count="42"`, `draft="2"`) rather than as restated prose — element bodies hold only the genuine prose or list. The same element renders identically everywhere it appears (root and the subtree's own `-h`). Two levels of nesting max (`<command>` → `<state>`); the consuming harness adds at most one outer guide tag. This is the same fenced-prose shape principle 4 gives *stdout*: both stdout and `-h` are prose for a model, which reads fenced domains better than a wall of text — but tag every line and the structure becomes noise, so fence domains, not sentences.

19. **List output is for selection, not consumption.** Per-item field count multiplied by result count is the agent's token cost — a 200-token field across 20 hits is 4k tokens spent choosing which item to read in full. Default lists carry only the discriminators the agent uses to pick the next call: ids/names, status, ranking, and *one* short field that distinguishes hits (a description, headline, or summary). Heavier payload (full bodies, prompts, all keywords/metadata) lives one composition step away behind a sibling leaf (`show`, `read`).

    Inline bulk content is allowed when it genuinely speeds selection, but gate it behind an opt-in flag (`--full`, `--with-bodies`) — off by default, paired with a small `--limit` default and filtering flags so the agent can bound cost in both axes before opting in. Every list leaf attaches a top-level `follow_up` string. When the leaf is a simple primitive with no payload toggle and no filtering flags worth advertising, `follow_up` names the detail leaf (`Use \`tool noun show <id>\` for full content.`). When the leaf has filters or a `--full`-style toggle, `follow_up` points at `-h` instead of enumerating them inline (`Run \`tool noun search -h\` for filters and verbosity.`). Inline enumeration multiplies per-call cost; `-h` is the canonical reference.

---

## The tree

Three node types: root, branch nodes, leaves.

**Root** establishes vocabulary and the I/O contract. It owns only the frame — tagline, globals, the input-via-flags / prose-on-stdout convention — and *assembles* its subtree listing and any standing dynamic blocks from the subtrees themselves (see [Each node owns its parent-level representation](#each-node-owns-its-parent-level-representation)). Globals appear only here.

**Branch nodes** extend the parent's definition with a *local model* — short prose orienting the agent to the subtree as a group: how the children divide the space and differ from one another — followed by one `<subcommand>` row per child. The model is cross-child orientation, not a per-child restatement: each child's purpose already lives in its own row, which the child owns, so glossing every child in the model just duplicates those rows. It also never re-litigates whether the agent should be at this branch: by the time `-h` runs, that decision is past, so entry-gating prose ("run only when…") wastes the slot. Depth lives on the leaves, reachable via `-h` from here; the branch model points the agent at the right one. May include bounded dynamic content (state counts, aggregate signals) that pre-empts downstream calls.

**Leaves** are the action surface. Each leaf declares:
- One-line summary.
- Input schema, with semantic constraints inline on each parameter. Flags, positional args, and stdin are all parameters and live in the same schema block.
- Output schema, with *useful properties* of return values (sort order, semantic meaning), not just types.
- Effects — every persistent change in the world.

Subcommand path is the navigation; flags and positional args are the parameters.

### Branch format

A branch renders as a `<command>` block — its own `-h` description on the wrapper, optional model prose and bounded state nested inside, then one `<subcommand>` element per child:

```xml
<command name="human" description="<this branch's own -h summary>">
  <model>... cross-child orientation; any bounded state block nests here ...</model>
  <subcommand name="ask" description="<short>" whenToUse="<plain statement of when to reach for this child — expansive with examples if its uses vary>"/>
</command>
```

`whenToUse` is the selection rubric: a plain statement of *when to reach for this child*, read at the branch to decide whether to pick it, and rendered verbatim. Write it as a standalone sentence, not a fragment. For a judgment-heavy or varied-use child, make it expansive — lead with the trigger, then spell out a wide variety of concrete situations, and contrast the siblings it is confused with ("use X instead when…"); for a genuinely single-purpose child, keep it a tight one-liner. The question at the branch is "would I pick this?"; the child's own `-h` answers "what does it do, exactly?" once picked — so `whenToUse` never restates the child's mechanics and never tells the agent to "read my `-h`". Each child owns its `<subcommand>` row, supplying `description`, `whenToUse`, and its tier on its own def; the parent assembles the listing by walking its children and never hardcodes a child's description. This is principle 16 reaching branch children, not just root subtrees. Because the read-`-h`-before-mutate rule ([below](#when-the-agent-doesnt-walk-the-tree)) already teaches the agent to pull a command's own `-h` before invoking it, a CLI needs no per-child "call `-h`" prompt and no standalone `-h: print help` global stub.

### Node sizing

A node with 5–7 children fits in working context. Past that, selection rubrics stop differentiating — too many similar lines. Always split into sub-nouns:

Wrong: `tool task claim, done, list, show, abandon, retry, restart, archive, export, import`.

Right: `tool task lifecycle {claim, done, abandon, retry}` and `tool task inspect {show, list, export}`.

### Each node owns its parent-level representation

A parent's `-h` is *composed from* its children, not a hand-maintained copy of them. Each child hands its parent three things:
- a **concept line** (vocabulary) for the parent's listing,
- a **selection rubric** — its `description` plus a plain-statement `whenToUse`, on its own `<subcommand>` row,
- optionally, a **bounded dynamic block** it contributes to the parent's `-h` — a catalog, a count, standing guidance.

The parent owns only what is genuinely its own — the vocabulary frame, the globals — and builds the rest by walking its children. Adding a child surfaces it upstream automatically; nothing about it is restated. A hardcoded parent listing is a second copy of each child's purpose that rots silently when the child changes; co-locating the two collapses them to one fact (principle 11, across levels).

This is also where a subtree's runtime aggregate is authored. The state lives with the subtree that owns it — the loaded-skill catalog, the running-worker count — and the subtree renders a bounded block the parent concatenates into its `-h`. The parent stays ignorant of skills and jobs; it just stacks whatever blocks its children hand up. The enumerate-vs-aggregate budget (principle 15) governs each block, and the two canonical shapes contrast cleanly:

- **Enumerate the bounded, stable set.** A loaded-skill catalog is a finite grouped name-tree the agent selects from; surfacing it whole at the parent pre-empts the discovery call the agent would otherwise make.
- **Aggregate the volatile, unbounded set.** Running jobs churn and have no ceiling; the subtree hands up a count plus the command to list on demand, never the list itself.

When the root `-h` is auto-loaded into the agent's context (see [When the agent doesn't walk the tree](#when-the-agent-doesnt-walk-the-tree)), this pattern is what makes that single payload a complete capability guide: every subtree pushes its standing guidance and current aggregate up to the one level that actually gets read.

---

## I/O contract

**Input.** Flags and positional arguments. Required, optional, and semantic constraints all live in the leaf's `-h`.

- *Positional argument* — at most one per leaf, used only when the leaf has an obvious primary target (a plan id, a task id, a file path). When in doubt, use a flag.
- *Flags* — long-form only (`--task-id`, `--limit`). No short aliases. Boolean flags take no value (`--follow`), set to true when present. Repeatable flags (`--tag foo --tag bar`) appear as arrays in the leaf's input schema.
- *Stdin* — reserved for piped content blobs (a document body, a prompt, raw text). If the leaf accepts stdin, the schema names it `stdin` alongside the flags and states what kind of content is expected.
- *Structured input* — when a parameter is itself structured (an object, a heterogeneous array), accept it as a path to a JSON file: `--context-file PATH`. The leaf's `-h` states the file's JSON shape.

**Output.** The result is rendered *for the model*: light XML blocks around markdown, written as a continuation of the agent's prompt. Each command names its result block (`<spawned>`, `<pushed>`, `<feed>`); scalars (ids, statuses, counts) ride as attributes, prose and lists fill the body. Field order is the leaf's output schema — deterministic.

- *Single-shot operations* (`plan new`, `task list`, `job status`) — one rendered block. The whole response is one value, shaped to be acted on.
- *Streams* (`job logs --follow`, anything emitting events over time) — one self-contained record per line, emitted incrementally; a partial read still yields whole records.

A paginated list is not a stream — it's a single rendered response (a markdown table or list) holding many items. Streaming is for incremental emission over time, not for "a lot of stuff at once."

A raw-JSON escape hatch (`--json`) mirrors any result as the underlying object for programmatic consumers — the same data, unrendered. It is not the agent's default and earns no doc tokens at the call site; the rendered prose is the contract.

**Stderr.** In-flight diagnostic output the agent may capture if it wants. Never carries the result. Contract test: `cmd > /dev/null` should hide all of the result; `cmd 2> /dev/null` should hide only diagnostic chatter.

**Exit codes.** 0 on success, non-zero on failure. Specific non-zero codes are worth defining only if the agent will branch on them — almost never in practice. The structured error payload is what the agent reads.

---

## Errors

An error is feedback for correction. Opaque errors produce retry loops; structured errors produce recovery. Every error includes:

- **What was received.** The input the agent gave.
- **What was expected.** The constraint that wasn't met.
- **What to do next.** A concrete action.

Shape — rendered as an instruction block the agent acts on (a `--json` mirror carries the same fields for tooling; runtime-level failures go to stderr):

```
<error code="invalid_status">
status must be one of: draft, claimed, done, failed
received: drafted
field: status
Next: Retry with one of the listed values, or omit to include all statuses.
</error>
```

`code` is a stable string the agent can branch on. The body states what was received against what was expected; `Next:` is the road sign. The `--json` mirror carries the same `error`/`message`/`received`/`field`/`next` fields — same recovery information, just unrendered.

Internal failures — panics, unhandled exceptions — never reach the agent raw. Wrap as `{"error": "internal", ...}` with a stable code. Full traces gate behind an explicit debug invocation, not stderr leakage.

---

## Long-running operations

Anything exceeding a couple of seconds separates kickoff from collection.

1. **The kickoff leaf returns a job handle immediately.** Under a second. The rendered result carries `job_id`, anything immediately known about the spawn, and a `follow_up` line telling the agent the recommended next call.

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
- **ANSI / decoration in output.** Color codes, spinners, banners, table-drawing borders in the result stream. The model reads tokens, not a terminal; decoration is noise in the rendered prose and corrupts the `--json` mirror. Markdown structure is signal — escape sequences are not.
- **JSON as the agent's default.** Returning a raw data structure the model must parse before it can act, when instruction-shaped prose would let it act directly. Parsing is a wasted step and reads worse. Keep JSON as the opt-in escape hatch for tooling; the rendered result is the contract. (And don't fork *more* formats — one rendered surface, one JSON mirror, nothing else.)
- **Stack traces leaked raw.** Internal panics surface as opaque noise. Wrap as structured errors.
- **Smuggled state.** Command B depending on `cd`, env, or a hidden cache from command A. Pass state explicitly.
- **Creator verbs on the primitive.** Putting creation under the noun that names the *result* — `job start prompt`, `record create`, `session new` — forces the primitive's surface to inherit one producer's vocabulary. Operations on a primitive (status, logs, cancel) live with the primitive; *making* one lives with whoever makes — the agent, the scheduler, the queue. The monitoring surface stays producer-agnostic; new producers compose with the same read/cancel leaves instead of forcing a restructure. Test: if a second producer arrived tomorrow, would the surface change?
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
- **Self-justification on a node's own `-h`.** Motivational why-to-use prose on a command's own `-h` — "reach for X whenever…", "run only when…". The agent reading `tool foo -h` already chose `foo`; when-to-pick-`foo` is the *parent's* rubric (the `whenToUse` row), not `foo`'s own slot. A branch model re-litigating whether the agent should be at this branch is the same failure. Symptom: the field reads as guidance to the *caller of the parent* rather than the *agent now choosing a child*.
- **Branch model restating each child.** A model that glosses every child 1:1 duplicates the `<subcommand>` rows the children already own (principle 11). The model carries only cross-child structure — how the children divide the space — never a per-child recap.
- **Separate `Preconditions` sections.** Field constraints live inline with the field they apply to.

---

## A note on what's missing

This guide has no section on workflow discovery — no "common patterns," no `tool how`, no epilogue on root `-h` showing a typical call chain. That's deliberate. The tree with good selection rubrics gives the agent enough to compose workflows from primitives. Scaffolding "typical flows" couples documentation to a moment-in-time understanding of how the tool is used, ages badly, and costs tokens at every discovery step. Trust the tree.

---

## When the agent doesn't walk the tree

"Trust the tree" assumes the agent *walks* it: root → branch → leaf, reading each node's selection rubric on the way down. An agent driving a shell does not. It emits the full `tool noun verb {…}` in one shot from priors and never renders the branch node — so progressive disclosure degrades to nothing for every leaf reachable directly, which is exactly the high-consequence mutating leaves whose branch rubric (edit-vs-create, irreversibility, required structure) mattered most.

When consumption is shell-style one-shot invocation, push the branch rubric into context instead of waiting for traversal. Cheapest sufficient lever first: a scoped, *reasoned* rule in the agent's prompt — "read the leaf's `-h` before any create/update/delete/archive; reads exempt." State the why, not just the imperative; a reasoned rule survives task pressure that a bare order does not. The read-only carve-out is load-bearing: without it the rule reads as overkill on cheap commands, the model downgrades it to advisory, and the downgrade leaks to the commands that mattered.

Do not reach for a fail-closed gate (a leaf that errors until acknowledged) or a blanket preload first. Ship the scoped rule, run the actual failing scenario, and escalate to enforcement only if it empirically fails. A prompt rule is usually enough; enforcement machinery you didn't need is its own anti-pattern.
