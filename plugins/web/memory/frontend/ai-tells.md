---
kind: knowledge
when-and-why-to-read: When you are planning, building or checking a customer-facing page, component or app and want to know whether it will look AI-generated, this knowledge should be read because each tell listed here is a default a language model falls into regardless of subject, and a visitor spots it at a glance.
short-form: "Checklist of tells that make a page look AI-generated, each with its fix, grouped by colour and surface, type, structure and layout, chrome and copy, motion and interaction, assets and access, plus finishing checks."
rationale: >-
  Adapted from Hallmark's gates (github.com/Nutlope/hallmark, MIT), with its tiers, waivers, scoring and tooling removed. This document owns only the list of tells and the one-clause fix for each. The detail behind a fix lives with its owner: visual direction and the rule against invented facts in [[web/frontend/visual-design]]; type, fonts, colour, spacing, separators and motion numbers in [[web/frontend/visual-craft]]; page structure, hero layouts, section compositions, copy, nav and footer in [[web/frontend/marketing-pages]]; control states and forms in [[web/frontend/states-and-interactions]]; pictures in [[web/frontend/imagery]]; overflow and small screens in [[web/frontend/responsive]]; reviewing a rendered page in [[web/frontend/design-review]].
---

# AI tells

Each row is something a model produces whatever the subject is, so a reader takes it as a sign the page was generated. Check the plan against this list before building and the rendered page against it before handing back. When the brief explicitly asks for one of these, follow the brief; the list is for the choices the brief left open.

## The three most common generated looks

| Tell | Fix |
|---|---|
| A warm cream background (near `#F4F1EA`), a high-contrast serif display face and a terracotta or clay accent. Warm, bookish and family briefs pull hardest toward it. | Change one of the three: the accent first, then the background, then the display face. |
| A near-black background with a single bright acid-green or vermilion accent. | Pick the background and accent from the subject's own world, per [[web/frontend/visual-design]]. |
| A broadsheet layout: hairline rules everywhere, zero corner radius, dense newspaper-like columns. | Use it only when the content really is a dense publication; otherwise choose a structure from [[web/frontend/page-shapes]]. |

## Colour and surface

| Tell | Fix |
|---|---|
| A purple-to-blue, purple-to-pink or cyan-on-dark gradient anywhere, including gradient text through `background-clip: text`. | One anchor hue; solid text colour. |
| Gradient text in any other hue. | Solid text colour; get emphasis from weight or the display face. A single-hue ramp (stops within 40° of hue) that keeps contrast is acceptable. |
| `#000`, `#fff`, `oklch(0% …)` or `oklch(100% …)` used as a colour, or a page background that is pure white or pure black by reflex. | Tint toward the anchor hue with chroma 0.005 or more. A pure white background is fine only when it is a deliberate choice for a minimal page. |
| Zero-chroma grey neutrals on a page that has an anchor hue. | Give the neutrals chroma 0.005 or more toward the anchor. |
| A hue picked for the category (blue for software, green for health) rather than for this subject. | Derive the palette from the subject's materials and vernacular, per [[web/frontend/visual-design]]. |
| A framework's stock palette as a token or utility (Tailwind `indigo-500`, `violet-600`, `slate-900` and kin), unless the project already uses it. | A colour mixed for this page in OKLCH; see [[web/frontend/visual-craft]]. |
| Accent colour covering more than about 5% of any screen, without a deliberate decision to use it as a surface colour. | Pull the accent back to actions and one or two marks; accent rules are in [[web/frontend/visual-craft]]. |
| Glow and wash: aurora or mesh blobs behind text, floating blurred orbs, a coloured radial halo or spotlight, a coloured zero-offset glow shadow on a dark background. | A solid or grained background; show depth by lightness steps and shadows with offset and blur. Only when the atmosphere is the design: at most two fixed, unanimated radial glows, each 20 to 30% of the canvas. |
| A colour or `font-family` literal written after the token block. | Declare every colour and font as a token at `:root` and use the token. |

## Type

