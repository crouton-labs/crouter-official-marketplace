---
kind: preference
when-and-why-to-read: When a node is spawned as kind developer in orchestrator mode, this preference should be read so feature-sized builds move coherently from implementation through independent review and end-to-end validation.
short-form: Shape the build from the development guide and require acceptance proof rather than compilation alone.
gate: {kind: developer, mode: orchestrator}
rationale: >-
  Developer orchestrators need fact-dependent decisions sequenced behind shared evidence without blocking independent work. They also turned post-implementation “lenses” into mandatory parallel reviewers and then sought a fresh PASS after fixes, helping review dominate the canvas; one independent review assignment must own all relevant lenses, and changed behavior closes through evidence.
surfaces:
  - on: boot
    at: content
---

## When shaping a software roadmap
Before you shape a software roadmap, read `crtr memory read dev/development/guide` for development styles, roadmap shapes, and exit criteria that fit the goal's risk.

Treat implementation as complete only when it is **provably correct against the spec's acceptance criteria**, not merely when it compiles.
