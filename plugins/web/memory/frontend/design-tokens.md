---
kind: knowledge
when-and-why-to-read: When you are setting up or changing the CSS custom properties a page or app styles itself from — type, colour, spacing, radius and motion tokens, a dark theme, or mapping them into Tailwind or shadcn — this knowledge should be read because raw values scattered through components, or components reading primitives instead of semantic names, leave a system that cannot be themed or kept consistent.
short-form: "Design tokens: three layers (primitive, semantic, component), components read semantic names only; a framework-agnostic OKLCH token core with a designed dark override and reduced-motion opt-in; adapters for plain CSS, Tailwind v4 @theme, shadcn and Open Props; four worked token sets (Editorial Ink, Terminal/Nord, Neo-brutalist Pop, OKLCH single accent) and Radix step-9 solids."
rationale: >-
  Adapted from samber's frontend-design-deslop references token-core.css, adapters and token-sets (github.com/samber/cc-skills, MIT). Their motion durations (100/150/200/300/500ms) differ from the 120/220/420ms scale in [[web/frontend/visual-craft]]; they are kept here as the source wrote them, and visual-craft's scale wins when the two disagree. Neighbours own the values: type [[web/frontend/typography]]; colour [[web/frontend/color]]; spacing, radii, shadows and motion [[web/frontend/visual-craft]]; the dark theme [[web/frontend/dark-mode]]; writing tokens down in a DESIGN.md [[web/frontend/design-md]].
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

# Design tokens

The values themselves are chosen in [[web/frontend/typography]], [[web/frontend/color]] and [[web/frontend/visual-craft]]; this document is how they are held in code. Where a project keeps a DESIGN.md, it describes these tokens: [[web/frontend/design-md]].

## Three-layer token discipline

1. Primitives (raw): `--blue-9`, `--space-3`, `--font-mono`.
2. Semantic (purpose): `--color-bg`, `--color-fg`, `--color-accent`, `--color-border`.
3. Component (variant): `--button-bg`, `--card-radius`. Components reference semantic tokens, never raw primitives. Dark mode redefines the same semantic variables under `.dark` or the media query.

## The token core

```css
/* Framework-agnostic source of truth. Authored in OKLCH.
   This is the "Editorial Ink" set; swap values from the token sets below for other directions.
   Adapters (Tailwind v4 @theme, shadcn :root) layer on top of this. */

:root {
  /* Type families: never Inter/Roboto/system as primary */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Newsreader", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Type scale, ratio ~1.25, steps clearly distinct */
  --text-xs: 0.8rem;
  --text-sm: 1rem;
  --text-md: 1.25rem;
  --text-lg: 1.563rem;
  --text-xl: 1.953rem;
  --text-2xl: 2.441rem;
  --text-3xl: 3.052rem;

  /* Spacing: 4px base, constrained scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --space-8: 5rem;

  /* Radius: committed, max two values. No blob-rounding. */
  --radius: 2px;
  --radius-pill: 999px;

  /* Shadow approach: pick ONE. Here: a defined edge, no diffuse drop. */
  --border: 1px solid var(--color-border);

  /* Color: dominant + one sharp accent. Not indigo/violet. */
  --color-bg: oklch(0.97 0.008 95);      /* warm paper, used deliberately */
  --color-fg: oklch(0.22 0.004 250);     /* deep ink */
  --color-muted: oklch(0.55 0.01 250);
  --color-border: oklch(0.85 0.01 250);
  --color-surface: oklch(0.92 0.006 95); /* raised surface, one step above bg */
  --color-accent: oklch(0.53 0.15 30);   /* brick red, the signature */
  --color-accent-fg: oklch(0.99 0 0);

  /* Motion: communicative only. ease-out under 300ms is the default.
     Animate transform and opacity only. */
  --duration-instant: 100ms;             /* press, toggle, tooltip */
  --duration-fast: 150ms;                /* dropdowns, small popovers */
  --duration-normal: 200ms;              /* standard transitions, fades */
  --duration-slow: 300ms;                /* larger panels */
  --duration-sheet: 500ms;               /* sheets, drawers */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* enter, most UI */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen movement */
  --ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);    /* iOS-like drawers */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);         /* leaving the screen */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark is designed, not inverted: near-black base, off-white ink,
       elevation by lightness (each raised surface +3 to 4 L), lighter
       desaturated accent, borders lighter than the surface. */
    --color-bg: oklch(0.18 0.01 250);
    --color-fg: oklch(0.95 0.008 95);
    --color-muted: oklch(0.70 0.01 250);
    --color-border: oklch(0.32 0.01 250);
    --color-surface: oklch(0.22 0.01 250); /* raised surface in dark mode */
    --color-accent: oklch(0.68 0.10 30);   /* lighter, desaturated sibling */
    --color-accent-fg: oklch(0.10 0 0);
  }
}

/* Default to no motion; opt in when the user has not asked to reduce it. */
@media (prefers-reduced-motion: no-preference) {
  .animated {
    transition: transform var(--duration-fast) var(--ease-out),
                opacity var(--duration-fast) var(--ease-out);
  }
}
```

