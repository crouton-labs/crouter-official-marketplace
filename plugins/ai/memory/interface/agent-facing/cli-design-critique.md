---
kind: knowledge
when-and-why-to-read: When you are writing or reviewing -h text for an agent-driven CLI and the draft already feels helpful and complete, this critique should be read because it shows a capable agent's best unassisted draft failing a line-by-line human review — the annotated diff marks the exact instincts (verb rows at root, schemas at branch, promoted warnings, restated contracts) that feel right while quietly breaking progressive disclosure.
short-form: A capable agent's unassisted -h draft for a fictional CLI, the line-by-line human review that failed it, and the corrected version — the annotated diff between default instinct and the bar.
system-prompt-visibility: none
file-read-visibility: none
---
# Critique: a naive `mesh` help draft, reviewed

[[ai/interface/agent-facing/cli-design-reference]] shows the spec applied correctly. This document shows the opposite and is read differently: it is a **contrast**, not a template. One agent was asked for its best help output for a fictional deploy CLI (`mesh` — three families: `catalog`, `deploy`, `secret`), with no spec in hand. Its draft — articulate, plausible, and defended by its own design rationale — then went through a line-by-line human review. The draft is what the weights produce by default; the review comments (quoted verbatim below) mark exactly where that default diverges from the bar. Read the annotated draft first, then the corrected version, then the throughlines.

The headline numbers: the draft's root help was ~49 lines; the corrected root is 9. The review left the draft's *leaf* help — the longest, densest section — untouched.

## The draft, annotated

### Root (`mesh -h`), auto-loaded into every agent's system prompt

The draft opened:

```
mesh — ship services to the fleet, hold their secrets, and find what is already running.

Three families. Pick by what you are trying to learn or change:
```

> **Review**, on "fleet": «"fleet" = madeup jargon. What's this even mean? Using jargon/"cute" names for stuff sucks—it's not intuitive. Use plain language that maps to common existing terms»

> **Review**, on "Three families. Pick by…": «This is obvious. Wasted prompt.»

Then it enumerated every verb of every family at root — twelve verb rows, each with a capability clause and a when-clause. The `catalog` block, representative:

```
catalog  read before you write
  search    find a service by name, owner, tag, or free text; start here when you
            only have a description ("the billing thing") and need a real name
  show      one service in full: owner, current release, envs, endpoints, deploy
            history pointer — read this before deploying or rolling back anything
  register  add a service to the map; a service must be registered before deploy
```

> **Review:** «It's bad to show subcommands—it lets the agent skip calling catalog -h for example, breaking progressive disclosure. True for all of them here»

The draft's rationale had defended this at length — verb whens "written to be mutually exclusive so routing is a single comparison rather than a judgment," three facts promoted to root because "the mistake happens *before* the agent would think to read deeper." The review rejects the premise: a root that answers everything means the branch `-h` never gets called, and the branch is where the real schemas and cautions live. Root closed with a contract block and an instruction:

```
Contract
  Usage: mesh <family> <verb> [args] [flags]
  Global flags: --env <env> (default: staging; production requires --yes on any
                write), --json (machine-readable output on every leaf), --yes
                (skip the confirmation prompt on destructive verbs)
  Exit 0 = success. Non-zero = the operation did NOT happen; the message on
  stderr names the cause. There is no partial success.
  Long-running: only `deploy new` is async. Everything else returns when done.

Run `mesh <family> -h` for the family, `mesh <family> <verb> -h` for the full
schema of a verb. Do this before any verb that writes (`deploy new`, `deploy
rollback`, `secret set`, `secret remove`, `catalog register`) whose flags you have
not read this session — the argument shapes are not guessable and a wrong guess
against production is not free.
```

> **Review**, on "There is no partial success": «Cruft. "no partial success" is useless»

> **Review**, on the `Long-running:` line: «Doesn't belong at root level»

> **Review**, on the closing paragraph: «It's gonna ignore this, and this is self evident to some degree? idk, some cruft here too»

### Branch (`mesh deploy -h`), rendered on demand

The branch opened with the family's model — a keeper, but hard-wrapped:

```
A deployment is a service + an env + a release. `new` creates one and returns a
deployment id immediately; the rollout itself takes minutes. Every other verb here
reads or redirects deployments that already exist.
```

> **Review:** «Also, don't use arbitrary line breaks—one long string» *(applies document-wide: help is read by a model, not displayed in 80 columns)*

Then each verb carried its full signature and a paragraph:

```
  new <service> --ref <git-ref> [--env <env>] [--yes]
      Start a deployment and print its id. ASYNC: exit 0 means the rollout was
      accepted, NOT that it is live. ...
```

> **Review:** «If it accepts an arg, force the agent to call `mesh deploy new -h` instead—progressive disclosure! This is true for all of them»

After the verbs, the draft restated their when-clauses as a routing table — its rationale called this "the shape an agent actually reads under time pressure":

```
Choosing between them
  Something is broken in production right now      -> rollback (not a fix deploy)
  You want to know if your deploy finished         -> status
  Status says failed and you need why              -> logs
  You need the id of the release from before       -> list
  Code is ready and nothing is on fire             -> new
```

