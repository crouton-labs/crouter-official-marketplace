---
kind: preference
when-and-why-to-read: When you are about to add defensive machinery or an unrequested optimization, propose a fallback or compatibility hedge, plan a refactor, migration, or cutover, write a catch block or a helper that feels generic, or choose between agent judgment and an algorithmic mechanism, this preference should be read because the shape committed before writing is much more expensive to undo after implementation.
short-form: Default toward deletion, one authoritative path, explicit failure, and enforcement rather than defensive machinery.
surfaces:
  - on: boot
    at: preview
  - on: boot
    gate:
      kind:
        in:
          - design
          - spec
          - plan
          - developer
    at: content
gate:
  kind:
    nin:
      - explore
      - personal-assistant
---

# Default down

One test runs under every preference in this directory: **the change that deletes or unifies beats the change that adds**, so the burden of proof sits on the addition. Guards, seams, layers, copies, and mechanisms are often locally cheaper than finding the design that makes them unnecessary, but they leave the next change paying for both paths.

Apply the test in three forms:

- **Design time — what does this delete?** Frame a fix, refactor, or cutover by what it removes and which pattern it makes uniform. An abstraction earns its seam when the second implementation or registrant exists; scale machinery earns its place when the load exists. If a fix or refactor is net-additive, reconsider the design.
- **Authoring time — what stays true when this fails?** Any construct that absorbs a failure must leave something authoritative behind and hand the caller a value honestly different from success. A construct that cannot name what survives its own failure is inventing an answer, not handling an error.
- **Review time — what enforces this?** A rule asserted only in prose holds where someone remembers it. If a convention matters enough to declare, ship its enforcement in the same change; otherwise remove the declaration rather than leaving an unverified claim.

Read the matching member when the instinct fires, before the code exists. Once implementation begins, an avoidable mechanism becomes a shape someone must defend instead of a choice they can still make cleanly.

When no member matches and the addition still appears necessary, present the invariant, diagnosis, and candidate design to the user before shipping the mechanism.
