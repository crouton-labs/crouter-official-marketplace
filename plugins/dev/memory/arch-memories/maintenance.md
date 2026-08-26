---
kind: knowledge
when-and-why-to-read: When a change you are landing alters the flow, ownership, or invariants of a system covered by an arch/, patterns/, or product/ memory, this knowledge should be read because a covered doc left stale keeps steering every future reader toward the shape the code no longer has — worse than no doc at all.
short-form: Update the covered slice in the same pass as the code change; rewrite in place; the bar for a new slice is a distinct read trigger plus a topic 2–3 files cannot answer.
---

# Architecture-memory maintenance

- **Same pass, not a follow-up.** When a change alters a covered system's flow, ownership, or invariants, update the slice in the same pass as the code change — the edit rationale carries the history.
- **Rewrite in place, never append.** Each doc is a living statement of what is true now; superseded text beside new text steers readers wrong.
- **Dirs before files, never line numbers.** Pointers that survive refactors.
- **`crtr memory lint`** after edits.
- **State machines.** When a machine's state space, transition, guard, durable write, recovery path, or derived projection changes, rewrite its owner memory in the same pass and run `crtr memory lint`; change a cross-linking memory only when its stated boundary changes.
- **The bar for a new slice** is a distinct read trigger plus a topic 2–3 files cannot answer; otherwise expand an existing doc. A slice that outgrows one doc nests into a directory instead of becoming a scroll.
- **Glossary upkeep** — add or revise a term whenever a memory introduces one; entries stay one sentence.
- **`product/` docs' Today section** is rewritten as the product moves; a stale Today silently reframes the Implications.
