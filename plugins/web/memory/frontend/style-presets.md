---
kind: knowledge
when-and-why-to-read: When the user names a look (editorial, terminal, neo-brutalist, Swiss, luxury, "minimal", "premium", "like Apple"), or you need a named starting look to combine and diverge from, this knowledge should be read because each look has one defining trait that must be executed precisely, a preset used by reflex for every unstyled request makes unrelated products converge on one page, and a bespoke theme needs every adjective to land on a token.
short-form: "Named looks with their defining trait (editorial, terminal, neo-brutalism, brutalism, Swiss, retro, luxury, organic, industrial, maximalist), how to choose, how to originate a bespoke theme from them (with a worked example), and one full preset — the premium ultra-minimal house style (dark, monochrome, Geologica, pill buttons) — with its palette, type scale, spacing, radii, components, motion, copy rules, and how to keep it from becoming a template. Used on request only."
rationale: >-
  Adapted from two MIT sources, wording kept: frontend-design-deslop by samber (github.com/samber/cc-skills, MIT) references/aesthetics-library.md; better-design (github.com/Moddingflow/better-design, MIT) references/house-style.md and assets/DESIGN.house-style.md. Left out: the house style's reference HTML file, its scaffold mapping table, its validator and motion-probe commands, its effects-pool IDs, and the token-file and contrast-script checks. This document owns named looks and presets. Neighbours: when to pick one at all and how to avoid the default ([[web/frontend/anti-default-direction]]), the art-direction process ([[web/frontend/art-direction]]), texture effects that several of these looks use ([[web/frontend/texture]]), numeric craft ranges ([[web/frontend/visual-craft]]), dark-mode derivation ([[web/frontend/dark-mode]]).
---

# Style presets

Pick ONE and execute its defining trait precisely. Each is anti-default by construction: none can be reached by sampling the SaaS-page median. Match implementation complexity to the aesthetic.

Use a look when the user names it, or as one of the dealt materials in [[web/frontend/anti-default-direction]]. Never as the fallback for an unstyled request. Several of these looks (neo-brutalism, retro, terminal) are also the ones whose texture rules live in [[web/frontend/texture]].

## Named looks

### Editorial / magazine

High-contrast serif display (Fraunces, Playfair Display, Boska, Bodoni Moda) paired with a clean body. Real columns, drop caps, pull quotes, rules and dividers instead of cards, generous measure (65-75ch). Reference: broadsheet newspapers, The Verge. Defining trait: typographic contrast and editorial scaffolding (rules, columns) replacing the card grid entirely.

### Terminal / monospace

Monospace family for everything (JetBrains Mono, IBM Plex Mono, Fira Code). Dark base, ANSI-derived accents (Nord, Solarized, Gogh schemes). Grid-of-text layout, blinking-cursor or CRT touches. Reference: developer tooling, TUIs. Defining trait: monospace UI (not just code blocks) with ANSI palette discipline.

### Neo-brutalism

The single most recognizable trait: hard offset drop shadow, solid, no blur, often colored. Plus thick black borders (2-3px), flat saturated color fills, sharp edges (zero radius), bold sans headlines at huge size.

Buttons: thick border + flat fill + hard offset shadow. Reference: Gumroad, Figma brand refresh. Defining trait: `box-shadow: 6px 6px 0 #000` with no blur, thick borders, zero radius.

### Brutalism / raw

Raw unstyled-HTML feel, monochrome or one harsh accent, oversized sans or system/monospace type, exposed structure, visible grid, near-zero decoration, hard edges. High contrast (black on concrete-gray + one loud accent like acid green or red).

Reference: brutalistwebsites.com, Drudge Report. Defining trait: deliberate absence of polish; structure exposed rather than hidden.

### Swiss / international typographic

Strict grid, sans-serif (Helvetica-class), restrained palette, generous negative space, typography as structure, left-aligned, asymmetric balance, no decoration. Reference: Josef Mueller-Brockmann. Defining trait: rigorous grid and one accent used with extreme restraint.

### Retro / skeuomorphic

Y2K chrome, brushed-metal panels, beveled buttons, period-correct type. Used deliberately and consistently, never as a fallback. Reference: early-2000s OS UIs, vaporwave. Defining trait: tactile depth and period commitment.

### Luxury / refined

Restrained palette (near-black, off-white, one metallic or jewel accent), large type, vast whitespace, slow deliberate motion, high-quality imagery treatment. Reference: fashion houses, premium hardware. Defining trait: restraint and space signaling premium.

### Organic / natural

