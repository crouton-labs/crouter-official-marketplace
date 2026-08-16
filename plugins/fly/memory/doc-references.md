---
kind: knowledge
when-and-why-to-read: When you need authoritative, current Fly.io documentation for flyctl, app configuration, or the Machines API and want to pull it into context efficiently, this doc should be read because it is the map of Fly.io's reference surfaces — the docs hub and its llms.txt index, flyctl's per-command pages, fly.toml reference, and the Machines API's interactive/downloadable OpenAPI spec.
short-form: Fly.io's docs map — fly.io/llms.txt, docs hub, flyctl reference, fly.toml config, Machines API docs and OpenAPI spec, tokens/regions/secrets pages.
---

# Finding the right Fly.io reference

Fly.io's main docs site is a JavaScript-rendered app — plain `curl` on a docs page often returns an empty shell rather than the article text. Prefer the index below and `fly <command> --help` over scraping arbitrary docs pages.

## The llms.txt surface

- **Root index:** <https://fly.io/llms.txt> — a curated, categorized link list across flyctl, Fly Apps, Fly Machines, language/framework guides, and more. This loads as plain text and is the right starting point. There is no per-product `llms-full.txt` the way Cloudflare or Vercel publish one — this index plus the pages it links to is what you have.

## flyctl reference

- **Overview:** <https://fly.io/docs/flyctl/>
- **Install:** <https://fly.io/docs/flyctl/install/>
- **Per-command pages:** `https://fly.io/docs/flyctl/<command>/` — e.g. `.../deploy/`, `.../machine-exec/`, `.../tokens-create-deploy/`. Listed from the flyctl overview page.
- **Live, exhaustive, offline:** `fly help`, `fly <command> --help`.
- **Scripted/CI usage:** <https://fly.io/docs/flyctl/integrating/> — the authoritative source on `FLY_API_TOKEN`/`FLY_ACCESS_TOKEN` and token types.

## App configuration

- **`fly.toml` reference:** <https://fly.io/docs/reference/configuration/>
- **Regions (3-letter codes):** <https://fly.io/docs/reference/regions/>
- **Secrets:** <https://fly.io/docs/apps/secrets/>
- **Tokens/security:** <https://fly.io/docs/security/tokens/>

## Machines API

- **Guide (concepts, getting started):** <https://fly.io/docs/machines/api/>
- **Interactive spec (human-browsable):** <https://docs.machines.dev/>
- **Downloadable OpenAPI 3 spec (machine-readable):** <https://docs.machines.dev/spec/openapi3.json> — `curl` it and `jq` for the path you need, same pattern as Cloudflare's `openapi.json` (see [[fly/api-access]]).
- **Guides/examples (managing Machines via the API):** <https://fly.io/docs/machines/guides-examples/managing-machines-with-the-api/>

## Community and source

- **Community forum:** <https://community.fly.io/>
- **flyctl source (GitHub):** <https://github.com/superfly/flyctl>

## Drill-down recipe

1. **Don't know the area?** `curl https://fly.io/llms.txt` and scan for the right link.
2. **Know the flyctl command?** `fly <command> --help`, or `https://fly.io/docs/flyctl/<command>/` if you need narrative context the `--help` output doesn't give.
3. **Configuring an app?** `fly.toml` reference plus the regions/secrets pages above.
4. **Need an exact Machines API endpoint, params, or schema?** Fetch `openapi3.json` and grep/jq it (recipe in [[fly/api-access]]) rather than trying to scrape the JS-rendered docs page.

## What Fly.io does not have (don't assume Cloudflare's shape)

No central `llms-full.txt` of the whole doc set, no `openapi.json` hosted at the main `fly.io` domain (it's at the separate `docs.machines.dev` host instead), and the public GraphQL endpoint (`api.fly.io/graphql`) is internal and undocumented for external use — see [[fly/api-access]] for why to avoid it.
