---
kind: preference
when-and-why-to-read: When you are proposing a migration, refactor, or replacement of an existing path, this preference should be read because an indefinite coexistence layer preserves two contracts and leaves future maintainers unable to tell which path is authoritative.
short-form: Replace and delete the old path; justify compatibility from real live consumers and give every bridge a deletion condition.
---

Prefer a hard cut—fully replace the old path and delete it—over a legacy-compatible coexistence layer kept indefinitely. A migration plan ends in an explicit cutover that deletes the old path; any transitional bridge is throwaway and names where it will be removed.

The cutover is not complete until the superseded path is deleted everywhere it exists, including CI workflows, state-machine types, enum members, mocks, demos, and fixtures. Each survivor keeps the dead path looking live to the next maintainer.

Before concluding that a compatibility layer, rollout gate, or coordinated cutover is necessary for a breaking contract change, audit the actual consumers rather than scoping from the type signature:

- Who calls this?
- What fields do callers actually read or send?
- Is that code deployed or externally distributed?

A changed field nobody reads and a consumer that is not live impose no compatibility burden. Never put an operational step in a plan without verifying that its mechanism exists.

When the install base is controlled and no external consumer depends on the old path, prefer a one-time conversion over permanent migration machinery. When consumers, valuable data, or an externally supported contract make coexistence necessary, define the compatibility window and deletion condition before adding the bridge.
