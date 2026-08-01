---
kind: knowledge
when-and-why-to-read: When you need authoritative, current Vercel documentation for a product, CLI command, or API endpoint and want to pull it into context efficiently, this doc should be read because it is the map of Vercel's agent-friendly reference surfaces — the llms.txt index, the CLI and REST API references, and the drill-down path from "which area?" to the exact page.
short-form: Vercel's docs map — llms.txt index, llms-full.txt, CLI reference, REST API reference by resource, plus the drill-down recipe.
system-prompt-visibility: none
file-read-visibility: none
---

# Finding the right Vercel reference

Vercel publishes its docs in agent-friendly plain text alongside the normal site. Pull from these directly with `curl`.

## The llms.txt surfaces

- **Root index:** <https://vercel.com/llms.txt> — curated link list across all of Vercel's docs. Start here when you don't know which page you need.
- **Everything, one file:** <https://vercel.com/llms-full.txt> — the whole doc set inlined. Large; prefer the index or a specific page unless you genuinely need cross-cutting context.

## CLI reference

- **Overview + every command:** <https://vercel.com/docs/cli> — lists every `vercel <command>`, with a dedicated sub-page per command.
- **Live, exhaustive, offline:** `vercel <command> --help`.
- **Project linking:** <https://vercel.com/docs/cli/project-linking> — how `.vercel/project.json` ties a directory to a project.

## REST API reference

- **Overview (auth, rate limits, team scoping):** <https://vercel.com/docs/rest-api>
- **Operation-list front door:** <https://vercel.com/llms.txt> — the per-resource category pages (`https://vercel.com/docs/rest-api/{resource}`) are *not* operation-list pages: each one 308-redirects to a single, effectively arbitrary operation under that resource rather than listing all of them, so they silently give the wrong page instead of a menu. Use `llms.txt` instead — it lists every operation per resource as `[Title](https://vercel.com/docs/rest-api/{resource}/{operation})` followed by its HTTP method and versioned path, e.g. `- [Retrieve a list of projects](https://vercel.com/docs/rest-api/projects/retrieve-a-list-of-projects) \`GET /v10/projects\``. Grep it for the resource name to get the full operation menu.
- **Per-operation pages:** <https://vercel.com/docs/rest-api/{resource}/{operation}> — e.g. <https://vercel.com/docs/rest-api/projects/retrieve-a-list-of-projects>, <https://vercel.com/docs/rest-api/deployments/create-a-new-deployment>. Each gives the method, exact versioned path (e.g. `GET /v10/projects`), params, and a request/response example. (The older `/docs/rest-api/endpoints/{resource}` path still resolves but only to one arbitrary operation page, same as the category pages — don't use it for discovery.)
- **Project configuration (`vercel.json` fields):** <https://vercel.com/docs/project-configuration>
- **SDK:** `@vercel/sdk` on npm — generated TypeScript client; its `models/` directory is a reliable ground truth for exact paths and response shapes when the docs page is ambiguous.

## Drill-down recipe

1. **Don't know the area?** `curl https://vercel.com/llms.txt` and scan for the right doc link.
2. **Know the CLI command?** Go straight to <https://vercel.com/docs/cli> or run `vercel <command> --help`.
3. **Know the API resource (projects, deployments, domains, env, teams, ...)?** Grep `https://vercel.com/llms.txt` for the resource name to get the full list of operations and their slugs (e.g. `rest-api/projects/find-a-project-by-id-or-name`), then go straight to `https://vercel.com/docs/rest-api/<resource>/<operation>` for the exact one. Don't open `https://vercel.com/docs/rest-api/<resource>` expecting an operation list — it redirects to one arbitrary operation page, not a menu.
4. **Need the exact current path/version for one endpoint and the docs page is unclear?** Check the matching file under `@vercel/sdk`'s `esm/funcs/` and `esm/models/` (e.g. `npm pack @vercel/sdk` and grep) — it's generated from Vercel's internal spec and stays current.

## On Vercel's AI/agent integrations (optional, not the default path)

Vercel offers a hosted MCP server (`vercel/docs/mcp` — "Vercel MCP") and AI SDK integrations for building agents on Vercel. Those are about *building AI products on Vercel's platform*, not about *operating* Vercel itself — for driving your own deploys, env vars, and inspection, the CLI and REST API above are simpler and don't require connecting an external server.
