---
kind: knowledge
when-and-why-to-read: When you are asked to review an existing agent prompt, this skill should be read because it walks you through reconstructing the full assembled prompt from its scattered sources, resolving variables to example values, and staging it on the user's screen for line-by-line comments.
short-form: Reconstruct an agent's full assembled prompt from scattered sources, annotate provenance, and stage it for human line-by-line review.
system-prompt-visibility: name
file-read-visibility: none
---

# Review Prompt

A running agent rarely sees one prompt file. What reaches the model is *assembled* — system prompt + agent/mode identity + loaded skills + CLAUDE.md/rules + command or skill template + dynamically injected context + tool descriptions, with variables interpolated. The user can't review what they can't see. Your job: reconstruct the full assembled prompt, resolve its variables to realistic values, annotate where each piece comes from, and put it on the user's screen for comments.

Run the phases in order.

## Phase 1 — Find every source (delegate)

Don't read the codebase yourself — keep your context clean. Delegate to an explore subagent:

> Find every source that contributes to the prompt the **<X>** agent receives.
> Entry point: **<command / agent / mode / skill / API call the user named>**.
> Trace the assembly end to end and report:
> - Each string concatenated into the final prompt, **in order**, with `file:line`.
> - Every variable / placeholder / interpolation, and where its value comes from (default, type, the code that populates it).
> - Conditional blocks — the exact condition that includes or excludes them.
> - Tool descriptions and schemas injected into the prompt.
> Do not summarize the prompt text — quote it verbatim with citations.

If the user didn't name an entry point, find it first (which command / agent / mode builds this prompt), then hand that to the explore agent.

## Phase 2 — Resolve variables to realistic values

A template full of `{{placeholders}}` is not a prompt — the user needs to see what the model sees. For each variable the explore found:

- **Small enumerable set** (a status, a mode, ≲5 options) → show the schema / enum inline so the reviewer sees the whole space.
- **Free-form or lengthy** → render one *researched, realistic* value — pulled from defaults, fixtures, tests, or the real data the code reads — not a toy stub. Mark it clearly as an example.
- **Multiple distinct lengthy values that materially change the prompt** → infer the most representative one from context if you can; otherwise ask the user which to render (`crtr human`). Never silently pick when the choice changes the prompt's meaning.

The goal is a prompt that reads exactly as it would at runtime.

## Phase 3 — Aggregate with citations

Write the fully resolved prompt to `/tmp/<name>-assembled.md`. Rules:

- Reproduce the prompt **verbatim** and **in assembly order** — this is the artifact under review, not a paraphrase.
- Before each block, attribute its source: `file:line` (and the gating condition, if the block is conditional).
- Mark every resolved variable inline as an example value, noting its origin.
- The file is rendered by `crtr human review` (directive-flavored markdown via termrender). Use callouts / asides for citations so attribution stays visually distinct from the prompt body; keep the prompt text itself unstyled. See `termrender doc -h` for the directive set.

A reviewer should be able to read top to bottom exactly as the model would, and for any line know precisely where it came from.

## Phase 4 — Put it on the user's screen

```
crtr human review /tmp/<name>-assembled.md
```

This kicks off a live review pane and returns at once — the user's anchored comments fan into your inbox when they submit, waking you. Don't poll, re-present, or verify the pane opened. The pane tracks the file: to change something mid-review, edit it in place and it re-renders.

When the comments come back and you revise the actual prompt sources, → [[prompting-effectively]] for the changes themselves.
