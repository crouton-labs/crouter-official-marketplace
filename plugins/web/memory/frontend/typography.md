---
kind: knowledge
when-and-why-to-read: When you are choosing typefaces, a type scale, leading, tracking, measure or font loading for a page or app, this knowledge should be read because a face picked by reflex or a size guessed outside the known ranges (Inter as the display face, inherited 1.2 leading, a third family, faked bold) is what makes type look unchosen.
short-form: "Typography: type in numbers (two families, three weights, 1.25 scale from 16px, display tracking and leading by size, measure in ch); choosing faces brand-first by class, serif vs sans, seven evaluation criteria, modular-scale ratios, pairing; faces models over-use and faces to consider; wordmark; loading and web-font performance; variable fonts; fluid type; system stacks; text-wrap balance vs pretty, font smoothing, tabular numbers; legibility minimums; licensing; type tokens; common mistakes."
rationale: >-
  The numeric type rules, font lists, wordmark and loading rules come from Hallmark's craft and fonts references (github.com/Nutlope/hallmark, MIT), moved here from [[web/frontend/visual-craft]]. The selection process, classification, scale ratios, pairing, variable fonts, performance, licensing, tokens, mistakes and disagreements are adapted from samber's frontend-design-deslop typography reference (github.com/samber/cc-skills, MIT); added reflex faces from better-design's fonts reference (github.com/Moddingflow/better-design, MIT); text wrapping, font smoothing, font-family scope and tabular numbers from make-interfaces-feel-better (github.com/jakubkrehel/make-interfaces-feel-better, MIT). Where the sources gave different leading, tracking or hierarchy sizes, Hallmark's numbers were kept and the others dropped. Neighbours own: text-role sizes and section spacing [[web/frontend/marketing-pages]]; colour and contrast [[web/frontend/color]]; WCAG criteria [[web/frontend/accessibility]]; type sizes on small screens [[web/frontend/responsive]]; type tokens alongside the rest [[web/frontend/design-tokens]].
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

# Typography

Type is voice made visible. Every typeface carries personality, every hierarchy guides attention, every spacing decision affects comprehension. The goal is not a beautiful font but the right one: the one that serves the message and the reader.

Start from brand personality (the 3 to 5 adjectives the brand is described by), then translate to typographic form. Never the reverse.

Anchoring quotes:

- "Typography exists to honor content" (Bringhurst)
- "Typography and design should enhance communication, not just look attractive" (Spiekermann)
- "If you have fewer choices, it often makes your life easier" (Spiekermann)

The frameworks below draw on Bringhurst (proportion, rhythm, harmony), Ellen Lupton (Letter, Text, Grid), Spiekermann (type serving communication), and Paula Scher and Matthew Carter (bold identities, screen-legible type).

The size of each text role (hero heading, section heading, item title, lead, body, label) is in [[web/frontend/marketing-pages]]; how sizes step down on small screens is in [[web/frontend/responsive]].

## Type in numbers

