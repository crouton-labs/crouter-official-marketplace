---
kind: knowledge
when-and-why-to-read: When you plan a short video (product demo, launch, changelog, testimonial reel, logo sting) before building any scene, this knowledge should be read because a video built without a beat-by-beat storyboard and frame budget runs long, holds text too briefly to read, or misses its target length.
short-form: "Video storyboard: the table format (beat, content, motion length, hold, sequence, transition), the frame-budget rules (hold ≥ 4 frames per character and ≥ 30 frames, sequences overlap by the transition, planned total within ±10% of target), the rules for picks, and the planning procedure."
rationale: >-
  Adapted from remocn (github.com/remocn/remocn, MIT): skills/video/references/storyboard.md, agents/video-director.md and skills/video/SKILL.md, with the remocn component catalog and Remotion install steps removed. This document owns planning a video; the beat structures and quality bar live in [[web/video/anatomy]], and checking the render in [[web/video/scene-review]].
surfaces:
  - on: read
    match:
      - "**/remotion.config.*"
      - "**/Root.tsx"
    at: preview
  - on: command
    match:
      - "*remotion*"
    at: preview
---

# Video storyboard

The storyboard is the contract between planning and building: it is written first, shown to the user, built from, and the render is checked against it. Keep it in this shape.

Don't skip the storyboard confirmation: it is the cheapest point to change direction.

## Shape

````markdown
# Storyboard: <video title>

- **Archetype:** <product-demo | changelog | feature-announcement | oss-showcase | cli-tool-demo | testimonial-reel | year-in-review | pricing-reveal | logo-bumper | custom>
- **Canvas:** 1280×720 (or 1080×1920 / 1080×1080 when the brief asks for vertical / square)
- **Target:** <seconds from the brief>s · **Planned:** <total frames>f = <seconds>s
- **Vibe:** <tech | premium | data | clean | playful | social | paper> · **Accent:** <one hex>

| # | Beat | Component | Content | Own length | Hold | Sequence | Transition out |
|---|---|---|---|---|---|---|---|
| 1 | Hook | <kinetic headline> | "Your team has tasks everywhere" | 45f | 120f | 165f | fade 18f |
| 2 | ... | ... | ... | ... | ... | ... | ... |

**Content still missing:** <fields the user should supply; placeholders used meanwhile>

**Build new:** <any beat no existing component covers, with one line on what to build — or "none">
````

## Rules for the numbers

- **Every frame count in the storyboard is counted in one unit** (30 fps here): the table, the transition frames and **Planned**. If the video renders at another frame rate, scale the counts by `fps / 30` where they are handed to the renderer.
- **Own length** is the length of the component's motion. It is the floor, never the whole beat. State-driven components have no own length: give them the time their state changes need.
- **Hold** is time on screen after the motion settles. Text needs roughly 4 frames per character read at a glance, and never less than 30 frames.
- **Sequence** = own length + hold.
- **Transition out** is a presentation plus its timing frames. Adjacent sequences overlap by the transition's length, so `Planned = sum(Sequence) − sum(transition frames)`.
- **Planned** must land within ±10% of **Target**. Trim holds before trimming beats; drop a beat before squeezing every hold below its floor.

## Rules for the picks

- One lead component per beat, with its docs read before it goes in the table. Supporting components layered in the same beat go in the same cell, after the lead. Never a component you have not read.
- A piece no existing component covers is listed under **Build new**.
- One vibe across the video.
- One accent color. Everything else neutral.

## How to plan

1. Pull the content from the brief and the repo before asking: `README`, landing copy, `package.json`, recent releases. Ask only for what is still missing, in one message, and fall back to honest placeholders rather than blocking.
2. Pick the archetype ([[web/video/anatomy]]). Its beats are your starting point. Its duration sets the target when the brief gives none.
3. For each beat, shortlist components. Prefer the vibe that fits the brand, and keep one vibe across the video. Check the props can carry the content.
4. Budget the frames by the rules above: own length + hold = sequence, transitions overlap, and the planned total within ±10% of the target. Trim holds before dropping beats.
5. If nothing fits a beat or a piece of one, name it under **Build new**, with one line on what to build. Don't force a mismatched component into the slot.

Rules:

- Never invent props or lengths.
- Real content in the Content column. Where the user hasn't supplied it, use an honest placeholder in angle brackets and list it under **Content still missing**.

Show the storyboard to the user **as it is in that format**: the header lines, the table with all its columns and the missing-content list. Don't retell it as prose or reshape the table. A few lines above it on the choices you made are fine. Then **wait for a yes or for changes**, and apply changes to the table, not straight to code.
