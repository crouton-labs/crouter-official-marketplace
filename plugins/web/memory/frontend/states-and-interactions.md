---
kind: knowledge
when-and-why-to-read: When you are building or reviewing anything a person clicks, types into, or waits on — buttons, links, form fields, modals, menus, tooltips, toasts, tabs, loading and empty screens — on a marketing page or in an app, this knowledge should be read because a control missing one of its states, a focus ring that shifts the layout, or a form that shows success when nothing was sent is what makes a built page feel broken or generated.
short-form: "Every control has eight states; focus rings are outlines that never move the layout; 44px hit targets; one filled primary per page; fields keep a constant border and a reserved helper line; native dialog, popover and select; undo over confirm; skeletons and one-line empty states; small motion recipes per control; code for a segmented choice, rail, tab switcher, script-free reveal, pausable loop, endpoint-less form and skip link."
rationale: >-
  Adapted from Hallmark's patterns, interaction-and-states and microinteractions references and the controls and inputs rules of its craft reference (github.com/Nutlope/hallmark, MIT), plus the empty-state cases previously in [[web/frontend/mockups]]. Durations, easings, what may animate, one reveal per page and the motion bans are owned by [[web/frontend/visual-craft]]; colour contrast numbers by [[web/frontend/visual-craft]]; scroll-linked animation by [[web/frontend/scroll-animation]]; small-screen behaviour by [[web/frontend/responsive]]; nav and page structure by [[web/frontend/marketing-pages]]; the rule against invented facts by [[web/frontend/visual-design]]. This document owns how every control and stateful screen behaves, on marketing pages and in apps alike.
---

# States and interactions

This applies to marketing pages and to apps, dashboards and tools. It owns the states of every control, focus, hit targets, sizing, forms, overlays, feedback (toasts, undo, loading, empty, error), the motion each control uses, and short code recipes. The general motion rules (the duration scale, the three easings, animating only `transform` and `opacity`, one reveal per page, no parallax or custom cursors) live in [[web/frontend/visual-craft]]; this document only applies them to controls. Contrast requirements are in [[web/frontend/visual-craft]]; how controls change on a phone is in [[web/frontend/responsive]].

