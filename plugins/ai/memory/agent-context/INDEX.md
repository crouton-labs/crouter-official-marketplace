---
kind: knowledge
when-and-why-to-read: When you are working on an agent's context or prompts — writing or fixing a system prompt, deciding where capability or knowledge should live in an agent system, managing the context window, or reviewing an assembled prompt — open this dir because it holds the agent-context playbooks for those tasks.
short-form: Agent-context skills — context placement channels, prompt craft, system prompts, context management, prompt review.
system-prompt-visibility: preview
file-read-visibility: none
---

# Agent context

Where context lives in an agent system, and how to write what goes in each place. Route by task:

- **"Fix/write this system prompt"** → [[prompting-effectively]] (the craft) + [[system-prompts]] (what belongs there, placement mechanics).
- **"Build an agent with these capabilities"** → [[context-placement-channels]] (which channel each piece belongs in).
- **"The input/window is too big"** → [[context-management]] (budgets, placement effects, caching, compression).
- **"Audit an existing agent's prompt"** → [[review-prompt]].

Docs:

- **context-placement-channels** — the spine: every place context can live (system prompt, tools, CLI disclosure, output-as-pointer, memory pointers, on-read injection, first message, task messages, env blocks, hooks) and what each is uniquely good for.
- **prompting-effectively** — the writing craft: zones, tone registers, escalation ladder, subtract-before-you-add, positive framing, examples, decision frameworks.
- **system-prompts** — the behavior channel specifically: front-door principle, what belongs/doesn't, primacy, instruction hierarchy, caching.
- **context-management** — token budgets, RAG, caching, compression, long context.
- **review-prompt** — reconstruct and review an existing agent's assembled prompt.
