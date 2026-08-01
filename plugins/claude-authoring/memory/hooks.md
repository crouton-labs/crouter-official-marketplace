---
kind: knowledge
when-and-why-to-read: When you are creating, debugging, or planning Claude Code hooks for guardrails, context injection, quality gates, notifications, or automation, this authoring guide should be read because it matches the enforcement mechanism and output contract to the lifecycle event.
short-form: Claude Code hooks — lifecycle automation, handler selection, event-specific output, and configuration patterns.
system-prompt-visibility: name
file-read-visibility: none
---

# Claude Code Hooks

Claude Code hooks are deterministic handlers that fire at lifecycle events. Unlike instructions, they can enforce a decision, inject context, or run automation.

## When to Use Hooks vs Other Artifacts

- **Claude Code hooks**: A guardrail or automation must run at a lifecycle boundary.
- **Claude Code rules or `CLAUDE.md`**: Advisory conventions and project context.
- **Claude Code skills**: On-demand reference material, methodology, or workflows.

## Events and Configuration

Hook events span session setup and teardown, prompt submission and expansion, tool execution, subagents and tasks, compaction, worktrees, and MCP elicitation. Event timing, matcher semantics, and accepted output vary by event; use the [official hooks reference](https://code.claude.com/docs/en/hooks) as the current event inventory and consult [[claude-authoring/hooks-reference]] before implementing one.

A hook configuration nests an event, a matcher group, and one or more handlers. The complete valid shape and scoped-hook form are in [[claude-authoring/hooks-reference]].

## Handler Types

Pick the smallest handler that can make the decision:

| Handler | Use when... |
|---------|-------------|
| **command** | Logic is deterministic — regex check, file exists, env var set. |
| **prompt** | A single-turn judgment needs no file access. |
| **agent** | The decision needs investigation with tools. |
| **http** | Logic lives in a shared external service. |

Default to `command`. Escalate only when the simpler handler cannot make the required decision; agent handlers add real latency.

## Output and Decision Control

Command-hook stdin, stdout, stderr, exit codes, and structured return fields are event-specific. `StopFailure`, for example, ignores output and exit codes. When an event accepts a structured decision, return `hookSpecificOutput` with the matching `hookEventName`; the event reference defines which fields that event accepts.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Destructive command blocked"
  }
}
```

See [[claude-authoring/hooks-reference]] for the complete configuration example and event-specific control fields.

## Matchers

Use `|` to target multiple tools: `"matcher": "Write|Edit|MultiEdit"`. MCP tools match as `mcp__servername__toolname`. Omit the matcher to catch every occurrence of an event. Consult the [official matcher reference](https://code.claude.com/docs/en/hooks#matcher-patterns) for event-specific matcher rules.

## Skill- and Agent-Scoped Hooks

Claude Code hooks can be declared in `SKILL.md` or agent frontmatter to scope them to that external artifact. This is useful for guardrails that should not apply globally; see [[claude-authoring/hooks-reference]] for the nested configuration.

## Common Patterns

[[claude-authoring/hooks-patterns]] collects examples for guardrails, context injection, quality gates, notifications, logging, Git workflows, session management, and agent-team coordination.

## Best Practices

- **Async for slow operations**: Set `"async": true` for hooks that should not block.
- **Timeouts**: Set explicit timeouts for fast hooks.
- **Idempotency**: Hooks may fire multiple times; guard against duplicate processing.
- **Stop hook loops**: Check `stop_hook_active` before forcing continuation.
- **One concern per handler**: Compose small hooks instead of creating a monolith.
