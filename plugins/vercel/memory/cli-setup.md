---
kind: knowledge
when-and-why-to-read: When you need to deploy, run a local dev server, stream logs, or manage env vars for a Vercel project, this doc should be read because it is the end-to-end Vercel CLI setup — install, auth (interactive vs headless), verify, the common deploy/dev/logs/env commands, and project-linking caveats.
short-form: Vercel CLI end-to-end — install, auth (vercel login vs VERCEL_TOKEN), vercel deploy/dev/logs/env/rollback, vercel.json, project linking and --scope.
system-prompt-visibility: none
file-read-visibility: none
---

# Vercel CLI setup

The `vercel` CLI is the everyday deploy/dev/logs loop. Prefer a pinned project-local install (`npx vercel`) for reproducibility, though a global install is the documented default.

## Install

```bash
npm i -g vercel@latest      # global, documented default
npx vercel --version        # or run ad hoc without installing globally
```

There is no separate `@vercel/cli` package to reach for — `vercel` is the package name; `npx vercel` runs the latest published version without a global install.

## Authenticate

- **Interactive (your machine):** `vercel login` — opens a browser for OAuth. **Does not work headless** (no browser, no manual input).
- **Headless / agent / CI:** create a token at <https://vercel.com/account/tokens>, then either:
  - set the `VERCEL_TOKEN` environment variable (recommended — avoids the token showing up in process lists/logs), or
  - pass `--token <token>` per command (takes precedence over `VERCEL_TOKEN` if both are set).
- **Verify:** `vercel whoami` (or `npx vercel whoami`).

## Deploy, dev, and logs

```bash
vercel                         # deploy the current directory (preview by default)
vercel deploy --prod           # deploy straight to production
vercel dev                     # local dev server that replicates the Vercel edge runtime
vercel logs <deployment-url>   # fetch logs for a deployment
vercel rollback <deployment>   # instantly roll back to a previous deployment
vercel list                    # list deployments for the linked project
vercel inspect <deployment>    # deployment details (status, build, aliases)
```

## Environment variables

```bash
vercel env ls                          # list env vars for the linked project
vercel env add MY_VAR production       # add a var, prompts for the value
vercel env rm MY_VAR production        # remove a var
vercel env pull .env.local             # export env vars to a file for local tools (next dev, etc.)
```

`vercel env pull [file]` is the command for getting env vars into a file your app actually reads (`.env`/`.env.local`); re-run it after any change made via the dashboard, `vercel env add`, or `vercel env rm`. To run a command with env vars without writing them to a file, use `vercel env run -- <command>`.

This is distinct from `vercel pull` (see below), which is only needed if you use `vercel build`/`vercel dev`.

## Project/build/dev cache: `vercel pull`

```bash
vercel pull                            # cache project settings + env vars under .vercel/.env.$target.local
vercel pull --environment=preview      # same, for a specific target environment
```

`vercel pull` is **not** the env-var-to-file command — it stores a local cache under `.vercel/` purely so `vercel build` and `vercel dev` can run offline against current project settings and env vars. If you aren't using `vercel build`/`vercel dev`, you don't need `vercel pull`; use `vercel env pull` above instead. Re-run `vercel pull` whenever env vars or project settings change on Vercel.

Both `vercel env pull` output and `.vercel/.env.$target.local` cache files are secret material: verify they are ignored, and never commit or print them.

## Configuration: `vercel.json`

Project root, optional — most settings have sane framework defaults. Common fields:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }]
}
```

See [[vercel/doc-references]] for the full Project Configuration reference — most fields are optional overrides, not required boilerplate.

## Project linking and team scope

- `vercel link` connects the current directory to a Vercel project, writing `.vercel/project.json` (project ID + org/team ID). Most commands without an explicit target operate on this linked project — `vercel pull`/`vercel env`/`vercel logs` all read it.
- In CI or a fresh checkout there is no `.vercel/` directory yet; either run `vercel link --yes` first or pass `--cwd`/explicit flags so the command isn't ambiguous about which project it targets.
- Team-owned resources: pass `--scope <team-slug-or-id>` on CLI commands, or append `?teamId=<id>` on REST API calls (see [[vercel/api-access]]).

## Discovering commands

`vercel <command> --help` is exhaustive and current. Full command list and flags: <https://vercel.com/docs/cli>.
