---
kind: knowledge
when-and-why-to-read: When an agent invokes /spec to pause work and settle what a request should become, this knowledge should be read because the outcome gets developed with the user before it is pinned down, and the work can then resume from settled intent.
short-form: "Pause to explore the outcome with the user and write one right-sized specification in the node context, then stop."
slash: true
rationale: The specification is the written output of a finished exploration, so the command opens divergent and closes disciplined; challenging the user's premise is not the point, and the openness belongs on the solution. The prior /spec plugin prompt forced ordinary artifact requests through discovery loops, reviewer nodes, and user approval, turning a small pause to clarify work into prescribed ceremony. Reporting only the path also left the user opening a file to learn what was decided, and agents hedged inside the artifact — risk and concern commentary belongs in the closing overview, never in the spec, which must read as a pure statement of intended outcome. Scope boundaries were also drawn from a guess at what the change touches, so the spec named an outcome whose real reach nobody had mapped. Agents also promoted plausible nice-to-haves into requirements without asking, silently expanding the requested work.
surfaces:
  - on: boot
    at: name
---

# /dev:spec — write a specification

Pause the current work and write one right-sized specification for: $ARGUMENTS

Ground it in the relevant request and context. Make the intended outcome, behavior, and scope boundary clear enough that a downstream reader does not have to guess. Leave implementation choices to design and planning unless they constrain the outcome.

Explore before you converge. Take the request at face value and put the openness into what it could be: understand what the user is trying to achieve, develop a few genuinely different directions, and push each several steps rather than enumerating shallow variants. Bring them to the user as live options with what each buys and closes off — no objections, feasibility verdicts, or recommendation up front, and no pre-rejecting an unusual but coherent direction, since nothing is committed until they pick. Converge once they have chosen and what remains is detail.

Commit only what the user chose. What you explored and they did not choose stays out — speculative features, future extensibility, adjacent cleanup, and other merely plausible additions are not requirements just because they came up. If something seems likely desirable but is not explicitly or implicitly required by the request, ask the user whether to include it through `crtr human` before finishing the document (`crtr human send -h`), wait for their answer, and reflect that decision in the specification.

When the blast radius of the change is unclear — what it touches, who depends on it, what breaks — spawn `explore` scouts in parallel to map it before you write (`crtr node new -h`), and draw the scope boundary from their reports rather than from an assumption.

Write the artifact in `$CRTR_CONTEXT_DIR`. Read [[spec/guide]] when the request needs elicitation or a fuller quality check; for work that genuinely needs separate discovery, design, and requirements work across nodes, read [[spec/roadmap]].

Lean toward ASD-STE100 in the artifact and closing response: state each necessary fact once, keep exact constraints, exceptions, numbers, and names, and cut inferable text.

Keep the artifact pure: it states intended outcome, behavior, and scope, and nothing else. Concerns, risks, caveats, and recommendations do not go in it.

End by reporting the artifact's absolute path and a short overview in plain, laconic language: what the spec says, then any real concerns or risks and what you recommend — omit those entirely when none exist rather than manufacturing them. Then stop. Do not implement as part of this invocation.
