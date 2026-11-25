---
kind: knowledge
when-and-why-to-read: When you decide what beats a short video needs, how long each archetype (product demo, feature announcement, changelog, testimonial reel, OSS showcase, CLI demo, year in review, logo bumper, pricing reveal) should run, or whether a video is good or slop, this knowledge should be read because a video that lists features instead of telling one story, uses several accents, glows or lorem, or runs long by enumerating reads as generated.
short-form: "Video anatomy: template vs compose vs build new; the 6-beat product demo (hook, positioning, product reveal, features, proof, CTA); the good-vs-slop bar (one accent, real product large and legible, real content, ~18–45s, no glow washes, no feature lists); and per-archetype beat tables with durations and frame math."
rationale: >-
  Adapted from remocn (github.com/remocn/remocn, MIT): skills/remocn/references/anatomy.md and references/archetypes/*.md, with remocn component names, install lines and code stripped and archetype notes that only name catalog components dropped. This document owns video structure and the quality bar; planning the storyboard and frame budget lives in [[web/video/storyboard]], checking the render in [[web/video/scene-review]].
---

# Video anatomy

## Strategy: template, compose, or new component

Before building, decide HOW. Three strategies, each with when-to / when-not-to.

### Reach for a ready-made template when
- The archetype is canonical and common (product-demo, changelog, testimonial-reel) and a template exists.
- The choreography is non-trivial (multi-act camera moves, overlapping phase timings) — things an ad-hoc composition won't reliably reproduce.
- The structure is stable and the user's content maps cleanly onto the template's slots.

Don't use a template when the user's content or brand can't fit its fixed slots, or the archetype is long-tail.

### Compose from existing components (the default) when
- The user has specific content/brand, or a variable number of features/metrics.
- The needed structure is a sequence of existing components (hook → product UI → proof → CTA) with no exotic choreography.
- Speed and fit matter more than a pixel-locked recreation.

This is the primary path.

### Build a new lightweight component when
- A beat needs a visual no existing component covers (a specific product-UI frame, a chart type) **and** it will be reused across videos (e.g. a generic UI frame, a metric card, a task card).
- For a true one-off, try composing from existing components first; only author a new one when reuse justifies it.

New components stay transparent (background via a backdrop in the example), seek-safe, and follow the anti-slop rules below.

## Anatomy of a product demo

A product demo is 6 beats. **Proof** and **CTA** are optional; **Hook** and **Product reveal** are the spine. Beats overlap at their edges (the end of one launches the next — no dead frames between).

| # | Beat | Job | Typical content |
|---|---|---|---|
| 1 | **Hook** | State the problem or a bold positioning line in plain language | "Your team has tasks everywhere", "Show up in AI answers", "Don't get blocked by your machine" |
| 2 | **Positioning** | Name the product / what it is → resolve to the lockup | "Meet Flowith", "AI-Powered Work Operating System" → logo |
| 3 | **Product reveal** | Show the actual product surface working | chat composer typing a prompt, a terminal running, a planning timeline, a workflow graph |
| 4 | **Features** | 2–4 capabilities, each as a quick concrete moment | a checklist running, task cards wiring up, a "designed to simplify your workflow" line |
| 5 | **Proof** *(optional)* | Make it credible | a metric/score counting up, metric cards, "Join 12,000+ people" + testimonials, an integration landing in Slack |
| 6 | **CTA** *(optional)* | One ask + where to go | "Build with…", a command to run, `domain.com`, logo lockup on a calm hold |

The hook usually carries the single hardest idea; features are where most of the runtime lives. Transitions between beats use push-through, focus-pull, whip-pan, or a plain fade — match the move to the narrative (push for "going deeper", focus or fade for a neutral cut, whip for energy).

## Good vs slop — the quality bar

Derived from real reference demos. The good ones (CrowdReply, Flowith, HeyGen, monid, shadcn-sidebar, Claude Code Security, Notion Agents/Sites, React Bits) share a language; the bad ones (a component-catalog dump, shadcn promos, an over-long slide tool, fractal/openpaper/ChatJS/SlidesAI/itshover/dito) share failure modes. The line is often *restraint and legibility*, not the presence of any one effect.

### Good — do these
- **One accent color per video.** Everything else neutral (mono / cream / dark). Good demos pick exactly one (orange, yellow, teal, blue) and use it only on the emphasized word, the active number, and the CTA.
- **Kinetic type with selective emphasis.** Sentence case. Emphasize meaning with weight, the accent color, or a highlight box on the ONE word that matters — never the whole line.
- **Show the real product surface.** A believable chat composer with a cursor, a terminal with monospace output and progress, a checklist, task cards, a metric card. The UI sim *is* the product, not decoration.
- **Real, specific content.** Real-feeling names, metrics, copy ("Your AI Visibility Score: 71%", "Focus Time 4h 25m", "Join 12,000+ people"). All copy in English.
- **Generous whitespace and a single focal point per beat.** One idea on screen at a time.
- **Cursor-driven interaction** for product beats (type, click, the button reacts).
- **A number/score payoff** with the accent, when there's a metric to land.
- **A calm logo lockup outro.** Optionally on a dark hold; keep it restrained.
- **Tight runtime with overlapping beats.** ~18s (short) to ~45s (standard). Length comes from story, not from listing.
- **Show the product large and legible.** The UI sim fills the frame and reads clearly (Claude Code Security's scan→findings→fix→PR, Notion's populated dashboard) — the product is the hero, not a distant window.
- **Long videos ride a narrative thread.** If it must run 60s+, carry it with a character / story (good Notion demo: the "Bug Wrangler" agent doing real tasks), never a feature list.

### Slop — never do these (each seen in a bad reference)
- **Keep gradients / glow restrained — small and subtle, never large or dominant.** This is about *dosage*, not presence. A small, sparing gradient accent is fine (good_04 React Bits — restrained, not big, not much of it). Slop is a *large, saturated, full-frame* gradient wash (bad_04's hot-pink background) or a soft radial **halo behind headings** (both shadcn promos — the #1 tell). The hook gets life from motion and the accent, not a glow blob.
- **No feature-list / catalog enumeration.** Naming feature after feature ("Row Selection", "Pagination", "Sorting"…) over the same screenshot, or dumping every component in a gallery, is not a video — it has no narrative. Tell one problem → solution → proof story instead.
- **No placeholder / lorem content.** "Scene A", "Scene B", "First", "Your UI", "Selected element", `TASK-####` filler. If real content is missing, use honest English placeholders the user will obviously replace — never ship lorem as the final.
- **No ALL-CAPS heavy blocks, no decorative letter-spacing, no gradient text.** (A red ALL-CAPS "VISUAL EDITOR" block is slop.)
- **No walls of dense, unreadable text** (tiny terminal dumps filling the frame). Show a few legible lines, not a transcript.
- **No monotony.** Don't repeat the same slide/screenshot under different labels. Each beat must advance the story.
- **Don't run long by enumerating.** 100s+ of feature-listing drags. If the content is genuinely long, give it a strong repeating rhythmic device (e.g. a question→answer cadence) or split into multiple videos.
- **Show the product big and legible.** Don't render the UI near-black / low-contrast (bad_01 fractal, bad_03 ChatJS), shrink it to a distant floating window, or float it over a photographic background (bad_02 openpaper). The viewer must be able to read the product — it's the hero.
- **No raw screen-recording with browser / OS chrome.** Use a clean product sim cropped to the content, not an un-styled screencast of a real browser tab (bad_04 SlidesAI).
- **No casual / throwaway copy.** "?????", ";)", "link in bio :)", lazy filler (bad_05 itshover) reads unfinished. Keep copy crisp and professional. All English.
- **One accent, not per-brand colors.** Don't tint each word a different platform's brand color (bad_06: Instagram-pink + Twitter-blue + LinkedIn-blue in one line). One accent across the whole video.

### The one-line test
A good product demo could be described as *"X has problem Y; here's the product solving it, here's proof, here's how to get it."* If your composition is instead *"here are my components / here are my features,"* it's slop — restructure around a story.

## Archetypes

| Archetype | Family | Use for | Duration |
|---|---|---|---|
| product-demo *(flagship)* | Product & Launch | Show a product solving a problem, end to end | ~18–45s |
| feature-announcement | Product & Launch | Spotlight one new capability | ~12–20s |
| changelog | Release & Updates | Version + human-readable change list | ~9s `[N]` |
| testimonial-reel | Growth & Social Proof | Cycle real testimonials/quotes | ~15–25s `[N]` |
| oss-showcase | Developer / OSS | Show an OSS repo (stars, contributors, code) | ~20–35s |
| cli-tool-demo | Developer / OSS | Demo a CLI / dev tool running | ~20–45s |
| year-in-review | Data & Metrics | Recap a year/period in numbers | ~20–35s `[N]` |
| logo-bumper | Brand & Identity | Logo reveal / intro-outro bumper | ~4–6s |
| pricing-reveal | Sales & Conversion | Reveal pricing tiers | ~12–20s |

`[N]` = the main scene scales linearly with item count. Every frame count below is counted at 30 fps.

**Any other archetype** (launch teaser, tweet-wall, dashboard tour, tutorial, milestone, sale promo, lower-third…) — compose it from the 6-beat anatomy above: it generalizes. Use the nearest archetype below as the format model.

### product-demo

| Variant | Length | Frames @30fps | Beats | Reference |
|---|---|---|---|---|
| **Short** | ~18s | ~540 | Hook → Product reveal → Positioning/CTA | monid (good, 18s) |
| **Standard** | ~45s | ~1356 | all 6 | CrowdReply / Flowith / HeyGen (good, 42–45s) |
| **Long** | 90s+ | — | many features | only with a strong repeating rhythm (Q&A cadence); else split into several videos. A flat 100s feature-list drags — that is the slop trap. |
| **Bumper** | ~4–5s | ~135 | Positioning → lockup only | a logo sting; see logo-bumper below. Not a full demo — a brand insert. |

Standard ~45s split: Hook 165 · Positioning 120 · Product reveal 150 · Features 450 (across 2–4) · Proof 300 · CTA 171.

### feature-announcement

**Family:** A. Product & Launch · **Default duration:** ~12s (360f @30fps) · **Format:** 16:9 · **Vibe:** premium

A single-feature reveal: a quiet kicker sets expectation, the feature name arrives at full scale, then one benefit line lands with an accent highlight on the key word. Three beats, one idea — this is "Introducing X" for a tweet or changelog banner, not a feature list.

Fixed three-beat structure; runtime is 360f.

| Frames | Beat | What happens |
|---|---|---|
| 0–90 | **Kicker** | Small "Introducing" label slides down and holds, letterforms kept tight; no motion after entrance |
| 90–240 | **Feature name** | The feature name bursts in per-character from below; a scale pulse (1.0→1.04→1.0) lands as the last character settles |
| 240–360 | **Payoff** | A single benefit line builds line by line; one key word receives a growing accent bar; the whole scene exits |

Transitions: kicker→name fade (linear, 12f); name→payoff slide (spring, ~18f).

Notes:

- **One feature only.** This archetype spotlights a single capability. For multiple features use changelog or a repeating per-feature series; enumeration is the primary slop failure mode here.
- **All copy in English.** The benefit line and kicker must be real English content, never lorem; the highlighted word must be a genuine content word that repays the accent.

### changelog

**Family:** B. Release & Updates · **Default duration:** ~9s (270f @30fps, scales with item count N) · **Format:** 16:9 · **Vibe:** clean

A regular-release recap: show the version number and a human-readable list of changes (Added / Fixed / Changed), close on a footer with a link and date. Calm and legible — the list must read, not dazzle.

A short 3-beat specialization of the anatomy (Positioning → Features → CTA). Duration scales with N: `total ≈ 60 (badge) + clamp(N*24, 96, 200) (list) + 70 (footer) − 2*12 overlap`. N=4 → ~270f.

| Frames (N=4) | Beat | What happens |
|---|---|---|
| 0–60 | **Version badge** | version chip slides into the top-left, date right; "What's new" builds |
| 60–160 | **Change list** | N rows, each a category tag (Added/Fixed/Changed) + text; staggered in, ~9f apart |
| 160–270 | **Footer / CTA** | small version chip, link/CTA fades in, optional release-progress indicator |

Transitions: badge→list and list→footer fade (12f each — spring timing into the list, linear timing into the footer).

Notes:

- One accent only; the tag colors (green/amber/blue) are semantic, not decoration — keep them muted.
- Real change text from the repo, never `Scene A` / lorem. All copy English.
- This is a list archetype — guard against the slop trap of enumerating forever: cap rows, keep it ~9s.

### testimonial-reel

**Family:** C. Growth & Social Proof · **Default duration:** ~14s (430f @30fps for N=3, scales with quote count) · **Format:** 16:9 · **Vibe:** clean

Cycle real customer quotes one at a time — each card springs in, holds while the quote text plays word-by-word, then fades through to the next. Close on an aggregate proof number ("Join 12,000+ people who found their flow") so the social proof lands on data, not sentiment alone. One accent color throughout; background is a muted grain-gradient shader on a solid dark canvas.

Frame math: `total = 60 (intro) + N×90 (quote scenes, 15f fade overlap each) + 10 (last-quote hold) + 90 (aggregate close)`. N=3 → 430f (~14s). Cap at N=5 (~600f, ~20s) and fold any extra quotes into "+M more" on the aggregate tagline rather than extending runtime.

| Frames (N=3) | Beat | What happens |
|---|---|---|
| 0–60 | **Intro** | Section title "What teams say" builds; thin horizontal divider enters |
| 60–165 | **Quote 1** | quote card springs up; quote text arrives; avatar + author/role enter; 2 peek cards behind at scale 0.94 / opacity 0.5 |
| 150–255 | **Quote 2** | fade transition (15f overlap); author-line enters; peek stack shifts depth |
| 240–355 | **Quote N** | Last quote holds +10f longer; peek cards resolve to full opacity as the stack empties; exits the card stack on the way out |
| 345–435 | **Aggregate close** | enters the metric block; counts to the aggregate figure; tagline "Join X+ [phrase]" arrives; optional or anchors the number in a recognizable social surface |

Transitions: fade (linear, 15f) between each quote scene; intro → Quote 1 with spring timing; Quote N → aggregate fade (15f).

Notes:

- **No glow halos behind quote text.** Depth is conveyed by the peek-card scale/opacity stack (0.94 / 0.5) — that is sufficient.
- **Real quotes, specific attribution.** "Marcus L., Head of Growth at Loom" beats "User, Company". If avatars are unavailable, render initials in a neutral mono circle — never use stock headshots.
- **N cap.** Beyond five quotes the runtime exceeds ~20s; split into a second reel or cut entries. Never extend by shrinking type or compressing hold time.

### oss-showcase

**Family:** D. Developer/OSS · **Default duration:** ~13s (390f @30fps, scales with contributor count N) · **Format:** 16:9 · **Vibe:** tech

An OSS repo announcement: establish the repo name, count up stars and forks, reveal the contributor community, show the install command, close on a GitHub CTA. The traction numbers are the story spine — they must land with satisfying momentum, not slide by as decoration.

Five-beat structure: Positioning (repo name) → Proof (stars/forks) → Proof (contributors) → Product reveal (install) → CTA. The contributors scene scales with N: `clamp(90, 90 + N×4, 180)` frames; default N≈48 → 90f. Total default: ~390f minus transition overlaps (~72f combined) ≈ 390f net.

**Long variant — Q&A cadence (avoid over-long slop):** For repos with a richer story, replace the RepoTitle beat with a question→answer rhythm: "Open source?" → "Yes." / "Battle-tested?" → "Yes." / "Free forever?" → "Yes." — three quick kinetic word swaps before the stars beat. Avoids the enumeration trap. The shadcn-sidebar demo (~117s) shows this cadence at scale.

| Frames (default) | Beat | What happens |
|---|---|---|
| 0–90f | **RepoTitle** | `owner/repo` name large centered; one-line tagline at 12f delay; scene exits |
| 90–195f | **StarsTraction** | star icon springs in, count rolls up to value; forks and issues cascade 8f apart; a shimmer sweeps the star count at peak |
| 195–285f | **Contributors** | (build new) waves in avatar tiles staggered by index; "N contributors" heading |
| 285–360f | **InstallLine** | types install command char by char; output line enters; green checkmark |
| 360–390f | **CTA** | "Star it on GitHub" text tracks in; repo URL and button |

Transitions: RepoTitle→Stars fade (spring, 20f); Stars→Contributors whip pan left (linear, 18f); Contributors→Install focus pull (24f); Install→CTA push through (spring, ~15f).

Notes:

- **One accent only.** The accent touches exactly three elements: the peak star count, the terminal checkmark, and the CTA button. Tagline, contributor heading, and output lines stay neutral.
- **Contributors must feel like people arriving, not a grid being filled.** The diagonal wave entrance (stagger by index) creates a sense of community assembling. Cap visible tiles at 24; fold the rest into a "+N" chip rather than shrinking avatar size.

### cli-tool-demo

**Family:** D. Developer/OSS · **Default duration:** ~45s (1350f @30fps, short ~18s/540f) · **Format:** 16:9 · **Vibe:** tech

Demo a CLI or dev tool by running a real command to a visible result. The terminal is the product surface — show a believable command typed, output streaming line by line as instant steps, and the final artifact or success state. Two variants: short (social clip, grounded in monid ~18s) and standard (launch / conference ~43s).

**Short (~18s / 540f)**

`hook → terminal run → result → sign-off`

| Frames | Beat | What happens |
|---|---|---|
| 0–90 | **Hook** | Value line builds word by word; one accent word lands; generous whitespace |
| 90–360 | **Terminal run** | Terminal types the command char by char; output lines appear as instant step-function steps (~6f apart); final `✓ Done` line highlighted |
| 360–480 | **Result** | Success callout — a metric, file count, or elapsed time — lands with the accent; plain dark hold if no visual artifact |
| 480–540 | **Sign-off** | Logo cluster on calm dark hold |

Transitions: hook→terminal whip pan down (20f); terminal→result push through (spring — the terminal recedes into depth); result→sign-off fade (16f).

**Standard (~45s / 1350f)**

`hook → agent chat → terminal run → value line → result reveal → sign-off`

| Frames | Beat | What happens |
|---|---|---|
| 0–150 | **Hook** | Problem statement or bold positioning line — kinetic word-by-word build, one accent |
| 150–420 | **Agent chat** | Prompt typed in the matching agent surface; cursor blinks; response or task list begins streaming |
| 420–900 | **Terminal run** | Command types in; progress output scrolls as instant step-function steps; numbers (file count, elapsed ms) tick up; final success line highlighted in green |
| 900–1050 | **Value line** | Outcome statement — "All finished" / "Don't get blocked by your machine" style; per-word swap or kinetic build; accent on the key phrase |
| 1050–1260 | **Result reveal** | Pipeline steps completing OR result artifact visible; plain dark hold if result needs no visual |
| 1260–1350 | **Sign-off** | Logo cluster fades in on dark hold |

Transitions: hook→chat fade (16f); chat→terminal whip pan down (20f); terminal→value-line push through (spring — the terminal recedes into depth); value-line→result focus pull (24f); result→sign-off fade (16f).

Notes:

- **Show 3–6 output lines maximum.** Pick the most readable step names and the success line; cut everything else. A wall of log text reads as noise, not credibility.
- **One accent color throughout.** The `✓ Done` line highlight, the hook's emphasis word, and the logo share exactly one accent. All other text stays neutral mono on dark.
- **Agent chat beat is optional.** Include it in the standard variant when the tool is AI-powered or agentic. Skip it (and use the short structure) when the tool is a pure CLI with no AI surface — adding a chat beat to a Rust CLI just to fill time is slop.

### year-in-review

**Family:** E. Data & Metrics · **Default duration:** ~20s (600f @30fps, N=4) · **Format:** 16:9 · **Vibe:** data / premium

A mounting sequence of headline numbers — one stat fills the full frame per beat — building urgency as entry stagger compresses, culminating in a RecapWall that shows every figure at once. The rhythm accelerates; the numbers do the talking.

Duration scales with N stats: `total = 90 (intro) + N×120 (stat-beats) − N×15 (overlap) + 90 (recap)`. N=4 → 600f (20s). N=6 → 810f (27s). Cap at N=8 (≈33s); above that, split into two videos.

| Frames (N=4) | Beat | What happens |
|---|---|---|
| 0–90 | **IntroTitle** | year kicker builds glyph-by-glyph; "Year in review" subtitle enters; full beat exits |
| 90–210 | **StatBeat #1** | counts 0→target over 45f ease-out; label enters; number pulses 1.0→1.06→1.0 (damping 8) at roll end; aligned left |
| 210–330 | **StatBeat #2** | same structure, aligned right; label stagger tightens to 16f |
| 330–450 | **StatBeat #3** | aligned left; label stagger 16f; optional trend line below the number |
| 450–570 | **StatBeat #4** | aligned right; label stagger 10f; one confetti burst fires at roll end (accent only, finale stat) |
| 570–660 | **RecapWall** | all N stats enter into a 2×⌈N/2⌉ grid; accent stat pulses; CTA line enters |

Transitions: Intro → Beat #1 slide (linear, 18f). Between stat beats fade (spring, 15f). Beat #N → RecapWall push through (linear, 20f).

Notes:

- **Alignment alternates left/right.** Left on odd beats, right on even. Compositional variety without introducing a new visual language per beat.
- **Stagger compresses beat by beat.** 24f label stagger on Beat #1, tightening to 10f by the finale — the cadence accelerates, building urgency without changing any component.
- **One confetti accent.** On the finale stat beat only. Using confetti on every beat drains the payoff; reserve it as a single punctuation mark.
- **Delta badge is optional.** Only show `delta` when a prior-year number is real and meaningful (e.g. +31% YoY). Skip if unavailable — a made-up delta is slop.
- **RecapWall grid sizing.** 2×⌈N/2⌉ grid. For N>6, reduce the per-cell font size proportionally so the wall reads at a glance. Never scroll or clip.
- Real numbers, English labels. Never ship `Metric #1`, `Value`, or lorem as final copy.

### logo-bumper

**Family:** H. Brand & Identity · **Default duration:** ~4.5s (135f @30fps, ±15f with wordmark length) · **Format:** 16:9 · **Vibe:** premium

A brand insert: the wordmark assembles, the mark draws or scales in, the lockup holds. Used as a standalone intro sting, a series opener (with corner brackets and a tagline), or a closing brand card. One mark, one accent, total restraint — this archetype is where over-decoration is most tempting and most wrong.

Three-beat structure: wordmark builds progressively, mark enters while the wordmark tail is still settling (overlap keeps energy without rushing), then the full lockup holds static. Frame math: `60 (wordmark) + 45 (mark, −15 overlap with wordmark) + 45 (hold) = 135f`. Scale the hold window up if the bumper will be reused across many cuts.

| Frames | Beat | What happens |
|---|---|---|
| 0–60f | **Wordmark build** | brand name assembles — word by word or character by character, reads as "O → Open → OpenAI" |
| 45–105f | **Mark reveal** | the brand mark draws, scales, or assembles in, overlapping the wordmark tail; settles at full opacity |
| 90–135f | **Hold** | complete lockup holds static — 30–45f of no motion for clean editor trim |

Transitions: none internal — the bumper is atomic. Connect to surrounding content externally (push through from the host composition).

Notes:

- **One accent, mono otherwise.** The accent touches the active character or the mark outline only — never the whole wordmark, never the background. Gradient text is slop.
- **No glow halo.** No radial-gradient blobs, no blur clouds behind the mark, no drop-shadow rings. The mark earns attention through motion alone.
- **Hold generously.** 30–45f of static lockup lets the editor cut cleanly. If the bumper will be dropped into many different videos, lean toward 45f.

### pricing-reveal

**Family:** I. Sales & Conversion · **Default duration:** ~12s (360f @30fps) · **Format:** 16:9 · **Vibe:** premium

A sales scene that walks viewers through pricing tiers, elevates the recommended plan, and closes on a CTA. The recommended tier is the single focal point — every other element frames it. Restrained by design: one accent color, one highlighted column, one ask.

A 5-beat specialization of the anatomy (Positioning → Features → CTA), compressed into a single unbroken scene followed by a CTA cut.

| Frames | Beat | What happens |
|---|---|---|
| 0–55f | **Lead** | "Simple pricing" headline resolves; a kicker line fades up beneath it |
| 55–150f | **ColumnsEnter** | Three tier cards rise from below with a left-to-right stagger |
| 150–250f | **RecommendFocus** | Recommended column lifts and scales up; flanking columns dim; feature checks draw in; "Popular" badge springs in |
| 250–320f | **PriceLand** | Recommended price rolls in with `$` prefix and lands; `/mo` gets a brief inline highlight |
| 320–360f | **CTA** | CTA headline builds word by word; button springs in and takes a single shimmer sweep |

Transitions: Lead→ColumnsEnter slide (spring, 16f); grid→CTA push through (linear, 20f).

Notes:

- **One accent only.** Apply the accent color to: the recommended column border, the "Popular" badge, the shimmer sweep on the CTA button. Secondary tiers stay neutral — dimming opacity (1→0.55) is the only treatment they receive.
- **Emphasis is structural, not a glow.** The recommended column reads through the lift, scale, and flanking dim during RecommendFocus. Do not add a radial gradient or blur halo behind the column.
- **Three tiers is the canonical count.** If the user has two or four, adjust the stagger timing accordingly; do not force a third empty column.
