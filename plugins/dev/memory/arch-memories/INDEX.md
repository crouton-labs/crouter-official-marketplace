---
kind: knowledge
when-and-why-to-read: When a repository's memory store holds gotchas but no pre-computed cross-cutting understanding — agents re-derive end-to-end flows, ownership boundaries, or product rationale every session — this knowledge should be read because building the corpus through its phased process lands ~dozens of interlocking documents that stay consistent, instead of an ad-hoc pile that drifts in shape and duplicates the gotchas it should frame.
short-form: The architecture-memory corpus — three document classes (arch/ slices, patterns/, product/) and the phased process that builds one for a repository.
rationale: "This process was developed live on two large repositories and its calibration points (owner-approved tree, representative round before fan-out, the surprise bar) each exist because skipping them produced rework: unapproved trees got restructured, and the first drafts written before the inclusion bar was calibrated needed line-by-line cuts."
---

# Architecture memories

A repository store rich in incident and gotcha memories still leaves every agent to re-derive the expensive understanding: how a system works end to end, which truths only appear from reading every path, and why the product needs it shaped this way. An architecture-memory corpus pre-computes that understanding as three document classes:

| Class | Dir | Lens | Example question it answers |
|---|---|---|---|
| Slices | `<ns>/arch/` | vertical, engineering | "How does auth work end to end?" |
| Patterns | `<ns>/patterns/` | horizontal, engineering | "What does the daemon own, across every path to it?" |
| Product | `<ns>/product/` | business/user | "What is this feature for, and what must the architecture support?" |

Plus one light `glossary` doc per repo (term → one-sentence meaning → owning dir), because cross-cutting questions stall on vocabulary before structure.

Document shapes and the inclusion bar: [[dev/arch-memories/template]]. Surface/gating conventions: [[dev/arch-memories/gating]]. Keeping the corpus current: [[dev/arch-memories/maintenance]].

## Placement rules

- A slice that outgrows one doc nests into a directory, the main doc as the directory's document and depth leaves beneath it.
- Major slices get a paired `product/` doc only when the product story is rich; a thin story folds into the slice's orientation paragraph. Slice and product doc cross-link.
- A topic spanning two repositories lives in the store of the repo that drives the seam, with a name-level pointer doc in the other store — profile scope would hide it from anyone working the repos under another profile.
- Existing memories the corpus subsumes are moved or absorbed at write time, never left beside their replacement.

## The process

1. **Chart.** Explore orchestrators map the repository into candidate topics — per candidate: scope, dir/file anchors, and overlap with every existing memory. The chart is evidence, not the corpus.
2. **Propose the tree.** One artifact: the full tree with a one-liner per doc, the merges/retirements of existing memories, and the founder-input questions the product docs need. The owner approves names and structure before anything is written.
3. **Representative round.** Write ONE memory, iterate with the owner, and fold every correction into [[dev/arch-memories/template]] rather than leaving it conversational. Then 2–4 more representatives covering the other classes. This round is where the inclusion bar gets calibrated cheaply; fan-out is where a miscalibration gets expensive.
4. **Interview once.** Product docs need founder input; batch every open question into one short interview, never per-doc asks.
5. **Fan out.** Writer nodes fill the tree, each briefed with its chart entry, the scout evidence, and the template/gating docs. Then the glossary, a corpus-wide `crtr memory lint`, and a pointer from the repo's front door to the new trees.
