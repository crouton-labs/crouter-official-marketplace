---
kind: knowledge
when-and-why-to-read: When you need to call Railway's GraphQL API directly — listing or inspecting projects/environments/services/variables programmatically, scripting outside a linked directory, or driving a deploy from automation — this doc should be read because it gives the endpoint, the two auth header shapes (account/workspace vs project token), the response envelope, rate limits, and curl/GraphQL examples.
short-form: Railway GraphQL API by curl — endpoint https://backboard.railway.com/graphql/v2, Bearer for account/workspace tokens vs Project-Access-Token for project tokens, rate limits, example queries/mutations.
system-prompt-visibility: none
file-read-visibility: none
gate:
  kind:
    imatches: '^(general|developer)($|/)'
---

# Railway GraphQL API from curl

Railway's public API is GraphQL — the same API that powers the dashboard. One endpoint, query for exactly the data you want instead of hitting multiple REST routes.

## Endpoint and auth

- **Endpoint:** `https://backboard.railway.com/graphql/v2` (POST, JSON body `{"query": "...", "variables": {...}}`).
- **Account or workspace token (`RAILWAY_API_TOKEN`) or OAuth token:** `Authorization: Bearer $RAILWAY_API_TOKEN`.
- **Project token (`RAILWAY_TOKEN`):** a **different header** — `Project-Access-Token: $RAILWAY_TOKEN`, not `Authorization`. A project token only sees the one project/environment it was created for.

```bash
# account/workspace token — who am I (fails with a project token; account-scoped only)
curl -sS -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { me { id name email } }"}' | jq

# project token — confirm scope
curl -sS -X POST https://backboard.railway.com/graphql/v2 \
  -H "Project-Access-Token: $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { projectToken { projectId environmentId } }"}' | jq
```

## Response envelope

Standard GraphQL shape:

```json
{ "data": { "...": "..." }, "errors": [{ "message": "..." }] }
```

`errors` is only present on failure (partial data can still appear alongside it for nullable fields) — always check for `.errors` before trusting `.data`.

## Example queries and mutations

```bash
# list projects (account/workspace token)
curl -sS -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"query":"query { projects { edges { node { id name } } } }"}' | jq

# project + its services and environments
curl -sS -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"query":"query($id:String!){ project(id:$id){ id name services{edges{node{id name}}} environments{edges{node{id name}}} } }","variables":{"id":"<project_id>"}}' | jq

# trigger a deploy of the latest build for a service in an environment (mutation)
curl -sS -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"query":"mutation($s:String!,$e:String!){ serviceInstanceDeploy(serviceId:$s, environmentId:$e) }","variables":{"s":"<service_id>","e":"<environment_id>"}}' | jq
```

More copy-paste recipes (variables, domains, volumes): `railway/doc-references`.

## Rate limits

Per-token limits, returned as response headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, plus `Retry-After` once exhausted):

- **Requests/hour:** 100 (Free), 1,000 (Hobby), 10,000 (Pro), custom (Enterprise).
- **Requests/second:** 10 (Hobby), 50 (Pro), custom (Enterprise).

Check `X-RateLimit-Remaining` before a burst and back off proactively rather than waiting for a 429.

## Schema discovery

The API supports introspection — point any GraphQL client (Postman, Insomnia, the hosted GraphiQL playground at <https://railway.com/graphiql>) at the endpoint with an `Authorization` header to browse the live schema. There is no static schema file to grep; introspect, or read the cookbook for the query shape you need.
