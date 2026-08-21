---
kind: knowledge
when-and-why-to-read: When a repo has no recorded testing stance and you must decide whether a change carries a test, this knowledge should be read because eliciting the standard once and storing it settles every later change in that repo instead of each agent guessing differently and leaving the owner to strip out unwanted coverage.
short-form: How to produce a repo's testing-stance memory — read what the repo already shows, draft a stance from that evidence, get the owner to confirm it, and store it.
rationale: >-
  Agents defaulted to a coverage-first instinct in repos that had deliberately chosen otherwise, and to the opposite absolute in repos that wanted coverage — each inventing a stance rather than taking the repo's. The missing move was procedural, not a rule: read the standard the repo already shows, and when it shows none, ask once and store the answer where the next agent inherits it.
---

# Producing a repo's testing stance

You are here because the repo has no `testing-stance` memory. Produce one; do not improvise a standard per change.

## 1. Read the standard the repo already shows

Take the first of these that settles the decision in front of you:

1. **Written policy** — the repo's `CLAUDE.md` / `AGENTS.md` / contributing guide.
2. **Runner and CI config** — which tiers exist, what CI actually gates, which time bounds are enforced.
3. **The suite itself** — which layers carry tests, how granular they are, whether recent features arrived with tests or without.

A repo whose suite is broad and current states its standard as clearly as a written policy; a repo with no tests states one too. What you find here is the draft — you are confirming a stance, not sourcing one from nothing.

## 2. Draft the stance from that evidence

Write the stance you would follow, as the finished document. Where the evidence is thin, start from this default and adjust:

> Tests are added when the owner asks for them, or when a reported bug in something complex earns the smallest regression that proves that failure. New features and refactors are proved by direct runtime verification instead. Existing tests keep passing and are never deleted to move faster. Local runs cover only the files changed; the comprehensive suite is CI's job. Per-test time limits are a quality gate — a slow test gets split, not a longer timeout.

Raise that bar where the repo warrants one on its own evidence: a published library contract, a mature fast suite already covering the surface, or a compliance requirement. Newness of the code is never a reason to draft a coverage-first stance.

## 3. Confirm it with the owner

Put the draft to the owner through `crtr human send`, as one question answerable with "yes" or a short edit. Carry exactly three things: one line of evidence about what the suite looks like today, the specific decision you are blocked on, and the stance verbatim as you would store it. Ask about the general rule rather than only the change in front of you, so the answer keeps settling later work — once per repo, not once per change.

## 4. Store it as that repo's `testing-stance`

Save the confirmed stance as a `testing-stance` preference in that repo's own project store (`crtr memory write -h`), so every agent working there inherits it and no one repeats this workflow. Keep it to what earns a test, what proves a change instead, and the local-versus-CI split with any per-test bound — the decision, never the conversation that produced it.

A one-or-two-sentence stance belongs in a `{on: boot, at: content}` entry, because the decision it governs — should this change carry a test — happens before any test file is opened. Route it through a read entry instead only for conventions that matter while editing a test, matched to the repo's own test globs.
