---
kind: knowledge
when-and-why-to-read: When a Grove-backed checkout must return to a ready state without losing work, this knowledge should be read because deterministic cleanup and explicit judgment leave the repository usable without silently destroying a developer's branch or data.
short-form: Run the repository reset, resolve every parked item safely, and leave the checkout ready.
slash: true
surfaces:
  - on: boot
    at: name
---

# /dev:reset — return this checkout to a ready state

Read `dev -h`, then run `dev reset`. The command stops services, fetches, inventories and parks unresolved work, fast-forwards a clean checkout to main, runs the repository regeneration hook, and runs doctor. Exit 0 means nothing is parked. Exit 3 means the deterministic reset completed but parked items need judgment. Any other exit is a failed step: diagnose it before making branch decisions.

Read the report, especially `## parked`, and account for every item:

- A branch or worktree that is **provably merged** into the repository integration branch may be deleted. Verify the merge before deletion; never delete anything else.
- An **open pull request** stays in place. Record it as accounted for.
- **Real unPR'd work** gets an owned branch and a pull request to the repository's integration branch. Follow [[dev/pr-loop]].
- A **dirty or ambiguous** item requires a focused question through `crtr human`; do not stash, discard, reset hard, or delete it.

Reset keeps data by default. Pass `--state baseline|<snapshot>` only when the user explicitly requests state restoration. The repository's auto-loaded memory supplies its own lifecycle, regeneration, branch, and integration guidance; do not add an overlay mechanism.

Finish only when the checkout is on its integration branch and synced, `dev doctor` is green, and every branch or worktree is merged, represented by an open pull request, or explicitly parked after user judgment.
