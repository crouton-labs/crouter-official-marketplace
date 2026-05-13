# crouter-official-marketplace

The official plugin marketplace for crtr. Plugins here are convenient
extensions — they layer on top of crtr but are **not** tightly integrated
with core CLI operations.

## Scope

- Convenience workflows (`claude-authoring`, `spec-driven-development`,
  `knowledge-capture`, `llm-app-authoring`, `web`, `crtr-dev`).
- Domain-specific kits that wrap crtr commands or add Claude
  commands/skills/agents on top of them.
- Anything uninstallable without breaking core crtr behavior.

## Boundary

- **Core CLI behavior + agent-facing prompts** → `~/Code/cli/crouter`.
  If a plugin would only work because of new CLI behavior, push that
  behavior into crouter first.
- **Slash-command entrypoints into crtr itself** →
  `~/Code/crouton-kit/plugins/crtr`. Plugins here can add commands, but
  shouldn't duplicate the `/crtr:*` routing surface.
- **Convenient, loosely-coupled extensions** → here.

A plugin in this marketplace should be safe to delete without rendering
`crtr` unusable.
