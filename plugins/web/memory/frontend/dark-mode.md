---
kind: knowledge
when-and-why-to-read: When a page or app must ship both a light and a dark mode, or you are adding a dark mode to an existing colour system, this knowledge should be read because an inverted or grey-flipped dark mode glares, loses its hierarchy, fails contrast and flashes the wrong mode on load.
short-form: "Dark mode: a second designed rendering of the same tokens, never an inversion. Re-derive each colour from its light value (background L 12–18%, text L 92–96%, raised surfaces lighter, accent less saturated and lighter), keep every hue, hold the same contrast targets, drop shadows, toggle with no flash."
rationale: >-
  Adapted from Hallmark's dark-mode reference (github.com/Nutlope/hallmark, MIT). Colour layers, accent use and the contrast numbers live in [[web/frontend/visual-craft]]; chart colours in dark mode in [[web/frontend/data-viz]]; grain on a dark background in [[web/frontend/texture]]. This document owns deriving a dark theme from a light one.
---

# Dark mode

Use this only when the user asks for both modes ("dark mode too", "light and dark") or the project already has a mode system to respect. A page whose single theme happens to be dark is not a two-mode page and does not need this. Never add a second mode unprompted.

## The approach

Dark mode is a second, equally designed rendering of the same colour system: never `filter: invert()`, never "swap the greys". Re-derive every colour token from its light value using the table below, hold every contrast target identically in both modes, and never change a hue. If a re-derived token fails its contrast pairing, fix the derivation, never lower the requirement. Work in OKLCH, where L (lightness) and C (chroma) can be moved independently of the hue.

## Re-deriving each token

| Token (light-mode role) | Dark value |
|---|---|
| Page background | L 12–18%, tinted toward the brand hue (chroma 0.008–0.015). Never `#000`. |
| Raised surfaces (a second and third background shade for cards, panels, wells) | Each level up is about 3% lighter than the one below. In light mode raised surfaces step darker or stay white; in dark mode they step lighter. |
| Body text | L 92–96%, tinted toward the brand hue. Never `#fff`. |
| Secondary and muted text | Re-space the lightness steps evenly between the new background and the new body text, so headings, body and muted text still read as distinct levels. Keep every chroma tint. |
| Hairlines and borders | L about 26–34%. Check them against the raised surface, not only the page background; a line that shows on one can vanish on the other. |
| Accent | Chroma down 0.02–0.04, L up 5–10%. A saturated light-mode accent glares on a dark background. |
| Text on an accent fill | Re-check against the new accent: at least 4.5:1 for body text, 3:1 for large text. |
| Focus ring | Follows the accent's derivation; at least 3:1 against both the page background and the raised surface. |
| Hue | Never moves between modes, on any token. |

One change outside the colours: lower body `font-weight` by 50 in dark mode (400 to 350, with a variable font). Light text on a dark background reads heavier than the same weight in dark on light.

## Writing the CSS

Keep the light tokens as they are, then add exactly two blocks that override only the tokens that change:

```css
:root { color-scheme: light dark; /* light tokens … */ }

[data-mode="dark"] { /* the re-derived tokens only */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-mode]) { /* the same overrides, for when the user has not chosen and the OS is dark */ }
}
```

The explicit `[data-mode]` choice always wins, because the media block only applies when no mode attribute is set. `color-scheme: light dark` makes form controls and scrollbars follow the mode.

The toggle is one button that sets `document.documentElement.dataset.mode` and saves the choice to `localStorage`. Read the saved choice in a short inline script in `<head>`, before the page paints, so the page never flashes the wrong mode:

```html
<script>
  const m = localStorage.getItem('mode');
  if (m) document.documentElement.dataset.mode = m;
</script>
```

## Rules that change in dark mode

- **No drop shadows.** On a dark background a shadow reads as a glow. Show elevation by lightness (the 3% steps above) or by an inset hairline: `box-shadow: inset 0 0 0 1px <border colour>`.
- **Cards are lighter than the background they sit on.** A card darker than its background reads as a hole.
- **One heading colour.** All headings use the body text colour; several heading colours that worked on light look fragmented on dark.
- **Images:** never apply CSS `invert` or `brightness` to photographs. Choose photographs that hold up on a dark background, or set a light photograph on a raised surface with padding so it reads as a print on a mount. Any image treatment that depends on `mix-blend-mode: multiply` (a duotone, a texture overlay) needs its own dark-mode version, because multiply disappears on dark.
- **Charts:** series colours re-derive like the accent (chroma down, lightness up); gridlines use the dark hairline colour. See [[web/frontend/data-viz]].

## Checking it

Check every text and background pairing in both modes against the contrast numbers in [[web/frontend/visual-craft]]. A screenshot tool usually renders only the default mode, so take dark-mode screenshots explicitly (set `data-mode="dark"` or emulate `prefers-color-scheme: dark`) and compute the dark pairings rather than trusting the light ones. The rule against pure `#000` and `#fff` holds in the dark block too.
