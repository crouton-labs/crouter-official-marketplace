---
kind: knowledge
when-and-why-to-read: 'When you are about to do anything with Vercel — deployments, projects, domains, or environment variables — open this dir first because it is the orientation map for how to authenticate, drive everything from a shell with the Vercel CLI or curl against the REST API, and find the exact Vercel doc for the task.'
short-form: Vercel from a shell — Vercel CLI for deploy/dev/logs, curl against the REST API, docs via llms.txt. No MCP needed.
surfaces:
  - on: boot
    at: preview
---

# Vercel

The front door for working with Vercel. Read this, then jump to the sub-doc you need — each one ends in a real Vercel URL you can `curl`.

## Orienting principle

Vercel's surface is deployments, projects, domains, and environment variables. Almost everything you need is reachable two ways: the `vercel` CLI for the build/deploy/dev loop, or the REST API via `curl` for anything programmatic — listing resources, scripting CI, or operating outside a linked project directory. Neither needs MCP.

## Two ways to act

| Path | Use it for | Sub-doc |
|---|---|---|
| **Vercel CLI** | Deploy, local dev server, logs, env vars, rollbacks — the everyday loop, especially inside a linked project | [[vercel/cli-setup]] |
| **REST API via curl** | Listing/inspecting projects and deployments, scripting outside a linked directory, anything the CLI doesn't expose directly | [[vercel/api-access]] |

Find the right reference for either path with [[vercel/doc-references]].

## Canonical pointers

- **Docs index:** <https://vercel.com/llms.txt> — curated link index into Vercel's documentation.
- **Full docs in one file:** <https://vercel.com/llms-full.txt> (large; prefer the index or a specific doc page when you can).
- **CLI reference:** <https://vercel.com/docs/cli> — every command, current and authoritative.
- **API reference:** <https://vercel.com/docs/rest-api> (REST endpoints, auth, SDK).

## Auth in one line

- **CLI, interactive:** `vercel login` (OAuth, opens a browser — won't work headless).
- **Anything scriptable / headless / CI:** set `VERCEL_TOKEN` (a token from <https://vercel.com/account/tokens>, scope it to a team/project where possible). Both the CLI and curl read it — the CLI also accepts `--token <token>` for a one-off. Verify with `vercel whoami` (or `npx vercel whoami` if not installed globally).
