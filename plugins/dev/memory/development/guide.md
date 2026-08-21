---
kind: knowledge
when-and-why-to-read: When shaping or reshaping a build roadmap — choosing a development style, selecting a phase skeleton, or setting exit criteria for a software goal — this knowledge should be read so each phase matches the goal's risk and clears an objective done-bar before downstream work compounds an upstream mistake.
short-form: Use when shaping or reshaping a build roadmap — choosing a development style, selecting a phase skeleton, or setting exit criteria for a software goal.
gate: {kind: developer}
surfaces:
  - on: boot
    at: preview
---

# Development Playbook

## Development Styles

Pick one style as your primary frame before you write phases. Each fits a different risk/knowledge profile.

**Vertical slice.** Start with the thinnest path end-to-end — one real request touching every layer — before thickening any of them. Use when the integration seams are the riskiest unknowns and a working skeleton keeps the team aligned on "done". Fits new features where you know what to build but not how the layers will talk.

**Spike-then-harden.** Build a throwaway prototype of the one thing you don't understand, validate the approach, then discard it and build it properly. Use when there is a genuine technical unknown (unfamiliar API, unclear performance profile, novel algorithm) that blocks everything else. The spike is not the deliverable — the hardened version is.

**Strangler-fig.** Introduce a new implementation path alongside the old one, route traffic to it incrementally, and delete the old path when migration is complete. Use for migrations and rewrites where you cannot replace atomically and must maintain a working system throughout.

**Bottom-up.** Build foundational primitives first; compose them into higher-order behaviour last. Use when building a library or shared infrastructure where the interface must be right before consumers are written. Risky if the top-level requirements aren't settled — you may build the wrong primitives.

**Decision rule:** if the riskiest unknown is technical feasibility, spike first. If it is integration correctness, vertical slice. If it is a live-system migration, strangler-fig. If it is a foundational library with settled requirements, bottom-up. Default to vertical slice for ambiguous new feature work.

---

## Roadmap Shapes by Scenario

These are concrete phase skeletons. Adapt names and granularity; don't add phases that serve no exit criterion.

### New feature
1. **Explore** — map the affected subsystems, identify entry points and constraints, and report the absolute path to the exploration artifact.
2. **Spec** — define the interface, behavior, and acceptance criteria, then report the absolute path to the spec.
3. **Plan** — decompose the spec into file-level tasks with dependency order, then report the absolute path to the plan.
4. **Vertical slice** — implement the thinnest end-to-end path; validate it works before widening.
5. **Harden** — fill out the remaining logic, edge cases, error paths.
6. **Review** — non-implementer critique pass on the whole surface.
7. **Fix** — action review findings.
8. **Validate** — end-to-end confirmation against spec's acceptance criteria.

### Refactor
1. **Characterise** — pin current behaviour with evidence that holds before and after: whatever proof the repo's testing stance calls for, else a recorded runtime probe.
2. **Plan safe steps** — decompose into the smallest semantics-preserving transformations; each step independently reviewable.
3. **Transform** — apply each step, re-checking the characterisation evidence after each one.
4. **Verify equivalence** — confirm no observable behaviour changed; review for unintended scope drift.

### Bug-fix campaign
1. **Reproduce** — produce a reliable reproduction case for each bug; nothing proceeds without one.
2. **Root cause** — trace the defect to its source; group bugs sharing a root cause.
3. **Fix** — implement the minimal correct change; no opportunistic cleanups in the same commit.
4. **Prove the fix** — as the repo's testing stance calls for: a regression test where it keeps them, otherwise the reproduction case run against the fix.
5. **Validate** — confirm the reproduction case no longer triggers.

### Greenfield
1. **Explore/research** — understand the problem domain, constraints, and comparable systems.
2. **Spec** — define the interface and top-level behaviour in enough detail to plan.
3. **Architecture decision** — commit to the structural shape and report the absolute path to the architecture artifact.
4. **Spike** (if technical unknowns exist) — validate the risky piece before building around it.
5. **Bottom-up build** — primitives first, then composition; validate each layer before building on it.
6. **Integration** — assemble layers; validate end-to-end.
7. **Review + fix** — critique full surface; action findings.

