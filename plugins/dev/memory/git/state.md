---
kind: knowledge
when-and-why-to-read: When the user invokes /dev:git:state, or asks whether it is safe to commit or push right now, this knowledge should be read because it produces the branch-and-drift briefing they use to decide, in a shape that hides every repo with nothing to decide.
short-form: Report branch, drift, and what is dirty vs committed-but-unpushed for the repos in play — compact arrow drift, bold-led work bullets, ending with an offer to commit/rebase/push.
rationale: Table and pure-prose formats were both rejected; the chosen shape is prose with bold-lead work bullets, ahead/behind and branch always present, and clean repos reduced to nothing.
slash: true
---

# /dev:git:state — is it safe to commit or push?

The user is deciding whether it is safe to commit or push. Answer that question. $ARGUMENTS

## Scope

Report on repositories this conversation actually touched — files read or edited, directories commands ran in. If the conversation touched none, fall back to the project directories in the active profile's purview (`crtr profile show`).

**Omit any repo that is clean and in sync.** A repo with nothing to decide does not appear at all — no reassuring one-liner, no roll call. Skip non-git directories silently. Never ask which repos to check; infer.

## The survey (already run)

Every repo in the profile's purview plus the current one, fetched and surveyed at read time. Repos that are clean and in sync are omitted here and from your report; a repo missing from this block needs no words.

```!
roots=$( { crtr profile show "$CRTR_PROFILE_ID" 2>/dev/null | sed -n 's/^- \(\/.*\)$/\1/p'; git rev-parse --show-toplevel 2>/dev/null; } | sort -u )
for d in $roots; do
  top=$(git -C "$d" rev-parse --show-toplevel 2>/dev/null) || continue
  git -C "$top" fetch --quiet --all --prune 2>/dev/null
  st=$(git -C "$top" status -sb)
  ahead=$(git -C "$top" log --oneline @{u}.. 2>/dev/null)
  behind=$(git -C "$top" log --oneline ..@{u} 2>/dev/null)
  dirty=$(printf '%s\n' "$st" | tail -n +2)
  [ -z "$ahead$behind$dirty" ] && continue
  echo "### $top"
  printf '%s\n' "$st"
  [ -n "$dirty" ] && { echo "-- diffstat"; git -C "$top" diff --stat HEAD | tail -25; }
  [ -n "$ahead" ] && { echo "-- unpushed"; printf '%s\n' "$ahead" | head -25; }
  [ -n "$behind" ] && { echo "-- incoming"; printf '%s\n' "$behind" | head -25; }
  sl=$(git -C "$top" stash list); [ -n "$sl" ] && { echo "-- stash"; printf '%s\n' "$sl"; }
  echo
done
```

That is the whole gather — do not re-run status, log, or fetch to confirm it. Read a diff only when a dirty bullet needs to say what the change actually does and the file names do not tell you. The survey covers the purview; if this conversation touched a repo outside it, survey that one the same way.

When a branch is behind, name the incoming work too — an `### Incoming on upstream (<n>)` section under that repo, same bullet shape — because what is landing on top decides whether a rebase is routine or worth reading first.

**Re-check `git status` immediately before you act.** Other agents work these repos concurrently, so a tree that was clean when you reported can be dirty by the time the user says "rebase." Never stash or commit changes you cannot account for from this conversation; stop and report them instead.

Ahead/behind is measured against **the branch's own upstream**, never `origin/main`. A long-lived branch that tracks its own upstream is expected to diverge from main by hundreds of commits; that is its normal state, so never report it as a problem or suggest merging main into it.

## Shape

One `##` heading per repo carrying the branch and compact drift — no prose for the numbers:

`## <repo> — \`<branch>\` ↑<ahead> ↓<behind> · <n> dirty`

Then two `###` sections, each only if non-empty: **Dirty** (uncommitted working tree) and **Committed, not pushed**. Bullets under each are a **bold three-to-six-word name for the work** followed by an em dash and a short plain-text description of what it is and how far along it is. No italics, no styling on the description.

A bullet is a piece of work, not a file — collapse the files of one effort into one bullet and name the effort. **Never print a commit hash.** Never restate commit subjects or file paths verbatim; say what the work does. When a branch is hundreds of commits ahead, do not enumerate — one bullet naming what the stack is and that it is not the decision in front of them.

Mention stashes or worktrees only when they bear on committing or pushing right now.

End with a single offer line of the actions you could take next: commit everything, rebase onto the upstream where the branch is behind, push. Order matters — commit, then rebase, then push.

## Example

```
## web — `main` ↑2 ↓0 · 11 dirty

### Dirty

- **Search results redesign** — result card, empty state, ranking hook, and the two stories that cover them. One thread, mid-flight.
- **Stale feature-flag cleanup** — a retired flag removed from config and three call sites. Unrelated to the search work.

### Committed, not pushed

- **Session cookie rotation** — refresh moved onto the shared middleware instead of each route.
- **Duplicate toast fix** — stops a retried upload raising a second success toast.

## api — `billing-rewrite` ↑585 ↓626 · 1 dirty

### Dirty

- **Invoice serializer tweak** — one modified file, unconnected to everything stacked ahead.

### Committed, not pushed

- **The billing-rewrite branch itself** — 585 commits, expected to run far ahead of its upstream. Not the decision in front of you.

**Want me to:** commit everything · rebase api onto `origin/billing-rewrite` · push both — or commit → rebase → push in sequence?
```
