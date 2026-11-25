---
kind: knowledge
when-and-why-to-read: When you are writing the CSS for a page or component a person will see — choosing fonts, a type scale, colours, spacing, separators, shadows, or animation timing — this knowledge should be read because each of these has a known good range in numbers, and a value guessed outside it (inherited 1.2 leading, a pure white card, a 300ms ease on everything, Inter as the display face) is what makes a page look unfinished or generated.
short-form: "Visual craft in numbers (type and colour now in typography and color): a fixed spacing scale and separators in order (space, hairline, tinted area, card); one shadow (or a shadow-as-border), image outlines, concentric radii, eight z levels; layout geometry (one gap per sibling group, proximity ladder, alignment keylines, centering by ink in small controls, optical alignment, breathing room, failure catalogue); composition (grids, bento, asymmetry, whitespace, scanning, density, tells); motion only on transform and opacity at 120/220/420ms with one reveal per page."
rationale: >-
  Adapted from Hallmark's craft reference (github.com/Nutlope/hallmark, MIT), with its tooling, tokens and theme system removed; its type, font and colour sections moved to [[web/frontend/typography]] and [[web/frontend/color]]. Concentric radius, optical alignment, shadows instead of borders and image outlines come from make-interfaces-feel-better's surfaces reference (github.com/jakubkrehel/make-interfaces-feel-better, MIT); layout geometry from better-design's layout-geometry reference (github.com/Moddingflow/better-design, MIT), with its game-engine notes and layout-check script removed; spacing by relationship and composition from samber's frontend-design-deslop layout reference (github.com/samber/cc-skills, MIT). Neighbouring documents own the adjacent topics: [[web/frontend/visual-design]] the visual direction and the rule against invented facts; [[web/frontend/marketing-pages]] the size roles, section spacing, hero layouts, copy and section openings; [[web/frontend/states-and-interactions]] controls, inputs, focus rings, tooltips and menus; [[web/frontend/responsive]] breakpoints and overflow; [[web/frontend/dark-mode]], [[web/frontend/data-viz]], [[web/frontend/scroll-animation]] and [[web/frontend/imagery]] their own topics.
surfaces:
  - on: read
    match:
      - "**/*.css"
      - "**/*.scss"
      - "**/*.sass"
      - "**/*.less"
      - "**/tailwind.config.*"
      - "**/theme.ts"
      - "**/tokens.*"
    at: preview
---

# Visual craft

The numbers behind surfaces, layout geometry, composition and motion. Decide the direction first with [[web/frontend/visual-design]]; this document turns it into values. The size of each text role (hero heading, section heading, item title, lead, body, label), the spacing between sections and the hero layouts are in [[web/frontend/marketing-pages]]. Control and input styling, focus rings, tooltips, menus and modals are in [[web/frontend/states-and-interactions]]. Breakpoints and horizontal overflow are in [[web/frontend/responsive]].

## Type, fonts and colour

Type (families, weights, scale, tracking, leading, measure), the font lists, the wordmark and font loading are in [[web/frontend/typography]]. Colour (OKLCH, the four layers, accent coverage, contrast and the never list) is in [[web/frontend/color]]. How these values are held as tokens is in [[web/frontend/design-tokens]].

## Surfaces and spacing

