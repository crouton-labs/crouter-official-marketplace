---
kind: knowledge
when-and-why-to-read: When an agent invokes /dev:spec to pause work and settle what a request should become, this knowledge should be read because the outcome gets developed with the user before it is pinned down, and the work can then resume from settled intent.
short-form: "Pause to explore the outcome with the user and write one right-sized specification, then stop."
slash: true
rationale: >-
  A front door that carried method, reporting, and style rules alongside its routing drifted against the guide that owned them. This door only routes; the closing-report contract lives in [[dev/spec/guide]] and the style line in [[dev/artifacts]].
surfaces:
  - on: boot
    at: name
---

# /dev:spec — write a specification

Pause the current work and follow [[dev/spec/guide]] to produce one right-sized specification for: $ARGUMENTS

For work whose settled boundaries expose independent specification, design, or requirements surfaces, follow [[dev/spec/roadmap]]. Do not implement as part of this invocation.
