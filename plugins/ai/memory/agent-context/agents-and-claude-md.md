---
kind: knowledge
when-and-why-to-read: When you are writing, editing, or auditing an AGENTS.md or CLAUDE.md (or any always-loaded agent instruction file), this knowledge should be read because it carries the genre's authoring discipline — what earns a line, what to cut, and the front-door shape that keeps the file from rotting into a manual.
short-form: Writing AGENTS.md / CLAUDE.md — the always-loaded instruction-file genre. Front door not manual, the "would behavior change?" cut test, what belongs/excluded, when→do→why directives, root vs nested, and when to escalate off the file.
surfaces:
  - on: boot
    at: name
  - on: read
    match:
      - "**/AGENTS.md"
      - "**/CLAUDE.md"
    at: content
---

# Writing AGENTS.md / CLAUDE.md

These are the **always-loaded instruction files** an agent reads at the top of every session in a directory — `AGENTS.md` (the tool-agnostic standard: pi, Codex, and others) and `CLAUDE.md` (Claude Code). Same genre, different filename; everything here applies to both. They are a **front door, not a manual**: a curated set of guardrails and pointers, where every line is paid by every session, forever.

## The one test

For each line ask: **"Would the agent behave differently if I deleted this?"** If no, cut it. The file gets *tighter* over time, not longer — propose pruning alongside every addition.

## What belongs (priority order)

1. **Constraints & gotchas** — non-obvious rules, what breaks if ignored. The highest-value content.
2. **Key commands** — build, test, lint; the 80% cases, copy-pasteable.
3. **Architecture orientation** — how the major pieces relate, 2–3 sentences, only what isn't obvious from a glance at the tree.
4. **Conventions that differ from defaults** — only the surprising ones.

## What does NOT belong

- Anything the agent can infer by reading the code.
- Standard language/framework conventions it already knows.
- API docs or tutorials — link out instead.
- File-by-file descriptions of the tree.
- Task- or session-specific detail — that goes in the task prompt, not the always-loaded file.
- Anything that changes frequently (it goes stale and misleads).

## Shape every directive as "when X, do Y, because Z"

Flag the *situation* (**when**), point to the action (**do Y** — usually a *pointer*: "run `<cmd> -h`", "read `<file>`"), and give the *reason* (**because**) so the agent generalizes to analogous cases. Inlining the full how-to instead of a pointer is the cardinal sin: it bloats the front door, and the file stops degrading gracefully — past a point the agent ignores instructions wholesale, including the critical ones. Depth lives behind the pointer (a docs dir, `-h`, a memory doc), never here.

## Writing rules

- Short declarative bullets beat paragraphs.
- Never write "Never X" without the preferred alternative.
- When you point at another doc, pitch *when/why* to read it, not just its path.
- If a piece of guidance runs past ~5 lines, it belongs in a memory doc / skill / rule, not here.

## Root vs nested

- **Root** (~100–200 lines): project-wide constraints, commands, architecture. Loaded every session.
- **Nested** (<50 lines): add only when a subdir has real local conventions or non-obvious constraints that differ from the root. Don't repeat the parent; don't explain what the directory name already says.

## Escalate off the file when

- **>5 lines of domain knowledge** → a memory doc / skill (loaded on demand, not every session).
- **File-type-specific rules** → a rule scoped by path / `applies-to`.
- **Must-not-be-ignored enforcement** → a hook (deterministic, not advisory).

For the craft behind the directives (tone registers, framing, examples) see [[ai/agent-context/prompting-effectively]] and [[ai/agent-context/system-prompts]]. If the separately installed `claude-authoring` plugin is available, use it for Claude Code-specific artifacts (skills, rules, hooks, commands).
