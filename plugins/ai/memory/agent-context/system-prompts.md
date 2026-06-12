---
kind: knowledge
when-and-why-to-read: When you are writing, fixing, or reviewing a system prompt — deciding what belongs in it vs another channel, why an instruction isn't holding, or how placement affects compliance and cost — this skill should be read because it covers both what a system prompt is for and the mechanics that make instructions in it stick.
short-form: System prompts — what belongs in one (behavior, front-door routing) vs what doesn't, and the placement mechanics — primacy, instruction hierarchy, multi-turn degradation, caching, provider differences.
system-prompt-visibility: name
file-read-visibility: none
---
# System Prompts

The system prompt is the behavior channel: who the agent is, the constraints that must hold on every turn, and the routing layer to everything else. Pair this with [prompting-effectively.md](prompting-effectively.md) for the writing craft (tone registers, framing, examples); this doc covers what belongs in the system prompt and the mechanics of why placement there works. For API patterns, caching math, and worked examples, see [system-prompts-reference.md](system-prompts-reference.md).

## What Belongs

- **Identity** — role, personality, values. "You are X" and third-person trait framing belong here and only here (→ [prompting-effectively.md](prompting-effectively.md) Tone Registers).
- **Hard constraints** — what to refuse, lane boundaries, the genuine non-negotiables.
- **Decision frameworks** — "when X, do Y" routing for judgment calls the agent will face repeatedly.
- **Tool/capability policy** — when to reach for what (the *policy*; the capability docs themselves live behind progressive disclosure → [context-placement-channels.md](context-placement-channels.md)).
- **Formatting defaults** — stated once, lightly; over-formatted prompts bleed into over-formatted output.

**The front-door principle:** a system prompt is a front door, not a manual. Every directive that needs depth takes the shape "when X, do Y, because Z" — where Y is a *pointer* (a command to run, a doc to read), not inlined content. The model generalizes from the *because*; the depth stays out of the always-loaded surface. A system prompt that inlines its manual doesn't degrade gracefully — past a point the model starts ignoring instructions wholesale, including the critical ones.

## What Does Not Belong

- **Knowledge and reference material** — gets wasted priority, treated as identity, and bloats the cacheable zone. It goes in the first user message or behind pointers.
- **Anything per-session or dynamic** — user data, session state, uploaded documents. The system prompt is the stable, cacheable zone (90% read discount on Anthropic, 50% on OpenAI); any variation is a cache miss on every request. Per-user data in the system prompt means zero cache benefit at full price.
- **Task instructions** — specifics of the current run belong in the task message; baking one task's details into the system prompt makes every future run wear yesterday's job.
- **Non-text content** — system prompts are text-only on every major provider. Images, files, and document blocks must go in user messages, which reinforces the split: system is behavioral, user turns carry content.

## Why Placement There Works

**Primacy.** Models retrieve best from the beginning and end of context (the "Lost in the Middle" U-curve). The system prompt is always position 0; early user messages drift into the degraded middle as the conversation grows.

**Trained authority.** The hierarchy isn't just positional — providers train explicit instruction precedence (Platform > Developer > User; OpenAI's Instruction Hierarchy work showed 20–30% robustness gains from it). The same sentence carries more authority in the system channel than in a user turn. OpenAI's `developer` role (o1+) gets stronger adherence than legacy `system` on newer models.

**Persistence.** User-turn instructions accumulate and dilute — each new message pushes them further from the generation point. The system prompt stays at position 0 regardless of length. **Practical test: if an instruction must hold reliably at turn 50, it belongs in the system prompt; if it only applies to the current task, the user turn is fine.**

**But everything degrades.** In long conversations (10+ turns) recent context competes with even system-level guidance. For critical constraints, reinforce periodically with a reminder in a user turn; test compliance at turn 10 and 20, not just turn 1.

## Provider Differences

| Provider | API pattern | Caching |
|---|---|---|
| Anthropic | Dedicated `system` field (not a message) | Explicit `cache_control`, 90% discount |
| OpenAI | `system` / `developer` role in `messages` | Automatic, 50% discount |
| Google | `system_instruction` in constructor | Explicit, 75% discount, 32K min |
| Open-source | Template tags, inconsistent enforcement | N/A |

Open-source models (Llama, Mistral) don't enforce system > user priority as reliably as commercial APIs — test adherence explicitly rather than assuming the hierarchy.

## Common Mistakes

1. **Critical instruction in the middle** — the U-curve applies *within* the system prompt too. Most critical constraints go first and/or last (sandwich pattern).
2. **Treating the system prompt as a security boundary** — it's defense-in-depth, not isolation; prompt injection can still win. Validate outputs programmatically.
3. **Manual instead of front door** — inlined depth that a pointer should carry; see above.
4. **Cache-busting dynamic content** — see What Does Not Belong.
