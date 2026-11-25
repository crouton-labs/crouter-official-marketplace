---
kind: knowledge
when-and-why-to-read: When you are thinking of adding grain, a halftone dot pattern, offset colour copies of a word, scanlines or a torn paper edge to a page, this knowledge should be read because texture spread everywhere to make a flat page feel richer is a generated-design habit, and texture only works as one printed-looking effect, on a page whose look comes from print or old screens, kept faint and never animated.
short-form: "Texture: print texture only on print, retro-screen or editorial looks; one effect per page (grain, halftone, misregistration, scanlines or deckled edge); opacity 0.08 or less page-wide, 0.15 on one card, 0.05 or none under body text; never animated; overlays ignore the pointer and are hidden from assistive tech; contrast measured on the result. Plus an opt-in pool of signature effects (dither fields, ring orbit, metal sheen, blueprint rails, hover set, header morph, coverflow, scrubber, story stack, signal route, dot field/matrix/globe/wave/bars, LED glyph, bolts, comet beam, rotating phrase, dot nav) with rules, budgets, compositions and checks; and a catalogue of materials (ground, display class, accent, posture) as starting points for an undirected surface."
rationale: >-
  Adapted from Hallmark's texture reference (github.com/Nutlope/hallmark, MIT). Hallmark's table of which of its themes earn texture is replaced by a plain statement of which kinds of page do. Treating photographs (duotone, halftone as an image treatment) lives in [[web/frontend/imagery]]; contrast numbers in [[web/frontend/color]]; grain in dark mode is covered here and colour derivation in [[web/frontend/dark-mode]]. The signature effects and the materials catalogue are adapted from better-design's effects-library and materials references (github.com/Moddingflow/better-design, MIT), without its bundled CSS and JS, its dealing script and its contract fields; its scroll-linked effects live in [[web/frontend/scroll-animation]] and motion rules in [[web/frontend/motion]]. This document owns page-level print and screen effects, signature effects and materials.
---

# Texture

Texture is a deliberate effect with limits, never background mood. Grain spread over a page because it felt flat is a common sign of generated design; an empty-feeling page wants a bigger heading, a bigger picture or a fuller section instead.

## Which pages earn texture

A page earns texture only when its look comes from a physical print process or an old screen, and then it uses the one effect that process actually produced:

- **Risograph or screen print:** grain, or offset colour copies of one word (misregistration). Both come from the same print drum, so together they count as one effect.
- **Newspaper, comic or photocopied zine:** a halftone dot pattern.
- **Letterpress, handmade paper, collage:** a low-frequency paper fibre wash.
- **Film photography or a darkroom look:** film grain.
- **Tickets, stamps, coupons:** a deckled or perforated edge on that one element.
- **Arcade, terminal or CRT looks:** scanlines.

Never add texture to a modern minimal page, a software product page, or an app interface.

## Limits that apply to every effect

- **One effect per page.** Grain, halftone, misregistration, scanlines or a deckled edge; never two. A halftone that is a photograph's own treatment belongs to that image, not the page, and does not count.
- **Opacity, set once as a custom property:** 0.08 or less across the whole page, 0.15 or less inside one card or panel, and 0.05 or nothing under running body text. A low-frequency wash (an SVG `baseFrequency` of 0.02 or lower, which tints like paper fibre rather than speckling) may go to 0.12 page-wide.
- **Never animated.** No drifting grain, no pulsing dots. The one exception is misregistration settling once on load (below).
- **Every overlay has `pointer-events: none` and `aria-hidden="true"`.** Texture never intercepts clicks. A retro look is the effect itself, never a drawn monitor frame around the page.
- **Pure CSS or an inline data-URI SVG.** No image requests for texture.
- **Measure contrast on the textured result,** not on the flat colours; text must still meet the contrast numbers in [[web/frontend/color]].

## 1. Grain

```css
:root { --texture-opacity: 0.08; }
.grained { position: relative; isolation: isolate; }
.grained::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background-size: 200px 200px; opacity: var(--texture-opacity);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 -4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
}
```

The colour matrix turns the noise into distinct specks (alpha is the noise times nine, minus four), so the grain is visible at these low opacities; plain `feTurbulence` at 0.08 is a haze nobody sees. On a dark background the specks must be light: change the first three rows of the matrix to `0 0 0 0 1` so each speck is white, and keep the opacity. Apply it to one panel, one accent card, or the whole page at 0.08 or less.

## 2. Halftone

```css
:root { --halftone-size: 12px; --halftone-dot: 1.5px; }
.halftone { background-image: radial-gradient(var(--text-colour) var(--halftone-dot), transparent var(--halftone-dot));
  background-size: var(--halftone-size) var(--halftone-size); }
```

For panel fills and full-width bands. Never under or overlapping text. Dots in the text colour or one spot colour, never the accent across a whole area.

## 3. Misregistration

Two offset coloured copies behind one word, as when print plates do not line up:

