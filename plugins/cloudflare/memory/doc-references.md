---
kind: knowledge
when-and-why-to-read: When you need authoritative, current Cloudflare documentation for a product or API and want to pull it into context efficiently, this doc should be read because it is the map of Cloudflare's agent-friendly reference surfaces — the llms.txt index, per-product full-text docs, and the OpenAPI spec — plus the drill-down path from "which product?" to the exact page.
short-form: Cloudflare's agent-facing docs map — llms.txt index, per-product llms-full.txt, openapi.json, and the api/wrangler references, with the drill-down recipe.
---

# Finding the right Cloudflare reference

Cloudflare publishes its docs in agent-friendly form. Pull from these directly with `curl` — they are plain text/markdown, no scraping needed.

## The llms.txt surfaces

- **Root index:** <https://developers.cloudflare.com/llms.txt> — a curated, categorized link list. Each product links to *its own* `llms.txt`. This is your table of contents.
- **Per-product index:** append `/llms.txt` to any product path — e.g. `…/workers/llms.txt`, `…/dns/llms.txt`, `…/r2/llms.txt`, `…/agents/llms.txt`. Lists that product's pages.
- **Per-product full text:** append `/llms-full.txt` — e.g. `…/workers/llms-full.txt`. The entire product's docs inlined; fetch this when you're working in one product and want it all in context.
- **Everything, one file:** <https://developers.cloudflare.com/llms-full.txt> — the whole doc set. Large; prefer a per-product file unless you genuinely need cross-product.

## The API spec

- **Machine-readable:** <https://developers.cloudflare.com/openapi.json> (~10 MB). Grep/jq it for endpoints — see [[cloudflare/api-access]].
- **Human-readable:** <https://developers.cloudflare.com/api/>.
- **Source repo:** `github.com/cloudflare/api-schemas`.

## Wrangler / Workers reference

- Wrangler commands: <https://developers.cloudflare.com/workers/wrangler/commands/>
- Config: <https://developers.cloudflare.com/workers/wrangler/configuration/>
- Live, exhaustive, offline: `npx wrangler <command> --help`.

## Drill-down recipe

1. **Don't know the product?** `curl https://developers.cloudflare.com/llms.txt` and scan categories for the right product link.
2. **Know the product, want orientation?** `curl …/<product>/llms.txt` for its page index; fetch the one page you need.
3. **Working deep in one product?** `curl …/<product>/llms-full.txt` to load it all.
4. **Need an exact API endpoint, params, or schema?** grep `openapi.json` (recipe in [[cloudflare/api-access]]).

## On Cloudflare's MCP servers (we don't use them)

Cloudflare also offers hosted MCP servers (a docs server, a Workers-bindings server, the Code Mode "whole API" server, etc.) and a Skills plugin. **We deliberately don't connect MCP** — a shell with `curl` + `wrangler` plus the surfaces above gives the same coverage without a server or registered tools. If you ever want the docs server's semantic search specifically, it's reachable over plain HTTP at `https://docs.mcp.cloudflare.com/mcp`, but `llms.txt` + `openapi.json` are simpler and usually enough.
