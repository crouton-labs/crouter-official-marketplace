---
kind: knowledge
when-and-why-to-read: When you are building or reviewing anything a person clicks, types into, or waits on — buttons, links, form fields, modals, menus, tooltips, toasts, tabs, loading and empty screens — on a marketing page or in an app, this knowledge should be read because a control missing one of its states, a focus ring that shifts the layout, or a form that shows success when nothing was sent is what makes a built page feel broken or generated.
short-form: "Every control has eight states; focus rings are outlines that never move the layout; 44px hit targets; one filled primary per page; fields keep a constant border and a reserved helper line; native dialog, popover and select; undo over confirm; skeletons and one-line empty states; small motion recipes per control; code for a segmented choice, rail, tab switcher, script-free reveal, pausable loop, endpoint-less form and skip link.; plus buttons ranked by importance not meaning, feedback where the action happened, loading indicator by wait time (skeleton, in-control pending, progress, splash), errors and consequences, tables, navigation and command palettes, per-component behaviour contracts, drag and drop from the first version, copy and data, localization, component slop tells."
rationale: >-
  Adapted from Hallmark's patterns, interaction-and-states and microinteractions references and the controls and inputs rules of its craft reference (github.com/Nutlope/hallmark, MIT), plus the empty-state cases previously in [[web/frontend/mockups]], the frontend-design-deslop components reference (github.com/samber/cc-skills, MIT) and better-design's behavior-and-content reference (github.com/Moddingflow/better-design, MIT). Durations, easings, what may animate, one reveal per page and the motion bans are owned by [[web/frontend/motion]]; colour contrast numbers by [[web/frontend/color]]; scroll-linked animation by [[web/frontend/scroll-animation]]; small-screen behaviour by [[web/frontend/responsive]]; nav and page structure by [[web/frontend/marketing-pages]]; the rule against invented facts by [[web/frontend/visual-design]]. This document owns how every control and stateful screen behaves, on marketing pages and in apps alike.
surfaces:
  - on: read
    match:
      - "**/*.tsx"
      - "**/*.jsx"
      - "**/*.vue"
      - "**/*.svelte"
      - "**/*.astro"
      - "**/*.html"
    at: preview
---

# States and interactions

This applies to marketing pages and to apps, dashboards and tools. It owns the states of every control, focus, hit targets, sizing, forms, overlays, feedback (toasts, undo, loading, empty, error), the motion each control uses, and short code recipes. The general motion rules (the duration scale, the three easings, animating only `transform` and `opacity`, one reveal per page, no parallax or custom cursors) live in [[web/frontend/motion]]; this document only applies them to controls. Contrast requirements are in [[web/frontend/visual-craft]]; how controls change on a phone is in [[web/frontend/responsive]].

