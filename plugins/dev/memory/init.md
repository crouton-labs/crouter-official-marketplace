---
kind: knowledge
when-and-why-to-read: When bootstrapping a project's memory store — the user invoked /dev:init or a workspace has no .crouter/memory/INDEX.md front door — this knowledge should be read because a lean routed front door gives every future agent in that workspace its operating contract for a fraction of the standing context cost an unstructured guidance dump would charge each session forever.
short-form: "Bootstrap a project memory store: survey the repo, then author a lean INDEX front door plus a linked dev doc — commands, map, non-default rules, pointers — and lint. Depth splits into linked docs; every always-loaded line must earn its keep."
system-prompt-visibility: none
file-read-visibility: none
slash: true
rationale: Unguided agents bootstrap project memory badly in both directions — either no front door at all, or a monolithic CLAUDE.md-style manual (copied README, generic framework advice, exhaustive command catalogs) that taxes every future session and decays. Distilled 2026-07-31 from ecosystem research across Anthropic/OpenAI/Cursor/GitHub guidance and production AGENTS.md files — the strongest evidence being Sentry's consolidation postmortem (critical commands buried in nested files got missed) and Anthropic's under-200-line target with adherence falling as always-loaded files grow.
---

# /dev:init — bootstrap this project's memory store

Give this workspace its memory front door: a root INDEX every future agent boots with when the project mounts, plus a small graph of linked docs carrying the depth. The front door is an operating contract and routing layer, never a manual — every line it carries is paid by every session here forever, so a line earns its place only by changing behavior: a fact every task needs, a non-obvious hazard, or a rule an agent would otherwise get wrong.

## 1. Survey before writing

Learn the project from its own artifacts: README, package manifests and lockfiles, build/CI config, scripts, existing CLAUDE.md/AGENTS.md or docs. Extract the real commands (setup, run, build, targeted test, full verification) and RUN the important ones — record only commands you have seen work, with any required ordering, environment, or package-manager constraint. Note the architecture in a few sentences: major components, dependency direction, where generated or externally-owned code lives. Collect the conventions that differ from what a competent agent would assume — those deviations are the highest-value lines you will write.

## 2. Read the contract, then author the front door

Run `crtr memory write -h` first — it carries the substrate frontmatter contract and the exact root-INDEX shape, including the workspace-mount route that `crtr memory lint` validates. Then author the INDEX with these sections, total well under the length lint's cap:

- **Project in one paragraph** — purpose, major components, dependency direction.
- **Common commands** — the 3–8 commands most changes need, copyable, verified.
- **Where to work** — a task-to-path map; mark generated or externally-owned areas.
- **Non-default rules and gotchas** — only high-impact deviations from defaults. Skip anything a formatter, linter, or typechecker already enforces; point at the check instead.
- **Done** — the minimum credible gate for an ordinary change.
- **Pointers** — a `[[link]]` per deeper doc with a one-clause read trigger (e.g. "debugging the daemon → the dev doc").

Exclude generic language/framework advice, copied docs or style guides, volatile version detail, rare edge cases, and multi-step procedures — depth belongs behind links, not in the standing load.

## 3. Split depth into linked docs

Author `dev` alongside the INDEX by default: validated setup/run/build/test/debug commands with required order and environment, targeted-vs-full verification, and common failure modes. When the repository needs an actual lifecycle CLI behind that runbook, invoke `/dev:create-workflow`. Add `architecture` only when the tree cannot be understood from the INDEX's brief map, and a conventions/gotchas doc only once real project-specific rules outgrow a few INDEX bullets — never pre-populate generic security or style manuals. These reference docs take `none` visibility on both axes; the INDEX's links are how they are found, so they cost nothing until followed.

## 4. Validate

Run `crtr memory lint` — it strict-parses the store, checks the INDEX front-door contract, and fails on dangling links or over-length bodies. Fix findings rather than suppressing them. The store is a living contract: when commands, architecture, or conventions change, rewrite the affected doc in place and delete superseded guidance — an always-loaded line that has stopped being true is worse than no line at all.
