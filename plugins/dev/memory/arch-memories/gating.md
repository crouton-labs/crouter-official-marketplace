---
kind: knowledge
when-and-why-to-read: When you are setting the surfaces frontmatter on a new arch/, patterns/, or product/ memory, this knowledge should be read because routing decided per-doc from scratch lands inconsistently, and every misplaced entry is paid by all future agents at every boot or file read.
short-form: Default surface entries per architecture-memory class — slices and patterns fire on reads in their territory; product context rides boot for the kinds that shape work.
---

# Architecture-memory gating

Defaults per class; each memory tunes its own globs to the dirs it actually crosses.

| Class | read-routed | boot |
|---|---|---|
| Slices (`arch/`) | `{on: read, match: [globs of the dirs the slice crosses], at: preview}` | `{on: boot, at: name, gate: {kind: [explore, design, plan, advisor]}}` |
| Product (`product/`) | — | `{on: boot, at: preview, gate: {kind: [spec, design]}}` + `{on: boot, at: name}` for everyone |
| Patterns (`patterns/`) | `{on: read, match: [the pattern's sites], at: preview}` | `{on: boot, at: name, gate: {kind: [developer, design, plan, explore]}}` |

Why this split: business context is cheapest and most valuable at boot for the kinds that shape work, while engineering slices are most valuable exactly when an agent's file reads enter their territory. Every kind still reaches everything by name/listing, and an explicit `crtr memory read` always returns the full body. Directory listings add free discovery: reading any one slice exposes its siblings' routing lines.

Depth leaves under a nested slice get **no surfaces at all** — the main doc's links and the listing route them, and any entry would double-charge every boot for depth the graph already routes.
