---
kind: knowledge
when-and-why-to-read: When building a repository development CLI and its companion runbook, this knowledge should be read because keeping lifecycle mechanics with the repository and agent judgment in memory gives every initialized checkout one current interface without duplicate help drifting apart.
short-form: Split a repository development CLI from its memory runbook: mechanics, routing, and Grove-backed instance dispatch.
system-prompt-visibility: preview
file-read-visibility: none
slash: true
---

# CLI + memory runbook partnership

A repository development CLI and its memory runbook have distinct jobs. Keep deterministic mechanics in the repository and route judgment through memory so each remains current without copying the other.

## The split

**The repository CLI** owns deterministic mechanics and its `-h` surface: its grammar, lifecycle effects, exit codes, output for scripting, and repository-specific defaults. `scripts/dev.sh` is the usual implementation. It can start and stop services, probe readiness, render logs, and perform other repeatable work because it lives with the repository's configuration and assumptions.

**The memory runbook** owns judgment and routing: when to invoke the CLI, what outcome is needed, project-specific operating knowledge, diagnostic ordering, and the decision to start, stop, inspect, or repair. It invokes the CLI but does not reimplement its mechanics.

The CLI's help is the live command contract. Never copy its help text, grammar, flags, or option inventory into memory. When exact invocation syntax matters, run `dev -h` in the target repository.

## The workflow front door

The workflow plugin supplies the bare `dev` command. It contains no lifecycle behavior: it forwards directly to `grove dev`, which resolves the active registered source or instance and dispatches the repository's configured `devCommand`.

This gives agents one stable command while preserving repository ownership of behavior:

- The plugin owns the bare `dev` name.
- Grove owns source or instance resolution, slots, ports, registration, and dispatch.
- The repository owns `.grove/config.json`, its development CLI, and its process/liveness implementation.
- The repository's `.crouter/memory/dev.md` owns operating judgment and repair guidance.

Run `dev -h` rather than documenting a second command surface. Its output comes from the current repository CLI through Grove, including when called from a planted instance.

## Keeping the pair in sync

1. Keep all deterministic behavior, flags, and help in the repository CLI.
2. Keep the runbook focused on triggers, effects, diagnostic evidence, and repository-specific ordering.
3. Update memory when the meaning or appropriate use of an operation changes, not merely when the CLI gains a flag.
4. Put only examples that agents should execute in the runbook, and verify them against the live CLI.
5. Use the bare `dev` command in an initialized repository so Grove selects the correct source or instance context.

## Choosing the owner

A repository-owned script belongs in the repository when it depends on that repository's services, configuration, ports, build steps, or process supervision. A plugin-owned bare binary belongs outside repositories when it supplies one generic front door across projects. Grove connects the two; it is not a second process manager or a place to encode framework lifecycle policy.

Do not add a fallback script, a second lifecycle wrapper, or copied command help beside an existing Grove or development arrangement. Update the existing path in place.

## Checklist

- [ ] The repository development CLI owns its help and deterministic lifecycle behavior.
- [ ] The workflow plugin's `dev` command remains only a Grove dispatch front door.
- [ ] `.grove/config.json` names the repository's executable `devCommand`.
- [ ] The repository `/dev` memory document invokes `dev` and carries judgment rather than shell mechanics.
- [ ] `dev -h` is treated as authoritative instead of copied into memory.
- [ ] The source or instance is registered with Grove before the command is used.

Use `/repo-setup` to establish or update this arrangement in a repository.
