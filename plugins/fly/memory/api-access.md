---
kind: knowledge
when-and-why-to-read: When you need to call Fly.io's Machines API directly — listing or controlling individual Machines, apps, volumes, or secrets programmatically — this doc should be read because it gives the base URL, Bearer token auth, rate limits, resources, curl examples, and why to prefer this over Fly's internal GraphQL API.
short-form: Fly.io Machines API by curl — base https://api.machines.dev/v1, Bearer token auth, apps/machines/volumes/secrets/tokens/certs resources, rate limits, GraphQL is internal/unstable.
system-prompt-visibility: none
file-read-visibility: none
gate:
  kind:
    imatches: '^(general|developer)($|/)'
---

# Fly.io Machines API from curl

The Machines API is Fly's public REST API for apps, Machines, volumes, secrets, tokens, and certificates — the same surface `flyctl` drives under the hood.

## Base URL and auth

- **Public base:** `https://api.machines.dev/v1`
- **Internal/private base:** `http://_api.internal:4280` — only reachable from inside a Fly app's WireGuard mesh (i.e. from another Fly Machine or a WireGuard-connected client), not from the open internet.
- **Auth:** `Authorization: Bearer $FLY_API_TOKEN` (the alias `FLY_ACCESS_TOKEN` holds the same value — either env var name works with flyctl; for raw curl, use whichever you've set).

```bash
# list apps (requires an org filter)
curl -sS "https://api.machines.dev/v1/apps?org_slug=personal" \
  -H "Authorization: Bearer $FLY_API_TOKEN" | jq '.apps[].name'

# list machines for an app
curl -sS "https://api.machines.dev/v1/apps/<app_name>/machines" \
  -H "Authorization: Bearer $FLY_API_TOKEN" | jq '.[] | {id, name, state, region}'

# get one machine
curl -sS "https://api.machines.dev/v1/apps/<app_name>/machines/<machine_id>" \
  -H "Authorization: Bearer $FLY_API_TOKEN" | jq
```

## Resources

Apps, Machines, Volumes, TLS Certificates, secrets (`/apps/{app}/secrets`), and tokens (`/tokens/...` — authenticate, authorize, OIDC) are all under this one API. `app_name` and `machine_id` are path params throughout; most list endpoints take query filters (e.g. Machines list takes `region`, `state`, `summary`).

## Rate limits

Per Fly's Machines API docs: roughly 1 request/second per action with a burst of 3 (e.g. create/update/delete on one Machine), with the Get-Machine read endpoint allowed a higher 5 requests/second with a burst of 10. Limits are scoped per action and per resource identifier (e.g. per machine ID), not a single global budget — batch operations across many Machines/apps in parallel rather than hammering one Machine's endpoint in a tight loop. Confirm current numbers on the Machines API guide (`fly/doc-references`) since these aren't enforced via documented response headers the way Vercel's or Railway's are.

## GraphQL: internal, avoid it

Fly also exposes `https://api.fly.io/graphql` — this is the **internal** API the dashboard itself uses. It has no stability guarantees, isn't documented for external use, and can change without notice. Prefer the Machines API or `flyctl` for anything you're building against; don't reach for the GraphQL endpoint unless you've confirmed there's no Machines API equivalent.

## No published OpenAPI spec at the docs domain — but one exists

Fly doesn't link a downloadable spec from `fly.io/docs`, but the Machines API does have a machine-readable OpenAPI 3 document, generated and hosted separately:

```bash
curl -sS https://docs.machines.dev/spec/openapi3.json -o /tmp/fly-openapi.json
jq -r '.servers' /tmp/fly-openapi.json                       # confirms the base URL above
jq -r '.paths | keys[]' /tmp/fly-openapi.json | grep -i machine   # discover Machine endpoints
jq '.paths["/apps/{app_name}/machines"].get' /tmp/fly-openapi.json  # params + response shape for one path
```

Use this the same way you'd grep Cloudflare's `openapi.json` — fetch once, jq for the path you need, then write the curl. The interactive, human-browsable version of the same spec is at <https://docs.machines.dev/>.
