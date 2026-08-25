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

Choose the target in this order: an explicit user instruction, repository guidance, then the repository's normal integration branch discovered from its configuration and recent accepted changes. Ask the user if that evidence conflicts or does not select one branch. Record the target, source branch, PR URL or number when one exists, and both watcher identities in `$CRTR_CONTEXT_DIR` so a later wake can resume the same loop.

## 2. Integrate linearly and prove parity

Fetch the selected target and rebase the owned PR branch onto its remote tip. Do not merge the target into the branch. Rebase first and build on the rebased tip: a fix, version bump, or regenerated lockfile committed onto a stale base has to be redone, and its verification proves nothing about the base the PR will actually merge from. Inspect upstream commits before resolving a real conflict; preserve work that is still required, and ask the user when two legitimate behaviors conflict. An empty replay can mean the same patch already reached the target: confirm that equivalence, then drop that replay rather than recreating it.

Push a rewritten branch only when it is the isolated PR branch and the remote lease still identifies the expected history; use a lease-protected force push, never an unrestricted force push. Otherwise stop and reconcile branch ownership. One push carrying the rebase and the new commits together is correct; do not push twice.

Derive local CI parity from the repository's checked-in workflows and their referenced scripts, manifests, and configuration. Run the applicable build, lint, type, test, generated-file, and other required gates in the same environment or closest documented equivalent. Fix failures in owned paths, rerun the affected gates, then commit and push only those verified paths. Do not invent a generic command set or claim a green gate that was not run.

A gate that cannot run locally for want of a credential, service, or platform is unverified, not failed. Say which gate it was and why, and let CI run it. Before concluding a dependency or artifact is missing because a local fetch failed, check whether the same fetch fails for a version already known to be in use; when it does, the credential is the fault and the artifact's existence must be established from the publishing job's own output instead.

## 3. Open or update the PR

Use the repository's configured PR provider and current tooling to find an existing PR for the branch or create one against the selected target. Write the title and body through [[dev/pr-description]], then apply the repository's conventions and template. Keep the body specific to this diff; do not copy personal communication rules or project policy into this portable workflow.

Capture the provider identity and read the PR's current checks, reviews, and comments before arming a watch. Handle a current settled failure or actionable review item immediately; a watcher baseline cannot discover facts that existed before it was armed.

## 4. Watch through the runtime

The provider cannot push into the canvas, so watching is polling with change detection. Cron cadence bottoms out at 60s, which is the true floor on how fast a failure can reach you; never claim or design for instant notice, and never hold a terminal open to poll faster.

Build one stable, sorted PR-state summary from the provider API or CLI: PR state plus an explicit merge outcome derived from the provider's merge field or timestamp, so a merged PR prints `merged` rather than merely `closed`; whether every check is terminal; whether every check is terminal AND passing, as its own field, so the moment the PR goes green is itself a change; every non-success terminal check; and non-pending review or comment activity with stable identifiers. Treat running or pending checks as pending, never as failures, and never emit an empty conclusion as a failure. Sort every collection so ordering alone cannot produce an event.

Emit aggregates, not per-check status. A summary listing each job's state changes on every single job completion and wakes you dozens of times per run for nothing; a boolean plus the terminal failures wakes you only when a decision is actually available.

Arm two watchers, both with a `node:$CRTR_NODE_ID` sink, `--anchor-self`, and a dynamic name carrying the repository and PR identity:

- **Events**, at the 60s floor with `--on-output on-change` and `--tier urgent`. It prints the stable summary and nothing else, so it delivers exactly when something changed: the first terminal failure, the flip to all-passed, a new review or comment, a merge or close, or a mergeability change. Urgent so it steers you mid-turn or wakes you from dormancy.
- **Status**, at a slower cadence with `--on-output always` and `--tier normal`. It prints a one-line human-legible roll-up — state, head, mergeability, passed/failed/pending counts, any failing names, review and comment counts — so a periodic heartbeat arrives even when nothing changed. Normal so it waits for a running turn to settle rather than interrupting it. Bound it with `--expires`, because an `always` watcher on a node sink revives the node every cadence for as long as it lives, and a forgotten row is then an unbounded wake loop.

Do not use a fixed node ID, checkout path, cron name, or sink. After arming, end the turn rather than polling or holding a terminal open. Keep both watchers until the loop reaches its completion boundary, then cancel each explicitly.

On each pushed update, reread the current PR state and classify only the new or unresolved work. A settled failing check gets diagnosis and a fix. A review or comment gets a reasoned response, a fix, or an explicit explanation on the PR when no change is appropriate. Do not treat an in-progress check, an empty conclusion, or activity caused by the loop's own push or reply as a failure. Bot comments arrive under one provider identity whether they carry findings or mere status, so read them rather than filtering the identity out.

Diagnose a failing check before changing anything, and distinguish a regression from an infrastructure or harness flake: compare the failing test against the same check on a neighbouring commit, and check whether the failing path is even reachable from this diff. A flake that a rerun clears needs a rerun, not a patch — but say plainly that a rerun is what cleared it.

Delegate genuinely independent failures or review items with `crtr node new --worktree <pr-branch>`. Give each child the exact item, acceptance evidence, and exclusive paths. Do not give concurrent children overlapping files or a shared index. Each child verifies its owned change, commits only its named paths, reports its commit, and lands its managed worktree serially. Inspect the landed result before pushing the PR branch. Keep coupled fixes in one owner rather than creating a coordination layer.

## 5. Finish without merging

The loop completes when the PR remains open, every required check is terminal and passing or otherwise accepted by repository policy, required review state is satisfied, and every comment or review item is fixed or answered with no unresolved activity. Cancel both watchers, record the final PR state and handled items, and report the PR URL, target, commits, verification, and any accepted exception.

Do not merge, close, or mark downstream work complete. A repository or user decides the merge and any post-merge transition. If another actor closes or merges the PR, cancel both watchers and report that observed state instead of taking another branch action.

A merge that lands while checks are still running does not end the loop silently. The post-merge run on the target still has to go green, because a release or publish job gated behind those checks is skipped when they fail. Follow that run to a terminal result, rerun failed jobs when the failure is a flake, and treat the downstream consumers of the released artifact as unfinished work until it exists.
