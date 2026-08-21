---
kind: knowledge
when-and-why-to-read: When a specification effort contains independent discovery, design, or requirements surfaces large enough for worthwhile parallel work, this knowledge should be read because the handoffs must preserve one settled contract without turning sequential reasoning into coordination ceremony.
short-form: Orchestrate a specification only for worthwhile parallel work, using canonical artifacts rather than conversation context for handoffs.
rationale: The prior roadmap required every large specification to follow exact stages, fresh-window yields, fixed delegation, and user approval gates; the resulting process treated ceremony as the quality bar instead of the clarity of the finished contract.
surfaces:
  - on: boot
    at: content
    gate: {kind: spec, mode: orchestrator}
---

# Orchestrating a specification

Use a roadmap when settled boundaries expose independent specification work that can proceed concurrently and the effort is large enough that parallel execution materially improves intelligence, productivity, or elapsed time after synthesis cost. Multiple sequential phases, consequential user collaboration, or work that needs several context windows stay with one base spec writer across yields. When one writer can settle the request coherently, read [[dev/spec/guide]] and produce one right-sized specification.

## Choose only the phases the work needs

**Shape** establishes the canonical statement of intent: who or what is served, the intended outcome, scope and non-goals, and consequential decisions. The spec owner investigates and elicits according to [[dev/spec/guide]]. Shape is ready for handoff when a designer or requirements writer can proceed without inventing product intent.

**Design** is a separate phase only when structural choices constrain the behavioral contract or downstream plan. Delegate a bounded architecture to a base `design` node; use a design orchestrator only when its own independent surfaces make parallel design worthwhile. The design artifact records approved structure and interfaces; it does not replace the specification's outcome or behavioral contract.

**Requirements** turns the canonical specification and any approved design into the complete behavioral contract. For a multi-phase effort, delegate this to a fresh `spec/requirements` node and have it read [[dev/spec/requirements]]. The requirements writer receives the canonical artifacts, not the originating conversation, so it can detect what the documents fail to say without losing behavior that was already settled.

The dependency is shape → optional design → requirements. A phase exists because its output is needed by the next one, not because every specification must pass through a fixed checklist.

## Resolve gaps through the owning artifact

An independent reader exposes omissions; it does not decide product intent on the spec owner's behalf. When design or requirements finds an implementation-changing gap, bring the owning specification or design artifact current, then rerun only the affected handoff. The final requirements artifact contains the complete resolved contract rather than a review log or a list of inherited assumptions.

## Match the user's involvement to the decision

Use focused questions for consequential uncertainty and explicit document approval when the user is co-authoring or the artifact settles a high-impact product or architectural decision. Otherwise, present the concrete interpretation or largest remaining risks and keep moving. Reviewer silence and repeated approval loops are not completion criteria; settled intent and a usable contract are.

## Keep the handoff explicit

The roadmap names the current phase, the absolute paths of canonical artifacts, and the one blocking gate or question, if any. Detail and resolved decisions live in those artifacts rather than the roadmap. The final handoff identifies which specification, requirements, and design files are normative so planning never has to reconstruct the contract from reports or conversation history.
