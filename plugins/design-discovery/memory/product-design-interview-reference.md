---
kind: knowledge
when-and-why-to-read: When you are applying the product-design-interview skill and follow its pointers to worked examples, the full catalog, or the annotated reference, this reference should be read because it holds the deep-dive material the skill body links to.
short-form: Deep-dive companion to the product-design-interview skill — worked examples and the full catalog the skill body points to.
gate:
  kind:
    imatches: '^(design|general)($|/)'
---
# product-design-interview — reference

Lookup layer for the [product-design-interview.md](product-design-interview.md) judgment: how to run a wave, a worked example, the reflect-back pattern, and the full lens catalog.

## Running a wave

A wave is one human page. The page contract — components, props, and delivery flags — is owned by `crtr human -h` and `crtr human send -h`; read it there rather than from an example here, because the examples below describe **question content**, not an executable payload.

What a good question carries: a title naming what it settles, a one-line statement of the decision and what is at stake, 2–4 genuine alternatives as starting points, and a writing surface for the answer in their own words. Judgment calls almost always need that writing surface — a picker alone forces a false choice.

## The reflect-back pattern

Open every wave after the first with a step that mirrors understanding before it asks anything new: what you now understand (3–5 bullets), which assumptions you are treating as true and whether each is **proven** or a **guess**, and the open risk that this wave's question is aimed at.

Example, as content rather than schema:

> **Where we are.** Day-1 pull is creating a real thing fast (proven — you chose it). Power users live here daily (guess — not confirmed). I am treating the empty state as the make-or-break moment. Risk: if creation needs setup first, the "fast" promise breaks — which is what I'm asking about now.

Never start wave N+1 without reflecting wave N back.

## Full lens catalog

Pick 3–4 per interview. Each lens names what it surfaces and how it becomes a concrete question.

### Experience (the heart — use most)

| Lens | Surfaces | Becomes the question |
|------|----------|----------------------|
| Underlying job | The real need behind the requested feature | "When they reach for this, what are they actually trying to get done?" |
| Moment of use | Where/when/what state the user is in | "Picture the exact moment they open this — what just happened to them?" |
| How it should feel | The target emotion | "Right after using it, what should they feel — relieved, powerful, calm, proud?" |
| First-run vs habituated | Day-1 newcomer vs day-100 regular diverge | "Are we designing the first time or the hundredth?" |
| Hero path | The one flow 80% will take | "If a user does exactly one thing here, what is it?" |
| Friction audit | Where effort, waiting, or a decision creeps in | "Where does the user have to stop and think?" |
| Anti-experience | What it must NOT feel like; the status-quo being beaten | "What's the current/competitor experience we're reacting against?" |
| Delight vs table-stakes | The one surprising moment vs baseline expectation | "What's the moment they'd screenshot and send to a friend?" |
| Who it's NOT for | Sharpens the user by exclusion | "Who should bounce off this and be fine?" |
| Trust & stakes | What's at risk for the user; how forgiving it must be | "What's the cost to them if this gets it wrong?" |
| Voice & personality | How the product 'speaks' / its character | "If this product were a person, how would it talk to them?" |

### Pressure tests (devil's advocate)

| Lens | Surfaces | Becomes the question |
|------|----------|----------------------|
| Pre-mortem (abandonment) | The most likely reason it falls flat | "Six months out, they tried it once and never came back. Why?" |
| One-sentence pitch | Whether the value is legible | "How would a user describe this to a friend in one sentence?" |
| Demo moment | The single screen that makes someone 'get it' | "What's the one moment you'd put in a demo?" |
| Subtraction | Scope creep / overbuild | "What could we remove and make the experience better?" |
| The cut line | The minimal lovable version | "What's the smallest version that still delivers the feeling?" |
| Kill criterion | The condition to stop / pivot | "What would you have to see to admit this experience isn't working?" |

### Lens selection by situation

- **New product / 0→1**: underlying job, moment of use, how it should feel, one-sentence pitch.
- **New feature in an existing product**: hero path, friction audit, anti-experience, the cut line.
- **"It feels off but I can't say why"**: friction audit, how it should feel, pre-mortem, subtraction.
- **Polishing / pre-launch**: delight vs table-stakes, demo moment, first-run vs habituated, who it's NOT for.

Adapt freely — if the interview cracks something open, switch lenses to follow it.