- **Pick a main direction of weight** for the layout: weighted left, weighted right, heavy at the top, or weighted at the bottom. Centring everything is a default, not a choice.
- **Spacing scale:** 2, 4, 8, 12, 16, 24, 40, 64, 96, 144px. Every space comes from the scale, with at most three optical nudges off it on the page. Use `gap` between siblings; use `margin` only to break out of the flow. Small boxes with text inside (buttons, tags, pills) take at least `max(8px, 0.5em)` padding at the sides and `max(4px, 0.3em)` top and bottom. How far apart sections, headings and grid items sit is in [[web/frontend/marketing-pages]].
- **Grids:** CSS Grid for the page, Flexbox inside components. Flex children that must shrink take `min-width: 0`; icons and images take `flex-shrink: 0`. No empty cell and no lone item on a last row: change the column count instead. Grids keep their column count above 1440px wide, and anything sized in `vw` carries a `max-width`.
- **Separators, in order:** to separate two things, use the first that works. 1. Space. 2. A 1px hairline in a rule colour. 3. A tinted area (a second or third background shade, no border). 4. A card (a border or a shadow, never both), kept for content that is independently clickable or of a different kind from what surrounds it. Never white cards on a tinted page, a card inside a card, or a bordered box inside a tinted area. Use different separators at different boundaries rather than the same one everywhere.
- **Stats side by side** are separated by a top or vertical hairline, with no leading padding on the first and no trailing padding on the last; reset the pattern wherever the column count changes.
- **Depth comes from weight and scale.** One shadow style at most, either `0 1px 2px oklch(20% 0.01 <hue> / 0.05)` or `0 0 0 1px oklch(30% 0.01 <hue> / 0.06)`. A raised surface is never darker than the page behind it.
- **Z levels, eight in all:** base 1, raised 10, dropdown 100, sticky 200, sticky nav 300, modal 400, toast 500, tooltip 600.
- **Radii:** one radius per nesting level, concentric (inner radius = outer radius − padding, at least 2px). Images take `min(1vw, <card radius>)`. When nesting rounded elements, the outer radius must equal the inner radius plus the padding between them: `outerRadius = innerRadius + padding` This rule is most useful when nested surfaces are close together. If padding is larger than `24px`, treat the layers as separate surfaces and choose each radius independently instead of forcing strict concentric math.
- **Clipping:** clip horizontal overflow with `overflow-x: clip`, which keeps `position: sticky` and `fixed` working where `overflow: hidden` breaks them; a section that overflows on purpose keeps `overflow: visible`. The full overflow rules are in [[web/frontend/responsive]].

### Shadows instead of borders

The one shadow style above may be a shadow-as-border. For **buttons, cards, and containers** that use a border for depth or elevation, prefer replacing it with a subtle `box-shadow`. Shadows adapt to any background since they use transparency; solid borders don't. This also helps when using images or multiple colors as backgrounds — solid border colors don't work well on backgrounds other than the ones they were designed for.

**Do not apply this to dividers** (`border-b`, `border-t`, side borders) or any border whose purpose is layout separation rather than element depth. Those should stay as borders.

The shadow is comprised of three layers. The first acts as a 1px border ring, the second adds subtle lift, and the third provides ambient depth:

```css
:root {
  --shadow-border:
    0px 0px 0px 1px oklch(0 0 0 / 0.06),
    0px 1px 2px -1px oklch(0 0 0 / 0.06),
    0px 2px 4px 0px oklch(0 0 0 / 0.04);
  --shadow-border-hover:
    0px 0px 0px 1px oklch(0 0 0 / 0.08),
    0px 1px 2px -1px oklch(0 0 0 / 0.08),
    0px 2px 4px 0px oklch(0 0 0 / 0.06);
}
```

Apply the variable and add `transition-[box-shadow]` for a smooth hover:

```css
.card {
  box-shadow: var(--shadow-border);
  transition-property: box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

.card:hover {
  box-shadow: var(--shadow-border-hover);
}
```

| Use shadows | Use borders |
| --- | --- |
| Cards, containers with depth | Dividers between list items |
| Buttons with bordered styles | Table cell boundaries |
| Elevated elements (dropdowns, modals) | Form input outlines (for accessibility) |
| Elements on varied backgrounds | Hairline separators in dense UI |
| Hover/focus states for lift effect | |

The dark-mode ring is in [[web/frontend/dark-mode]].

### Image outlines

Add a subtle `1px` outline with low opacity to images. This creates consistent depth, especially in design systems where other elements use borders or shadows.

#### Colour rules

