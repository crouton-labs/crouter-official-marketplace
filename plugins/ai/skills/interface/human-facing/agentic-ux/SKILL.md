---
name: agentic-ux
description: First principles for designing human–agent interaction — the articulation barrier, evaluation-as-bottleneck, the automation×control framework, trust calibration, friction-as-safety, graceful failure, oversight at scale. Use when designing or reviewing how a human delegates to, steers, verifies, and stays in control of an AI agent, web or terminal.
type: playbook
keywords: [agentic-ux, human-agent-interaction, trust-calibration, articulation-barrier, autonomy, human-in-the-loop, oversight, automation-bias, delegation, mixed-initiative]
---

# Designing UX for agentic interaction

The interface contract changed. Pre-agentic UX optimized the *execution* path — how fast a user drives the tool to a result. With an agent, execution is nearly free; the user's cost moved to the two ends: **specifying intent** and **verifying output**. Design the ends, not the middle. A chat box optimizes neither.

Audience: future LLM agent sessions designing or reviewing agent-facing UX.

## When to use

- Designing how a human hands a goal to an agent, steers it mid-run, or signs off on its work.
- Reviewing an agentic feature and asking "does the human actually stay in control / can they verify this".
- Choosing an autonomy level, a confirmation policy, or where to put friction.
- Pushing back on "just add a chat interface" or "make it fully autonomous".

## When NOT to use

- Concrete UI patterns (streaming, diffs, tool-call cards, alt-screen) — [agentic-ui](../agentic-ui/SKILL.md).
- A CLI **consumed by** an agent (agent is the user) — [cli-design](../../agent-facing/cli-design/SKILL.md).
- Orchestrating agents internally, not the human seam — [multi-agent-orchestration](../../../orchestration/multi-agent-orchestration/SKILL.md).

## The core reframe

Agentic UX is **delegation**, not conversation. The job is not a good dialogue; it is that the user can (1) express intent without prose mastery, (2) see what the agent is doing and why, (3) verify the result cheaply, (4) intervene at any point, (5) recover when it is wrong. Optimize *time-to-verify*, not time-to-complete.

## First principles

**1. The articulation barrier is the default failure mode.** Prose prompting demands writing skill; writing is harder than reading, so the share of users who can't *articulate* intent exceeds the share who can't read it. A "prompt engineer" is evidence of a design failure, not a user failure. Reduce articulation cost: recognition over recall — suggested actions, point/select/demonstrate, spatial context-setting, learn-by-watching, let the model rewrite the prompt.

**2. Execution is cheap; evaluation is the bottleneck.** The user now spends their budget checking, not doing. Design for verifiability: plan-before-execute, provenance/citations, post-action receipts, diffs, conceptual breadcrumbs (synthesized conclusions, not raw logs).

**3. Automation and human control are orthogonal axes, not a tradeoff.** Reject "the autonomy slider is the only knob." Target the high-automation **and** high-control quadrant: reliable automation that amplifies agency. Excess computer control → automation surprises; excess human control → no leverage.

**4. Make capability, state, and rationale continuously legible.** Two gulfs widen with agents: *envisioning* (can't specify intent) and *evaluation* (can't read agent state). Counter both: state up front what the agent can/can't do and how well; expose plan and trace continuously, not on request; after each consequential action show a one-line "because X, did Y".

**5. Calibrate trust to actual reliability — neither max nor min.** Over-reliance (automation bias, rubber-stamping) and under-reliance (disuse) both degrade joint human+agent performance. Surface calibrated confidence and weak provenance prominently; make approvals *meaningful* (vary/justify them) so the human cannot rubber-stamp.

**6. Friction is a safety tool, scaled to consequence × reversibility.** Frictionless-UX dogma is wrong for agents. Gate irreversible / high-stakes / third-party-effect actions; keep low-stakes repeated actions frictionless. Prefer progressive, *earned* delegation over a binary on/off switch. No blanket "Approve All" for destructive actions.

**7. The agent will be wrong — design for graceful failure and cheap recovery.** Bound the action space; prefer reversible actions; provide efficient correction (guided > freeform), checkpoints/undo, and an always-available kill switch that actually halts in-flight work. Set stopping conditions (max iterations, checkpoints, blockers). A well-handled failure *builds* trust.

**8. Oversight does not scale linearly — design oversight, not control.** As autonomy and fleet size rise, approve *plans*, not step sequences; automate the watching (agents watching agents); keep the human practiced and in-context. Ironies of automation: more capable automation leaves the human the hardest cases after their skill and situational awareness have atrophied.

**9. Two user populations coexist: "show me the thinking" vs "let it rip."** Support both modes in one product; default by stakes (more legibility as consequence rises). Don't force the let-it-rip user through step approvals, or the inspector through a black box.

## The autonomy ladder

Operator → Collaborator → Consultant → Approver → Observer (≈ human-in-loop → on-loop → out-of-loop). Pick the rung by **risk × reversibility × latency × regulation**, not by model capability. Make the rung explicit, task-scoped, and adjustable mid-session. Full table, the redefined agentic usability metrics, the 18 interaction guidelines and 12 mixed-initiative factors, and the principle-vs-principle tension table: [reference.md](reference.md).

## Decision heuristics

- Reaching for a chat box as the primary surface → stop; chat *is* the articulation barrier in UI form. Add affordances that show capability.
- Action is irreversible or affects third parties → gate with a plain-language plan preview; never auto-approve.
- Tempted to show the full reasoning trace → collapse by default, scope detail to decision stakes; raw transparency overloads and disengages exactly like a black box.
- Adding a confirmation → ask "will this be rubber-stamped?" If yes it's friction theater; make it meaningful or remove it and gate higher.
- Claiming an action is undoable → verify side effects are inside the snapshot boundary; signal what *cannot* be rewound.

## Failure modes

- **Chat-as-default**: shipping a text box because it's cheap; offloads articulation + discoverability onto the user.
- **Rubber-stamping**: confirmations so frequent/uniform the human clicks through; automation bias with a consent UI on top.
- **Frictionless high-stakes**: irreversible actions one tap away because "good UX is frictionless".
- **Transparency overload**: dumping raw chain-of-thought/logs; disengagement identical to a black box.
- **Anthropomorphic over-promise**: human framing → unachievable expectations → disappointment-driven abandonment.
- **Undo theater**: "you can always undo" when emails were sent / APIs called outside the snapshot.
- **Expertise atrophy**: human designed into a passive monitor of a system they can no longer take over.
