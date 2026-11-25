---
kind: knowledge
when-and-why-to-read: When a video composition builds and typechecks and you are about to hand it over, this knowledge should be read because the agent that wrote the code never saw a frame, and clipped text, unreadable holds, blank frames and jumps between beats only show up in rendered stills.
short-form: "Video scene review: render three stills per beat (entry at start + 2, settled at start + own length, end of hold at start + sequence − 2), look at each, check clipping, legibility (body text ≥ ~28px at 1280×720), empty frames, jumps between beats and the quality bar; report one finding per visible defect, worst first; stop after two review rounds."
rationale: >-
  Adapted from remocn (github.com/remocn/remocn, MIT): agents/scene-reviewer.md and step 5 of skills/video/SKILL.md, with the Remotion render commands made generic. This document owns checking a rendered video; the storyboard it checks against lives in [[web/video/storyboard]], and the quality bar in [[web/video/anatomy]].
---

# Video scene review

The agent that writes the code never sees the frames, so look at them. The reviewer doesn't edit the video: it returns fixes for the caller to apply. Apply the fixes, then check again. Stop after **two** review rounds and tell the user what is still open, if anything.

## Render the stills

If stills are already rendered, review those and skip to **What to check**. If no storyboard is given, read the composition's source and work out the beat boundaries from its sequence durations.

1. Compute each beat's start frame. Each transition overlaps the next sequence, so start(n+1) = start(n) + sequence(n) − transition(n).
2. For each beat take three frames: **entry** (start + 2), **settled** (start + own length) and **end of hold** (start + sequence − 2). Convert storyboard counts to the composition's frame rate, and clamp to the composition's duration.
3. Render them in one go. If rendering fails, report the error as the first finding and stop.
4. Open every image and look at it.

## What to check

- **Clipping and overflow:** text or elements cut by the frame edge or by a container, where the storyboard didn't ask for it.
- **Legibility:** text too small at 1280×720 (under about 28px for body copy), too long for its hold, or with too little contrast against what is behind it.
- **Empty or broken frames:** a settled frame that is blank, a single flat color where content was planned, missing images, fallback fonts.
- **Jumps between beats:** the end of one beat and the entry of the next disagreeing in position, scale or color in a way the transition doesn't explain.
- **The quality bar:** more than one accent color, decorative ALL-CAPS or letter-spacing, gradient text fills, glow halos on your own additions (not on components whose effect that is), lorem or "Scene A" placeholder copy.

## Report

One block per finding, worst first:

```
[beat #, frame] <what is wrong, as seen in the image>
fix: <file and the concrete change: prop, value, duration or layout>
```

End with `PASS` if nothing needs fixing, or `FIXES: <count>`. Don't report taste preferences as fixes. Every finding must point to something visible in a still you rendered.
