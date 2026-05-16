# Agentic UI — pattern catalog

Lookup layer for the `ui` playbook. Web catalog (30), terminal catalog (20),
the alt-screen decision matrix, 2024–2026 consensus + open debates, sources.
Each pattern: name → problem → use → avoid → exemplar.

## Web pattern catalog

### Streaming & progressive rendering
1. **Token streaming** — latency feels broken without feedback → any text/code gen → avoid when output is structured & not partially actionable, or it leaks internal monologue → ChatGPT, Claude, AI SDK `useChat`.
2. **Skeleton/shimmer** — blank gap before first token → before first token / tool results / known-shape components → avoid if content arrives <300ms (flash) → AI Elements `Loader`, v0.
3. **Streaming tool inputs** — tool calls opaque while args generate → show partial inputs + target skeleton → avoid for destructive tools (half-formed arg → early approve) → AI SDK 5 (`input-streaming → input-available → output-available`).
4. **Generative/dynamic UI** — text is lossy for structured/interactive results → map tool output to components → avoid gratuitous componentizing of prose; sandbox untrusted UI → Claude Artifacts, ChatGPT Apps SDK, v0, AI Elements.

### Reasoning disclosure
5. **Collapsed reasoning trace** — CoT builds trust but is noisy/misleading → collapsed summary, auto-collapse when answer starts → avoid on simple tasks; never leak raw deltas → o1/o3 "Thinking", Claude extended thinking, AI Elements `Reasoning`.
6. **Collaboration-over-reasoning** — for artifacts, *what changed* > the mind → surface targeted edits as diffs → avoid in pure Q&A → ChatGPT Canvas, Claude Artifacts. *Open debate: show reasoning vs show collaboration — unresolved.*

### Tool-call / action visualization
7. **Live activity log / step list** — long runs are a black box → streaming step/source list in a sidebar → avoid single-shot; for delegated background work summarize instead → ChatGPT deep research, Devin timeline, Perplexity.
8. **Tool-call card** — raw function JSON unreadable → labeled card w/ status, collapsible I/O → avoid hiding side-effecting calls; don't over-verbose trivial reads → AI Elements `Tool`, Cursor, Claude Code.

### Citations & grounding
9. **Inline citation / source attribution** — synthesized answers unverifiable → factual claims, doc/web/DB summaries; numbered footnotes or source chips, hover preview → avoid in brainstorming; risk: laundering hallucinations (citation present ≠ supports claim) → Perplexity, NotebookLM, AI Elements `Sources`.

### Approval, confirmation & permission
10. **Intent preview / plan-before-execute gate** — users feel ambushed → plan summary + Proceed/Edit/I'll-do-it before irreversible/financial/sharing/large-scope → avoid for low-risk pre-approved repeats → ChatGPT agent, Devin/Copilot/Cursor plan mode.
11. **Autonomy dial (tiered levels)** — one-size autonomy erodes trust after a failure → Observe→Plan→Act-w/-confirm→Autonomous, per task type; watch "setting churn" → avoid stateless one-shots → Cursor (Ask/Agent/auto), Claude Code modes.
12. **Allow-once vs allow-always (allowlist)** — re-confirming safe actions is death by a thousand prompts → scope the grant (session/repo/global) → never blanket-allow destructive (`rm`, deploy, payment) → Cursor per-command, Claude Code allowlist.

### Diff review & change preview
13. **Inline diff + accept/reject (partial)** — bulk-apply is unsafe → colored diff, per-hunk/line accept, multi-file pane → avoid for trivial single-line (tab is faster) → Cursor, Copilot Edits, Canvas diff. *Removing this gate broke Cursor trust in 2025.*
14. **Next-edit suggestion** — one change implies follow-ons → predict next edit, tab to apply → avoid at low confidence (trains users to ignore) → Copilot NES, Cursor.

