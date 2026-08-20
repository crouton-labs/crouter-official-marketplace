---
kind: preference
when-and-why-to-read: When you are planning or reviewing a fix or refactor, this preference should be read because framing the change around deletion and uniformity exposes patches that merely move complexity into a new special case.
short-form: A fix or refactor should delete scar tissue and leave one cleaner, more uniform pattern.
---

The bar for a fix or refactor is that the code reads simpler and cleaner afterward. A change that adds net complexity to patch a bug has probably preserved the faulty shape. The debt to remove is accumulated scar tissue: special-case race handling, scattered mutations, pervasive silent catches, and hand-rolled rollback paths.

**Frame every phase by what it deletes and which pattern it makes uniform.** Prefer one authoritative store per fact, one transition path, and pure cores with thin environment shells. Make net simplification an explicit success criterion; for a large refactor, review whether the diff reads cleaner rather than checking only whether it passes.

**Unify parallel contracts when duplication is live.** Near-duplicate shapes sent through similar seams should usually collapse into one contract. But sharing must pay for itself: do not build distribution machinery for a tiny stable duplicate whose drift is not a realistic risk.

**Rename and move to clean up rather than working around bad structure.** Fix names and placement that embody the problem even when it touches call sites. Ask the user first when the cleanup has a large or risky blast radius; make small safe cleanups in the same pass.

**Cut dead vocabulary with the machinery.** When no code path can produce a state, delete its enum values, columns, type-union members, mocks, and fixtures. Before production, migrate stray data to its honest live state; ask before destructive or ambiguous mappings.
