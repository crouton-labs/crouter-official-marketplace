---
kind: knowledge
when-and-why-to-read: When writing an implementation plan from a specification, design, or requirement, this knowledge should be read so an implementer can build from a concrete, navigable path without guessing.
short-form: Use when producing an implementation plan — scope discipline, task quality, affected areas, ordering, and verification.
rationale: >-
  Carries the shared planning contract used by plan-kind nodes and the optional /dev:plan front door. Decomposition lives in [[dev/plan/roadmap]], so both entry paths use one method instead of carrying contradictory templates.
surfaces:
  - on: boot
    at: content
    gate: {kind: plan}
---

# Planning from a contract

Given a specification, design, or requirement, produce a concrete, navigable plan an implementer can build from without guessing. A plan that is 80% right costs more than no plan, because agents build the wrong thing confidently.

Ground the plan in the relevant code and requirements. When the blast radius is unclear — what the change touches, who depends on it, or what breaks — use `explore` scouts to map it before writing, and draw the affected areas from evidence rather than an assumption.

A plan is a map, not a script: resolve the ambiguity the plan needs, define the boundaries, and structure the work for parallelism. Point at an existing pattern to follow rather than re-describing code the implementer will read. Make the approach, affected areas, ordering or dependencies, and verification clear enough that an implementer can carry it out without guessing. Every design choice the plan must settle lands on a concrete answer; do not hand the implementer a branch to pick.

Plan the simplest complete implementation of the specification and what it necessarily requires. Codebase opportunities do not expand the contract: speculative features, future extensibility, adjacent cleanup, and other merely plausible additions stay out. When something seems likely desirable but is not explicitly or implicitly required by the specification, ask the user through `crtr human` before finishing the plan, wait for their answer, and make the resulting boundary explicit. Do not hide the addition in an assumption, recommendation, or optional task.

Write the plan in `$CRTR_CONTEXT_DIR`. Keep it pure: it states the approach, affected areas, ordering, and verification. Concerns, risks, caveats, recommendations, decision history, superseded ideas, live progress, and standing open questions do not belong in it. Fold every resolved answer into the task it governs.

Use a flat plan with an overview, ordered phases, and a verification section unless the work meets the decomposition threshold in [[dev/plan/roadmap]]. Break each phase into concrete tasks with explicit dependencies and identify which tasks can run in parallel.

A task is the atomic unit one implementation node picks up cold and executes in a single context window. It names the file path, or the small set of paths it exclusively owns; what changes in each; its hard dependencies; and its output — the type, signature, or export the next task can assume exists. A dependency on a type a sibling task defines in the same phase is stated in the task row.

A task is **parallel-safe**: no other task in its phase owns its files. Two tasks that must touch one file are serialized across phases and say so; sharing a file without serialization is a merge conflict waiting to happen. A task is **bounded**: finishable in one window without re-reading the plan. A task description longer than a short paragraph is too large — split it.

If planning one slice of a larger effort, stay in the assigned lane. Where the slice touches another, surface it as an integration point or constraint for whoever synthesizes; do not solve the other slice. Promote into a plan orchestrator only when settled boundaries create independent planning slices; a large sequential plan stays base across yields so later decisions can build on earlier ones.

## Plan review

Give a consequential plan one independent review pass. Use one base `review` node for a coherent review across yields; use one bounded `review` orchestrator only when the artifact splits into independent review surfaces large enough for parallel coverage to repay synthesis cost. The assignment applies whichever lenses matter — requirements coverage, pattern consistency, code smells, security, and architecture fit — within one verdict. Lenses are questions, not separate reviewer assignments.

Fold that report into the plan once. Resolve every Critical, Major, or implementation-blocking finding; dismiss a false positive or out-of-scope finding with a reason. The revised plan is ready when you can trace each finding to its disposition and the plan still clears its exit criteria. Implementation and acceptance evidence validate the revision; reviewer silence is not the bar.

Do not implement — plan only.
