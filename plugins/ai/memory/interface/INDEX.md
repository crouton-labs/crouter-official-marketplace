---
kind: knowledge
when-and-why-to-read: When you are designing the surfaces around an LLM — a CLI or structured tool an agent drives, or the UI/UX an agent presents to a human — open this dir because it splits into agent-facing (cli, tool) and human-facing (agentic ui, ux) interface playbooks.
short-form: Interface design for AI systems — agent-facing (cli, tool) and human-facing (agentic ui, ux).
system-prompt-visibility: preview
file-read-visibility: none
---

# Interface design

The surfaces around an LLM: what an agent drives (agent-facing) and what an agent shows a human (human-facing). Route by task:

- **"Design a CLI an agent drives"** → [[agent-facing/cli-design]] (subcommand tree, `-h` disclosure, prompt-shaped stdout, structured errors) + worked example [[agent-facing/cli-design-reference]].
- **"Design a function-calling / MCP tool"** → [[agent-facing/tool-design]] (descriptions, schemas, granularity, errors) + patterns/citations [[agent-facing/tool-design-reference]].
- **"Build or review the UI an agent shows a human"** → [[human-facing/agentic-ui]] (surface choice, streaming, review gates, steering; web + TUI) — read [[human-facing/agentic-ux]] first for the judgment layer.
- **"Decide autonomy, trust, friction, or oversight for human–agent interaction"** → [[human-facing/agentic-ux]] (the first principles: articulation barrier, automation×control, trust calibration).

Docs:

- **agent-facing/cli-design** — CLIs an agent drives as a shell command: tree shape, `-h` progressive disclosure, stdout-as-prompt, exit codes, structured errors, job handles, pagination.
- **agent-facing/tool-design** — structured tool-calls (function calling / MCP): description craft, parameter schemas, error recovery, granularity, tool-count limits, composition.
- **human-facing/agentic-ui** — the pattern layer for surfacing agent work to a human: what to render and when, web and terminal (alt-screen debate, differential redraw).
- **human-facing/agentic-ux** — the judgment layer: first principles behind human–agent interaction — delegation over conversation, verify-not-execute, friction scaled to consequence.
