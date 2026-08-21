---
kind: knowledge
when-and-why-to-read: When a design is large enough that independent surfaces could be designed in parallel, this knowledge should be read so sub-designs compose across written contracts instead of inventing incompatible assumptions.
short-form: Use when deciding whether a design splits into sub-designs, and how to contract and integrate them.
rationale: >-
  Carries decomposition and integration only. The design contract and artifact shape live in [[dev/design/guide]] so every design node has them without reaching for a roadmap; do not pull general design guidance back in here.
surfaces:
  - on: boot
    at: content
    gate: {kind: design, mode: orchestrator}
---

# Decomposing a design for parallel work

Decompose only when settled contracts expose genuinely independent surfaces and the design is large enough that parallel work materially improves intelligence, productivity, or elapsed time after synthesis cost. Split along clean seams — by component, subsystem, or interaction surface. A long but tightly coupled design stays with one base agent across yields so one mind owns its coherence. Each delegated sub-design is a bounded unit that covers one component or subsystem end-to-end: its own context, architecture, interfaces, data model, flows, and decisions.

Before delegating sub-designs, define the shared interface contracts between them explicitly. These contracts are the seams; they must be written down before sub-design begins so that parallel sub-designs don't invent incompatible assumptions. Capture these contracts in `$CRTR_CONTEXT_DIR/design-contracts.md` and give that absolute path to every sub-design agent.

Each sub-design agent gets: the overall architecture diagram, the contracts doc, the scope of its piece, and any constraints from the parent design. It follows [[dev/design/guide]], writes `design-<component>.md` in its own context directory, and reports the absolute path.

After sub-designs land, integration is your job: read every sub-design, check that every contract is honored on both sides, that responsibilities don't overlap or gap, that the data models are consistent, and that the key flows compose correctly across component boundaries. Write the integrated design to `$CRTR_CONTEXT_DIR/design-<subject>.md`, synthesizing all sub-designs into one coherent artifact — don't just concatenate them. Reconcile any inconsistencies before declaring the design done.
