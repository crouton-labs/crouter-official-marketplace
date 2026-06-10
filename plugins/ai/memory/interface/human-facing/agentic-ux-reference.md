---
kind: reference
when-and-why-to-read: When you are applying the agentic-ux skill and follow its pointers to worked examples, the full catalog, or the annotated reference, this reference should be read because it holds the deep-dive material the skill body links to.
short-form: Deep-dive companion to the agentic-ux skill — worked examples and the full catalog the skill body points to.
system-prompt-visibility: none
file-read-visibility: none
---
# Agentic UX — reference

Lookup layer for the agentic-ux playbook: the autonomy ladder, the redefined
metrics, the two foundational checklists (18 interaction guidelines, 12
mixed-initiative factors), and the tension table. Load when you need the
underlying frameworks.

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

## Redefined agentic usability metrics

| Classic | Agentic replacement |
|---|---|
| Discoverability | Intent-capture accuracy |
| Error prevention | Clarification quality |
| Time to learn | Ease of delegation |
| Execution efficiency | **Verification efficiency (evaluability)** |
| Status visibility | Execution transparency |
| Satisfaction | **Trust calibration** |

## The 18 human–AI interaction guidelines

- **Initially**: G1 make clear what the system can do · G2 make clear how well it can do it.
- **During interaction**: G3 time services to context · G4 show contextually relevant info · G5 match relevant social norms · G6 mitigate social bias.
- **When wrong**: G7 support efficient invocation · G8 support efficient dismissal · G9 support efficient correction · G10 scope services when in doubt.
- **Over time**: G11 make clear why the system did what it did · G12 remember recent interactions · G13 learn from user behavior · G14 update and adapt cautiously · G15 encourage granular feedback · G16 convey consequences of user actions · G17 provide global controls · G18 notify users about changes.

G8/G9/G17 are the agent "brakes"; G14/G18 manage trust under model drift.

## The 12 mixed-initiative factors

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
| High autonomy (efficiency) vs. control & accountability | High automation *with* high control, not a trade |
| Adaptivity / learn over time vs. predictability & stable mental model | "Update cautiously" (G14) + notify on change (G18) |
| Steerability vs. simplicity | Minimal composable controls; reduce abstraction layers |
