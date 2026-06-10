---
kind: skill
when-and-why-to-read: When the user asks to capture lessons, save what was learned, or update a project knowledge file from this conversation, this skill should be read because it extracts the session's key takeaways into a learned-skills file.
short-form: Extract key takeaways from the session and save them to a learned-skills file.
system-prompt-visibility: name
file-read-visibility: none
---

# Capturing session takeaways

Reflect on the current conversation and extract key takeaways relevant to the user's stated focus. Save them to the file the user specifies.

If the user has not given both a **focus** (what to extract) and an **output file** (where to save), ask once. Without an output path there is nowhere to write.

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

After the user confirms, write to the specified file. If the file already exists, merge with existing content rather than overwriting — keep prior takeaways unless they contradict what was just learned.
