---
kind: preference
when-and-why-to-read: When you are about to add a fallback, fail-safe, heuristic, compatibility shim, or edge-case rule to make a case work, this preference should be read because the guard often hides a broken invariant and turns one defective path into two paths that must remain coherent.
short-form: Stop before adding a fallback or heuristic; restore the invariant and one authoritative path instead.
---

Reaching for a fail-safe, fallback, heuristic, compatibility shim, or edge-case rule is a signal to stop and inspect the architecture before adding the guard.

Name the invariant the guard compensates for, then look for the design that makes the bad case structurally impossible: one authoritative producer per fact, one path, and identity instead of inference. This redesign is often smaller than the guard and deletes code rather than adding it ([[dev/code-craft/net-simpler-refactors]], [[dev/code-craft/prefer-hard-cuts]]).

Two common shapes:

- A strict parser, validator, or schema rejects real input. Do not add a lenient second parser. Keep one strict parser, fix invalid sources, isolate bad items at the collection boundary when partial progress is legitimate, and enforce validity at authoring time.
- Two producers write one structure and the code begins inferring which produced an entry through equality, position, timestamps, or matching scans. Make one producer authoritative and render other information as an overlay that never enters the shared structure.

When the better design is not clear, present the failed invariant and candidate options to the user rather than shipping the hedge by default.
