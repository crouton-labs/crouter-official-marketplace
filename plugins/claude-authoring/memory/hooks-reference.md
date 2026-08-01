---
kind: knowledge
when-and-why-to-read: When you are implementing a Claude Code hook and need its configuration shape or event-specific output behavior, this reference guide should be read because it prevents a valid handler from being registered or interpreted incorrectly.
short-form: Claude Code hook configuration and event-specific output reference.
system-prompt-visibility: none
file-read-visibility: none
---

# Claude Code Hooks — Configuration and Output Reference

The [official Claude Code hooks reference](https://code.claude.com/docs/en/hooks) is the source of truth for the current event inventory, input schemas, matcher behavior, and accepted output. Consult the relevant event section rather than inferring one event's return contract from another.

## Configuration Shape

A hook configuration nests the event name under `hooks`, then a matcher group, then the handler array. This `PreToolUse` example blocks matching Bash commands:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/guard.sh"
          }
        ]
      }
    ]
  }
}
```

Use this shape in Claude Code settings or a host-native plugin's `hooks/hooks.json`. A matcher group may contain multiple handlers.

## Command Output

Command hooks receive event JSON on stdin. Claude Code interprets exit codes, stdout, stderr, and JSON output according to the event. `StopFailure` is a special case: its output and exit code are ignored.

For an event that accepts structured control, return `hookSpecificOutput` and set `hookEventName` to that event. For example, `PreToolUse` can deny a tool call:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Destructive command blocked"
  }
}
```

The [PreToolUse reference](https://code.claude.com/docs/en/hooks#pretooluse) defines its available fields. Other event pages define their own output behavior.

## Skill- and Agent-Scoped Hooks

Claude Code skills and agents can carry the same configuration under frontmatter `hooks:`:

```yaml
---
name: deploy
description: Deploy to production
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/confirm-deploy.sh"
---
```

Use scoped hooks when the enforcement belongs only to that Claude Code skill or agent, rather than every project event.