```css
.misreg { position: relative; display: inline-block; isolation: isolate; }
.misreg::before, .misreg::after {
  content: attr(data-text); position: absolute; inset: 0; z-index: -1;
  white-space: nowrap; pointer-events: none;
}
.misreg::before { color: var(--accent);   transform: translate(-2px, -2px); }
.misreg::after  { color: var(--accent-2); transform: translate(2px, 2px); }
```

Use it on one word per page, in the hero; never on every heading. This is the one place a word in a heading may take a different colour treatment. The element is `inline-block` so the copies sit on the letters whatever the line height, and they sit behind the word so it keeps its own colour and only the fringes show the copies. The two copy colours are the page's two declared print colours. Offset 1–3px; more looks broken rather than printed. It may settle into place once on load over about 420ms, is static under reduced motion, and never loops.

## 4. Scanlines

```css
:root { --scanline: oklch(from var(--text-colour) l c h / 0.06); }
body::after { content: ""; position: fixed; inset: 0; z-index: 10;
  pointer-events: none;
  background: repeating-linear-gradient(transparent 0 2px, var(--scanline) 2px 3px); }
```

Only for arcade, terminal or CRT looks.

## 5. Deckled edge

A torn or perforated paper edge on one element:

```css
.deckled { box-shadow: inset 0 0 0 1px var(--border);
  mask-image: radial-gradient(6px at 0 50%, transparent 97%, black);
  mask-size: 12px 24px; mask-repeat: repeat-y; mask-position: left; }
```

