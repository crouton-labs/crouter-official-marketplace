---
kind: knowledge
when-and-why-to-read: When you are applying the agentic-ui skill and follow its pointers to worked examples, the full catalog, or the annotated reference, this reference should be read because it holds the deep-dive material the skill body links to.
short-form: Deep-dive companion to the agentic-ui skill — worked examples and the full catalog the skill body points to.
system-prompt-visibility: none
file-read-visibility: none
---
# Agentic UI — pattern catalog

Lookup layer for the agentic-ui playbook. Web catalog (30), terminal catalog
(20), the alt-screen decision matrix, 2024–2026 consensus + open debates.
Web pattern: name → problem → use → avoid. Terminal pattern: name →
constraint → solution.

## Web pattern catalog

### Streaming & progressive rendering
1. **Token streaming** — latency feels broken without feedback → any text/code gen → avoid when output is structured & not partially actionable, or it leaks internal monologue.
2. **Skeleton/shimmer** — blank gap before first token → before first token / tool results / known-shape components → avoid if content arrives <300ms (flash).
3. **Streaming tool inputs** — tool calls opaque while args generate → show partial inputs + target skeleton (state model: input-streaming → input-available → output-available) → avoid for destructive tools (half-formed arg → early approve).
4. **Generative/dynamic UI** — text is lossy for structured/interactive results → map tool output to components → avoid gratuitous componentizing of prose; sandbox untrusted UI.

### Reasoning disclosure
5. **Collapsed reasoning trace** — CoT builds trust but is noisy/misleading → collapsed summary, auto-collapse when answer starts → avoid on simple tasks; never leak raw deltas.
6. **Collaboration-over-reasoning** — for artifacts, *what changed* > the mind → surface targeted edits as diffs → avoid in pure Q&A. *Open debate: show reasoning vs show collaboration — unresolved.*

### Tool-call / action visualization
7. **Live activity log / step list** — long runs are a black box → streaming step/source list in a sidebar → avoid single-shot; for delegated background work summarize instead.
8. **Tool-call card** — raw function JSON unreadable → labeled card w/ status, collapsible I/O → avoid hiding side-effecting calls; don't over-verbose trivial reads.

### Citations & grounding
9. **Inline citation / source attribution** — synthesized answers unverifiable → factual claims, doc/web/DB summaries; numbered footnotes or source chips, hover preview → avoid in brainstorming; risk: laundering hallucinations (citation present ≠ supports claim).

### Approval, confirmation & permission
10. **Intent preview / plan-before-execute gate** — users feel ambushed → plan summary + Proceed/Edit/I'll-do-it before irreversible/financial/sharing/large-scope → avoid for low-risk pre-approved repeats.
11. **Autonomy dial (tiered levels)** — one-size autonomy erodes trust after a failure → Observe→Plan→Act-w/-confirm→Autonomous, per task type; watch "setting churn" → avoid stateless one-shots.
12. **Allow-once vs allow-always (allowlist)** — re-confirming safe actions is death by a thousand prompts → scope the grant (session/repo/global) → never blanket-allow destructive (`rm`, deploy, payment).

### Diff review & change preview
13. **Inline diff + accept/reject (partial)** — bulk-apply is unsafe → colored diff, per-hunk/line accept, multi-file pane → avoid for trivial single-line (tab is faster).
14. **Next-edit suggestion** — one change implies follow-ons → predict next edit, tab to apply → avoid at low confidence (trains users to ignore).

### Undo / checkpoint / rollback
15. **Checkpoint timeline / rewind** — one mistake feels catastrophic → snapshot before each action, click to restore → avoid implying it reverses external side effects.
16. **Action audit log + time-boxed undo** — autonomous real-world effects need accountability → chronological log w/ status + prominent Undo → avoid only for truly zero-cost actions.

### Steering mid-task
17. **Queued follow-ups + immediate interject** — corrections occur mid-run → queue (execute in order) + bypass key to interject now → don't silently drop the queue; show it.
18. **Mid-run redirect / refocus** — long runs drift → interrupt to refine focus / adjust sources; editable plan during exec → avoid when restart is cheaper.

