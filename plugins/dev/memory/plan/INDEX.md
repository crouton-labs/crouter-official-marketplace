---
kind: knowledge
when-and-why-to-read: When an agent invokes /dev:plan to pause work and map an implementation, this knowledge should be read because implementation can proceed from a grounded path instead of making consequential decisions while editing.
short-form: "Pause to write one right-sized implementation plan in the node context, then stop."
slash: true
rationale: The prior /dev:plan plugin prompt forced ordinary planning through a fixed question loop, reviewer node, and user approval, adding ceremony rather than letting the plan match the work. This slash front door routes the same shared method as plan-kind nodes instead of carrying a second planning template.
surfaces:
  - on: boot
    at: name
---

# /dev:plan — write an implementation plan

Pause the current work and follow [[dev/plan/guide]] to write one right-sized implementation plan for: $ARGUMENTS

For work that genuinely needs a broader planning roadmap, read [[dev/plan/roadmap]]. Do not implement as part of this invocation.

Lean toward ASD-STE100 in the artifact and closing response: state each necessary fact once, keep exact constraints, exceptions, numbers, and names, and cut inferable text.

End by reporting the artifact's absolute path and a short overview in plain, laconic language: what the plan does, then any real concerns or risks and what you recommend — omit those entirely when none exist rather than manufacturing them. Then stop.
