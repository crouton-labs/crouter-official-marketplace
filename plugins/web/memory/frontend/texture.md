---
kind: knowledge
when-and-why-to-read: When you are thinking of adding grain, a halftone dot pattern, offset colour copies of a word, scanlines or a torn paper edge to a page, this knowledge should be read because texture spread everywhere to make a flat page feel richer is a generated-design habit, and texture only works as one printed-looking effect, on a page whose look comes from print or old screens, kept faint and never animated.
short-form: "Texture: only on print, retro-screen or editorial looks; one effect per page (grain, halftone, misregistration, scanlines or deckled edge); opacity 0.08 or less page-wide, 0.15 on one card, 0.05 or none under body text; never animated; overlays ignore the pointer and are hidden from assistive tech; pure CSS or inline SVG; measure contrast on the textured result."
rationale: >-
  Adapted from Hallmark's texture reference (github.com/Nutlope/hallmark, MIT). Hallmark's table of which of its themes earn texture is replaced by a plain statement of which kinds of page do. Treating photographs (duotone, halftone as an image treatment) lives in [[web/frontend/imagery]]; contrast numbers and motion rules in [[web/frontend/visual-craft]]; grain in dark mode is covered here and colour derivation in [[web/frontend/dark-mode]]. This document owns page-level print and screen effects.
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
- **Measure contrast on the textured result,** not on the flat colours; text must still meet the contrast numbers in [[web/frontend/visual-craft]].

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