Warm earthy palette, soft irregular shapes, hand-drawn or textured elements, humanist type. Reference: wellness and food brands. Defining trait: irregularity and warmth, the opposite of geometric precision.

### Industrial / utilitarian

Dense information, functional grid, monospace numerics, muted palette with one safety-orange or hazard-yellow accent, minimal ornamentation. Reference: aviation/control panels, data tools. Defining trait: density and function-first layout.

### Maximalist

Layered color, overlapping elements, multiple typefaces in tension, dense visual rhythm, intentional chaos. Reference: zine culture, experimental portfolios. Defining trait: controlled excess; every surface does something.

### Choosing

Match the aesthetic to the domain and audience, but bias toward commitment. A developer tool reads well as terminal or industrial; an essay site as editorial; a playful consumer app as neo-brutalist; a premium product as luxury or swiss. When unsure, state the chosen direction and why in one line, then proceed.

## Creating a brand-new theme from these

The catalog above is a set of starting points, not a closed list. The strongest, least generic results come from originating a bespoke aesthetic from the discovery context (the adjectives, visual word translations, archetype, references, and artifact type), rather than picking a label off the shelf. Use the catalog as raw material to combine and diverge from.

Method:

1. Read the inputs. Take the 3 to 5 adjectives, their visual word translations, the 3-word essence, the archetype, and the admired/avoid references from discovery (see [[web/frontend/design-website]]).
2. Find the closest one or two catalog styles, then deliberately diverge. A bespoke theme is usually a base style plus a twist that comes straight from an adjective. "Editorial but warm" pulls Editorial toward humanist serifs and a soft accent; "Swiss but playful" keeps the grid and adds one bright accent and rounder shapes; "Terminal but premium" keeps monospace and dark base but swaps ANSI accents for a single jewel tone and adds generous spacing.
3. Translate each adjective into a concrete token decision. Each visual word translation should land on at least one of: type class, scale ratio, accent hue, spacing density, radius, shadow approach, motion. If an adjective changes nothing in the tokens, it is decoration, not direction; cut it or sharpen it.
4. Name the theme. A one or two word name (for example "Ledger", "Atelier", "Console", "Almanac") forces coherence and gives the project a vocabulary. The name is not cosmetic; it is the test of whether the direction is singular.
5. Define the defining trait (the structural rule that organizes everything, like Editorial's rules-instead-of-cards or Swiss's strict grid) and the signature move (the single most memorable detail). These two must be unique to this project and must not collide with the tells in [[web/frontend/ai-tells]].
6. Derive the full token set from the above (type, color in OKLCH, spacing, radius, one shadow approach), then write it all to the project's design document.

Worked example. Discovery yields: artifact = developer tool landing page; adjectives = precise, calm, expert, quietly confident; essence = "quiet, technical, exact"; archetype = Sage; admires Linear and a Swiss rail timetable; avoid loud startup gradients.

- Closest catalog styles: Swiss and Terminal. Diverge by softening Terminal's neon and adopting Swiss restraint.
- Token decisions: "precise" -> strict 12-column grid, monospace numerals, hairline rules, radius 2px. "calm" -> low chroma, generous line height. "expert" -> dense but ordered information, IBM Plex Sans + IBM Plex Mono. "quietly confident" -> one deep teal accent used only on focus and primary action, near-black ink on warm off-white.
- Name: "Console". Defining trait: text-and-rule structure on a strict grid, no cards. Signature move: a single hairline accent rule that marks the active section, echoing a timetable.
- Result: a coherent, original theme that no median sampling would produce, fully specified and ready to write to the design document.

Reuse vs originate: if the user already has a design document or brand assets, do not invent a theme. Read it, honor its tokens, and extend it. Originate only for greenfield work.

## Preset: premium ultra-minimal (house style)

A ready direction: dark, monochrome, quiet, and precise, in the spirit of Apple's product pages and system apps. When it was the default for every unstyled request, it made unrelated products converge on one black page. Use it when someone asks for it, and otherwise only when a dealt direction hands it out as one material among many.

### When it applies

Decide in this order and stop at the first match:

1. **The user asks for this style** ("minimal", "premium", "like Apple", "dark and clean", "house style", "our usual style"): use it and record it in the design document.
2. **The user asked for something else visual** (colors, mood, theme, brand, reference site, audience style such as "playful", "for kids", "retro", "bright", "light theme"): follow the request with [[web/frontend/art-direction]]. The house style is not applied.
3. **A system exists** (design document, brand guidelines, code tokens, a live UI): inherit it. The house style never restyles an existing product unless the user asks for a redesign in this style.
4. **Otherwise** (new surface, no cues): deal a direction ([[web/frontend/anti-default-direction]]).

