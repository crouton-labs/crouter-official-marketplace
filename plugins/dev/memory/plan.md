---
kind: knowledge
when-and-why-to-read: When an agent invokes /plan to pause work and map an implementation, this knowledge should be read because implementation can proceed from a grounded path instead of making consequential decisions while editing.
short-form: "Pause to write one right-sized implementation plan in the node context, then stop."
slash: true
rationale: The prior /plan plugin prompt forced ordinary planning through a fixed question loop, reviewer node, and user approval, adding ceremony rather than letting the plan match the work. Reporting only the path also left the user opening a file to learn the approach, and agents hedged inside the artifact — risk and concern commentary belongs in the closing overview, never in the plan, which must read as a pure buildable path. Affected areas were also drawn from a guess at what the change touches, so plans missed call sites and consumers the implementer then hit mid-edit.
---

# /dev:plan — write an implementation plan

Pause the current work and write one right-sized implementation plan for: $ARGUMENTS

Ground it in the relevant code and requirements. Make the approach, affected areas, ordering or dependencies, and verification clear enough that an implementer can carry it out without guessing. Resolve only the decisions the plan needs; point to existing patterns rather than repeating source code.

When the blast radius of the change is unclear — what it touches, who depends on it, what breaks — spawn `explore` scouts in parallel to map it before you write (`crtr node new -h`), and draw the affected areas from their reports rather than from an assumption.

Write the artifact in `$CRTR_CONTEXT_DIR`. For work that genuinely needs a broader planning roadmap, read [[plan/roadmap]] instead.

Keep the artifact pure: it states the approach, affected areas, ordering, and verification, and nothing else. Concerns, risks, caveats, and recommendations do not go in it.

End by reporting the artifact's absolute path and a short overview in plain, laconic language: what the plan does, then any real concerns or risks and what you recommend — omit those entirely when none exist rather than manufacturing them. Then stop. Do not implement as part of this invocation.