- **Families:** two at most, a display face and a body face, or one family for both. One family at different weights counts as one. A third face is allowed only for exactly one job (the wordmark, one large headline figure, or code; a mono used for both code and measured figures still counts as one job). A third face doing two jobs is a third family in running use, which is one too many.
- **Weights:** three at most across the whole page, display and body together, chosen far apart: 300 beside 800, or 400 beside 700.
- **Scale:** a 1.25 ratio up from a 16px body. Past the size roles, build hierarchy from weight and colour, not from more sizes.
- **Display tracking:** -0.02 to -0.04em on a regular-width face; 0 to -0.015em on a condensed or very heavy face. Two letters touching is a fault.
- **Display leading:** 1.0 to 1.15, tighter as the size grows. 1.2 looks inherited. A mixed-case poster-sized heading may close to 0.92. An uppercase heading that can wrap never goes under 1.0.
- **One heading, one treatment:** a heading is one weight, one style and one colour. Do not set one word in a different colour, italic, weight or highlight. Get stress from a line break, or from a second line at a second size.
- **Very large headings:** a single word may go to 7rem. A poster-scale page sizes the heading with the screen, `clamp(4rem, 10vw, 9rem)`, reaching full size at 1440px and holding there at 1920, while the first screen still shows the headline, one sentence and the action. A wide face takes the poster scale one step down.
- **Hero heading size by length:** count the characters of the rendered `h1`. 20 or fewer: the hero heading size, and a single word may go up to 7rem. 21 to 50: the hero heading size. 51 to 90: the smaller long-heading size, or split it at the sense break with `<br>`. Over 90: rewrite it. A `<br>` goes only between phrases, and check it at 375px wide, where it often lands badly.
- **Heading measure:** set on the heading element in `ch`, never on the wrapper around the heading group: `h1` 20ch, `h2` 30ch, `h3` 40ch, a long hero heading about 24ch, the lead line under a heading about 52ch, a body paragraph about 65ch.
- **Body:** 16px minimum, line-height 1.5 to 1.65, measure 45 to 75ch. Never all caps, never justified without hyphenation, never tracked past 0.05em.
- **Labels, captions, table heads, meta, tags, chips and nav links:** the body face one step smaller, sentence case (lowercase only on a page whose whole voice is lowercase), no added tracking. Use mono only for code, a figure or a measurement, or when the whole page is set in mono. Capitals belong to the wordmark and to a page whose display headings are uppercase; there, a control may follow in capitals at 0.04em tracking or less.
- **Always:** `font-display: swap`; a fallback of the same build (a grotesk falls back to `system-ui`, a serif to Georgia); `font-synthesis: none`; `font-variant-numeric: tabular-nums` on figures that are compared (tables, prices, stats); curly quotes, a true ellipsis (…), and a non-breaking space inside unit pairs (`10 MB`, `⌘ K`) in a proportional face.

## Choosing faces

### Brand-first selection process

1. Define 3 to 5 personality adjectives (from discovery). These translate directly into type qualities. If the brand can describe its tone, personality, and principles in words, that translates into typographic form.
2. Understand the audience and industry expectations; different fields carry ingrained type expectations.
3. Gather inspiration; analyze competitors, see what works, decide how to differ.
4. Select and pair fonts; build mockups for real use cases (web, mobile, print) to test if they hold up.
5. Establish hierarchy; define primary, secondary, and optional tertiary with clear purposes.
6. Document everything with examples and specifications.

### Classification and personality matrix

Match the class to the committed adjectives.

| Class | Personality | Best for | Typical fields |
| --- | --- | --- | --- |
| Serif | traditional, classical, reliable, authoritative, sophisticated | long-form, heritage, trust | law, finance, luxury, editorial |
| Sans-serif | modern, clean, minimal, approachable, contemporary | digital UI, startups, accessibility | tech, SaaS, healthcare, retail |
| Script | elegant, distinctive, personal | special moments, luxury accents | fashion, weddings, high-end beauty |
| Handwritten | artsy, informal, fun, playful, authentic | personal connection, casual | creative, kids, artisan food |
| Display / decorative | bold, attention-grabbing, distinctive | headlines only, limited accent | entertainment, events, campaigns |
| Slab serif | strong, sturdy, mechanical, modern-classic | tech with heritage, editorial | construction, automotive, journalism |
| Monospace | technical, precise, developer-oriented | code, data, technical docs | dev tools, fintech, data platforms |

### Serif vs sans

Choose serif when the brand leans artisanal, authoritative, or editorial; long-form print or reading leads; you want tradition, trust, premium positioning; the audience expects established credibility (boutique hotels, legal, investment, craft, heritage). Choose sans when 70 percent or more of touchpoints are digital UI; quick legibility is paramount; you want modernity, accessibility, innovation (tech, startups, digital products, contemporary retail, healthcare).

High-resolution displays have largely closed the screen legibility gap, so the specific typeface and context matter more than the class alone. A serif display over a sans body (or the reverse) is a reliable de-slop move because it breaks the sans-everything default.

### Typeface evaluation criteria

Assess any candidate on seven dimensions:

