---
kind: knowledge
when-and-why-to-read: When you need to deploy, redeploy, stream logs, or manage environments/services for a Railway project, this doc should be read because it is the end-to-end Railway CLI setup — install, auth (interactive vs headless), verify, the common deploy/logs/environment/deployment commands, and config caveats.
short-form: Railway CLI end-to-end — install, auth (railway login vs RAILWAY_TOKEN/RAILWAY_API_TOKEN), railway link/up/logs/environment/ssh/connect, railway.toml, and linked-project targeting.
system-prompt-visibility: none
file-read-visibility: none
---

# Railway CLI setup

The `railway` CLI is the everyday deploy/logs/environment loop.

## Install

```bash
bash <(curl -fsSL railway.com/install.sh) -y   # installs to ~/.railway/bin, -y skips the confirmation prompt
brew install railway                            # Homebrew (macOS)
npm i -g @railway/cli                           # npm, Node.js 16+
```

There is also `curl -fsSL agents.railway.com | sh`, which installs the CLI and additionally configures detected agent tools (MCP, skills) — skip it if you only want the plain CLI.

## Authenticate

- **Interactive (your machine):** `railway login` — opens a browser for OAuth. `railway login --browserless` prints a device code to complete sign-in from another device; still needs a human, so it doesn't help fully headless CI.
- **Headless / agent / CI:** set one of these environment variables — the CLI reads them with no `login` step:
  - `RAILWAY_TOKEN` — a **project token**, scoped to a single environment within one project (create it from that project's settings → Tokens). Use with commands that operate on that linked project/environment.
  - `RAILWAY_API_TOKEN` — an **account or workspace token**, broader scope (create it from <https://railway.com/account/tokens>). Use for anything that spans projects.
- **Verify:** `railway whoami`, or `railway status --json` to confirm the linked project/environment/service context.

## Deploy, redeploy, and logs

```bash
railway up                              # deploy the current directory; signs you in / links a project if needed
railway up --environment production     # deploy to a specific environment
railway up --service backend            # deploy to a specific service
railway up --ci                         # stream build logs only, then exit (CI mode)
railway up -d                           # detach — start the deploy, don't stream logs
railway redeploy                        # redeploy the latest deployment as-is
railway logs                            # stream deploy logs from the most recent successful deployment
railway logs --build                    # build logs instead of deploy logs
railway logs -n 100                     # last 100 lines (disables streaming)
railway logs --service backend          # logs for a specific service
```

`railway up` is a complete on-ramp — in an interactive terminal it will sign you up/in and create a project if none is linked. **In scripts and CI it never creates a project implicitly**: with no linked project and no interactive prompt it fails with a structured auth/no-project error, so set a token and link explicitly first.

## Environments and deployments

```bash
railway environment                     # interactively link/switch environment
railway environment new staging         # create a new environment
railway ssh                             # SSH into a service's running container
railway connect                         # open a shell/connection to a database service
```

Public Railway docs list `railway environment list --json` and `railway deployment list --json`, but local Railway CLI 4.5.3 lacks those leaves. Before scripting either, check `railway <command> --help`; use [[railway/api-access]] for listings your installed CLI does not support.

## Config files

- **`railway.toml`** (project root) — infrastructure-as-code: declares services, their source, build/start commands, and domains. Optional; most projects are configured through the dashboard or CLI instead.
- **`.railwayignore`** — exclude files from `railway up` uploads, same semantics as `.gitignore`.

## Explicit targeting

Use `railway link --project <project> --environment <environment> --service <service>` to set the directory's linked project context before automation. `railway up` and `railway logs` use that project and accept only `-e/--environment` and `-s/--service` overrides; `railway status` has no targeting flags. Do not assume `-p/--project` works outside `railway link`; check `railway <command> --help` for the installed version.

## Discovering commands

`railway <command> --help` is exhaustive and current. Full reference, one page per command: <https://docs.railway.com/cli> (also fetchable per-page as `https://docs.railway.com/cli/<command>.md`).
