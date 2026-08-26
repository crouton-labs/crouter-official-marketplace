---
kind: knowledge
when-and-why-to-read: When you are about to write or revise a memory under a repository's arch/, patterns/, or product/ tree, this knowledge should be read because docs written without it get cut or rewritten at review, and per-author drift destroys the predictable shape that lets a reader skim any slice the same way.
short-form: "Section shapes for slice/product/pattern memories + the inclusion bar: every sentence must surprise an agent."
---

# Architecture-memory template

Shapes for the three classes of architecture memory (`arch/` slices, `patterns/`, `product/`). Sections are the default shape, not a form: drop a section with nothing load-bearing in it.

## The inclusion bar

**Every sentence must be surprising to an agent that can see the repo.** Cut anything inferrable from the repo layout, from another sentence in the same doc, or from a linked memory. Corollaries:

- Prose never restates the mermaid diagram or pre-states the invariants section; it carries only what the diagram cannot.
- An invariant whose depth lives in a linked gotcha memory gets one naming clause; the link carries the depth.
- Dirs and files, never line numbers. No flag lists or API detail that drifts — point at the owning file.
- No implementation history, no open bugs (the tracker owns those), no speculation — prescriptive/descriptive only.
- If 2–3 files answer the question, it belongs in a targeted gotcha memory or the code, not here.

## Slice memory (`arch/`)

1. **Orientation** — one paragraph: what the system does and the business reason it exists. A slice with a thin product story folds its rationale here instead of getting a paired `product/` doc.
2. **The path** — the end-to-end flow as a mermaid diagram; each stage names its owning package/dir.
3. **Ownership map** — table: stage → owning dir → entry-point file(s). This is also the drill-in surface: a load-bearing pointer with no path stage (a schema, a config file) gets its own row, never a separate pointer section.
4. **Invariants and why** — cross-cutting truths you only learn from reading everything; each carries why this shape won, inline.
5. **Edges** — `[[links]]` to adjacent slices and to the gotcha memories that live on this slice, each with a 2–4-word hint of what it holds.

## Product memory (`product/`)

1. **The bet** — why this exists, in user terms.
2. **What it must support** — the product requirements the architecture answers to.
3. **Ideal** — the target experience.
4. **Today** — where the product actually is; rewrite in place as it moves.
5. **Implications** — what the gap means for engineering priorities.
6. **Pointers** — where this manifests in the repo, plus the paired `arch/` slice when one exists.

## Pattern memory (`patterns/`)

1. **The principle** — one paragraph.
2. **Why this shape won** — reasoning visible only from the whole graph.
3. **The map** — every site where the pattern shows up, as dirs/files.
4. **Compliance** — what to do when adding code that touches this.

## Terminology

ASD-STE100-leaning: one meaning per word, the same term every time, a term defined at first use or in the repo's `glossary` doc, no coined shorthand. Add or revise a glossary term whenever a memory would otherwise use it undefined.