- Comprehensiveness: all characters, weights, styles you will need (brand needs grow).
- Legibility: readable at small sizes, distinctive characters.
- Versatility: works across headline, body, caption, and media.
- Complementarity: works with the logo, colors, imagery.
- Distinctiveness: helps differentiate from competitors and from the AI default.
- Technical readiness: web font available, proper licensing, variable font.
- X-height appropriateness: optimal for intended sizes. Higher x-height aids small-size legibility, but an extremely high x-height reduces word-shape recognition. Aim for appropriate, not maximal.

### Pairing principles

- Seek contrast, not conflict. Two near-but-not-quite-same faces clash like mismatched plaids.
- Avoid typographic mud: faces from the same class but different families blur together with no meaningful distinction.
- Create meaningful hierarchy through weight, size, and style.
- Limit strong personalities: two bold display faces compete for attention.
- Consider weight contrast: bolder titles, lighter body, or the reverse for effect. Practical tips: keep one face simple when the other is distinctive; serif headline + sans body (or reverse) is reliable; look for a shared trait (x-height, proportion, era); test in real content before committing; monospace pairs with any class for a technical accent.

### Typography system components

- Primary (display): attention type for headlines and key moments; expresses personality most strongly.
- Secondary (body): the workhorse for readable text; prioritizes legibility over personality.
- Tertiary (accent, optional): special uses (monospace for code, script for signatures); use sparingly.
- Hierarchy: the systematic relationship of sizes, weights, and spacing that guides the reader.
- Usage guidelines: rules so anyone can apply it consistently.

## Fonts

Choose the class of face the page's idea calls for (a roman serif, a condensed sans, a mono), then try two or three faces from that class with the real headline set in each, and decide by how it looks on the page. A face's name, its reputation, or an association with the subject is not a reason. Use free faces unless the user has confirmed a licence. Prefer variable fonts.

### Faces models over-use

Every model reaches for these first, so on a page they read as unchosen. Do not use them as the display or body face: Inter, Roboto, Open Sans, Lato, Poppins, Source Sans, Nunito, Montserrat, Raleway, Work Sans, DM Sans, Plus Jakarta Sans, system-ui, Arial and Helvetica; Merriweather, Lora and Georgia as the body serif; Courier New or the system mono. Use one only when the user asks for it or the project already uses it.

Also reflex: Outfit as display or body; Syne as display; Space Mono and IBM Plex Mono as labels on a page whose material is not mono.

Dense working tools may use a system stack or the platform face; that is a legitimate choice for working tools, not a reflex, when numerals and language coverage are checked.

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

### Web font performance

Custom fonts delay text rendering. Prefer FOUT (show fallback, swap when ready) over FOIT (hide text until loaded).

- Use `font-display: swap`.
- Preload critical faces: `<link rel="preload" href="brand.woff2" as="font" type="font/woff2" crossorigin>`.
- `font-display: optional` for maximum performance (uses the font only if cached).
- Tune fallback metrics to the web font to reduce layout shift.

```css
@font-face {
  font-family: "BrandFont";
  src: url("brand.woff2") format("woff2");
  font-display: swap;
}
```

## Modular scale

A mathematical hierarchy using a consistent ratio between sizes (Bringhurst, after musical scales). Pick the ratio from personality and content, state it, base it at 16px for web (browser default and accessibility baseline), then multiply up and divide down. Limit to 6 to 8 sizes to avoid clutter.

| Ratio          | Value | Character           | Best for                   |
| -------------- | ----- | ------------------- | -------------------------- |
| Minor second   | 1.067 | subtle increments   | dense, data-heavy UIs      |
| Major second   | 1.125 | slightly noticeable | functional interfaces      |
| Minor third    | 1.200 | moderate            | balanced content hierarchy |
| Major third    | 1.250 | clear hierarchy     | general UI                 |
| Perfect fourth | 1.333 | distinct hierarchy  | editorial, marketing       |
| Golden ratio   | 1.618 | dramatic, high-end  | premium, display-heavy     |

Larger screens tolerate more dramatic ratios; smaller screens want conservative ones. Tools: typescale.io, precise-type.com.

The default above is a 1.25 ratio from a 16px body; choose another ratio only with a reason from the content.

## Variable fonts

One file holds all weights and widths through continuous interpolation: smaller than many statics, any weight available (450, not just 400/500), responsive and animatable.

