# crouter-official-marketplace

The official plugin marketplace for crtr. Plugins here are convenient
extensions — they layer on top of crtr but are **not** tightly integrated
with core CLI operations.

## Scope

- Convenience workflows (`claude-authoring`, `spec-driven-development`,
  `knowledge-capture`, `llm-app-authoring`, `web`, `agentic-testing`).
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

## Versioning

Versions auto-bump on push to `main` via `.github/workflows/auto-bump.yml`.
Do **not** edit `version` fields by hand — CI will bump them and push a
`chore: release vX.Y.Z` commit plus a matching tag.

Bump kind comes from the commit subject (conventional commits):

- `feat!: …` or `BREAKING CHANGE` in body → major
- `feat: …` → minor
- anything else (`fix:`, `chore:`, `docs:`, …) → patch

What gets bumped:

- For each plugin folder touched in the commit, the workflow bumps both
  `plugins/<name>/.crouter-plugin/plugin.json` and the matching entry in
  `.crouter-marketplace/marketplace.json`. Newly-added plugins are
  skipped (keep the version you committed).
- The top-level `marketplace.json` version is bumped whenever any plugin
  is bumped or `marketplace.json` itself was edited.
- Commits whose subject starts with `chore: release` are skipped to
  avoid loops.
