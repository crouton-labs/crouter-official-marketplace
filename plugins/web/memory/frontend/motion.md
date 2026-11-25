---
kind: knowledge
when-and-why-to-read: When you are adding or reviewing any animation or transition — a press, hover, menu, dialog, list change, page entrance, icon swap or loop — this knowledge should be read because motion without a job, a guessed duration, the browser's default ease, `transition: all`, a keyframe on an interruptible control or a missing reduced-motion path is what makes an interface feel dead, laggy or generated.
short-form: "Motion: every movement has one of five functions (feedback, causality, orientation, value change, signs of life); a motion language from the product's concept; page defaults (at most three kinds of motion, transform and opacity, 120/220/420ms, exits at 60–75%, one reveal); duration roles and scaling rules; authored easing curves and springs; transitions for interactive state, keyframes for one-shot; one leading movement, origin follows cause, small amplitudes, short stagger; enter, exit, icon-swap and press recipes; a per-event catalogue; performance, will-change, reduced motion and WCAG; motion slop tells; per-platform tools; how to verify motion."
rationale: >-
  Adapted from better-design's motion reference (github.com/Moddingflow/better-design, MIT), the frontend-design-deslop motion reference (github.com/samber/cc-skills, MIT) and the animations and performance references of make-interfaces-feel-better (github.com/jakubkrehel/make-interfaces-feel-better, MIT), plus the motion section formerly in [[web/frontend/visual-craft]] (from Hallmark, github.com/Nutlope/hallmark, MIT), which sets the page defaults. better-design's interaction-kit files, its probe script and its contract fields are removed. This document owns motion; neighbours own the motion of individual controls and their recipes ([[web/frontend/states-and-interactions]]), scroll-linked animation ([[web/frontend/scroll-animation]]), signature effects ([[web/frontend/texture]]) and the polish review ([[web/frontend/interface-polish]]).
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

# Motion

A button that does not respond, a panel appearing without an origin, a silently replaced number, and a jumping list make causality hard to follow. Motion is part of the system alongside color and type, with character, tokens, hierarchy, and rules. The goal is **no dead moment and no unnecessary movement**.

Motion is a design layer, not a finishing sprinkle. Good motion communicates causality (this opened from that), spatial relationships (this slid in from the edge), and state changes; it makes a product feel fast and physical.

Bad motion is bounce on everything, fade-up on every section, scale-on-hover by reflex. The default for most UI is restraint.

The concrete values below come from production systems and from design engineers who ship motion (Emil Kowalski of Linear, author of Sonner and Vaul; Rauno Freiberg; Josh Comeau) and from Material, Carbon, and Apple. Treat the token blocks as copy-pasteable starting points.

## Five functions of motion

Every movement serves at least one named function. Without one, remove the movement.

| Function | Purpose | Example |
| --- | --- | --- |
| **Feedback** | Confirms input before the result arrives | Button compresses on pointerdown; toggle travels under the finger |
| **Causality** | Shows where an element came from or went | Menu expands from its trigger; removed row collapses and neighbors move |
| **Orientation** | Explains forward/back, deeper/higher, and overlay relationships | Forward and Back use opposite directions; a sheet returns to its edge |
| **Value change** | Makes the delta visible | Balance rolls to a new value; progress grows; reward travels to its counter |
| **Signs of life** | Shows real activity when no control is being pressed | A single pulse when connection status changes; a live chart updates |

Signs of life consume attention without responding to input, so use them rarely.

### The two questions before animating

Before adding any animation, answer: does it communicate something (causality, hierarchy, state, spatial origin), and how often will the user trigger it? Animation that communicates earns its time budget.

Animation on high-frequency or keyboard-initiated actions (a power user opening a menu 200 times a day) is friction; Raycast ships almost no animation and feels right because of it. The gate: animate meaningful, low-frequency transitions; do not animate frequent, utilitarian ones.

## Motion language from the concept

Use the same subject as the palette and typography ([[web/frontend/art-direction]]). Write one sentence about **how objects behave in the product's world**, then define physics, tempo, and a signature detail.

| Concept | Motion character | Signature detail |
| --- | --- | --- |
| Station departure board | Discrete, stepped, mechanical; no smooth zooming | Split-flap time digits |
| Cellar label | Slow, weighty, long deceleration; reveals rather than zooms | Embossing appears through light on hover |
| Cargo-ship computer | Dry, linear, sharply settled; grid-aligned service movements | Status characters appear for a real event |
| Pocket remote / physical button | Short travel, elastic return, immediate feedback | Key depresses and returns; activation follows the control's semantics without animation delay |
| Bakery chalkboard | Handcrafted but quick | A chalk underline draws on hover/focus |

