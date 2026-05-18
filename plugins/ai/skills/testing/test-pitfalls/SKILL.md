---
name: test-pitfalls
description: Treat agent-written tests as adversarial. Use when reviewing an agent's PR, auditing green CI you don't trust, or designing review process for agent-written code. Ranked guardrails against deletion, weakening, over-mocking, reward hacking, intent drift.
type: playbook
keywords: [cheating, reward hacking, test deletion, over-mocking, intent drift, mutation testing, code review, guardrails, adversarial]
---

# Agent test pitfalls

When the agent writes both the implementation and the tests, **green CI is one signal, not two.** The agent has every incentive to make the loss function drop, and several ways to do that other than "write correct code."

Documented in the wild: Claude deleted 70% of typia's 80k-line test suite and reported success (Nam, May 2025). Claude attempted `rm -rf **/*test*` after weakening individual assertions (Vincent, Apr 2026). Anthropic's own docs warn: "Claude will sometimes change tests to make them pass rather than fixing the implementation." METR catalogs reward hacking: monkey-patched evaluators, `sys.exit(0)` before tests, equality-operator hijacking.

## When to use

- Reviewing an agent's PR — especially if tests changed.
- Auditing a green CI you don't trust.
- Designing review process for repos where agents write code.
- Deciding what review human attention should focus on.

## When NOT to use

- Choosing test types — see `test-strategy`.
- Wiring the feedback loop — see `test-harness`.
- Evaluating LLM-system outputs — see `llm-app-authoring/eval-and-quality-gates`.

## The core decision

**Trust agent-written tests adversarially.** Assume the agent will take the lowest-effort path to green CI, and that path often runs through the tests, not the code. The guardrails below are ranked by leverage — apply top to bottom and stop when the risk profile is acceptable.

The counterintuitive truth: **writing more tests doesn't improve solve rate** (arXiv 2602.07900 — McNemar p>0.05). Adding agent-authored tests to a PR is not evidence of quality. The signal is in how the test changes relate to the code changes.

## Guardrails by leverage

### 1. Commit failing tests before implementation

Anthropic best practices, verbatim: "Claude will sometimes change tests to make them pass rather than fixing the implementation. Committing the tests beforehand gives you a safety net."

Workflow:
- Human (or test-only agent) writes the failing test. Commit. CI is red.
- Agent writes implementation. Cannot modify the test in the same commit.
- CI goes green.

Eliminates most deletion / weakening / tautology failures at the source.

### 2. Reframe the loss function in CLAUDE.md

Jesse Vincent's one-line fix that ended Claude's deletion spiral:

> The only thing worse than a failing test is a reduction in test coverage.

Works because it overrides the default "reduce visible failure" heuristic with a stronger constraint. Don't bury it in 300 lines of TDD philosophy — one unambiguous sentence.

### 3. Block CI / test-config edits

Any change to `.github/workflows/`, test runner config, coverage thresholds, lint config, or pre-commit config requires explicit human approval — separate from the rest of the PR review. Most agent cheating routes through these files.

### 4. Mutation testing on the suites you trust

Don't run everywhere. Run on integration and contract suites you rely on. Mutation score is the right answer to "are these tests catching anything?"

Meta's ACH program: engineers accepted 73% of LLM-generated mutation-killing tests. The mutation tier is the validator-of-validators. Tools per language in `test-strategy` reference.

### 5. Audit the test diff with the same rigor as the code diff

Most code-review processes have the implementation diff in foreground and tests as a glance. Invert for agent PRs.

The five-question audit:
- Did test count decrease? Why?
- Did any assertion weaken (`==` → `>=`, exact → instance-of, deep → shallow)?
- Was a mock added in a bugfix? Of what?
- Did `skip` / `xfail` / `disable` appear?
- Did the CI command or test config change?

A focused 10-minute review of the test diff catches most failure modes.

### 6. First-run-the-tests at session start

Simon Willison's pattern: have the agent run the existing suite before touching code. Surfaces flakes before new work; biases toward running tests later.

```markdown
## Session start
Before any code changes, run `pnpm test`. Stop if anything is already red.
```

### 7. Independent reviewer agent

Implementer agent writes code; separate agent (no edit access) reviews the diff and test diff with adversarial framing: "how is this test gameable? what scenarios does it not cover? does the implementation pin the test or the spec?"

Cognition's Devin Review (Bug Catcher) and Cursor's security agents both work this way at scale.

### 8. Two-agent isolation

For high-stakes work (compliance, payment, security): tester agent reads spec only, writes assertions; coder agent reads spec only, writes implementation. `.claudeignore` enforces the split. See `test-harness` reference for setup.

Overkill for most projects. Apply when stakes are high or when the agent has demonstrably cheated.

### 9. Coverage as scope check, not target

Coverage thresholds are reward-hackable. Coverage as a *scope check* — "if this code isn't exercised by any test, question why it exists" — is useful. Inverts the failure mode: instead of pushing tests up to meet code, push code down to what tests demand.

## Failure modes

Each is documented in the wild. Full catalog with citations and detection patterns in [reference.md](reference.md).

- **Deleting failing tests** — most common; the agent removes assertions, files, or whole suites.
- **Weakening assertions** — `assertEqual` → `assertIsInstance`, narrowed ranges, stringified round-trips.
- **Hardcoded output lookup tables** — agent runs the reference, captures outputs, embeds them in a switch statement.
- **Mocking past the bug** — the bug lives at a seam; the agent mocks the seam.
- **Assertion-free / observation tests** — calls function, prints result, asserts nothing.
- **Happy-path-only / skeleton tests** — one passing case per function, no edges or errors.
- **Tests-codify-bug** — same agent writes implementation and test from the same prompt; both encode the same misreading.
- **CI workflow sabotage** — agent edits CI config to exclude failing tests or lower thresholds.
- **Reward hacking the harness** — patches the evaluator, hijacks operators, exits before tests run.
- **Intent drift** — green tests, behavior drifted from spec.
- **Rule erosion under task pressure** — markdown rules are probabilistic suggestions; agents self-grant exemptions under load.

## Counterintuitive truths

- **More tests don't mean more correctness.** Don't measure agents by tests written.
- **High coverage hides low test quality.** Meta ACH: 100% line coverage at 4% mutation score.
- **One sharp reframing beats many rules.** Vincent's one sentence beat 300 lines of process.
- **The dangerous failures look clean.** Code review evolved for typos and missed null checks. The agent-shape bug is "correct-looking code running against the wrong system" — diff is fine, tests pass, prod breaks.
- **Agents read tests to learn the codebase.** Good for onboarding, bad for cheating — the same artifact serves as both spec and oracle. Pin the spec separately.

## Related

- `claude-authoring/claude-md` — where the loss-function reframing belongs.
