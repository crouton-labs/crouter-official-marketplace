---
kind: knowledge
when-and-why-to-read: When a branch is ready to become or update a pull request, this knowledge should be read because it keeps the branch reviewable, current with its target, and safely watched until CI and review work settle.
short-form: Prepare an owned branch, rebase it linearly, prove repository CI parity, open a reviewer-facing PR, and watch it to a green no-merge boundary.
slash: true
surfaces:
  - on: boot
    at: name
  - on: memory-read
    match: git/pr-loop
    at: content
  - on: memory-read
    match: northlight/git/branch-and-pr
    at: content
---

# /dev:pr-loop — prepare and watch a pull request

Carry the current change through a review-ready pull request. Treat arguments as constraints such as the target, issue, or requested scope. Inspect the repository's contribution guidance, PR template, CI workflows, configured remotes, and available provider tooling before choosing commands. Repository policy supplies provider, title, body, approval, and target-branch details; this command supplies the portable loop.

## 1. Establish ownership and the target

Inspect the current branch, worktree, index, working tree, upstream, and existing PR. Work only in a checkout deliberately owned for this PR. Before any rebase, reset, checkout, or commit, identify every modified path and its owner. Keep unrelated, unknown, or another worker's changes out of this PR. If the checkout is shared, its ownership is unclear, or independent fixes will run concurrently, create or move to an isolated managed worktree before changing history.

Commit only named paths that belong to this PR, and only after their relevant verification passes. Never stage all changes by default, and never absorb dirty work merely to make a branch clean. Preserve unowned work where it is, or ask its owner or the user how to separate it.

Choose the target in this order: an explicit user instruction, repository guidance, then the repository's normal integration branch discovered from its configuration and recent accepted changes. Ask the user if that evidence conflicts or does not select one branch. Record the target, source branch, PR URL or number when one exists, and the watcher identity in `$CRTR_CONTEXT_DIR` so a later wake can resume the same loop.

## 2. Integrate linearly and prove parity

Fetch the selected target and rebase the owned PR branch onto its remote tip. Do not merge the target into the branch. Inspect upstream commits before resolving a real conflict; preserve work that is still required, and ask the user when two legitimate behaviors conflict. An empty replay can mean the same patch already reached the target: confirm that equivalence, then drop that replay rather than recreating it.

Push a rewritten branch only when it is the isolated PR branch and the remote lease still identifies the expected history; use a lease-protected force push, never an unrestricted force push. Otherwise stop and reconcile branch ownership.

Derive local CI parity from the repository's checked-in workflows and their referenced scripts, manifests, and configuration. Run the applicable build, lint, type, test, generated-file, and other required gates in the same environment or closest documented equivalent. Fix failures in owned paths, rerun the affected gates, then commit and push only those verified paths. Do not invent a generic command set or claim a green gate that was not run.

## 3. Open or update the PR

Use the repository's configured PR provider and current tooling to find an existing PR for the branch or create one against the selected target. Write the title and body through [[dev/pr-description]], then apply the repository's conventions and template. Keep the body specific to this diff; do not copy personal communication rules or project policy into this portable workflow.

Capture the provider identity and read the PR's current checks, reviews, and comments before arming a watch. Handle a current settled failure or actionable review item immediately; a watcher baseline cannot discover facts that existed before it was armed.

## 4. Watch through the runtime

Use the provider API or CLI to produce one stable, sorted PR-state summary: PR state; every non-success terminal check; running or pending checks as pending rather than failed; and non-pending review or comment activity with stable identifiers. Do not emit empty check conclusions as failures. Include enough review metadata to distinguish new activity, and sort collections so ordering alone does not produce an event.

Arm a recurring `crtr cron add` watcher with `--on-output on-change`, a `node:$CRTR_NODE_ID` sink, and `--anchor-self`. Give it a dynamic name containing the repository and PR identity. Its command must use the recorded provider identity and print only the stable summary. The runtime pushes changed output to this node; after arming, end the turn rather than polling or holding a terminal open. Do not use a fixed node ID, checkout path, cron name, or sink. Keep the watcher until the loop reaches its completion boundary, then cancel it explicitly.

On each pushed update, reread the current PR state and classify only the new or unresolved work. A settled failing check gets diagnosis and a fix. A review or comment gets a reasoned response, a fix, or an explicit explanation on the PR when no change is appropriate. Do not treat an in-progress check, an empty conclusion, or activity caused by the loop's own push or reply as a failure.

Delegate genuinely independent failures or review items with `crtr node new --worktree <pr-branch>`. Give each child the exact item, acceptance evidence, and exclusive paths. Do not give concurrent children overlapping files or a shared index. Each child verifies its owned change, commits only its named paths, reports its commit, and lands its managed worktree serially. Inspect the landed result before pushing the PR branch. Keep coupled fixes in one owner rather than creating a coordination layer.

## 5. Finish without merging

The loop completes when the PR remains open, every required check is terminal and passing or otherwise accepted by repository policy, required review state is satisfied, and every comment or review item is fixed or answered with no unresolved activity. Cancel the watcher, record the final PR state and handled items, and report the PR URL, target, commits, verification, and any accepted exception.

Do not merge, close, or mark downstream work complete. A repository or user decides the merge and any post-merge transition. If another actor closes or merges the PR, cancel the watcher and report that observed state instead of taking another branch action.
