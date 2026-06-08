# product-design-interview — reference

Lookup layer for the [SKILL.md](SKILL.md) judgment: deck mechanics, a worked wave, the reflect-back pattern, and the full lens catalog.

## crtr human deck mechanics

A wave is one deck written to a JSON file, then kicked off:

```bash
crtr human ask --context-file /tmp/wave1.json
```

Kickoff returns instantly with `{job_id, dir, follow_up}` and **never blocks**. The human's TUI opens in a detached tmux pane; their answer is pushed to your inbox when they finish. End your turn or keep working — you'll be woken. Do not poll `follow_up` in a loop.

Deck schema (humanloop):

```json
{
  "title": "Onboarding experience",
  "interactions": [
    {
      "id": "first-feeling",
      "title": "First moment",
      "subtitle": "A brand-new user just signed up and lands on an empty workspace. What's the one thing they should feel pulled to do?",
      "body": "We're shaping the day-1 experience.\n\n## Why it matters\nThe first 60 seconds decide whether they ever come back. One clear pull beats five options.",
      "options": [
        {"id": "create",  "label": "Create their first real thing immediately"},
        {"id": "template","label": "Pick a template / see it pre-filled"},
        {"id": "tour",    "label": "Get oriented with a guided tour"},
        {"id": "import",  "label": "Bring in existing data so it feels theirs"}
      ],
      "allowFreetext": true,
      "freetextLabel": "Describe the moment in your own words"
    }
  ]
}
```

Per-interaction fields that matter: `id` (short, meaningful — you match answers on it), `title` (the topic, ≤4 words), `subtitle` (the actual one-line ask), `body` (optional ELI12 framing; directive-flavored markdown — see `termrender doc -h`), `options[]` (2–4 genuine alternatives as starting points), `allowFreetext`/`freetextLabel`, `multiSelect`, and `kind` (one of `notify`, `validation`, `decision`, `context`, `error`).

Collect: answers arrive in your inbox as a resolution. The `responses[]` array carries `{id, selectedOptionId?, freetext?}`. Look up by `id` — the human can skip, so `responses` may be shorter than `interactions`.

## The reflect-back pattern

Lead each wave after the first with a `kind:"context"` interaction that mirrors understanding, then put the new questions below it:

```json
{
  "title": "Wave 2 — the empty state",
  "interactions": [
    {
      "id": "synthesis",
      "kind": "context",
      "title": "Where we are",
      "subtitle": "Confirming what I heard before we go deeper",
      "body": "## What I understand\n- Day-1 pull = create a real thing fast (proven — you chose it)\n- Power users live here daily (guess — not yet confirmed)\n\n## Assumptions I'm treating as true\n- Empty state is the make-or-break moment\n\n## Risk → this wave\n- If creation needs setup first, the 'fast' promise breaks. Asking about that now."
    },
    { "id": "setup-cost", "title": "Setup cost", "subtitle": "Before a new user can create their first real thing, what's the minimum they must do?", "options": [ {"id":"none","label":"Nothing — instant"}, {"id":"one","label":"One choice"}, {"id":"few","label":"A few steps"} ], "allowFreetext": true }
  ]
}
```

Or send a standalone mirror with `crtr human notify` between decks. Either way: never start wave N+1 without reflecting wave N back.

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