The code below names colours through a few custom properties; map them to your own tokens: `--bg` (background colour), `--bg-2` (a second background shade), `--text` (text colour), `--text-2` (a step quieter or a step darker, for hover), `--muted` (quiet text and a field's edge, 3:1 against the background), `--line` (a hairline), `--focus` (the focus ring colour, chosen in [[web/frontend/visual-craft]]) and `--error`. Durations and easings come from [[web/frontend/motion]], which sets three durations (the short one for a press, a tick or a colour change; the medium one for hover, tooltips and menus; the long one for modals, drawers, accordions and reveals) and three easings (arrival, exit, toggle), with exits at 60 to 75% of the arrival's time. Below, "short", "medium" and "long" mean those three, and the code writes them out as plain CSS values.

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

`outline: 2px solid var(--focus); outline-offset: 2px`, on `:focus-visible` so it shows for the keyboard and not on every click. On inputs the offset is negative (inset) so the ring never collides with a neighbouring field. Draw it with `outline`, never with a border change, so it never moves the layout. The ring has 3:1 contrast against both the element and the background, and it appears at once (the colour is in [[web/frontend/visual-craft]], the no-animation rule in [[web/frontend/motion]]). Never `outline: none` without a replacement. Where a control sits on a dark band, set `--focus` for that band so the ring still shows.

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

Do not paint every button with its meaning (green save, blue edit, red delete); that destroys hierarchy. Destructive actions get the loud red treatment only when destruction is the primary action of that surface, such as the confirm button inside a delete dialog; elsewhere a delete is a quiet tertiary action.

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

- Drawers should resist accidental dismissal (a short delay or velocity threshold before drag-to-dismiss fires). Keep modals shallow; a modal that opens another modal is a flow smell.

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

Give feedback where the action happened. A copy-to-clipboard button shows an inline checkmark on itself, not a toast across the screen. Toasts are for background or cross-surface events (saved, synced, failed), are brief, stack sanely, and never carry the only copy of an error the user must act on.

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

Server-side gate redirects (auth) before the client renders so the user never sees a flash of the wrong screen.

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

## Choosing the indicator by wait time

Every async content region needs an explicit loading state. A blank screen, jumping layout, or "No data" while a request is pending is a defect. Choose by expected duration and whether the future content shape is known.

| Situation | Indicator | Avoid |
| --- | --- | --- |
| Usually under ~300 ms | Retain existing content; if needed, delay the indicator ~200–300 ms and avoid a flash shorter than ~300–500 ms once shown | A split-second skeleton/spinner |
| Initial screen/list/feed/card/profile load, known shape, ~1–10 s | A **skeleton** matching actual rows, avatars, images, and columns | Abstract boxes or a skeleton whose geometry differs from the final layout |
| Submit, save, toggle, send | Pending **inside the control**, preventing repeats and preserving width | Replacing the form with a skeleton or blocking the whole screen |
| Separate module with unknown shape, such as video/chart/widget | Local spinner within that module | A full-screen spinner blocking ready regions |
| More than ~10 s: import/export/upload/install/process | Determinate progress, stage and remaining work, cancel or background execution | A content skeleton or endless spinner without status |
| App cannot show meaningful UI until required data is ready | **Loading splash** with real stages | Splash for normal screen navigation |

### Skeleton loader

- Match the specific layout and its responsive variants, with a plausible count of rows.
- Replace each region as its data arrives; ready regions do not wait for the slowest. Use a short crossfade without shifting layout or sliding content in.
- Keep shimmer/pulse restrained; under reduced motion, use a static or very slow treatment.
- Mark the region `aria-busy="true"`, announce loading once, and hide skeleton shapes from assistive technology with `aria-hidden`; they do not take focus.
- On timeout/failure, show an error with reason and retry. A failed load is not an empty list.
- On a cached revisit, show cached content and refresh it instead of reverting to a skeleton.

### Loading splash: only for genuine bootstrap

A splash is a full-screen startup phase, appropriate only when the app **cannot show a meaningful interface** until necessary long operations finish:

- Discovering a network, server, device, or lobby and connecting.
- Signing in, restoring a session, obtaining a license or access rights.
- Initial sync, required configuration, or a client update.
- Loading game assets, a level, or shader cache.

Requirements:

- Show **real stages** in order, such as finding a network, signing in, and loading a profile. Long stages get real progress or counts; never invent a percentage.
- Each stage has applicable recovery: a clear reason, retry, offline mode, sign-out, or another server. Include a timeout rather than hanging indefinitely.
- Add no delay for a logo or animation. Show the interface once required data is ready.
- With sufficient cached session/data, skip the splash and refresh in the background.
- Follow the product's art direction; keep stage text readable and respect reduced motion.
- Do not use it for screen navigation, ordinary list loads, ready server-rendered HTML, or short operations that fit local pending/skeleton states.

An OS launch screen (iOS or Android 12+ `SplashScreen`) covers process startup and should be brief. Long data bootstrap belongs in the app's own staged screen, not an extended branding launch screen.

## Errors and consequences

For invalid input, name the field and correction. In a long form, connect an error summary to the fields and move focus appropriately. Preserve other answers. Do not disable submit in a way that conceals the reason; essential help must not require hovering a disabled control.

Service failure, missing permission, offline state, and an empty response have different causes. Show applicable reasons and real next steps rather than raw exceptions. Retrying preserves request/context and prevents duplicates. Do not promise undo if it cannot work.

For high-consequence actions, use actual reversibility, checking, or review. Name the object, scope, and action. Deleting a row with undo and deleting an account need different protection. This is product UX guidance, not a new approval requirement for the agent.

## Tables and data grids

- **Alignment**: left-align text, right-align numbers so decimals and magnitudes line up for comparison, and align headers with their column's content.
- **Numerals**: use `font-variant-numeric: tabular-nums` for any column of figures, IDs, timestamps, or anything that should align vertically, so digits share a fixed width.
- **Separation**: prefer light horizontal row separators or generous row padding over heavy full borders; zebra striping is optional and earns its keep only at high density. Avoid a grid of heavy lines (chart junk for tables).
- **Scroll**: sticky header on vertical scroll; pin the identifying first column on horizontal scroll; provide a totals or summary row for numeric tables.
- **Density**: pick a density for the page and keep it; do not mix loose and tight rows in one view. Use surface color and dividers to create zones in dense layouts rather than more borders.
- **Sorting and actions**: indicate sortable columns and current sort; keep row actions discoverable (visible or on row hover with a keyboard-accessible fallback).

## Navigation and command surfaces

Choose sidebar vs topbar by information architecture depth: sidebar for many sections and nested areas, topbar for shallow IA and marketing. Breadcrumbs for deep hierarchies. For power-user products, a command palette (the cmd-K pattern) is the fastest navigation and action surface; the cmdk library by Paco Coursey is the de facto React implementation.

Make the current location obvious (one accent on the active item, never weight change). Dropdown and menu triggers can open on mousedown rather than click for perceived immediacy. For nested menus, use a prediction cone (a triangular safe zone toward the submenu) so the pointer can travel diagonally without the submenu closing.

## Tasks and information architecture

Show the user's object, current context, and next step. Use terms from the user's domain. Keep names consistent across search, details, navigation, and feedback. A visible location, predictable Back action, and preserved filters are usually more useful than extra instructions. Do not make users remember data from the previous screen.

One dominant purpose and one primary action per task region are hierarchy heuristics. Independent regions may each have a primary action. Do not hide frequent actions for a cleaner screenshot or add a second CTA to satisfy a template. Apply the copy rules in [[web/frontend/ai-tells]] instead of introducing the page with a paragraph about its controls.

## Component contracts

| Component | Behavior and applicable states | Observable check |
| --- | --- | --- |
| Button/link | Buttons issue commands; links navigate. Default, focus-visible, pressed, and pointer hover; disable only for a real reason. Icon-only actions have names. Native form submission needs no onClick | Enter/Space works for buttons; links preserve URL, Back, and opening in another tab; actions change the expected object/view |
| Async submit | Pending preserves geometry and prevents duplicates; success is specific; failure preserves input and permits retry | Two rapid submissions do not create two results; failure is not reported as success |
| Input/select | Persistent associated label; separate hint only when informative; placeholder as example. Distinguish required/readOnly/disabled; choose type/inputmode/autocomplete for the data | Label focuses the field; values survive errors; correctable errors are associated with the field |
| Checkbox/radio/toggle | Value and available action are clear; semantic checked state; persist the value or report failure | Keyboard changes state; persistence failure does not leave a false saved indication |
| Tabs/menu | Follow an established platform/APG pattern, roles, and roving focus/arrows where applicable; focus and selection are distinct | Arrows/Tab behave as expected; panels relate to tabs; Escape closes a popup and restores focus |
| Dialog | Accessible title, appropriate initial focus, inert background, modal containment, usual Escape dismissal, logical focus after closing | Open → Tab/Shift+Tab → Escape → invoker or another logical target if the invoker was removed |
| Navigation | Consistent destination names; visual and semantic current location; meaningful collapse and stable destinations | Navigate and go Back with context restored; important destinations remain available on narrow screens |
| Table/list | Comparable data keeps its columns; a read-only table uses native table semantics. Use a grid only for a distinct keyboard-editing model | Headers/caption/context are accessible; sorting changes order and announces direction; numeric alignment supports comparison |
| Cards/regions | Boundaries express a separate object, tool, or group. Do not make a complex card with independent actions one nested button | Independent actions remain reachable without accidental opening or competing pointer/focus behavior |
| Search/filter | Show query, selected filters, and result count; predictable clear/reset. Distinguish first use, loading, no results, service error, and stale data | Rapid input cannot show an obsolete response; no-results offers a useful reset; errors permit retry |
| Drag/reorder | Provide a non-drag single-pointer method and a separate keyboard path | Move with buttons/menu without holding the pointer, then repeat with keyboard |
| File/image upload | Drop zone from the first version, real file-picker button, and paste where appropriate. Show limits before selection; distinguish idle, drag-over, rejection, uploading, done, and error beyond color | Try one/multiple files, wrong type, excessive size, a drop outside the zone, and keyboard selection; the form remains intact |
| Toast/status | Outcome understandable beyond visual context; suitable status/live region without unnecessary interruption | Status is programmatically available; focus stays put unless needed; critical errors remain until addressed |

Do not give every component the same state matrix. Static text has no pending state, a toggle needs on/off, async search has response races, and an ordinary link does not need an invented success toast.

## Drag and drop: include it from the start

If the task includes file selection, include drag and drop in its first version rather than waiting for a separate request.

### Where it belongs

- **Every file/image upload:** avatar, cover, message/ticket attachment, CSV/JSON import, gallery, editor assets, launcher mods/skins/saves. A file input or native picker has a corresponding drop zone.
- **User-defined order:** galleries, playlists, priorities, layers, steps, and moving between groups such as kanban columns or folders. Buttons/menus remain required alternatives.
- Do not add it to computed ordering, such as sort-by-date, or where there is nothing to drag.

### A clear drop zone

- At rest, use the project's upload icon, "Drop files here or" plus a real "Choose files" button, supported types, and size/count limits. A dashed border is a convention, not the only cue; text and icon remain visible.
- Match size to role: a large zone for a primary import/gallery task, a compact row for an attachment, or the avatar/cover preview itself with a Replace overlay.
- Use the page's own colors, radii, and icons; do not invent a separate uploader style.

| State | Visible result |
| --- | --- |
| Idle | Icon, instruction, picker button, and actual limits |
| File over window | Highlight available drop zones. A single primary zone may use a full-window drop overlay |
| File over zone | Stronger border/background; a concrete release-to-upload message, with count when available |
| Reject | Icon and reason, such as supported formats and size. Reject during dragover when available metadata permits, otherwise per file after drop |
| Uploading | Preview, name, size, per-file determinate progress, and cancel |
| Done | Thumbnail, name, Remove and Replace; keep the zone available for additional files when supported |
| Error | Per-file reason and retry; preserve other files and form data |

- Show image previews from a local object URL immediately; release it after replacement/removal.
- A single-value field replaces its value with an undo path; multiple-value fields append.
- Uploads longer than roughly 10 seconds use determinate progress, not skeletons.

### Alternatives and accessibility

- Drag is never the only path. The picker works with mouse, touch, and keyboard. For images in messages, tickets, and editors, support Ctrl/Cmd+V where appropriate.
- On touch, present the zone as a large picker, with camera/gallery choices as appropriate (`accept="image/*"`, task-appropriate `capture`). Omit desktop drag wording.
- Announce drop results and errors through a live region; do not move focus after a drop.
- Keyboard reorder: Space to pick up, arrows to move, Space to place, Escape to cancel; announce the position, such as "Item 3 of 7."

### Technical correctness

- On web, prevent file `dragover`/`drop` defaults at the window level so an off-target drop does not navigate to the file and discard entered data.
- Avoid highlight flicker over children with a dragenter/dragleave counter or relatedTarget checks. Reset on drop, dragend, and leaving the window.
- Respond to files (`dataTransfer.types` includes `Files`), not dragged text or links.
- Dragover exposes limited metadata, typically types rather than names/sizes. Validate type, size, and count after drop and again on the server.
- Accept directories only when the task requires them.
- In Electron, Tauri, WPF, Qt, and launchers, use the current native file-drop API and the same states. A drop must not become window navigation.
- Follow the drag and file-drop-zone rows of the catalog in [[web/frontend/motion]].

## Interaction details that separate expert from default

- Disabled buttons should not show tooltips (they are out of the tab order and never announced); explain the disabled reason elsewhere or keep the button enabled and validate on click.
- Keyboard-navigable lists: arrow keys to move, Enter to open, a delete shortcut where relevant.
- Do not animate high-frequency or keyboard-initiated actions; speed beats delight there (see [[web/frontend/motion]]).
- Respect the platform: a web app that fights browser conventions (custom scrollbars that break, hijacked Cmd-F) frustrates.
- Make hit targets larger than their visible icon; pad the clickable area.

## Copy and data

- Buttons name the action and, where necessary, its object: "Save changes," "Delete invoice." "Continue" can be clear within a contextual multistep flow; evaluate its outcome.
- Errors explain the problem and recovery, such as a valid email format. A generic failure message without a next step is insufficient, but do not invent a cause.
- Apply the copy rules in [[web/frontend/ai-tells]] for page narration, label paraphrases, redundant copy, and default helper text. A description slot is optional. Keep useful limits, units, formats, shortcuts, consequences, and explanations of unfamiliar actions.
- Brevity is a heuristic: 1–4 words for a button and roughly 120 characters for a hint can aid review. Do not cut necessary meaning or translations to meet a quota.
- Use truthful content. Label prototype fixtures; do not present sample revenue, testimonials, avatars, or message delivery as real results.
- Check zero/one/many, long names, unbroken strings, large numbers, and empty fields. Use valid long dates, such as "September 30, 2026, 11:59:59 PM"; invalid dates test errors.

## Localization

Use existing message-level i18n, placeholders/plurals, and locale formatters rather than assembling grammatical fragments. Do not add an i18n library for a button fix or interpolate user data as markup.

Test expanded translations and long data without losing content/actions. Ellipsis is suitable for secondary data only with a way to reveal the complete value, never for a critical error. For supported RTL, use base direction and logical layout; mirror directional semantics, not every number, chart, media control, or brand mark.


## Motion for each control

Motion has a job or it is cut: every animation clarifies, guides or confirms. Ask what would be lost if it were instant; if nothing, remove it. Under reduced motion, movement collapses to a 150ms opacity crossfade and the state change itself still happens. No spring or overshoot on any control. How much a page moves overall is set in [[web/frontend/motion]]; most pages need less than they get.

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
- **Page-load reveal:** at most one per page (the rule is in [[web/frontend/motion]]); recipe below.

## Component slop tells

- Components with only a resting state (no hover, focus, active, disabled, loading).
- Placeholder text used as the label.
- Buttons colored by meaning instead of ranked by importance.
- Tables with center-aligned numbers, proportional (non-tabular) numerals, or heavy full borders.
- Modal-on-modal; toasts carrying must-act errors; no empty/loading/error states.
- Layout shift on hover or selection (weight change), focus rings that ignore radius (outline instead of box-shadow).
- The icon-tile-above-heading feature card as the universal content shape.

## Inspiration

Transpose the named behavior, not the visuals. Inspiration only.

- **Linear**: instant, keyboard-first interactions; command palette; near-zero perceived latency. Transpose the keyboard-first, low-latency interaction model.
- **Stripe Dashboard and Docs**: dense data presented calmly; docs-as-product with live, copyable examples. Transpose tabular-nums tables and inline copy feedback.
- **Raycast**: deliberate restraint, almost no animation on high-frequency actions. Transpose the no-animation-on-frequent-actions discipline.
- **Superhuman**: command-driven speed, every action keyboard-reachable. Transpose the everything-has-a-shortcut model.
- **Shopify Polaris / IBM Carbon / GitHub Primer (design systems)**: fully specified component state matrices, density guidance, accessible patterns. Transpose the rigor of specifying every state.
- **Family (iOS) and Vaul (web)**: spring-based sheets that resist accidental dismissal. Transpose the drawer dismissal threshold and edge-origin motion.

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