Partial requests: when the user asks for the house style and fixes some aspects ("make the accent green", "use Montserrat"), apply exactly those on top of it and keep the rest; record the change in the design document.

Scope: websites, web apps, desktop and mobile apps, dashboards and tools. Games use their own world's art direction; their launchers, stores, and account pages may use the house style when no cue exists.

**Not a request for this style:** the product's domain, industry, audience, price level, or name. "A coffee roastery", "a SaaS for accountants", "for developers", "a premium brand" describe what to build, not how it should look; with nothing else they mean "no visual cue", which deals a direction, not this style. Only words about appearance select it.

### The character in one paragraph

Black canvas, near-white type, two grays, no decoration. One idea per section, set large, with a lot of air around it. Real content (product shots, screenshots, data) is the only source of color. Controls are calm pills; surfaces separate by tone, not by borders or shadows. Motion is slow on large things and immediate on small ones, and never bounces. Premium comes from restraint and finish: exact spacing, tight display tracking, crisp hairlines, and nothing on the screen that does not need to be there.

### Palette

Dark is the default theme. Light tokens are defined for chapter sections, for products that need a light mode, and for native apps that follow the system appearance (iOS, Android, macOS, Windows: follow the system setting and ship both).

| Role | Dark | Light | Notes |
| --- | --- | --- | --- |
| canvas | `#000000` | `#ffffff` | Page / window background |
| surface | `#161617` | `#f5f5f7` | Tiles, grouped sections |
| surface-raised | `#1d1d1f` | `#ffffff` on `#f5f5f7` | Cards inside a section, inputs, menus |
| text | `#f5f5f7` | `#1d1d1f` | 19.3 / 16.8 : 1 |
| text-secondary | `#a1a1a6` | `#6e6e73` | ≥ 6.5 / ≥ 4.66 : 1 on every surface |
| hairline | `rgb(255 255 255 / 0.1)` | `rgb(0 0 0 / 0.1)` | Lists, tables, dividers only |
| field-border | `#86868b` | `#86868b` | Input boundaries (≥ 3 : 1) |
| action | `#f5f5f7` fill, `#000` label | `#1d1d1f` fill, `#fff` label | The primary pill |
| link / focus | `#2997ff` | `#0066cc` link, `#0071e3` focus | The only chromatic UI color |
| danger | `#ff453a` | `#d70015` | Always with text or an icon |
| success | `#30d158` | `#1a7f37` | Always with text or an icon |
| glass | `rgb(22 22 23 / 0.8)` | `rgb(255 255 255 / 0.72)` | Sticky nav and floating media controls only; blur 20px, saturate 180% |

Rules:

- **Monochrome UI.** Gray steps carry hierarchy; blue is reserved for links, focus, and selection. No second accent unless the product brings one (then one, used for actions).
- **Color comes from content.** Product renders, screenshots, photos, and charts supply the chroma. Without real imagery, follow the imagery path under "Space, layout, shape"; never fill the gap with gradients, glow, or tinted UI.
- **No gradient backgrounds, no glass panels.** Glass is allowed only for floating chrome: the sticky nav and floating media controls.
- Native apps use the platform's semantic colors where they exist (iOS dark: grouped `#000` / `#1c1c1e` / `#2c2c2e`, secondary label `rgb(235 235 245 / 0.6)`, tint `#0a84ff`).

### Typography

- **Family: Geologica** (variable, OFL-1.1, full Cyrillic), one family for everything. Its wide, technical grotesk proportions give the style its own voice instead of the habitual Inter / Geist / system look. Self-host it (`@fontsource-variable/geologica`, or the woff2 files with `font-display: swap`); Google Fonts is acceptable for prototypes. Fallback stack: `-apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", Roboto, sans-serif`.
- **Axes:** keep the extra axes neutral (`font-variation-settings: "CRSV" 0, "SHRP" 0, "slnt" 0`); only weight varies. Sharpness is a possible signature detail for a technical product, never a default.
- **Weights:** Geologica is heavy for its number, so the style runs light: 500 for every headline (hero to title), 340 for reading text (intro, lead, body), 400 for small text, labels, buttons, and numbers, where thin strokes break up. Never 600+ for headlines, never below 300.
- **Tracking:** the face is wide, so display sizes close up: −0.035em at hero, −0.03em at headline, −0.025em at title; 0 for body; +0.005 to +0.01em at 12–14 px. Tabular numerals for prices and specs.
- **Native apps:** bundle Geologica for app content; keep the platform's own font only in system-provided UI (alerts, pickers, share sheets).
- **User overrides** a font by naming one; record it in the design document and retune weights and tracking for that family with a rendered specimen, not by copying these numbers.

