---
kind: knowledge
when-and-why-to-read: When you are writing the CSS for a page or component a person will see — choosing fonts, a type scale, colours, spacing, separators, shadows, or animation timing — this knowledge should be read because each of these has a known good range in numbers, and a value guessed outside it (inherited 1.2 leading, a pure white card, a 300ms ease on everything, Inter as the display face) is what makes a page look unfinished or generated.
short-form: "Visual craft in numbers: two font families and three weights, display tracking and leading by size, body 16px at 45–75ch; fonts models over-use and better ones; OKLCH colour in four layers with the accent under 5% of the screen; a fixed spacing scale and separators in order (space, hairline, tinted area, card); one shadow, eight z levels; motion only on transform and opacity at 120/220/420ms with one reveal per page."
rationale: >-
  Adapted from Hallmark's craft and fonts references (github.com/Nutlope/hallmark, MIT), with its tooling, tokens and theme system removed. Neighbouring documents own the adjacent topics: [[web/frontend/visual-design]] the visual direction and the rule against invented facts; [[web/frontend/marketing-pages]] the size roles, section spacing, hero layouts, copy and section openings; [[web/frontend/states-and-interactions]] controls, inputs, focus rings, tooltips and menus; [[web/frontend/responsive]] breakpoints and overflow; [[web/frontend/dark-mode]], [[web/frontend/data-viz]], [[web/frontend/scroll-animation]] and [[web/frontend/imagery]] their own topics.
---

# Visual craft

The numbers behind type, fonts, colour, surfaces and motion. Decide the direction first with [[web/frontend/visual-design]]; this document turns it into values. The size of each text role (hero heading, section heading, item title, lead, body, label), the spacing between sections and the hero layouts are in [[web/frontend/marketing-pages]]. Control and input styling, focus rings, tooltips, menus and modals are in [[web/frontend/states-and-interactions]]. Breakpoints and horizontal overflow are in [[web/frontend/responsive]].

## Type

- **Families:** two at most, a display face and a body face, or one family for both. One family at different weights counts as one. A third face is allowed only for exactly one job (the wordmark, one large headline figure, or code; a mono used for both code and measured figures still counts as one job). A third face doing two jobs is a third family in running use, which is one too many.
- **Weights:** three at most across the whole page, display and body together, chosen far apart: 300 beside 800, or 400 beside 700.
- **Scale:** a 1.25 ratio up from a 16px body. Past the size roles, build hierarchy from weight and colour, not from more sizes.
- **Display tracking:** -0.02 to -0.04em on a regular-width face; 0 to -0.015em on a condensed or very heavy face. Two letters touching is a fault.
- **Display leading:** 1.0 to 1.15, tighter as the size grows. 1.2 looks inherited. A mixed-case poster-sized heading may close to 0.92. An uppercase heading that can wrap never goes under 1.0.
- **One heading, one treatment:** a heading is one weight, one style and one colour. Do not set one word in a different colour, italic, weight or highlight. Get stress from a line break, or from a second line at a second size.
- **Very large headings:** a single word may go to 7rem. A poster-scale page sizes the heading with the screen, `clamp(4rem, 10vw, 9rem)`, reaching full size at 1440px and holding there at 1920, while the first screen still shows the headline, one sentence and the action. A wide face takes the poster scale one step down.
- **Hero heading size by length:** count the characters of the rendered `h1`. 20 or fewer: the hero heading size, and a single word may go up to 7rem. 21 to 50: the hero heading size. 51 to 90: the smaller long-heading size, or split it at the sense break with `<br>`. Over 90: rewrite it. A `<br>` goes only between phrases, and check it at 375px wide, where it often lands badly.
- **Wrapping:** `text-wrap: balance` on headings and `text-wrap: pretty` on body text, so no heading ends on a stub and no paragraph ends on one word.
- **Heading measure:** set on the heading element in `ch`, never on the wrapper around the heading group: `h1` 20ch, `h2` 30ch, `h3` 40ch, a long hero heading about 24ch, the lead line under a heading about 52ch, a body paragraph about 65ch.
- **Body:** 16px minimum, line-height 1.5 to 1.65, measure 45 to 75ch. Never all caps, never justified without hyphenation, never tracked past 0.05em.
- **Labels, captions, table heads, meta, tags, chips and nav links:** the body face one step smaller, sentence case (lowercase only on a page whose whole voice is lowercase), no added tracking. Use mono only for code, a figure or a measurement, or when the whole page is set in mono. Capitals belong to the wordmark and to a page whose display headings are uppercase; there, a control may follow in capitals at 0.04em tracking or less.
- **Always:** `font-display: swap`; a fallback of the same build (a grotesk falls back to `system-ui`, a serif to Georgia); `font-synthesis: none`; `font-variant-numeric: tabular-nums` on figures that are compared (tables, prices, stats); curly quotes, a true ellipsis (…), and a non-breaking space inside unit pairs (`10 MB`, `⌘ K`) in a proportional face.

