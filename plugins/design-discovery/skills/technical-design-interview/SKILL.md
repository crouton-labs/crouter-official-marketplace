---
name: "technical-design-interview"
description: "Socratic, crtr human-led interview to extract and pressure-test the technical design of a system before building — architecture, scale, data model, integrations, failure modes, tradeoffs. Use when the user wants to think through how to build something, says 'grill me on the architecture', or a technical approach is underspecified. Feeds crtr design/spec."
type: playbook
---

# technical-design-interview

Audience: future LLM agent sessions. You help the user nail the technical design of a system by *interviewing* them, not by picking the architecture for them. They hold the constraints, the load shape, the systems they can't change; your value is dragging those into the open and forcing the tradeoffs to be explicit before code gets written. This is the **elicitation front-end** that feeds a design or spec — not the artifact itself. The experience-side counterpart is the sibling `product-design-interview`. Drive it through `crtr human`: each wave is a deck, kicked off non-blocking, answered into your inbox.

## The core move

Don't design — elicit. Replace "why?" with "what makes that a hard requirement?". Run in **waves**: a wave is one `crtr human` deck of 2–5 tightly-related questions. Read the answers, find the **tension** — a contradiction, an unexamined "it'll be fine", a hidden dependency, a forced tradeoff being dodged — and aim the next wave straight at it. The first answers are the happy path; the real design surfaces in wave 2–3 when you push into scale, failure, and the choices that can't be had both ways. The structure is a tool, not the goal: if an answer exposes a load-bearing assumption, drop the plan and dig there. Stop when no question you could ask would change the design.

## Run it through crtr human

- Build a deck JSON file, then `crtr human ask --context-file <path>`. The kickoff returns instantly and **never blocks** — the human answers on their own time, the result is pushed to your inbox. Don't poll; end your turn or keep working.
- One wave = one deck (`interactions[]`). Each question: `title` (topic), `subtitle` (the one-line ask), 2–4 *real* `options` as starting points, `allowFreetext: true`. Always allow freetext — technical answers carry caveats.
- Anchor questions in concrete numbers and scenarios, never abstractions. *"At 10x today's writes, all hitting in a morning burst — does the store still hold?"* beats *"How should we handle scale?"*.
- Match answers back by `id`, never by index — the human can skip.
- Deck JSON shape, a worked technical wave, the reflect-back mechanism, and the full lens catalog live in [reference.md](reference.md).

## Pick 3–4 lenses, not all of them

A lens is a way of seeing what's otherwise invisible; each generates a concrete question. Choose a few per interview. The technical lenses that matter most:

- **Requirements & invariants** — what must *always* be true, even under failure? Correctness boundaries before mechanism.
- **Scale & load shape** — volume, concurrency, growth; bursty vs steady. The 10x case is where designs break.
- **Data model & ownership** — entities, the single source of truth, what consistency each read actually needs.
- **Integration & boundaries** — what it depends on that you *don't* control, and the contracts at each seam.
- **Failure modes & blast radius** — what breaks, what cascades, where the single points of failure are. Push every answer to "and if that dies mid-operation?".
- **Forced tradeoffs** — the choices you can't have both ways (consistency vs availability, latency vs cost, simple-now vs flexible-later). Your job is to make the choice explicit, not paper over it.

Pressure-test with: **pre-mortem** ("it's 6 months later and this fell over in prod — what was the cause?"), **inversion** ("what would you do to *guarantee* this fails?"), **minimal version** ("what's the smallest thing that solves 80%?"), and **operability** ("when it breaks at 3am, what tells you, and what do you look at?"). Full catalog with phrasings: [reference.md](reference.md).

## Reflect back between waves

After each wave, mirror understanding before asking more — lead the next deck with a `kind:"context"` interaction (or send `crtr human notify`) carrying: what you now understand (3–5 bullets), the assumptions you're treating as load-bearing (mark *confirmed* vs *guess*), and each open risk turned into the next wave's question. This is where a silent assumption gets caught before it becomes a wrong build.

## Close with the picture, then hand off

Before finalizing, ask one coverage question — *"Anything we circled but didn't land? Any constraint I haven't heard?"*. When they confirm, write the **technical picture**: the invariants & requirements, the load shape, the data model & owners, the external dependencies, the failure modes and their handling, the forced tradeoffs *and which way you chose*, open risks, and the next step. Then hand off: feed this to `crtr/design` to produce the design artifact, or seed a `crtr/spec` effort. This interview does not replace the design — it makes one writable.

## Failure modes

- **Designing instead of eliciting.** Don't hand them an architecture. Extract their constraints and surface the forced tradeoffs; let them choose.
- **Accepting happy-path answers.** A design that only handles success isn't a design. Push every flow to its failure mode.
- **Stopping at wave 1.** Scale, failure, and tradeoffs surface in wave 2–3.
- **Abstract questions.** "How do we handle scale?" yields mush. Put a number and a scenario in every question.
- **Hiding the tradeoff.** When two goals conflict, name the conflict and force the pick — don't quietly assume one side.
- **Covering categories instead of chasing tension.** A dodged "it'll be fine" is the thread to pull, not the next checklist item.
- **Drifting into experience.** "What should it feel like?" belongs to `product-design-interview`. Stay on structure: invariants, load, data, failure, tradeoffs.
- **Busy-waiting on crtr human.** The kickoff is non-blocking; let the inbox wake you.

## Related

- `crtr/design`, `crtr/spec` — where the elicited picture goes to become an artifact.
- `claude-humanloop/humanloop` — deck authoring philosophy.
