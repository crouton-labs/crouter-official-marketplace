---
kind: knowledge
when-and-why-to-read: 'When you are about to do anything with Cloudflare — Workers, Pages, R2, KV, D1, DNS, Zero Trust, or any Cloudflare API endpoint — open this dir first because it is the orientation map for how to authenticate, drive everything from a shell with curl and Wrangler (no MCP), and find the exact Cloudflare doc or API spec for the task.'
short-form: Cloudflare from a shell — Wrangler + curl against the REST API, endpoint discovery from openapi.json, docs via llms.txt. The Code Mode pattern without MCP.
system-prompt-visibility: preview
file-read-visibility: none
gate:
  kind:
    imatches: '^(general|developer)($|/)'
---

# Cloudflare

The front door for working with Cloudflare. Read this, then jump to the sub-doc you need — each one ends in a real Cloudflare URL you can `curl`.

## Orienting principle: Code Mode, the shell way

Cloudflare's "Code Mode" MCP server gives token-light agents the whole API through two tools, `search()` and `execute()`, by letting the model write code against the OpenAPI spec inside a sandbox instead of loading thousands of tool definitions. **You already have that sandbox — it is your shell.** So you do not need MCP at all:

- **Discover** endpoints on demand by grepping the OpenAPI spec or reading a product's `llms.txt`, instead of loading every endpoint up front.
- **Execute** with `curl` against the REST API, or with the `wrangler` CLI for build/deploy.

That is the same fixed-cost, progressive-discovery win the blog describes, with no server to connect and no tools to register. Do not install or connect a Cloudflare MCP server.

## Two ways to act

| Path | Use it for | Sub-doc |
|---|---|---|
| **Wrangler CLI** | Build, run, and deploy Workers/Pages and manage their bindings (KV, R2, D1, secrets, tail logs) | `cloudflare/wrangler-setup` |
| **REST API via curl** | Everything — 2,500+ endpoints across DNS, zones, Zero Trust, R2, accounts, analytics | `cloudflare/api-access` |

Find the right reference for either path with `cloudflare/doc-references`.

## The three canonical pointers (pointers to all the rest)

- **Docs index:** <https://developers.cloudflare.com/llms.txt> — one curated link index; every product links to its own `llms.txt`.
- **Full docs in one file:** <https://developers.cloudflare.com/llms-full.txt> (large; prefer a per-product `…/llms-full.txt`).
- **Machine API spec:** <https://developers.cloudflare.com/openapi.json> (~10 MB — grep it, never read it whole).

## Auth in one line

- **Wrangler, interactive:** `npx wrangler login` (OAuth, opens a browser — won't work headless).
- **Anything scriptable / headless / CI:** set `CLOUDFLARE_API_TOKEN` (scoped API token from the dashboard) and, for account-scoped calls, `CLOUDFLARE_ACCOUNT_ID`. Both Wrangler and curl read the token. Verify with `npx wrangler whoami` or a `GET /user/tokens/verify` curl.