| Tell | Fix |
|---|---|
| Inter, Roboto, Open Sans, Poppins, Lato or a system face as the display face. | A display face chosen for the subject; see [[web/frontend/visual-craft]] for faces models over-use and where to find others. |
| Running prose wider than 75 or narrower than 45 characters. | `max-width: 65ch`; measure rules are in [[web/frontend/visual-craft]]. |
| More than three font families. | Display, body and at most one outlier face. |
| One word or phrase in a heading set apart by colour, weight, italic, a highlight band or an underline. After the small label above a heading, the most common machine-made heading. | Set the whole heading one way; use a line break, or a second line at a second size. The one exception is the offset-colour print effect in [[web/frontend/texture]] on a page whose look earns it. |
| An italic display face used everywhere by default, or synthesised italic. | Roman display; if italic is the display voice, set it on every heading at that level with a true italic and `font-synthesis: none`. |
| An uppercase display heading that can wrap, with `line-height` under 1.0. | `line-height` of 1.0 at least, 1.02 to 1.08 recommended. |
| Monospace on labels, captions, meta rows, table heads or small type when the content is not code, a figure or a measurement and neither the display nor the body face is mono. | Labels in the body face, a step smaller, normal case. |
| Small uppercase or small-caps text with its letters spread apart: a label, caption, table head, nav link, tag or chip at 15px or under, or any of these letter-spaced past 0.03em. Test: remove the transform and tracking and read it again; it says the same thing. | The body face, a step smaller, sentence case, no tracking. Capitals stay for a wordmark, and for controls on a page whose display face is itself uppercase (tracked 0.04em or less). |
| Text that strains: running text under 12px, functional text under 11px, multi-line prose leaded under 1.3. | Body 16px at 1.5 to 1.65 leading; labels one step smaller. The full scale is in [[web/frontend/visual-craft]]. |

## Structure and layout

| Tell | Fix |
|---|---|
| The template page: hero, three features, a call-to-action band, footer. Test: could this exact sequence of sections sit under a different business's name? | Build the sections the visitor's job and the category call for, per [[web/frontend/marketing-pages]] and [[web/frontend/page-shapes]]. |
| A centred heading over three equal columns of icon-above-heading tiles; an icon in a rounded tile above a heading; a thick coloured stripe down one side of a card. | Vary widths and heights, put icons inline, use a hairline border or none. |
| A card inside a card. | One layer of containment. |
| Every section separated the same way with the same gap. | Use different separators in different places (space, a hairline, a tinted area, a card); the order of separators is in [[web/frontend/visual-craft]]. |
| A hero that is a big number with a small label, a row of supporting stats and a gradient accent. | Open with the most characteristic thing in the subject's world, per [[web/frontend/visual-design]]. A figure leads only when the page is built around it and it carries its unit and its source. |
| A bare figure as the hero's only headline. | Pair it with the line that says what it means. |
| A hero title, lede, action and visual all stacked on one centred axis, filling 92% of the screen or more. | At most two centred elements, with one breaking the alignment; hero layouts are in [[web/frontend/marketing-pages]]. |
| A hero sized in `vh`. | `dvh` or `svh`; see [[web/frontend/responsive]]. |
| At 1280×800, the headline, lede, primary action and the visual's focal point are not all visible without scrolling. | Reduce the display size, tighten leading, cut the lede to two lines, trim padding. |
| At 1440×900 the hero is not exactly one screen: the next section starts above y 760 or below y 900, the content sits off-centre vertically, or the visual is far from the text (centres more than 60px apart, more than 120px of gap) or pinned to the viewport edge. | The visual beside the text, the content centred in its screen; see the hero layouts in [[web/frontend/marketing-pages]]. |
| More than 160px of nothing between the hero's lowest content and the fold. | Centre the content and grow the visual or the heading; never fill the gap with more copy. |
| At 1920×1080 the container has no `max-width`, a grid gains columns, or the hero no longer fits. | Cap the container at 1360 to 1520px and centre it; hold column counts; see the canvas rules in [[web/frontend/marketing-pages]]. |
| Horizontal scroll at any width from 320 to 1920; `100vw` widths. | `overflow-x: clip` on `html` and `body`, `width: 100%`; see [[web/frontend/responsive]]. |
| An image-bearing grid track on bare `1fr`; a display heading without `overflow-wrap: break-word; min-width: 0`. | `minmax(0, 1fr)`; `overflow-wrap: break-word`, never `anywhere`. |
| Two `position: sticky; top: 0` elements, so a section head slides under the nav. | Offset the second by the nav's height and stack the nav above it. |
| CSS-only radio tabs with the radios at `position: absolute; top: 0`, so the page jumps on every click. | Radios in the flow at zero size, or a script handler that focuses with `preventScroll`. |
| More than about 80 words in any 900px-tall window at 1440 wide, or a hero with more than two text blocks before its actions. | Headline, one sentence, actions; page size rules are in [[web/frontend/marketing-pages]]. |
| Gaps between sections under 120px at 1440 (64px where the background colour changes), or every gap the same. | 120px at least, varied; see [[web/frontend/marketing-pages]]. |
| A heading closer to what precedes it than to what it heads. | At least twice as much space above a heading as below it. |
| Text in a filled or bordered box sitting tight against the box's edges, or running text within 8px of a phone's edge. | Pad the box; a 16px gutter on phones. Spacing values are in [[web/frontend/visual-craft]]. |
| A page of small things on a wide canvas: a section body spanning under three quarters of the container, a section with nothing large in it (no 300px visual, no set of three, no list or table of three rows, no large statement). | Add mass, never words: widen the body, add a visual, set a statement large, or merge the section; the section compositions are in [[web/frontend/marketing-pages]]. |
| Section headings under 40px at 1440 under a much larger hero. | Set section heads at the section heading size in [[web/frontend/marketing-pages]]. |
| The last section is an email sign-up on a page whose job is not subscribing, joining, attending, listening or visiting. | End on what the visitor came to do, per the job table in [[web/frontend/marketing-pages]]. |