> **Review:** «Isn't this already obvious? It's really bad to repeat self-evident information»

And re-explained the global flags:

```
Flags shared by this family
  --env <env>   target environment (default: staging). Writes against production
                (`new`, `rollback`) require --yes.
  --json        machine-readable output; states are stable strings, safe to branch on
  --yes         skip the interactive confirmation — required for any non-interactive
                write, since there is no TTY to confirm on
```

> **Review:** «This was already said to be globally true. Redundant.»

### What drew zero comments: the leaf

`mesh deploy rollback -h` — the draft's longest section — passed untouched: the full argument schema; how to *obtain* a valid `--to` (the concrete `mesh deploy list` command, "take the newest entry whose state is `live`"); what rollback deliberately does **not** touch (git history, builds, secrets — with the remedy when the incident was a bad secret); synchronous + idempotent; each non-zero exit code as a distinct recovery path; two examples. Detail was never the sin. Detail at the wrong tier was.

## The corrected version

Root — families only, one discriminating clause each, elision markers forcing the branch read, global contract stated once:

```
mesh — deploy services to your environments, manage the secrets they read at runtime, and look up what exists and who owns it.

Usage: mesh <family> <verb> [args] [flags]

  catalog  the registry of services — what exists, who owns it, what it is running; a service must be registered here before it can be deployed  [+3 verbs — `mesh catalog -h`]
  deploy   move a registered service's code to an environment, watch the rollout, or send traffic back to an earlier release  [+5 verbs — `mesh deploy -h`]
  secret   the credential values a service reads at runtime — set, read, or remove them per service and environment  [+4 verbs — `mesh secret -h`]

Global flags: --env <env> (default staging; any production write requires --yes), --json (machine-readable output on every verb), --yes (skip confirmation on destructive verbs)
Exit 0 = success. Non-zero = the operation did not happen; stderr names the cause.
```

Branch — the family's model (including the async fact, now at its home tier), one when-clause row per verb, schemas withheld:

```
mesh deploy — move a registered service's code to an environment, watch it land, and undo it.

A deployment is a service + an environment + a release. `new` creates one and returns a deployment id immediately; the rollout itself takes minutes, so exit 0 from `new` means accepted, not live. Every other verb reads or redirects deployments that already exist.

  new       start a deployment — async; follow with `status` (poll) or `logs` (stream) until it reaches live or failed
  status    where one deployment is now (pending | rolling | live | failed) — the check after `new`, and the first read when a service misbehaves
  logs      one deployment's build and rollout log stream — the reason, when `status` says failed or sits in rolling too long
  list      recent deployments for a service, newest first — how you find the id of the last good release
  rollback  point live traffic back at an earlier release — reach for this first when a deploy made things worse; faster and safer than deploying a fix

Arguments and flags live at `mesh deploy <verb> -h`.

Exit codes: 0 success (for `new`: accepted) · 1 rejected — bad ref, unknown service or deployment · 2 usage error · 3 deployment in a state this verb cannot act on (wait, then retry)
```

Leaf — as drafted (see the draft's `rollback -h` shape), minus hard-wrapping.

## The throughlines

What the weights get wrong by default, generalized from the diff:

- **Progressive disclosure is structural enforcement, not advice.** The draft's deepest error was one instinct applied twice: surface the next tier's content early (verb rows at root, signatures at branch), then compensate with an instruction to read deeper before writing. The review cut both the surfaced content ("lets the agent skip calling catalog -h") and the instruction ("It's gonna ignore this"). The correction inverts the mechanism: *withhold* the next tier's content and the agent must fetch it at the moment of use — an instruction can be ignored; an absence cannot. Disclosure is not token economy, it is the forcing function that places each fact in front of the agent exactly when it can act on it.
- **A warning promoted upward does not survive; every fact lives at exactly one tier.** The draft promoted "expensive mistake" facts to root on the argument that the mistake happens before the agent reads deeper. Review: "Doesn't belong at root level." The corrected structure gets the same protection for free — because the branch read is *forced* (the schemas exist nowhere else), the async caveat at the branch is guaranteed to be seen before `deploy new` can be invoked correctly. Same tier discipline downward: the global contract is stated once at root, and a branch restatement is "Redundant."
- **Every self-evident token is a defect, not a courtesy.** "Three families. Pick by what you are trying to learn or change" — "This is obvious. Wasted prompt." "There is no partial success" — "Cruft." A table restating when-clauses the verb rows already carried — "really bad to repeat self-evident information." The bar is not *is this true and helpful*; it is *would a capable reader have acted differently without it*.
- **Plain words that map to existing common terms; never invented or cute vocabulary.** "fleet" cost the reader a decode for zero information. The corrected tagline says "deploy services to your environments."
- **One logical line per paragraph.** No arbitrary hard-wrapping — the reader is a model, and a manual 80-column break is noise in every context window that loads it.

The meta-lesson: the draft *argued well for its mistakes*. Its rationale invoked real principles — token cost, safety facts arriving late, routing under time pressure — and reached wrong conclusions from them. When your own reasoning for surfacing content early sounds like that rationale, that is the signal to re-read this diff.
