---
kind: knowledge
when-and-why-to-read: When a spec, design, or plan node is about to write, name, or hand off its artifact, this knowledge should be read because downstream nodes locate, trust, and build on the artifact only when the chain's filenames, pointers, and purity rules hold.
short-form: The shared contract for dev artifacts — the typed chain, filenames, stitching, pointers, purity, scope, and links to the spec, design, and plan schemas.
rationale: >-
  The three artifact kinds carried three incompatible notions of naming, hand-off, and master documents, so the spec→design→plan chain had no typed handoff and every downstream node reconstructed its inputs from conversation. The scope-expansion ask and the ASD-STE100 style paragraph were also duplicated near-verbatim across six files, drifting independently. This document states each shared rule once; the schema leaves carry only what differs per artifact. The parallelism threshold for orchestrator promotion is deliberately absent from this cluster — the builtin orchestration layer owns it.
surfaces:
  - on: boot
    at: preview
    gate: {kind: {in: [spec, design, plan]}}
---

# Dev artifacts — the shared contract

Dev work moves through typed artifacts: exploration map → spec → design → plan, each stage consumed by the next. A stage is skipped when nothing needs it; the order never reverses.

## Filenames

Write the artifact in `$CRTR_CONTEXT_DIR` as `spec-<subject>.md`, `design-<subject>.md`, or `plan-<subject>.md`. A part of a decomposed artifact is `<kind>-<subject>-<part>.md`.

A stitched top document is the same artifact type at stitched altitude: it follows the same schema, stays lean, and its Pointers section names the parts. It is never a third document shape — an "index" or "master" with its own rules would leave the reader two schemas to reconcile.

## Pointers

Every artifact ends with a **Pointers** section naming its upstream inputs by absolute path — the exploration maps, spec, or design it rests on. Downstream nodes reuse that evidence instead of re-exploring; an artifact without pointers forces the next node to rebuild the ground it stands on.

## Purity

The artifact states the contract; the closing report carries everything else. Concerns, risks, caveats, recommendations, decision history, superseded ideas, and live progress stay out of the artifact — the one exception is the design schema's Open risks section. An artifact that hedges inside its own text stops reading as a statement of intent.

## Closed decisions

An artifact never hands its reader a branch to pick: every decision the artifact is responsible for lands on one concrete answer. A genuinely unresolved point off the critical path is named open — never disguised as an option list or filled with a plausible guess.

## Scope

Nothing enters an artifact without the user's assent. When something seems likely desirable but is not explicitly or implicitly required by the request, ask the user through `crtr human` before finishing the artifact (`crtr human send -h`), wait for the answer, and make the resulting boundary explicit. Do not hide the addition in an assumption, recommendation, or optional item.

## Style

Lean toward ASD-STE100 in the artifact and the closing report: state each necessary fact once, keep exact constraints, exceptions, numbers, and names, and cut inferable text.

## Schemas

Read the schema for the artifact you are writing: [[dev/artifacts/spec]], [[dev/artifacts/design]], [[dev/artifacts/plan]].
