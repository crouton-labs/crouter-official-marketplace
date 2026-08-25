---
kind: knowledge
when-and-why-to-read: When working in crouter-official-marketplace, this
  knowledge should be read because its boundary, current plugin inventory, and
  CI-owned versioning keep changes focused and release-safe.
short-form: Official crtr plugin marketplace
surfaces:
  - on: workspace-open
    at: content
  - on: read
    match: ./**
    at: content
last-updated: 2026-08-25T17:32:32.949Z
origin:
  created: 2026-08-01T19:00:18.879Z
  cwd: /Users/silasrhyneer/Code/cli/crouter-official-marketplace
  node: 3zl47w7d-msaqk1jk-70831037
namespace: crouter-official-marketplace
---

# crouter-official-marketplace

The official marketplace for optional crtr plugins. Every plugin here must be removable without affecting crtr core behavior.

## Boundary

- Put core CLI behavior and agent-facing prompts in `~/Code/cli/crouter`.
- Put slash-command entrypoints into crtr in `~/Code/crouton-kit/plugins/crtr`.
- Keep convenient, loosely coupled workflows and domain kits here.

## Plugins

- AI and Claude authoring: `ai`, `claude-authoring`.
- Knowledge and product discovery: `knowledge-capture`, `design-discovery`.
- Web and frontend: `web` — visual direction, interface craft, UX heuristics, the design workflow, HTML mockups, the UX-consultant role, and frontend debugging, all routed from `plugins/web/memory/INDEX.md`.
- Provider kits: `cloudflare`, `vercel`, `railway`, `fly`.
- Browser automation: `capture`.
- Web search: `search`.
- Development workflow and practice: `dev` — owns the `/dev:spec`, `/dev:design`, and `/dev:plan` front doors and their shared spec, design, plan, and orchestrator-roadmap guidance; developer base/orchestrator overlays and development playbook; testing guidance; plan-reviewer and spec-requirements sub-personas; the `code-craft` preferences; `dev/verify-runtime`; `dev/pr-description`; `/dev:init`; `/dev:create-workflow`; the bare `dev` dispatcher (routes `dev grove …` to the grove binary, `dev <name>` to an executable `.dev/<name>` in the caller's nearest committed `.dev/` directory with cwd at that repo root, and everything else to `grove dev`), plus the `crtr dev` passthrough mount over exec transport; and `templates/dev.ts` plus `templates/dev-cli.ts`, the zero-dependency TypeScript declared-tree lifecycle CLI `/dev:init` copies into a repository. It owns no lifecycle behavior: Grove resolves the caller's registered source or instance and the repository's own CLI performs the work.

## Command-contributing plugins

`capture`, `search`, and `dev` contribute top-level `crtr` commands over exec transport (`dev`'s is a transparent passthrough branch to its own `bin/dev`). `search` generates its `.crouter-plugin/commands.json` from `plugins/search/lib/commands.mjs` — edit the command tree there and run `node plugins/search/scripts/generate-commands.mjs`; `.github/scripts/validate-marketplace.mjs` fails CI on drift, on a missing exec bit, and on a transport/commands mismatch.

A plugin may also declare `bin` (bare executables placed on an agent's `PATH`, as `dev` does) and `requires` (a map of bare executable name to a one-line install hint, advisory only — crtr warns at install and in `crtr sys doctor` without blocking). The same validator checks both shapes.

## Versioning

`.github/workflows/auto-bump.yml` owns marketplace and plugin versions on pushes to `main`. Do not edit version fields by hand. Use a conventional commit subject: `feat!:` or `BREAKING CHANGE` produces a major bump, `feat:` a minor bump, and other subjects a patch bump.