The code below names colours through a few custom properties; map them to your own tokens: `--bg` (background colour), `--bg-2` (a second background shade), `--text` (text colour), `--text-2` (a step quieter or a step darker, for hover), `--muted` (quiet text and a field's edge, 3:1 against the background), `--line` (a hairline), `--focus` (the focus ring colour, chosen in [[web/frontend/visual-craft]]) and `--error`. Durations and easings come from [[web/frontend/visual-craft]], which sets three durations (the short one for a press, a tick or a colour change; the medium one for hover, tooltips and menus; the long one for modals, drawers, accordions and reveals) and three easings (arrival, exit, toggle), with exits at 60 to 75% of the arrival's time. Below, "short", "medium" and "long" mean those three, and the code writes them out as plain CSS values.

## The eight states

| State | When | Treatment |
| --- | --- | --- |
| Default | At rest | Base styling |
| Hover | Pointer over, inside `@media (hover: hover)` | One signal that raises contrast: a colour step, a border step, or a 1px lift on a control that keeps its colour |
| Focus | Keyboard or programmatic focus | The focus ring, shown at once |
| Active | During the press | A 1px drop or one step darker, released on pointer up |
| Disabled | Not interactive | Three signals together: `opacity: 0.55`, `cursor: not-allowed`, and the native `disabled` attribute, or `aria-disabled="true"` where the control must stay focusable |
| Loading | Processing | Inline progress; the label stays readable and the width does not jump |
| Error | Failed | The error colour on the border, a message, `aria-invalid`; never colour alone |
| Success | Completed | The result itself, from the server's answer; an icon from the page's own set at most; no toast; no success state where no request was made |

An element missing one of these is not finished. Every hover signal has a focus equivalent; nothing is reachable by hover only. A disabled control near where the user is looking says why it is disabled.

## Focus rings

`outline: 2px solid var(--focus); outline-offset: 2px`, on `:focus-visible` so it shows for the keyboard and not on every click. On inputs the offset is negative (inset) so the ring never collides with a neighbouring field. Draw it with `outline`, never with a border change, so it never moves the layout. The ring has 3:1 contrast against both the element and the background, and it appears at once (the colour and the no-animation rule are in [[web/frontend/visual-craft]]). Never `outline: none` without a replacement. Where a control sits on a dark band, set `--focus` for that band so the ring still shows.

## Hit targets and sizes

- **Hit target:** 44 × 44 CSS px for anything a finger can reach; 48px on coarse pointers (`@media (pointer: coarse)`). Grow a small control's target without changing how it looks:

```css
.icon-btn { position: relative; }
.icon-btn::before { content: ""; position: absolute; inset: -12px; }
```

- **Button height:** 44 to 52px on a marketing page; 32 to 40px in app UI, keeping the 44px hit target. Two button sizes at most, at least 6px apart.
- **An input matches the height of the button beside it.** Vertical padding is `(height − line-height) / 2`.
- **Hierarchy:** one filled primary button per page, and a dialog counts as its own page. Secondary actions are outlined or plain text, never louder than the primary; nav actions are quieter than the hero's. Delete takes a secondary style unless deleting is the page's one action.
- Every `<button>` carries an explicit `type`.

### Button

```css
.btn { display: inline-flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 24px; border: 1px solid var(--text); border-radius: 999px; background: var(--text); color: var(--bg); font-weight: 500; line-height: 1; white-space: nowrap; text-decoration: none; cursor: pointer; transition: background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 120ms cubic-bezier(0.16, 1, 0.3, 1); }
@media (hover: hover) { .btn:hover { background: var(--text-2); } }
.btn:active { transform: translateY(1px); }
.btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
.btn:disabled, .btn[aria-disabled="true"] { opacity: 0.55; cursor: not-allowed; transform: none; }
.btn[aria-busy="true"] { cursor: progress; }
.btn--quiet { background: transparent; color: var(--text); border-color: var(--line); }
@media (hover: hover) { .btn--quiet:hover { background: var(--bg-2); } }
@media (prefers-reduced-motion: reduce) { .btn { transition: background-color 220ms linear; } }
```

The radius is whatever your system uses; 999px is only an example. A button in its loading state shows a small spinner in place of or beside the label, keeps its width, and sets `aria-busy="true"`.

## Forms

- A visible label above every field, 4 to 8px above it. Never a placeholder as the label, and never a floating label: it starts life as a placeholder.
- A placeholder shows a format (`01 Jan 2026`), never an instruction.
- Every field has a `name`, the right `type` and `inputmode`, an `autocomplete` value, and a `<label>` (or `aria-label` where a visible label truly cannot fit).
- Inputs are at least 16px text on phones, or iOS zooms the page on focus.
- Never block paste.
- Required fields carry `aria-required="true"` and a visible word, never colour alone.
- Validate on blur once the field has been touched, then on every input; never on the first keystroke.
- An error says what broke, why, and what to do, in one sentence where it can, with no "Oops" and no exclamation mark. Tie it to the field with `aria-describedby` and set `aria-invalid="true"`.
- Submit stays enabled until the request starts, is disabled only while it is in flight, and a failed submit moves focus to the first invalid field.
- A one-field form (an email sign-up) is about 20rem wide. The input and the button are two separate controls, never one shared border.
- A form with no endpoint says plainly that nothing was sent and never shows success. Recipe below; the rule itself is in [[web/frontend/visual-design]].

### The field

This applies to every text input, textarea, select and combobox.

**The border never changes width.** State moves to `background-color`, `border-color`, `outline` or `box-shadow`, never `border-width`. A transparent outline is reserved at rest so the ring appears without shifting anything.

```css
.input { min-height: 48px; padding: 0 16px; border: 1px solid var(--muted); background: var(--bg); color: var(--text); outline: 2px solid transparent; outline-offset: -3px; transition: background-color 220ms cubic-bezier(0.16, 1, 0.3, 1); }
@media (hover: hover) { .input:hover { background: var(--bg-2); } }
.input:focus-visible { outline-color: var(--focus); }
.input[aria-invalid="true"] { border-color: var(--error); }
.input:disabled { opacity: 0.55; cursor: not-allowed; }
.help { min-height: 1lh; margin-top: 4px; font-size: 0.875rem; color: var(--muted); }
```

| State | Treatment |
| --- | --- |
| Default | 1px border in `--muted` (a field's edge needs 3:1 against the background, which a hairline never has), background colour, placeholder in `--muted` |
| Hover | Second background shade; border unchanged |
| Focus | The ring; the border may deepen one step at the same width |
| Filled | As default; the value carries the state |
| Disabled | The three disabled signals; the placeholder dims one step |
| Error | Error-coloured border, the message in the helper line, an error icon from the page's set in the right-edge slot |
| Success | Only after a real check returned; a check icon from the page's set; clears when the user edits |
| Loading | A small spinner in the right-edge slot; the field stays editable and submit waits |

- **Right-edge slot:** reserve about 24px inside the field for a clear button, an error icon or a spinner, so nothing reflows when one appears.
- **Helper line:** about 4px below the field, at the label's size, quieter, in a line that reserves `min-height: 1lh` whether or not it has text. The error replaces the helper in that line; it never adds a second line.
- Never transition `border-width`, `padding` or `height`. Never animate the ring.

### Other controls

- **Textarea:** `resize: vertical; min-height: 6rem`.
- **Select:** the native `<select>`, with a custom chevron drawn on a wrapper. Build a fully custom select only when it keeps the native keyboard and screen-reader behaviour. The same holds for date and time inputs: start native.
- **Checkbox and radio:** native; `accent-color` is the cheap correct version; style by state in CSS, never toggle by script. A switch is a checkbox (`role="switch"` if you like) with the same contract.
- **Range:** the thumb takes focus and has a 44px hit target.
- **File input:** a styled `<label>` for the visually hidden input is the visible surface.
- **Combobox:** the listbox sits below the field without pushing content down; `aria-expanded` mirrors whether it is open; arrow keys cycle options, Enter selects, Escape closes.

## Modals and overlays

- Use a native `<dialog>` opened with `showModal()`: focus trapping, Escape to close and `::backdrop` come for free.
- Once you add your own positioning it can snap to a corner, so pin it: `position: fixed; inset: 0; margin: auto; height: fit-content; max-height: min(80dvh, 40rem)`. A non-dialog overlay centres with `display: grid; place-items: center` on a fixed container.
- Set `inert` on the page behind. Close on Escape, on a backdrop click, and with a visible close control. First focus goes to the first interactive element, not the close button.
- A dialog counts as its own page: one filled primary inside it.
- Motion: the backdrop fades and the panel scales from 0.96 to 1 over the long duration with the arrival easing; it closes at about 65% of that with the exit easing. Under reduced motion, a 150ms crossfade.

## Popovers, menus and tooltips

- Use the Popover API (`popover` attribute) for light-dismiss, Escape and stacking. Position with CSS anchor positioning where the browser has it, otherwise `position: fixed` from `getBoundingClientRect()`. Flip when within 16px of the viewport edge. Never place one inside an `overflow: hidden` ancestor that would clip it.
- **Menu:** opens over the medium duration with the arrival easing, closes at 65% of that with the exit easing; items may stagger 30ms apart when there are eight or fewer.
- **Tooltip:** wait 800 to 1000ms on hover, 0ms on focus; it fades in over the short duration. It stays while the pointer moves onto it and closes on Escape (WCAG 1.4.13). A tooltip never holds the only copy of information the user needs.

## Toasts

- **No toast when the user can see the result.** A saved row that shows its new value needs nothing more. Toasts are for failures and for effects the page cannot show (an email sent, a file exported elsewhere).
- One corner. The newest toast pushes the stack in one direction; nothing else on the page moves.
- In over the long duration, 4 to 6 seconds on screen, out at 65% of the arrival time. Auto-dismiss pauses on hover and focus.
- An error toast carries one action (*Try again*) and stays until the user acts on it or closes it.
- The toast uses the button's verb (*Publish* → *Published*), per the naming rule in [[web/frontend/visual-design]].

## Undo over confirm

Reversible actions (archive, remove from a list, mark done, delete something that can be restored) run at once and offer Undo for 5 to 10 seconds. Irreversible ones (deleting an account, dropping a table) keep a confirmation, and the user types the name of the thing being destroyed. A plain "Are you sure?" on reversible actions trains people to click through it.

### Optimistic updates

Update the interface at once, send the request behind it, say nothing on success, and on failure roll the change back over the medium duration and raise an error toast with *Try again* that stays until acted on.

```js
const prev = item.done;
item.done = !prev; render();
try { await api.update(item); }
catch { item.done = prev; render(); toast({ tone: 'error', message: 'Could not save.', action: { label: 'Try again', run: retry } }); }
```

## Loading, empty and error screens

For every list, table, chart, panel or container that holds data, build what renders when the data is not there yet. The surrounding shell (header, nav, filters) always renders, so people know where they are.

- **Loading:** a skeleton where the content's shape is known (lists, cards, tables): blocks at the exact height, column count and rhythm of the real content. A spinner only inside a button, or beside a label, and never centred on an empty page unless the whole route is blocked. Show a spinner only after 150 to 300ms, keep it at least 300ms once shown so it does not flash, and add the word "Loading…" past 2 seconds.
- **First use, nothing set up:** one line naming what is empty, one on why it matters, and one action ("Connect a source"). No pretend data, no rows of examples a user might take for real or try to click. Never a bare "No results".
- **Empty after a filter or search:** repeat the query ("No results for 'foo'") and offer a way out (clear the filters, broaden the search). It looks different from the first-use state: this is a dead end, not a starting point.
- **Partly loaded:** show what arrived and mark what did not inline ("Unavailable" beside that item), not a full-page error.
- **Error:** the reason in plain language and a retry control. Not a stack trace, not "Something went wrong". Empty is not broken: never reuse the error colour or treatment for "no data yet".
- **No permission:** show that the feature exists and how to unlock it (upgrade, request access, sign in).
- **All done:** a positive end state for inboxes, task lists and feeds ("You're caught up"), quiet rather than celebratory.
- A large illustration is never a substitute for the one action.

## Motion for each control

Motion has a job or it is cut: every animation clarifies, guides or confirms. Ask what would be lost if it were instant; if nothing, remove it. Under reduced motion, movement collapses to a 150ms opacity crossfade and the state change itself still happens. No spring or overshoot on any control. How much a page moves overall is set in [[web/frontend/visual-craft]]; most pages need less than they get.

- **Button press:** hover is one colour change over the medium duration; press is a 1px drop over the short duration, released on pointer up. The focus ring never animates.
- **Input focus:** the ring appears at once, inset; the border may deepen one step but never changes width. The label never moves.
- **Validation:** see Forms; the error swaps into the reserved helper line, so nothing below the field moves.
- **Tab change:** the selected-tab indicator moves by `transform` (`translateX` and `scaleX`, never `width`) over the medium duration; the outgoing panel fades over the short duration and the incoming one follows. A panel that changes height animates `grid-template-rows` from `0fr` to `1fr`, never `height`.
- **Accordion or disclosure:** the same `grid-template-rows: 0fr` → `1fr` technique over the long duration, with the toggle easing.
- **Number change:** real figures only. On data load, count from the previous value (zero on first load) over 400 to 800ms with the arrival easing applied to the value, formatted with `Intl.NumberFormat`. Announce only the final value (`aria-live="polite"`). Under reduced motion, show the final value at once.
- **Copy to clipboard:** the button's label changes to *Copied* for 2.5 seconds; no toast, the label is the feedback.

```js
btn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(value);
  btn.dataset.state = 'copied';
  setTimeout(() => delete btn.dataset.state, 2500);
});
```

- **Drag to reorder:** the handle appears on hover and on focus; the cursor is `grab`, then `grabbing`; a copy of the row at 50% opacity follows the pointer and a 1px accent-coloured line marks where it will land. Release settles over the medium duration with the arrival easing. Arrow keys move a focused row, and an `aria-live` region announces the move.
- **Search as you type:** debounce 250ms; while waiting, the field's border deepens one step. Matches are wrapped in `<mark>`. Announce the result count once the debounce settles, never on every keystroke.
- **Command palette:** opens at once on ⌘K or `/`, and the input keeps focus throughout. Arrow keys move a highlight that slides by `transform` over the short duration; the rows themselves never move. Enter selects, Escape closes. Rows may fade in on first open, never while filtering.
- **Page-load reveal:** at most one per page (the rule is in [[web/frontend/visual-craft]]); recipe below.

## Recipes

Take the shape of the code; the names, copy and values are yours.

### A choice between a few options

```html
<fieldset class="seg"><legend>Size</legend>
  <input type="radio" name="size" id="s1" value="1" checked><label for="s1">One box</label>
  <input type="radio" name="size" id="s2" value="2"><label for="s2">Two boxes</label>
</fieldset>
```

```css
.seg { position: relative; }
.seg input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.seg label { display: inline-flex; align-items: center; min-height: 44px; padding: 0 16px; border: 1px solid var(--line); cursor: pointer; }
.seg input:checked + label { background: var(--text); color: var(--bg); }
.seg input:focus-visible + label { outline: 2px solid var(--focus); outline-offset: 2px; }
```

The radios stay in the page at one pixel rather than `display: none`, so the keyboard, form submission and screen readers still work; the label shows the checked state and the focus ring. Labels are in the body face, sentence case.

### A horizontal rail

```html
<ul class="rail" tabindex="0" aria-label="Upcoming dates">
  <li><time datetime="2027-06-12">12 June</time> Whitby</li>
  <!-- five or more items; the edge of the screen cuts the next one -->
</ul>
```

```css
.rail { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(16rem, 22%); gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: 24px; padding-inline: 24px; overscroll-behavior-x: contain; }
.rail > * { scroll-snap-align: start; }
.rail:focus-visible { outline: 2px solid var(--focus); outline-offset: 4px; }
```

It scrolls by touch, wheel, and arrow keys once focused. It sits outside the container's side padding so the screen edge cuts the next item, which shows there is more.

### A tab switcher

```html
<div class="switch" data-switch>
  <div class="tabs" role="tablist" aria-label="Menu">
    <button type="button" role="tab" aria-selected="true" aria-controls="m1" id="t1">Lunch</button>
    <button type="button" role="tab" aria-selected="false" aria-controls="m2" id="t2" tabindex="-1">Dinner</button>
  </div>
  <section role="tabpanel" id="m1" aria-labelledby="t1">…</section>
  <section role="tabpanel" id="m2" aria-labelledby="t2">…</section>
</div>
```

```css
html:not(.js) [role="tablist"] { display: none; }
.tabs button { min-height: 44px; padding: 0 16px; border: 0; background: none; color: var(--muted); cursor: pointer; }
.tabs [aria-selected="true"] { color: var(--text); box-shadow: inset 0 -2px 0 currentColor; }
.tabs button:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
```

```js
document.querySelectorAll('[data-switch]').forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const show = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(t));
    t.addEventListener('keydown', (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      show(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
  show(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
});
```

Panels are hidden by the script, not in the HTML, so with scripting off every panel shows in order and the tab row is hidden. The `.js` class comes from the next recipe.

### A reveal that works without script

```html
<script>document.documentElement.classList.add('js');</script>
```

```css
.js [data-reveal] { opacity: 0; transform: translateY(8px); transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1), transform 420ms cubic-bezier(0.16, 1, 0.3, 1); transition-delay: calc(var(--i, 0) * 40ms); }
.js [data-reveal].is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .js [data-reveal] { opacity: 1; transform: none; transition: none; } }
```

```js
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
```

Content is hidden only when the script has run, so it is visible with scripting off. The same holds for anything a script fills in or reveals (a framework that hydrates, a tab panel, a carousel): the HTML that arrives already shows the content, and only a class the script adds may hide it, never a stylesheet rule that waits for script to undo it. A page that is blank until its JavaScript runs is broken for anyone whose script fails or is slow. This reveal also shows its end state at once under reduced motion; it runs once. Set `--i` on each item (`style="--i: 2"`) to stagger them in DOM order.

### A loop with a pause control

Anything that moves for longer than 5 seconds (a marquee, an ambient animation, a looping video) holds still until the script runs, stops when off-screen and under reduced motion, pauses on hover and focus, and has a visible pause button (WCAG 2.2.2).

```html
<figure data-loop>
  <!-- the drawing, the animation or the video -->
  <button class="btn btn--quiet" type="button" data-loop-toggle>Pause</button>
</figure>
```

```css
[data-loop]:not(.is-running), [data-loop]:not(.is-running) *, [data-loop]:not(.is-running) *::before, [data-loop]:not(.is-running) *::after { animation-play-state: paused !important; }
html:not(.js) [data-loop-toggle] { display: none; }
@media (prefers-reduced-motion: reduce) { [data-loop-toggle] { display: none; } }
```

```js
document.querySelectorAll('[data-loop]').forEach((el) => {
  const btn = el.querySelector('[data-loop-toggle]');
  const s = { seen: false, hover: false, focus: false, held: matchMedia('(prefers-reduced-motion: reduce)').matches };
  const sync = () => {
    const run = s.seen && !s.hover && !s.focus && !s.held;
    el.classList.toggle('is-running', run);
    el.querySelectorAll('video').forEach((v) => (run ? v.play().catch(() => {}) : v.pause()));
    btn.textContent = s.held ? 'Play' : 'Pause';
  };
  btn.addEventListener('click', () => { s.held = !s.held; sync(); });
  [['pointerenter', 'hover', true], ['pointerleave', 'hover', false], ['focusin', 'focus', true], ['focusout', 'focus', false]]
    .forEach(([type, key, value]) => el.addEventListener(type, () => { s[key] = value; sync(); }));
  new IntersectionObserver(([e]) => { s.seen = e.isIntersecting; sync(); }).observe(el);
});
```

### A form with no endpoint yet

Until a real endpoint exists, the form says nothing was sent. It never fakes success.

```html
<form class="signup" data-endpoint="" novalidate>
  <label for="email">Email address</label>
  <div class="signup__row">
    <input class="input" id="email" name="email" type="email" autocomplete="email" required>
    <button class="btn" type="submit">Send me the date</button>
  </div>
  <p class="help" id="email-help" aria-live="polite"></p>
</form>
```

```css
.signup { max-width: 20rem; }
.signup__row { display: flex; gap: 8px; }
.signup .input { flex: 1; min-width: 0; }
```

```js
document.querySelectorAll('form[data-endpoint]').forEach((form) => {
  const input = form.querySelector('input'), help = form.querySelector('[aria-live]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = input.checkValidity();
    input.setAttribute('aria-invalid', String(!ok));
    if (!ok) { input.setAttribute('aria-describedby', help.id); help.textContent = 'That address looks incomplete. Write it as name@example.com.'; input.focus(); return; }
    if (!form.dataset.endpoint) { help.textContent = 'Nothing was sent: this form is not connected yet.'; return; }
    fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form) })
      .then((r) => { help.textContent = r.ok ? 'Thanks. The date goes to ' + input.value.trim() + '.' : 'That did not go through. Try again in a minute.'; })
      .catch(() => { help.textContent = 'That did not go through. Try again in a minute.'; });
  });
});
```

The success message appears only when the server answered `ok`. Disable the submit button while the request is in flight if a double submit would matter.

### A skip link

```html
<a class="skip" href="#main">Skip to content</a>
```

```css
.skip { position: absolute; left: 16px; top: -64px; z-index: 1000; padding: 8px 16px; background: var(--text); color: var(--bg); }
.skip:focus-visible { top: 16px; }
```

It is the first focusable element on the page and points at the `id` on `<main>`.