Record the motion direction: character, tempo (fast/restrained/heavy), physics (curves/springs and overshoot), and one signature detail. In an existing system, find its tokens and live examples, describe them briefly, and inherit them.

Harmony means related parameters, not identical animations: one token set, consistent physics, and a consistent spatial model. An elastic button beside an unrelated linear modal can feel like two different products.

## Defaults: how much, which tools, which numbers

These are the defaults for a page. The sections after them give the wider ranges and the reasons; where a number there differs from one here, use this one unless the product's motion language (above) argues for the other.

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

## Scaling durations

Use a small role set. These are neutral starting values, not standards; a weighty or mechanical concept can change them.

| Role | Duration | Purpose |
| --- | --- | --- |
| `instant` | 0–50 ms | Press color, text selection, cursor |
| `press` | 60–100 ms down, 150–250 ms return | Touch/click feedback |
| `micro` | 100–150 ms | Hover, focus ring, state icon, checkbox |
| `small` | 150–220 ms | Tooltip, dropdown, toast, row expansion |
| `medium` | 220–320 ms | Dialog, sheet, drawer, tab content |
| `large` | 300–450 ms | Screen transition, shared element, layout rearrangement |
| `expressive` | 450–800 ms | Rare success/reward/onboarding/game events; never frequent actions |

| Easing | CSS curve or parameters | Use |
| --- | --- | --- |
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` | Movement/change within a screen |
| `enter` | `cubic-bezier(0, 0, 0, 1)` | Fast arrival, gentle settling |
| `exit` | `cubic-bezier(0.3, 0, 1, 1)` | Gentle departure, fast disappearance |
| `emphasized-enter` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Large entrances and forward transitions |
| `emphasized-exit` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Large element/screen exits |
| `linear` | `linear` | Progress, spinner rotation, continuous cycles, color |
| `spring` | stiffness/damping; damping ratio 0.7–1 | Gestures, drag, release, interruptible transitions |

Scaling rules:

- **Higher frequency means shorter duration.** Tabs, command palettes, and shortcuts used hundreds of times daily need brief or no animation. Expression belongs to rare events.
- **Greater distance/area means longer duration.** A full-screen movement can use large; an 8px shift can use micro. Do not assign one duration to everything.
- **Exits are roughly one-third shorter than entrances.** Do not hold users after their decision.
- **Overshoot/bounce** needs an object with implied mass, such as a pressed button, a held card, a switch thumb, or a reward. Controls released after a press get a small spring (≈1% scale overshoot, settled in ~450 ms) in every direction, even calm ones; text, modals, sheets, and page surfaces never bounce.
- Untuned `ease` and `transition: all 300ms` avoid a real decision. List properties and use tokens.

## Easing curves

Easing is what makes motion feel designed. Defaults:

- **ease-out for enter and most UI**: fast start, slow settle. It reads as a quick, responsive reaction to the user. This is the single most useful curve.
- **ease-in for exit only** when the element leaves the screen entirely; never for things the user is waiting on (it speeds up at the end and feels laggy).
- **ease-in-out for movement between two on-screen positions**.
- **linear** only for continuous loops (spinners, progress) and for opacity-only crossfades. The browser keyword curves are usually too weak. Prefer custom cubic-bezier curves for character. Useful authored curves: a strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, a strong ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`, and an iOS-like sheet curve `cubic-bezier(0.32, 0.72, 0, 1)`. Production-system curves worth knowing: Material standard `cubic-bezier(0.4, 0, 0.2, 1)`, decelerate `cubic-bezier(0, 0, 0.2, 1)`, accelerate `cubic-bezier(0.4, 0, 1, 1)`; Material 3 emphasized `cubic-bezier(0.2, 0, 0, 1)`; IBM Carbon standard `cubic-bezier(0.2, 0, 0.38, 0.9)`. Tools: easings.co and cubic-bezier.com to author and feel curves.

## Springs, physics and interruption

Springs often feel more natural than bezier curves because they model real physics: an element has mass and settles like a physical object, and an interrupted spring redirects smoothly from its current velocity. Comeau's observation is that it is hard to make a nice bezier and easy to make a nice spring.

- Springs are parameterized by stiffness/response and damping rather than duration. SwiftUI's defaults are a useful reference: default spring is roughly response 0.55 and damping fraction 0.825; a snappy interactive spring is much shorter.
- On the web, springs come from libraries (Framer Motion, React Spring) or, increasingly, from the CSS `linear()` timing function, which approximates a spring with many sampled points and can overshoot past 1 to create a settle.
- Use springs for direct-manipulation and physical surfaces (drag, sheets, drawers); use eased durations for discrete state changes (a fade, a color change).
- A discipline check from Comeau: if more than roughly a fifth of your transitions need bespoke timing functions, your tokens are wrong.

