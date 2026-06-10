---
kind: skill
when-and-why-to-read: When the user has product-design questions, wants to figure out how a product or feature should feel, or says "grill me" about the product, this skill should be read because it runs a Socratic, human-led interview to shape the ideal product experience.
short-form: Socratic human-led interview to shape the ideal product experience (not technical design).
system-prompt-visibility: name
file-read-visibility: none
---

# product-design-interview

Audience: future LLM agent sessions. You help the user discover the ideal product experience by *interviewing* them, not by proposing designs. They know more than they can say in one pass; your value is asking the question they haven't asked themselves. This is about how the product should **feel and work for its user** — the moments, the emotional arc, the job it does — not data models, APIs, or implementation (that's the sibling `technical-design-interview`). Drive it through `crtr human`: each wave is a deck, kicked off non-blocking, answered into your inbox.

## The core move

Don't answer — ask. Replace "why?" with "what makes you say that?" (same depth, less confrontation). Run in **waves**: a wave is one `crtr human` deck of 2–5 tightly-related questions. Read the answers, find the **tension** — a contradiction, an unexamined assumption, something avoided, a blocker — and aim the next wave straight at it. Surface answers come first; the real insight surfaces in wave 2–3 once the obvious is exhausted. The structure is a tool, not the goal: if an answer cracks something open, drop your plan and chase that thread. Stop when no question you could ask would change the picture.

## Run it through crtr human

- Build a deck JSON file, then `crtr human ask --context-file <path>`. The kickoff returns instantly and **never blocks** — the human answers on their own time and the result is pushed to your inbox. Don't busy-wait or poll; end your turn or keep working, you'll be woken with the answer.
- One wave = one deck (`interactions[]`). Each question: a `title` (the topic, not the decision), a `subtitle` (the one-line ask), 2–4 *real* `options` as starting points, and `allowFreetext: true` — experience calls are judgment calls, always let them answer in their own words.
- Frame every question as a concrete **moment**, never an abstraction. *"A new user lands on the empty dashboard — what's the one thing they should feel pulled to do?"* beats *"What are your UX goals?"*.
- Match answers back by `id`, never by index — the human can skip questions.
- Deck JSON shape, a worked wave, the reflect-back mechanism, and the full lens catalog live in [product-design-interview-reference.md](product-design-interview-reference.md).

## Pick 3–4 lenses, not all of them

A lens is a way of seeing what's otherwise invisible; each one generates a concrete question. Choose a few per interview. The experience lenses that matter most:

- **The underlying job** — what is the user *actually* trying to get done? Ask past the feature to the need it serves.
- **The moment of use** — where, when, in what state does the user hit this? Design for that exact moment, not an abstract user.
- **How it should feel** — name the target emotion (relief, power, calm, pride). An experience with no intended feeling is undirected.
- **First-run vs habituated** — day-1 and day-100 are different products. Be clear which one you're designing right now.
- **The anti-experience** — what should this explicitly NOT feel like? What status-quo are you beating? Naming the enemy sharpens the target.
- **The cut line** — the smallest version that still delivers the feeling. Guards the core against scope creep drowning it.

Pressure-test with: **pre-mortem** ("they tried it once and never came back — why?"), **the one-sentence pitch** ("how would a user describe this to a friend?"), and **subtraction** ("what could we remove to make it better?"). Full catalog with question phrasings: [product-design-interview-reference.md](product-design-interview-reference.md).

## Reflect back between waves

After each wave, mirror understanding before asking more — lead the next deck with a `kind:"context"` interaction (or send `crtr human notify`) carrying: what you now understand (3–5 bullets), the assumptions you're treating as true (mark *proven* vs *guess*), and each open risk turned into the next wave's question. This is where a wrong assumption gets caught before it hardens into a wrong build.

## Close with the picture, then a coverage check

Before finalizing, ask one coverage question — *"Anything we circled but didn't land? Anything deliberately off the table?"*. When they confirm it's covered, write the **experience picture**: the user & their moment, the target feeling, the hero path (the one flow 80% will take), what's explicitly out of scope, open questions, and the single concrete next step.

## Failure modes

- **Stopping at wave 1.** Surface answers aren't the insight — push to wave 2–3.
- **Proposing instead of asking.** The moment you suggest a design, you've stopped learning what they want.
- **Abstract questions.** "What are the goals?" yields mush. Anchor every question in a concrete moment with real options.
- **Covering categories instead of chasing tension.** When an answer reveals a contradiction or a fear, abandon the plan and dig there.
- **Drifting technical.** "Which database?" belongs to `technical-design-interview`. Stay on experience: need, moment, feel.
- **Busy-waiting on crtr human.** The kickoff is non-blocking; never sit and poll — let the inbox wake you.
- **Skipping the reflect-back.** Unstated assumptions become the wrong build; mirror understanding between every wave.

## Related

- `claude-humanloop/humanloop` — deck authoring philosophy (title/subtitle/body pyramid, real options, progressive disclosure).
- `crtr human -h` — the ask/notify/review surface this skill drives.
- `crtr/design`, `crtr/spec` — where a settled picture goes to become an artifact.
