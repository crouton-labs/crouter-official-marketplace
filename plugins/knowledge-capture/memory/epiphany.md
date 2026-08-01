---
kind: knowledge
when-and-why-to-read: When the user is stuck or asks for a breakthrough, fresh thinking, or out-of-the-box ideas on a problem, this skill should be read because independent advisor perspectives expose non-obvious approaches worth testing.
short-form: Breakthrough thinking — use independent advisor lenses when they will broaden the insight, then synthesize actionable approaches.
system-prompt-visibility: name
file-read-visibility: none
---

# Epiphany — breakthrough thinking via parallel advisors

Generate genuinely novel approaches by bringing independent advisor perspectives into tension, then synthesize their output into actionable insight.

If the user has not stated the problem clearly, ask once for a one-paragraph problem statement before seeking advice.

## Phase 1: Diverge

When independent judgment will materially broaden the thinking, create managed advisor children with `crtr node new --kind advisor`. Give each child the exact problem and one focused lens; let the current node and model policy choose how many advisors are warranted. Keep the assignments independent so each perspective can challenge the others.

Useful lenses include:

- **Constraint inversion** — Treat assumed constraints as possible advantages and explore a solution that depends on one.
- **Domain transplant** — Find a structural analog in an unrelated field and adapt its proven approach.
- **Problem dissolution** — Challenge whether this is the right problem and look for an approach that makes it irrelevant.
- **Adversarial architecture** — Consider what a smart critic would propose after dismantling the obvious solutions.

Ask each advisor for its strongest concrete insight and why it changes the problem.

## Phase 2: Synthesize

After all advisors return:

- Identify overlapping principles across the returned advice.
- Find tensions or contradictions — these are where the real insight lives.
- Combine fragments into 2–3 hybrid approaches that no single lens produced.

## Phase 3: Present

For each hybrid approach:

- **The core insight** (one sentence)
- **Why it's non-obvious** (what assumption it breaks)
- **The first concrete step** to test it
- **The biggest risk**

## Constraints

- If an advisor returns generic or predictable output, note the failure and extract what you can — don't pad it.
- The final output is the 2–3 hybrids. Not a transcript of advisor responses.
- Favor approaches that dissolve the problem over ones that power through it.
- Use parallel advice when it can change the direction; conventional problems may need no advisor delegation.
