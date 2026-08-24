---
kind: knowledge
when-and-why-to-read: When writing an implementation plan from a specification, design, or requirement, this knowledge should be read because an implementer builds confidently from whatever the plan says, so its ground, scope, and review determine whether the right thing gets built.
short-form: Ground the plan in exploration evidence, plan the simplest complete implementation, and give it one review pass with lenses as questions.
rationale: >-
  Planners drew affected areas from an assumed blast radius, expanded scope with codebase opportunities, and shipped unreviewed plans — and a plan that is 80% right costs more than no plan, because agents build the wrong thing confidently. The task shape and plan structure are deliberately absent here — [[dev/artifacts/plan]] owns them at writing time; the scope-expansion ask and style line are absent because [[dev/artifacts]] owns them once. Review lenses are questions within one assignment, never separate reviewer nodes.
surfaces:
  - on: boot
    at: content
    gate: {kind: plan}
---

## Planning from a contract

A plan is a map, not a script: resolve the ambiguity the plan needs, define the boundaries, and structure the work for parallelism — then leave the implementer what they can decide without risk. Point at an existing pattern to follow rather than re-describing code the implementer will read. Write it as `plan-<subject>.md` under the shared contract in [[dev/artifacts]], with the schema in [[dev/artifacts/plan]]. A request that outgrows or undershoots planning gets re-routed to the work it actually is, not forced through this method.

## Ground before you draft

The plan rests on exploration evidence, not on memory of the codebase. Handed no exploration covering the blast radius, commission `explore` scouts before drafting — an explore orchestrator when the surface is large. Handed maps with gaps, fill the gaps by extending the handed documents in place rather than writing parallel notes. Draft only when the map's Gaps section holds nothing plan-relevant.

## Plan the simplest complete implementation

Plan the simplest complete implementation of the contract and what it necessarily requires. Codebase opportunities do not expand the contract — speculative features, future extensibility, and adjacent cleanup stay out; the scope rule and its `crtr human` ask are in [[dev/artifacts]].

## Stay in your lane

Planning one slice of a larger effort, stay in the assigned lane. Where the slice touches another, surface the touch as an integration point or constraint for whoever synthesizes; do not solve the other slice.

## Review before you finish

Give a consequential plan one independent review pass — one `review` node, one assignment, one verdict. The assignment applies whichever lenses matter — requirements coverage, pattern consistency, code smells, security, architecture fit — as questions within that one verdict, never as separate reviewer nodes. Fold the report into the plan once: resolve every Critical, Major, or implementation-blocking finding; dismiss a false positive or out-of-scope finding with a reason. The revised plan is ready when each finding traces to its disposition — reviewer silence is not the bar, and neither is folding the same report twice.

## Finish and report

End by reporting the artifact's absolute path and a plain overview of the approach, then any real concern and your recommendation — omitted entirely when none exists, never manufactured. Do not implement — plan only. Promote into a plan orchestrator only when settled boundaries expose independent planning slices along domain seams ([[dev/plan/roadmap]]); a large sequential plan stays base across yields so later decisions build on earlier ones.