- Animations are **interruptible and retargetable** from the current value. Repeated input does not build a queue.
- Preserve gesture velocity: a released sheet/card continues with initial velocity rather than restarting from zero.
- Prefer springs for gesture-interruptible motion, with explicit damping/stiffness or bounce/duration; avoid overshoot if it is absent from the established language.
- Animation does not change the outcome. Cancellation returns to truthful state. The model updates immediately; its presentation animates.

## Interruptible Animations

Users change intent mid-interaction. If animations aren't interruptible, the interface feels broken.

### CSS Transitions vs. Keyframes

| | CSS Transitions | CSS Keyframe Animations |
| --- | --- | --- |
| **Behavior** | Interpolate toward latest state | Run on a fixed timeline |
| **Interruptible** | Yes — retargets mid-animation | No — restarts from beginning |
| **Use for** | Interactive state changes (hover, toggle, open/close) | Staged sequences that run once (enter animations, loading) |
| **Duration** | Fixed; retargets the value mid-flight, not the timeline | Fixed timeline, restarts from the beginning |

```css
/* Good — interruptible transition for a toggle */
.drawer {
  transform: translateX(-100%);
  transition: transform 200ms ease-out;
}
.drawer.open {
  transform: translateX(0);
}

/* Clicking again mid-animation smoothly reverses — no jank */
```

```css
/* Bad — keyframe animation for interactive element */
.drawer.open {
  animation: slideIn 200ms ease-out forwards;
}

/* Closing mid-animation snaps or restarts — feels broken */
```

**Rule:** Always prefer CSS transitions for interactive elements. Reserve keyframes for one-shot sequences.

## Choreography: one leading movement

- **One dominant movement per event.** Others have smaller amplitudes and start with it or slightly afterward.
- **Origin follows cause.** Popovers/menus grow from the trigger; sheets come from their anchored edge; details expand from the selected card.
- **Direction follows the spatial model.** Forward comes from the inline end, Back reverses it (mirrored for RTL); depth and hierarchy use consistent scaling/movement.
- **Small amplitudes.** Entrances use 4–24px and/or scale 0.95–0.98 plus opacity, not scale from zero or unexplained travel across the screen. Large travel needs a real destination.
- **Stagger:** 20–40ms between at most 5–8 animated items, total no longer than medium–large. Remaining items appear with the last animated item.
- **Continuity:** elements shared between states move between them instead of disappearing and being recreated.
- **Stable layout:** insertion, removal, expansion, and sorting move neighboring elements using FLIP or framework layout animation.
- **Input stays available.** The next screen is immediately interactive; an exit delays an entrance by no more than a couple of frames.

## Enter Animations: Split and Stagger

Use this pattern for infrequent staged entrances where sequence helps communicate hierarchy, such as the first load of a page hero, success state, or empty state. Break a large container into semantic chunks and animate each individually. Do not stagger routine interactions such as row hovers, keystrokes, or repeated tab changes.

### Step by Step

1. **Split** into logical groups (title, description, buttons)
2. **Stagger** with ~100ms delay between groups
3. **For titles**, consider splitting into individual words with ~80ms stagger
4. **Combine** `opacity`, `blur`, and `translateY` for the enter effect

### Code Example

```tsx
// Motion (Framer Motion) — staggered enter
function PageHeader() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
      >
        Welcome
      </motion.h1>

      <motion.p
        variants={{
          hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
      >
        A description of the page.
      </motion.p>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
      >
        <Button>Get started</Button>
      </motion.div>
    </motion.div>
  );
}
```

### CSS-Only Stagger

```css
.stagger-item {
  opacity: 0;
  transform: translateY(12px);
  filter: blur(4px);
  animation: fadeInUp 400ms ease-out forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 100ms; }
.stagger-item:nth-child(3) { animation-delay: 200ms; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

## Exit Animations

Exit animations should be softer and less attention-grabbing than enter animations. The user's focus is moving to the next thing — don't fight for attention.

### Subtle Exit (Recommended)

```tsx
// Small fixed translateY — indicates direction without drama
<motion.div
  exit={{
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeOut" },
  }}
>
  {content}
</motion.div>
```

### Full Exit (When Context Matters)

```tsx
// Slide fully out — use when spatial context is important
// (e.g., a card returning to a list, a drawer closing)
<motion.div
  exit={{
    opacity: 0,
    x: "-100%",
    transition: { duration: 0.2, ease: "easeOut" },
  }}
