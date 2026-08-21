---
kind: knowledge
when-and-why-to-read: When choosing between a flat plan and a decomposed one, or synthesizing part-plans into an index, this knowledge should be read so a planning effort splits only where a domain seam pays for the synthesis it costs.
short-form: Use when deciding whether a planning effort splits into part-plans, and how to synthesize them into one index.
rationale: >-
  Carries plan shape and decomposition only. The general planning contract — scope discipline, task quality, and plan review — lives in [[dev/plan/guide]] so every plan node loads it whether or not the effort ever needs a roadmap; do not pull general planning guidance back in here.
surfaces:
  - on: boot
    at: content
    gate: {kind: plan, mode: orchestrator}
---

# Plan Shapes and the Decomposition Decision

Every planning effort produces either a flat plan or a decomposed plan (index + part-plans). Choose decomposition for worthwhile parallel planning, not raw size: a flat plan can span many yields, while part-plans add delegation and synthesis cost that independent slices must repay.

## Choosing a shape

**Use a flat plan** when the work is a single coherent domain and can be written at consistent task granularity in one plan. A flat plan has an overview, ordered phases, and a verification section. No sub-plans. One file.

**Use a decomposed plan** when settled boundaries expose independent planning slices that can proceed concurrently and the effort is large enough that parallel work materially improves intelligence, productivity, or elapsed time after synthesis cost. Produce an index plan (the navigable master) and delegate each slice to a `plan`-kind child node, giving it the relevant spec, explicit scope, and place in the dependency graph. A slice goes to a `plan` sub-orchestrator (`crtr node new --kind plan --mode orchestrator`) only when its own work passes the same parallelism threshold; a long sequential slice goes to a base child that can yield. The index plan is the synthesis artifact — it lists all sub-plans by path, defines phases and dependencies, and contains a task table the implementation orchestrator can execute directly. Detail lives in sub-plans; the master is not allowed to carry it.

**The decomposition trigger is domain boundary, not size alone.** Three backend files and three frontend files are two domains even if the total count is modest — plan them separately and synthesize, because the integration seam is where bugs live and one agent reading both halves won't catch them as cleanly as two agents each going deep.

After collecting part-plans from children, synthesize before declaring done: resolve file ownership conflicts (two sub-plans naming the same file means you decide the sequence), align naming across all parts, fill integration gaps at domain boundaries, and ensure the task table in the index accurately reflects dependencies exposed only by reading all sub-plans together.
