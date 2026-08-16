---
kind: knowledge
when-and-why-to-read: When you need to launch, deploy, check status, stream logs, or manage secrets/Machines for a Fly.io app, this doc should be read because it is the end-to-end flyctl setup — install, auth (interactive vs headless), verify, the common launch/deploy/status/logs/secrets/machine commands, and fly.toml/destructive-operation caveats.
short-form: flyctl end-to-end — install, auth (fly auth login vs FLY_API_TOKEN), fly launch/deploy/status/logs/secrets/machine, fly.toml, regions, destructive-op caveats.
---

# flyctl setup

`flyctl` (the `fly` command) is Fly.io's CLI — app-aware, reads `fly.toml` in the working directory by default.

## Install

```bash
brew install flyctl                  # Homebrew (macOS/Linux)
curl https://fly.io/install.sh | sh  # official install script (Linux/macOS)
fly version                          # verify
```

## Authenticate

- **Interactive (your machine):** `fly auth login` — opens a browser for OAuth. **Does not work headless.**
- **Headless / agent / CI:** set `FLY_API_TOKEN` (flyctl also accepts the alias `FLY_ACCESS_TOKEN` for the same value — either works) as an environment variable. It takes precedence over any cached `fly auth login` session for every command, so don't mix a token env var with a separate logged-in identity on the same machine unless you mean to.
  - **Deploy token (single app, the default for CI):** `fly tokens create deploy -a <app> -x 720h` (`-x` sets expiry; defaults to 20 years if omitted — always set a short one for CI).
  - **Org token (multi-app pipelines):** `fly tokens create org -o <org> -x 720h`.
  - **SSH-only / machine-exec tokens:** narrower scopes for one specific action — see `fly tokens create --help`.
- **Verify:** `fly auth whoami`, or list active tokens with `fly tokens list`.

## Launch, deploy, status, logs

```bash
fly launch                          # scaffold a new app + fly.toml interactively, optionally deploy
fly deploy                          # build and deploy the app in the current directory
fly deploy --remote-only -a <app>   # build on Fly's remote builder (no local Docker needed) — typical for CI
fly status -a <app>                 # app + Machine status
fly logs -a <app> --follow          # stream logs
```

## Secrets

```bash
fly secrets import -a <app>  # read NAME=VALUE pairs from stdin; triggers a new deploy to apply them
fly secrets list -a <app>    # list secret names (values are never shown back)
```

Provide secret values through a secret-aware stdin source; do not put real values in command text, shell history, or logs. Secrets are **not** stored in `fly.toml` — they're encrypted and injected as runtime environment variables. Don't try to "configure" them in the toml file.

## Machines

```bash
fly machine list -a <app>                          # list Machines for an app
fly machine status <machine-id> -a <app>            # one Machine's detail
fly machine exec <machine-id> "<command>" -a <app>  # run a command on a specific Machine
```

## Configuration: `fly.toml`

Project root. flyctl looks for it in the current directory by default; override with `-c <path>` or set the app explicitly with `-a <app>` (otherwise the toml's `app` key wins).

```toml
app = "my-app"
primary_region = "ord"        # three-letter region code — see [[fly/doc-references]]

[env]
PORT = "8080"

[http_service]
internal_port = 8080
force_https = true
auto_stop_machines = "stop"
min_machines_running = 1

[[mounts]]
source = "data"
destination = "/data"
```

`fly.toml` is meant to be human-authored and reviewed — don't regenerate or overwrite it wholesale without checking what was already there; `fly launch` and most config commands merge into the existing file.

## Caveats

- **Regions are three-letter codes** (`ord`, `sfo`, `lax`, `lhr`, ...) — see [[fly/doc-references]] for the full list; don't guess.
- **Destructive operations are immediate** — `fly apps destroy`, `fly machine destroy`, `fly volumes destroy` have no built-in backup/undo. Confirm with the user before running them, or pass `--yes`/`-y` only once you mean it.
- **Mixed Machines API + flyctl:** if you create or modify Machines directly via the API and then want `flyctl` to manage them, set the metadata `fly_platform_version=v2` and `fly_process_group=<name>` on the Machine — otherwise flyctl may not recognize it as part of the app's managed fleet.

## Discovering commands

`fly help` and `fly <command> --help` are exhaustive and current. Full reference: <https://fly.io/docs/flyctl/>.
