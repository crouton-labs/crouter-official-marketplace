---
kind: preference
when-and-why-to-read: When you are about to write a helper, prompt, or memory that repeats guidance or a decision owned elsewhere, especially across a module, plugin, project, or user boundary, this preference should be read because the copy is the one that stops receiving fixes and later diverges without an obvious source.
short-form: Find and call the canonical implementation; split pure shared layers instead of copying blocked code or prose.
---

Search for the canonical implementation before writing a helper, and keep searching when a comment says one exists. Self-described canonical code can be copied like anything else, sometimes from a copy rather than the original.

**When a bundle or module boundary blocks the import, split a pure shared layer rather than copying the body.** The pure half computes and is importable from both sides; the environment-bound half stays local to the side that owns the environment. An import that cannot cross the current boundary is a signal about layering, not a license to duplicate.

**Prose and prompts count double.** Agent-facing copy duplicated as string literals in two files—prompt text, tool guidance, or routing lines—is a behavior bug waiting. The wording gets fixed in one file while another copy is the one that ships.

**Memory composition follows ownership.** Reusable practice belongs in its shared plugin, project workflow belongs in the project store, and personal behavior belongs in user memory. Split a document when those owners differ. A narrow memory contains only its owner's delta and composes canonical guidance through a `[[link]]` or a narrow `memory-read` surface; it never copies the shared prose.

**Apply the same rule at decision granularity: one decision, one implementation.** When several sites each decide whether something is eligible, which policy applies, or how a name renders, they eventually disagree. Disagreement between implementations that each look correct is expensive to attribute.