## Fonts

Choose the class of face the page's idea calls for (a roman serif, a condensed sans, a mono), then try two or three faces from that class with the real headline set in each, and decide by how it looks on the page. A face's name, its reputation, or an association with the subject is not a reason. Use free faces unless the user has confirmed a licence. Prefer variable fonts.

### Faces models over-use

Every model reaches for these first, so on a page they read as unchosen. Do not use them as the display or body face: Inter, Roboto, Open Sans, Lato, Poppins, Source Sans, Nunito, Montserrat, Raleway, Work Sans, DM Sans, Plus Jakarta Sans, system-ui, Arial and Helvetica; Merriweather, Lora and Georgia as the body serif; Courier New or the system mono. Use one only when the user asks for it or the project already uses it.

These are good faces but the usual second answer, so use one only with a reason specific to the page: Playfair Display, Cormorant Garamond, DM Serif Display, Fraunces, Instrument Serif, Recoleta, Space Grotesk, Hubot Sans, Bebas Neue and Unbounded as display; Geist, Instrument Sans and Mona Sans as the body or the whole page.

### Display faces to consider

| Class | Faces (source) |
| --- | --- |
| Roman serif | EB Garamond, Cardo, Castoro, Piazzolla, Alegreya, Marcellus (Google); Gambetta, Recia (Fontshare) |
| High-contrast serif | Gloock, Libre Bodoni, Abril Fatface, Rozha One, Besley (Google); Erode, Melodrama (Fontshare) |
| Slab serif | Arvo, Hepta Slab, Domine, Alfa Slab One, Solway (Google); Bespoke Slab (Fontshare; its old-style figures ignore `lining-nums`, so set figures in the body face) |
| Grotesk sans | Rethink Sans, Reddit Sans, Albert Sans (Google); Clash Grotesk, Supreme (Fontshare) |
| Geometric sans | Lexend, League Spartan, Afacad (Google); Satoshi, Technor, Excon (Fontshare) |
| Rounded sans | Inclusive Sans, Varela Round, Nunito Sans at 700 only with a reason (Google); Chubbo, Comico (Fontshare) |
| Condensed and heavy | Teko, Tektur, Michroma, Antonio (Google); Clash Display, Panchang, Khand, Telma, Stardom, Array (Fontshare) |
| Mono as display | Space Mono, Fragment Mono, Red Hat Mono, Spline Sans Mono, Sometype Mono (Google) |
| Pixel | Press Start 2P, VT323, Pixelify Sans, Tiny5, DotGothic16, Workbench (Google) |
| Handwritten | Shantell Sans, Caveat, Gochi Hand, Reenie Beanie (Google); Sharpie (Fontshare) |

### Body faces to consider

- **Sans:** Hanken Grotesk, IBM Plex Sans, Figtree, Onest, Sofia Sans, Golos Text, Karla, Chivo, Albert Sans, Public Sans, Archivo, Manrope (Google); Switzer, General Sans, Satoshi (Fontshare).
- **Serif:** Newsreader, Source Serif 4, Literata, Spectral, Crimson Pro, EB Garamond, Piazzolla (Google); Sentient (Fontshare).
- **Mono for code, figures and measurements:** Geist Mono, JetBrains Mono, IBM Plex Mono, DM Mono, Fira Code, Azeret Mono, Chivo Mono, Overpass Mono (Google).

### Sources

- **Google Fonts:** free, served from a CDN, works everywhere. The default.
- **Fontshare** (Indian Type Foundry): free for commercial use, foundry quality. One line: `<link href="https://api.fontshare.com/v2/css?f[]=<family>@<weights>&display=swap" rel="stylesheet">`.
- **A paid foundry** (Klim, Pangram Pangram, Production Type, Lineto, Colophon) only when the user has confirmed the licence; then ask which faces they hold and pick from those.

