---
kind: knowledge
when-and-why-to-read: 'When you are about to do anything with Railway — projects, environments, services, deployments, or databases — open this dir first because it is the orientation map for how to authenticate, drive everything from a shell with the Railway CLI or curl against the GraphQL API, and find the exact Railway doc for the task.'
short-form: Railway from a shell — Railway CLI for deploy/logs/environments, curl against the GraphQL API, docs via llms.txt. No MCP needed.
surfaces:
  - on: boot
    at: preview
---

# Railway

The front door for working with Railway. Read this, then jump to the sub-doc you need — each one ends in a real Railway URL you can `curl`.

## Orienting principle

Railway organizes work as projects → environments → services → deployments, plus managed databases. Two ways to act cover almost everything: the `railway` CLI for the everyday deploy/logs/environment loop, or the GraphQL API via `curl` for anything programmatic — listing resources, scripting CI, or operating without a linked directory. Neither needs MCP, though Railway does publish one (see [[railway/doc-references]]).

## Two ways to act

| Path | Use it for | Sub-doc |
|---|---|---|
| **Railway CLI** | Deploy, redeploy, stream logs, manage environments, SSH/connect into services — the everyday loop, especially inside a linked project | [[railway/cli-setup]] |
| **GraphQL API via curl** | Listing/inspecting projects, environments, services, variables; scripting outside a linked directory; anything the CLI doesn't expose directly | [[railway/api-access]] |

Find the right reference for either path with [[railway/doc-references]].

## Canonical pointers

- **Docs index:** <https://docs.railway.com/llms.txt> — curated link index into Railway's documentation.
- **Full docs in one file:** <https://docs.railway.com/llms-full.txt> (large; prefer the index or one page when you can).
- **CLI reference:** <https://docs.railway.com/cli> — every command, with a dedicated page per command (also fetchable as `.md`).
- **API reference:** <https://docs.railway.com/integrations/api> — GraphQL endpoint, token types, rate limits.

## Auth in one line

- **CLI, interactive:** `railway login` (OAuth, opens a browser; `railway login --browserless` prints a device code for SSH/headless sign-in but still needs a human to complete it in another browser).
- **Anything scriptable / headless / CI:** set `RAILWAY_TOKEN` (a project token, scoped to one environment) or `RAILWAY_API_TOKEN` (an account or workspace token, broader scope) as an environment variable — the CLI and curl both read these. Verify with `railway whoami` or `railway status --json`.