| Axis         | Code | Range                 | Effect                        |
| ------------ | ---- | --------------------- | ----------------------------- |
| Weight       | wght | thin to black         | stroke thickness              |
| Width        | wdth | condensed to extended | character width               |
| Italic       | ital | upright to italic     | roman/italic switch           |
| Slant        | slnt | angle                 | oblique lean                  |
| Optical size | opsz | size-specific         | auto-adjusts details for size |

```css
.heading {
  font-variation-settings:
    "wght" 700,
    "wdth" 100;
}
.body {
  font-variation-settings:
    "wght" 400,
    "opsz" 16;
}
```

## Responsive and fluid type

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

Minimum 2rem, preferred 5vw, maximum 4rem. Use rem for min/max so user zoom is respected. Headings benefit most from fluid scaling; body can stay fixed. Test at 200 percent zoom.

## System font stacks

Valid for apps, dashboards, and content-heavy tools where neutrality and zero-download speed matter. This is a deliberate utilitarian choice, not the slop default.

```css
font-family:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,
  Cantarell, "Helvetica Neue", sans-serif;
```

## Rendering details

Font smoothing, text wrapping and tabular numbers are rendering details. They do not override the project's chosen font family.

### Text wrapping

#### text-wrap: balance

Distributes text evenly across lines, preventing orphaned words on headings and short text blocks. **Only works on blocks of 6 lines or fewer** (Chromium) or 10 lines or fewer (Firefox) — the balancing algorithm is computationally expensive, so browsers limit it to short text.

```css
/* Good — even line lengths on short text */
h1, h2, h3 {
  text-wrap: balance;
}
```

```css
/* Bad — default wrapping leaves orphans */
h1 {
  /* no text-wrap rule → "Read our
     blog" instead of balanced lines */
}
```

```css
/* Bad — balance on long paragraphs (silently ignored, wastes intent) */
.article-body p {
  text-wrap: balance;
}
```

**Tailwind:** `text-balance`

#### text-wrap: pretty

Prevents orphaned words (a single word dangling on the last line) by adjusting line breaks throughout the paragraph. Unlike `balance`, it doesn't try to equalize line lengths — it just ensures the last line isn't embarrassingly short. Works on text of any length with no line-count limit.

This should be your **default for short-to-medium text** — paragraphs, descriptions, captions, list items, card text. For very long text (10+ lines), skip both `pretty` and `balance` — the browser's default wrapping is fine and you avoid unnecessary layout cost.

```css
/* Good — descriptions, captions, short paragraphs */
p, li, figcaption, blockquote {
  text-wrap: pretty;
}
```

```tsx
// Tailwind
<p className="text-pretty">
  A short paragraph that won't leave an orphan on the last line.
</p>
```

**Tailwind:** `text-pretty`

#### When to Use Which

| Scenario | Use |
| --- | --- |
| Headings, titles where even distribution matters | `text-wrap: balance` |
| Short-to-medium text — paragraphs, descriptions, captions, UI text | `text-wrap: pretty` |
| Long text (10+ lines), code blocks, pre-formatted text | Neither — leave default |

### Font smoothing (macOS)

On macOS, text renders heavier than intended by default. Apply antialiased smoothing to the root layout so all text renders crisper and thinner.

```css
/* CSS */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

```tsx
// Tailwind — apply to root layout
<html className="antialiased">
```

#### Good vs. Bad

```css
/* Good — applied once at the root */
html {
  -webkit-font-smoothing: antialiased;
}

