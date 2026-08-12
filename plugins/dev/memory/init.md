---
kind: knowledge
when-and-why-to-read: "When setting up a repository for development work — the user invoked /dev:init, or a workspace has no .crouter/memory/INDEX.md front door — this knowledge should be read because one pass produces both halves agents need here forever: a lean memory front door, and a registered Grove-backed `dev` lifecycle whose live help replaces instructions that would otherwise go stale."
short-form: "Initialize a repository: survey it, author the lean INDEX front door and dev runbook, and stand up the Grove-backed `dev` lifecycle — config, dev.sh from the shipped template, registration, and proof."
system-prompt-visibility: name
file-read-visibility: none
slash: true
rationale: Unguided agents bootstrap project memory badly in both directions — no front door, or a monolithic CLAUDE.md-style manual that taxes every session and decays (distilled 2026-07-31 from ecosystem research; strongest evidence Sentry's consolidation postmortem and Anthropic's under-200-line target). Originally two commands, /init (memory) and /dev:repo-setup (Grove stack); Silas merged them 2026-08-12 — the plugin already requires Grove, so initializing a repo without its lifecycle half left the job half-done and the pair drifted.
---

# /dev:init — initialize this repository for development

Give this repository its two working halves: a memory front door every future agent boots with, and one registered `dev` lifecycle path — Grove resolves the current source or instance, and a repository-owned executable does the work. Inspect whatever already exists (`.crouter/memory/`, `.grove/`, lifecycle scripts, CLAUDE.md/AGENTS.md) and update it in place; never leave a wrapper, duplicate script, or competing config behind.

## 1. Survey before writing

Learn the project from its own artifacts: README, package manifests and lockfiles, build/CI config, scripts, existing docs. Extract the real commands (setup, run, build, targeted test, full verification) and RUN the important ones — record only commands you have seen work. Note the architecture in a few sentences and collect the conventions that differ from what a competent agent would assume — those deviations are the highest-value lines you will write.

## 2. Author the memory front door

Run `crtr memory write -h` first — it carries the substrate frontmatter contract and the exact root-INDEX shape that `crtr memory lint` validates. Then author the INDEX, total well under lint's cap:

- **Project in one paragraph** — purpose, major components, dependency direction.
- **Common commands** — the 3–8 commands most changes need, copyable, verified.
- **Where to work** — a task-to-path map; mark generated or externally-owned areas.
- **Non-default rules and gotchas** — only high-impact deviations from defaults; point at enforcing checks instead of restating them.
- **Done** — the minimum credible gate for an ordinary change.
- **Pointers** — a `[[link]]` per deeper doc with a one-clause read trigger.

Exclude generic language/framework advice, copied docs, volatile version detail, and multi-step procedures — depth belongs behind links. Reference docs take `none` visibility on both axes; the INDEX's links are how they are found.

## 3. Stand up the Grove lifecycle

Four artifacts, each created or updated in place:

**`.grove/config.json`** — version 1, with `devCommand` naming the target-root-relative lifecycle executable (`scripts/dev.sh` for a single repository; a nested path only in a composite workspace). Declare `ports` so planted instances get non-colliding offsets. Keep only declarative Grove concerns here — no supervision, health policy, or lifecycle logic.

**`scripts/dev.sh`** — the repository-owned CLI. Start from the template the plugin ships: run `crtr pkg plugin show dev` for the plugin path and copy its `templates/dev.sh`, then replace the SERVICES table and start commands with this repository's real ones, keeping the verb set (start/stop/restart/status/logs/logpath/doctor) and honoring `GROVE_SLOT` / `GROVE_PORT_<NAME>` so instances coexist. Its `-h` is the authoritative grammar — never duplicate that help in memory. Grow it toward the repository's needs; the template is a floor, not a schema.

**`.grove/setup.sh`** — only when instance preparation needs imperative steps config cannot express. Executable, idempotent, no lifecycle behavior.

**`.crouter/memory/dev.md`** — the project `/dev` runbook, with valid frontmatter and `slash: true`. It carries judgment: when to reach for the lifecycle, what outcome each operation pursues, repository-specific evidence and recovery ordering. It invokes bare `dev` so Grove selects the current source or instance, and refers to `dev -h` for exact syntax.

## 4. Register and prove

```sh
grove register <source> --update
grove doctor
```

Resolve any failure before continuing. Then prove the chain end to end:

1. `dev -h` returns the repository CLI's live help, not Grove's or the plugin's.
2. `dev doctor` is read-only against recorded process state.
3. The no-argument start path brings the default services up; `dev status` and a direct probe confirm they serve.
4. `dev stop` releases the services and their listeners; restore the user's desired state afterward.

When a proof fails, fix the artifact that owns that behavior and re-prove — never add another lifecycle path around it.

## 5. Validate the store

Run `crtr memory lint` and fix findings rather than suppressing them. The store is a living contract: when commands, architecture, or conventions change, rewrite the affected doc in place and delete superseded guidance.
