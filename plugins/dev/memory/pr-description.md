---
kind: knowledge
when-and-why-to-read: When a pull request title or body is about to be written or revised, this knowledge should be read because the reviewer should be able to judge intent, behavioral scope, and release risk without reconstructing the author's reasoning from the diff.
short-form: Write a human-readable behavioral title, then map Why, grouped Changes, and only the review notes this PR needs.
surfaces:
  - on: memory-read
    match: dev/pr-loop
    at: content
---

# Pull request titles and descriptions

Write for a reviewer who knows the product but has not read the diff. The title and body let that reviewer decide whether the change solves the right problem and is safe to merge. They also preserve the decision for later debugging and code archaeology.

## Title

- State the affected surface and behavioral outcome in ordinary language.
- Make the title stand alone in a review queue and repository history.
- Keep a repository's type or scope prefix when it improves routing, but never let the prefix replace the outcome.
- Do not use only a ticket number, internal codename, vague verb, or implementation mechanism.

Prefer `fix(auth): keep expired sessions from reconnecting` over `fix: session changes`.

## Default body

Use this reviewer map unless the change needs a more specific repository template:

```markdown
## Why

- <the current mismatch or problem and its consequence>
- <why the chosen boundary or approach is correct when the answer is not obvious>

## Changes

### <review surface>

- <observable behavior or contract>
- <important behavior that stays unchanged when needed to understand the boundary>
```

The title supplies the first `what`, so the body can start with `Why` without an extra summary. Use short bullets for discrete facts. Use a short paragraph only when the relationship between facts carries the reasoning.

Under `Changes`, group facts by the surface a reviewer must evaluate, not by file, commit, class, or task history. Useful subheaders include `Product and API`, `User interface`, `Data and migration`, `Operations`, and `Agent behavior`. Use only the subheaders the PR needs.

State each fact once. Do not repeat the title in a summary, repeat summary bullets in details, or turn commit messages into a file walkthrough. Name code identifiers only when they define a contract or direct attention to a non-obvious review boundary.

## Preserve intent, not generated fluency

The diff can show implementation, but it cannot show the original goal, rejected boundary, operational constraint, or reason this approach is correct. Preserve those decisions in `Why` and in the relevant change bullet.

An agent may draft mechanical change facts, but the author must check every claim against the final diff and retain context that existed before code generation. A polished summary is not verification. Do not add AI provenance as a quality signal; include it only when repository policy uses it for accountability, audit, or review routing.

Update the body when review changes the PR. Rewrite a posted body in place rather than leaving stale claims and explaining the correction in a comment.

## Keep model-facing changes distinct

Model-facing instructions, prompts, memory, seeded context, and kickoff text are behavior-bearing artifacts, but they are not executable product behavior. In a mixed PR, put them under `Agent behavior` and keep runtime, API, data, and interface changes under their own subheaders.

For an agent-behavior change, state:

- The decision or behavior expected to change.
- The prior failure it prevents.
- The runtime behavior that remains unchanged when confusion is possible.
- Behavioral evidence when wording alone cannot establish the result.

Do not describe only edited wording. A textual diff cannot prove a model-behavior change safe.

## Add review notes only when they change the decision

`Rollout and risks` is conditional. Include it for a concrete compatibility break, migration hazard, partial deployment, release order, irreversible effect, security boundary, or a subset of users or systems that adopts different behavior during rollout. State the failure condition and what contains it. Omit the section when no PR-specific risk exists; do not write `None identified.`

```markdown
## Rollout and risks

- <failure condition, affected subset or boundary, and containment>
```

Add other sections only when applicable:

- `Evidence`: a manual reproduction, visual result, model evaluation, benchmark, or other proof CI does not report. State what it establishes and any meaningful gap.
- `Visuals`: before-and-after images or recordings for a rendered change.
- `Migration`: required operator or consumer action when it needs more room than one rollout bullet.
- `Review focus`: a non-obvious decision, reading order, or boundary where reviewer judgment matters.

Do not add default type-of-change fields, generic testing sections, routine command transcripts, limits, rollback boilerplate, or compliance checklists. CI and repository controls own machine-verifiable status. A checkbox earns space only when it triggers a real manual decision or routes review.

Link an issue, design, incident, or related PR where it supplies depth, but keep enough context in the body to survive an inaccessible or stale link.
