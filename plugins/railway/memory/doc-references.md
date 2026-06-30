---
kind: knowledge
when-and-why-to-read: When you need authoritative, current Railway documentation for the CLI, the GraphQL API, or a specific resource (projects, services, variables, domains, volumes) and want to pull it into context efficiently, this doc should be read because it is the map of Railway's agent-friendly reference surfaces — the llms.txt index, per-page markdown, the API cookbook, and ID extraction from Railway URLs.
short-form: Railway's docs map — llms.txt index, llms-full.txt, per-page .md fetches, CLI reference, API overview/cookbook/manage-resource docs, URL-based ID extraction, agent integrations as optional.
system-prompt-visibility: none
file-read-visibility: none
gate:
  kind:
    imatches: '^(general|developer)($|/)'
---

# Finding the right Railway reference

Railway publishes its docs as plain markdown alongside the normal site — append `.md` to almost any docs URL to fetch clean text instead of HTML.

## The llms.txt surfaces

- **Root index:** <https://docs.railway.com/llms.txt> — curated category + link list across all of Railway's docs. Start here when you don't know which page you need.
- **Everything, one file:** <https://docs.railway.com/llms-full.txt> — the whole doc set inlined. Large; prefer the index or one page unless you genuinely need cross-product context.
- **Per-page markdown:** any docs page as `https://docs.railway.com/<page>.md` — e.g. `https://docs.railway.com/cli/up.md`, `https://docs.railway.com/integrations/api.md`.

## CLI reference

- **Overview + every command:** <https://docs.railway.com/cli> — one dedicated page per command (also fetchable as `.md`).
- **Live, exhaustive, offline:** `railway <command> --help`.
- **Agent setup guide:** <https://docs.railway.com/cli/setup>.

## API reference

- **Overview (endpoint, token types, rate limits):** <https://docs.railway.com/integrations/api>
- **GraphQL concepts walkthrough:** <https://docs.railway.com/integrations/api/graphql-overview>
- **Copy-paste query/mutation cookbook:** <https://docs.railway.com/integrations/api/api-cookbook>
- **Per-resource guides:** `https://docs.railway.com/integrations/api/manage-{projects,services,deployments,variables,environments,domains,volumes}`
- **Infrastructure as code (`railway.toml`):** <https://docs.railway.com/infrastructure-as-code/reference>
- **GraphiQL playground (browse the live schema):** <https://railway.com/graphiql>

## Extracting IDs from Railway URLs

Railway dashboard URLs encode the IDs you need for API calls — pull them out instead of guessing or always calling `railway status --json` (which only reflects the *local linked* context, not whatever project/environment a user just pasted a link to):

```
https://railway.com/project/<PROJECT_ID>/service/<SERVICE_ID>?environmentId=<ENVIRONMENT_ID>
```

Fall back to `railway status --json` (optionally with `--project`/`--environment`/`--service` to override) only when no URL was given.

## Drill-down recipe

1. **Don't know the area?** `curl https://docs.railway.com/llms.txt` and scan for the right link.
2. **Know the CLI command?** Go straight to <https://docs.railway.com/cli> or `railway <command> --help`.
3. **Know the API resource (projects, services, deployments, variables, ...)?** Use the matching `manage-<resource>` guide or the cookbook for a ready query/mutation.
4. **Need the live schema for a field that isn't in the docs yet?** Introspect via the GraphiQL playground or any GraphQL client with an `Authorization: Bearer` header.

## On Railway's agent integrations (optional, not the default path)

Railway publishes a local-stdio and remote (`mcp.railway.com`) MCP server, an open Agent Skills format, and a Claude Code plugin (`railwayapp/railway-skills`) that bundles the `use-railway` skill. Those are convenient if you're already inside an agent runtime that speaks MCP/skills, but the CLI + curl path above covers the same ground without connecting an external server — treat MCP as optional, not the default.
