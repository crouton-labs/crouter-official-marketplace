# technical-design-interview — reference

Lookup layer for the [SKILL.md](SKILL.md) judgment: deck mechanics, a worked technical wave, the reflect-back pattern, and the full lens catalog. The crtr human deck mechanics are identical to the experience sibling — see `design-discovery/product-design-interview` reference and `claude-humanloop/humanloop` for the full deck philosophy. The lens catalog below is what's specific here.

## crtr human deck mechanics (recap)

A wave is one deck written to a JSON file, then kicked off:

```bash
crtr human ask --context-file /tmp/wave1.json
```

Kickoff returns instantly with `{job_id, dir, follow_up}` and **never blocks**. The answer is pushed to your inbox when the human finishes. Don't poll. Match answers by `id` (the human can skip, so `responses[]` may be shorter than `interactions`).

Worked wave 1 — a new write-heavy store:

```json
{
  "title": "Capture store — the shape of the load",
  "interactions": [
    {
      "id": "invariant",
      "title": "Hard invariant",
      "subtitle": "What must NEVER happen to a captured record, even during a crash or deploy?",
      "body": "Pinning the correctness boundary before we pick a mechanism.\n\n## Why\nThe invariant decides whether we can relax durability for speed later.",
      "options": [
        {"id": "no-loss",  "label": "Never lose an acknowledged write"},
        {"id": "no-dup",   "label": "Never double-process a record"},
        {"id": "order",    "label": "Never reorder within a session"},
        {"id": "best",     "label": "Best-effort is fine — drops are tolerable"}
      ],
      "allowFreetext": true,
      "freetextLabel": "State the invariant precisely"
    },
    {
      "id": "load",
      "title": "Load shape",
      "subtitle": "At 10x today, is it a steady stream or a morning burst — and how many writers at once?",
      "options": [
        {"id": "steady-1",  "label": "Steady, single writer"},
        {"id": "steady-n",  "label": "Steady, many concurrent writers"},
        {"id": "burst-n",   "label": "Bursty, many concurrent writers"}
      ],
      "allowFreetext": true
    }
  ]
}
```

## The reflect-back pattern

Lead each later wave with a `kind:"context"` interaction that mirrors understanding, then put the new questions below it:

```json
{
  "interactions": [
    {
      "id": "synthesis",
      "kind": "context",
      "title": "Where we are",
      "subtitle": "Confirming the load-bearing facts before going deeper",
      "body": "## Confirmed\n- Invariant: never lose an acknowledged write\n- Load: bursty, many concurrent writers (10x = ~2k/s peak)\n\n## Treating as true (guess)\n- Reads are rare and tolerate staleness\n\n## Risk → this wave\n- Concurrent writers + no-loss forces a durability/throughput tradeoff. Asking which way now."
    },
    { "id": "tradeoff", "title": "Durability vs throughput", "subtitle": "Under burst, do we ack only after durable write (slower, safe) or ack-then-persist (faster, a crash window loses recent writes)?", "options": [ {"id":"durable","label":"Ack after durable"}, {"id":"fast","label":"Ack then persist"} ], "allowFreetext": true }
  ]
}
```

Or send a standalone mirror with `crtr human notify`. Never start wave N+1 without reflecting wave N back — silent assumptions become wrong builds.

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
