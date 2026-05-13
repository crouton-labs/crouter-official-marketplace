---
name: test-strategy
description: What to test (and what to skip) when AI agents write most of the code. Use when planning a test suite, reviewing test coverage, deciding what to delete, or arguing about the pyramid. Opinionated — leads with do/don't, not debate.
keywords: [testing, agents, integration tests, property-based, mocks, coverage, e2e, conformance, tests-as-spec]
---

# Test strategy in the age of agents

The economics of testing flipped. Agents write integration tests cheaply, regenerate unit tests on every refactor, and over-mock by reflex. What used to be a budget problem ("can we afford E2E?") is now a signal problem ("do these tests catch the bugs agents actually ship?").

The empirical answer: **most agent-authored unit tests are noise.** Hora & Robbes (arXiv 2602.00409, 2026; 1.2M commits / 2,168 repos) found agents add mocks at 36% vs humans' 26%, and 95% of agent test doubles are plain mocks vs humans' more varied mock/fake/spy mix. Meta's ACH program found suites with 100% line coverage and 4% mutation score. The same arXiv study (2602.07900) showed test-writing is **uncorrelated with task solve rate** — Claude Opus 4.5 writes new tests on 83% of tasks (74.4% resolve); GPT-5.2 writes them on 0.6% (71.8% resolve); flipping each model's behavior moved zero issues by McNemar test.

This skill is the do/don't. For the feedback loop shape, see [[test-harness]]. For the failure modes the don't-list protects against, see [[test-pitfalls]].

## Skip

These tests cost time to write, more time to maintain, and catch almost nothing real.

- **Mock-heavy unit tests.** Mocked collaborators verify your mock, not your code. They break on every refactor and pass even when the integration is broken. Agents reach for `mock` first — don't ratify the habit.
- **Coverage-driven tests with weak assertions.** Tests that call functions without asserting outcomes, tests written to satisfy a coverage threshold, tests that exist because a linter complained. Goodhart machine. The Godmode study (Mar 2026) found 92% of unguarded Claude Code sessions ship inadequate coverage of this exact shape.
- **Tautological / logic-mirroring tests.** When the same agent writes the implementation and the test from the same prompt, the test encodes whatever the agent thought the spec meant — including the bugs. The test passing tells you the agent was internally consistent, not that the code is correct.
- **Snapshot tests that lock implementation.** Component-tree snapshots, AST snapshots, formatted-string snapshots. The "update snapshot" reflex strips the test of meaning within two PRs. Keep snapshots only when the output is the contract (golden files for transformers, formatters, generated SQL) and the human-reviewable diff is small.
- **Getter/setter / trivial-wrapper tests.** Pure overhead.
- **Tests that pin internal implementation.** Anything that names private methods, asserts on call order to internal collaborators, or breaks on a refactor that didn't change observable behavior. Refactors are the agent's primary mode of work; tests that punish refactors poison the loop.
- **End-to-end tests written purely to inflate the pyramid.** Slow E2E without a specific user-flow contract becomes flaky CI noise. Only E2E flows tied to a specific business behavior survive.

## Invest

These tests catch real bugs agents introduce, and the cost of writing them has dropped to near zero.

