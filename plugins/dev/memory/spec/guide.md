---
kind: knowledge
when-and-why-to-read: When exploring, eliciting, or writing a specification, this knowledge should be read because the outcome has to be developed with the user before it is pinned down, and downstream design and planning then need it settled without avoidable questions or ceremony.
short-form: Explore openly with the user, converge on what they chose, then write a right-sized behavioral contract a downstream reader can use without guessing.
rationale: >-
  Specification quality and elicitation guidance lived inside an always-loaded spec persona while the lightweight /spec command had almost none, leaving agents to choose between a vague one-shot and a fixed discovery workflow. Spec writers also promoted plausible nice-to-haves into requirements without asking, silently expanding the requested work. Every remaining lever then pointed at convergence — one interpretation reflected back, questions minimized, elicitation stopped as soon as no answer would change the contract — so the agent transcribed the request instead of developing it. The exploration is about the solution — challenging the user's premise is available when something genuinely does not fit, never a required move.
surfaces:
  - on: boot
    at: content
    gate: {kind: spec}
---

# Writing a specification

A specification settles **what outcome and behavior are required**. It is not an architecture document or an implementation plan. Its depth follows the stakes and unresolved intent: a small reversible change may need a few paragraphs; a consequential product surface may need collaborative discovery and separate design.

## Explore before you converge

Take the request at face value and put the openness into what it could be. Understand what the user is trying to achieve and why now, then develop the possibilities with them: a specification is the output of a finished exploration, and the first shape anyone thinks of is rarely the best one available.

Develop a few genuinely different directions rather than enumerating shallow variants, and push each one several steps — what changes, what that makes possible next, what it looks like once it exists. Moves that open a direction: remove a constraint everyone assumed; change who or what is served; do materially less than asked and see what survives; ask what happens if nothing changes at all. Where the surrounding system or prior art would feed the thinking, read for it while you think, not as a validation pass afterward.

Bring these to the user as live options, in plain language, with what each buys and closes off. Do not open with objections, feasibility verdicts, or a recommendation, and do not pre-reject an unusual but coherent direction — nothing is committed until the user picks, so divergence is free. If something in the request genuinely does not fit what they are trying to achieve, say so once; questioning their premise is not the job.

Converge when the user has chosen among live options and what remains is detail.

## Elicit without interrogating

Investigate before asking. Read the request, relevant code and documents, and already-settled decisions first. A fact available from the project is not a question for the user; intent never is such a fact.

Reflect a concrete interpretation back so the user can confirm or correct it. Resolve the uncertainty whose answer could most change behavior, scope, or acceptance. When a decision really belongs to the user, give them a focused question with a proposed default or concrete options; use one decision or one small coherent set rather than a questionnaire.

Spend attention where judgment is load-bearing, not where detail is merely available. Keep settled points moving and fold each answer into the specification as current truth. Once converged, stop eliciting when another answer would not materially change the behavioral contract. Explicit approval is warranted when the user is co-authoring the document or the remaining decision is consequential; ordinary reversible work does not need a ritual approval loop.

## Commit only what the user chose

Exploration is unbounded; the document is not. What you explored and the user did not choose stays out — speculative features, future extensibility, adjacent cleanup, and other merely plausible additions are not requirements just because they came up. The bar is not smallness for its own sake: nothing enters the specification without the user's assent.

When something seems likely desirable but is not explicitly or implicitly required by the request, ask the user whether to include it through `crtr human` before finishing the specification (`crtr human send -h`), wait for their answer, and make the resulting boundary explicit. Do not hide the addition in an assumption, recommendation, or optional requirement.

## The finished specification

A downstream reader should be able to understand the required outcome and produce a design or plan without inventing intent. Include the dimensions that matter for this request rather than forcing a section template:

- the user, caller, or system being served and the intended outcome;
- observable behavior and experience;
- scope and non-goals;
- consequential constraints and settled decisions;
- relevant interfaces, states, and transitions;
- failure behavior, boundary conditions, and edge cases;
- acceptance scenarios that make success observable.

Implementation detail belongs only where it constrains the outcome. A finished specification has no unresolved question that would force downstream work to guess; intentionally deferred, non-blocking questions are named as such.

Before handing it off, read it once as a stranger: remove placeholders and contradictions, resolve wording with two plausible interpretations, confirm the scope is coherent enough to plan, and ensure every acceptance signal can be observed. Split independent outcomes rather than hiding them in one oversized document. Fix the artifact in place rather than creating a review log.

For a specification effort that genuinely needs separate discovery, design, and requirements work across nodes, read [[dev/spec/roadmap]]. For the qualities of individual requirements and the complete requirements artifact, read [[dev/spec/requirements]].
