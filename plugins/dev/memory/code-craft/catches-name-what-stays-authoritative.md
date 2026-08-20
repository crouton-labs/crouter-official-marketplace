---
kind: preference
when-and-why-to-read: When you are writing or reviewing a catch block, retry loop, or path documented as best-effort, this preference should be read because a failure converted into an ordinary success value can produce incorrect behavior with no remaining evidence of its cause.
short-form: A catch is sound only when something else stays authoritative and the caller can distinguish failure from success.
---

A `catch` is sound only when you can name what stays authoritative while it fires: telemetry can fail while the operation it measured stays authoritative; optional presentation metadata can fail while the underlying action proceeds. If you cannot name that surviving authority, the catch is not handling an error; it is inventing an answer.

A catch that converts failure into a default, zero counter, `null`, or bare success value the caller cannot distinguish from success is a defect however carefully a comment explains it. Either return something honestly different from a success value or let the error out.

Three corollaries decide most cases:

- **Never fail open on infrastructure error where spend or security consequences follow.** A permission or quota lookup that could not reach its store established nothing; treating unreachable as allowed converts an outage into charges or access.
- **Never discard the error object while counting failures.** A tally with no cause attached hands the next debugger the whole investigation from scratch.
- **A poll loop's catch allowlists what it absorbs and rethrows everything else.** Blocking only known-bad errors lets an unanticipated failure spin forever without surfacing.

[[dev/code-craft/reject-fallback-hedges]] governs proposing a hedge at design time; this is the same discipline at the catch site.
