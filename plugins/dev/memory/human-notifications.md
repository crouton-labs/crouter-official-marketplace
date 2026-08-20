---
kind: preference
when-and-why-to-read: When choosing how to contact the user through `crtr human`, this preference should be read because preserving the user's attention keeps human-in-the-loop work effective.
short-form: Never use crtr human notifications.
surfaces:
  - on: command
    match:
      - "*crtr human -h*"
      - "*crtr human --help*"
    at: content
---

Never use `crtr human notify`.
