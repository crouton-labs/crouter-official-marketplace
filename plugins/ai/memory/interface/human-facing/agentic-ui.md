---
kind: skill
when-and-why-to-read: When you are building or reviewing the UI an agent presents to a human — surface choice, streaming, reasoning disclosure, tool-call legibility, review gates, steering — this skill should be read because it catalogs the interface patterns for surfacing agent work, web or terminal.
short-form: Interface patterns for surfacing agent work to a human — surface choice, streaming, legibility, review gates, steering (web + TUI).
system-prompt-visibility: name
file-read-visibility: none
---

# Designing UI for agentic interaction

The screen — or the terminal — is where the human reads what the agent is doing and decides whether to trust it. This is the pattern layer: *what to render and when*. The judgment layer (trust, autonomy, friction, the first principles) is the sibling [agentic-ux](agentic-ux.md); build on it, don't restate it.

Audience: future LLM agent sessions building or reviewing agent-facing UI, web or terminal.

## When to use

- Building UI that shows an agent's work: streaming, reasoning, tool calls, diffs, plans, multi-agent.
- Reviewing an agentic UI: "can the user see state, verify changes, and intervene".
- Choosing chat vs canvas vs ambient vs dashboard; alt-screen TUI vs inline scrollback.

## When NOT to use

- The interaction model, trust, autonomy, friction policy — sibling [agentic-ux](agentic-ux.md) (read it first; this skill assumes it).
- A CLI **consumed by** an agent (the agent is the user, not a human at a TTY) — [cli-design](../agent-facing/cli-design.md). The only shared seam is the TTY-vs-pipe duality below.

## The core decision

**Pick the surface by interaction shape; don't default to chat.** Agentic work is a long internal monologue, not a back-and-forth — forcing it into a chat scroll buries the result and the controls. Four surfaces, coexisting (consensus is parallel, not winner-take-all):

- **Chat** — interactive Q&A, ambiguous/exploratory.
- **Canvas/artifact** — collaborative creation; show the *edits/diffs*, not the monologue.
- **Ambient** — event-driven, no chat window; monitoring/ops.
- **Dashboard / mission-control** — many async or parallel agents.

Whichever surface: **separate process from result** (dual-pane or collapsible process; results in their own place), and keep the original instruction persistently visible.

## Cross-cutting principles (web and terminal)

- **Progressive disclosure of agent work.** Reasoning collapsed by default ("Thought for 12s", expandable, auto-collapse on completion); tool calls as one-line collapsible cards; collapse the collapses as scale grows. Never leak raw reasoning deltas into the answer/output stream — filter by event type.
- **One explicit, consistent state signal.** A single always-visible status — idle / planning / working / waiting-on-human / blocked / done / error — with the matching affordance (Stop while working, Reply while waiting, Retry on error). Same vocabulary across every surface.
- **Review gates are non-negotiable.** Show diffs/plans before applying, with accept/reject (per-hunk where possible). Removing the gate breaks trust faster than model quality can compensate — auto-apply without a visible diff is the fastest known way to lose user trust.
- **A recovery substrate.** Checkpoint / undo / audit-log of every consequential action; make explicit what *cannot* be rewound (sent email, external API call).
- **Steering without breaking flow.** Interrupt at any time; queue input while the agent is busy (show the queue) with a key to interject immediately.
- **Legibility affordances.** Inline citations/provenance on factual claims; calibrated confidence on variable or high-stakes output; a one-line rationale after autonomous acts.

## Web layer

Generative/dynamic UI (tool output → components, not text walls), inline citations with hover preview, suggestion chips for capability onboarding, editable plan/todo surfaces, mission-control for async/multi-agent, budget/token meters with tiered warnings. A common component vocabulary has converged: Reasoning, Tool, Task, Plan, Sources, Checkpoint, Queue, Artifact. Full catalog — 30 patterns, each problem → use → avoid: [agentic-ui-reference.md](agentic-ui-reference.md).

## Terminal layer

- **The alt-screen debate (unresolved — the live one).** Inline/normal buffer keeps native scrollback, selection, and search but flickers under streaming; alt-screen kills flicker and gives a fixed composer but destroys those affordances. Recommendation: **conversational/coding agents → inline + a differential cell-diff renderer** (kill flicker *without* alt-screen); **dashboard-style → alt-screen acceptable**; if alt-screen, always ship escape hatches (dump-to-scrollback, native-selection bypass, env kill-switch) and make it opt-in/toggleable. Never force-migrate — forced alt-screen migrations get rolled back fast.
- **Differential redraw, not full repaint.** A TTY has no scene graph; "clear + reprint per token" floods emulators and flickers. A high-level component-tree renderer is an anti-pattern for sustained streaming; a custom cell-diff renderer (emit only changed-cell deltas) is state of the art.
- **TTY-vs-pipe duality (the seam to `cli-design`).** Detect `isatty(stdout/stdin)` separately. Attached → full TUI. Piped / CI / headless → no ANSI/spinners/alt-screen, honor `NO_COLOR` / `TERM=dumb`, never block on a prompt (require an explicit `--yes`/`--yolo` and *refuse* without it, don't silently proceed). When the consumer is an agent you have crossed into `cli-design` — that skill governs the machine contract; don't re-derive it here.
- **Keyboard-driven permission prompts** (allow once / allow-always-scoped / deny / edit), always scrolled into view; tiered autonomy presets cycled mid-session and color-coded by blast radius.
- **Accessibility is a first-class mode.** Color never carries meaning alone (pair with `+`/`-`, `✓`/`✗`, labels); honor `NO_COLOR`; offer animation-off / reduced-motion and a non-alt-screen path for screen readers (constant repaint re-announces every frame).
- **Completion notification when the human looked away** — terminal bell → OSC 9/777 desktop notification (forwards over SSH), conservative default, user-configurable.

Full catalog — 20 patterns, each constraint → solution — and the alt-screen decision matrix: [agentic-ui-reference.md](agentic-ui-reference.md).

## Failure modes

- **Chat-as-default for agentic loops** — the long monologue in an endless scroll; result and controls buried.
- **Raw CoT leak** — internal reasoning streamed into the user-facing answer/output.
- **Removed review gate** — auto-apply with no diff; the fastest known way to lose user trust.
- **Inconsistent state vocabulary** — different status words/affordances per surface; the user can't build a model.
- **Citation trust-laundering** — citations present but not actually supporting the claim; raises false confidence.
- **Forced alt-screen / full-repaint flicker** — alt-screen migration with no escape hatch, or repaint that fights the user's scroll and selection.
- **Color-only meaning** — invisible under `NO_COLOR`, on light backgrounds, or to colorblind users.

## Related

- `web/frontend/design-website`, `web/frontend/role-ui-ux` — general (non-agentic) web design system + UX consultancy (cross-plugin).
