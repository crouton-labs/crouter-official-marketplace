---
kind: knowledge
when-and-why-to-read: When drafting the specification document itself, this knowledge should be read because a spec covering the right dimensions at the right depth lets design and planning proceed without inventing intent.
short-form: The spec artifact schema — the dimensions a specification covers, how depth follows stakes, and the finished bar.
rationale: >-
  The dimensions list rode at boot content inside the spec guide, charging every spec wake for a shape needed only at writing time; writers also treated the list as a mandatory template and padded sections that carried nothing for the request at hand.
---

# Spec schema

A specification settles what outcome and behavior are required. It is not an architecture document and not a plan: structure and ordering live downstream.

Cover the dimensions that matter for this request rather than filling a template — but treat an omission as a decision, not an accident:

- the user, caller, or system being served and the intended outcome;
- observable behavior and experience;
- scope and non-goals;
- consequential constraints and already-settled decisions;
- relevant interfaces, states, and transitions;
- failure behavior, boundary conditions, and edge cases;
- acceptance scenarios that make success observable.

Depth follows the stakes and unresolved intent: a small reversible change needs a few paragraphs, a consequential product surface needs the full set. Implementation detail belongs only where it constrains the outcome.

Finished means no unresolved question remains that would force downstream work to guess; an intentionally deferred, non-blocking question is named as deferred. Split independent outcomes into separate specs rather than hiding them in one oversized document.

Close with the Pointers section per [[dev/artifacts]], naming the exploration maps and inputs the spec rests on.
