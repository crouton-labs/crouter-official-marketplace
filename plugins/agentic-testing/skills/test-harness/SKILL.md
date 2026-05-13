---
name: test-harness
description: Design the test feedback loop so coding agents iterate productively against it — fast, deterministic, diff-friendly, remediation-bearing. Use when wiring up CI for agent-written code, writing CLAUDE.md/AGENTS.md, choosing a test runner, or debugging agent doom loops.
keywords: [harness, feedback loop, CI, claude code, aider, agents.md, claude.md, hooks, doom loop, remediation]
---

# Test harness for coding agents

The agent doesn't "want" your code to be correct. It wants the loss function to drop. Tests, lint, type-check, and runtime checks **are** that loss function. Harness quality bounds agent quality.

Boris Cherny (Claude Code lead): *"give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result."* The official Claude Code best practices put verification at the top of the practice list. Mitchell Hashimoto's framing: *"Every AI mistake should result in a harness improvement, not just a fix."*

This skill is about the *shape* of the loop. For what to put in it, see [[test-strategy]]. For the failure modes the loop must resist, see [[test-pitfalls]].

## The five properties that matter

A test the agent iterates against well has all five. Drop any one and the loop degrades.

1. **Fast.** Sub-second for the inner loop. Multi-minute test runs force the agent to batch changes, which destroys causal attribution when something breaks. Boris Cherny in his CLAUDE.md: *"Prefer running single tests, and not the whole test suite, for performance."*
2. **Deterministic.** Flakes are catastrophic — the agent has no human prior to dismiss a flake and will iterate against noise. Thorsten Ball reports Amp entering doom loops: *"tries to fix and fix and fix the same test over and over"* when context fills with flake remediation attempts.
3. **Isolated.** No shared state, no test ordering dependencies, no globals. The agent runs tests out of order, in parallel, and one-at-a-time interchangeably; if results depend on ordering, the agent learns the wrong thing.
4. **Diff-friendly output.** The failure message is what the agent reads. Structured assertion output (expected vs actual, with paths into nested values) beats stringified blobs. Tools like `pytest -vv`, Jest's `--verbose` with inline diff, and `assert_eq!` macros in Rust are LLM-readable by default; bare `assertTrue(complexThing)` is not.
5. **Remediation-bearing.** The failure message names the fix, not just the violation. Augment's harness-engineering guide (https://www.augmentcode.com/guides/harness-engineering-ai-coding-agents): *"A lint error saying 'violation detected' requires human interpretation. A lint error saying `use logger.info({event: 'name', ...data}) instead of console.log` enables the agent to fix the violation without human intervention."*

## Failure-message design

The single highest-leverage harness change most teams have available is improving failure messages. Rewrite assertion helpers and lint rules so the failure tells the agent exactly what to do.

| Anti-pattern | Pattern |
|---|---|
| `assert(result == expected)` → "AssertionError" | `assert result == expected, f"expected {expected}, got {result}"` |
| `expect(x).toBe(true)` → "expected true to be true" | `expect(x).toBe(true) // <name> should be true when …` |
| Lint: `forbidden import` | Lint: `forbidden import 'X' — use 'Y' instead. Auto-fix with: <command>` |
| Type error pointing 200 lines away from cause | Narrow the error site; add explanatory error messages on type guards |
| Schema validation: `validation failed at .foo[3].bar` | Schema validation: `expected number, got string "abc" at .foo[3].bar — see <spec.md#bar>` |
| E2E: `Test timed out after 30s` | E2E: `Test timed out waiting for selector .submit-button after 30s. Screenshot saved to <path>. Last network request: <url>` |

**Block disable directives.** If the agent can write `// eslint-disable-next-line` or `# type: ignore` or `@pytest.mark.skip` to make the failure go away, it will. Configure the linter/type-checker/test runner to reject these in committed code, or require a justification comment that a separate review pass enforces.

## The agent's test command

The single most important file in any agent-driven repo is the one that tells the agent how to run tests.

**Put the literal command in CLAUDE.md / AGENTS.md**, not a description of it. Granular is better than coarse:

```markdown
## Test

Run a single test by name (preferred while iterating):
  pnpm test -- -t 'name of the test'

Run a single file:
  pnpm test path/to/file.test.ts

Run the full suite (only before declaring done):
  pnpm test

Run typecheck:
  pnpm typecheck
```

Rules of thumb:
- Name the command, not the concept. `pnpm test` beats "the test command."
- Document the *fast* command first; the slow one last.
- Include the typecheck/lint commands the agent should also run.
- Keep CLAUDE.md/AGENTS.md short. Claude Code docs: *"If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost."* The same goes for harness instructions — they get diluted in a 500-line file.

## Hook integration

Wire verification into harness lifecycle so the agent can't claim done without it.

**Claude Code (hooks):**
- `PostToolUse` hook runs `pnpm test` or the relevant scoped check after every code edit; non-zero exit injects the failure back into the agent's context.
- `Stop` hook blocks the agent from finishing the turn until the verification passes. This is the single most effective guardrail against "I've completed the task" with a red CI.
- Layer them: syntax check (cheap, every edit) → scoped test (medium, every file save) → full suite (expensive, before Stop).