One edge, on one kind of element per page (a ticket stub, a stamp's perforation). Never as a general card border.

## Reduced motion and accessibility

Nothing here moves except the one-time misregistration settle, so every effect looks the same under `prefers-reduced-motion: reduce`. Texture must never push text below its contrast threshold.

## Signature effects

An opt-in pool of signature effects for expressive surfaces. Nothing here is a default: a page built without any of these effects is complete. Reach for the pool when the art direction asks for a signature detail and the usual answers (a card that lifts, a button that grows) would make the surface read as a template.

These effects are hard to get right from a one-line prompt. Each card below gives the idea, when it fits, parameters, and the checks that keep it from turning into noise.

Origin: patterns observed in October 2026 on cloudflare.com (Astro, React Flow background, Three.js globe), linear.app (5×5 dot-matrix status icons) and apple.com product pages (timed dot navigation, scroll-linked scenes). Paper Shaders (`@paper-design/shaders-react`, Apache-2.0) renders a comparable live dither field in React; `cobe` (MIT) is a common ready-made dot globe for React projects. See the cards for when a library is worth it.

These effects are not print texture, so the page-type rule at the top of this document does not apply to them; their own rules below do. The print effects above (grain, halftone, misregistration, scanlines, deckled edge) keep their own limits; where an effect below names `fx:grain`, use the grain in section 1.

### Rules of use

1. **Opt-in, by direction.** Pick an effect only when it follows from the concept (print, instrument, signal, metal, blueprint, routing). "It looks cool" is not a reason. Record the chosen effects with the visual direction; a pattern recorded there is an intentional brand choice, so the matching tell in [[web/frontend/ai-tells]] no longer applies to it.
2. **Budget per page.** At most one live WebGL field. At most one `fx:ring-orbit` and one `fx:metal-sheen` per viewport, both on the primary call to action or heading. At most one ambient loop visible at a time. A baked motif (`fx:dither-bake`, `fx:grain`, `fx:blueprint-rails`, `fx:dot-field`, `fx:bolts`) may repeat across a set because repetition is what makes it a system. One `fx:dot-globe` per page. `fx:comet-beam` only on the one card that is active right now. Two to four pool effects per page is the useful range (a recurring motif counts once); more becomes a showroom.
3. **Surface type.** Landing, brand, launch, portfolio, pricing, CTA bands, game menus: any card may fit. Dense working tools (dashboards, editors, settings): only `fx:hover-set`, `fx:header-morph`, `fx:scroll-fade-edges`, `fx:led-glyph` for real states, and `fx:ruler-scrubber` / `fx:dot-bars` over real data. No fields, rings, sheen, or globes.
4. **Named function.** Every effect still serves a function from [[web/frontend/motion]] (Five functions of motion): feedback (hover-set, ring press), orientation (header-morph, coverflow, rails), value change (ruler-scrubber), causality (signal-route), or signs of life (field, sheen). An effect that serves none of them is decoration and gets removed.
5. **Text stays readable.** Body text never sits on a live field. Headings and buttons over a field get the scrim; verify contrast against the brightest frame, not the average one.
6. **Adopt, don't import.** Build only the chosen effect, name its values with the page's own tokens, and keep the reduced-motion and fallback parts. In React, Vue, or Svelte port the logic into the stack's idiom (refs, effects, actions).
7. **Honest data.** A ruler, counter, or route diagram shows real values or clearly marked fixtures. Never smooth, inflate, or clamp a figure to make the visual look better.
8. **Dots are material, not wallpaper.** The dot language works when the whole page speaks it quietly: one pitch on the spacing scale (8, 12, or 16 px), one warm- or cool-tinted dot color at 8–15% alpha, masks that fade dots where content sits, and dots that *carry* something somewhere on the page (a map, a traffic series, a status, a logo). A uniform white dot grid behind everything with nothing made of dots is a decorative grid background, a generated-design tell. Bright dots belong only to the one element that means something.

### Picking table

The scroll-linked effects in this table (`fx:scroll-fade-edges`, `fx:scroll-zoom`, `fx:theme-scrub`) are described in [[web/frontend/scroll-animation]].

| ID | What the viewer sees | Fits concepts | Function | Cost |
| --- | --- | --- | --- | --- |
| `fx:dither-field` | Slow liquid metal printed through a Bayer halftone, live | Print, signal, telemetry, night, metal | Signs of life | WebGL, one canvas |
| `fx:dither-bake` | Static halftone glow at the bottom of each card, one hue, three tones | Same family, catalogs and card sets | Identity per item | Zero runtime |
| `fx:grain` | Film grain over flat dark surfaces | Analog, photo, print | Material | One tile, no loop |
| `fx:ring-orbit` | A light travelling around a hairline border | Instrument, energy, primary action | Emphasis of one action | One CSS loop |
| `fx:metal-sheen` | Brushed-silver text on 1–3 words, a sheen hairline above | Metal, premium hardware | Emphasis | One CSS loop |
| `fx:blueprint-rails` | Hairline seams between sections with rivets on the content edges | Blueprint, engineering, infrastructure | Orientation | Static |
| `fx:hover-set` | Edge brightens, arrow nudges, underline draws, halo ring | Any | Feedback | Transitions |
| `fx:header-morph` | Full-width bar becomes a floating capsule after scroll | Any landing | Orientation | Transitions |
| `fx:coverflow` | Centered card full size, neighbours scale to 0.78 and fade | Catalogs, models, products | Orientation | rAF on scroll |
| `fx:ruler-scrubber` | Barcode of thin day ticks with a draggable thumb and labels that follow it | Uptime, history, audio, logs | Value change | DOM ticks |
| `fx:story-stack` | Deck of cards; drag the front one down, segmented progress | Personas, testimonials, steps | Orientation | Transitions |
| `fx:signal-route` | A packet travels a wire; its branch lights up in turn | Routing, pipelines, integrations | Causality | CSS offset-path |
| `fx:dot-field` | A faint dot grid on the page, fading under content; optional pointer spotlight | Network, infrastructure, maps, blueprint | Material, orientation | CSS, tiny JS |
| `fx:dot-matrix` | A logo, word, map or image rebuilt from dots, revealed from one side | LED signs, print, data, maps | Identity, causality | Canvas 2D, once |
| `fx:dot-globe` | Rotating dotted globe, fog toward the limb, arcs and HTML markers | Global network, travel, logistics | Orientation, causality | Canvas 2D loop |
| `fx:dot-wave` | A band of dots with a pulse travelling along it | Signal, throughput, sync | Signs of life | CSS only |
| `fx:dot-bars` | A series drawn as columns of dots, optionally scrolling | Traffic, audio, load, activity | Value change | SVG, CSS loop |
| `fx:led-glyph` | 16 px 5×5 LED icon playing frames (working, indexing, done) | Agents, jobs, devices | Feedback, status | CSS steps() |
| `fx:bolts` | Bordered blocks with 14 px squares bolted on the corners; dashed seams; corner brackets | Engineering, hardware, data | Structure | Static |
| `fx:comet-beam` | A bright arc with a fading tail runs the border of the active card | Streaming, live, selected | Status | One CSS loop |
| `fx:scroll-fade-edges` | A horizontal list fades only on the side that has more | Any overflow row | Orientation | CSS scroll timeline |
| `fx:rotating-phrase` | An inline accent chip inside a sentence cycles its phrasings | Product lines, audiences | Orientation | Small JS |
| `fx:dotnav-progress` | Glass pill of dots; the current dot stretches and fills; pause button | Media galleries, highlights | Orientation | Small JS |
| `fx:scroll-zoom` | Hero media settles from full bleed into a rounded frame as it scrolls in | Product launch, hardware | Orientation | CSS view timeline |
| `fx:theme-scrub` | A section's background turns from dark to light as it enters | Chapter breaks in a long story | Orientation | CSS view timeline |

### Effect cards

#### fx:dither-field — live ordered-dither field

A procedural pattern quantized onto a coarse pixel grid through a 4×4 Bayer matrix: one ink color over transparency, so it reads as a halftone print of moving liquid metal.

- **Use for:** one CTA band, a hero side panel, or a single feature tile. One per page.
- **Not for:** behind paragraphs, in dense tools, on every card (use `fx:dither-bake`).
- **Look:** field opacity 0.4–0.55 with `mix-blend-mode: screen` (light theme: `multiply` and a dark ink), a radial scrim (0.9 black in the center to 0.1 at the edge) so the heading and buttons sit in calm space while the field lives at the edges.
- **Build in:** mounts after idle; renders only on screen and in a visible tab; ~30 fps cap; DPR capped at 2; context-loss handling; reduced motion draws one still frame; without WebGL the CSS fallback stays and nothing breaks.
- **React alternative:** `<Dithering shape="warp" type="4x4" size={2} scale={0.6} speed={0.18} colorBack="#00000000" colorFront="#ffffff" />` from `@paper-design/shaders-react` (pin an exact version). Use it when the project already ships Paper Shaders or wants their other shapes. Wrap it the same way: lazy import, mount after idle, pause offscreen, `speed={0}` under reduced motion, CSS fallback that crossfades out when the canvas has size.
- **Tune:** render the raw pattern in grayscale while tuning. Shapes should be large and calm; uniform speckle means the scale is too small or the pattern too noisy.

#### fx:dither-bake — baked halftone glow

The same print language without a GPU: a light shape (ribbon, rise, camo) rasterized once into an SVG grid of square cells. Cell size follows intensity; the faint edge is thinned through an 8×8 Bayer matrix so it dissolves into scattered dots. Three tone layers of one hue give depth.

- **Use for:** card sets (models, posts, plans) where each item needs its own art but the set must read as one system. Seed per item so the art is stable between renders.
- **Tones:** derive from the item's brand or category color: hi is a pale tint, body the color, low a deep shade. Never a rainbow across one card.
- **SSR:** it is a pure function; run it at build or on the server and inline the SVG.
- **Pairs with:** `fx:grain` (opacity 0.45, overlay) and the brightening edge from `fx:hover-set` on the card.

#### fx:ring-orbit — light around a hairline

A 1.25 px ring drawn with a conic gradient whose angle is a registered `@property`, masked to the border (`mask-composite: exclude`). The light travels around the primary button every 6 s; a variant slides a linear gradient instead.

- **Use for:** the one primary action of a viewport. Hover adds a 4 px halo ring in the accent at 16% instead of lifting; press moves the button 0.5 px down.
- **Not for:** secondary buttons, cards, inputs, or several elements at once.
- **Accessibility:** the ring is decoration; the button keeps its own visible focus style and 3:1 boundary contrast without the animation. Reduced motion stops the loop and keeps a static ring.

#### fx:metal-sheen — brushed-silver words

Silver gradient clipped to text (`background-clip: text`), 200% wide, sliding over 7 s; a 1 px sheen hairline above the heading moves the same way.

- **Allowed scope:** one to three words of at most one heading per page, when the concept is metal, hardware, or instrument and the visual direction records it. Outside that scope it is gradient text, a generated-design tell.
- **Contrast:** check the darkest stop against the background; it must meet the text's contrast requirement on its own. Give it a solid-color fallback for browsers without text clipping and for forced colors.

#### fx:blueprint-rails — section seams

Each section gets a hairline across the page at its top and bottom edge, with small square rivets exactly on the content column edges. The page reads as an engineered drawing without a background grid.

- **Rules:** rails sit on real section boundaries and real keylines of the layout. A rail that does not align with the content column is a decorative grid background. Leave the closing rail off a section that flows into the next.

#### fx:hover-set — feedback that is not lift-and-scale

Pick one response per component type and use it everywhere for that type:

| Response | Component | Values |
| --- | --- | --- |
| Edge brightens over 700 ms | Cards, tiles, list rows | Inset hairline 0.08 → 0.2 white |
| Arrow nudges 4 px toward the destination | Links and buttons that navigate | The icon moves, the label stays |
| Underline draws from the reading start | Inline and footer links | Underline scales in |
| Halo ring, no movement | Primary button | `box-shadow: 0 0 0 4px` accent 16% |
| Art intensifies | Cards with `fx:dither-bake` | SVG opacity 0.85 → 1 over 700 ms |
| Siblings dim | Dense lists, nav | The others go to 0.6 while one is hovered |

All hover styles sit inside `@media (hover: hover) and (pointer: fine)` and have a `:focus-visible` twin. Press feedback is separate ([[web/frontend/motion]], Catalog). Menus that open on hover get a 100–150 ms close delay so a diagonal pointer path does not close them.

#### fx:header-morph — bar to capsule

At the top of the page the header is a transparent full-width bar (64 px). After the first few pixels of scroll it becomes a floating capsule: narrower (about 900 px), 58 px tall, 12 px radius, hairline border, blurred translucent fill, and a long soft shadow. All properties ease over 500 ms with `cubic-bezier(0.16, 1, 0.3, 1)`. On phones keep the capsule opaque (0.94) for legibility; reduced motion switches instantly.

#### fx:coverflow — distance-driven carousel

Slides scale and fade by their distance from the center of a native scroll-snap scroller: `scale = 0.78 + 0.22·s`, `opacity = 0.45 + 0.55·s`, where `s` falls from 1 at the center. Scrolling, swipe, wheel, and keyboard stay native. Add visible previous/next buttons. Autoplay is optional, stops forever on the first interaction, and never runs under reduced motion.

#### fx:ruler-scrubber — barcode timeline

A row of 2 px ticks, one per day (or sample); week starts are taller, incidents take their status color with a soft glow. A thumb marks the selected day; a status line above and a caption with the date below follow the thumb and stay inside the component. Drag with pointer capture, click a tick, or use the keyboard. It is a `role="slider"` with `aria-valuetext`; arrows move one step, PageUp/PageDown one week, Home/End the ends. Tone colors are paired with the status word, never color alone.

#### fx:story-stack — swipe deck

Cards stacked bottom-aligned, each deeper card 26 px higher and 5% smaller. The front card follows a downward drag (upward drag resists at 0.2) and is sent to the back when released beyond 80 px or faster than 0.3 px/ms; it fades while it passes behind the deck. Cards behind are clickable; segmented progress advances every 7 s and pauses on hover, focus, and drag. A Next button is required (drag is never the only way), and so is the Pause control whenever autoplay runs (WCAG 2.2.2). Back cards are `inert`. Reduced motion disables autoplay and the travel.

#### fx:signal-route — packet on a wire

An SVG of orthogonal wires from a source to several destinations. Each wire is drawn twice: a dim base and a bright branch. A 7 px square packet travels the wire with CSS `offset-path`, and its branch stays lit while it travels, then dims to 0.42. Branches take turns: cycle 12 s, delay 0 / 4 / 8 s. The diagram needs `role="img"` and a label that states the relationship in words. Reduced motion shows all branches lit and no packet.

#### fx:dot-field — the page as a dot grid

A faint grid of round dots behind the page (Cloudflare: 12 px pitch, 0.75 px radius, `#f0e3de` at 12% over warm near-black `#191817`). Sections and cards are opaque and sit on top, so the dots show in gutters, around the hero, and through transparent bands.

- **Rules:** the pitch is a spacing token, and the grid's center column aligns with the page center. Dot alpha 8–15%; never pure white. The spotlight is for one hero or CTA band, not every section. Cards on top use an opaque surface, not glass, so text never sits on dots.
- **Light theme:** dark dots at 10–14% on an off-white tinted toward the brand.

#### fx:dot-matrix — anything rebuilt from dots

A sampler that draws any source as a dot grid: an image or SVG (logo, map, product silhouette), text, or a function `(u, v) → 0..1`. A size mode gives a halftone (radius follows the value); a threshold mode gives an LED sign (all dots equal, on or off) with the unlit grid shown dim. Optional one-time reveal from one side. The source is drawn at full size and averaged per cell, so fonts and images keep their proportions. The real text or image must exist in the DOM for assistive technology; the canvas is `aria-hidden`.

#### fx:dot-globe — dotted Earth with routes

Dots on a Fibonacci sphere, kept only on land; front dots fade toward the limb, back dots are hidden or at 8%. Great-circle arcs lift off the surface between points; markers are your own HTML elements (icons, labels) positioned each frame and hidden on the far side. Slow auto-rotation (about 5°/s), drag to spin, pauses offscreen, still under reduced motion.

- **Library option:** in React, `cobe` (MIT) gives a WebGL dot globe with markers; check its current API in the docs before use. Cloudflare uses Three.js points with fog; that is worth it only when the scene needs real 3D (lighting, many arcs, zoom).
- **Rules:** one per page, as the illustration of a real network or reach. Callouts next to it use corner brackets (from `fx:bolts`) and real measured numbers. Pair with `fx:dot-field` in the same color family so the globe looks made of the page's material.

#### fx:dot-wave — a pulse along a band

A row (or a few rows) of dots, each brightening from 0.28 to 0.9 opacity and nudging under a pixel as a pulse passes; the delay follows the dot's position, so the wave travels. Pure CSS after creation. Use it as a connector between two things that sync (repo → deploy, device → cloud), not as a divider between sections.

#### fx:dot-bars — data as dot columns

Each value becomes a column of square dots (mirrored around a center line for a waveform, or rising from a baseline for a histogram). When it scrolls, the strip is duplicated and loops seamlessly with edge masks (Cloudflare: a 20 s traffic waveform inside an orange panel). Values are real data or a series labelled as illustrative; the scrolling variant is ambient and needs the same pause rules as any loop longer than 5 s when it sits next to content.

#### fx:led-glyph — 5×5 dot-matrix status

A 16 px icon made of 25 dots (r = 1, pitch 3.5) that plays frames with `steps(1)` timing: `pong` (agent working), `scan` (indexing), `pulse` (syncing), `spinner` (loading), `check` (done, draws then holds). It always sits next to a visible status word, or carries its own label when it stands alone. Reduced motion shows the last frame. Use it for real asynchronous states, never as a decorative loader on static content.

#### fx:bolts — bolted plates, dashed seams, brackets

Three structural marks from the Cloudflare grid:
- **Bolts:** 14 px squares (3 px radius, hairline border, page-colored fill) centered on the four corners of a bordered block, so the border appears to stop at each bolt. Use on grids of plates (feature tables, comparison blocks), not on every card.
- **Dashed seams:** a 6/6 px dashed hairline runs past the container to the viewport edges (clip the page with `overflow-x: clip`).
- **Brackets:** four L-shaped corner marks in `currentColor` around a stat or callout; a variant adds an inset dashed frame. Use `background-color` (not the `background` shorthand) on the same element, or the marks disappear.

#### fx:comet-beam — the active card

A conic-gradient comet with a fading tail travels the card border every 4.5 s, fading in over 600 ms when the card becomes active and out over 500 ms when it stops (Cloudflare: the customer browser being "served"). It replaces `fx:ring-orbit` when the light means *this one is live now*, so it must switch off when the state ends. Reduced motion shows a static arc.

#### fx:rotating-phrase — one sentence, several audiences

A sentence with an inline accent chip that cycles phrasings ("Everything needed to *build secure applications* → *connect and protect your employees*"). The chip width eases to each phrase (450 ms), the old text leaves upward and the new one enters from below (260 ms, `cubic-bezier(0.32, 0.72, 0, 1)`). Screen readers get all phrasings once; rotation pauses on hover/focus and offscreen and is off under reduced motion. One per page, in a subheading, never in a CTA.

#### fx:dotnav-progress — Apple's timed dots

A glass pill (56 px tall, `rgb(66 66 69 / 0.7)`, blur 20 px) of 8 px dots; the current dot stretches to 48 px and fills linearly over the slide duration, then the next slide starts. A separate 56 px glass circle toggles play/pause, and pause freezes the fill in place. It is a tablist: arrows move, click selects, each dot has a label. Autoplay is off under reduced motion and does not advance offscreen. The pill floats over the bottom of the media.

### Compositions that work

#### The print stack

Near-black canvas with tinted panels (`#0a0a0a`, `#0b0b0e`), white ink, silver grays, two accents (blue and copper) used only on the primary action ring. One live `fx:dither-field` in the closing CTA band; `fx:dither-bake` with `fx:grain` and the brightening edge on every catalog and blog card, colored by product line; `fx:blueprint-rails` on section seams; `fx:metal-sheen` on the last two words of two headings; `fx:header-morph`; `fx:coverflow` for the product catalog; `fx:ruler-scrubber` for uptime; `fx:story-stack` for audiences. What holds it together: one monochrome print language (dither, grain, hairlines), one easing family (expo-out, 500–900 ms for surfaces, 150 ms for ticks), and color held back for meaning.

#### The Cloudflare stack

Warm near-black (`#191817`) with warm off-white ink, one hot accent (orange `#f38020`) and its glow color. A page-wide `fx:dot-field` at 12 px; a hero panel in the solid accent; the `fx:dot-globe` in accent dots with HTML markers and bracketed callouts; grids of `fx:bolts` plates with dashed seams; `fx:dot-bars` and `fx:dot-wave` where data or sync is the story; `fx:comet-beam` on the one live card; `fx:rotating-phrase` in a subheading; `fx:scroll-fade-edges` on product rows. The orange is rationed: big in the hero, then only on things that carry meaning (dots of land, routes, the live card).

#### The Linear stack

Quiet dark UI where motion is information: `fx:led-glyph` beside agent and job states, dot clusters as the illustration of grouped work, hairline panels. No ambient fields.

#### The Apple stack

Product photography does the expressing; the effects only stage it: `fx:scroll-zoom` on the hero product, `fx:theme-scrub` at chapter breaks, media galleries with `fx:dotnav-progress`, generous type, and a single gradient on the product name when the product color itself is the subject (recorded with the visual direction, otherwise gradient text is a tell).

### Verify an adopted effect

- Watch it in motion at normal and 25% speed; idle for 10 s and list everything that moves.
- Reduced motion: loops stop, travel disappears, states and feedback stay.
- Throttle the CPU 4–6×; the page scrolls without long frames. A live field pauses offscreen (check that rAF stops) and in a hidden tab.
- Disable WebGL (or force the fallback): the layout and text are intact.
- Contrast over the brightest frame of any effect behind text.
- Keyboard: every interactive effect works without a pointer; focus is visible.
- Phone width: no horizontal overflow, labels stay inside, touch drag does not block vertical page scroll (`touch-action: pan-y`).
- Scroll-linked effects: step through the scroll range and check every intermediate frame for contrast and overflow, not just the start and the end.
- Dot effects: check at 1× and 2× DPR (dots must stay round and on the pitch) and at 200% zoom; the meaning they carry also exists as text.

## Materials: starting points for an undirected surface

Pick three rows from the table below that fit the brief, and choose one. A material says what a surface is made of (ground, ink, type voice, surface, signal). It never says what the page contains, in what order, or how it is laid out: two briefs in one material must still produce two different pages.

A chosen material is a **starting point that the concept transforms**, not a theme to paste:

- Keep its axes (ground band, display class, accent band, posture) unless the concept argues for changing one; then change exactly one and say why in the visual direction.
- Choose the actual hues, faces, and textures from the product's world. The `faces` column is a sample of the class, not a prescription: shortlist three faces of the class, at most one from this column, and never a display face or a ground/signal hue family you used recently. Check Cyrillic coverage when the product needs it ([[web/frontend/visual-craft]]).
- Never copy another material's signal into it, and never add decoration the row does not name.

The idea of dealing materials instead of letting the model choose its habit comes from Hallmark (MIT, github.com/Nutlope/hallmark); these rows, names, and axes are better-design's.

### Axes

- **ground**: `light` (L above ~85%), `mid` (30–85%, a coloured or grey ground), `dark` (under 30%).
- **display**: `roman-serif`, `high-contrast-serif`, `slab-serif`, `grotesk-sans`, `grotesk-heavy`, `geometric-sans`, `rounded-sans`, `condensed`, `mono`, `pixel`, `hand`.
- **accent**: `warm` (hue 10–60°), `cool` (200–300°), `green` (100–180°), `neutral` (no chromatic signal), `multi` (two or more inks).
- **posture** (how much of the surface the colour takes): `restrained` (accent under ~5% of a screen), `committed` (one colour carries 30–60% of the surface), `full` (several colours share the surface), `drenched` (the ground itself is the colour).
- **family**: never offer two rows of one family as the three choices.

### Catalogue

| slug | family | ground | display | accent | posture | material | faces (a sample of the class) | keywords |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `departure-board` | signage | dark | condensed | warm | committed | matte black ground, signal-yellow rows, condensed caps-free numerals, times set first | Tektur, Antonio, Big Shoulders Display | transport, travel, schedule, logistics, delivery, timetable, booking, event, festival, tickets, status |
| `enamel-sign` | signage | light | geometric-sans | cool | committed | white enamel plates with deep cobalt fields, rounded plate corners, bold geometric letters | Jost, Lexend, Josefin Sans | city, street, local, shop, cafe, bakery, community, municipal, club, sport |
| `cyanotype` | print | mid | grotesk-sans | neutral | drenched | Prussian-blue ground, white line work and type, sun-print softness on photographs | IBM Plex Sans, Commissioner, Public Sans | architecture, engineering, plan, studio, science, botany, research, api, infrastructure |
| `riso-zine` | print | light | grotesk-heavy | multi | full | off-white stock, two misregistered inks (fluorescent pink and medium blue), heavy grotesk, halftone photos | Rubik, Archivo Black, Bricolage Grotesque | zine, music, festival, community, art, youth, newsletter, school, club, event |
| `tabloid` | print | light | grotesk-heavy | warm | restrained | grey newsprint, black ink, one tomato red, massive tight headlines, column rules | Oswald, Anton, Roboto Condensed | news, newsletter, media, magazine, politics, opinion, weekly, launch, announcement |
| `swiss-poster` | print | light | grotesk-heavy | warm | committed | white ground, flush-left heavy grotesk at poster scale, one vermilion field, strict columns | Onest, Inter Tight, Archivo | design, agency, conference, architecture, exhibition, portfolio, studio, event |
| `azulejo` | craft | light | roman-serif | cool | committed | white glaze, cobalt pattern panels, roman serif, square tile rhythm | Alegreya, PT Serif, Lora | restaurant, cafe, travel, hotel, ceramics, pottery, tiles, mediterranean, food, bakery |
| `celadon` | craft | mid | roman-serif | green | drenched | pale celadon ground, ink-grey type, glaze-pooled darker green, quiet serif | Cormorant, Spectral, Cardo | ceramics, pottery, tea, craft, wellness, spa, school, workshop, slow |
| `kiln-oxide` | craft | dark | slab-serif | warm | committed | fired-clay brown-black ground, iron-oxide orange, slab serif, fingerprint-close photos | Bitter, Kelly Slab, Arvo | ceramics, kiln, bakery, bread, coffee, roastery, workshop, maker, forge |
| `field-guide` | nature | light | slab-serif | green | restrained | grey-green paper, plate numbers, slab captions, specimen photographs on white | Roboto Slab, Zilla Slab, Hepta Slab | nature, farm, garden, outdoor, hiking, plants, ecology, school, kids, education |
| `herbarium` | nature | light | high-contrast-serif | green | restrained | pressed-plant white, ink black, high-contrast serif, one moss green | Prata, Yeseva One, Gloock | botanical, florist, garden, cosmetics, perfume, apothecary, tea, herbal |
| `glacier` | nature | light | grotesk-sans | cool | restrained | ice white with blue-grey neutrals, airy grotesk, cold daylight photos | Manrope, Albert Sans, Rethink Sans | health, clinic, medical, water, climate, calm, therapy, sleep, finance |
| `sodium-lamp` | night | dark | condensed | warm | committed | warm brown-black night, sodium orange light, condensed type, grain on photos | Fira Sans Extra Condensed, Barlow Condensed, Big Shoulders Text | bar, jazz, night, music, club, street food, festival, film, cinema |
| `velvet-programme` | night | dark | high-contrast-serif | warm | committed | deep wine ground, brass-gold signal used sparingly, high-contrast serif, programme columns | Old Standard TT, Bodoni Moda, Playfair Display | theatre, opera, jazz, concert, wine, restaurant, luxury, hotel, gala |
| `instrument-panel` | digital | dark | mono | green | restrained | graphite ground, phosphor green readouts, mono for figures only, ruled instrument cells | JetBrains Mono, Martian Mono, Azeret Mono | developer, api, monitoring, devops, infrastructure, cli, terminal, data, dashboard |
| `receipt` | digital | light | mono | neutral | restrained | thermal-paper white, black mono, dashed perforations as real separators, totals right-aligned | IBM Plex Mono, Courier Prime, Fira Code | finance, budget, expenses, shop, pos, accounting, receipts, invoices, couples |
| `arcade` | play | dark | pixel | multi | full | CRT-black ground, pixel display face, three saturated inks, score-style numerals | Press Start 2P, Pixelify Sans, Silkscreen | game, gaming, retro, arcade, kids, esports, challenge, quiz, hackathon |
| `paper-cut` | play | light | rounded-sans | multi | full | bright cut-paper layers with real offset shadows, rounded heavy sans, primary inks | Comfortaa, Baloo 2, Nunito | kids, family, school, toys, playground, learning, birthday, party |
| `sports-kit` | play | mid | condensed | multi | drenched | team-colour ground, contrast stripe, condensed numerals as big as faces | Teko, Russo One, Sofia Sans Extra Condensed | sport, club, running, fitness, team, league, race, tournament, gym |
| `bauhaus` | form | light | geometric-sans | multi | full | white ground, red/yellow/blue primaries as solid geometric fields, geometric sans | Geologica, League Spartan, Funnel Display | education, school, design, museum, architecture, art, kids, workshop |
| `concrete` | form | mid | grotesk-heavy | warm | restrained | raw concrete grey, black heavy grotesk, safety-orange signal, exposed structure | Unbounded, Krona One, Syncopate | construction, architecture, industrial, coworking, gym, brutalist, developer, tool |
| `terrazzo` | form | light | rounded-sans | multi | full | speckled pale ground, three chip colours, soft rounded sans, generous radius | Varela Round, Nunito Sans, Mulish | home, interior, cafe, family, app, wellness, couples, lifestyle, pets |
| `ink-wash` | quiet | light | roman-serif | neutral | restrained | white paper, black ink at three densities, brush-soft photos, lots of measured space | EB Garamond, Literata, Shippori Mincho | tea, poetry, writing, books, meditation, japanese, gallery, publishing |
| `linen-press` | quiet | light | grotesk-sans | warm | restrained | unbleached linen grey (not cream), charcoal ink, one rust signal, tight grotesk | Golos Text, Hanken Grotesk, Figtree | fashion, textile, clothing, studio, interior, furniture, craft, shop |
| `cartography` | structure | light | condensed | cool | restrained | map paper white, contour-grey linework, one water blue, condensed labels in sentence case | PT Sans Narrow, Fira Sans Condensed, Encode Sans Condensed | maps, travel, delivery, logistics, city, outdoor, hiking, real estate, location |
| `ledger-grid` | structure | light | grotesk-sans | green | restrained | white page, ruled ledger lines that hold real figures, tabular numerals, bank-note green | Source Sans 3, Karla, Chivo | finance, budget, accounting, bank, couples, expenses, saas, b2b, analytics |
| `vinyl-sleeve` | music | mid | grotesk-heavy | multi | drenched | one saturated sleeve colour as ground, heavy type set like a record cover, square crops | Dela Gothic One, Climate Crisis, Bowlby One | music, album, label, festival, podcast, radio, dj, concert |
| `darkroom` | photo | dark | grotesk-sans | warm | restrained | safelight-red accent on deep grey, photographs as the light source, small captions | Sora, Schibsted Grotesk, Epilogue | photography, film, studio, gallery, portfolio, cinema, art |
| `house` | quiet | dark | grotesk-sans | cool | restrained | the house style: black canvas, near-white type, two greys, one blue for links and focus | per house-style preset | premium, minimal, apple, hardware, device, product launch, keynote |

### Apps and dense tools

For a working surface (dashboard, admin, editor, settings) keep `restrained` or `committed` postures and reads the material as **ground, type voice, and signal** only: grids, density, and component sizes come from the task, not the material. A material whose display class is `pixel` or `hand` is never used for an app.