## Chrome and copy

| Tell | Fix |
|---|---|
| Placeholder names (Jane Doe), startup-cliché names (Acme, Nexus), buzzwords (seamless, robust, empower, supercharge, elevate, effortless, unlock, unleash, next-generation, world-class, best-in-class, industry-leading, mission-critical, future-proof), filler openers ("Built for the modern team", "In today's landscape"), em or en dashes, the rebuttal cadence used three or more times ("Not a feature. A platform."), "quietly trusted by", a stock footer line (*All rights reserved*). | Say what the product does in its own nouns; the copy rules are in [[web/frontend/marketing-pages]]. |
| A stock second action beside the primary: *Learn more*, *Get started*, *Book a demo*. | Name the second action by what it does, or drop it. |
| An invented metric, testimonial, logo wall, quote or case-study count. | The user's real figure, a visible slot to fill, or nothing; see [[web/frontend/visual-design]]. |
| A form or control that shows success ("Sent", "You're on the list", "Thanks") with no request behind it. | No success state until the form is wired; say plainly that nothing was sent, per [[web/frontend/visual-design]]. |
| A small label above a heading that only announces it, in any form: stacked, beside, a pill, an ordinal, a category tag over a card, `TRUSTED BY` over logos. Test: delete it; if nothing was lost but a name for what comes next, it was decoration. | Open the section another way, per [[web/frontend/marketing-pages]]. Fine when it carries a fact: a figure caption, a table head, a form label, a tab, a byline or date, a real filename, a live status. |
| Numbered markers (01 / 02 / 03, or `01 / 4` on tiles) on content that is not a sequence. | Number only a real sequence where order carries information. |
| Template punctuation: meta joined by middle dots (`A · B · C`), an arrow glued to link or button text (`Learn more →`), decorative status dots before labels, `WORD - fragment` labels. | Line breaks, columns, hairlines; a verb as the label. One dot in a byline, a marquee's repeating separator and a dot that shows live state are fine. |
| The default nav (wordmark left, inline links, button right, hairline under) or the default footer (four link columns, a social row, copyright) used without deciding it. | Decide the nav and footer for this page; see [[web/frontend/marketing-pages]]. |
| A hand-drawn browser bar (traffic lights, URL pill) or OS window title bar around a screenshot. | The real screenshot in a `<figure>`, with no frame. |
| More than one device frame (phone, laptop, terminal, editor), or a frame with nothing real inside. | One frame with real content, or none. |
| Fakes of real things: a hero "product UI" built from styled divs with invented figures, a many-point `clip-path` faking a photo's edge, CSS bevels faking a physical object, a decorative grid or stripe background with nothing measured under it. | The product captured or built at full fidelity, a real asset, or nothing; see [[web/frontend/imagery]]. Geometry that is geometry (a diagram, a chart) is fine. |
| A built mock of a product that exists and could be captured (it has a URL, a dev server, or code in the folder). | Run it, put it in a telling state and screenshot it; see [[web/frontend/imagery]]. |
| Decoration text: rotated vertical text with nothing to say, scroll cues, a version badge or `BETA` pill in the hero, a weather or locale strip, a monospace caps strip under the hero, credit captions under stand-in images. | Delete it; a fact it carried becomes a caption or a footer line. |
| More than five empty placeholder frames on a page, or four or more in one row (a team of blank portraits, a row of blank bottles). | Set the set in type (names, roles, facts in a list or table); keep a frame only where a real image will land. |
| One fact (a price, a time, a date, a count) printed in four or more sections, or a section's last line restating its heading. | Say each fact once, where it does work. |