- **Light mode**: pure black, `oklch(0 0 0 / 0.1)`.
- **Dark mode**: pure white, `oklch(1 0 0 / 0.1)`.
- Never use a near-black or near-white from the project palette (e.g. slate-900, zinc-900, `#0a0a0a`, `#111827`, `#f5f5f7`). Tinted outlines pick up the surrounding surface color and read as dirt on the image edge.
- Never match the outline to the project's accent or ink color. The outline is a neutral separator, not a themed element.

```css
img {
  outline: 1px solid oklch(0 0 0 / 0.1);
  outline-offset: -1px; /* inset so it doesn't add to layout */
}
```

The dark-mode outline is in [[web/frontend/dark-mode]].

## Layout geometry

Most "it looks slightly off" defects are geometry: a gap of 16 next to a gap of 22, a row of buttons whose tops differ by 3px, a settings label that starts 6px right of the one above, a label sitting 2px low inside its button, a button touching the window edge. Each is small; together they read as amateur. They are invisible in a downscaled screenshot and easy to introduce when elements are placed by hand, so this reference treats geometry as something you **construct with layout rules and then measure**, never something you judge by eye.

### Construct geometry, do not place it

- Every group of siblings is laid out by a layout container with **one gap token**: CSS flex/grid `gap`. Hand-set coordinates are for genuinely free elements only: world-space markers, diegetic UI, decorative art.
- Never fix a misalignment by nudging one element's offset. Find the shared cause (different pivots, mixed anchors, a missing layout group, different control heights, sprite padding) and fix it at the container, component, or token.
- Siblings of the same kind share a size: buttons in one row or column have the same height, and the same width when they are a set (menu stack, dialog actions, tab bar). Width comes from either the longest localized label plus padding or a fixed size token, applied to the whole set.
- Snap to whole pixels after scaling. Choose control and icon sizes with matching parity (an even icon in an even box, odd in odd) so centering never leaves a half-pixel.

### Spacing rhythm: equal intervals, nested by relationship

- All gaps, paddings, and insets come from the spacing scale. A value outside the scale is a defect unless it is layout math.
- **Same relationship, same gap.** Every gap between items of the same kind in one group is identical: all buttons in a menu, all rows in a list, all icons in a toolbar. A different gap must mean a different relationship (a new group), and then it is a clearly larger step from the scale, not a few pixels more.
- **Proximity ladder.** inside a control < between items in a group < between groups < container padding. Concretely, with a 4-based scale: icon↔label 8, item↔item 12–16, group↔group 24–32, panel padding 24–32 (phone 16–24).
- **Padding is never smaller than the gaps it contains.** If buttons inside a window are 16 apart, the window padding is at least 16, usually one step more. Content closer to the frame than to its siblings reads as about to fall out.
- Padding is symmetric unless the design says otherwise: left = right, and top = bottom except for a header band whose extra space is a token.

One uniform gap everywhere is a primary tell of unconsidered layout.

Refactoring UI's heuristic: start with more whitespace than feels necessary, then remove until it feels right, never the reverse. Related elements (label and input, heading and its paragraph, icon and its text) move closer; unrelated elements move apart — this is proximity (see [[web/frontend/ux-principles]]) made literal in pixels.

### Alignment lines

Every element sits on at least one line it shares with its neighbours. Define the lines first (keylines), then attach elements to them.

- **Rows.** Items in a row share a horizontal line: equal-height items share top, center, and bottom; mixed-height items (label + toggle, text + button) share their vertical centers, or text baselines when several texts sit side by side. Never "roughly level".
- **Columns and lists.** Items stacked in a column share an edge: usually the start edge (left in LTR). In a settings list every label starts on one vertical keyline, every control starts on (or ends on) a second keyline, and values align on a third. Achieve this with a two-column grid or a fixed label column width, never with per-row offsets. Numbers that are compared align on the end edge with tabular numerals.
- **Text vs. its box.** Align text by its visible start, not by its container's padding: a label inside a padded row and a heading outside it must still start on the same keyline if they belong to the same column.
- **Window structure.** Title, content, and the action row share the window's content edges; the action row is anchored to a consistent corner or centered as a set, identically in every dialog of the product.
- Optical exceptions are explicit: a large heading's side bearing, a round icon next to square ones. Correct them once in the component or token and record why.

