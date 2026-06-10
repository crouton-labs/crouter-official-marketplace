---
kind: skill
when-and-why-to-read: When you are planning a test suite, reviewing coverage, or pruning tests for code that AI agents write, this skill should be read because it gives the opinionated do/don't on what to test — skip mock-heavy units, invest in integration, property, contract, and conformance.
short-form: Opinionated do/don't on what to test when agents write the code — skip mock-heavy units; invest in integration, property, contract.
system-prompt-visibility: name
file-read-visibility: none
---

# Test strategy in the age of agents

The constraint flipped. Authoring time was the budget for testing; now it's noise. Agents write tests cheaply, regenerate them on every refactor, and over-mock by reflex. The question is no longer *can we afford this test* — it's *does this test catch the bugs an agent ships*.

Empirical floor: agent-written unit tests are mostly noise. Hora & Robbes (arXiv 2602.00409) — agents add mocks at 36% vs humans' 26%; 95% are plain `mock`. Meta ACH found 100%-coverage suites at 4% mutation score. arXiv 2602.07900 — test-writing is **uncorrelated with task solve rate** by McNemar test. Godmode found 92% of unguarded sessions ship inadequate coverage.

## When to use

- Planning a new test suite, or deciding what to delete from an old one.
- Reviewing an agent PR and asking whether the tests are pulling weight.
- Choosing a default test type for a new module.
- Pushing back on "we need more unit tests" instincts.

## When NOT to use

- Testing **LLM systems themselves** (judges, RAG, prompt regressions) — see `llm-app-authoring/eval-and-quality-gates`.
- Wiring the agent's feedback loop — see `test-harness`.
- Designing guardrails against cheating — see `test-pitfalls`.

## The core decision

**Default skeptic on units, default investor on seams.** Anywhere the agent's code crosses a real boundary — process, network, schema, language, time — invest. Anywhere it's a mocked collaborator inside one module, skip.

The reasoning: agents are good at internal consistency (the test and the code agree with each other) and bad at seam contracts (the code agrees with reality). Tests that pin internal consistency catch nothing the agent didn't already see. Tests that pin seam contracts catch bugs the agent literally cannot.

## Skip

- **Mock-heavy unit tests.** Verify the mock, not the code. Break on every refactor, pass when the integration is broken.
- **Coverage-driven tests with weak assertions.** Tests that call functions without asserting; tests that exist to satisfy a threshold. Goodhart machine.
- **Tautological / logic-mirroring tests.** Same agent writes implementation and test from the same prompt. Test encodes whatever the agent thought the spec meant, bugs included.
- **Snapshot tests that lock implementation.** Component trees, AST snapshots, formatted strings. "Update snapshot" reflex strips meaning within two PRs. *Exception:* output-is-the-contract goldens (transformers, formatters, generated SQL) with small human-reviewable diffs.
- **Getter/setter / trivial-wrapper tests.** Pure overhead.
- **Implementation-pinning tests.** Anything that names private methods, asserts call order to internal collaborators, or breaks on behavior-preserving refactors. Refactors are the agent's primary mode of work; punishing refactors poisons the loop.
- **E2E written purely to inflate the pyramid.** Slow flows without a specific user-behavior contract become flaky CI noise.

## Invest

- **Integration tests against real dependencies.** Testcontainers, ephemeral Postgres, real Redis. The seam is where agents break things — wire formats, transactions, retries — which mocks never see. Cost of running real deps in CI is now negligible.
- **End-to-end tests of critical user flows.** One per business-critical journey. Computer-use / Playwright make these cheap. Catches "Potemkin interfaces" (Replit Agent 3): UI renders, no handlers wired.
- **Property-based tests.** Hypothesis, fast-check, jqwik. The historical objection ("hard to come up with properties") died — Anthropic's red team showed LLMs derive properties well from names and docstrings. Use the agent to enumerate.
- **Behavioral contracts at module boundaries.** Pin observable behavior of a public function/service: input class, expected behavior, failure budget, oracle. Survives refactors; doubles as the spec for the next agent.
- **Conformance suites / tests-as-spec.** When the test *is* the contract — language-agnostic fixtures any implementation must pass. Best for cross-language reimplementation.
- **Approved-fixture goldens.** Human approves the output once; tests re-assert. Pair with mutation testing so an agent can't quietly weaken the fixture.
- **Fast deterministic micro-tests on a functional core.** Pure functions, no I/O — the agent's tight inner loop. The trap: don't let mocks in. If a "unit test" needs a mock, it belongs in the integration tier or doesn't belong.
- **Mutation testing on the suites you trust.** Don't run everywhere. Run on integration and contract suites. Catches assertion-free tests, weakened oracles, coverage gaming. Meta's ACH adoption rate of 73% on LLM-generated mutation-killing tests is the proof point.

## Failure modes

- **Pyramid as identity.** Defending unit-heavy suites because that's how testing "is supposed to" look. The constraint that produced the pyramid (author cost) no longer applies.
- **Coverage as goal.** Agents game any number you optimize for. Use coverage as scope check ("why does this code exist if nothing tests it") not as target.
- **Trusting agent-written assertions.** If the agent wrote both the implementation and the oracle, you have one signal, not two — see `test-pitfalls` for the adversarial frame.
- **Refactor tests during a "refactor".** If the agent is writing new tests during a refactor, it's not a refactor.

## Decision quick-reference

See [test-strategy-reference.md](test-strategy-reference.md) for the per-task default table and the greppable anti-pattern list for audits.

## Related

- `llm-app-authoring/eval-and-quality-gates` — testing LLM systems themselves (different problem).
