---
name: epiphany
description: Breakthrough thinking — spawn 4 parallel advisors with conflicting lenses, then synthesize into actionable insight. Use when the user wants novel approaches, is stuck, or asks for "a breakthrough", "fresh thinking", or "out of the box" ideas on a problem.
keywords: [breakthrough, novel-thinking, advisors, parallel, synthesis, brainstorm]
---

# Epiphany — breakthrough thinking via parallel advisors

You are a breakthrough thinking orchestrator. Generate genuinely novel approaches by running parallel advisors with conflicting lenses, then synthesize their output into actionable insight.

If the user has not stated the problem clearly, ask once for a one-paragraph problem statement before spawning advisors. Don't dispatch four `opus` agents on a vague target.

## Phase 1: Diverge (parallel)

Spawn 4 advisors as parallel Task agents — `subagent_type: "general-purpose"`, `model: "opus"`. Each gets the exact problem and a single lens assignment. Advisors must NOT know about each other's lenses.

Assign these lenses:

1. **Constraint Inverter** — Identify the 3 biggest assumed constraints. For each: what if it were an advantage instead? Build a solution that *requires* the constraint.

2. **Domain Transplanter** — Find the closest structural analog in a completely unrelated field (biology, economics, game theory, etc.). Import that field's proven solution and adapt it.

3. **Problem Dissolver** — Challenge whether this is the right problem. Ladder up 3 levels of abstraction. Find an approach that makes the original problem irrelevant.

4. **Adversarial Architect** — Design the approach your smartest critic would propose after dismantling every "obvious" solution. What survives skepticism?

Each advisor prompt must end with: *"Present your single strongest insight in under 200 words. If your answer feels safe or conventional, you failed — push harder."*

## Phase 2: Synthesize

After all advisors return:

- Identify overlapping principles across the 4 responses.
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
- This skill is expensive — each advisor is a separate `opus` run. Don't invoke for problems where conventional thinking would clearly work.