Web scale (desktop / phone):

| Role | Size | Line height | Weight | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| hero | 80 / 48 | 1.05 | 500 | −0.035em | once per page |
| headline | 56 / 40 | 1.07 | 500 | −0.03em | section headline |
| title | 40 / 32 | 1.1 | 500 | −0.025em | tile headline |
| intro | 28 / 21 | 1.18 / 1.24 | 340 | −0.01em | one-line intro under a headline |
| lead | 21 / 19 | 1.4 | 340 | 0 | larger paragraph |
| body | 17 | 1.5 | 340 | 0 | main text |
| small | 14 | 1.43 | 400 | 0.005em | secondary text, nav, small buttons |
| caption | 12 | 1.33 | 400 | 0.01em | metadata, legal |

App scale (also good for desktop tools): large title 34/41 500, title 28/34 500, title-2 22/28 500, headline 17/22 500, body 17/22 340, callout 16/21 340, subhead 15/20 400, footnote 13/18 400, caption 12/16 400. Dense tools step down to body 14–15 at weight 400.

### Space, layout, shape

- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120, 160. Section padding 120–160 px desktop, 80 px phone. Side margin ≥ 24 px phone. Headline → subhead 12–16 px, subhead → actions 24–32 px.
  - Within a group (label/field, icon/text): 4–8
  - Between actions: 16–24; between items of one kind: 16–24; tile padding: 40–64 desktop, 24–32 phone
  - Siblings of one kind use one gap token, laid out by a container, never by hand offsets.
- **Widths:** text blocks ≤ 980 px (reading measure ≤ 70 characters), media up to 1440 px, full-bleed only for the hero product shot. Breakpoints: 375, 734, 1068, 1440. Grid: 12 columns with 24 gutter desktop; 4 columns with 16 gutter phone.
- **Alignment and keylines:** rows share centers; button pairs share one height. Hero may be centered; feature sections use a left keyline at the container edge. Settings and lists: labels on the text keyline (16 from the group edge), values and chevrons end on the right keyline; separators inset to the text keyline.
- **Composition:** the hero may be centered (headline, one line of intro, two actions, then the product). Feature sections alternate: left-aligned text with large media, a two-tile row, a full-width media band. Never everything centered, never a grid of identical icon cards.
- **Page anatomy (sites and landing pages).** Build from these blocks, in an order the content needs: (1) hero: headline, one intro line, a primary pill and a text link, then one large product media block up to 1440 px wide; (2) feature split: text left, large media right (or mirrored); (3) a two-tile row: each tile a short headline, one line, a link, and media bleeding off its edge; (4) a full-width media band; (5) one light chapter (`data-theme="light"`) as a break, at most one per page; (6) a quiet footer in caption type. Adjacent sections use different blocks. Apps and tools use the app scale and a grouped-list settings pattern instead.
- **The hero leads with the product, not a panel.** Its leading element is the product shown as an object: a photo, a render, or the real app screen in a device or window frame. Dashboards, charts, stat rows, configurators, and forms are content for feature sections, where they sit as the media of a split or tile, not as a boxed widget under the headline.
- **Imagery path when no photos exist.** Take the first that applies: (1) real assets from the project or the user; (2) the product's own interface rendered as real HTML inside a device or window frame; (3) a large monochrome object drawn in SVG or CSS (the bag, the lamp, the device) with soft tone steps on a surface tile; (4) a media slot of the final size and crop on surface, labeled for the real image ("Product render (real image goes here)"). A correctly sized empty slot keeps the composition; replacing the image with a chart, a gradient, or decoration breaks it. Never AI-generated scenes or stock clichés. (This preset's step 3 and 4 relax the general rules in [[web/frontend/imagery]]; outside this preset, imagery's rules apply.)
- **Radii:** tiles 28 px, cards 18 px, inputs 12 px, buttons and chips pill (9999 px), sheets 16–20 px top. Nested radius = outer − inset.
- **Depth:** flat on dark (tone steps instead of shadows); on light, one soft shadow for overlays only (`0 12px 40px rgb(0 0 0 / 0.12)`). Hairlines only for lists, tables, and dividers; cards have no border.

### Components