## Motion and interaction

| Tell | Fix |
|---|---|
| `transition: all`; animating `width`, `height`, `top`, `left`, `margin` or `padding`. | List the properties; animate `transform` and `opacity`. Motion rules are in [[web/frontend/visual-craft]]. |
| The same lift or scale on every card, more than one hover effect on one element, an image scaling or rotating on hover, a hover state on something not interactive. | One hover signal per element, on the container, never the image. |
| Bounce or overshoot easing on interface state. | An exponential ease-out. |
| More than one scroll-linked animation pattern on a page. | At most one; see [[web/frontend/scroll-animation]]. |
| A keyframe or transform transition with no `prefers-reduced-motion: reduce` fallback. | Add the fallback. |
| Content hidden at rest (`opacity: 0` or `visibility: hidden`) that only a script reveals, so the page is blank if the script fails. | Visible by default; hide only under a class the script adds, or animate from visible with `@starting-style`; see [[web/frontend/states-and-interactions]]. |
| A focus ring that fades in, is missing, is removed with nothing in its place, or is under 3:1 against what it sits on. | An instant `:focus-visible` ring at 3:1 or better; see [[web/frontend/states-and-interactions]]. |
| Controls missing states (active, disabled, loading, error). | All eight states; see [[web/frontend/states-and-interactions]]. |
| Inputs whose border width shifts between states, a focus ring made from `border`, an input a different height from the button beside it, or disabled shown by opacity alone. | Constant border, `outline` for focus, a shared height, disabled shown by opacity plus `cursor: not-allowed` plus the native attribute. |
| Control height outside 44 to 52px on a marketing page. | Sizing for marketing and app controls is in [[web/frontend/states-and-interactions]]. |
| A tooltip whose focus delay equals its hover delay. | Hover 800 to 1000ms, focus 0. |
| A celebratory toast for an effect the user can already see. | Silent success; toasts are for failures and effects the user cannot see. |
| Auto-rotating content with no pause. | Pause on hover and focus, and a visible pause control on anything that moves for more than 5 seconds. |
| A video autoplaying without `muted`; `loading="lazy"` on the largest element of the first screen; a video with no `poster`. | `autoplay muted loop playsinline`; `fetchpriority="high"` on that image, or a preloaded poster for that video. |

## Assets and access