## Adapters

The token core is the portable source of truth. Pick the adapter for the stack. The semantic token names stay constant across stacks so components are portable.

### Plain CSS (any framework, no build step)

Import the core, then reference variables directly.

```css
@import "./tokens.css"; /* the token core */

.button {
  font-family: var(--font-body);
  background: var(--color-accent);
  color: var(--color-accent-fg);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  border: none;
}
.card {
  background: var(--color-bg);
  border: var(--border); /* edge, not shadow */
  border-radius: var(--radius);
  padding: var(--space-4);
}
```

### Tailwind v4 (@theme)

`@theme` generates utilities AND exposes tokens as runtime CSS variables. Declare tokens once; get `bg-accent`, `text-accent`, `font-display`, `rounded-card` automatically.

```css
@import "tailwindcss";
@import "./tokens.css";

@theme {
  --font-display: "Fraunces", serif;
  --font-body: "Newsreader", serif;
  --color-accent: oklch(0.53 0.15 30);
  --color-bg: oklch(0.97 0.008 95);
  --color-fg: oklch(0.22 0.004 250);
  --radius-card: 2px;
  --spacing: 0.25rem; /* base unit; p-4 = 1rem */
}
```

Usage: `<button class="bg-accent text-white font-body rounded-card px-4 py-2">`. Tailwind v4 ships its own palette in OKLCH, so custom OKLCH tokens sit naturally alongside it.

### shadcn/ui (semantic tokens)

shadcn components read semantic variables, so overriding them reskins every component at once. Override the default primary (which is otherwise the slop accent). On Tailwind v4, shadcn uses OKLCH and `@theme inline`.

```css
:root {
  --background: oklch(0.97 0.008 95);
  --foreground: oklch(0.22 0.004 250);
  --primary: oklch(0.53 0.15 30); /* replace the default */
  --primary-foreground: oklch(0.99 0 0);
  --muted-foreground: oklch(0.55 0.01 250);
  --border: oklch(0.85 0.01 250);
  --radius: 0.125rem; /* 2px, not the rounded-2xl reflex */
}
.dark {
  --background: oklch(0.18 0.01 250);
  --foreground: oklch(0.95 0.008 95);
  --border: oklch(0.32 0.01 250);
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

### Optional: Open Props

For ready-made sizes, easings, and gradients in any stack: `@import "https://unpkg.com/open-props";` then reference `var(--size-3)`, `var(--ease-3)`, etc. Pure CSS variables, framework-agnostic.

## Token sets

Four ready-to-use directions, each deliberately outside the indigo/violet default, each with one named signature move. Hex values are authoritative where given (verified against official sources); OKLCH is used for new tokens. Drop one into the token core and adapt it with an adapter below.

### Set 1 - Editorial Ink

High-contrast newsprint. Dominant near-black ink, single warm accent. (This is the set the token core above uses.)

```css
:root {
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Newsreader", Georgia, serif;
  --color-bg: #f7f5f2; /* warm paper, deliberate */
  --color-fg: #1a1c1e; /* deep ink, ~oklch(0.22 0.004 250) */
  --color-accent: #b8422e; /* brick red, ~oklch(0.53 0.15 30) */
  --radius: 2px; /* near-sharp */
}
```

Signature move: a thick brick-red horizontal rule under section headings; real columns and drop caps; zero cards.

### Set 2 - Terminal / Nord

Developer-native dark. Nord values verified from nordtheme.com.

```css
:root {
  --font-display: "JetBrains Mono", ui-monospace, monospace;
  --font-body: "IBM Plex Mono", ui-monospace, monospace;
  --color-bg: #2e3440; /* nord0 Polar Night */
  --color-surface: #3b4252; /* nord1 */
  --color-fg: #eceff4; /* nord6 Snow Storm */
  --color-accent: #88c0d0; /* nord8 Frost, primary accent */
  --color-accent-2: #a3be8c; /* nord14 Aurora green */
  --color-danger: #bf616a; /* nord11 Aurora red */
  --radius: 3px;
}
```

Signature move: monospace everything (not just code), ANSI frost/aurora accents, optional blinking-cursor or CRT touch. Alt scheme (Solarized, verified ethanschoonover.com): base03 `#002B36`, blue `#268BD2`, yellow `#B58900`, cyan `#2AA198`, green `#859900`.

