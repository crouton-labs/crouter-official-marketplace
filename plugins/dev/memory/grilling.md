---
kind: knowledge
when-and-why-to-read: When the user asks to be grilled, wants a plan or decision stress-tested, or you are tasked with drawing a set of decisions out of them, this knowledge should be read because asking in the wrong order or asking questions with obvious answers wastes the user's turns and leaves branches of the decision silently assumed.
short-form: Grill the user down a design tree; each round is one inbox page asking every independent frontier question; skip obvious answers; look up facts yourself.
rationale: Grilling rounds asked one question at a time, asked questions whose answer was obvious, and asked the user for facts an agent could look up.
slash: true
surfaces:
  - on: boot
    at: preview
---

Interview the user relentlessly until you reach a shared understanding of a plan, decision, or idea. Map it as a **design tree**: every decision branches into the decisions that hang off it.

## Ask the whole frontier at once
The **frontier** is every decision whose prerequisites are already settled — the questions you can ask *now* without guessing at answers you have not heard yet. Ask every frontier question in one round, as long as no question's options or framing depend on another question in the same round. When two frontier questions are coupled — one's answer would change the other's options — ask the one that unblocks more of the tree now and hold the other for the next round. Each round's answers reshape the tree: settled decisions push the frontier outward and unblock questions that depended on them, and some questions stop being worth asking. Recompute the frontier after every round.

## Deliver every round through the inbox
Every round is one `crtr human` page projected to the inbox — never questions written as prose in a reply. Read `crtr human -h` for the page contract before writing the first one.

- Write the page to `$CRTR_CONTEXT_DIR/pages/grill-<subject>-<round>.tsx` and send it with `crtr human send --page <path> --inbox`.
- Give each question its own `<Step>`, because the reader sees one step at a time.
- Put everything a question needs in that question's own `body`, because page-level prose is not on screen while they answer.
- After sending, end your turn. The answer wakes you; do not poll.

## Question format
Each question is one `<UserQuestion>` inside its `<Step>`:

- **Step title** — the decision it settles, in a few words.
- **`label`** — the question itself.
- **`body`** — what depends on this decision, then the choice itself, then your recommendation and why. Write it as a braced string (`body={"…\n\n…"}`) so the paragraph breaks render.
- **`options`** — 2–4 real choices. Each `description` gives what the option buys, what it costs, and who pays later, in the same terms for every option, so the user can check your recommendation without redoing the analysis.
- **`recommended: true`** on the option you would pick.
- **`allowFreetext`** so the user can answer with something you did not list.

## Only genuine decisions
Ask only when the choice has real tradeoffs and the user could reasonably pick the option you would not recommend. When one answer is obviously better, do not ask — state it as settled in one line ("Settled: X, because Y") and move on; the user can object. A question with one viable answer spends the user's turn on nothing. List what you settled this way in the body of the round's first question, so the user sees it before answering.

## Facts are yours, decisions are theirs
Finding *facts* is your job, never the user's. When a frontier question needs a fact from the environment (the filesystem, a prior project, a vendor's docs), dispatch a sub-agent to find it; do not ask the user for anything you could look up. Do not block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait; send the rest of the frontier now. The *decisions* are the user's: put each to them and wait.

## Unfinished grilling
If you yield before the frontier is empty, link this memory as `[[dev/grilling]]` from your roadmap, so the fresh window knows it is still mid-grilling and reads the method before its next round. Keep the link until the frontier is empty, then remove it.

## Done
The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Record the settled decisions where the work keeps its decisions (a spec, a design doc, a memory). Do not act on them until the user confirms you have reached a shared understanding.