| Tell | Fix |
|---|---|
| An emoji standing in for an icon. | One icon library, a custom SVG, or type. |
| Two icon libraries on one page. | One library; a brand or platform mark in a slot or two is fine. |
| An inline SVG or CSS drawing of an object, plant, animal, person, product, building or scene larger than an icon. | A real photograph, the product, or type at scale; see [[web/frontend/imagery]]. A chart, map or diagram of real data is fine. |
| A coloured or gradient block 300×200px or larger showing nothing. | A real image or the product; see [[web/frontend/imagery]]. |
| 24 or more identical marks (ticks, dots, bars) standing for a quantity, one per item or day. | Set the number in type. |
| Photographs covering more than about a third of the page below the hero, so it reads as a stock gallery. | Keep the strongest pictures, set large; build the rest from type, figures, the product or a table; see [[web/frontend/imagery]]. |
| A broken image, an openly licensed photo with no credit on the page, a paid stock photo, or a hotlinked stock photo. | The real file, credited where its licence asks; licensing is in [[web/frontend/imagery]]. |
| A decorative `<svg>`, `<canvas>` or CSS-art element with neither `aria-hidden="true"` nor a label. | Hide it or name it. |
| Text covered by an opaque box, an image or other text (sticky and fixed chrome aside). | Give the text its own space, or its own background above the cover. |
| Text, icons, focus rings or field edges below contrast thresholds against their computed background. | Fix the pair; the thresholds are in [[web/frontend/visual-craft]]. |
| Button text too close in lightness to its fill, a dark panel that keeps the light-panel text colour, grey text on a coloured background. | Pair every fill with its own text colour. |
| A button label or primary nav link that wraps at any width from 320 to 1920; a footer link, tab or breadcrumb that wraps. | Shorten it; `white-space: nowrap` on buttons and primary links; see [[web/frontend/responsive]]. |
| Spacing values off the page's spacing scale (more than two or three optical nudges). | Use the scale in [[web/frontend/visual-craft]]. |

## Finishing checks

Smaller details, invisible at arm's length, that still mark a page as unfinished.

- [ ] Curly quotes in prose, not straight ones; `…` for an ellipsis, not `...`.
- [ ] No `text-wrap: balance` on the hero's display heading (smaller headings may use it).
- [ ] At 375 and 1280, no paragraph leaves one word alone on its last line and no two- or three-line heading ends on a short stub: balance that heading, set `text-wrap: pretty` on the copy, or rewrite.
- [ ] One filled primary button style per page (a dialog counts as its own page), and never two filled buttons side by side.
- [ ] No icon sitting in a coloured circle.
- [ ] Display-size figures use tabular numerals.
- [ ] One container style is not stamped on six or more different elements, and the pill radius is not on five or more things that are not controls, tags or badges.
- [ ] No fake-person avatar hotlinks, and no stock photos found by searching for a kind of person.
- [ ] No Lottie animation where CSS or SVG would do.
- [ ] A highlighter band sits behind the x-height, not at the baseline; an underline is 2px or thinner and offset 0.25em or less.
- [ ] A flex row of items with different heights has `align-items: center`.
- [ ] The outlier face carries one role only.
- [ ] A field's helper-text line reserves its space (`min-height: 1lh`) so an error does not shift the layout.
- [ ] One container width, one column gap below the hero and one corner radius per nesting level (see [[web/frontend/marketing-pages]]); no more centred heading groups than left-aligned ones.
- [ ] `::selection`, `caret-color` and `scrollbar-color` are themed on a page with its own palette.
- [ ] No text block squeezed to under about 16 characters wide over four or more lines at 1440.
- [ ] No placeholder frame renders under 40px in either dimension at 1440.
- [ ] At most three font weights in running use, display and body together.
- [ ] No grid or wrapping row leaves one item alone on its last row under a fuller row.
- [ ] Heading levels are not skipped.
- [ ] Justified text has `hyphens: auto`.
- [ ] The document has `lang`, a `<title>` and a meta description.
- [ ] No hairline border under a wide soft shadow on the same surface.
- [ ] A phone gets the same content as a desktop: nothing of 40 words or more hidden at 375, and no table opening with columns off-screen (see [[web/frontend/responsive]]).
- [ ] Screenshots checked at a phone width, 1280×800, 1440×900 and 1920×1080; for a review by a fresh reader, see [[web/frontend/design-review]].
