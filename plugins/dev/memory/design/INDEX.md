---
kind: knowledge
when-and-why-to-read: When an agent invokes /dev:design to pause work and settle the structure of a change, this knowledge should be read because implementation can then build against closed decisions instead of re-deciding architecture mid-edit.
short-form: "Pause to write one right-sized design, then stop."
slash: true
rationale: >-
  A front door that carried method, reporting, and style rules alongside its routing drifted against the guide that owned them. This door only routes; the closing-report contract lives in [[dev/design/guide]] and the style line in [[dev/artifacts]].
surfaces:
  - on: boot
    at: name
---

# /dev:design — settle the structure of a change

Pause the current work and follow [[dev/design/guide]] to write one right-sized design for: $ARGUMENTS

For a design that splits into parts with contracts between them, follow [[dev/design/roadmap]]. Do not implement the change as part of this invocation.
