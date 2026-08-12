---
kind: knowledge
when-and-why-to-read: When you need to establish or update a repository's Grove-backed development workflow, this knowledge should be read because it turns the repository's existing lifecycle arrangement into one registered, instance-aware `dev` path without leaving competing setup or service-control paths behind.
short-form: Set up or update a repository's Grove-backed `dev` workflow: config, setup, lifecycle CLI, `/dev` runbook, registration, and proof.
system-prompt-visibility: name
file-read-visibility: none
slash: true
---

# Set up a repository development workflow

Set up one coherent development path: the workflow plugin exposes `dev`, Grove resolves the current registered source or instance, and the repository's configured CLI performs lifecycle work. Work from the repository root and update any existing Grove or development arrangement in place; do not leave a wrapper, duplicate script, or parallel config behind.

## Inspect before changing

Identify the repository root and read its current `.grove/config.json`, `.grove/setup.sh`, lifecycle scripts, process configuration, and `.crouter/memory/dev.md`. Inspect how the repository currently starts services, selects ports, records logs, checks liveness, and performs setup. Preserve working repository-specific behavior while consolidating it into the four artifacts below.

Decide the default service group from the repository's actual development loop. Identify which setup actions are declarative Grove configuration and which require an executable script. Do not infer a lifecycle interface that the existing services cannot support.

## Create or update the four artifacts

### 1. `.grove/config.json`

Create or update the existing version 1 config in place. Preserve its valid ports and declarative instance setup, and add or correct `devCommand` to the target-root-relative executable that owns this repository's development lifecycle. Use `scripts/dev.sh` for a single repository and a nested path only when the repository is a composite workspace whose lifecycle command lives there.

Keep only declarative Grove concerns in this file. Do not encode process supervision, service health policy, command help, or lifecycle implementation in the config.

### 2. `.grove/setup.sh`

Create or update the setup script only for instance preparation that `.grove/config.json` cannot express. Make it executable and idempotent. Keep service lifecycle behavior out of it. If existing setup logic is declarative, remove it from the script and retain it in config; if it is required imperative preparation, retain it in the existing script rather than creating a second setup path.

### 3. `scripts/dev.sh`

Create or update the repository-owned executable in place. It implements the shared development operations: idempotent default or named-service startup and shutdown, restart, read-only status and diagnosis, bounded or followed service logs, and authoritative log-location output. The repository decides its default services and any additional operations.

Keep process supervision, readiness checks, build requirements, logs, and repair mechanics here. Its own `-h` output is the authoritative grammar and description of those operations; do not duplicate that help in this runbook or elsewhere.

### 4. `.crouter/memory/dev.md`

Create or update the project `/dev` runbook in place. Give it valid memory frontmatter and slash invocation. It tells agents when to use the development path, which outcome to pursue, what repository-specific evidence to inspect, and the required recovery ordering. It invokes bare `dev` so Grove selects the current source or instance. It refers agents to `dev -h` for exact syntax instead of copying command help.

## Register and prove the workflow

Register the source with Grove, updating the existing registration rather than making a second project entry:

```sh
grove register <source> --update
```

Pass Grove's config-path option when this repository's config is not in its default location. Run `grove doctor` and resolve any registration or config failure before continuing.

Then prove the installed front door reaches the repository CLI and the lifecycle behaves as designed:

1. Run `dev -h` and confirm it is the repository CLI's live help, not plugin or Grove-authored help.
2. Record the current process and listener state, then run `dev doctor`; confirm diagnosis is read-only.
3. Run the no-argument start path, then use `dev status` and direct repository probes to confirm the intended default services are ready.
4. Run `dev stop`, confirm the intended services and listeners are released, then restore the user's desired development state.
5. If the repository supports named service groups, prove the same start, status, and stop cycle for a representative named subset.

When an existing workflow fails a proof, fix the existing artifact responsible for that behavior and repeat the proof. Do not solve it by adding another lifecycle path.

## Completion check

The repository has exactly one registered Grove configuration, one repository-owned development CLI named by `devCommand`, and one `/dev` runbook. The bare `dev` command routes correctly from the source and any planted instance, and `dev -h` remains the sole command reference.
