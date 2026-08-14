---
kind: knowledge
when-and-why-to-read: "When reconciling a repository for development work — through /dev:init or after finding a partial setup — this knowledge should be read because every future change otherwise begins with rediscovery and risks running in the wrong checkout or against colliding services."
short-form: "Reconcile the repository memory, Grove contract, project /dev intent front door, machine registration, and live lifecycle proof."
system-prompt-visibility: name
file-read-visibility: none
slash: true
rationale: "Unguided initialization produced either no project front door or a monolithic manual, while separate memory and lifecycle setup left repositories half-ready. The generated /dev command then covered only current-stack operation, forcing developers to translate new isolated feature work into Grove and node mechanics themselves."
---

# /dev:init — reconcile this repository for development

Give the source repository its two durable halves: a lean memory front door, and one Grove-backed development path whose project `/dev` command understands the developer's intent while live CLI help owns mechanics. Treat existing files and registration as input, not as a reason to stop. Add or repair only what is missing or incorrect, update owned files in place, and never leave a wrapper, duplicate script, or competing configuration behind.

First confirm the source repository. If the current directory is a planted instance, resolve its registered source and perform repository setup there; instance checkouts inherit the source contract and are never setup targets. If the directory plainly is not the repository the user named, stop and ask one focused question.

## 1. Inspect and classify

Survey the README, package manifests and lockfiles, build and CI configuration, existing scripts, `.crouter/memory/`, `.grove/`, and CLAUDE.md or AGENTS.md. Extract the real setup, run, build, targeted-test, and verification commands, and run the important ones before recording them. Note the architecture and the conventions a competent agent would otherwise guess incorrectly.

Require Grove, then read `grove setup -h`. Use the native setup surface to distinguish the repository contract from this machine's registration. A valid contract may be registered and verified immediately. A missing or invalid contract requires repository authoring below. Preserve a legacy machine registration that has no repository contract until the user approves an explicit migration; never infer or silently export it.

Before creating a repository contract or materially changing existing lifecycle behavior, show the user the concrete proposed files and responsibilities. Filling a missing machine registration from an already-valid contract needs no second confirmation because invoking `/dev:init` already requested reconciliation.

## 2. Author the memory front door

Run `crtr memory write -h` before creating or revising memory. Keep the root INDEX well under lint's cap:

- **Project in one paragraph** — purpose, major components, dependency direction.
- **Common commands** — the 3–8 verified commands most changes need.
- **Where to work** — a task-to-path map; mark generated or externally owned areas.
- **Non-default rules and gotchas** — only high-impact deviations from defaults; point at enforcing checks instead of restating them.
- **Done** — the minimum credible gate for an ordinary change.
- **Pointers** — one `[[link]]` per deeper subject with a one-clause read trigger.

Exclude generic framework advice, copied documentation, volatile version detail, and multi-step procedures. Reference documents take `none` visibility on both axes; the INDEX links are how they are found.

## 3. Author the repository-owned Grove contract

Read the repository contract from `grove setup -h`; do not reproduce its schema here. Create or update only the artifacts this repository needs:

- **`.grove/config.json`** declares Grove concerns such as repositories, ports, lifecycle executables, setup, secrets, and state. It contains no process supervision or health policy.
- **The configured development executable** is the sole deterministic lifecycle CLI for one source or instance. Locate the dev plugin's shipped `templates/dev.sh` through the plugin inspection help, adapt it to the repository's real services, and keep its live `-h` truthful. Preserve the stable start, stop, restart, status, logs, logpath, and doctor meanings when they apply.
- **Setup, teardown, state, and secret scripts** exist only when the project needs those protocols. They are executable, repository-owned, and contain no competing lifecycle path.

Honor Grove's resolved context and ports so simultaneous instances remain isolated. Update a valid existing contract surgically; never replace it with a generic template.

## 4. Author the project `/dev` intent front door

Create or update `.crouter/memory/dev.md` as a project memory document with `slash: true`. Its routing line names the consequence of reading it rather than summarizing its contents; for this surface, the relevant consequence is that work begun in the wrong checkout or data state becomes disposable even when the implementation itself is correct.

The document treats `$ARGUMENTS` as the developer's desired outcome and gives the agent this decision framework:

- **Work in the current source or instance** — operate, inspect, or troubleshoot the current development environment. Read `dev -h`, then use the bare `dev` lifecycle rather than restating its grammar.
- **Resume isolated work** — inspect existing Grove instances and continue in the one that matches the request rather than planting a duplicate.
- **Start distinct work in a fresh Grove** — for a new feature, fix, experiment, or explicit request for isolation, read `grove plant -h`; resolve code provenance and data state separately; choose a meaningful instance name; plant the instance; then carry the full original request into a working node rooted in that checkout and begin there. Never stop after merely reporting the new path. Start services only when the work needs them.

When no base is named, use Grove's configured-code and baseline-state defaults. When “based on X” could mean either code or data and inspection does not settle it, ask one focused clarification. If the user explicitly requests a fresh Grove but Grove is unavailable or the source is not ready, point to `/dev:init` and the native setup recovery; never substitute another isolation mechanism silently.

The `/dev` document owns intent recognition, pathway selection, project-specific evidence, and diagnostic ordering. It contains no exact Grove, dev, git, or crouter invocations: the selected branch or leaf's live `-h` owns mechanics and effects. Split lengthy project-specific operations into linked reference documents rather than turning `/dev` into a manual.

## 5. Reconcile and prove

Run the native Grove setup command against the source after repository files are settled. Resolve every reported contract, registration, or health failure before continuing.

When lifecycle behavior was created or changed, prove the chain end to end: the bare command's help reaches the repository executable; doctor is read-only; the default start path serves on the resolved ports; status and a direct probe agree; stop releases the services and listeners; and the user's desired running state is restored afterward. An unchanged, already-proven lifecycle does not need a destructive replay merely because `/dev:init` ran again.

Run `crtr memory lint` and fix findings in the files this invocation owns. End with the separate repository, machine, and health status plus the next useful development action.
