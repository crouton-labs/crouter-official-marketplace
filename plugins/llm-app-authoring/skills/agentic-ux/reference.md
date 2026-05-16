# Agentic UX — reference

Lookup layer for the `ux` playbook: source canon, the autonomy ladder, redefined
metrics, the two foundational checklists (Microsoft HAX 18, Horvitz 12), and the
tension table. Load when you need the underlying frameworks or attributions.

## Canonical sources (2024–2026 priority)

| Source | Date | Load-bearing takeaway |
|---|---|---|
| Nielsen, "The Articulation Barrier" (uxtigers) | 2023, upd. 2025 | Prose prompting excludes most users; writing > reading in difficulty. Hybrid UI (intent + GUI) is the fix. "Prompt engineer" = design failure. *Contested:* the "<20% sufficiently articulate" figure is his stated estimate, not measured. |
| Nielsen, "Intent-Based Outcome Specification" / "First New UI Paradigm in 60 Years" | 2023 | Third UI paradigm: state the *outcome*, not the steps. Reversing locus of control demands refinement loops + GUI fallback. |
| Nielsen, "Intent by Discovery" (uxtigers) | Mar 2025 | Redefine usability metrics for agents (table below). "Execution is cheap; evaluation is the bottleneck." Friction is a safety feature for irreversible actions. Design against automation bias. |
| NN/g, "Accordion Editing and Apple Picking" | 2023 | Users *always* iterate; single-pass UIs fail. Support multi-directional refinement + point-to-select on prior output. Hybrid = conversation + direct manipulation. |
| NN/g, "Generative UI and Outcome-Oriented Design" | Mar 2024 | Design constraints/guard rails (must/should/never show), not pixels. Personalization can serve accessibility; risks: consistency loss, privacy, bias propagation. |
| NN/g, "Research Agenda for Generative AI in UX" | Jun 2025 | Design against *both* overreliance and underutilization. Dual-actor UIs need labeled human- vs agent-initiated actions + override points. |
| Smashing Mag, Piras, "Designing AI Beyond Conversational Interfaces" | Feb 2024 | Empty text box has no signifiers — use affordances that reveal capability. Direct manipulation when doing < describing. Offload prompt engineering. Match interface to task, not to model capability. |
| LukeW, "Durable Patterns in AI Product Design" + agent series | 2025–2026 | Capability/context/output-complexity are the 3 root problems. Suggested questions, citations, multimedia-over-text, progressive disclosure, learn-by-watching. Agentic ≠ chat: dual-pane process/result, session-summary homepage, approve plans not steps. |
| Microsoft HAX Toolkit, "Guidelines for Human-AI Interaction" (Amershi et al., CHI 2019) | 2019, maintained | The 18 guidelines (below). Canonical interaction-phase checklist. |
| Google PAIR, People + AI Guidebook | maintained | Mental models, set expectations, appropriate (not maximal) explanation, graceful failure builds trust. |
| Shneiderman, *Human-Centered AI* | 2020/22 | 2D HCAI: automation and human control are orthogonal; aim high-high. Reliable / Safe / Trustworthy at team / org / industry levels. |
| Horvitz, "Principles of Mixed-Initiative UIs" (CHI 1999) | 1999 | The 12 factors (below). Foundational theory for an agent acting under uncertainty about user intent. |
| Norman, Gulf of Execution / Evaluation | classic | Agents widen both gulfs — "Gulf of Envisioning" (Subramonyam, CHI 2024) for intent + evaluation gulf for state. |
| Parasuraman & Riley, "Use, Misuse, Disuse, Abuse" | 1997 | Trust calibration, not maximization: misuse (over-trust) and disuse (under-trust) both hurt joint performance. |
| Bainbridge, "Ironies of Automation" | 1983 | Better automation makes the human role *harder*, not easier — operator left the worst cases with atrophied skill. |
| OpenAI, "Practices for Governing Agentic AI Systems" | 2024 | Legibility, interruptibility (kill switch = ultimate control), automated monitoring at scale, accountability diffusion. |
| Anthropic, "Building Effective Agents" | Dec 2024 | Checkpoints, stopping conditions, sandbox + guardrails before autonomy; simplest design that works. |
| "Levels of Autonomy for AI Agents" (arXiv 2506.12469) | 2025 | Operator → Collaborator → Consultant → Approver → Observer; the cleanest current articulation of the ladder. |

