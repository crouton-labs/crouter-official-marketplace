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
    at: content
---

# Web / frontend

## Designing

- [[web/frontend/visual-design]] — distinctive visual direction for customer-facing pages, components, and apps: subject grounding, a color/type/layout/signature token plan, self-critique, never inventing facts, and the quality checks.
- [[web/frontend/visual-craft]] — the numbers behind type, fonts, colour, spacing, separators, shadows, radii and motion timing, plus page details such as tables, pricing and the browser's own surfaces.
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

## Reviewing and redesigning

- [[web/frontend/design-review]] — handing screenshots and a ready-made brief to a fresh-context reviewer, and acting on its reply.
- [[web/frontend/redesign]] — redesigning an existing page: record every link, field and handler before, and confirm none went missing after.

## Prototyping

- [[web/frontend/mockups]] — self-contained HTML design-review documents for comparing options and states before real code.

## Debugging

- [[web/frontend/debugging]] — component hierarchy, style overrides, layout, state, and rendering.
