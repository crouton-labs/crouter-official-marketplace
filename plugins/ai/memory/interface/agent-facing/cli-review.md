---
kind: knowledge
when-and-why-to-read: When you must judge whether an agent-driven CLI actually follows the house CLI-design rules — its subcommand tree, `-h` disclosure, stdout/stderr split, exit codes, or error shapes — this workflow should be read because the rules it checks are semantic (rubric quality, redundancy leakage, progressive disclosure) and a mechanical linter cannot see them, so the review runs as an agent that reads the help tree against the spec and returns severity-rated findings.
short-form: Walk a target CLI's `-h` tree and critique it against the house CLI-design corpus, returning severity-rated findings that each cite the principle, quote the offending output, and propose the fix.
slash: true
rationale: The three CLI-design corpus docs encode rules a linter cannot enforce — whether a rubric discriminates, whether a fact leaks across tiers, whether disclosure is withheld structurally rather than by instruction. Silas approved shipping the check as an agent workflow (2026) rather than a mechanical linter for exactly that reason.
surfaces:
  - on: boot
    at: name
---

# /ai:cli-review — critique an agent-driven CLI against the house corpus

Review one CLI for how well it serves an LLM agent as its sole reader: $ARGUMENTS

The target is a shell command an agent drives. Judge its help tree, output split, and error shapes against [[ai/interface/agent-facing/cli-design]] (the spec), [[ai/interface/agent-facing/cli-design-reference]] (the spec applied), and [[ai/interface/agent-facing/cli-design-critique]] (the annotated failure catalog). Return findings, not a rewrite: name the defect, cite the rule, quote the evidence, propose the corrected text.

## 1. Resolve the target

Take the command name from `$ARGUMENTS`. When none is given, ask one focused question for it and stop until answered. Confirm the command is on `PATH` and runs; a target you cannot invoke cannot be reviewed against its real output.

## 2. Walk the help tree breadth-first, bounded

Collect the actual `-h` output the agent would read, level by level: root `-h` first, then every branch `-h`, then every leaf `-h`. Capture each node's raw text verbatim — the review quotes it, so paraphrase loses the evidence.

Bound the walk before starting and honor the bound: cap the number of nodes captured (a few dozen leaves is enough to judge a tree), and prefer breadth so every branch is represented over exhausting one deep subtree. When the tree exceeds the cap, say so explicitly in the report — name which subtrees were sampled and which were left unwalked — so a clean finding set is never mistaken for full coverage. Never let discovery calls run unbounded.

## 3. Probe the output split and one real error

Two facts do not appear in `-h` and must be observed directly:

- **stdout/stderr split.** Run one representative leaf and check the contract test from the spec: `cmd > /dev/null` should hide the whole result, and `cmd 2> /dev/null` should hide only diagnostic chatter. A result on stderr or status noise on stdout is a finding.
- **Error shape.** Issue one deliberate bad invocation — a missing required flag, an invalid enum value, or an unknown subcommand — and capture the real error. Judge it against the spec's error contract: does it state what was received, what was expected, and a concrete `Next:`? Is validation complete rather than first-failure? Does a schema-class error route the agent to `-h` instead of handing back a one-field patch? Quote the actual error in the finding.

## 4. Read the corpus, then judge

Read all three corpus docs before scoring, not after. Judge the collected help against the spec's numbered principles and the critique's failure catalog. The high-yield checks:

- **Progressive disclosure is structural (principles 5, 8; critique throughline).** Does the root list families only, or does it enumerate every verb — letting the agent skip the branch `-h` where schemas and cautions live? Do branch rows carry full signatures instead of withholding them to the leaf? Disclosure withheld by absence passes; disclosure "enforced" by an instruction to read deeper fails.
- **Redundancy is leakage (principle 11).** Every fact lives at exactly one tier. Globals restated at a branch, a when-clause table restating rows the children already own, a promoted "expensive mistake" warning duplicated upward, or a focused `--flag -h` repeating the ordinary leaf contract — each is a finding.
- **Selection rubric quality (principles 5, 16; branch format).** Does each `whenToUse` discriminate — a standalone statement of when to reach for this child, contrasting the siblings it is confused with — or does it restate the child's mechanics, tell the agent to read the child's `-h`, or gloss every child 1:1 in the branch model?
- **Self-evident and self-justifying tokens (anti-patterns).** Obvious framing ("pick by what you want to do"), cruft ("no partial success"), motivational why-to-use prose on a node's own `-h`, and entry-gating ("run only when…") all cost budget for zero behavior change. The bar is: would a capable reader have acted differently without this token?
- **Structure and vocabulary (principles 6, 7; anti-patterns).** Noun-verb with verbs last, one canonical name per operation (no aliases, no short flags), plain words that map to common terms (no invented or cute jargon), one logical line per paragraph (no hard-wrapping), a spec at each leaf rather than examples.
- **Effects and I/O (principles 4, 9, 10; anti-patterns).** Persistent effects declared at the leaf, prompt-shaped stdout rather than raw JSON as the default, no ANSI or decoration, no pagers or TTY-dependent behavior, stable output order, cursor pagination on list leaves, and a job-handle split for anything long-running.

## 5. Deliver severity-rated findings

Rate every finding by the cost it imposes on the agent:

- **Critical** — the agent is led to a wrong or failing invocation, or a mutating effect is undeclared. Broken progressive disclosure on a high-consequence mutating leaf, an undeclared side effect, an error that gives no path to recovery.
- **Major** — the agent wastes a round trip or reads a materially worse tree. First-failure validation, a rubric that does not discriminate so the agent picks wrong, a fact leaked across tiers that forces reconciliation.
- **Minor** — measurable token waste or a smaller friction. Self-evident prose, a restated global, a redundant routing table.
- **Cosmetic** — real but low-cost. Hard-wrapping, an invented term where a common one exists, decoration in output.

Each finding states: the principle or anti-pattern violated (by name and number), the offending output quoted verbatim, and the corrected text that resolves it. A finding without a proposed correction is an observation, not a finding — supply the fix.

Close with the three highest-leverage fixes: the changes that remove the most agent cost per edit, ordered. If the walk was truncated, restate that here so the ranking is read as scoped to what was sampled.

Lean toward ASD-STE100 throughout the report: state each defect once, keep the exact quote and principle reference, and cut inferable text.
