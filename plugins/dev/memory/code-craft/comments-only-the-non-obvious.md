---
kind: preference
when-and-why-to-read: When you are writing a code comment, deleting a surface that comments elsewhere still name, or working in a file whose comments are already long, this preference should be read because comment prose that narrates the code reads as noise and a comment naming removed code teaches a dead API to whoever reads it next.
short-form: Comment only the non-obvious, in as few words as possible, describing current state only — and prune bloat wherever you find it.
---

Comment only what the code cannot say: unexpected behavior, a side effect, an outside constraint, a non-obvious invariant, why the tempting simpler shape is wrong. Anything obvious from reading the code goes uncommented.

Keep them short. Fragments and noun phrases over sentences; one line is the norm and a second must earn itself. Never narrate what the code does, restate a name, argue a decision at essay length, or write prose about motion, feel, or design intent beside the implementation.

Describe only current behavior. No comment may reference dead or removed code — no "replaces the old X", "used to", "formerly", "legacy". When you delete a surface, scrub its name from comments too, not just call sites; phrase a regression guard as the contract that holds now, not as the bug it replaced.

Pruning is ongoing work, not something reserved for regions you happen to touch. Delete or compress overlong comments wherever you find them — a long block is not house style to preserve, and matching it is how the file got that way.
