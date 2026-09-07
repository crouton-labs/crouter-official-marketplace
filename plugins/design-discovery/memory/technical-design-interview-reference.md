---
kind: knowledge
when-and-why-to-read: When you are applying the technical-design-interview skill and follow its pointers to worked examples, the full catalog, or the annotated reference, this reference should be read because it holds the deep-dive material the skill body links to.
short-form: Deep-dive companion to the technical-design-interview skill — worked examples and the full catalog the skill body points to.
gate:
  kind:
    imatches: '^(design|general)($|/)'
---
# technical-design-interview — reference

Lookup layer for the [technical-design-interview.md](technical-design-interview.md) judgment: how to run a wave, a worked technical example, the reflect-back pattern, and the full lens catalog. The crtr human deck mechanics are shared with [product-design-interview-reference.md](product-design-interview-reference.md); the lens catalog below is specific to technical discovery.

## Running a wave

A wave is one human page. The page contract — components, props, and delivery flags — is owned by `crtr human -h` and `crtr human send -h`; read it there rather than from an example here, because the examples below describe **question content**, not an executable payload.

What a good question carries: a title naming what it settles, a one-line statement of the decision and what is at stake, 2–4 genuine alternatives as starting points, and a writing surface for the answer in their own words. Judgment calls almost always need that writing surface — a picker alone forces a false choice.

## The reflect-back pattern

Open every wave after the first with a step that mirrors understanding before it asks anything new: what you now understand (3–5 bullets), which assumptions you are treating as true and whether each is **proven** or a **guess**, and the open risk that this wave's question is aimed at.

Example, as content rather than schema:

> **Where we are.** Day-1 pull is creating a real thing fast (proven — you chose it). Power users live here daily (guess — not confirmed). I am treating the empty state as the make-or-break moment. Risk: if creation needs setup first, the "fast" promise breaks — which is what I'm asking about now.

Never start wave N+1 without reflecting wave N back.

## Full lens catalog

Pick 3–4 per interview. Each names what it surfaces and how it becomes a question.

### Technical (the heart — use most)

| Lens | Surfaces | Becomes the question |
|------|----------|----------------------|
| Requirements & invariants | What must always hold, even under failure | "What must never happen to this data, even during a crash?" |
| Scale & load shape | Volume, concurrency, growth; bursty vs steady | "At 10x, is it steady or bursty, and how many writers at once?" |
| Data model & ownership | Entities, single source of truth, consistency needs | "Who owns the canonical copy of X, and what reads it?" |
| Integration & boundaries | Systems you depend on but don't control; the seams | "What do you depend on that you can't change, and what's the contract?" |
| Failure modes & blast radius | What breaks, what cascades, single points of failure | "If X dies mid-operation, what's left inconsistent?" |
| Forced tradeoffs | Choices you can't have both ways | "When you can't have both fresh and available, which gives?" |
| Performance budget | Latency/throughput targets; where time goes | "What latency does the user actually feel, and your budget for it?" |
| Build vs buy vs reuse | Core hard problem vs commodity | "Is this your hard problem, or a solved one you should buy?" |
| Migration & rollout | Path from current state; reversibility | "How does this go live without a flag day, and how do you roll back?" |
| Security & trust boundary | Where untrusted input crosses in; who can do what | "Where does untrusted input cross into trusted code?" |
| Operability | How you learn it's broken and debug it | "When it breaks at 3am, what tells you, and what do you look at?" |

### Systemic & pressure tests (devil's advocate)

| Lens | Surfaces | Becomes the question |
|------|----------|----------------------|
| Dependencies | What depends on what; SPOFs | "If this one piece is down, what else stops working?" |
| Cascading effects | Second-order consequences | "That fails over to B. What does B's extra load break?" |
| Horizon conflict | Good now vs bad later (or vice versa) | "Is this still the right call at 100x, or does it trap us?" |
| Pre-mortem | Most likely cause of prod failure | "It's 6 months out and this fell over. What was the cause?" |
| Inversion | Recipe for guaranteed failure | "What would you do to make sure this fails?" |
| Minimal version | Over-engineering / scope creep | "What's the smallest thing that solves 80% of the need?" |
| Kill criterion | The condition to abandon the approach | "What would you have to see to admit this design is wrong?" |
| Laddering ("why?") | Root need behind a stated requirement | "You need X. Why? What breaks without it?" |

### Lens selection by situation

- **Greenfield system (0→1)**: requirements & invariants, scale & load, data model, build vs buy.
- **Adding to an existing system**: integration & boundaries, failure modes & blast radius, migration & rollout, dependencies.
- **"It's slow / flaky"**: performance budget, failure modes, dependencies, operability.
- **Choosing between approaches**: forced tradeoffs, horizon conflict, pre-mortem, kill criterion, build vs buy.

Adapt freely — if the interview exposes a load-bearing assumption, switch lenses to chase it.
