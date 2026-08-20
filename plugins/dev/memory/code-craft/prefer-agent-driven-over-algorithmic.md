---
kind: preference
when-and-why-to-read: When you are choosing between agent judgment and a deterministic mechanism for open-ended work, or structuring one agent's output for another agent, this preference should be read because rigid control flow can prematurely collapse choices the receiving agent is equipped to judge in context.
short-form: Use agent judgment and loose prose for open-ended agent work; reserve rigid schemas for code consumers and hard invariants.
---

For open-ended or creative work, rely on agent judgment rather than deterministic pipelines or mechanical traversal. Structured data is inspiration and a resource, not a recipe: use it as context rather than control flow.

When one agent's output is destined only for another agent's prompt, prefer plain-text strings with a loose prose format—such as a title, a few sentences, and pointers—over typed fields and enums. Reserve rigid schemas for output that code, rather than an agent, consumes.

This preference does not replace deterministic enforcement for security boundaries, irreversible external effects, or invariants that code must guarantee.
