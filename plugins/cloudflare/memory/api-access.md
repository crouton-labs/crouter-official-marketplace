---
kind: knowledge
when-and-why-to-read: When you need to call the Cloudflare REST or GraphQL API directly — anything Wrangler does not cover, like DNS, zones, Zero Trust, accounts, or analytics — this doc should be read because it gives the base URL, token auth, the response envelope and pagination, and the shell-native way to discover the exact endpoint from openapi.json instead of loading the whole API.
short-form: Cloudflare REST API by curl — base URL, Bearer token auth, the success/result envelope, pagination, GraphQL analytics, and grepping openapi.json to discover endpoints (Code Mode in a shell).
system-prompt-visibility: none
file-read-visibility: none
gate:
  kind:
    imatches: '^(general|developer)($|/)'
---

# Cloudflare REST API from curl

The REST API covers everything — over 2,500 endpoints. Wrangler wraps a slice of it; for the rest, curl.

## Base URL and auth

- **Base:** `https://api.cloudflare.com/client/v4/`
- **Auth:** Bearer token — `Authorization: Bearer $CLOUDFLARE_API_TOKEN`. Create scoped tokens in the dashboard (Account → API Tokens); both user tokens and account tokens work. Avoid the legacy `X-Auth-Email` / `X-Auth-Key` global-key headers.
- **Account/zone scope:** account-scoped paths take `/accounts/{account_id}/…`; zone-scoped take `/zones/{zone_id}/…`. Keep `CLOUDFLARE_ACCOUNT_ID` in the env.

```bash
# verify the token works
curl -sS https://api.cloudflare.com/client/v4/user/tokens/verify \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq

# list zones
curl -sS "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq '.result[].name'
```

## Response envelope

Every response is wrapped:

```json
{ "success": true, "errors": [], "messages": [], "result": … , "result_info": { "page": 1, "per_page": 20, "total_pages": 5, "count": 20, "total_count": 93 } }
```

Always branch on `.success`; read failures from `.errors[].message` (and `.code`). Paginate list endpoints with `?page=N&per_page=M` until `page == total_pages` (or `count < per_page`).

## Discover endpoints the Code Mode way

Do **not** read the 10 MB spec whole and do **not** install MCP. Fetch `openapi.json` once and grep/jq it for exactly the path you need — that is the shell equivalent of the Code Mode `search()` tool.

```bash
SPEC=/tmp/cf-openapi.json
[ -f $SPEC ] || curl -sS https://developers.cloudflare.com/openapi.json -o $SPEC

# find paths for a product/feature
jq -r '.paths | keys[]' $SPEC | grep -i dns_records

# inspect the operations + params for one path
jq '.paths["/zones/{zone_id}/dns_records"] | keys' $SPEC          # ["get","post"]
jq '.paths["/zones/{zone_id}/dns_records"].post.requestBody' $SPEC
```

Top-level keys are standard OpenAPI: `paths`, `components`, `servers`, `info`. Once you have the path + method + params, you write the `curl` — that is the `execute()` step.

## GraphQL Analytics API

Metrics and analytics live behind GraphQL, not REST:

```bash
curl -sS https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"query":"query { viewer { zones(filter:{zoneTag:\"<zone_id>\"}) { httpRequests1dGroups(limit:1){ sum { requests } } } } }"}' | jq
```

Schema and datasets: <https://developers.cloudflare.com/analytics/graphql-api/>.

## References

- Human-readable API reference: <https://developers.cloudflare.com/api/>
- Machine spec: <https://developers.cloudflare.com/openapi.json> (repo: `github.com/cloudflare/api-schemas`)