### Background / async + handoff
19. **Delegate-and-notify** — long tasks shouldn't block; babysitting defeats the point → fire-and-forget in a sandbox, notify on done/needs-you, hand back a summary not a transcript → avoid for short interactive or clarification-heavy tasks.
20. **"Needs you" escalation / clarify-up-front** — confident catastrophic guesses under ambiguity → ask before starting + escalate on genuine ambiguity (healthy ~5–15%) → avoid over-asking in clear cases.

### Multi-agent / parallel
21. **Mission control / fan-out dashboard** — concurrent agents untrackable in chat → one list: status, last response, needs-you, inline reply, jump-in → avoid for single-agent.
22. **Parallel candidates / judging** — one attempt may be suboptimal → fan out N, user or a judge agent picks → avoid when cost-sensitive or one obvious output.

### Plan / todo
23. **Editable plan / todo list** — can't course-correct an opaque agent → checklist w/ live status, editable/reorderable, streamed inline (not modal) → avoid for trivial single-step.

### State & legibility
24. **Explicit agent-state surface** — ambiguous state → over-trust or anxious hovering → one always-visible status chip + matching affordance → risk is *inconsistent* vocabulary across surfaces.
25. **Explainable rationale** — autonomous acts look like random bugs → one-line "because you said X, did Y" → avoid for obvious actions; keep to one sentence.
26. **Confidence / uncertainty surfacing** — automation bias → calibrated cue on variable/high-stakes/ambiguous output; should make users review low-confidence more → avoid on deterministic ops; uncalibrated is worse than none.

### Cost / budget
27. **Tiered budget warnings + auto-compaction** — sudden mid-task limit failure destroys work → continuous meter, tiered ~70/85/90% with action → don't bury until failure or nag on trivial usage.
28. **Run cost/time estimate** — delegating blind to spend/latency → est. before long runs + running tally + caps that halt → avoid metering free single-shots.

### Empty / error / recovery
29. **Suggestion chips / capability onboarding** — blank box hides capability → pre-filled examples on first run → let experts skip; don't over-script.
30. **Scoped recoverable error** — one failed tool shouldn't kill the run → contain to the tool card, allow resubmit/retry, agent self-heals → don't swallow silently or infinite-retry.

## Terminal pattern catalog

