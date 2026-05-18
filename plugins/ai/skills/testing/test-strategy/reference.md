# test-strategy — reference

Lookup material for `test-strategy`. See `SKILL.md` for the decision framework.

## Per-task default table

| Task | Default | Notes |
|---|---|---|
| New feature touching a service boundary | Integration test + 1 E2E flow | Mocks only across true external boundaries (payment gateway, third-party API). |
| New pure function / parser / encoder | Property test + golden fixtures | Skip example-based unit tests unless the property is hard to state. |
| Bugfix | Behavioral contract test that *would have caught it* | If you can't write that test, the bug isn't understood. |
| Refactor (no behavior change) | Run existing integration suite; don't write new tests | If the agent is writing tests during a refactor, it's not a refactor. |
| Cross-language reimplementation | Conformance suite | Same fixtures, both implementations, both must pass. |
| LLM output / generated content | Approved fixtures + structural assertions + (optional) LLM-judge rubric | See `llm-app-authoring/eval-and-quality-gates`. |
| UI work | Playwright E2E on the user journey | Component-tree snapshots are anti-investment. |
| Performance-sensitive code | Property test for correctness + benchmark with floor | Benchmarks belong in CI with explicit floors, not just dashboards. |
| Schema / API contract change | Contract test + consumer-driven contract (Pact-style) | Catches breaking changes the agent didn't realize were breaking. |
| Migration / data backfill | Idempotency property + integration test against a fixture snapshot | Re-running the migration on already-migrated data must be a no-op. |

## Anti-patterns to grep for during audit

When pruning a suite an agent has touched, scan for these literal patterns:

- `mock.*mock.*mock` in the same test body — over-mocked, almost always testing the mocks.
- `expect(.*).toMatchSnapshot()` without a human-review log entry — snapshot-locks-implementation.
- Test bodies that call functions but contain no `expect` / `assert` / `assertEqual` — assertion-free; catch with `jest/expect-expect` or pytest `PT011`.
- `if (process.env.CI) skip`, `@pytest.mark.skip`, `it.skip(`, `test.skip(` added in the same commit as failing code — agent ducking the test.
- Test names that mirror getter names (`test_getName`, `test_getUserId`) — trivial wrappers.
- Imports of `private_*` or `_internal_*` symbols from test files — implementation-pinning.
- New `--exclude`, `--ignore-pattern`, `testPathIgnorePatterns`, `coverageThreshold` lowered in test-runner config — agent ducking via configuration.
- `.mock.calls`, `.toHaveBeenCalled`, `verify(...)` as the *only* assertions in a test — testing the mock, not the code.
- Multiple `await sleep(...)` calls in tests — racy; will flake under load.

## Mutation testing tools by language

| Language | Tool |
|---|---|
| Python | `mutmut`, `cosmic-ray` |
| JavaScript / TypeScript | `stryker` |
| JVM (Java, Kotlin, Scala) | `pitest` |
| Rust | `cargo-mutants` |
| Go | `go-mutesting`, `gremlins` |
| C# | `Stryker.NET` |
| Ruby | `mutant` |

Run on integration and contract suites only. Mutation testing is expensive; pointing it at fast unit suites that already test trivia produces lots of "killed" mutations and little signal.

## Property-test starter prompts

Useful when asking an agent to enumerate properties for a function:

- "What is the function's domain (input class)? Enumerate the partitions."
- "What invariant should hold across the domain (e.g., round-trip, idempotency, monotonicity, commutativity)?"
- "What are the failure modes outside the domain? Should they throw, return a sentinel, or return an error type?"
- "What's the simplest counterexample you can think of where the property would fail?"

Then write the properties in Hypothesis / fast-check / jqwik and run.