### The wordmark

The wordmark in the nav and footer may use a different face from the body, and on a page with a strong tone it should: setting it in the body family flattens the hierarchy and the page looks unbranded. When the page has no other use for a third face, the wordmark is its one job.

```css
:root { --font-body: "Switzer", ui-sans-serif, system-ui, sans-serif; --font-wordmark: "Gambetta", ui-serif, serif; }
.wordmark { font-family: var(--font-wordmark); font-weight: 600; letter-spacing: -0.015em; }
```

Use one family for everything only when the body voice is the brand (a letter, a manifesto, a long document); then the wordmark takes the family's display cut or its heaviest weight. A product page whose wordmark is the body face at 600 is the undesigned default.

### Loading

- Load only the weights the page uses, one `<link>` per source, with `display=swap`, and a `<link rel="preconnect">` to the font host before it.
- A self-hosted `@font-face` carries `font-display: swap` and a fallback matched to the face's metrics (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`, using published values only) so the swap does not shift the first screen.
- Never let the browser fake bold or italic: `font-synthesis: none`, and load the real italic if a heading uses it.
- A variable font loads once and gives every weight; use it where the family ships one.

## Colour

- **Write every colour in OKLCH.**
- **Four layers:**
  - Background colour: on a light page lightness 92 to 98% with chroma 0.005 to 0.015 toward the page's main hue; on a dark page lightness 12 to 18%, chroma 0.008 to 0.015.
  - Text colour: lightness 16 to 24% on a light background, 88 to 96% on a dark one, tinted at chroma 0.005 to 0.014.
  - Five to nine neutrals between them (muted text, rules, a second and third background shade), each tinted at chroma 0.005 to 0.018.
  - One accent at chroma 0.12 to 0.22, with its own paired text colour for anything set on an accent fill.
- **Focus colour:** on the accent's hue, chroma 0.18 to 0.22, lightness within 5% of the accent. How the focus ring is drawn is in [[web/frontend/states-and-interactions]].
- **No pure black or white** as a surface or as a one-off value. Tint every grey toward the page's main hue.
- **The accent is a signal, not a fill.** Use it for an active nav item, the focus ring, a link underline on hover, the primary control, and the one data series a chart argues from. Chart colour in full is in [[web/frontend/data-viz]].
- **How much of the page the colour covers.** Decide which of these the page is before writing CSS:
  - **Accent only:** the default. The accent covers under 5% of any screen.
  - **One colour covers 30 to 60% of the page,** as background bands or as the background itself; the accent stays a signal.
  - **Three or four colours,** each with one named job (for example a background band colour, a signal colour, a colour for one recurring mark such as a badge, and the text colour) and a set share of the page.
  - **The whole background is the colour,** and the text colour and rules are derived from it.
  A background colour chosen at the second, third or fourth level does not count toward the accent's 5%.
- **Contrast:** body text at least 4.5:1 (aim for 7:1), or APCA Lc 60. Large text, icons, focus rings and input edges at least 3:1, or Lc 45. Any rule that paints a dark background swaps the text colour in the same rule. Grey text never sits on a coloured background.
- **Never:** a gradient with more than three stops; purple to blue, purple to pink, or cyan on dark anywhere; a glow shadow on a dark page, a coloured halo, or a spotlight; a colour defined with alpha (alpha is for overlays and shadows only); red and green as the only way a state is told apart.
- **Dark mode** is optional, and when built it is derived from the light theme, never inverted: [[web/frontend/dark-mode]].

## Surfaces and spacing

