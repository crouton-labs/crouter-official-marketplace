---
kind: knowledge
when-and-why-to-read: When debugging frontend issues across component hierarchy, state, or rendering — or when a UI edit you made isn't showing up in the browser — this knowledge should be read because a frontend-specific diagnosis loop narrows root causes faster and avoids compounding the bug with speculative CSS, state, or rendering fixes.
short-form: Frontend diagnosis loop — component hierarchy, style overrides, layout, state, and the edit-not-showing-up checks.
---

# Frontend debugging

## Component Hierarchy

Check: all imports, parent wrappers, prop passing, conditional rendering, context providers.

## Styles

1. DevTools computed styles — find overrides
2. CSS specificity conflicts
3. Import order (later wins)
4. shadcn/component library defaults being overridden
5. className merging issues with `cn()`

## Layout

Start from outermost container, check each level's display mode. Common culprits: `overflow: hidden`, flex-shrink/grow, absolute without relative parent, `height: 100%` without parent height.

## State

React DevTools for props/state inspection. Watch for stale closures, batching surprises, derived state drift.

## User-Assisted

Ask for: browser/version, console errors, Network tab failures, screenshot with DevTools inspector open on problem element.

## Hydration (SSR)

Server and client must match. Check: dates/times, random values, browser-only APIs (`window`, `localStorage`).

## "My edit didn't render" — five distinct causes; diagnose in this order

These get misdiagnosed as each other constantly. "It's a cache issue" is both a real cause and the most common *wrong* guess — check it last, not first.

1. **The edit was silently reverted.** Some test runners re-sync file caches and overwrite your change with pre-edit content (`git diff` shows it gone after `vitest run`). Commit immediately after edits, before running any build/test.
2. **The CSS never compiled.** Class name present in HTML, zero matching rules in any stylesheet. Common trigger: Tailwind v3 syntax on a v4 project (`@tailwind` directives, `bg-opacity-*`) — compiles silently, renders unstyled. Verify the rule exists in compiled output, not just the class in markup.
3. **The rule compiled but loses the cascade.** DevTools computed styles on the element; find which rule wins and where it comes from (specificity, import order, inline style, component-library default).
4. **You edited a file the render path doesn't consume.** Grep across the codebase for what actually reads the config/component you changed — never assume from the filename, and never work from memory of files you wrote earlier in the session.
5. **A genuinely stale cache/build.** Only after 1–4 are excluded. Restart the dev server / rebuild rather than escalating cache-busting rituals.

## z-index: never escalate, climb

`z-index: 9999` on the child is the `!important` of stacking — if it "doesn't work," the problem is an ancestor. Walk up the tree looking for stacking-context creators (`z-index` on a positioned element, `opacity < 1`, `transform`, `filter`, `will-change`) and `overflow: hidden` clippers (clips children regardless of z-index). Fix at the ancestor, with `isolation: isolate`, or with a portal — never by raising the child's number.

## Responsive

Author mobile-first; retrofitting ("make it responsive" on a desktop-first tree) reliably makes it worse. Find the overflowing element with `* { outline: 1px solid red; }`. Usual suspects: fixed widths (`w-[600px]`), images without `max-w-full`, grids with fixed column counts, breakpoints that stop at 375px, `100vh` on iOS Safari (address bar changes it mid-scroll).

## Streaming & animation jank

Don't mutate the DOM per token/event — buffer and flush once per `requestAnimationFrame`; keep DOM structure stable during the stream; defer markdown/highlight to stream end. Animate `transform`/`opacity` (compositor) only, never `left`/`top`/`width`/`height` (layout reflow every frame). Scroll-jump during streaming is usually *compound* — an unbatched update racing an auto-scroll observer plus a defeated memo — so fixing one cause and re-testing is how you confirm there's another.

## Non-default states

Generated UI reliably covers only the default state. Explicitly implement and verify: hover, focus, active, disabled, loading, error, empty. Modal checklist: focus returns to trigger on close, Escape bound on `document`, scroll-lock (`overflow: hidden` does nothing on iOS Safari), no `transform` on any ancestor of `position: fixed`.

## Verify rendered, assert state

Never claim a UI change works from source code — verify against the rendered result. When you do, assert element *state/value/visibility* (or the store's value), not mere existence: an error page also "has a DOM", and markup can say `$99` while `display:none` hides it.
