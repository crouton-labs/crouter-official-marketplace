---
kind: knowledge
when-and-why-to-read: When you are building multi-agent LLM workflows — designing an orchestrator, coordinating parallel agents, splitting tasks across agents, or debugging multi-agent failures — this skill should be read because it covers the orchestration patterns and failure handling those systems need.
short-form: Design multi-agent LLM systems — orchestrator patterns, parallel coordination, pipelines, hierarchical delegation, failure handling.
rationale: >-
  Agents applied this guide's multi-lens and critic-loop examples as a default software workflow, producing review-of-review chains and repeated fresh validators even after a settled report. The guide must distinguish parallel evidence production from duplicated confidence-seeking.
---

# Multi-Agent Orchestration

Multi-agent systems are not an upgrade from single-agent. They're a different architecture with a different cost structure, failure profile, and operating envelope. The decision to use them should be deliberate, not aspirational.

The research is unambiguous: multi-agent systems show **+81% improvement on parallelizable tasks and -70% degradation on sequential tasks** — the same architecture, opposite outcomes depending on decomposition. [Google Research (2025)](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/)

For implementation patterns and code, see [[ai/orchestration/multi-agent-orchestration-reference]].

## When Multi-Agent Helps

Use multi-agent when the task has genuine parallelism — independent subtasks that don't share reasoning state:

- **Parallel research**: Multiple domains investigated simultaneously, results synthesized
- **Large codebases**: Independent modules, files, or subsystems that don't overlap
- **Independent implementation units**: Disjoint modules or subsystems built against a settled contract
- **Independent candidate solutions**: Multiple approaches produced without shared reasoning, when comparing alternatives is itself worth the coordination cost

