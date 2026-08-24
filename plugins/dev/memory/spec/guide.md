---
kind: knowledge
when-and-why-to-read: When exploring, eliciting, or writing a specification, this knowledge should be read because the outcome has to be developed with the user before it is pinned down, and downstream design and planning then need it settled without avoidable questions.
short-form: Explore openly with the user, converge on what they chose, then write a right-sized behavioral contract per the shared artifact rules.
rationale: >-
  Spec writers converged too early — one interpretation reflected back, questions minimized, elicitation stopped as soon as no answer would change the contract — so the agent transcribed the request instead of developing it. Specs touching code also drew their scope from a guess at the blast radius rather than exploration evidence. The dimensions list and finished bar are deliberately absent here — [[dev/artifacts/spec]] owns them at writing time; the scope-expansion ask and style line are absent because [[dev/artifacts]] owns them once.
surfaces:
  - on: boot
    at: content
    gate: {kind: spec}
---

## Writing a specification

A specification settles what outcome and behavior are required, at a depth that follows the stakes: a small reversible change needs a few paragraphs, a consequential product surface needs collaborative discovery and perhaps separate design. Write it as `spec-<subject>.md` under the shared contract in [[dev/artifacts]], with the schema in [[dev/artifacts/spec]]. A request that outgrows or undershoots specification gets re-routed to the work it actually is, not forced through this method.

## Ground a code-touching spec

A spec that touches code rests on exploration evidence, not on memory of the codebase. Handed no exploration covering the blast radius, commission `explore` scouts before drafting — an explore orchestrator when the surface is large. Handed maps with gaps, fill the gaps by extending the handed documents in place rather than writing parallel notes. Draft only when the map's Gaps section holds nothing spec-relevant.

## Explore before you converge

Take the request at face value and put the openness into what it could be: a specification is the output of a finished exploration, and the first shape anyone thinks of is rarely the best available. Develop a few genuinely different directions rather than shallow variants, and push each several steps — remove an assumed constraint, change who is served, do materially less and see what survives, ask what happens if nothing changes.

Bring these to the user as live options in plain language, with what each buys and closes off. Do not open with objections, feasibility verdicts, or a recommendation — nothing is committed until the user picks, so divergence is free. If something in the request genuinely does not fit what they are trying to achieve, say so once; questioning their premise is not the job. Converge when the user has chosen and what remains is detail.

## Elicit without interrogating

Investigate before asking: a fact available from the project is not a question for the user; intent never is such a fact. Reflect a concrete interpretation back for confirmation, and spend questions on the uncertainty whose answer could most change behavior, scope, or acceptance — one decision or one small coherent set, never a questionnaire. Fold each answer into the specification as current truth, and stop eliciting when another answer would not materially change the contract.

## Commit only what the user chose

Exploration is unbounded; the document is not. What you explored and the user did not choose stays out — the scope rule and its `crtr human` ask are in [[dev/artifacts]].

## Finish and report

Read the finished spec once as a stranger: remove placeholders and contradictions, resolve wording with two plausible interpretations, and confirm every acceptance signal can be observed. Fix the artifact in place rather than creating a review log.

End by reporting the artifact's absolute path and a plain overview of what it settles, then any real concern and your recommendation — omitted entirely when none exists, never manufactured. Promote into a spec orchestrator only when settled boundaries expose independent specification, design, or requirements surfaces ([[dev/spec/roadmap]]); consequential collaboration or multi-window work stays base across yields.
