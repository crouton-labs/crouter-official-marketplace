---
kind: knowledge
when-and-why-to-read: When you need to call the Vercel REST API directly — listing or inspecting projects/deployments/domains programmatically, scripting outside a linked project directory, or anything the CLI doesn't expose — this doc should be read because it gives the base URL, token auth, team scoping, rate limits, and curl examples for the common endpoints.
short-form: Vercel REST API by curl — base https://api.vercel.com, Bearer token auth, teamId scoping, rate-limit headers, curl examples for projects/deployments, no published OpenAPI spec.
system-prompt-visibility: none
file-read-visibility: none
---

# Vercel REST API from curl

The REST API covers everything the dashboard does — deployments, projects, domains, env vars, teams, integrations. The CLI wraps a slice of it; for the rest, or for scripting outside a linked directory, curl.

## Base URL and auth

- **Base:** `https://api.vercel.com/` — HTTP/1 and HTTP/2 over TLS, versioned per-endpoint (e.g. `/v6/deployments`, `/v9/projects`; check the endpoint's reference page for its version).
- **Auth:** Bearer token — `Authorization: Bearer $VERCEL_TOKEN`. Create/manage tokens at <https://vercel.com/account/tokens>; scope a token to a specific team where possible.
- **Team-owned resources:** append `?teamId=<team_id>` to the request — without it, the API operates on your personal account.

```bash
# verify the token and see who it belongs to
curl -sS https://api.vercel.com/v2/user \
  -H "Authorization: Bearer $VERCEL_TOKEN" | jq

# list projects
curl -sS https://api.vercel.com/v10/projects \
  -H "Authorization: Bearer $VERCEL_TOKEN" | jq '.projects[].name'

# get one project by id or name
curl -sS "https://api.vercel.com/v9/projects/<project_id_or_name>" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | jq

# list deployments for a project
curl -sS "https://api.vercel.com/v7/deployments?projectId=<project_id>&limit=10" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | jq '.deployments[] | {uid, url, state}'

# get one deployment's details
curl -sS "https://api.vercel.com/v13/deployments/<deployment_id_or_url>" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | jq
```

Endpoint paths are versioned per-resource and the version number does change over time (`/v7/deployments`, `/v9/projects/{id}`, `/v10/projects`, `/v13/deployments/{id}` as of this writing) — confirm the current version on the resource's reference page ([[vercel/doc-references]]) before relying on it long-term, rather than assuming a version number stays fixed.

## Response shape and errors

List endpoints return a named array plus a `pagination` object (`{ count, next, prev }`) — pass `pagination.next` back in as `?until=<next>` (or the endpoint's documented cursor param) to page forward. Single-resource endpoints return the resource directly, not wrapped in `data`. Errors come back as:

```json
{ "error": { "code": "forbidden", "message": "..." } }
```

Branch on HTTP status first, then read `.error.code`/`.error.message` for detail.

## Rate limits

Every response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers — check `X-RateLimit-Remaining` before a burst of calls and back off once it nears zero rather than waiting for a 429.

## No published OpenAPI/machine spec

Unlike Cloudflare, Vercel does not publish a downloadable `openapi.json` for agents to grep. The closest things to a machine-readable spec are the `@vercel/sdk` npm package's generated TypeScript models (one file per endpoint under `models/`, e.g. `getdeploymentsop.d.ts`, with exact paths and response shapes) and the human-authored REST API reference organized by resource — see [[vercel/doc-references]] for the reference URL and how to drill into one resource.
