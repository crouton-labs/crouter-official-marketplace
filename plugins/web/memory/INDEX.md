---
kind: knowledge
when-and-why-to-read: When you are about to design, critique, mock up, or debug a website or product UI — or you read frontend source before making a design decision — open this dir because it routes you to the one frontend document that owns the job instead of leaving you to design from defaults.
short-form: Web/frontend knowledge — visual direction, interface craft, UX heuristics, design workflow, HTML mockups, and frontend debugging.
surfaces:
  - on: read
    match:
      - "**/*.tsx"
      - "**/*.jsx"
      - "**/*.css"
      - "**/*.html"
      - "**/*.vue"
      - "**/*.svelte"
      - "**/*.astro"
      - "**/*.scss"
    at: content
---

# Web / frontend

To make something look great end to end, run [[web/design]]: it walks the steps below in order.

## Designing

- [[web/frontend/visual-design]] — distinctive visual direction for customer-facing pages, components, and apps: subject grounding, a color/type/layout/signature token plan, self-critique, never inventing facts, and the quality checks.
- [[web/frontend/art-direction]] — art direction before styles: scope, a one-sentence concept from the subject, real references, composition, signature details, critiquing the render.
- [[web/frontend/anti-default-direction]] — escaping the first, average pick: name the default, start from the case's facts or a rolled seed, and avoid the escape becoming the next default.
- [[web/frontend/style-presets]] — named looks (editorial, Swiss, brutalism, luxury and more) and a full house style, with how to adopt one without it becoming a template.
- [[web/frontend/visual-craft]] — spacing, separators, shadows, radii, z levels, layout geometry, optical alignment and composition, plus page details such as tables, pricing and the browser's own surfaces.
- [[web/frontend/typography]] — type in numbers, choosing and pairing faces, faces models over-use, loading, and text-wrap and numeral details.
- [[web/frontend/color]] — OKLCH colour in four layers, accent share, contrast numbers, choosing a palette for the context, harmony, neutrals and colour blindness.
- [[web/frontend/motion]] — the five functions of motion, a motion language, durations, easings, springs, choreography, interruption, performance and reduced motion.
- [[web/frontend/iconography]] — one icon grid and stroke, optical balance, outline vs fill, recolouring by state, and stock icon sets as a tell.
- [[web/frontend/interface-polish]] — the small details that make an interface feel finished (concentric radii, optical alignment, press scale, tabular numbers) and a review output format.
- [[web/frontend/design-tokens]] — three token layers, an OKLCH token core, and mapping it to CSS, Tailwind v4 and shadcn.
- [[web/frontend/design-md]] — the project DESIGN.md: when to create it, what it holds, and keeping code to it.
- [[web/frontend/accessibility]] — WCAG 2.2 AA: contrast, focus, keyboard, targets, forms, ARIA basics, motion and testing.
- [[web/frontend/ai-tells]] — checklist of the things that make a page look AI-generated, each with its fix, and the finishing checks before handing back.
- [[web/frontend/marketing-pages]] — landing pages and marketing sites: build around the visitor's job, section order, the grid and sizes, section and hero layouts, nav and footer, and copy rules.
- [[web/frontend/page-shapes]] — 21 overall page structures (statement first screen, product tour, long document, and so on), when each fits, and how each sets headings, dividers, images and reveals.
- [[web/frontend/imagery]] — what fills a page: the user's own pictures, product screenshots, openly licensed photos, icons and video, and taking a real brand's colours and fonts from its own site.
- [[web/frontend/states-and-interactions]] — every control's states, focus, hit targets, forms, modals, menus, toasts, loading/empty/error screens, and recipes for common controls; for apps and pages alike.
- [[web/frontend/responsive]] — how a layout changes from 320 to 1920px: breakpoints, what collapses, overflow rules, phone tables and safe areas.
- [[web/frontend/dark-mode]] — building a dark theme from the light one, the toggle without a flash, and checking both.
- [[web/frontend/data-viz]] — choosing a chart from the data, hand-written SVG charts, chart colour and honest axes.
- [[web/frontend/scroll-animation]] — when animation tied to scroll position is allowed, four recipes, and the fallback.
- [[web/frontend/texture]] — which pages earn grain, halftone, offset print colour, scanlines or deckled edges, and the limits.
- [[web/frontend/interface-design]] — dashboards, admin panels, and tools: intent before code, subtle layering, monitoring and rule-builder patterns.
- [[web/frontend/ux-principles]] — heuristics and evaluation frameworks (Nielsen, Norman, Shneiderman, Gestalt, Fitts, Hick) plus oversight UX for autonomous systems.
- [[web/frontend/design-website]] — interactive product-design workflow producing a design document.
- [[web/frontend/role-ui-ux]] — UX-consultant role: opinions on flows and IA, no implementation.

## Copy

- [[web/copy/voice]] — a voice and prose style: voice attributes, lexicon, syntax, rhythm, structure.
- [[web/copy/ai-writing-tells]] — what makes prose read as generated, and what to cut.
- [[web/copy/hooks-and-titles]] — hook types, formulas and title rules.
- [[web/copy/cta]] — choosing and writing one call to action, its mechanism, testing and accessibility.
- [[web/copy/technical-articles]] — developer articles: thesis, structures, titles, hooks, drafting.
- [[web/copy/plain-technical-english]] — ASD-STE100 Simplified Technical English rules.

## Video

- [[web/video/storyboard]] — the storyboard table and its frame-budget rules.
- [[web/video/anatomy]] — template vs compose, the product-demo beats, good vs slop, and beat structures for common video types.
- [[web/video/scene-review]] — rendering stills per beat and checking them before hand-off.

## Browser extensions

- [[web/chrome-extension/overview]] — MV3 architecture, contexts, messaging and the decision tree; links to the reference docs below.
- [[web/chrome-extension/execution-contexts]], [[web/chrome-extension/service-worker]], [[web/chrome-extension/messaging-rpc]], [[web/chrome-extension/content-scripts]], [[web/chrome-extension/network-csp]], [[web/chrome-extension/storage]], [[web/chrome-extension/permissions]], [[web/chrome-extension/ui-surfaces]], [[web/chrome-extension/manifest-v3]], [[web/chrome-extension/web-accessible-resources]], [[web/chrome-extension/typescript-build]], [[web/chrome-extension/crxjs]], [[web/chrome-extension/debugging-mistakes]], [[web/chrome-extension/publishing]].

## Reviewing and redesigning

- [[web/frontend/design-review]] — handing screenshots and a ready-made brief to a fresh-context reviewer, and acting on its reply.
- [[web/frontend/redesign]] — redesigning an existing page: record every link, field and handler before, and confirm none went missing after.

## Prototyping

- [[web/frontend/mockups]] — self-contained HTML design-review documents for comparing options and states before real code.

## Debugging

- [[web/frontend/debugging]] — component hierarchy, style overrides, layout, state, and rendering.