### Content inside small controls

Small controls (buttons, chips, tabs, slots, toggles, icon buttons) are where misplacement is most visible, because the margin of error is a few pixels.

- **Center by the visible ink, not by the line box.** Font line boxes include ascender and descender space, so a label "centered" by its line box sits low or high, worse for all-caps and Cyrillic. `text-box: trim-both cap alphabetic` (where supported) or equal padding tuned to the font's cap height, verified by measurement; set `line-height` explicitly on controls. Default line-box centering measurably puts caps about 1px low in a 56px button at 16px system-ui, so even untouched browser buttons need this check.
- **Icons: measure the sprite, not the rect.** Transparent padding in a sprite or SVG viewBox moves the visible icon off-center. Trim the asset, and keep all icons of a set on the same canvas size with the same internal margin.
- **Optical centering is declared, not improvised.** Asymmetric glyphs (a play triangle, an arrow, a speech bubble) are centered by visual mass: shift toward the light side by roughly 5–10% of the icon width. Bake the offset into the icon asset or the icon-button component, and declare it so a check can tell intent from error.
- **Icon + label.** One gap token between them, the pair centered as a unit, icon vertically centered on the label's cap height. The same pair uses the same gap and icon size in every control of the set.
- **Start-aligned content** (list rows, menu items with leading icons) uses the same start inset in every sibling control, and is still vertically centered.
- **Fit.** Content keeps at least the control's padding on every side for the longest supported localized string. Horizontal padding ≥ vertical padding. A primary action label never truncates or shrinks below the type scale; widen the set, wrap to two lines by design, or shorten the copy.

### Optical alignment

When geometric centering looks off, align optically instead.

#### Buttons with Text + Icon

Use slightly less padding on the icon side to make the button feel balanced. A reliable rule of thumb is:
`icon-side padding = text-side padding - 2px`.

```css
/* Good — less padding on icon side */
.button-with-icon {
  padding-left: 16px;
  padding-right: 14px; /* icon side = text side - 2px */
}

/* Bad — equal padding looks like icon is pushed too far right */
.button-with-icon {
  padding: 0 16px;
}
```

```tsx
// Tailwind
<button className="pl-4 pr-3.5 flex items-center gap-2">
  <span>Continue</span>
  <ArrowRightIcon />
</button>
```

#### Play Button Triangles

Play icons are triangular and their geometric center is not their visual center. Shift slightly right:

```css
/* Good — optically centered */
.play-button svg {
  margin-left: 2px; /* shift right to account for triangle shape */
}

/* Bad — geometrically centered but looks off */
.play-button svg {
  /* no adjustment */
}
```

#### Asymmetric Icons (Stars, Arrows, Carets)

Some icons have uneven visual weight. The best fix is adjusting the SVG directly so no extra margin/padding is needed in the component code.

```tsx
// Best — fix in the SVG itself
// Adjust the viewBox or path to visually center the icon

// Fallback — adjust with margin
<span className="ml-px">
  <StarIcon />
</span>
```

### Breathing room: nothing clipped, nothing on the edge

- Nothing overflows its parent: no button, label, icon, focus ring, or glow clipped by the window, panel, mask, or screen. Scroll regions are the only legitimate overflow, and their content still keeps padding inside the viewport.
- Nothing sits on the edge: every child keeps at least the parent's padding from every edge. Treat a 0–4px distance to a frame as a defect even when nothing is clipped yet; at another aspect ratio or language it will be.
- Screen-level margin: interactive UI stays inside the platform safe area (notches, rounded corners). Keep at least the panel padding token from the window edge at the smallest supported resolution.
- Leave reserve for growth: localized text (German, Russian often +30–40%), large numbers, 200% text, hover/pressed scale (a 1.05 scale on a button that is 2px from the edge will clip). Reserve = scale headroom + focus ring width.
- A dense surface may use smaller tokens; it does not get to drop the padding rule. When content does not fit, change the layout (scroll, columns, pagination, collapse), never the margins.

