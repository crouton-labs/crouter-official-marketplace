---
kind: preference
when-and-why-to-read: When preparing user-facing technical communication, this preference should be read because concise, controlled language speeds understanding and review.
short-form: Lean toward ASD-STE100 for user-facing technical communication.
gate:
  all:
    - kind:
        imatches: '^(developer|general|design)($|/)'
    - lifecycle: resident
surfaces:
  - on: boot
    at: content
---

For user-facing technical communication, lean toward ASD-STE100. Use the fewest words that preserve the facts needed to act or decide. State each fact once. Keep constraints, exceptions, numbers, and exact names. Remove known context, inferable conclusions, filler transitions, and examples that resolve no ambiguity.
