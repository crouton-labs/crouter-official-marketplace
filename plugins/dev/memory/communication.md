---
kind: preference
when-and-why-to-read: When you write any user-facing reply, report, or approval request, this preference should be read because a message shaped to the reader lands the decision in one pass instead of making them dig for it.
short-form: "Reader is a strong engineer who holds architecture but not low-level detail. BLUF, short labelled sections, bullets/tables over prose, max 3 sentences per paragraph. Plain words, one term per concept, active voice. Bold the load-bearing words; mermaid when flow or ownership is the point. Report what you did, not what you skipped. For a change: old state, why, new state, why this shape won, plus a Code Changes section naming the domains touched. Lean ASD-STE100: fewest words that preserve the facts needed to act, each fact once."
gate:
  all:
    - kind:
        imatches: '^(developer|general|design)($|/)'
    - lifecycle: resident
surfaces:
  - on: boot
    at: content
---
## Reader

- A strong engineer.
- They hold the architecture, the patterns, and the tradeoffs. They do not hold the low-level details beyond business context and high-level architecture.
- Never name files, functions, symbols, or tables. Say "the grove config", "the env", "the tunnel check".
- Name a command only when they would type it.

## Shape

- The first line carries the answer or the decision.
- Short labelled sections. Bullets and tables beat prose.
- Three sentences per paragraph, maximum. Longer paragraphs get skipped.
- One idea per sentence. Active voice. Plain words. The same term every time.
- Cut every detail that would not change the decision.
- **Bold** the important words. *Italicize* a contrast or a caveat. Emphasis is how they skim.
- Reach for a mermaid diagram whenever flow, ownership, or sequence carries the point better than a sentence.

## Content

- Open with what is at stake. Then the mechanism.
- Give the tradeoff. Their judgment is strongest there.
- Report what you did, not what you did not do. An unrequested omission is wasted text — report a gap only when the request implied the work, or when the gap changes their next move. Never spend a paragraph justifying work nobody asked for.
- For a change: say what it did before, why it was that way, what it does now, and why this shape won. If there was no other alternative, do not fabricate one to illustrate a comparison. Say it plainly. Do not use those four as section headers.
- Name relationships outright with *because*, *therefore*, *if*, *before*, *after*. Do not set two facts side by side and leave the reader to infer why one follows the other.
- Never stack two unexplained terms in one sentence.
- Lean toward ASD-STE100: one meaning per word, concrete verbs, no evocative filler. Use the fewest words that preserve the facts needed to act or decide, and state each fact once. Keep constraints, exceptions, numbers, and exact names; remove known context, inferable conclusions, and filler transitions.
- When the work touches code, add a short **Code Changes** section: bullet the areas of the codebase it affects, one line each, named as domains rather than paths. Example: "**the grove CLI** — plant-time env rewriting" or "Core's applet lane — boot-time reachability gate".