The economic case requires high-value tasks. Multi-agent token cost runs ~15x higher than single-agent chat. [Anthropic (2025) — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

## When Multi-Agent Hurts

Don't use multi-agent for:

- **Sequential tasks with shared reasoning state** — planning, feature design, anything where step N depends on step N-1's reasoning
- **Simple, well-scoped tasks** — a single agent doesn't need coordination overhead
- **High file overlap** — agents touching the same files will conflict
- **Tasks where single-agent already hits ~45%+ accuracy** — above this threshold, adding agents yields diminishing or negative returns [Google Research (2025)](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/)

Independent multi-agent systems without orchestrator validation **amplify errors 17.2x**. Centralized systems with orchestrators contain this to 4.4x. [Google Research (2025)](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/)

## Architecture Patterns

### Orchestrator-Worker (Fan-Out)

**Use when**: Subtasks can't be predicted in advance — multi-file changes, parallel research, independent feature implementation.

**Key constraint**: Orchestrator owns the quality bar. Workers don't decide if they're done — the orchestrator does.

**Production evidence**: Anthropic's internal research system uses Opus as orchestrator with Sonnet subagents, outperforming single-agent Opus 4 by 90.2%. Typical spawn count: 3-5 subagents. [Anthropic (2025)](https://www.anthropic.com/engineering/multi-agent-research-system)

### Pipeline (Sequential Chain)

**Use when**: Natural sequential dependencies — plan → implement → review → validate.

**Critical vulnerability**: Corrupted output from one stage compounds at each subsequent step. [MAS-FIRE (2026)](https://arxiv.org/html/2602.19843)

**Mitigation**: Give every stage an objective exit criterion and place one independent review at a material-risk boundary. Review is not required between every pair of stages; repeated critic cycles are sequential coordination overhead unless each cycle is driven by a newly observed failure.

### Independent Alternatives / Debate

**Use when**: The task admits genuinely independent candidate solutions and the choice between them is consequential — for example, hard math reasoning or a high-stakes architecture decision with several plausible approaches.

Produce the candidates in parallel, compare them once against criteria declared before seeing the answers, and let one owner choose. This is not a default review pattern: several agents expressing confidence about the same artifact do not create independent evidence.

### Hierarchical Delegation

**Use when**: Large features spanning 15+ files or 3+ subsystems — when a single orchestrator would need too much context.

**Key constraint**: The coordinator is the abstraction boundary. Sub-agents are invisible to the parent orchestrator.

### Stateless Orchestrator Cycles

Prevents context exhaustion on sessions that run for hours. State persists via files, not agent memory — each cycle gets a clean context window with only the latest state.

**Proven in production**: Sisyphus, Anthropic's research system, and similar architectures all use this pattern.

## The Coordination Tax

Every handoff between agents is a risk point. The most common failure category in production multi-agent systems — **37% of all failures** — is inter-agent coordination breakdown, not individual LLM limitations. [Cemri, Pan, Yang et al. (2025) — Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657)

Before spawning a child, apply three tests:

1. **Independence** — can it start now without another child's output?
2. **Distinct outcome** — does it own a proper subset or an independent candidate rather than repeating another agent's task?
3. **New evidence** — will its result add facts, implementation, or executed proof that is not already settled?

If any answer is no, serialize the dependency or keep the work in the current agent. Available capacity is not a reason to create work.

The three tests do not hold on their own, because the default pull is toward spawning: given a plausible split, an agent delegates rather than continues, and every marginal case reads as passing. An orchestrator prompt that only describes when delegation *helps* therefore produces over-delegation. Write the ceiling as its own instruction beside the tests — delegate only genuinely independent, sizeable tracks; do not delegate work the orchestrator can finish in a handful of tool calls; use one child where one suffices; never spawn a child to check the orchestrator's own work.

## Review Is a Bounded Check

For a substantive artifact, use one independent review assignment: one reviewer when the surface fits its window, or one bounded coordinator when coverage genuinely must split. Correctness, security, architecture, efficiency, and tests are lenses for that assignment, not an automatic reviewer roster. The coordinator partitions by units or lenses, not both, and owns synthesis.

A delivered verdict is settled evidence. The owner fixes or dismisses findings and closes them with objective validation — acceptance criteria, targeted tests, build/typecheck, or a real-runtime probe. A second reviewer, validation-of-synthesis, dismissal audit, or repeat-until-clean critic adds opinion rather than evidence unless the fix introduced a genuinely new, previously unreviewed high-risk surface.

## Common Failure Modes

**1. Vague agent instructions** — "Look at the existing auth middleware" fails. "Implement auth middleware per `context/requirements-auth.md` and `context/design-auth.md`. Reference `context/conventions.md` for middleware patterns." works. Each agent instruction must be self-contained.

**2. Spawning too many agents** — Early versions of Anthropic's research system spawned 50+ subagents for simple queries. Start with the smallest set implied by independent units and add another only when it owns uncovered work that can proceed now. [Anthropic (2025)](https://www.anthropic.com/engineering/multi-agent-research-system)

**3. Framework over-engineering** — "The most successful implementations weren't using complex frameworks or specialized libraries." [Anthropic (2024) — Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents)

## Prompt Asymmetry: Orchestrators vs Workers

Orchestrators and workers have opposite prompt requirements:

| Aspect | Orchestrator | Worker |
|--------|-------------|--------|
| Scope | Broad — sees the full session | Narrow — one specific task |
| Ambition | High — sets the quality ceiling | Low — disciplined execution |
| Primary failure | Process expansion after the goal is already provable | Scope creep |
| Context | Full session state | Task instruction + relevant files only |
| Lifecycle | Killed and respawned each cycle | Runs to completion or failure |

Orchestrator prompts need decision heuristics — concrete triggers for when independent work earns a child and when available evidence means stop. Worker prompts need scope boundaries and a reporting protocol. See [[ai/orchestration/multi-agent-orchestration-reference]] for annotated examples of both.

## Decision Framework

| Task characteristic | Architecture | Why |
|---|---|---|
| Parallelizable subtasks | Orchestrator-worker | +81% on parallelizable tasks |
| Sequential with feedback | Pipeline with objective stage gates | Avoids coordination where no parallelism exists |
| Correctness-critical artifact | One independent review + executed validation | Critique finds flaws; behavior evidence closes them |
| Independent candidate solutions | Bounded alternatives + one comparison | Parallelism produces distinct answers rather than repeated opinions |
| Large scope (15+ files) | Hierarchical delegation | Sub-orchestrators manage complexity |
| Simple/well-scoped | Single agent | Avoids 17.2x error amplification |
| Long-running (hours) | Stateless orchestrator cycles | Prevents context exhaustion |
