---
kind: knowledge
when-and-why-to-read: When the user asks to capture lessons, save what was learned, or update durable knowledge from this conversation, this skill should be read because it preserves the session's non-obvious takeaways in the right memory scope.
short-form: Extract key takeaways from the session and save them as durable memory.
surfaces:
  - on: boot
    at: name
---

# Capturing session takeaways

Reflect on the current conversation and extract key takeaways relevant to the user's stated focus. Save durable takeaways through the crouter memory substrate.

If the user has not given both a **focus** (what to extract) and the intended **memory scope** (node, project, profile, or user), ask once. The scope decides who can use the takeaway later.

## What to save

Only include information that represents **specific knowledge unique to this project and the user's preferences**.

**Good:**

- User's preferences (style, workflow, conventions)
- Locations of critical files
- Lessons from mistakes made
- Non-obvious constraints discovered this session

**Bad:**

- Information that can be found by googling (e.g. how React hooks work)
- Information that doesn't require high familiarity with the project (e.g. best practices for Express applications)
- Verbose, obvious content

Be efficient — long documents aren't worth reading. If the information is inferrable or obvious, skip it. The bar is: *will this save time for a future LLM performing this task?*

## Propose before saving

Never auto-save silently. Propose the takeaways and ask the user to confirm:

> "I think the key lessons here are:
>
> - [takeaway 1]: [details]
> - [takeaway 2]: [details]
> - [takeaway 3]: [details]
>
> Should I save these?"

After the user confirms, run `crtr memory write -h` and use its current routing guidance to find the existing document or create the narrowest durable document that reaches future readers. Update an existing document in place when it covers the same truth; replace superseded guidance rather than preserving conflicting versions.