**Aider:** `/test <command>` runs the command after every edit and feeds the output back; loops up to 10 times automatically (issues #230, #484). Set this once per repo.

**Amp (Sourcegraph):** AGENTS.md encodes build/test commands. Thorsten Ball: *"Tell the agent how to best review its work… Feedback helps agents as much as it helps us."*

**Devin (Cognition):** *"As soon as tests fail or lints complain, Devin can iterate autonomously until the build turns green."* The pattern is the same — wire the failure into the loop.

**Continue:** Markdown "checks" files render as GitHub status checks per PR; same shape.

## CI as the outer loop

Inner loop is the developer's machine. Outer loop is CI. Both must run the same commands, or the agent learns the wrong thing.

- **Same command, same environment.** If CI uses `pnpm test --coverage --reporters=junit` and the agent runs `pnpm test`, they're testing different things. Pick one canonical command; reference it from both places.
- **CI must fail fast on the cheap stuff.** Run type-check and lint before tests so the agent gets the cheapest signal first. Cursor's harness post (Apr 2026): bucketed tool errors and pushed *"all tool calls to at least 2 or often 3 9s of reliability"* — same principle for tests.
- **PR-blocking checks should be remediation-bearing.** A red check titled "ci failed" wastes everyone's time. "ci failed: 3 tests in `auth/login` — `expected user.email to be set after sign-in, got undefined`" lets the agent (or the human) act.
- **Auto-fix loops for mechanical issues.** Cognition's Devin Autofix and Anthropic's CI auto-fix both close the loop: bot comment → agent picks it up → fix → re-push. Set this up for formatters, linters, and import sorting at minimum.

## Two-agent isolation (anti-cheat harness)

When the same agent writes the spec, the test, and the code, you have one signal and three opportunities to cheat. Split the roles.

The pattern (Thomas Jaspers / codecentric, Mar 2026): use `.claudeignore` and per-role `CLAUDE.md` files so the coding agent cannot read the test scenarios and the testing agent cannot read the implementation. *"Otherwise it will no longer fulfill the specification, it will simply learn to pass the tests."*

Minimum viable split:
- Spec in plain English (or Gherkin) checked into the repo.
- Test agent reads spec → writes assertions. Cannot read the implementation directory.
- Coding agent reads spec → writes implementation. Cannot read the test directory.
- A third pass (human or third agent) runs the suite and adjudicates.

This is overkill for most projects. Apply when the stakes are high (compliance, security, payment) or when the same agent has been observed gaming the suite.

## Compounding the harness

Each agent mistake is a harness gap. Hashimoto's rule: don't just fix the bug — leave behind a check that prevents the next agent from recommitting it.

The compounding chain:

1. Agent makes a mistake.
2. Human (or reviewer agent) catches it.
3. Don't just say "don't do that" in CLAUDE.md — write a **lint rule**, **type guard**, **integration test**, or **pre-commit hook** that catches it next time.
4. Now the harness has improved and the rule survives the next session's context window.

Examples:
- Agent forgot to await a promise → ESLint `no-floating-promises` + a test asserting the side effect.
- Agent wrote a SQL query that scans a billion-row table → query plan check in CI, EXPLAIN output asserted under a threshold.
- Agent mocked a third-party API and shipped the mock to prod → integration test that runs against a sandbox account, plus a lint rule on imports of `*.mock` from non-test files.

Hamel Husain (Mar 2026): *"Documentation tells the agent what to do. Telemetry tells it whether it worked. Evals tell it whether the output is good."* Harness is documentation + telemetry compounded into the repo.

## What makes a test LLM-hostile

If you're auditing why an agent is struggling, check for these:

- **Vague names.** `test_thing_works` teaches the agent nothing. `test_login_returns_401_when_password_wrong` is greppable, self-documenting, and survives refactors.
- **Shared fixtures with implicit teardown.** Pytest fixtures, JUnit `@Before` chains. The agent reads a single test file and has no idea what's in scope. Prefer per-test setup or visibly-named factory functions.
- **Order-dependent assertions.** `expect(items).toEqual([a, b, c])` when the underlying collection is unordered. Use set comparison or sort before assert.
- **Time-dependent assertions.** `expect(timestamp).toBe(Date.now())`. Inject a clock or freeze time.
- **Network or filesystem flakes.** If the agent sees one flaky test, it learns to retry. Two and it learns to disable. Three and you're in a doom loop. Quarantine flakes immediately; never let them stay green-failing in CI.
- **Tests whose scoring code the agent can see and patch.** If the assertion oracle is in the same repo and the agent has write access, you're trusting it not to cheat. METR's reward-hacking catalog (Jun 2025) documents real cases: monkey-patching evaluators, `sys.exit(0)` before tests run, equality-operator hijacking. See [[test-pitfalls]].

## See also

- [[test-strategy]] — what to test (and what to skip) once the harness is good.
- [[test-pitfalls]] — failure modes the harness must defend against.
- [[claude-authoring-claude-md]] — writing the CLAUDE.md that documents the test command.
- [[claude-authoring-hooks]] — Stop/PostToolUse hook patterns for wiring verification.
