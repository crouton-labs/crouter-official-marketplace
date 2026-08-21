---
kind: knowledge
when-and-why-to-read: When writing an architecture or interface design, this knowledge should be read so each section of the artifact carries what a planner and implementer need and the design opens from the end that is actually hard.
short-form: Use when writing a design artifact — what the design must settle, what each section contains, and the top-down versus bottom-up call.
rationale: >-
  Carries the shared design contract and artifact shape used by design-kind nodes and the optional /dev:design front door. Decomposition lives in [[dev/design/roadmap]], so both entry paths use one method instead of carrying contradictory templates.
surfaces:
  - on: boot
    at: content
    gate: {kind: design}
---

# Designing a change

Ground the design in the relevant code and requirements. When the blast radius is unclear — what the change touches, who depends on it, or what constrains its shape — use `explore` scouts to map it before writing, and draw the constraints from evidence rather than an assumption.

A design fixes the load-bearing structure before anyone writes code: component boundaries and responsibilities, interface contracts and data models, key flows, and the decisions that close real options with their rationale and rejected alternatives.

It is not requirements — those state the behavior the system must satisfy, while the design states how it is structured to produce that behavior. It is not a plan — plans order implementation work against the design. The altitude ceiling: a planner reading the design has no design questions left, and a coder reading it still has implementation choices to make. No function bodies, algorithm walkthroughs, library calls, or ordering of implementation steps; anything that could be pasted into source belongs downstream.

Design enough to unblock parallelism and close the decisions that are expensive to reverse, and no further. Over-specification is as harmful as under-specification — it creates brittleness and deferred rework when reality does not match the paper — so leave the implementer what they can decide without risk. Resolve every decision that closes a real option; never hand the implementer a branch to pick. When a decision turns on judgment the user should own — a performance tradeoff, a data-model shape, or which pattern to adopt — work it out with them through `crtr human` before finishing the document and reflect their decision in the design. Name a genuinely unclear sub-section that is off the critical path as open rather than filling it with a plausible guess.

Write the design to `$CRTR_CONTEXT_DIR/design-<subject>.md`. Keep the artifact pure: it states the structure, contracts, and decisions. Concerns, risks, caveats, and recommendations do not belong in it except as Open risks that genuinely affect the design's validity.

Structure it with these sections, in order:

**Context & constraints** — the problem being solved, the non-goals, the constraints that are not negotiable (existing systems, performance envelopes, team conventions). This is the frame everything else hangs on.

**Architecture** — the high-level structure: what major components or layers exist, how they are arranged, what the topology looks like. Lead with a diagram (mermaid `graph TD`) before prose. Keep it at the level a new engineer would use to orient themselves.

**Components & responsibilities** — for each component: one-sentence description of what it owns, a responsibilities table, and explicit boundaries (what it does NOT own). Every responsibility must land in exactly one component; gaps and overlaps here become integration bugs.

**Interfaces & contracts** — how components talk to each other. Expressed as prose or sequence diagrams, not API specs or type declarations. "Component A sends X to Component B when Y" is the right level. Include error cases and who owns recovery.

**Data model** — the key entities, their fields with semantic types ("session ID string", "ISO timestamp"), and their relationships. Tables are the right format. No TypeScript, no SQL — shape and semantics only.

**Key flows** — the end-to-end flows that matter most. Walk from trigger to final state, naming which component handles each step and what state changes. This is where seam problems surface; a step whose output doesn't match the next step's expected input is a design gap.

**Decisions** — every non-obvious architectural choice, structured as: decision → choice made → alternatives rejected → rationale. If the decision is obvious, omit it. If it closes a real option, it belongs here. This section is what distinguishes a design from a description.

**Open risks** — unresolved questions and known unknowns that a reviewer or the implementer will need to address. Not a wish list — only things that could affect the design's validity.

## Design styles — when to use each

**Top-down, interface-first**: fix the contracts between components first, then fill in what sits behind each contract. Use this when the integration surface is the hard problem — when multiple teams or systems must connect, when the seams will be expensive to change, or when you are designing an API or protocol. The contract is the design; the implementation fills in around it.

**Bottom-up, primitives-first**: identify and nail the core data structures or algorithms that the design depends on, then build the component model up from them. Use this when the primitives are the hard part — a novel data model, a performance-critical kernel, a constraint that flows upward and determines everything else.

For a design large enough to split across nodes, read [[dev/design/roadmap]]. A bounded design node delivers the design path plus one sentence per decision, naming what was chosen and what it closed off. Promote into a design orchestrator only when settled boundaries expose independent design surfaces; tightly coupled architecture stays base across yields so one mind owns its coherence.
