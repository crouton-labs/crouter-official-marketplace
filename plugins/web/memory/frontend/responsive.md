---
kind: knowledge
when-and-why-to-read: When you are building or checking a page or app layout that must work from a phone to a wide desktop, this knowledge should be read because a layout checked only at one width ships with sideways scrolling, wrapped buttons, cramped spacing and content a phone never gets.
short-form: "Responsive: render cleanly from 320 to 1920px; two rem breakpoints (60rem, 40rem) with fixed spacing step-downs; clamp() for sizes, media queries for layouts, capability queries for hover and touch; overflow-x clip; clickable text never wraps; dvh not vh; tables, images and languages on small screens."
rationale: >-
  Adapted from Hallmark's responsive reference and the responsive line of its craft reference (github.com/Nutlope/hallmark, MIT). Desktop container, columns and section spacing live in [[web/frontend/marketing-pages]]; type sizes, the spacing scale and motion in [[web/frontend/visual-craft]]; hit targets and control sizes in [[web/frontend/states-and-interactions]]. This document owns only how a layout changes with the width of the screen.
---

# Responsive

Every page renders without fault at every width from 320 to 1920 CSS pixels, and nothing depends on hover or a desktop-only interaction. Check screenshots at 320, 375, 414, 768, 1024, 1280, 1440 and 1920 before handing back.

## Breakpoints

Use two breakpoints for the whole page, written in `rem` so they follow the user's font size, and write every media query in the same direction (all `max-width` or all `min-width`). Add a third only where the content itself breaks.

| Width | Gutter (page edge to content) | Column gap | Gaps between sections (small, normal, large) |
|---|---|---|---|
| Above 60rem (about 960px) | 64px | 32px | 120, 144, 176px |
| Under 60rem | 24px | 32px | 80, 96, 120px |
| Under 40rem (about 640px) | 16px | 16px | 56, 72, 96px |

The desktop row is the default set in [[web/frontend/marketing-pages]]; an app layout steps its own spacing down at the same two widths in the same proportion.

**Under 60rem**, the layout changes:

- Multi-column grids go to one column, and a split heading (heading on the left, its line on the right) stacks.
- Every desktop sidebar or filter column collapses into a menu or a disclosure.
- Tilted elements and clip-path effects are dropped; sticky panes become static.
- The hero shrinks to the height of its content. A hero that is one full-bleed photograph or poster may stay full height.
- Nav links that no longer fit go behind a menu; two or three short ones that still fit stay in the bar.

**Under 40rem**, the type changes:

- Display and heading sizes step down.
- Captions set in the margin move inline under their content, and scattered annotations merge into one note.

A page-specific override (a custom section, an unusual hero) carries its own rule for both widths; do not assume the page's general rules reach it.

## Sizing: fluid and discrete

- Use `clamp()` for sizes that change continuously, such as display type and large gaps. Use media queries for layouts that change discretely, such as column counts.
- Small interface text next to the body (meta lines, nav links, control labels) runs larger on a phone and tightens above 60rem. Body text is never under 16px at any width.
- Use container queries (`@container`) for a widget whose layout depends on the box it sits in rather than on the screen, such as a card that appears both in a sidebar and in the main column.
- Detect capability with media features, never with width or user-agent sniffing:

```css
@media (hover: hover) { .link:hover { text-decoration-thickness: 2px; } }
@media (pointer: coarse) { .btn { min-height: 48px; } }
```

## Overflow

- Put `overflow-x: clip` on both `html` and `body`. Never `overflow-x: hidden` (it makes `body` a scroll container and breaks `position: sticky`), and never a `100vw` width (it includes the scrollbar); use `width: 100%`.
- A grid track that holds an image uses `minmax(0, 1fr)`, not bare `1fr`, so a wide image cannot push the track past the screen.
- A large display heading carries `overflow-wrap: break-word; min-width: 0` so a long word breaks instead of overflowing. Use `break-word`, never `anywhere`.
- Two sticky elements must not both sit at `top: 0`, or a section heading slides under the nav. Give the second one `top` equal to the nav's height, and give the nav a higher `z-index`.

## Clickable text never wraps

Buttons, primary nav links and calls to action stay on one line at every width from 320 to 1920. Footer links, tabs and breadcrumbs do too, unless the text is a real phrase that cannot be shortened, and then two lines at most. When one wraps, fix it in this order:

1. **Shorten the label.** "Get started free" becomes "Start free"; "Read the documentation" becomes "Read the docs".
2. **Add `white-space: nowrap`** to the control and let the row around it reflow.
3. **Collapse the row, not the labels:** under 60rem, the links that no longer fit go behind a menu. A row of tabs scrolls sideways rather than wrapping.

## Units and safe areas

- Use `dvh` or `svh` for any height that meets the mobile browser's toolbars. Never size a hero in `vh`; on a phone it hides the bottom of the hero behind the toolbar.
- With `<meta name="viewport" content="…, viewport-fit=cover">`, fold the safe area into the gutter: `padding-inline: max(16px, env(safe-area-inset-left))`.

## Nothing a phone never gets

Do not hide content on a phone that a desktop shows. If about 40 words or more are visible at 1440 and hidden at 375 (navigation aside), the phone layout is missing content; restack it instead.

- **Tables:** on a phone, the column that names each row and the column that acts on it stay in view. Either restack each row as a labelled block or pin the first column and let the rest scroll. A table must never open with two or more of its columns off the screen. A ten-column table on a phone needs a different design, not a squeeze.
- **Images:** `srcset` with width descriptors; `<picture>` when the phone needs a different crop; `width` and `height` attributes on every image so the page does not jump; `loading="lazy"` below the fold, and never on the largest image in the first screen.
- **Languages:** logical properties (`margin-inline-start`, `padding-block`) so the layout flips for right-to-left text; leave room for strings 30 to 40% longer than English; never hard-code date or number formats (use `Intl`).

## Never

- Device sniffing instead of feature queries.
- An interaction that only works on hover.
- Breakpoints in `px`.
