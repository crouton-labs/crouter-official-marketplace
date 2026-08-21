---
kind: knowledge
when-and-why-to-read: When an agent invokes /dev:spec to pause work and settle what a request should become, this knowledge should be read because the outcome gets developed with the user before it is pinned down, and the work can then resume from settled intent.
short-form: "Pause to explore the outcome with the user and write one right-sized specification in the node context, then stop."
slash: true
rationale: The specification is the written output of a finished exploration, so the command opens divergent and closes disciplined; challenging the user's premise is not the point, and the openness belongs on the solution. The prior /dev:spec plugin prompt forced ordinary artifact requests through discovery loops, reviewer nodes, and user approval, turning a small pause to clarify work into prescribed ceremony. Reporting only the path also left the user opening a file to learn what was decided, and agents hedged inside the artifact — risk and concern commentary belongs in the closing overview, never in the spec, which must read as a pure statement of intended outcome. Scope boundaries were also drawn from a guess at what the change touches, so the spec named an outcome whose real reach nobody had mapped. Agents also promoted plausible nice-to-haves into requirements without asking, silently expanding the requested work.
surfaces:
  - on: boot
    at: name
---

# /dev:spec — write a specification

Pause the current work and follow [[dev/spec/guide]] to produce one right-sized specification for: $ARGUMENTS

For work whose settled boundaries expose independent specification, design, or requirements surfaces, follow [[dev/spec/roadmap]]. Do not implement as part of this invocation.

Lean toward ASD-STE100 in the artifact and closing response: state each necessary fact once, keep exact constraints, exceptions, numbers, and names, and cut inferable text.

End by reporting the artifact's absolute path and a short overview in plain, laconic language: what the specification says, then any real concern or risk and your recommendation, omitted when none exists. Then stop.