- **Integration tests against real dependencies.** Testcontainers, ephemeral Postgres, real Redis. Agents most often break things at the seam — wire formats, transaction boundaries, retry semantics — which mocks never see. The cost of running a real DB in CI is now negligible.
- **End-to-end tests of critical user flows.** One test per business-critical journey. Computer-use / Playwright agents make these cheap to author and maintain. Replit's "Potemkin interfaces" failure (Agent 3 self-test post, Dec 2025) — UI renders, no handlers wired — is invisible without E2E.
- **Property-based tests.** Hypothesis, fast-check, jqwik. The historical objection ("hard to come up with properties") died: Anthropic's red team (Jan 2026, red.anthropic.com/2026/property-based-testing) showed LLMs are unusually good at deriving properties from function names and docstrings. Use the agent to enumerate properties, then run.
- **Behavioral contracts at module boundaries.** Tests that pin observable behavior of a public function or service: input class, expected behavior, failure budget, oracle (Tian Pan's framing). These survive refactors and serve as the spec the next agent reads.
- **Conformance suites / tests-as-spec.** When the test *is* the contract — language-agnostic fixtures any implementation must pass. Best when the same logic ships in multiple languages or runtimes (Willison's "conformance-driven development"). Agents can swap implementations freely as long as the conformance suite passes.
- **Approved-fixture golden tests.** Human reviews and approves the output once; the test re-asserts against it. Works for transformers, code generators, prompt outputs, anything with a stable canonical form. Pair with mutation testing so a fixture flip can't quietly weaken the test.
- **Fast, deterministic micro-tests on a functional core.** Pure functions with no I/O. These are the agent's tight inner loop — sub-second feedback on logic changes. The trap is letting them grow mocks; if a "unit test" needs a mock, it belongs in the integration tier or doesn't belong at all.
- **Mutation testing on the suites that matter.** Don't run it everywhere — run it on the integration and contract suites you actually trust. Catches assertion-free tests, weakened oracles, and the agent gaming coverage. Meta's ACH adoption rate of 73% on LLM-generated mutation-killing tests is the proof point.

## Decision table

| Task | Default | Notes |
|---|---|---|
| New feature touching a service boundary | Integration test + 1 E2E flow | Mocks only across true external boundaries (payment gateway, third-party API). |
| New pure function / parser / encoder | Property test + golden fixtures | Skip example-based unit tests unless the property is hard to state. |
| Bugfix | Behavioral contract test that *would have caught it* | If you can't write that test, the bug isn't understood. |
| Refactor (no behavior change) | Run existing integration suite; don't write new tests | If the agent is writing tests during a "refactor", it's not a refactor. |
| Cross-language reimplementation | Conformance suite | Same fixtures, both implementations, both must pass. |
| LLM output / generated content | Approved fixtures + structural assertions + (optional) LLM-judge rubric | See `eval-and-quality-gates` in [[llm-app-authoring-eval-and-quality-gates]] for grading patterns. |
| UI work | Playwright E2E on the user journey | Component-tree snapshots are anti-investment. |
| Performance-sensitive code | Property test for correctness + benchmark with floor | Benchmarks belong in CI with explicit floors, not just dashboards. |

## Anti-patterns to grep for

When auditing or pruning a suite an agent has touched, look for these literal patterns:

- `mock.*mock.*mock` in the same test — over-mocked, almost always testing the mocks.
- `expect(.*).toMatchSnapshot()` without a human review log — snapshot-locks-implementation.
- Tests whose body is `assert <some_function>(...)` with no return-value check — assertion-free, see `pytest-expect-expect` / `jest/expect-expect`.
- `if (process.env.CI) skip` or `@pytest.mark.skip` added in the same commit as the failing code — agent ducking the test instead of fixing it.
- Test names that are getter names (`test_getName`, `test_getUserId`) — trivial wrappers.
- Imports of `private_*` or `_internal_*` symbols from tests — pinning implementation.
- `--exclude` or `--ignore-pattern` flags newly added to the CI command — see [[test-pitfalls]] for the typia incident.

## What changed and what didn't

- **Changed**: the pyramid is no longer a budget allocation. Agents write E2E and integration cheaply; the constraint isn't author time, it's signal quality.
- **Changed**: tests are the agent's primary feedback loop. A test that doesn't fail loudly on the bug you care about is worse than no test — it teaches the agent the wrong success criterion.
- **Didn't change**: tests at architectural boundaries are still load-bearing. The functional-core / imperative-shell split (Google Testing Blog, Oct 2025) is the right shape for an agent-testable codebase.
- **Didn't change**: humans still review the oracle. If the agent wrote the assertion *and* the implementation, you have one signal, not two.

## See also

- [[test-harness]] — making tests fast, deterministic, and diff-friendly so the agent can iterate against them.
- [[test-pitfalls]] — the cheating patterns this strategy is designed to resist.
- [[llm-app-authoring-eval-and-quality-gates]] — testing LLM *systems themselves* (different problem; this skill is about testing software an agent wrote).
