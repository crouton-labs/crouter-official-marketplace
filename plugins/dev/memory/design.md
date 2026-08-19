---
kind: knowledge
when-and-why-to-read: When an agent invokes /dev:design to pause work and settle the structure of a change, this knowledge should be read because implementation can then build against closed decisions instead of re-deciding architecture mid-edit.
short-form: "Pause to write one right-sized design in the node context, then stop."
slash: true
rationale: The design kind carried the only design guidance in the tree, so a general node asked for an architecture had nothing but its own instincts — it produced descriptions of the current code rather than designs, drifted into function-level detail, and left the implementer a branch to pick. Concerns and risk commentary also belong in the closing overview rather than inside the artifact, which must read as one settled structure.
---

# /dev:design — settle the structure of a change

Pause the current work and write one right-sized design for: $ARGUMENTS

Ground it in the relevant code and requirements. A design fixes the load-bearing structure: component boundaries and responsibilities, interface contracts, data model, key flows, and the decisions that close real options with the alternatives you rejected. Read [[design/guide]] for what each section must contain and the top-down versus bottom-up call.

Resolve every decision that closes a real option — never hand the implementer a branch to pick. When a decision turns on judgment the user should own, such as a performance tradeoff, a data-model shape, or which pattern to adopt, work it out with them through `crtr human` before finishing the document (`crtr human send -h`), wait for their answer, and reflect it in the design. The obvious option is usually not the right one.

Stay above implementation: no function bodies, algorithm walkthroughs, library calls, or ordering of implementation steps. Anything that could be pasted into source belongs in the plan or the code. Design enough to unblock parallelism and close what is expensive to reverse, and no further — over-specification creates brittleness and rework when reality does not match the paper. Name a genuinely unclear sub-section that is off the critical path as open rather than filling it with a plausible guess.

When the blast radius of the change is unclear — what it touches, who depends on it, what constrains the shape — spawn `explore` scouts in parallel to map it before you write (`crtr node new -h`), and draw the constraints from their reports rather than from an assumption.

Write the artifact in `$CRTR_CONTEXT_DIR`. For a design large enough to split across nodes, read [[design/roadmap]] instead.

Keep the artifact pure: it states the structure, the contracts, and the decisions, and nothing else. Concerns, risks, caveats, and recommendations do not go in it, except as Open risks that genuinely affect the design's validity.

End by reporting the artifact's absolute path and a short overview in plain, laconic language: one sentence per decision — what was chosen and what it closed off — then any real concerns and what you recommend, omitted entirely when none exist rather than manufactured. Then stop. Do not implement as part of this invocation.