/* Bad — applied per-element, inconsistent */
.heading {
  -webkit-font-smoothing: antialiased;
}
.body {
  /* no smoothing → heavier than heading */
}
```

**Note:** This only affects macOS rendering. Other platforms ignore these properties, so it's safe to apply universally.

### Font family scope

Do not introduce a paid or proprietary typeface just to polish an interface.

Use the product's existing type system unless the task explicitly asks for a type change. If the design calls for a system-native macOS feel, use the system font stack. If the design calls for a commercial face such as Helvetica Now, treat it as an optional brand decision and keep a practical fallback stack.

```css
/* System-native macOS/iOS feel */
html {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

```css
/* Commercial brand face with safe fallbacks */
html {
  font-family: "Helvetica Now", "Helvetica Neue", Arial, sans-serif;
}
```

**Rule:** font smoothing, text wrapping, and tabular numbers are rendering details. They do not override the project's chosen font family.

### Tabular numbers

When numbers update dynamically (counters, prices, timers, table columns), use tabular-nums to make all digits equal width. This prevents layout shift as values change.

```css
/* CSS */
.counter {
  font-variant-numeric: tabular-nums;
}
```

```tsx
// Tailwind
<span className="tabular-nums">{count}</span>
```

#### When to Use

| Use tabular-nums | Don't use tabular-nums |
| --- | --- |
| Counters and timers | Static display numbers |
| Prices that update | Decorative large numbers |
| Table columns with numbers | Phone numbers, zip codes |
| Animated number transitions | Version numbers (v2.1.0) |
| Scoreboards, dashboards | |

#### Caveat

Some fonts (like Inter) change the visual appearance of numerals with this property — specifically, the digit `1` becomes wider and centered. This is expected behavior and usually desirable for alignment, but verify it looks right in your specific font.

```css
/* With Inter font:
   Default:  1234  → proportional, "1" is narrow
   Tabular:  1234  → all digits equal width, "1" centered */
```

## Legibility

Contrast and the WCAG text-resize and text-spacing criteria are in [[web/frontend/accessibility]].

- Minimums: buttons/links 14px (16 better), captions and dense supporting text (table cells, footnotes) 12px, 11px is the absolute floor below which legibility breaks down regardless of context.
- Dyslexia-friendly: simple sans shapes, wider letter and word spacing, distinct b/d and p/q, upright (no italic body), 16px+. Recommended: Lexend (built for readability), Atkinson Hyperlegible (low-vision, benefits all), Open Sans, Verdana, Calibri. Sans, monospace, and roman are most readable for dyslexic readers; italics reduce readability.

## Print vs digital

Print vs digital facts:

- Resolution: 300dpi vs 72 to 100ppi
- Body: 10 to 12pt print vs 15 to 25px digital
- Print allows any font; digital is limited by availability and licensing
- Print renders consistently; screens vary by device

For cross-channel work, choose faces designed for both, test in both, consider superfamilies, ensure licensing covers all uses, and document per-medium size adjustments.

## Font licensing

License types: Desktop (users/devices), Web (page views, domains), App (downloads, platforms), ePub (titles), Server/API (impressions). Key points: read the EULA; some licenses prohibit logo use; clients need their own license (you cannot transfer yours); most prohibit modifying files; embedding (PDF, video) has specific rules. Open source: SIL Open Font License (free personal and commercial, modifiable), Google Fonts (all commercial-licensed), The League of Moveable Type.

## Type tokens

```css
:root {
  --font-display: "[Display]", [fallbacks];
  --font-body: "[Body]", [fallbacks];
  --font-mono: "[Mono]", ui-monospace, monospace;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;
  /* scale at chosen ratio, base 16px */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --tracking-tight: -0.01em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-widest: 0.1em;
}
:root {
  --type-display: var(--fw-bold) var(--text-5xl)/var(--leading-tight)
    var(--font-display);
  --type-h1: var(--fw-bold) var(--text-4xl)/var(--leading-tight)
    var(--font-display);
  --type-body: var(--fw-regular) var(--text-base)/var(--leading-normal)
    var(--font-body);
}
```

How these sit with the colour, spacing and component tokens is in [[web/frontend/design-tokens]].

## Common mistakes

Inconsistent usage across platforms; too many fonts (cap at 3); readability sacrificed for style; ignoring licensing; mismatched personality; low-contrast text; over-styling (shadows, gradients on type); ignoring mobile; trendy faces that date fast; skipping hierarchy; not testing across media; default fonts for logos or display.

## Where experts disagree

- Serif vs sans on screen: high-res has largely equalized this; context and the specific face matter more than class.
- X-height: appropriate beats maximal.
- Dyslexia fonts: well-designed standard fonts (Verdana, Lexend) work as well as specialized ones; match to user preference.
- System vs web fonts: brand expression can justify the performance cost; test both.
- Variable fonts: support is now solid; use for new projects.