### Undo / checkpoint / rollback
15. **Checkpoint timeline / rewind** — one mistake feels catastrophic → snapshot before each action, click to restore → avoid implying it reverses external side effects → Cursor checkpoints, Claude Code rewind, Canvas history.
16. **Action audit log + time-boxed undo** — autonomous real-world effects need accountability → chronological log w/ status + prominent Undo → avoid only for truly zero-cost actions → travel/email agents, Devin.

### Steering mid-task
17. **Queued follow-ups + immediate interject** — corrections occur mid-run → queue (execute in order) + bypass key to interject now → don't silently drop the queue; show it → Cursor (queue + Cmd+Enter), Claude Code.
18. **Mid-run redirect / refocus** — long runs drift → interrupt to refine focus / adjust sources; editable plan during exec → avoid when restart is cheaper → ChatGPT deep research, Devin.

### Background / async + handoff
19. **Delegate-and-notify** — long tasks shouldn't block; babysitting defeats the point → fire-and-forget in a sandbox, notify on done/needs-you, hand back a summary not a transcript → avoid for short interactive or clarification-heavy tasks → Devin, Claude Code background, Copilot coding agent.
20. **"Needs you" escalation / clarify-up-front** — confident catastrophic guesses under ambiguity → ask before starting + escalate on genuine ambiguity (healthy ~5–15%) → avoid over-asking in clear cases → ChatGPT deep research clarifying Qs.

### Multi-agent / parallel
21. **Mission control / fan-out dashboard** — concurrent agents untrackable in chat → one list: status, last response, needs-you, inline reply, jump-in → avoid for single-agent → Claude Code agent view, Copilot Mission Control, Cursor multi-agent.
22. **Parallel candidates / multi-agent judging** — one attempt may be suboptimal → fan out N, user/judge picks → avoid when cost-sensitive or one obvious output → Cursor multi-agent judging.

### Plan / todo
23. **Editable plan / todo list** — can't course-correct an opaque agent → checklist w/ live status, editable/reorderable, streamed inline (not modal) → avoid for trivial single-step → Devin, Copilot/Cursor Plan mode, Claude Code TodoWrite.

### State & legibility
24. **Explicit agent-state surface** — ambiguous state → over-trust or anxious hovering → one always-visible status chip + matching affordance → risk is *inconsistent* vocabulary across surfaces → AI SDK status (`submitted/streaming/ready/error`).
25. **Explainable rationale** — autonomous acts look like random bugs → one-line "because you said X, did Y" → avoid for obvious actions; keep to one sentence → agentic email/travel assistants.
26. **Confidence / uncertainty surfacing** — automation bias → calibrated cue on variable/high-stakes/ambiguous output; should make users review low-confidence more → avoid on deterministic ops; uncalibrated is worse than none → decision-support, code assistants.

### Cost / budget
27. **Tiered budget warnings + auto-compaction** — sudden mid-task limit failure destroys work → continuous meter, tiered ~70/85/90% with action → don't bury until failure or nag on trivial usage → Claude Code token budget.
28. **Run cost/time estimate** — delegating blind to spend/latency → est. before long runs + running tally + caps that halt → avoid metering free single-shots → deep research estimates, AI Elements `Context`.

### Empty / error / recovery
29. **Suggestion chips / capability onboarding** — blank box hides capability → pre-filled examples on first run → let experts skip; don't over-script → ChatGPT/Claude tiles, AI Elements `Suggestion`.
30. **Scoped recoverable error** — one failed tool shouldn't kill the run → contain to the tool card, allow resubmit/retry, agent self-heals → don't swallow silently or infinite-retry → AI SDK isolated tool errors.

## Terminal pattern catalog

Each: name → constraint → solution → exemplar.

