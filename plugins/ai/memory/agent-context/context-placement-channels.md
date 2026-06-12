---
kind: knowledge
when-and-why-to-read: When you are building or extending an agent system — deciding where a capability, instruction, or piece of context should live (system prompt, tools, CLI, memory, injection, hooks) — this skill should be read because choosing the wrong channel is the root cause of bloated prompts and agents that can't find what they need.
short-form: The placement channels of an agent system — system prompt, tool definitions, CLI + progressive disclosure, output-as-pointer, memory pointers, on-read injection, first-message context, task messages, environment blocks, hooks — and what each is uniquely good for.
system-prompt-visibility: name
file-read-visibility: none
---
# Context Placement Channels

An agent system has a fixed menu of places context can live. Each channel differs on three axes: **always-loaded vs on-demand** (does it cost tokens every turn, or only when reached for), **pushed vs pulled** (does the system surface it, or does the agent fetch it), and **what it carries** (behavior, capability, knowledge, or task). Most agent-design failures are placement failures: the information exists, but it sits in a channel where it's either invisible when needed or burning attention when not.

The governing rule: **always-loaded context is the scarcest resource in the system.** Every channel below is ultimately a strategy for keeping the always-loaded surface minimal while keeping everything else one cheap hop away. Default to pointers; promote to always-loaded only what must hold on every turn.

## The channels

### System prompt
Durable behavior: identity, hard constraints, decision frameworks, the routing layer to everything else. It is a front door, not a manual — directives shaped "when X, do Y (a pointer), because Z," with the depth living in the channels below. Always loaded, position 0, trained authority, cacheable when stable. → [system-prompts.md](system-prompts.md) for what belongs in it and the placement mechanics; [prompting-effectively.md](prompting-effectively.md) for the craft.

**Failure mode:** treating it as the manual. Bloat doesn't degrade gracefully — past a point the model starts *ignoring* instructions, including the ones that mattered.

### Tool / function definitions
The obvious channel, and the trap: every tool's name, description, and parameter schema is in context **on every single turn**, whether or not the turn touches it. Fifty tools is easily 10k+ tokens of permanent overhead, and each description competes for attention with your actual instructions.

**Heuristic: a CLI beats tools almost every time.** For pure agent performance, a CLI with progressive disclosure outperforms a tool catalog — the agent pays for capability documentation only when it reaches for the capability. Tools win only when system constraints force them: the agent has no shell/exec access, or the harness can't run commands. That is a constraint of the platform, not a reason to prefer tools.

### CLI with progressive disclosure
The antidote to tool bloat. The agent knows one thing always (the command exists, one line of when-to-use); everything else discloses on demand: `cmd -h` → subcommand list → `cmd sub -h` → full contract. Arbitrarily deep capability at near-zero standing cost. Design the `-h` ladder as deliberately as you'd design the tool schema — it *is* the documentation channel. → [[cli-design]].

**Failure mode:** help text written for humans (prose walls, no schemas) — the agent guesses instead of reading; or a flat namespace where discovery costs more than the standing tool definitions would have.

### CLI output as steering — command hints and follow-ups
Stdout is read as a continuation of the agent's prompt — use it. Output can carry next-step hints ("run X to see the full diff"), road-sign guidance at decision points, and corrections ("this command is a kickoff; don't poll"). This is the only channel that steers the agent *mid-task, exactly at the moment of relevance*, without a standing cost.

**Failure mode:** output formatted as data for parsing rather than prose for acting on — or hints so verbose they become their own bloat.

### Tool/CLI output as pointer
Never make a tool return everything when it can return a handle. Three shapes:
1. **Output to file, return the path** — the agent reads as much as it needs, when it needs it.
2. **Keys + preview + how to read more** — return the high-level structure and a sample, with explicit instructions for retrieving the rest.
3. **Pointer to logs for async work** — a long-running operation returns immediately with where its output is streaming; the agent checks in on its own schedule.

This converts output from pushed (full payload in context, now) to pulled (in context only if consulted). Pairs with the job-handle pattern in [[cli-design]].

### Memory / knowledge pointers (pulled)
Reference documents the agent fetches by name. The disclosure ladder: the always-loaded surface carries at most a *name* or a one-line *routing statement* ("when {circumstance}, read this because {payoff}"); the body costs nothing until read. This is where knowledge, playbooks, and reference material belong — never in the system prompt.

**Failure modes:** routing lines that paraphrase content instead of naming the situation (the agent can't tell when to read); and the **satisficing trap** — never surface an abbreviated version of a document as a middle disclosure rung. An agent handed a summary believes it has enough and never reads the rest; an abbreviation in context actively suppresses the full read. Disclosure is name → routing line → whole thing.

### On-read / positional injection (pushed)
Context that fires when the agent touches a file or directory — the doc lives *next to the code it explains* and surfaces the moment someone reads that code. Unlike pointers, the agent doesn't choose this; the system pushes it at the relevant moment. Ideal for local invariants, gotchas, and "before you edit this, know X" — knowledge that's worthless globally and critical locally.

**Failure mode:** global guidance attached positionally (fires constantly, trains the agent to skim past injections), or load-bearing context attached to a file nobody reads on the relevant path.

### Injected first message
Context you always want loaded but that isn't behavior: project conventions, the current state of the work, standing reference. Putting it in the first user message instead of the system prompt keeps the system prompt stable (cacheable, behavioral) while still guaranteeing presence. The model also treats it correctly — as material to consult, not identity to embody.

**Failure mode:** behavioral rules injected here get treated as suggestions; identity belongs in the system channel.

### Task / initial messages
The work order: an automatic message that gives the agent its task — what to do, the acceptance criteria, the handles it needs (paths, ids, constraints). Carries everything specific to *this* run and nothing durable. The discipline runs both ways: no task detail baked into the system prompt, no standing behavior smuggled into the task.

**Failure mode:** the kitchen-sink spawn prompt — re-explaining context that a pointer (a file path, a doc name) would carry better, leaving the child to drown in secondhand summary instead of reading the source.

### Environment block
Auto-injected ambient facts: cwd, date, git state, platform — the project-context snapshot. Keep it **very brief, with pointers out**: a few lines of what's true right now plus where to look for more, not an inlined project encyclopedia. Its value is that it's current and unconditional; its danger is that every line is a permanent per-turn tax.

### Hooks — live steering
Event-triggered injection: when action X happens, inject context Y. The hardest channel to use well — most steering is better done by the channels above — but unbeatable when the trigger is mechanical and obvious: on edit of a generated file, inject "this is generated, edit the source"; on a dangerous command, inject the policy; on a failed lint, inject the fix instructions. The trigger condition must be precise; hooks that fire broadly become noise the agent learns to ignore.

## Choosing

- **Must hold on every turn, everywhere** → system prompt (and keep it a front door).
- **A capability the agent invokes** → CLI with `-h` disclosure; tools only when the platform forces it.
- **Knowledge / reference / playbook** → pulled pointer with a sharp routing line.
- **Locally-relevant knowledge tied to specific files** → on-read injection beside those files.
- **Always-relevant content that isn't behavior** → injected first message (keeps the system prompt cacheable).
- **Specific to this run** → task message, carrying handles not summaries.
- **Ambient session facts** → environment block, a few lines plus pointers.
- **Produced by tools** → return pointers (file, preview+keys, log), not payloads.
- **Steering tied to a mechanical trigger** → hook.

When two channels both work, prefer the one with the lower standing cost — pulled over pushed, on-demand over always-loaded. The agent can always read more; it can never unread the bloat you forced on it.