1. **Differential redraw** — TTY has no scene graph; clear+reprint floods/flickers → cell-diff virtual buffer, emit only changed-cell deltas, keep only visible messages in the tree.
2. **Safe TTY streaming** — autowrap + line discipline; can't reflow emitted lines → buffer to a logical model, render markdown/code blocks when the fence closes, reflow on SIGWINCH.
3. **Alt-screen vs inline** — two exclusive modes; alt-screen kills flicker but destroys scrollback/selection/search → see decision matrix below.
4. **Fixed input box** — prompt scrolls away under streaming → pin composer + status to a reserved bottom region (clean only in alt-screen).
5. **Flicker-free progress** — spinner full-line clears flicker, esp. over SSH/tmux → repaint glyph+status via cursor save/restore; show *contextual* status; offer motion-off.
6. **Persistent status line** — no window chrome for stateful modes → reserved footer, color-coded by blast radius.
7. **Collapsible tool calls / diffstat** — finite viewport, verbose output buries the conversation → one-line collapsed summary (+/- diffstat), expand call+result together.
8. **Keyboard permission prompt** — blocking confirm must be mouse-free, not lost in scroll, not hang headless → single-key allow-once / allow-always-scoped / deny / edit; always scroll into view.
9. **Tiered autonomy presets** — per-action prompting exhausts; the right point moves mid-session → small ordered ladder (read-only/plan → auto-edit → full-auto) cycled cheaply via a modifier key, active rung visible + color-coded.
10. **Plan mode** — can't side-panel-preview a multi-file change in a TTY → read-only phase: analyze + emit a text plan, mutating tools hard-disabled until approval.
11. **Interrupt & steer** — agent holds the foreground; stop/redirect without SIGINT-kill → `Esc` interrupt-keep-session, `Esc Esc` rewind/fork, `Ctrl+C` harder cancel; queue input while busy.
12. **In-terminal diff** — no gutter; only colored monospace, must survive NO_COLOR/light/non-truecolor → unified diff w/ +/- *and* color, syntax highlight, per-hunk, shown before applying.
13. **File-edit confirmation gate** — irreversible-ish writes reviewed in linear flow → diff → keyboard prompt w/ edit-the-edit; tier auto-approves edits, still gates exec.
14. **Git as undo substrate** — no trusted app-level undo stack → atomic auto-commit per change; `git` *is* the rollback UI.
15. **Slash commands + palettes** — no menus/buttons for meta-actions → `/command` namespace, `@` file picker, `Ctrl+R` history; keep out of the model prompt.
16. **Persistent transcript & resumability** — alt-screen destroys scrollback; SSH disconnects kill sessions → reimplement scroll + `less`-style search, escape hatch to dump scrollback / `$EDITOR`, persist to disk, recommend tmux.
17. **Completion notification** — long runs → user task-switches; no native "done" signal → bell `\a` → OSC 9/777 desktop notification (forwards over SSH), conservative default + a hook.
18. **TTY-vs-pipe duality** — same binary driven by a human at a TTY *or* piped/CI/agent → detect `isatty(out/in)` separately; attached → full TUI; not → no ANSI/spinner/alt, honor `NO_COLOR`/`TERM=dumb`, refuse (don't silently proceed) without explicit `--yes`; structured/JSONL out. *Agent consumer → sibling `cli-design` owns this contract.*
19. **ANSI legibility + downsampling** — unknown bg/depth/NO_COLOR → never color-only (pair glyph/prefix), auto-downsample to terminal capability, honor NO_COLOR/dumb unconditionally.
20. **Reduced motion / screen-reader mode** — spinners & redrawing regions re-announce every frame; alt-screen opaque to screen readers → no-animation/quiet mode, stable single-line status, non-alt-screen path.

## Alt-screen decision matrix

| If the agent UI is… | Default | Required guards |
|---|---|---|
| Conversational / coding (muscle memory matters) | **Inline + differential renderer** | Kill flicker via cell-diff; don't go alt-screen |
| Dashboard / monitor (own the viewport) | **Alt-screen acceptable** | Reimplement scroll/search/select; escape hatch to native scrollback; env kill-switch; opt-in/toggleable |
| Mixed / unsure | Inline first | Treat alt-screen as a feature flag, never a forced migration |

Architectural prerequisite for flicker-free streaming + responsive interrupt:
run the agent and the TUI on separate threads communicating via a typed
pub/sub broker → a message-loop (model → update → render) architecture.

## 2024–2026 consensus

- **Conversational → delegative UI**: burden moves from prompt-crafting to plan review, progress legibility, result verification.
- **Review gates non-negotiable**: removing the human checkpoint breaks trust faster than model quality compensates.
- **Collapsed-by-default reasoning won**: collapsible "Thought for Ns", never leaked into the answer.
- **Generative UI mainstream**: tool output → components; a common component vocabulary has converged — Reasoning, Tool, Task, Plan, Sources, Checkpoint, Queue, Artifact.
- **Mission-control for async/parallel**: linear chat supplemented by dashboard/fan-out + "needs-you" inboxes.
- **Trust scaffolding canon**: Intent Preview, Autonomy Dial, Action Audit + Undo, Explainable Rationale, Confidence Signal, Escalation Pathway.
- **Terminal vocabulary converging**: autonomy tiers (read-only/plan → auto-edit → yolo), `/slash` meta, `@` files, `Ctrl+R` history, `Esc` interrupt, `Ctrl+C` cancel.

## Open debates

- **Chat vs canvas vs ambient vs dashboard** — parallel coexistence; *which surface to invoke* (intent detection) is unsolved.
- **Show reasoning vs show collaboration** — stream the reasoning trace vs surface the edits/diffs. Unresolved.
- **Autonomy default** — how much to gate vs allow-always; "setting churn" proposed as the trust metric.
- **Citations as trust vs trust-laundering** — presence raises perceived trust even when unsupported; no agreed mitigation.
- **Alt-screen vs inline (terminal)** — the live one; inline+differential vs alt-screen+reimplemented affordances. No consensus.
