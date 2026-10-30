---
kind: knowledge
when-and-why-to-read: When you are considering animation tied to scroll position (a pinned section whose steps advance as you scroll, a heading that wipes in, a reading-progress line, a pinned image beside scrolling figures), this knowledge should be read because the default is none, at most one such pattern earns a place on a page, and each must leave a complete static page for reduced motion, small screens, browsers without support and script failures.
short-form: "Scroll-linked animation: none by default; at most one pattern per page, on structure never body text; finished layout in base CSS, the animation only inside @supports (animation-timeline) and reduced-motion/min-width queries; linear timing; four recipes (pinned steps, headline wipe, progress line, pinned two-pane); fallback is a reveal-once, never a scroll listener."
rationale: >-
  Adapted from Hallmark's scroll-choreography reference (github.com/Nutlope/hallmark, MIT). Durations, easings, the one-reveal-per-page rule and the motion bans (parallax, cursor followers) live in [[web/frontend/visual-craft]]; the section compositions these patterns sit in live in [[web/frontend/marketing-pages]]. This document owns scroll-linked animation only.
---

# Scroll-linked animation

The default is none. A page's normal motion is a single reveal-once as content enters: its timing is in [[web/frontend/visual-craft]] and its recipe in [[web/frontend/states-and-interactions]]. A scroll-linked pattern, where animation progress follows scroll position, is an exception: used once, on a structural element, when the content has a real sequence worth pinning or scrubbing through.

## Limits

- **One pattern per page.** Two scroll-linked behaviours compete for the same attention.
- **Never on body text.** Animate structure: a pinned section, one display heading, a 2px progress line, figures. Prose never moves under the reader.
- **The hero's load animation stays as it is.** A scroll-linked pattern never replaces it, and no element carries both.
- **The finished layout is the base CSS.** All animation lives inside `@supports (animation-timeline: view())` (or `scroll()`) and `@media (prefers-reduced-motion: no-preference) and (min-width: 40rem)`. Reduced motion, small screens and browsers without support all get the complete, static page.
- **Declare `animation-timeline` and `animation-range` after the `animation` shorthand;** the shorthand resets them.
- **Use `linear` timing.** Scrubbing maps scroll distance to progress one to one; an easing curve makes the page drift away from the scroll position.
- It counts toward the page's limit of three kinds of motion (for example a reveal, a hover change and one loop), set out in [[web/frontend/visual-craft]].

## 1. Pinned steps

A section stays pinned while its steps brighten one by one. The tall outer section owns a named view timeline and the steps read from it in slices; elements inside a stuck pane cannot drive their own `view()` timeline because they are not moving.

```html
<section class="chapter">
  <div class="chapter__pin">
    <h2>How it works</h2>
    <ol class="chapter__steps"><li>…</li><li>…</li><li>…</li></ol>
  </div>
</section>
```

```css
.chapter { min-height: 280vh; }  /* the extra height is how long the section stays pinned */
.chapter__pin { position: sticky; top: calc(var(--nav-height, 0px) + 40px); }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .chapter { view-timeline: --chapter block; }
    .chapter__steps li { animation: chapter-step linear both; animation-timeline: --chapter; }
    .chapter__steps li:nth-child(1) { animation-range: contain 5% contain 30%; }
    .chapter__steps li:nth-child(2) { animation-range: contain 30% contain 55%; }
    .chapter__steps li:nth-child(3) { animation-range: contain 55% contain 80%; }
    @keyframes chapter-step { from { opacity: 0.2; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  }
}
```

## 2. Headline wipe

One large mid-page heading (a single statement sentence set big) is revealed left to right as it scrolls into view. Never the hero `h1`, whose entrance is the load animation. One element per page.

```css
.statement__head { /* base: fully visible */ }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .statement__head {
      animation: head-wipe linear both;
      animation-timeline: view();
      animation-range: entry 20% cover 45%;
    }
    @keyframes head-wipe {
      from { clip-path: inset(0 100% 0 0); transform: translateX(-0.25em); }
      to   { clip-path: inset(0 0 0 0); transform: none; }
    }
  }
}
```

## 3. Reading-progress line

A 2px vertical line at the page edge fills as the reader scrolls, instead of a thick bar across the top. Hidden under 40rem, where it would eat the phone's gutter.

```css
.progress { position: fixed; inset-block: 0; left: max(1rem, 2vw); width: 2px; background: var(--border); }
.progress::after { content: ""; position: absolute; inset: 0; background: var(--accent);
  transform-origin: top; transform: scaleY(0); }
@media (max-width: 40rem) { .progress { display: none; } }
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .progress::after { animation: progress-grow linear both; animation-timeline: scroll(root); }
    @keyframes progress-grow { to { transform: scaleY(1); } }
  }
}
```

The `::after` starts at `scaleY(0)`, so without support it shows only the empty track; if that bothers you, hide `.progress` unless `@supports (animation-timeline: scroll())`.

## 4. Pinned two-pane

A split section where one side (text, or one image) stays pinned while figures scroll past on the other.

- Layout: `display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 32px`.
- The pinned side: `position: sticky; top: calc(var(--nav-height, 0px) + 40px); align-self: start;` with a `z-index` below the sticky nav, so it docks under the nav rather than sliding beneath it.
- The scrolling side: a grid of figures 64px apart, each at 16:10 and 440px tall or more.
- Under 60rem: one column, and the pinned side becomes `position: static`.

The animation adds only a fade on the scrolling figures, which move and so can use their own `view()` timeline:

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .pane-scroll figure { animation: fig-in linear both; animation-timeline: view();
      animation-range: entry 0% entry 60%; }
    @keyframes fig-in { from { opacity: 0.3; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  }
}
```

## Fallback when the browser lacks support

When script runs but `animation-timeline` is unsupported, the only fallback is the ordinary reveal-once, never a scroll listener or a scrubbing polyfill:

```html
<script>
  document.documentElement.classList.add('js');
  if (!CSS.supports('animation-timeline: view()')) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-seen'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -20%' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  }
</script>
```

Transition `[data-reveal]` to its end state over about 420ms with an ease-out curve, and hide `[data-reveal]` at rest only under the `.js` class the script adds, so a page whose script fails is never blank. Without script and without support, the static layout is already the finished page.
