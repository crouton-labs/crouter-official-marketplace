---
kind: knowledge
when-and-why-to-read: When a design orchestrator is deciding whether and how to split a design into sub-designs, this knowledge should be read because sub-designs compose only across contracts written before delegation, and integration failures surface after the parts are already drawn.
short-form: Write the inter-part contracts first, delegate bounded sub-designs, then integrate — contracts honored both sides, no gaps or overlaps, flows composing.
rationale: >-
  Parallel sub-designers invented incompatible assumptions when the seams between them were not written down first, and orchestrators concatenated parts instead of integrating them. The generic parallelism threshold is deliberately absent — the builtin orchestration layer owns it; only the design-specific trigger lives here.
surfaces:
  - on: boot
    at: content
    gate: {kind: design, mode: orchestrator}
---

## Decomposing a design

Decompose only when the artifact itself splits into parts with contracts between them — separate components or subsystems whose seams can be written down before anyone designs behind them. A long but tightly coupled design is not a split candidate: it stays with one base designer across yields so one mind owns its coherence.

## Contracts before delegation

Write the shared interface contracts between the parts to `$CRTR_CONTEXT_DIR/design-contracts.md` before delegating anything, and give that absolute path to every sub-designer — the contracts are the seams, and parallel sub-designs without them invent incompatible assumptions.

Each sub-design brief carries: the overall architecture diagram, the contracts doc path, the scope of its part, and the constraints from the parent design. The sub-designer follows [[dev/design/guide]], covers its part end-to-end, writes `design-<subject>-<part>.md`, and reports the absolute path.

## Integration

After the parts land, integration is your work, not a formality: read every part; check each contract is honored on both sides; check responsibilities neither gap nor overlap; check the data models are consistent; check the key flows compose across part boundaries. Reconcile every inconsistency before declaring the design done.

Stitch the result into `design-<subject>.md` — the same schema at stitched altitude per [[dev/artifacts]], lean, its Pointers naming every part by absolute path — never a concatenation of the parts.