### Visual check at real scale

- Capture at the native target resolution and inspect **crops at 1:1 or 2–4× zoom**: each button row, each list's start edge, each small control. Never judge 2px from a full-screen thumbnail.
- Turn on layout debug overlays where they exist (browser layout/flex overlays and outlines) and look for edges that almost but not quite line up.
- Squint at a column: start edges should form one clean vertical line; rows should form one clean horizontal band.

### Failure catalogue

| Symptom | Usual cause | Fix at the cause |
| --- | --- | --- |
| One button's gap differs | Hand-placed child, or a spacer element in a flex row | Remove manual offsets/spacers; one `gap` token |
| Row tops differ by a few px | Different control heights | Shared size token; the container owns position |
| Settings labels start at different x | Per-row padding, labels with different alignment, or no shared column | Two-column grid / fixed label column width |
| Label low inside button | Line-box centering (CSS line-height) | Cap/ink centering per section 4 |
| Icon off-center in its slot | Transparent sprite/SVG padding, or no optical offset on an asymmetric glyph | Trim asset; declare optical offset in the component |
| Button touches or exits the window | Fixed widths + long localization, hover scale, missing padding | Padding token, content-sized set, reserve for scale and focus ring |
| Half-pixel blur or 1px drift | Odd/even size mismatch, fractional scaling | Matching parity; round positions after scaling |

## Composition

### Grids: 12-column, modular, bento

The 12-column grid is the workhorse because 12 divides into halves, thirds, quarters, and sixths. Primary content spans 6 to 8 columns, secondary 3 to 4. Establish a max content width and consistent gutters, then compose within them.

Bento grids (modular blocks of varying size, named after the compartmentalized Japanese lunchbox) are strong for showcasing diverse content (feature sets, dashboards, capability overviews) because Gestalt proximity and similarity make uneven blocks read as one organized whole, and they restack cleanly on mobile. Popularized by Apple product pages and Linear.

Caution: bento-everything is now itself a 2025 to 2026 tell — use it when content genuinely varies in size and importance, not as the default container for three equal features.

Modular and Swiss grids treat the grid itself as the visible structure: columns, baseline rhythm, and alignment are the design.

### Asymmetry and editorial composition

Symmetry is safe and static; intentional asymmetry creates energy and directs the eye — offset a heading from its supporting text, let an image bleed past the grid, or stagger a two-column layout so the eye moves diagonally.

Editorial layouts borrow from print: real columns, pull quotes, rules and dividers instead of cards, drop caps, a strong measure. The goal is at least one intentional, brief-specific layout move per page so the composition is not the default template.

State the move (for example "asymmetric two-column hero with the product screenshot bleeding off the right edge") before building.

### Whitespace as a tool

Whitespace is not empty; it is the primary signal of quality and confidence. The shared principle across Stripe, Linear, and Vercel: take the spacing that already feels generous, then add more.

Macro whitespace (between sections, around the page) sets the calm; micro whitespace (line-height, padding inside controls, gaps in a group) sets legibility. Premium and editorial positioning lean on vast whitespace and large type; dense tools spend it carefully. Cramped-by-default is a slop tell; so is uniform whitespace with no rhythm.

### Scanning patterns and placement

Eyes scan predictably. For text-heavy pages, the F-pattern: users read the top line, scan down the left edge, and dip right occasionally, so put the most important words at the start of headings and left-align body.

For sparse, visual pages (landing, hero), the Z-pattern: top-left brand, top-right action, diagonal to the value proposition, then to the primary CTA bottom-right. Most critical content goes top-left; the primary CTA sits along the natural path.

On dashboards, the most important metric goes top-left and the layout follows the decision the view supports.

### Density by artifact type

Density must fit the job. Dashboards and professional tools tolerate and often require high density: small type steps, tight rows, many elements per view, because power users scan and compare.

