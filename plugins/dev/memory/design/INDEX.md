---
kind: knowledge
when-and-why-to-read: When an agent invokes /dev:design to pause work and settle the structure of a change, this knowledge should be read because implementation can then build against closed decisions instead of re-deciding architecture mid-edit.
short-form: "Pause to write one right-sized design in the node context, then stop."
slash: true
rationale: The design kind carried the only design guidance in the tree, so a general node asked for an architecture had nothing but its own instincts — it produced descriptions of current code rather than designs, drifted into function-level detail, and left the implementer a branch to pick. This slash front door routes the same shared method as design-kind nodes instead of carrying a second artifact template.
surfaces:
  - on: boot
    at: name
---

# /dev:design — settle the structure of a change

Pause the current work and follow [[dev/design/guide]] to write one right-sized design for: $ARGUMENTS

For a design large enough to split across nodes, read [[dev/design/roadmap]]. Do not implement the change as part of this invocation.

Lean toward ASD-STE100 in the artifact and closing response: state each necessary fact once, keep exact constraints, exceptions, numbers, and names, and cut inferable text.

End by reporting the artifact's absolute path and a short overview in plain, laconic language: one sentence per decision — what was chosen and what it closed off — then any real concerns and what you recommend, omitted entirely when none exist rather than manufactured. Then stop.
