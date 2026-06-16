---
kind: knowledge
when-and-why-to-read: When you are starting a new feature and need to capture what it should do before planning implementation, this skill should be read because it walks you through investigation and conversation to produce a behavior-focused specification.
short-form: Define a feature through investigation and conversation — a behavior-focused spec before planning.
system-prompt-visibility: name
file-read-visibility: none
gate:
  kind:
    imatches: '^spec($|/)'
---

# Spec Writing

Given a feature topic or description (a word like "auth", a longer prose ask, or priorities/constraints), extract the core feature to inform investigation.

The spec is the settled contract between intent and implementation. It captures decisions, not questions. The planner reads it to figure out mechanism — your job is to nail down behavior.

## The Critical Judgment: Behavior vs Mechanism

Specs describe WHAT happens, not HOW. During investigation you'll form opinions about implementation. Discard them — the planner figures out mechanism independently.

Behavior is observable from outside. Mechanism is internal.

- ✓ "Referral is attributed during signup" — observable
- ✗ "ref flows through the OAuth state cookie" — internal code path
- ✓ "Every org has a referral slug" — observable property
- ✗ "Slug auto-generated on org creation" — timing/lifecycle
- ✓ "Referrer earns 500 bonus credits" — observable outcome
- ✗ "Increment the bonusCredits field" — storage detail

**Test:** If a planner couldn't reasonably choose a different approach after reading the spec, you've over-constrained it.

## Process

### 1. Investigate

Briefly explore to understand existing patterns, constraints, integration points, and architectural conventions. Don't deep-dive — gather enough context to converse meaningfully, not to design the implementation.

### 2. Propose

Share with the user:
- What you found in the codebase
- A concrete proposal with reasoning
- Relevant file paths involved
- Trade-offs and where you're uncertain

Lead with perspective: "I'm confident about X, but Y could go either way depending on Z."

### 3. Converse (when needed)

If ambiguity remains, ask substantive questions — never procedural ones.

- Bad: "What should happen on error?"
- Good: "If the API returns 429, should we retry with backoff or surface the rate limit to the user?"

Ambiguity can be technical, architectural, or design (UI/UX choices count). Iterate until settled.

### 4. Save the Spec

Save to `.claude/specs/{topic-name}.spec.md`. All trade-offs must be resolved before saving — no "TBD" markers, no open questions. Those belong in the pipeline state journal, not the spec.

Format:
- **Summary** — One paragraph
- **Behavior** — Observable behavior only. Input/output mappings, preconditions, postconditions, invariants, state transitions, data shapes. Cover what's non-obvious; skip what's self-evident.
- **Architecture** (if applicable) — Component boundaries and contracts between them. NOT internal mechanisms or function-level data flow.
- **Constraints** — Limitations, requirements, boundaries
- **Related files** — Paths to existing code that will be involved. Do NOT annotate with implementation instructions (e.g., don't write "oauth.controller.ts — add ref to state").

**No code.** No pseudocode. No type definitions. Behavioral and contractual only.

### 5. Save Pipeline State

Save investigation byproducts to `.claude/pipeline/{topic}.state.md` so planning doesn't re-explore the same territory.

```markdown
# Pipeline State: {topic}

## Specification Phase

### Alternatives Considered
- [Approach]: [Why chosen or rejected — 1 line each]

### Key Discoveries
- [Codebase patterns, constraints, or gotchas found during investigation that aren't in the spec]

### Handoff Notes
- [What planning needs that doesn't fit the spec format]
```

Terse — 10-20 bullets total. Scratchpad, not document.

### 6. Present and Validate

Present an abbreviated overview: 4-8 plain-language sentences. What the feature does, who it's for, key behavioral decisions. Reference where the spec goes deeper without restating ("Edge cases detailed in Constraints"). The user should skim in 10 seconds and either confirm or correct.

Validate the spec before considering it final: every section is behavioral (not mechanism), all trade-offs resolved, no "TBD" markers. If gaps exist, address them and re-validate.

### 7. Evaluate Research Need

- **Small features (~10 or fewer files):** Spec's "Related files" is sufficient. State: "Spec validated. Clear context and move to planning."
- **Large features (10+ files across domains):** Offer to create dedicated context documents. If user confirms, spawn parallel exploration subagents per domain (data models, API patterns, UI components, etc.) and synthesize into `.claude/context/{topic}-{domain}.context.md` files. Each focuses on a complete slice — cohesive, non-overlapping, implementation-ready.

After research: "Spec and context validated. Clear context and move to planning."
