---
kind: knowledge
when-and-why-to-read: When you are asked to make a page, screen, component or app look great, distinctive, polished or less generic — or to design, restyle or redesign any visual UI — this knowledge should be read because it runs the design pass in order and names the one document that owns each step, so the work is not built from model defaults and checked only at the end.
short-form: "/web:design — the visual design pass: understand the job, set a direction, fix the system, build, polish, review; each step names the documents to read."
slash: true
surfaces:
  - on: boot
    at: preview
---

# Make it visually great

Run these steps in order. Read each named document when you reach its step, not all up front. Skip a step only when the work clearly does not touch it (a single component needs no page shape). $ARGUMENTS

## 1. Know what you are designing

- Existing project: read its `DESIGN.md`, tokens and two or three existing screens first. If it has a system, extend it: [[web/frontend/design-md]].
- Restyling something that exists: [[web/frontend/redesign]] before touching a file.
- Brief is thin and the work is large: [[web/frontend/design-website]] for the questions to ask.
- Pick the kind: a marketing page ([[web/frontend/marketing-pages]], [[web/frontend/page-shapes]]) or an app, dashboard or tool ([[web/frontend/interface-design]]).

## 2. Set a direction

- [[web/frontend/visual-design]] and [[web/frontend/art-direction]]: a concept from the subject, real references, one signature.
- [[web/frontend/anti-default-direction]]: name the default pick and move off it.
- Optional starting looks: [[web/frontend/style-presets]].
- Write the direction down in a sentence or two before any CSS.

## 3. Fix the system

- [[web/frontend/typography]], [[web/frontend/color]], [[web/frontend/visual-craft]] (spacing, surfaces, layout geometry).
- Hold the values as tokens: [[web/frontend/design-tokens]]. Two modes: [[web/frontend/dark-mode]].

## 4. Build

- Pictures: [[web/frontend/imagery]]. Icons: [[web/frontend/iconography]].
- Controls and states: [[web/frontend/states-and-interactions]]. Motion: [[web/frontend/motion]] (scroll-linked only via [[web/frontend/scroll-animation]]; texture only via [[web/frontend/texture]]).
- Charts: [[web/frontend/data-viz]]. Widths: [[web/frontend/responsive]]. Access: [[web/frontend/accessibility]].
- Words on the page: [[web/copy/voice]], [[web/copy/hooks-and-titles]], [[web/copy/cta]].

## 5. Polish

- [[web/frontend/interface-polish]]: walk every state, replay motion slowly, fix the details.

## 6. Review the rendered result

- Screenshot it at real widths. Check against [[web/frontend/ai-tells]] and [[web/copy/ai-writing-tells]].
- Hand screenshots to a fresh reviewer: [[web/frontend/design-review]]. Fix what is real, then recapture.