- **Primary button:** pill, height 44 (md) / 56 (lg) / 32 (sm), padding 22 px (sm 16, lg 28), 17 px regular label, action fill. One per viewport. States: default, pointer hover (fill lightens/darkens 6%), pressed, focus-visible, pending (label crossfades to progress, width kept), disabled.
- **Secondary action:** a text link in link color with a chevron ("Learn more ›"), or a ghost pill with a field-border outline. Never two filled buttons side by side.
- **Catalogs and shops:** "one primary per viewport" means one filled pill for the page-level action (checkout, subscribe, buy the hero product). Repeated per-item actions ("Add to bag", "Choose") are ghost pills or text links. Item cards are media-led: the product image (or its slot from the imagery path) fills at least half the card, then the name, one line, and the price in tabular numerals. At most one item grid per page, three or four per row on desktop; a single hero product or a featured split comes before it.
- **Nav:** 48–52 px, transparent over the hero, then glass; 12–14 px links in text-secondary, active in text. Its primary pill fades in only once the hero's primary action has left the viewport. The product name is shown in the nav and not repeated above the hero headline.
- **Tiles:** surface fill, 28 px radius, generous padding (40–64 px), a short headline, one line of copy, a link, and a real image that may bleed off the tile edge.
- **Lists and settings (apps):** grouped rows on surface, 44 px minimum height, hairline separators inset to the text keyline, values in text-secondary, chevrons 13 px.
- **Inputs:** 44 px, padding 14, surface-raised fill, 12 px radius, field-border 1 px, label above in small type text-secondary, error text below in danger with an icon, focus ring 2 px link/focus color with 2 px offset.
- **Icons:** one thin set (SF Symbols on Apple platforms, Lucide or Phosphor Light on the web) at 1.5 px stroke; 16 inline, 20 in buttons, 24 in navigation; never inside colored tiles.

### Motion

- **Character:** calm and weighty, precise. Surfaces, text, and sheets never overshoot; controls are tactile: they answer every press (compress ~4 px of perimeter, a fill step, a bloom from the touch point) and settle back with a small spring (≈1% overshoot). Ease `cubic-bezier(0.28, 0.11, 0.32, 1)` for surfaces and transitions, `cubic-bezier(0.25, 0.1, 0.25, 1)` for color, `cubic-bezier(0.3, 0, 1, 1)` for exits.
- **Durations:** press 80 ms down (minimum 90 ms held) / ~450 ms spring release; hover and color 200–250 ms; focus ring 160 ms; switch thumb 420 ms snap spring; menus and sheets 300–400 ms; scenes 600–1000 ms.
- **Signature motion lives in scroll and media**, not in buttons: one hero scene and chapter transitions. Other content is simply there; no fade-up on every section. Reduced motion replaces movement with crossfade while retaining feedback.

### Copy

Short declarative headlines (2–6 words) that name a real benefit of this product; one concrete intro sentence; action labels that are verbs ("Buy", "Get started", "Learn more"). No exclamation marks, no generic claims, no "Not X. Y." slogans.

**Each fact once per viewport.** The product name sits in the nav or above the hero headline, never both on one screen. The same action is visible once: a nav "Buy" next to the hero's "Buy" is a duplicate, so the nav action appears only after the hero action has scrolled out of view (and stays reachable by keyboard from then on). The same applies to a headline repeated in the intro, a tile title repeated in its link, and a section label that restates the headline.

### Keeping it from becoming a template

The palette and type are shared by design, so character has to come from the product:

- **Concept still applies.** Write the one-sentence concept ([[web/frontend/art-direction]] section 1); inside the house style it chooses the imagery, the leading element of each section, the motion character within the motion rules above, and one signature detail.
- **Swap test, adjusted:** a shared palette and type do not fail it; interchangeable content does. If the headlines, imagery, and signature detail would fit a competitor, rework them.
- **No filler.** Ultra-minimal means fewer, better elements; it never means hiding needed labels, states, errors, or actions.

### Verify

- Contrast pairs from the palette measured on the real surfaces, both themes when shipped; re-measure after any color override.
- Style conformance in the code (any hit is an error unless the design document records it): a headline above weight 500 or body text above 400; a font family other than Geologica and its fallback stack; a hex color outside the palette in UI (content imagery excepted); an elevation shadow (a blurred `box-shadow`) on a dark surface, while focus rings and press fills are fine; any `linear-gradient` or `radial-gradient` used as a background; a border drawn around a tile or card; a filled button that is not a pill; more than one filled action pill visible in one viewport (selection indicators, counters, and chips do not count).
- Squint test: one leading element per section survives blur and grayscale.
- Count per viewport: one primary action, at most two text levels per block, no decoration without a function.
- Phone layout: hero type steps down, side margins ≥ 24 px, tiles stack, media keeps its crop.
- Record in the design document: "Direction: house style (premium ultra-minimal)", the concept, the signature detail, and any user overrides.
