---
kind: knowledge
when-and-why-to-read: When a plan orchestrator is choosing between a flat plan and part-plans, or synthesizing part-plans into an index, this knowledge should be read because the seams between domains are where integration bugs live, and only the synthesis pass can see across them.
short-form: Split along domain seams, not size; delegate bounded part-plans; synthesize file ownership, naming, and integration gaps into one executable index plan.
rationale: >-
  Orchestrators split plans by size rather than domain, and declared done after collecting parts — leaving two part-plans owning one file, misaligned names, and dependency edges visible only when all parts are read together. The generic parallelism threshold is deliberately absent — the builtin orchestration layer owns it; only the domain-seam trigger lives here.
surfaces:
  - on: boot
    at: content
    gate: {kind: plan, mode: orchestrator}
---

## Flat or decomposed

The decomposition trigger is a domain seam, not size: three backend files and three frontend files are two domains even at a modest total, because the integration seam is where bugs live and two agents each going deep catch them more cleanly than one agent reading both halves. A single coherent domain stays a flat plan however long — a flat plan spans yields for free, while part-plans cost delegation and synthesis.

## Delegating part-plans

Each slice goes to a `plan` child with the contract it plans from, its explicit scope, its place in the dependency graph, and the paths to the upstream artifacts. The child follows [[dev/plan/guide]], stays in its lane, writes `plan-<subject>-<part>.md`, and reports the absolute path.

## Synthesis

After the parts land, synthesize before declaring done — collecting is not synthesis: resolve file-ownership conflicts (two parts naming one file means you decide the sequence); align naming across all parts; fill the integration gaps at domain boundaries; and make the index task table reflect the dependencies that are visible only when all parts are read together.

The result is an index plan in the plan schema's index form ([[dev/artifacts/plan]]): the task table the implementation orchestrator executes, with detail living in the part-plans and Pointers naming each one.