- **Pick a main direction of weight** for the layout: weighted left, weighted right, heavy at the top, or weighted at the bottom. Centring everything is a default, not a choice.
- **Spacing scale:** 2, 4, 8, 12, 16, 24, 40, 64, 96, 144px. Every space comes from the scale, with at most three optical nudges off it on the page. Use `gap` between siblings; use `margin` only to break out of the flow. Small boxes with text inside (buttons, tags, pills) take at least `max(8px, 0.5em)` padding at the sides and `max(4px, 0.3em)` top and bottom. How far apart sections, headings and grid items sit is in [[web/frontend/marketing-pages]].
- **Grids:** CSS Grid for the page, Flexbox inside components. Flex children that must shrink take `min-width: 0`; icons and images take `flex-shrink: 0`. No empty cell and no lone item on a last row: change the column count instead. Grids keep their column count above 1440px wide, and anything sized in `vw` carries a `max-width`.
- **Separators, in order:** to separate two things, use the first that works. 1. Space. 2. A 1px hairline in a rule colour. 3. A tinted area (a second or third background shade, no border). 4. A card (a border or a shadow, never both), kept for content that is independently clickable or of a different kind from what surrounds it. Never white cards on a tinted page, a card inside a card, or a bordered box inside a tinted area. Use different separators at different boundaries rather than the same one everywhere.
- **Stats side by side** are separated by a top or vertical hairline, with no leading padding on the first and no trailing padding on the last; reset the pattern wherever the column count changes.
- **Depth comes from weight and scale.** One shadow style at most, either `0 1px 2px oklch(20% 0.01 <hue> / 0.05)` or `0 0 0 1px oklch(30% 0.01 <hue> / 0.06)`. A raised surface is never darker than the page behind it.
- **Z levels, eight in all:** base 1, raised 10, dropdown 100, sticky 200, sticky nav 300, modal 400, toast 500, tooltip 600.
- **Radii:** one radius per nesting level, concentric (inner radius = outer radius − padding, at least 2px). Images take `min(1vw, <card radius>)`.
- **Clipping:** clip horizontal overflow with `overflow-x: clip`, which keeps `position: sticky` and `fixed` working where `overflow: hidden` breaks them; a section that overflows on purpose keeps `overflow: visible`. The full overflow rules are in [[web/frontend/responsive]].

## Motion

Decide the page's motion once in the plan: which one reveal, which hover signals, whether there is any loop.

- **How much a page moves:** at most three kinds of motion per page (for example one reveal, one hover change and one loop). Most pages have too much. Pick one of four levels with the visual direction: none at all; quick, at 0.7 to 0.75 times the durations below; lively, at 0.85 to 0.9 times; or slow and calm, at 1.0 to 1.3 times.

- **Tools:** CSS transitions and `@property` first. Use the Motion library for coordinated entrances in React, and GSAP only when a timeline is what the product shows.

- **Animate only `transform` and `opacity`.** `filter: blur`, `clip-path`, `mask` and `box-shadow` may join when they stay smooth on that element alone. Never `transition: all`; list the properties.
- **Easings:** ease-out for things arriving, ease-in for things leaving, ease-in-out for toggles. Never the browser's default `ease`; `linear` only for progress bars and scrubbing; no overshoot on UI state.

  ```css
  :root {
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  }
  ```

- **Durations:** 120ms for a press, a tick or a colour change; 220ms for hover, tooltips and menus; 420ms for a modal, a drawer, an accordion or a reveal. An exit takes 60 to 75% of its entrance. Stagger 30 to 50ms between rows and 60 to 100ms between blocks, 500ms in total at most, and only once.
- **The hero entrance:** one settle of 0.4 to 0.8s including its stagger, starting from a state where the content is already visible. A fade with an 8px rise counts as one motion. Never a fade, a sweep and a scale on one element; never a bounce; never a starfield, mouse parallax, or an auto-rotating carousel.
- **One reveal per page,** staggered per item, 0.4 to 0.8s in total, with the content visible when scripting is off. The recipe is in [[web/frontend/states-and-interactions]].
- **Scroll:** use IntersectionObserver for reveals and for states that change at a threshold; a passive, frame-throttled scroll listener only where scroll direction matters. Animation tied to scroll position is allowed only as one of the patterns in [[web/frontend/scroll-animation]].
- **Hover is one signal** that raises contrast: a colour step, or a 1px lift at 120ms on a control that keeps its colour. Focus rings never animate.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, every reveal shows its end state at once and every loop stops. Motion that must still run (a loader, a 150ms fade) opts out with a class:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *:not(.keep-motion), *:not(.keep-motion)::before, *:not(.keep-motion)::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

- **Never:** parallax; a custom cursor or a cursor follower; a marquee that does not pause on hover and focus; `will-change` on a whole class; a pulsing dot; a caret blinking for more than five blinks; an infinite loop other than a loader, except one small loop of 4s or less, or one slow background loop of 8s or more. Every loop stops when off-screen, and a loop that runs longer than 5 seconds has a visible pause control ([[web/frontend/states-and-interactions]]).

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
