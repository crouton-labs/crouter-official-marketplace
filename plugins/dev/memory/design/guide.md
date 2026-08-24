---
kind: knowledge
when-and-why-to-read: When designing the structure of a change, this knowledge should be read because the decisions closed here are the expensive ones, and closing them on evidence rather than plausibility is what lets planning and implementation proceed without rework.
short-form: Ground the design in exploration evidence, spike the risky bets, weigh decisions by reversibility, and give a consequential design one absence-hunting review.
rationale: >-
  Designers drew constraints from an assumed blast radius, deliberated equally over reversible and one-way decisions, recorded risky bets as settled choices without proving them, and self-reviewed — so absences (the existing system a design ignored) survived to implementation. The section template and design styles are deliberately absent here — [[dev/artifacts/design]] owns them at writing time; the scope rule and style line are absent because [[dev/artifacts]] owns them once.
surfaces:
  - on: boot
    at: content
    gate: {kind: design}
---

## Designing a change

A design fixes the load-bearing structure before anyone writes code: component boundaries and responsibilities, interface contracts and data models, key flows, and the decisions that close real options. The altitude ceiling: a planner reading it has no design questions left, a coder reading it still has implementation choices, and nothing in it could be pasted into source. Design enough to close the expensive decisions and unblock parallel work, and no further — over-specification creates brittleness and rework when reality disagrees with the paper.

Write it as `design-<subject>.md` under the shared contract in [[dev/artifacts]], with the schema in [[dev/artifacts/design]]. A request that outgrows or undershoots design gets re-routed to the work it actually is, not forced through this method.

## Ground before you draft

The design rests on exploration evidence, not on memory of the codebase. Handed no exploration covering the blast radius, commission `explore` scouts before drafting — an explore orchestrator when the surface is large. Handed maps with gaps, fill the gaps by extending the handed documents in place rather than writing parallel notes. Drafting begins only when the map's Gaps section holds no design-relevant gap.

Brief scouts to map what the code is becoming, not just what it is — recent merges and review comments show the direction the file tree hides — and to find how the codebase already solves this class of problem, because consistency with an existing solution beats local cleverness.

## Spike the load-bearing bet

When the design rests on a risky, unproven bet — an unfamiliar API, an unclear performance profile, a novel algorithm — buy the evidence with a time-boxed spike through a `developer` child before committing the design to it. The spike brief demands a yes/no verdict on one named question; spike code carries no tests, no error handling, no abstractions, and is discarded. The verdict is recorded as evidence in the Decisions section — the temptation is to reason the bet out on paper, but an hour of spike beats a page of argument.

## Weigh decisions by reversibility

A reversible decision gets one line and no deliberation — deliberating it wastes the window and buries the decisions that matter. A one-way door — expensive to reverse once built on — gets the deliberation, and lands with the user through `crtr human` before the document closes, with the options and what each closes off.

## Review before you finish

Give a consequential design one independent review pass. Prime the reviewer to hunt absence — what exists in the system that this design ignored — with the guardrail that it names the missing thing from evidence, never fabricates one to have a finding. Have it put each element to one question: what concrete, current thing makes this necessary, and how would we detect that it is wrong? Fold the findings in once; dismiss a finding only by citing evidence, not by out-arguing it.

## Finish and report

End by reporting the artifact's absolute path, then one sentence per decision — what was chosen and what it closed off — then any real concern and your recommendation, omitted entirely when none exists. Promote into a design orchestrator only when the artifact itself splits into parts with written contracts between them ([[dev/design/roadmap]]); tightly coupled architecture stays base across yields so one mind owns its coherence.