### Set 3 - Neo-Brutalist Pop

Signature move IS the visual identity: hard offset shadow + thick black borders.

```css
:root {
  --font-display: "Clash Display", sans-serif; /* Fontshare */
  --font-body: "Satoshi", sans-serif; /* Fontshare */
  --color-bg: #fffdf5;
  --color-fg: #000000;
  --color-accent: #ffc53d; /* Radix Amber-9, dark text on it; ~oklch(0.835 0.146 86) */
  --color-accent-2: #29a383; /* Radix Jade-9; ~oklch(0.648 0.123 165) */
  --border: 3px solid #000;
  --shadow: 6px 6px 0 #000; /* hard, no blur, THE signature */
  --radius: 0; /* sharp corners */
}
```

Signature move: solid 6px offset black shadow (no blur), 3px black borders, flat saturated fills, zero radius. Note: Amber/Sky/Mint/Lime/Yellow Radix-9 values are tuned for dark foreground text.

### Set 4 - OKLCH Single-Accent Minimal

Swiss restraint. One vivid accent on perceptually-even grays. Authored entirely in OKLCH.

```css
:root {
  --font-display: "Cabinet Grotesk", sans-serif; /* Fontshare */
  --font-body: "General Sans", sans-serif; /* Fontshare */
  --color-bg: oklch(0.99 0 0);
  --color-fg: oklch(0.22 0.01 250);
  --color-muted: oklch(0.55 0.01 250);
  --color-border: oklch(0.9 0.005 250);
  --color-accent: oklch(0.7 0.12 195); /* teal, far from indigo */
  --color-accent-fg: oklch(0.99 0 0);
  --radius: 0.375rem;
}
.dark {
  --color-bg: oklch(0.16 0.01 250);
  --color-fg: oklch(0.96 0 0);
  --color-border: oklch(0.3 0.01 250);
}
```

Signature move: strict grid, one teal accent used only on links/CTAs/focus, generous negative space, everything else perceptually-even grays. Swap accent hue by changing one number (H): orange `oklch(0.70 0.19 40)`, grass `oklch(0.65 0.14 145)`, crimson `oklch(0.64 0.22 0.6)`.

### Radix step-9 reference (solid accents)

Teal `#12A594`, Jade `#29A383`, Amber `#FFC53D`, Crimson `#E93D82`, Grass `#46A758`, Bronze `#A18072`. Use step 9 as the pure solid; override it to inject a brand color. Iris (`#5B5BD6`) is in the indigo/violet band — avoid it as a default accent (see [[web/frontend/color]]).

### Shared motion tokens (all sets)

Motion is orthogonal to palette; reuse one scale across every set. ease-out under 300ms is the default; animate transform and opacity only.

```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-sheet: 500ms;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}
```

Neo-brutalist exception: snappier, near-instant transitions (or none) suit the hard-edged aesthetic; skip smooth easing there.
