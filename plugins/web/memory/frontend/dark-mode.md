---
kind: knowledge
when-and-why-to-read: When a page or app must ship both a light and a dark mode, or you are adding a dark mode to an existing colour system, this knowledge should be read because an inverted or grey-flipped dark mode glares, loses its hierarchy, fails contrast and flashes the wrong mode on load.
short-form: "Dark mode: a second designed rendering of the same semantic tokens, never an inversion. Re-derive each colour from its light value (background L 12–18%, text L 92–96%, raised surfaces lighter, accent less saturated and lighter), keep every hue, hold the same contrast targets, elevation by lightness not shadow, borders lighter than the surface, a white ring for shadow-as-border and image outlines, toggle with no flash and no colour transition; tells."
rationale: >-
  Adapted from Hallmark's dark-mode reference (github.com/Nutlope/hallmark, MIT), with theming through semantic tokens, the elevation ramp, borders and icons, mode switching and the tells from samber's frontend-design-deslop dark-mode reference (github.com/samber/cc-skills, MIT), and the dark shadow ring and image outline from make-interfaces-feel-better's surfaces reference (github.com/jakubkrehel/make-interfaces-feel-better, MIT). Where deslop's numbers differed (background L 8–12%, accent opacity overlays) Hallmark's table was kept. Colour layers, accent use and the contrast numbers live in [[web/frontend/color]]; the token layers in [[web/frontend/design-tokens]]; chart colours in dark mode in [[web/frontend/data-viz]]; grain on a dark background in [[web/frontend/texture]]. This document owns deriving a dark theme from a light one.
---

# Dark mode

Use this only when the user asks for both modes ("dark mode too", "light and dark") or the project already has a mode system to respect. A page whose single theme happens to be dark is not a two-mode page and does not need this. Never add a second mode unprompted.

## The approach

Dark mode is a second, equally designed rendering of the same colour system: never `filter: invert()`, never "swap the greys". Re-derive every colour token from its light value using the table below, hold every contrast target identically in both modes, and never change a hue. If a re-derived token fails its contrast pairing, fix the derivation, never lower the requirement. Work in OKLCH, where L (lightness) and C (chroma) can be moved independently of the hue.

## Theming through semantic tokens

A theme is a set of values bound to semantic token names. Components reference semantic tokens (`--color-bg`, `--color-surface`, `--color-fg`, `--color-muted`, `--color-border`, `--color-accent`, `--color-accent-fg`, plus elevation and state tokens), never raw values.

To add dark mode or a brand theme, redefine those same semantic tokens under a selector (`.dark`, `[data-theme="..."]`) or media query; nothing in the components changes. This is the three-layer discipline in [[web/frontend/design-tokens]] (primitive, semantic, component) applied to modes. The dark palette is a sibling of the light one, authored deliberately, not derived by inversion.

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
- **Elevation ramp.** On dark, shadows barely register, so elevation is expressed by making higher surfaces lighter (the 3% steps above). Material models this as a translucent white overlay whose opacity grows with elevation (about 5 percent at the lowest raised level up to about 16 percent at the highest). The practical rule: the closer a surface is to the user, the lighter it is.
- **Borders are lighter than the surface in dark, not darker.** Icons should use `currentColor` so they follow the text color and do not disappear.
- **Cards are lighter than the background they sit on.** A card darker than its background reads as a hole.
- **Shadow as border.** In dark mode, simplify to a single white ring — layered depth shadows aren't visible on dark backgrounds:

  ```css
  --shadow-border: 0 0 0 1px oklch(1 0 0 / 0.08);
  --shadow-border-hover: 0 0 0 1px oklch(1 0 0 / 0.13);
  ```

- **Image outlines** are pure white at 10% in dark mode, `outline: 1px solid oklch(1 0 0 / 0.1); outline-offset: -1px`, never a near-white from the palette; the light-mode rule is in [[web/frontend/visual-craft]].
- **One heading colour.** All headings use the body text colour; several heading colours that worked on light look fragmented on dark.
- **Images:** never apply CSS `invert` or `brightness` to photographs. Choose photographs that hold up on a dark background, or set a light photograph on a raised surface with padding so it reads as a print on a mount. Any image treatment that depends on `mix-blend-mode: multiply` (a duotone, a texture overlay) needs its own dark-mode version, because multiply disappears on dark.
- **Charts:** series colours re-derive like the accent (chroma down, lightness up); gridlines use the dark hairline colour. See [[web/frontend/data-viz]].

## Switching modes

Drive mode from a class or data attribute on the root plus `prefers-color-scheme` for the default. Do not animate a transition on the theme switch; transitioning every color at once is janky and slow, so suppress transitions during the swap (libraries like next-themes handle this).

Respect the user's system preference as the default and remember an explicit override. Test both modes against the same accessibility bar; a palette that passes in light can fail in dark and vice versa.

```css
/* Suppress transitions during the theme swap */
.theme-switching * {
  transition: none !important;
}
```

## Dark mode tells

- Pure black (`#000`) backgrounds and pure white (`#FFF`) text.
- A straight inversion of the light palette.
- Drop shadows used for elevation on dark (where they do not read) instead of lightness steps.
- Glowing colored box-shadows by reflex (cyberpunk-by-default) when the brief is not neon.
- Fully saturated light-mode accents reused unchanged on dark, glaring.
- Borders darker than the surface in dark mode.
- A visible color-transition animation when toggling theme.
- Raw values scattered in components so only one mode can be themed.

## Checking it

Check every text and background pairing in both modes against the contrast numbers in [[web/frontend/color]]. A screenshot tool usually renders only the default mode, so take dark-mode screenshots explicitly (set `data-mode="dark"` or emulate `prefers-color-scheme: dark`) and compute the dark pairings rather than trusting the light ones. The rule against pure `#000` and `#fff` holds in the dark block too.