## The autonomy ladder

| Rung | Human role | Loop | Use when |
|---|---|---|---|
| Operator | Invokes each action | in-loop | High stakes, low trust, learning the agent |
| Collaborator | Shared work, can take over | in-loop | Pairing on a task, mid trust |
| Consultant | Agent plans+executes; human steers via feedback | on-loop | Bounded, reversible tasks, established trust |
| Approver | Human only unblocks/approves consequential actions | on-loop | Long-horizon, mostly-safe, gated escalations |
| Observer | Full autonomy; logs + emergency stop | out-of-loop | Low stakes or fully reversible, high trust, scale |

Choose by **risk × reversibility × latency × regulation**, not capability. Make
the rung explicit, task-scoped, adjustable mid-session. Track "setting churn"
(how often users drop the rung after a failure) as a trust signal.

## Redefined agentic usability metrics (Nielsen 2025)

| Classic | Agentic replacement |
|---|---|
| Discoverability | Intent-capture accuracy |
| Error prevention | Clarification quality |
| Time to learn | Ease of delegation |
| Execution efficiency | **Verification efficiency (evaluability)** |
| Status visibility | Execution transparency |
| Satisfaction | **Trust calibration** |

## Microsoft HAX — the 18 guidelines

- **Initially**: G1 make clear what the system can do · G2 make clear how well it can do it.
- **During interaction**: G3 time services to context · G4 show contextually relevant info · G5 match relevant social norms · G6 mitigate social bias.
- **When wrong**: G7 support efficient invocation · G8 support efficient dismissal · G9 support efficient correction · G10 scope services when in doubt.
- **Over time**: G11 make clear why the system did what it did · G12 remember recent interactions · G13 learn from user behavior · G14 update and adapt cautiously · G15 encourage granular feedback · G16 convey consequences of user actions · G17 provide global controls · G18 notify users about changes.

G8/G9/G17 are the agent "brakes"; G14/G18 manage trust under model drift.

## Horvitz — the 12 mixed-initiative factors

(1) Develop significant value-added automation (don't automate what direct
manipulation already does well) · (2) consider uncertainty about the user's
goals · (3) consider the user's attention in timing services · (4) infer ideal
action under costs/benefits/uncertainty · (5) **employ dialog to resolve key
uncertainties** (vs. acting on a bad guess) · (6) **allow efficient direct
invocation and termination** · (7) **minimize the cost of poor guesses** · (8)
scope precision of service to uncertainty ("do less but correctly") · (9)
provide efficient agent–user collaboration to refine results · (10) socially
appropriate behavior · (11) maintain working memory of recent interactions ·
(12) continue to learn by observing. The richest single checklist for an agent
that acts under uncertainty — especially #5, #6, #7.

## Tension table — these principles conflict; resolve per context

| Tension | Resolution |
|---|---|
| Automation value vs. ironies/complacency | Legibility + forced *meaningful* engagement, not more autonomy |
| Ask-when-uncertain (HITL) vs. don't-interrupt / latency (HOTL scale) | Cost–benefit-gated dialog; escalate only on consequence × uncertainty |
| Transparency vs. cognitive overload / rubber-stamping | *Appropriate* explanation scoped to decision stakes, not maximal |
| High autonomy (efficiency) vs. control & accountability | Shneiderman reframe: high automation *with* high control, not a trade |
| Adaptivity / learn over time vs. predictability & stable mental model | "Update cautiously" (HAX G14) + notify on change (G18) |
| Steerability vs. simplicity | Minimal composable controls; reduce abstraction layers (Anthropic) |