1. **Differential redraw** — TTY has no scene graph; clear+reprint floods/flickers → cell-diff virtual buffer, emit only changed-cell deltas, keep only visible messages in tree → Bubble Tea, Claude Code rewrite, `pi`, Crush.
2. **Safe TTY streaming** — autowrap + line discipline; can't reflow emitted lines → buffer to a logical model, render markdown/code blocks when the fence closes, reflow on SIGWINCH → Open Interpreter, Aider, Codex.
3. **Alt-screen vs inline** — two exclusive modes; alt-screen kills flicker but destroys scrollback/selection/search → see decision matrix below → Claude Code (opt-in fullscreen), `pi` (inline+diff), Gemini CLI (rolled back).
4. **Fixed input box** — prompt scrolls away under streaming → pin composer + status to a reserved bottom region (clean only in alt-screen) → Claude Code fullscreen, Crush, Codex.
5. **Flicker-free progress** — spinner full-line clears flicker, esp. over SSH/tmux → repaint glyph+status via cursor save/restore; show *contextual* status; offer motion-off → Gemini CLI (configurable + off), Claude Code (elapsed+tokens+interrupt hint).
6. **Persistent status line** — no window chrome for stateful modes → reserved footer, color-coded by blast radius → Claude Code status bar + `/context`, Gemini CLI footer, Codex `/status`.
7. **Collapsible tool calls / diffstat** — finite viewport, verbose output buries convo → one-line collapsed summary (+/- diffstat), expand call+result together → Claude Code `/focus`, Codex transcript.
8. **Keyboard permission prompt** — blocking confirm must be mouse-free, not lost in scroll, not hang headless → single-key allow-once / allow-always-scoped / deny / edit; always scroll into view → Claude Code, Codex `/permissions`, Gemini CLI, Aider `--yes`.
9. **Tiered autonomy presets** — per-action prompting exhausts; right point moves mid-session → small ordered ladder cycled cheaply, active rung visible + color-coded → Claude Code (default→acceptEdits→plan, Shift+Tab), Codex, Gemini (default/auto_edit/yolo).
10. **Plan mode** — can't side-panel-preview multi-file change in a TTY → read-only phase: analyze + emit text plan, mutating tools hard-disabled until approval → Claude Code Plan Mode, Codex.
11. **Interrupt & steer** — agent holds foreground; stop/redirect without SIGINT-kill → `Esc` interrupt-keep-session, `Esc Esc` rewind/fork, `Ctrl+C` harder cancel; queue input while busy → Claude Code, Codex (`Tab` queue).
12. **In-terminal diff** — no gutter; only colored monospace, must survive NO_COLOR/light/non-truecolor → unified diff w/ +/- *and* color, syntax highlight, per-hunk, shown before applying → Codex, Aider `/diff`, Claude Code.
13. **File-edit confirmation gate** — irreversible-ish writes reviewed in linear flow → diff → keyboard prompt w/ edit-the-edit; tier auto-approves edits, still gates exec → Claude Code, Gemini `auto_edit`, Aider.
14. **Git as undo substrate** — no trusted app-level undo stack → atomic auto-commit per change; `git` *is* the rollback UI → Aider (canonical), `--auto-commits`.
15. **Slash commands + palettes** — no menus/buttons for meta-actions → `/command` namespace, `@` file picker, `Ctrl+R` history; keep out of model prompt → Codex, Claude Code, Gemini CLI.
16. **Persistent transcript & resumability** — alt-screen destroys scrollback; SSH disconnects kill sessions → reimplement scroll + `less`-style search, escape hatch to dump scrollback / `$EDITOR`, persist to disk, recommend tmux → Claude Code transcript mode (`[`, `v`), Codex `/fork`.
17. **Completion notification** — long runs → user task-switches; no native "done" signal → bell `\a` → OSC 9/777 desktop notif (forwards over SSH), conservative default + hook → Claude Code (`preferredNotifChannel`), Codex (iTerm2 recipes).
18. **TTY-vs-pipe duality** — same binary driven by human at TTY *or* piped/CI/agent → detect `isatty(out/in)` separately; attached → full TUI; not → no ANSI/spinner/alt, honor `NO_COLOR`/`TERM=dumb`, refuse (don't silently proceed) without explicit `--yes`; structured/JSONL out → `claude -p`, `codex exec`, `gemini --yolo`, `aider --message`. *Agent consumer → sibling `cli-design` owns this contract.*
19. **ANSI legibility + downsampling** — unknown bg/depth/NO_COLOR → never color-only (pair glyph/prefix), auto-downsample to terminal capability, honor NO_COLOR/dumb unconditionally → Bubble Tea/Lip Gloss, Charm tooling.
20. **Reduced motion / screen-reader mode** — spinners & redrawing regions re-announce every frame; alt-screen opaque to SRs → no-animation/quiet mode, stable single-line status, non-alt-screen path → Gemini CLI (spinner off), Claude Code classic renderer.

## Alt-screen decision matrix

| If the agent UI is… | Default | Required guards |
|---|---|---|
| Conversational / coding (muscle memory matters) | **Inline + differential renderer** | Kill flicker via cell-diff; don't go alt-screen |
| Dashboard / monitor (own the viewport) | **Alt-screen acceptable** | Reimplement scroll/search/select; escape hatch to native scrollback; env kill-switch; opt-in/toggleable |
| Mixed / unsure | Inline first | Treat alt-screen as a feature flag, never a forced migration |

Architectural prerequisite for flicker-free streaming + responsive interrupt:
agent and TUI on separate threads/goroutines via a typed pub/sub broker →
message-loop render (Elm/Bubble Tea architecture; Crush).

## 2024–2026 consensus

- **Conversational → delegative UI**: burden moves from prompt-crafting to plan review, progress legibility, result verification.
- **Review gates non-negotiable**: removing the human checkpoint breaks trust faster than model quality compensates.
- **Collapsed-by-default reasoning won**: collapsible "Thought for Ns", never leaked into the answer.
- **Generative UI mainstream**: tool output → components; Vercel AI Elements is the de-facto component vocabulary.
- **Mission-control for async/parallel**: linear chat supplemented by dashboard/fan-out + "needs-you" inboxes.
- **Trust scaffolding canon**: Intent Preview, Autonomy Dial, Action Audit + Undo, Explainable Rationale, Confidence Signal, Escalation Pathway.
- **Terminal vocabulary converging**: autonomy tiers (read-only/plan → auto-edit → yolo), `/slash` meta, `@` files, `Ctrl+R` history, `Esc` interrupt, `Ctrl+C` cancel.

## Open debates

- **Chat vs canvas vs ambient vs dashboard** — parallel coexistence; *which surface to invoke* (intent detection) is unsolved.
- **Show reasoning vs show collaboration** — o1-style CoT streaming vs Canvas "surface the edits". Unresolved.
- **Autonomy default** — how much to gate vs allow-always; "setting churn" proposed as the trust metric.
- **Citations as trust vs trust-laundering** — presence raises perceived trust even when unsupported; no agreed mitigation.
- **Alt-screen vs inline (terminal)** — the live one; inline+differential vs alt-screen+reimplemented affordances. No consensus.

## Sources

Smashing Mag, "Designing for Agentic AI: Practical UX Patterns" (Feb 2026) ·
agentic-design.ai/patterns · ShapeOfAI.com/patterns · Vercel AI SDK 5 blog +
AI Elements docs (elements.ai-sdk.dev) + `useChat` ref · Latent Space — Karina
Nguyen (OpenAI) on reasoning/Canvas/Tasks · OpenAI deep research / agent /
Operator posts · Cursor docs+changelog+forum · Devin release notes 2025 ·
GitHub Copilot changelog (Plan mode, Mission Control, NES, coding agent) ·
Claude Code fullscreen + permission-modes docs · steipete.me "The Signature
Flicker" (differential vs alt-screen, Ink rewrite, Gemini rollback, `pi`) ·
Codex CLI features + non-interactive docs · Aider usage/git/scripting docs ·
Gemini CLI YOLO/config docs · Bubble Tea / Crush TUI architecture · Open
Interpreter streaming docs.