### Migration / upgrade
1. **Inventory** — enumerate every call site, every affected API, every integration point.
2. **Compatibility plan** — decide the strangler-fig boundary; define the coexistence period.
3. **New path** — implement the replacement without removing the old.
4. **Route incrementally** — shift traffic or call sites in small batches; validate after each batch.
5. **Delete old path** — only after full migration is confirmed.
6. **Validate** — confirm nothing regressed; run the full integration surface.

### Performance work
1. **Baseline** — measure and record current performance numbers; define the target.
2. **Profile** — identify the actual bottleneck; do not optimise before you know where the heat is.
3. **Fix the bottleneck** — targeted change only; no speculative optimisation.
4. **Measure again** — confirm the target is met against the same baseline method.
5. **Review** — check that the fix doesn't introduce correctness or maintainability regressions.

---

## Setting Exit Criteria per Phase

Every phase needs a concrete, evaluable condition that tells you it is genuinely done — not "looks good" or "mostly working". Write exit criteria when you write the phase, not after.

- **Explore:** a context doc exists that accurately describes the relevant subsystem; a reviewer or subsequent spec agent should not need to re-explore to write the spec.
- **Spec:** acceptance criteria are concrete enough that an implementer can derive test cases from them without ambiguity.
- **Plan:** every task maps to identified files; no task says "figure out how"; dependencies are explicit.
- **Implementation:** the code compiles, existing tests still pass, and the acceptance criteria from the spec are provably met — by a validation agent's check, or by tests where the repo's testing stance calls for them.

How much of that proof is new test coverage is the repo's call, never this playbook's: follow its `testing-stance` memory, and read [[dev/testing]] when it has none.
- **Review:** a non-implementer has read the diff once and produced a report; every Critical, Major, or acceptance-violating finding is fixed, always. A Minor or cosmetic finding that doesn't affect acceptance is fixed when the fix is net-neutral-or-simpler, or else closed with a one-line reason. The gate is met by that one pass — never by re-reviewing until the reviewer reports nothing, which is an asymptote, not a bar.
- **Validation:** end-to-end confirmation against the spec's acceptance criteria passes in the real runtime, not just in isolation.

If you cannot write a concrete exit criterion for a phase, the phase is underspecified — split it or spec it further before adding it to the roadmap.

---

## The Build-Cycle Discipline

This is the delegation pipeline from spec to shipped, with the coupling that makes it rigorous.

**Spec → Plan.** The plan agent receives the spec as input; it does not re-derive requirements. If the spec is ambiguous, the plan agent reports the ambiguity — the orchestrator resolves it and re-delegates, not the plan agent by guessing.

**Plan → Implement (parallel where safe).** Tasks with disjoint file sets run concurrently. Before spawning parallel implementers, verify file-level independence; if two tasks touch the same file, serialize them. Every implementation agent receives: the goal in one sentence, its specific task and done condition, the relevant context files by path, and the e2e validation recipe.

**Implement → Review (non-implementer).** The reviewer receives the full diff and the relevant context docs. It produces a report sorted by severity — Critical, Major, Minor — and does not propose fixes inline. One review pass per implementation batch; do not re-review after fixes, validate instead.

**Review → Fix.** The orchestrator triages the report: false positives are dismissed, Critical/Major and acceptance-violating findings get fix agents, and cosmetic or out-of-scope findings are closed with a one-line reason instead of fixed or left open. Fix agents read the findings, understand the code, and implement the correct fix — they are not given line-by-line instructions. Do not spawn a second reviewer after fixes land.

**Fix → Validate.** Validation confirms the thing works end-to-end in the real runtime by executing acceptance criteria, targeted tests, or a real behavior probe. It produces evidence rather than another opinion on the artifact. If validation fails, spawn fix agents against the observed failure and repeat that check; do not advance until it passes.

**When review or validation exposes a phase gap** — a wrong assumption in the spec, a plan that missed a dependency, an implementation that reveals the design is wrong — re-delegate the affected phase rather than patching forward. A corrected spec or plan paid for in one extra wake costs less than an implementation built on a bad foundation.
