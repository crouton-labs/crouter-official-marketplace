---
kind: knowledge
when-and-why-to-read: When you need to build, run locally, or deploy a Cloudflare Worker or Pages project, or manage its bindings (KV, R2, D1, secrets) and logs, this doc should be read because it is the end-to-end Wrangler setup — install, auth (interactive vs headless), scaffold, dev, deploy, config — with the commands that actually work.
short-form: Wrangler end-to-end — install, auth (login vs CLOUDFLARE_API_TOKEN), scaffold with C3, local development and deployment, wrangler.jsonc config and bindings.
system-prompt-visibility: none
file-read-visibility: none
---

# Wrangler setup

Wrangler is Cloudflare's CLI for Workers/Pages. Prefer `npx wrangler …` (or a project-local dev dep) over a global install so the version is pinned per project.

## Install

```bash
npm i -D wrangler@latest      # add to the project (recommended)
npx wrangler --version        # verify; runs the project-local copy
```

## Scaffold a new project (C3)

```bash
npm create cloudflare@latest -- my-app   # interactive: picks template, installs deps, git init
cd my-app
```

`create-cloudflare` (C3) is the supported scaffolder — it produces a ready `wrangler.jsonc`, a starter Worker, and types. Use it instead of hand-writing config.

## Authenticate

- **Interactive (your machine):** `npx wrangler login` — OAuth in the browser. `npx wrangler logout` to clear. **Does not work headless** (no browser).
- **Headless / agent / CI:** set environment variables — Wrangler picks them up with no `login`:
  - `CLOUDFLARE_API_TOKEN` — a scoped API token created in the dashboard (Account → API Tokens). Grant only the products you need (e.g. *Workers Scripts: Edit*).
  - `CLOUDFLARE_ACCOUNT_ID` — required when your token can see more than one account.
- **Verify:** `npx wrangler whoami`.

## Develop and deploy

```bash
npx wrangler dev            # local dev server (Workerd); --remote runs on Cloudflare's edge
npx wrangler deploy         # publish the Worker
npx wrangler tail           # live-stream production logs
npx wrangler versions upload                         # upload a rollout version
npx wrangler versions deploy <version-id>@<percentage>  # send that version a share of traffic
```

## Configuration: `wrangler.jsonc`

`wrangler.jsonc` (recommended) or `wrangler.toml` in the project root. Core fields:

```jsonc
{
  "name": "my-app",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-01",   // pin runtime behavior
  "account_id": "<id>",                  // or via CLOUDFLARE_ACCOUNT_ID
  "vars": { "MY_VAR": "value" },          // plaintext env vars
  "kv_namespaces":  [{ "binding": "KV",  "id": "<ns-id>" }],
  "r2_buckets":     [{ "binding": "BUCKET", "bucket_name": "<name>" }],
  "d1_databases":   [{ "binding": "DB",  "database_id": "<id>" }]
}
```

Bindings show up on the `env` object inside the Worker. Manage the backing resources with subcommands: `wrangler kv …`, `wrangler r2 …`, `wrangler d1 …`. **Secrets** (not plaintext `vars`) go in with `wrangler secret put <NAME>`.

## Discovering any command

`npx wrangler <command> --help` is exhaustive and current — reach for it before guessing flags. Full reference and the per-command list:

- Commands: <https://developers.cloudflare.com/workers/wrangler/commands/>
- Config: <https://developers.cloudflare.com/workers/wrangler/configuration/>
- Everything Workers, one file: <https://developers.cloudflare.com/workers/llms-full.txt>
