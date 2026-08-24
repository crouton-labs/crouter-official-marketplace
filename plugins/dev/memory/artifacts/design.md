---
kind: knowledge
when-and-why-to-read: When drafting the design document itself, this knowledge should be read because each section then carries what a planner and implementer need, in the order a reviewer can audit.
short-form: The design artifact schema — the section sequence, what each section carries, the Decisions row shape, and the top-down versus bottom-up call.
rationale: >-
  The full section template rode at boot content inside the design guide, charging every design wake for a shape needed only at writing time. Decisions rows also recorded choices without the concrete, current thing that made them necessary, so reviewers could not tell a load-bearing decision from a preference.
---

# Design schema

Write `design-<subject>.md` with these sections, in order:

**Context & constraints** — the problem being solved, the non-goals, and the constraints that are not negotiable (existing systems, performance envelopes, team conventions). This is the frame everything else hangs on.

**Architecture** — the high-level structure: the major components or layers, how they are arranged, what the topology looks like. Lead with a mermaid `graph TD` diagram before prose, at the level a new engineer would use to orient.

**Components & responsibilities** — per component: one sentence on what it owns, a responsibilities table, and explicit boundaries (what it does NOT own). Every responsibility lands in exactly one component; a gap or overlap here becomes an integration bug.

**Interfaces & contracts** — how components talk, as prose or sequence diagrams, never API specs or type declarations. "Component A sends X to Component B when Y" is the right level. Include error cases and who owns recovery.

**Data model** — the key entities, their fields with semantic types ("session ID string", "ISO timestamp"), and their relationships, as tables. No TypeScript, no SQL — shape and semantics only.

**Key flows** — the end-to-end flows that matter, walked from trigger to final state, naming which component handles each step and what state changes. A step whose output does not match the next step's expected input is a design gap.

**Decisions** — every non-obvious choice that closes a real option, as: decision → choice made → alternatives rejected → rationale → the concrete, current thing that makes it necessary. A decision anchored only in a hypothetical future is a preference, not a decision; an obvious choice is omitted. This section is what distinguishes a design from a description.

**Open risks** — unresolved questions and known unknowns that could affect the design's validity. Not a wish list.

**Pointers** — the upstream inputs per [[dev/artifacts]]: the exploration maps, spec, and spike verdicts the design rests on.

## Auditability

Every element carries something a later check can prove wrong — a named component, a stated contract, a flow step with an observable state change. Unspecified territory is named open, never left silent: silence reads as "settled" to the implementer and as "missing" to no one.

## Top-down or bottom-up

**Top-down, interface-first**: fix the contracts between components first, then fill in what sits behind each. Use when the integration surface is the hard problem — multiple systems must connect, the seams are expensive to change, or the deliverable is an API or protocol.

**Bottom-up, primitives-first**: nail the core data structures or algorithms first, then build the component model up from them. Use when the primitives are the hard part — a novel data model, a performance-critical kernel, a constraint that flows upward and determines everything else.
