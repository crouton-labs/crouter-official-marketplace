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

## State-machine body shape

This selectable body form applies inside the existing `arch`, `patterns`, and `product` classes when the answer depends on enumerated states, events, and recovery boundaries. It is not a fourth class, taxonomy, frontmatter kind, directory, or gating regime. Choose placement by the reader's existing routing question, then choose this form; it refines the selected class shape without removing any of its required artifacts. An `arch` memory keeps Orientation, the Mermaid The path diagram, Ownership map, Invariants and why, and Edges; a `patterns` memory keeps The principle, Why this shape won, The map, and Compliance; a `product` memory keeps The bet, What it must support, Ideal, Today, Implications, and Pointers.

Add these artifacts in this order within and alongside the selected class sections:

1. **Boundary and state space** — State the machine's purpose and authoritative store or process boundary. Include a state/axis legend whose rows name the value set, durability (`durable`, `ephemeral`, or `derived`), authoritative writer, and meaning. Keep independent facts as separate axes; never present a derived condition as stored state.
2. **The path and transitions** — An `arch` memory retains its Mermaid The path diagram, then includes one complete transition table for meaningful normal, failure, cancellation, expiry, and recovery events. A `patterns` memory puts the same table in The map; a `product` memory uses it only when product state is the subject. Each row gives event, source state or predicate, target state or predicate, guard, authoritative transition writer, durable write, and post-commit effect. Include a self-transition only when it changes a durable value, retry budget, or recovery entitlement. The diagram and table carry different information; neither repeats the other.
3. **Invariants, guards, and ownership** — Use `arch`'s Invariants and why, `patterns`' Why this shape won and The map, or the relevant product sections to identify admitting, refusing, deferring, or rerouting predicates; their owning directories and entry-point files; the authority that decides them; and why lower-level setters or helpers are not a second policy door. Keep the required ownership map and state why each non-obvious invariant exists.
4. **Durable writes and effects** — Map the commit boundary for every state-changing event and effects that occur only after it. Name atomic multi-field exceptions, durable episode or latch records, external prompts or broker actions, and the authoritative result when an effect is interrupted.
5. **Recovery and re-entry** — Include a table for crash, retry, credential reload, restart, expiry, and ordinary-input paths that apply. Each row names the re-entry predicate, preserved and consumed durable facts, and the idempotence or compare-and-swap boundary preventing replay. Label process-local state as ephemeral and state its replacement outcome rather than treating it as recoverable durable state.
6. **Derived projections and compliance** — Map predicates, glyphs, scheduling decisions, and user-visible labels derived from the state or axes. Name the shared projection owner and forbid consumers from inventing a competing status; a `patterns` memory carries its required Compliance conclusion here.
7. **Edges** — Link adjacent authoritative memories with a 2–4-word scope hint: use an `arch` entry's existing Edges section, put pattern edges after Compliance, and place product edges in Pointers.

The inclusion bar applies to table rows as well as prose. Give a state, event, guard, durable write, effect, recovery path, or projection a row only when it changes an authority, durability boundary, recovery outcome, or meaning that a reader cannot safely infer from repository layout or a linked memory. Conversely, enumerate every non-obvious machine edge: it cannot hide in explanatory prose. Point each row to owner files, never line numbers; delete restatements of linked memories and link to their authoritative section instead.

## Terminology

ASD-STE100-leaning: one meaning per word, the same term every time, a term defined at first use or in the repo's `glossary` doc, no coined shorthand. Add or revise a glossary term whenever a memory would otherwise use it undefined.