>
  {content}
</motion.div>
```

### Good vs. Bad

```css
/* Good — subtle exit */
.item-exit {
  opacity: 0;
  transform: translateY(-12px);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}

/* Bad — dramatic exit that steals focus */
.item-exit {
  opacity: 0;
  transform: translateY(-100%) scale(0.5);
  transition: all 400ms ease-out;
}

/* Sometimes correct — remove immediately when motion adds no context */
.item-exit {
  display: none;
}
```

**Key points:**
- Use a small fixed `translateY` (e.g., `-12px`) instead of the full container height
- Keep some directional movement to indicate where the element went
- Exit duration should be shorter than enter duration (150ms vs 300ms)
- Use a subtle exit when it preserves spatial context. Remove immediately when motion adds no information, the interaction repeats frequently, or reduced motion is requested.

## Scale, origin and masking

- **Never animate from scale(0)**. Start from about 0.9 to 0.97 so the element already has a shape and grows into place rather than materializing from nothing.
- **Transform-origin matters**. A popover or menu should scale from its trigger, not from its own center; wire the origin to the trigger position (Radix and Base UI expose a `--transform-origin` variable for this). Center-origin scaling on a corner-anchored menu is a tell.
- **Press feedback**: a subtle scale to 0.97 on `:active` reads as a physical press.
- **Blur to mask**: when crossfading between two states that do not line up, a small (~2px) blur during the transition hides the visual seam and reads as smooth.

## Contextual Icon Animations

When icons appear or disappear contextually (on hover, on state change), animate them with `opacity`, `scale`, and `blur` rather than just toggling visibility.

### Motion Example

This example uses the `motion` package. If the project instead has `framer-motion`, import the same APIs from `"framer-motion"`; never mix an installed package with the other package's import path.

```tsx
import { AnimatePresence, motion } from "motion/react";

