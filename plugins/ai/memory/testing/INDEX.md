---
kind: knowledge
when-and-why-to-read: When you are testing code that AI agents write — designing the feedback loop, planning a suite, or auditing agent-written tests you don't trust — open this dir because it holds the agent-testing strategy, harness, and adversarial-review playbooks.
short-form: Testing for agent-written code — strategy, harness/feedback loop, and adversarial test-review pitfalls.
system-prompt-visibility: preview
file-read-visibility: none
---

# Testing agent-written code

When the agent writes the code, the test suite is no longer an independent check — the same process wrote the bugs and the oracle. Route by task:

- **"What should I test, and what should I skip?"** → [[test-strategy]].
- **"Wire the agent's feedback loop — CI, hooks, the CLAUDE.md test block"** → [[test-harness]].
- **"Review an agent PR / green CI I don't trust"** → [[test-pitfalls]].

Docs:

- **test-strategy** — what to test (and skip) when agents write the code: skip mock-heavy units, invest in integration, property, contract, conformance.
- **test-harness** — the fast, deterministic, remediation-bearing feedback loop agents iterate against.
- **test-pitfalls** — adversarial review of agent-written tests: deletion, weakening, over-mocking, reward hacking, intent drift.
