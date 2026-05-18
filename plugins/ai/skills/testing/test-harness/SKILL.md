---
name: test-harness
description: Design the test feedback loop so coding agents iterate productively — fast, deterministic, diff-friendly, remediation-bearing. Use when wiring CI for agent-written code, writing CLAUDE.md/AGENTS.md, picking a runner, or debugging agent doom loops.
type: playbook
keywords: [harness, feedback loop, CI, claude code, aider, agents.md, claude.md, hooks, doom loop, remediation, flakes]
---

# Test harness for coding agents

The agent doesn't want your code to be correct. It wants the loss function to drop. Tests, lint, type-check, and runtime checks **are** the loss function. Harness quality bounds agent quality.

Boris Cherny (Claude Code lead): verification gives "2-3x the quality of the final result." Mitchell Hashimoto: "Every AI mistake should result in a harness improvement, not just a fix."

## When to use

- Wiring CI, hooks, or pre-commit for an agent-driven repo.
- Writing or auditing CLAUDE.md / AGENTS.md.
- Debugging an agent that keeps re-trying the same failing test (doom loop).
- Deciding which tests to wire into the inner vs outer loop.

## When NOT to use

- Choosing test *types* — see `test-strategy`.
- Defending against cheating — see `test-pitfalls`.
- Designing prompt evals — see `llm-app-authoring/eval-and-quality-gates`.

## The core decision

**Optimize the feedback signal, not the test count.** A test the agent iterates against well has five properties; drop any one and the loop degrades. Most "the agent is bad at this codebase" complaints are harness complaints in disguise.

## The five properties

1. **Fast.** Sub-second for the inner loop. Multi-minute runs force batching, which destroys causal attribution when something breaks. Prefer single-test invocation over full-suite.
2. **Deterministic.** Flakes are catastrophic — the agent has no human prior to dismiss noise and iterates against it. Two flakes and it learns to disable; three and you're in a doom loop. Quarantine flakes immediately.
3. **Isolated.** No shared state, no ordering deps, no globals. The agent runs tests in parallel, out of order, and one at a time interchangeably; if results depend on ordering, it learns the wrong thing.
4. **Diff-friendly output.** Structured expected-vs-actual with paths into nested values. `pytest -vv`, Jest verbose, Rust `assert_eq!` are LLM-readable by default; bare `assertTrue(complexThing)` is not.
5. **Remediation-bearing.** The failure tells the agent *what to do*, not just *what's wrong*. Highest-leverage harness change most teams have.

## Failure messages are the highest-leverage change

Rewrite assertion helpers and lint rules so the failure names the fix.

- `AssertionError` → `expected {expected}, got {result}`.
- Lint "forbidden import" → "forbidden import 'X' — use 'Y' instead, auto-fix with `<cmd>`".
- Schema error "validation failed at .foo[3].bar" → "expected number, got string at .foo[3].bar — see spec.md#bar".
- E2E timeout → include the screenshot path and last network request.

**Block escape hatches.** If `// eslint-disable-next-line`, `# type: ignore`, `@pytest.mark.skip` can silence the failure, the agent will use them. Reject in committed code, or require a justification comment a reviewer enforces.

See [reference.md](reference.md) for the full failure-message table.

## The agent's test command

The single most important harness artifact is the file telling the agent how to run tests.

Rules:
- Put the **literal command** in CLAUDE.md / AGENTS.md, not a description.
- Document the *fast* command first (single test → single file → full suite).
- Include typecheck and lint commands alongside.
- Keep the file short. Claude Code docs: "If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost."

See [reference.md](reference.md) for the canonical CLAUDE.md test block.

## Wire verification into the lifecycle

The agent must not be able to claim done without verification. Hooks make this enforceable.

- **PostToolUse** on file edits → scoped test runs, failure injected back into context.
- **Stop** hook → blocks turn end until the verification command passes. Most effective single guardrail against "I've completed the task" with red CI.
- **Layer cheap to expensive**: syntax (every edit) → scoped test (every save) → full suite (before Stop).

Tool-specific syntax — Aider `/test`, Amp AGENTS.md, Devin autofix, Continue checks — in [reference.md](reference.md). The pattern is the same across all of them: failure → context → iteration.

## CI as the outer loop

Inner loop is the dev machine; outer loop is CI. They must run the same commands or the agent learns the wrong thing.

- Same command, same environment. Pick one canonical invocation; reference it from CLAUDE.md and CI config.
- Fail fast on cheap signals: type-check → lint → tests. Cheapest signal first.
- Make blocking checks remediation-bearing. A red "ci failed" check wastes everyone's time.
- Auto-fix loops for mechanical issues (formatters, linters, import sorting). Bot comment → agent picks up → fix → re-push.

## Compounding the harness

Each agent mistake is a harness gap. Hashimoto's rule: don't just fix the bug — leave behind a check that prevents the next agent from recommitting it.

The chain:
1. Agent makes a mistake.
2. Human or reviewer agent catches it.
3. *Don't* just write "don't do that" in CLAUDE.md — markdown rules erode under task pressure (see `test-pitfalls`).
4. Write a **lint rule**, **type guard**, **integration test**, or **pre-commit hook**. Now the harness has improved and the rule survives the next session.

Examples:
- Forgot to await a promise → `no-floating-promises` ESLint + an assertion on the side effect.
- Wrote a million-row table scan → query-plan check in CI under a row-cost threshold.
- Mocked a third-party API and shipped the mock to prod → integration test against the sandbox + lint forbidding `*.mock` imports outside test dirs.

Hamel Husain: "Documentation tells the agent what to do. Telemetry tells it whether it worked. Evals tell it whether the output is good." Harness is documentation + telemetry compounded into the repo.

## Failure modes

- **Letting flakes live.** Once one test is "sometimes red," the agent treats all red as noise. Quarantine on first flake; don't merge until the cause is known.
- **CLAUDE.md sprawl.** Long files dilute the rules that matter. If a rule isn't being followed, the file is too long, not too short.
- **Different commands inner vs outer.** Dev runs `pnpm test`; CI runs `pnpm test --reporters=junit --coverage`. Now they're testing different things.
- **Hooks the agent can disable.** If the Stop hook is in a config the agent edits during a task, it'll edit it. Place hooks where the agent can't reach without an obvious diff.
- **Scoring code the agent can see.** If the assertion oracle lives next to the implementation in a repo the agent writes to, it can patch the oracle. See `test-pitfalls` for the reward-hacking catalog.

## Related

- `claude-authoring/claude-md` — writing the CLAUDE.md that holds the test command.
- `claude-authoring/hooks` — Stop / PostToolUse hook patterns.
