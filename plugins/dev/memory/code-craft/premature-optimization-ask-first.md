---
kind: preference
when-and-why-to-read: When an optimization or protective mechanism would add structural complexity and the user did not request it, this preference should be read because early-stage projects often benefit more from proving the design than from machinery that reduces costs they do not yet experience.
short-form: Skip structurally costly optimization until its value is clear; ask the user when the tradeoff is genuinely ambiguous.
---

When an optimization costs structural complexity, weigh the project's lifecycle before adding it. Early build and test phases usually tolerate churn and inefficiency; proving the design matters more than polishing its cost profile.

Use three cases:

- **Obviously worthwhile, or explicitly requested:** implement it.
- **Obviously not worthwhile for the task:** skip it.
- **Genuinely ambiguous:** default to not adding it yet and ask the user before designing it in.

Do not let an unrequested optimization become engineering overhead the project must pay down before its need has been demonstrated.
