---
kind: reference
when-and-why-to-read: When you are applying the test-harness skill and follow its pointers to worked examples, the full catalog, or the annotated reference, this reference should be read because it holds the deep-dive material the skill body links to.
short-form: Deep-dive companion to the test-harness skill — worked examples and the full catalog the skill body points to.
system-prompt-visibility: none
file-read-visibility: none
---
# test-harness — reference

Lookup material for `test-harness`. See `SKILL.md` for the decision framework.

## Failure-message rewrites

| Anti-pattern | Pattern |
|---|---|
| `assert(result == expected)` → "AssertionError" | `assert result == expected, f"expected {expected}, got {result}"` |
| `expect(x).toBe(true)` → "expected true to be true" | `expect(x).toBe(true) // <name> should be true when …` |
| Lint: `forbidden import` | `forbidden import 'X' — use 'Y' instead. Auto-fix with: <command>` |
| Type error pointing 200 lines away from cause | Narrow the error site; add explanatory error messages on type guards |
| Schema validation: `validation failed at .foo[3].bar` | `expected number, got string "abc" at .foo[3].bar — see <spec.md#bar>` |
| E2E: `Test timed out after 30s` | `Test timed out waiting for selector .submit-button after 30s. Screenshot: <path>. Last network: <url>` |
| Integration: `connection refused` | `connection refused to postgres at localhost:5432 — is testcontainers running? start with: <cmd>` |
| Test: `expected 200, got 500` | `expected 200, got 500. Response body: <body>. Server log: <last 5 lines>` |

## Canonical CLAUDE.md test block

```markdown
## Test

Run a single test by name (preferred while iterating):
  pnpm test -- -t 'name of the test'

Run a single file:
  pnpm test path/to/file.test.ts

Run the full suite (only before declaring done):
  pnpm test

Typecheck:
  pnpm typecheck

Lint:
  pnpm lint

Before claiming a task complete, all four must pass. Do not use --skip,
--exclude, or eslint-disable comments to make failures go away.
```

Adapt the commands to your stack; keep the structure. The "before claiming complete" sentence is load-bearing — it gives the Stop hook a referent.

## Hook integration by tool

### Claude Code

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command", "command": "pnpm typecheck && pnpm test --bail --findRelatedTests $CLAUDE_FILE_PATHS" }]
      }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "pnpm test && pnpm typecheck && pnpm lint" }] }
    ]
  }
}
```

The Stop hook is the gate — a non-zero exit blocks the agent from ending the turn until verification passes.

### Aider

```bash
# Set once per repo
aider --test-cmd "pnpm test" --auto-test
# /test runs the command and feeds output back; loops up to 10 times.
```

### Amp (Sourcegraph)

```markdown
# AGENTS.md
## Test
pnpm test

## Lint
pnpm lint
```

Thorsten Ball: "Tell the agent how to best review its work. Feedback helps agents as much as it helps us."

### Devin (Cognition)

Devin reads CI output. When tests fail or lints complain, Devin iterates autonomously until green — no config needed beyond a working CI pipeline. The autofix loop also responds to PR review-bot comments.

### Continue

Continue "checks" are markdown files in the repo that render as GitHub status checks per PR. Same pattern: failure becomes context, becomes iteration.

### Cursor

```json
// .cursor/rules
{
  "auto-run-tests": true,
  "test-command": "pnpm test"
}
```

## Two-agent isolation (anti-cheat harness)

When the same agent writes spec, tests, and code, you have one signal and three opportunities to cheat. Split:

```
.claudeignore     # in coding-agent's workspace: excludes tests/
                  # in testing-agent's workspace: excludes src/
spec/             # plain English or Gherkin
tests/            # written by test agent, reading spec only
src/              # written by code agent, reading spec only
```

Per-role CLAUDE.md files inside each workspace tell each agent its constraints. A third pass (human or reviewer agent) runs the suite and adjudicates.

This is overkill for most projects. Apply when stakes are high (compliance, payment, security) or when the agent has demonstrably gamed the suite.

## Detecting and quarantining flakes

A flake detector that runs in CI:

```yaml
# .github/workflows/flake-detect.yml
- name: Re-run tests 5x and require all green
  run: |
    for i in 1 2 3 4 5; do
      pnpm test || exit 1
    done
```

When a test flakes, move it to a quarantine tag immediately:

```python
@pytest.mark.flaky  # requires investigation before promotion
def test_thing(): ...
```

A separate CI job runs flaky tests with retries but never blocks merges. This keeps the main suite trustworthy without losing the test entirely.

## LLM-hostile patterns to remove

When debugging agent struggles in a codebase, look for and remove:

- Vague test names. `test_thing_works` → `test_login_returns_401_when_password_wrong`.
- Implicit fixtures with hidden teardown. Prefer per-test setup or visibly-named factories.
- Order-dependent assertions. `expect(items).toEqual([a, b, c])` on unordered collections → set comparison.
- Time-dependent assertions. `expect(timestamp).toBe(Date.now())` → inject a clock or freeze time.
- Tests whose oracle the agent can edit. Pin the spec in a separate location with separate review.