Marketing, portfolio, and premium pages want air: few elements per view, large type, generous space. Matching density to the artifact is itself a deslop move — a marketing page with dashboard density feels cramped, a dashboard with marketing air feels empty and wastes the expert user's screen.

### Composition tells

- Hero plus three equal feature cards plus testimonials plus CTA as the only structure.
- Everything centered in a max-width container as the sole layout idea.
- Identical same-sized card grid as the only device for everything.
- Nested cards (cards inside cards inside cards).
- Uniform spacing everywhere with no tight-within / loose-between rhythm.
- Bento grid used by reflex for content that does not vary in size or importance.
- Centered long-form body text (reserve centering for short headings and one to two line blocks).
- A fixed grid that squashes instead of restacking on mobile.

### Layout moves to borrow

Transpose the named move, not the page. All names below are inspiration only.

- **Linear**: bento sections with subtle glow-bordered blocks; consistent rhythm across every screen. Transpose the disciplined block grid with one accent on active state.
- **Apple product pages**: bento for diverse capabilities, full-bleed imagery, dramatic vertical pacing. Transpose the alternation of full-bleed and contained sections.
- **Vercel**: a faint blueprint grid behind content; white on near-black; build-log animation in the hero. Transpose the structural background grid at low opacity.
- **Stripe**: generous whitespace, embedded live code samples beside prose, a confident single accent over near-monochrome. Transpose the product-in-the-hero (real interface, not stock).
- **Mercury**: premium minimalism, vast whitespace, restrained palette. Transpose the air-as-confidence pacing.
- **Editorial/broadsheet** (The Verge, magazine sites): columns, rules, pull quotes, drop caps. Transpose rules-and-columns replacing the card grid entirely.
- **Swiss reference** (Josef Mueller-Brockmann posters): rigorous grid, asymmetric balance, one accent. Transpose the visible grid as structure.

## Motion

Motion timing, easings, what may animate, the reveal and loop rules and reduced motion are in [[web/frontend/motion]].

## Page details

- **Browser surfaces:** style the parts the browser draws, from the page's own colours, so none shows the browser default:

  ```css
  html { scrollbar-color: <muted colour> <background colour>; }
  body { caret-color: <accent>; }
  ::selection { background: color-mix(in oklab, <accent> 22%, transparent); color: <text colour>; }
  a { text-decoration-thickness: 1px; text-underline-offset: 0.16em; }
  ```

- **Nav:** one line, 56 to 80px tall. A sticky nav sets `scroll-padding-top` on `html` to at least its own height so anchored sections do not land under it. Text links keep one weight across states; show the state with a colour or a soft background, never a filled primary style. The logo links home and carries an `aria-label`. What goes in the nav is in [[web/frontend/marketing-pages]]; how it collapses on small screens is in [[web/frontend/responsive]].
- **Document head:** `lang` on `<html>`, a `<title>` in the page's own words, and a one-sentence meta description. Heading levels step down one at a time. Every `<img>` has `width`, `height` and a file that exists.
- **Prose pages** (articles, docs, legal): line-height 1.65 to 1.75, measure 60 to 75ch.
- **Features and metadata** are a `<dl>`, with the `<dt>` one weight heavier than the `<dd>`.
- **Stats:** the title never wraps, and carries no icon.
- **Assets:** `alt=""` when the image's subject is already named beside it. Footer links at body weight. A row of logos splits evenly (3 + 3, never 5 + 1).
- **Tables:** sentence-case column heads that never wrap, horizontal rules only, no outer border or card, full width. Tables on a phone are in [[web/frontend/responsive]].
- **Pricing:** mark the featured tier with its button and a word, never a different card colour. Buttons line up across tiers at the bottom. A taller featured tier is a grid sibling on explicit rows, never pulled up with negative margins.
- **Testimonials:** only ones the user supplied ([[web/frontend/visual-design]] owns the rule against invented facts). The attribution sits at the bottom of each, the avatar is the real person or nothing, and pull quotes use hanging punctuation (`hanging-punctuation: first`).
