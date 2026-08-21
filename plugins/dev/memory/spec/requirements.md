---
kind: knowledge
when-and-why-to-read: When writing or evaluating requirements, this knowledge should be read because implementation and validation need one complete behavioral contract rather than behavior scattered across design prose or silently filled in by the planner.
short-form: Write complete, atomic, observable, testable requirements; use formal templates only when they make a conditional behavior clearer.
rationale: The requirements persona made EARS mandatory and omitted behavior already stated by the design, which could produce a gap list instead of the complete behavioral contract downstream work needs.
surfaces:
  - on: boot
    at: content
    gate: {kind: spec/requirements}
---

# Writing requirements

Work as a cold reader from the canonical specification and any approved design artifacts, without the originating conversation. Produce the complete behavioral contract a planner and validator will use. If the canonical artifacts leave an implementation-changing gap, report it to the owning spec node instead of inventing an answer. Deliver the finished requirements artifact's absolute path.

Requirements state the behavior and constraints the finished system must satisfy. The requirements artifact is the complete behavioral contract: a design may remain normative for structure, but required external behavior must not be recoverable only by inference from design prose. Requirements are not architecture choices, implementation tasks, or a list containing only what the design forgot to say.

A good requirement is:

- **necessary** — it protects the intended outcome or an explicit constraint;
- **atomic** — one independently satisfiable behavior rather than several joined obligations;
- **unambiguous** — its actors, conditions, and result have one reasonable interpretation;
- **observable and verifiable** — a user, caller, operator, or test can determine pass or fail;
- **bounded** — relevant triggers, states, limits, and failure conditions are explicit;
- **traceable** — its reason or source in the specification or approved design is identifiable;
- **feasible** — known technical or policy constraints do not make it impossible, and unresolved feasibility is explicit;
- **implementation-neutral** — it specifies the result unless a particular mechanism is itself a constraint.

Use direct declarative prose by default. EARS (`WHEN`, `WHILE`, `IF`, `WHERE` … `SHALL`) is useful when a trigger, state, or optional feature would otherwise be ambiguous; it is a clarity tool, not a required dialect. Acceptance scenarios can make representative cases concrete, but examples do not replace the general rule they illustrate. Use stable identifiers when another artifact needs to trace requirements individually.

Cover the normal path and every relevant alternate state, failure, boundary, permission, and lifecycle transition. “Relevant” is a judgment about the specified outcome, not a checklist invitation to invent features.

Never repair a missing product or design decision by guessing. Record the exact gap and return it to the owning specification or design artifact. A draft may expose such gaps; a finished requirements handoff has no unresolved gap that would change implementation behavior.

Review the set in both directions before handoff: every required outcome has corresponding requirements, and every requirement serves a stated outcome or constraint. Split compound obligations, remove design and task detail, and rewrite anything a tester could not evaluate without asking what it means.
