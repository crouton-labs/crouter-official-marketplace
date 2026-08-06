---
kind: knowledge
when-and-why-to-read: When working in crouter-official-marketplace, this
  knowledge should be read because its boundary, current plugin inventory, and
  CI-owned versioning keep changes focused and release-safe.
short-form: Official crtr plugin marketplace
system-prompt-visibility: none
file-read-visibility: content
applies-to: .
origin:
  created: 2026-08-01T19:00:18.879Z
  cwd: /Users/silasrhyneer/Code/cli/crouter-official-marketplace
  node: 3zl47w7d-msaqk1jk-70831037
---

# crouter-official-marketplace

The official marketplace for optional crtr plugins. Every plugin here must be removable without affecting crtr core behavior.

## Boundary

- Put core CLI behavior and agent-facing prompts in `~/Code/cli/crouter`.
- Put slash-command entrypoints into crtr in `~/Code/crouton-kit/plugins/crtr`.
- Keep convenient, loosely coupled workflows and domain kits here.

## Plugins

- AI and Claude authoring: `ai`, `claude-authoring`.
- Knowledge and product discovery: `knowledge-capture`, `design-discovery`, `web`.
- Provider kits: `cloudflare`, `vercel`, `railway`, `fly`.
- Browser automation: `capture`.
- Web search: `search`.

## Command-contributing plugins

`capture` and `search` contribute top-level `crtr` commands over exec transport. `search` generates its `.crouter-plugin/commands.json` from `plugins/search/lib/commands.mjs` — edit the command tree there and run `node plugins/search/scripts/generate-commands.mjs`; `.github/scripts/validate-marketplace.mjs` fails CI on drift, on a missing exec bit, and on a transport/commands mismatch.

## Versioning

`.github/workflows/auto-bump.yml` owns marketplace and plugin versions on pushes to `main`. Do not edit version fields by hand. Use a conventional commit subject: `feat!:` or `BREAKING CHANGE` produces a major bump, `feat:` a minor bump, and other subjects a patch bump.
