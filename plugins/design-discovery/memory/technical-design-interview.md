---
kind: knowledge
when-and-why-to-read: When the user wants to think through how to build something, says "grill me on the architecture", or a technical approach is underspecified, this skill should be read because it runs a Socratic interview that extracts and pressure-tests the technical design before building.
short-form: Socratic human-led interview to extract and pressure-test a system's technical design — architecture, scale, data, failure modes.
gate:
  kind:
    imatches: '^(design|general)($|/)'
---

# technical-design-interview

Audience: future LLM agent sessions. You help the user nail the technical design of a system by *interviewing* them, not by picking the architecture for them. They hold the constraints, the load shape, the systems they can't change; your value is dragging those into the open and forcing the tradeoffs to be explicit before code gets written. This is the **elicitation front-end** that feeds a design or spec — not the artifact itself. The experience-side counterpart is the sibling `product-design-interview`. Drive it through `crtr human`: each wave is one page, sent non-blocking, answered into your inbox.

## The core move

Don't design — elicit. Replace "why?" with "what makes that a hard requirement?". Run in **waves**: a wave is one human page of 2–5 tightly-related questions. Read the answers, find the **tension** — a contradiction, an unexamined "it'll be fine", a hidden dependency, a forced tradeoff being dodged — and aim the next wave straight at it. The first answers are the happy path; the real design surfaces in wave 2–3 when you push into scale, failure, and the choices that can't be had both ways. The structure is a tool, not the goal: if an answer exposes a load-bearing assumption, drop the plan and dig there. Stop when no question you could ask would change the design.

## Run it through crtr human

- Put each wave in front of the user as one human page. Read `crtr human -h` and `crtr human send -h` for the current authoring and delivery contract before writing it; the page module is TSX under `$CRTR_CONTEXT_DIR/pages/`, and the reader answers one question at a time.
- One wave = one page. Give each question its own `<Step>`, a title naming what it settles, 2–4 real options as starting points, and a writing surface when the answer belongs in their own words. Put the context a question needs in that question's own body — page-level prose is not on screen while they answer.
- Sending is non-blocking: the page queues in the inbox, the user answers on their own time, and the answer wakes you. Do not poll or hold the turn open.
- Anchor questions in concrete numbers and scenarios, never abstractions. *"At 10x today's writes, all hitting in a morning burst — does the store still hold?"* beats *"How should we handle scale?"*.
- A worked technical wave, the reflect-back mechanism, and the full lens catalog live in [[design-discovery/technical-design-interview-reference]].

## Pick 3–4 lenses, not all of them

A lens is a way of seeing what's otherwise invisible; each generates a concrete question. Choose a few per interview. The technical lenses that matter most:

- **Requirements & invariants** — what must *always* be true, even under failure? Correctness boundaries before mechanism.
- **Scale & load shape** — volume, concurrency, growth; bursty vs steady. The 10x case is where designs break.
- **Data model & ownership** — entities, the single source of truth, what consistency each read actually needs.
- **Integration & boundaries** — what it depends on that you *don't* control, and the contracts at each seam.
- **Failure modes & blast radius** — what breaks, what cascades, where the single points of failure are. Push every answer to "and if that dies mid-operation?".
- **Forced tradeoffs** — the choices you can't have both ways (consistency vs availability, latency vs cost, simple-now vs flexible-later). Your job is to make the choice explicit, not paper over it.

Pressure-test with: **pre-mortem** ("it's 6 months later and this fell over in prod — what was the cause?"), **inversion** ("what would you do to *guarantee* this fails?"), **minimal version** ("what's the smallest thing that solves 80%?"), and **operability** ("when it breaks at 3am, what tells you, and what do you look at?"). Full catalog with phrasings: [[design-discovery/technical-design-interview-reference]].

## Reflect back between waves

After each wave, mirror understanding before asking more — open the next page with a step carrying: what you now understand (3–5 bullets), the assumptions you're treating as load-bearing (mark *confirmed* vs *guess*), and each open risk turned into the next wave's question. This is where a silent assumption gets caught before it becomes a wrong build.

## Close with the picture, then hand off

Before finalizing, ask one coverage question — *"Anything we circled but didn't land? Any constraint I haven't heard?"*. When they confirm, write the **technical picture** to `$CRTR_CONTEXT_DIR/design-<subject>.md`: the invariants & requirements, the load shape, the data model & owners, the external dependencies, the failure modes and their handling, the forced tradeoffs *and which way you chose*, open risks, and the next step. Hand the exact artifact path to a managed `design` node with `crtr node new --kind design` to turn it into a design artifact, or to a `spec` node with `crtr node new --kind spec` when the behavior still needs acceptance criteria. This interview does not replace the design — it makes one writable.

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

- `crtr human -h` — the current ask and review handoff surface.
- `crtr node new --kind design` or `crtr node new --kind spec` — managed follow-on nodes that receive the technical-picture artifact path.
