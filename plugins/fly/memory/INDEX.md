---
kind: knowledge
when-and-why-to-read: 'When you are about to do anything with Fly.io — apps, Machines, volumes, secrets, or regions — open this dir first because it is the orientation map for how to authenticate, drive everything from a shell with flyctl or curl against the Machines API, and find the exact Fly.io doc for the task.'
short-form: Fly.io from a shell — flyctl for launch/deploy/status/logs, curl against the Machines API, docs via fly.io/docs and llms.txt. No MCP needed.
system-prompt-visibility: preview
file-read-visibility: none
gate:
  kind:
    imatches: '^(general|developer)($|/)'
---

# Fly.io

The front door for working with Fly.io. Read this, then jump to the sub-doc you need — each one ends in a real Fly.io URL you can `curl`.

Note: the plugin and directory are named `fly`, not `fly.io` — npm/plugin identifiers can't contain a dot.

## Orienting principle

Fly.io organizes work as apps made of Machines (Firecracker VMs), plus volumes, secrets, and regions. Two ways to act cover almost everything: `flyctl` (the `fly` command) for the everyday launch/deploy/status/logs loop, or the Machines REST API via `curl` for fine-grained, programmatic control of individual Machines. Neither needs MCP.

## Two ways to act

| Path | Use it for | Sub-doc |
|---|---|---|
| **flyctl CLI** | Launch, deploy, check status, stream logs, manage secrets — the everyday loop, app-config-aware via `fly.toml` | `fly/cli-setup` |
| **Machines API via curl** | Direct control of individual Machines, volumes, or apps; scripting outside flyctl's app-level abstractions | `fly/api-access` |

Find the right reference for either path with `fly/doc-references`.

## Canonical pointers

- **Docs hub:** <https://fly.io/docs/> — also has an agent-friendly index at <https://fly.io/llms.txt>.
- **flyctl reference:** <https://fly.io/docs/flyctl/>
- **App config (`fly.toml`):** <https://fly.io/docs/reference/configuration/>
- **Machines API guide:** <https://fly.io/docs/machines/api/>
- **Machines API interactive spec (OpenAPI):** <https://docs.machines.dev/> — also downloadable as machine-readable JSON at <https://docs.machines.dev/spec/openapi3.json>.

## Auth in one line

- **flyctl, interactive:** `fly auth login` (opens a browser — won't work headless).
- **Anything scriptable / headless / CI:** set `FLY_API_TOKEN` (flyctl also accepts the identical-purpose alias `FLY_ACCESS_TOKEN`) to a token from `fly tokens create deploy` (app-scoped) or `fly tokens create org` (org-scoped). flyctl and curl both read `FLY_API_TOKEN`/`FLY_ACCESS_TOKEN`/`Authorization: Bearer`; the env var takes precedence over a cached `fly auth login` session. Verify with `fly auth whoami`.