function IconButton({ isActive, icon: Icon }) {
  return (
    <button>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={isActive ? "active" : "inactive"}
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```

### CSS Transition Approach (No Motion)

If the project doesn't use Motion (Framer Motion), keep both icons in the DOM and cross-fade them with CSS transitions. Because neither icon unmounts, both enter and exit animate smoothly.

The trick: one icon is absolutely positioned on top of the other. Toggling state cross-fades them — the entering icon scales up from `0.25` while the exiting icon scales down to `0.25`, both with opacity and blur.

```tsx
function IconButton({ isActive, ActiveIcon, InactiveIcon }) {
  return (
    <button>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "transition-[opacity,filter,scale] duration-300",
            "ease-[cubic-bezier(0.2,0,0,1)]",
            isActive
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]"
          )}
        >
          <ActiveIcon />
        </div>
        <div
          className={cn(
            "transition-[opacity,filter,scale] duration-300",
            "ease-[cubic-bezier(0.2,0,0,1)]",
            isActive
              ? "scale-[0.25] opacity-0 blur-[4px]"
              : "scale-100 opacity-100 blur-0"
          )}
        >
          <InactiveIcon />
        </div>
      </div>
    </button>
  );
}
```

The non-absolute icon (InactiveIcon) defines the layout size. The absolute icon (ActiveIcon) overlays it without affecting flow.

### Choosing Between Motion and CSS

| | Motion (Framer Motion) | CSS transitions (both icons in DOM) |
| --- | --- | --- |
| **Enter animation** | Yes | Yes |
| **Exit animation** | Yes (via `AnimatePresence`) | Yes (cross-fade — icon never unmounts) |
| **Spring physics** | Yes | No — use `cubic-bezier(0.2, 0, 0, 1)` as approximation |
| **When to use** | Project already uses `motion` or `framer-motion` | No motion dependency, or keeping bundle small |

**Rule:** Check the project's `package.json`. Import from `"motion/react"` when `motion` is installed, or from `"framer-motion"` when `framer-motion` is installed. If both exist, follow the imports already used by the component or its nearest peers. If neither is present, use the CSS cross-fade pattern — don't add a dependency just for icon transitions.

### When to Animate Icons

| Animate | Don't animate |
| --- | --- |
| Icons that appear on hover (action buttons) | Static navigation icons |
| State change icons (play → pause, like → liked) | Decorative icons |
| Icons in contextual toolbars | Icons that are always visible |
| Loading/success state indicators | Icon labels (text next to icon) |

**Important:** Always use exactly these values for contextual icon animations — do not deviate:
- `scale`: `0.25` → `1` (never use `0.5` or `0.6`)
- `opacity`: `0` → `1`
- `filter`: `"blur(4px)"` → `"blur(0px)"`
- `transition`: `{ type: "spring", duration: 0.3, bounce: 0 }` — **bounce must always be `0`**, never `0.1` or any other value

## Scale on Press

A subtle scale-down on click gives buttons tactile feedback. Always use `scale(0.96)`. Never use a value smaller than `0.95` — anything below feels exaggerated. Use CSS transitions for interruptibility — if the user releases mid-press, it should smoothly return.

Not every button needs this. Add a `static` prop to your button component that disables the scale effect when the motion would be distracting.

### CSS Example

```css
.button {
  transition-property: scale;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

.button:active {
  scale: 0.96;
}
```

### Tailwind Example

```tsx
<button className="transition-transform duration-150 ease-out active:scale-[0.96]">
  Click me
</button>
```

### Motion Example

```tsx
<motion.button whileTap={{ scale: 0.96 }}>
  Click me
</motion.button>
```

### Static Prop Pattern

Extract the scale class into a variable and conditionally apply it based on a `static` prop:

```tsx
const tapScale = "active:not-disabled:scale-[0.96]";

function Button({ static: isStatic, className, children, ...props }) {
  return (
    <button
      className={cn(
        "transition-transform duration-150 ease-out",
        !isStatic && tapScale,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Usage
<Button>Click me</Button>           {/* scales on press */}
<Button static>Submit</Button>       {/* no scale */}
```

## Skip Animation on Page Load

Use `initial={false}` on `AnimatePresence` to prevent enter animations from firing on first render. Elements that are already in their default state shouldn't animate in on page load — only on subsequent state changes.

### When It Works

```tsx
// Good — icon doesn't animate in on mount, only on state change
<AnimatePresence initial={false} mode="popLayout">
  <motion.span
    key={isActive ? "active" : "inactive"}
    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
  >
    <Icon />
  </motion.span>
</AnimatePresence>
```

Works well for: icon swaps, toggles, tabs, segmented controls — anything that has a default state on page load.

### When It Breaks

Don't use `initial={false}` when the component relies on its `initial` prop to set up a first-time enter animation, like a staggered page hero or a loading state. In those cases, removing the initial animation skips the entire entrance.

```tsx
// Bad — initial={false} would skip the staggered page enter entirely
<AnimatePresence initial={false}>
  <motion.div initial="hidden" animate="visible" variants={...}>
    ...
  </motion.div>
</AnimatePresence>
```

Verify the component still looks right on a full page refresh before applying this.

## Catalog: what moves and how

| Event | Motion | Mistake |
| --- | --- | --- |
| Button touch/click | Three layers together: (1) on pointer-down, compress by a constant ~4 px of perimeter (scale = 1 − 8 / (w + h), clamped 0.90–0.985) within 60–90 ms, with a fill step (darker on light fills, brighter on dark); (2) a soft bloom from the touch point; (3) on release, a spring back with ~16% overshoot of the travel (~450 ms). Hold the pressed state at least 90 ms so fast taps are seen; mirror it for Space/Enter. Activation follows its own semantics without waiting. | Feedback only on release; action waits for the animation; a lone 1–2 px nudge or a 0.97 scale that snaps back instantly (reads as dead); a second `transition` declaration that silently overrides the press |
| Hover, only with `hover: hover` | Micro background/underline/icon change on interactive targets; for expressive surfaces see the hover set in [[web/frontend/texture]] (edge brightens, arrow nudges, underline draws, halo ring) | Every card lifts and casts a shadow; noninteractive content implies an action |
| Focus-visible | Ring appears instant–micro without expanding from zero | Focus becomes temporarily invisible |
| Toggle/checkbox/radio | Thumb travels or checkmark draws at micro timing; value updates immediately | State is available only after animation |
| Tabs/segmented control | Selection indicator moves; content crossfades or shifts briefly in a meaningful direction | Indicator disappears and respawns |
| Dropdown/popover/tooltip | Scale 0.96→1 and opacity from trigger, small entrance, shorter exit. Tooltip delay about 300–500ms, without repeated delay between neighbors | Falling from the screen top; equal enter/exit timing |
| Dialog | Backdrop fade; panel scale 0.96→1 and opacity at medium timing; reverse faster | Unmotivated sideways flight |
| Sheet/drawer | Arrives from its edge at medium timing; gesture follows the finger and releases with velocity-preserving spring | A draggable-looking sheet cannot be swiped back |
| Screen navigation | Model-consistent push/pop at large timing; peer top-level tabs crossfade | Sliding between peer tabs; unrelated transition per screen |
| List insert/remove/reorder | New row expands/fades; removed row collapses; neighbors move | Row vanishes and everything below jumps |
| Accordion/section | Animate height via grid rows, interpolate-size, or animateContentSize; rotate chevron | Height and scroll position jump |
| Skeleton to content | Small crossfade without layout shift, independently as regions become ready | Whole-screen flash or sliding content that changes layout |
| Button pending | Micro crossfade between label and progress; preserve width | Resizing button or a 100ms spinner flash |
| Number/balance change | Small–medium roll using tabular numerals; brief delta where useful | Instant replacement or animation on every live-data tick |
| Result contributing to a total | Item travels to basket/counter; counter responds and updates | Item flies away but the total stays unchanged |
| Success | One short accent, such as a checkmark or Saved label | Confetti on every save |
| Validation error | Visible field error and text; optional single ±4–6px shake ≤300ms | Shake without explanation or shaking the whole form |
| Toast/status | Small entrance from its edge; pause auto-hide on hover/focus | Covers the primary action or removes an error before it can be read |
| Drag | Object follows immediately, with lift/shadow/scale 1.02; target highlights and neighbors make room | Object lags behind the finger |
| File drop zone | Micro border/background on dragenter; icon lifts 2–4px; dropped rows insert, previews crossfade, progress grows; rejection may shake the icon once with its reason | Flicker over children, no drag-over response, or dropped file disappears without feedback |
| Pull-to-refresh/overscroll | Follows the finger with the platform's elastic return | Custom physics conflict with the system |

## Life without noise

An interface feels alive through **responses**, not constant movement.

- Every interactive target responds to press and focus. User-caused state changes transition.
- Briefly mark new content, changed values, and status with reveal/pulse/highlight fading in about one second, with information beyond color.
- Ambient motion comes from the concept: at most one per screen, slow (period ≥2s), low amplitude, peripheral, away from reading text. Stop it when hidden, offscreen, or under reduced motion. Infinite CTA pulses, orbs, and shifting gradients are noise.
- An empty/waiting state may use one slow concept-derived motif, but still needs truthful status and a path to act.
- A concept-derived ambient detail can come from the optional effects in [[web/frontend/texture]] (live dither field, metal sheen, signal route); their budget and pause rules apply on top of this section.
- Sound/haptics can support mobile/game feedback through platform APIs and system settings. Use brief meaningful responses; do not vibrate on every scroll or hover.

## Motion Restraint

Motion is a budget, not a garnish:

- **No custom animation on high-frequency interactions.** Repeated interactions get instant feedback or a minimal `opacity` or `background-color` transition at ≤150ms.
- **Motion is never the only feedback channel.** Every animated state change also needs a static cue such as color, icon, or label.
- **Brief and precise beats prominent.** If a shorter, smaller animation communicates the same thing, use it.
- **Honor reduced-motion preferences.** Preserve the static cue and remove unnecessary movement.

```css
/* Good: high-frequency hover gets a minimal transition */
.row:hover {
  background-color: var(--surface-hover);
  transition: background-color 100ms ease-out;
}

/* Bad: every hover replays a full entrance */
.row:hover .row-icon {
  animation: bounceIn 500ms;
}
```

## Performance

Jank reads as malfunction.

- Prefer composited transform/opacity, and filter only over small areas. Use FLIP or framework layout animation for size/position/margins; use a pre-rendered layer and opacity for large shadows/blur.
- Frame budgets: 16.7ms at 60Hz, 8.3ms at 120Hz. Press feedback appears by the next frame.
- Apply will-change selectively during animation, not across the whole tree. Avoid dozens of infinite animations and animating every row during scrolling.
- Do not block the main thread with heavy rendering/parsing during transitions. Defer, split work, or show the appropriate skeleton.
- Check a weak device or 4–6× CPU throttling. Simplify movement when over budget; preserve feedback.

### Transition Only What Changes

Never use `transition: all` or Tailwind's `transition-all`. Always specify the exact properties that change. Tailwind's bare `transition` maps to a curated default list of colors, opacity, shadow, and transforms, not to `all`; still prefer naming exactly what changes.

#### Why

- `transition: all` forces the browser to watch every property for changes
- Causes unexpected transitions on properties you didn't intend to animate (colors, padding, shadows)
- Prevents browser optimizations

#### CSS Example

```css
/* Good — only transition what changes */
.button {
  transition-property: scale, background-color;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

/* Bad — transition everything */
.button {
  transition: all 150ms ease-out;
}
```

#### Tailwind

```tsx
// Good — explicit properties
<button className="transition-[scale,background-color] duration-150 ease-out">

// Bad — transition all
<button className="transition-all duration-150 ease-out">
```

#### Tailwind `transition-transform` Note

`transition-transform` in Tailwind maps to `transition-property: transform, translate, scale, rotate` — it covers all transform-related properties, not just `transform`. Use this when you're only animating transforms. For multiple non-transform properties, use the bracket syntax: `transition-[scale,opacity,filter]`.

### Use `will-change` Sparingly

`will-change` hints the browser to pre-promote an element to its own GPU compositing layer. Without it, the browser promotes the element only when the animation starts — that one-time layer promotion can cause a micro-stutter on the first frame.

This particularly helps when an element is changing `scale`, `rotation`, or moving around with `transform`. For other properties, it doesn't help much — the browser can't composite them on the GPU anyway.

#### Rules

```css
/* Good — specific property that benefits from GPU compositing */
.animated-card {
  will-change: transform;
}

/* Good — multiple compositor-friendly properties */
.animated-card {
  will-change: transform, opacity;
}

/* Bad — never use will-change: all */
.animated-card {
  will-change: all;
}

/* Bad — properties that can't be GPU-composited anyway */
.animated-card {
  will-change: background-color, padding;
}
```

#### Useful Properties

| Property | GPU-compositable | Worth using `will-change` |
| --- | --- | --- |
| `transform` | Yes | Yes |
| `opacity` | Yes | Yes |
| `filter` (blur, brightness) | Yes | Yes |
| `clip-path` | Newer Chromium only | Rarely; not reliable cross-browser |
| `top`, `left`, `width`, `height` | No | No |
| `background`, `border`, `color` | No | No |

#### When to Skip

Modern browsers are already good at optimizing on their own. Only add `will-change` when you notice first-frame stutter — Safari in particular benefits from it. Don't add it preemptively to every animated element; each extra compositing layer costs memory.

## Accessibility and settings

- **Reduced motion preserves feedback.** Under prefers-reduced-motion, Android Remove animations, iOS Reduce Motion, or disabled Windows animation effects, remove movement, scale, parallax, zoom, and rotation. Use crossfades or instant changes; retain press color/brightness, visible state, and progress.
- Avoid large full-screen zoom, parallax, scroll-jacking, and spatial rotation as vestibular triggers; remove them under reduced motion.
- **WCAG 2.3.1 (A):** no more than three flashes per second unless below applicable thresholds.
- **WCAG 2.2.2 (A):** automatic motion/blinking/scrolling longer than 5 seconds alongside other content needs pause/stop/hide unless essential. Infinite ambient motion is a common risk.
- **WCAG 2.3.3 (AAA):** interaction-triggered animation can be disabled.
- Important state must remain visible in the final frame and accessible through text, roles, or live regions; animation cannot be its only carrier.
- Do not move text being read or targets being pressed. Avoid typewriter effects on text that must be read immediately.

Honor `prefers-reduced-motion`. Motion can trigger vestibular discomfort; large movement, parallax, and scaling are the risky kinds, while opacity fades are generally safe.

- The robust pattern inverts the default: define no transition by default and enable motion inside `@media (prefers-reduced-motion: no-preference)`, or, when reduced motion is requested, swap movement for an opacity-only fade rather than removing feedback entirely.
- Avoid the blunt global override that zeroes all animation durations; it can break JS-driven springs and removes safe fades along with the harmful motion.
- Gate hover-triggered animation behind `@media (hover: hover)` so touch devices do not fire phantom hover states.

## Motion slop: patterns and replacements

The full list of generated-design tells is in [[web/frontend/ai-tells]].

| Pattern | Replacement |
| --- | --- |
| `scroll-reveal-all` — fade-up/AOS on every section | Reveal only when it explains appearance; initially visible content does not need an entrance |
| `intro-cascade` — 1–2 seconds before the first click | Make the first useful screen immediately interactive; loading choreography at most large, once |
| `bounce-everything` — identical overshoot everywhere | Concept-derived physics; only objects with implied mass can spring |
| `attention-everywhere` — bouncing buttons, wiggling icons, floating badges | One cue at the right time; other elements stay still until interaction |
| `pulsing-status-dot` — motion despite unchanged status | Static status stays still; one pulse on change; continuous movement only for real recording/transfer/activity |
| Every card lifts and shadows on hover | Feedback matches actual interactivity |
| Infinite CTA pulse/glow, gradients, orbs, particles | Concept-derived ambient detail or stillness |
| Parallax, scroll-jacking, sticky scenes for spectacle | Native scrolling; scroll-driven motion only for meaningful relationships or reading progress |
| Typewriter on ready text or fake thinking delay | Real streaming data and truthful status |
| `transition: all 0.3s ease` everywhere | Listed properties and role-based tokens |
| A spinner flashes for 150ms | Loading-indicator timing in [[web/frontend/states-and-interactions]] |
| Animation decorates emptiness | A named function from Five functions of motion |

- Bounce or elastic easing on ordinary UI (reserve bounce for genuinely celebratory moments).
- Animate-everything: every element has a transition by reflex.
- Identical fade-in-up on every section (same opacity plus translateY plus duration plus easing across four or more blocks).
- Image-scale-on-hover applied to every image by default.
- Parallax overuse and scroll-jacking (hijacking the scroll speed or direction).
- Missing exit animations (things appear smoothly but vanish instantly).
- Animating layout properties (width/height/top/left) instead of transform.
- Default browser easing everywhere; wrong transform-origin on menus and popovers.
- Animating high-frequency actions.
- A decorative pulse on a status dot or badge that is not actually changing state — animate only when the underlying data changes.
- A fake blinking cursor on non-editable hero copy, dressing static text up as a live terminal. Let real inputs own the caret.
- An auto-scrolling marquee or logo ticker that demands attention and hides content behind its own motion. Let people read at their own pace; if a strip of logos needs to fit, wrap or paginate it instead.

## Platform implementation

- **Web:** CSS transitions for states, keyframes for cycles, Web Animations API for programmatic or interruptible motion, and supported View Transitions for screens/shared elements with fallback. Include prefers-reduced-motion and hover capability queries. Animate height through grid-template-rows or supported interpolate-size. Scroll-driven animation needs fallback and reduced-motion handling. Avoid a new library when existing tools suffice.
- **Svelte/React/Vue:** use the stack's existing mechanisms, such as Svelte transition/animate:flip or an already installed library's layout animation.
- **Android/Compose:** animate*AsState, updateTransition, AnimatedVisibility, AnimatedContent, animateContentSize, spring. Read animation values in graphicsLayer lambdas to avoid recomposition. Respect animator duration scale and system Predictive Back.
- **iOS/SwiftUI:** withAnimation, animation(_:value:), springs, matchedGeometryEffect, and the accessibilityReduceMotion environment value.
- **Desktop:** do not duplicate OS window animations. Respect system settings, exposed in embedded web through prefers-reduced-motion.
- **Games/Unity:** hit-stop, squash/stretch, camera effects, particles, and sound can belong to the language. Preserve HUD readability and immediate input; provide reduced shake/flashing. Use the project's existing tween system.

## Verify motion

Code and still screenshots do not prove motion quality.

1. Record video or frames of key transitions. Review slowly: DevTools at 10–25%, Android animator duration scale 5×, or Simulator Slow Animations.
2. Check origins/directions, jerks, layout jumps, one dominant movement, and abrupt state cuts.
3. **Repeated-input test:** rapid clicks, open-close-open, swipe, and cancellation midway through a transition must not queue, stick, or report false outcomes.
4. **Dead moments:** walk the primary flow and identify input with no visible response within roughly 100ms or state changes that abruptly cut.
5. **Noise:** list motion while idle and its function and pause/stop behavior.
6. With reduced motion/system animations off, preserve functionality, feedback, and state without spatial movement or parallax.
7. Capture traces/frame timing under a weak-device profile; check long frames.
8. Confirm shared tokens/physics and a signature detail that supports the task.

Record a motion check: scenarios, review speed, dead moments/noise, and corrections. Still screenshots alone are not motion evidence.

## Inspiration

Transpose the named principle, not a clone. Inspiration only.

- **Linear**: motion exists to prove the product is fast; transitions are short and purposeful. Transpose sub-200ms, communicative-only motion.
- **Stripe**: restrained, smooth transitions that never delay the task. Transpose calm enter/exit with custom ease-out.
- **Vercel**: a hero build-log animation that is itself a product demo. Transpose motion-as-demonstration of the product.
- **Family (iOS)**: spring-based tray with text that morphs between states. Transpose physical springs for direct-manipulation surfaces.
- **Vaul and Sonner** (Emil Kowalski): the iOS-curve drawer at ~500ms and the deliberately elegant, slightly slower toast. Transpose the edge-origin sheet curve and the dismissal threshold.
- **Raycast**: almost no animation on frequent actions. Transpose the restraint on high-frequency interactions.
- Reference reading to encode tasteful defaults: animations.dev (Emil Kowalski), joshwcomeau.com (springs, reduced motion), rauno.me/craft (interaction details).
