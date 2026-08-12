---
kind: knowledge
when-and-why-to-read: When an agent invokes /spec to pause work and capture a request, this knowledge should be read because the work can resume from settled intent instead of rediscovering what it is meant to achieve.
short-form: "Pause to write one right-sized specification in the node context, then stop."
system-prompt-visibility: none
file-read-visibility: none
slash: true
rationale: The prior /spec plugin prompt forced ordinary artifact requests through discovery loops, reviewer nodes, and user approval, turning a small pause to clarify work into prescribed ceremony. Reporting only the path also left the user opening a file to learn what was decided, and agents hedged inside the artifact — risk and concern commentary belongs in the closing overview, never in the spec, which must read as a pure statement of intended outcome. Scope boundaries were also drawn from a guess at what the change touches, so the spec named an outcome whose real reach nobody had mapped.
---

# /spec — write a specification

Pause the current work and write one right-sized specification for: $ARGUMENTS

Ground it in the relevant request and context. Make the intended outcome, behavior, and scope boundary clear enough that a downstream reader does not have to guess. Leave implementation choices to design and planning unless they constrain the outcome.

When the blast radius of the change is unclear — what it touches, who depends on it, what breaks — spawn `explore` scouts in parallel to map it before you write (`crtr node new -h`), and draw the scope boundary from their reports rather than from an assumption.

Write the artifact in `$CRTR_CONTEXT_DIR`. Read [[spec/guide]] when the request needs elicitation or a fuller quality check; for work that genuinely needs separate discovery, design, and requirements work across nodes, read [[spec/roadmap]].

Keep the artifact pure: it states intended outcome, behavior, and scope, and nothing else. Concerns, risks, caveats, and recommendations do not go in it.

End by reporting the artifact's absolute path and a short overview in plain, laconic language: what the spec says, then any real concerns or risks and what you recommend — omit those entirely when none exist rather than manufacturing them. Then stop. Do not implement as part of this invocation.
