---
kind: knowledge
when-and-why-to-read: When a spec orchestrator is sequencing shape, design, and requirements phases across nodes, this knowledge should be read because each handoff preserves the settled contract only when it moves through canonical artifacts, and a gap found downstream must flow back to the artifact that owns it.
short-form: Shape, then optional design, then requirements — each phase handed canonical artifacts, gaps resolved through the owning artifact, only the affected handoff rerun.
rationale: >-
  Orchestrators ran every specification through a fixed phase checklist, and requirements writers inherited the originating conversation — so they absorbed its assumptions instead of detecting what the documents failed to say. Gap fixes were also patched downstream, leaving the owning artifact stale. The generic parallelism threshold is deliberately absent — the builtin orchestration layer owns it; phase tracking and user-approval calibration are absent because the orchestration kernel and escalation layers own them.
surfaces:
  - on: boot
    at: content
    gate: {kind: spec, mode: orchestrator}
---

## Orchestrating a specification

Decompose only when settled boundaries expose independent specification, design, or requirements surfaces. The dependency is shape → optional design → requirements, and a phase exists because its output is needed by the next one — never because every specification must pass through a checklist.

**Shape** establishes the canonical statement of intent — who or what is served, the outcome, scope and non-goals, consequential decisions — per [[dev/spec/guide]]. It is ready for handoff when a designer or requirements writer can proceed without inventing product intent.

**Design** is a separate phase only when structural choices constrain the behavioral contract or the downstream plan. Delegate it as a bounded `design` node; the design records approved structure and interfaces, not a replacement for the specification's outcome.

**Requirements** turns the canonical spec and any approved design into the complete behavioral contract. Delegate it to a fresh `spec/requirements` node reading [[dev/spec/requirements]], handing it the canonical artifacts and not the originating conversation — a reader without the conversation can detect what the documents fail to say, which is the point of the fresh node.

## Resolve gaps through the owning artifact

An independent reader exposes omissions; it does not decide product intent on the owner's behalf. When design or requirements finds an implementation-changing gap, bring the owning spec or design artifact current, then rerun only the affected handoff. The final requirements artifact carries the complete resolved contract — never a review log or a list of inherited assumptions.
