---
kind: knowledge
when-and-why-to-read: When you have just created an implementation plan and need it validated against requirements and design for full coverage and no ambiguity, this skill should be read because it gives the plan-review checklist.
short-form: Validate an implementation plan against requirements and design — coverage, no ambiguities.
system-prompt-visibility: name
file-read-visibility: none
---

# Review Plan Against Requirements and Design

Inputs: requirements file, design file, and plan file (for the same topic).

Delegate to a fresh subagent (keeps your context clean) with this brief:

> Review the plan against requirements and design.
>
> Inputs: paths to requirements, design, and plan.
>
> ## Process
>
> 1. Read all three documents (requirements first, then design, then plan).
> 2. Extract every acceptance criterion from requirements.
> 3. Extract every architectural decision from design.
> 4. Map each acceptance criterion to plan coverage: covered, partial, or missing.
> 5. Verify the plan implements the design's architecture (not an alternative approach).
> 6. Check plan quality.
>
> **Threshold: Only flag issues that would block implementation or cause genuine confusion.**
>
> ### Quality Checks
> - Ambiguous language → only if implementation would stall or go wrong
> - Deferred decisions → only if missing info needed to start work
> - Conditional branches → only if unresolved decisions (valid branching is fine)
> - Unexplored complexity → only if it hides surprising work
> - Design divergence → plan contradicts design's architecture without justification
>
> ## Output
>
> If all covered and no issues: `PASS`
>
> If issues exist:
> 1. Missing: [acceptance criterion from requirements not in plan]
> 2. Design mismatch: [plan diverges from design without justification]
> 3. Ambiguous: [unclear section that needs resolution]

Report the subagent's findings to the user.
