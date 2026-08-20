---
kind: preference
when-and-why-to-read: When you are declaring an ownership, identity, layering, or synchronization rule in prose, or are about to build on one you found, this preference should be read because an unenforced convention can already be false outside the file where someone remembered it.
short-form: Ship tests or lint with ownership, layering, identity, and synchronization rules; prose explains but does not enforce.
---

A convention that lives only in a comment holds exactly where someone remembered it. Land the enforcing test or lint in the same change that declares an ownership, identity, layering, or synchronization rule. A follow-up ticket for enforcement leaves the rule unverified in the meantime.

**Treat a prose-only rule you find as unverified.** Before building on “only X writes this table” or “these files stay identical,” check the current code against the claim.

Enforcement is usually small: a test that walks imports for a layering boundary, a byte comparison for a synchronization invariant, or a script wired into CI for an ownership rule.

The comment still earns its place because it says why the rule exists, which the test cannot. It cannot be the thing that keeps the rule true.
