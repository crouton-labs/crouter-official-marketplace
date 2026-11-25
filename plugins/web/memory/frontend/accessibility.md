---
kind: knowledge
when-and-why-to-read: When you are building or reviewing a page or app that people with keyboards, screen readers, low vision, colour blindness or motion sensitivity must be able to use, this knowledge should be read because the WCAG 2.2 AA criteria that most often catch interface work (focus not obscured, target size, dragging alternatives, accessible authentication, redundant entry) are easy to miss, and an automated scan passes far less than it seems to.
short-form: "Accessibility to WCAG 2.2 AA: contrast and colour independence; focus visible and managed; keyboard patterns; 24px minimum targets and drag alternatives; form labels, errors and authentication; native semantics first, then ARIA names and roles; motion and flashing; a criterion-by-criterion check table with exact scopes and exceptions; manual testing beyond scanners; accessibility tells."
rationale: >-
  Adapted from samber's frontend-design-deslop accessibility reference (github.com/samber/cc-skills, MIT) and the semantics table and closing paragraph of better-design's web-quality reference (github.com/Moddingflow/better-design, MIT). Deslop's advice to draw the focus ring with box-shadow was dropped: [[web/frontend/states-and-interactions]] draws it with outline, and owns focus rings, 44px hit targets, form fields and modal behaviour. Contrast numbers and colour use are owned by [[web/frontend/color]]; reflow, zoom and text-spacing tests across widths by [[web/frontend/responsive]]; reduced-motion CSS by [[web/frontend/visual-craft]]; icon names by [[web/frontend/iconography]].
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

# Accessibility

Accessibility is a build-time discipline, not an audit you bolt on at the end. It also overlaps almost entirely with good design: clear hierarchy, sufficient contrast, visible focus, sane keyboard order, and meaningful feedback help everyone.

The bar is WCAG 2.2 AA. Automated tools catch only a fraction of real issues, so manual keyboard and screen-reader testing is required regardless of any scan result.

The default target is WCAG 2.2 AA, including applicable A criteria. This is not a complete audit. WCAG is normative; APG supplies informative guidance. Internal style preferences and numbers do not become standards.

## Contrast and colour independence

- Text contrast: 4.5:1 for normal text, 3:1 for large text (about 24px, or about 18.66px bold); AAA raises these to 7:1 and 4.5:1.
- Non-text UI (icons, control boundaries, focus indicators, chart elements that convey meaning) needs 3:1 against adjacent colors (1.4.11).
- Never convey information by color alone (1.4.1) — pair status color with an icon, label, or shape, and verify the whole UI still reads in grayscale, which also proves hierarchy does not depend on hue.
- For data, provide the underlying numbers in an accessible table alongside any color-coded chart.

## Focus: visible and managed

- Every interactive element needs a clearly visible keyboard focus state; how the ring is drawn is in [[web/frontend/states-and-interactions]].
- WCAG 2.2 adds two focus criteria: the focus indicator must not be entirely hidden by sticky headers, footers, or banners (2.4.11 Focus Not Obscured), and it must be substantial enough — at least a 2px-thick perimeter around the element and 3:1 contrast between focused and unfocused states (2.4.13 Focus Appearance).
- Manage focus across interactions: move focus into a modal or dialog on open and trap it there, return focus to the trigger on close, and never leave focus stranded on a removed element.
- Do not remove focus outlines without replacing them with something at least as visible.

## Keyboard navigation

- Everything operable by mouse must be operable by keyboard, in a logical order that matches the visual order.
- Composite widgets follow expected key patterns: arrow keys navigate menus and listboxes (not Tab between every item), Escape closes overlays, Enter and Space activate, and editable lists support a delete shortcut.
- Do not put non-interactive elements in the tab order, and do not skip interactive ones.
- Custom controls (a div acting as a button) must add the role, tabindex, and key handlers a native element gets for free — prefer native elements (`button`, `a`, `input`) precisely because they bring keyboard support and semantics already.

## Target size and pointer

- Interactive targets must be at least 24 by 24 CSS pixels, or have enough spacing that a 24px-diameter circle centered on each does not overlap its neighbors (2.5.8 Target Size Minimum); padding counts toward the size.
- The AAA target is 44 by 44 (2.5.5), which is also the comfortable touch standard, so meeting 44px satisfies both.
- Any interaction driven by a dragging movement must have a single-pointer, non-drag alternative (2.5.7 Dragging Movements): drag-to-reorder needs move-up/move-down controls, a pannable map needs buttons, a draggable carousel needs arrows.

## Forms

- Every input has a programmatically associated visible label (not placeholder-as-label); clicking the label focuses the input.
- Group related fields (fieldset and legend, or an accessible grouping).
- Errors are conveyed in text, associated with the field, and announced — never rely on red border alone; keep the user's input on error and explain how to fix it.
- Use correct input types and autocomplete tokens so assistive tech and password managers work.
- WCAG 2.2 adds 3.3.8 Accessible Authentication (no cognitive test — transcribing, solving a puzzle, retyping — to log in; allow paste and password managers) and 3.3.7 Redundant Entry (do not make users re-enter information they already provided in the same flow).

## Names, roles and ARIA for common components

The first rule of ARIA is to prefer native HTML, which carries role and behavior for free.

- When you must add ARIA: icon-only buttons need an accessible name (`aria-label`); an HTML illustration or icon that conveys meaning needs a label, and a purely decorative one is hidden with `aria-hidden`.
- Common patterns: a modal uses `role="dialog"`, `aria-modal="true"`, and a labelled title; a toggle uses a native checkbox or `role="switch"` with `aria-checked`; a tab set uses `role="tablist"`/`tab`/`tabpanel` with `aria-selected` and arrow-key navigation; a disclosure uses `aria-expanded`.
- Live regions (`aria-live="polite"`) announce async feedback like toasts and validation summaries.
- Do not put interactive content inside a hover-triggered tooltip, and do not give disabled buttons tooltips — they are out of the tab order and never announced, so surface the reason elsewhere.

## Motion

- Honor `prefers-reduced-motion` (see [[web/frontend/visual-craft]]) — large movement, parallax, and scaling can cause vestibular discomfort, while opacity fades are generally safe.
- The robust approach enables motion only under `(prefers-reduced-motion: no-preference)` or swaps motion for a fade when reduction is requested, rather than a blunt global zeroing.
- Avoid content that flashes more than three times per second (2.3.1).
- Do not auto-play motion or carousels without a pause control.

## WCAG 2.2 AA: the criteria that bite UI

- WCAG 2.2 (2023, also published as ISO/IEC 40500:2025) adds criteria over 2.1 and removed 4.1.1 Parsing.
- The ones that most often catch interface work: 2.4.11 Focus Not Obscured (Minimum), 2.4.13 Focus Appearance, 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum), 3.2.6 Consistent Help (help in the same relative place across pages), 3.3.7 Redundant Entry, and 3.3.8 Accessible Authentication.
- Treat these as a build checklist, not a post-hoc audit.
- The long-standing essentials still apply: contrast, keyboard operability, labels, headings in order (no skipped levels), alt text, and a logical reading and focus order.

## Check table: exact scope of each criterion

| Check | Exact scope |
| --- | --- |
| Text contrast 1.4.3 | Normal text ≥4.5:1; large text ≥3:1: 18pt regular or 14pt bold, approximately 24/18.67 CSS px. Do not round a failing ratio upward. Placeholders are text. Exceptions include inactive, incidental/decorative text, and logos |
| Non-text 1.4.11 | ≥3:1 for necessary component/state information and meaningful graphics against adjacent colors. Not every divider or a comparison between nonadjacent default/hover states. Inactive and unmodified user-agent exceptions apply |
| Focus | Visible and logical without positive tabindex. AA 2.4.11: authored content must not fully obscure the component. Full visibility (2.4.12), a 2 CSS px perimeter-equivalent area, and same-pixel contrast (2.4.13) are AAA enhancements |
| Targets 2.5.8 | AA: 24×24 CSS px or applicable spacing/equivalent/inline/user-agent/essential exceptions. Prefer 44×44 for touch as an internal enhanced target. One small bounding box does not prove a violation |
| Keyboard 2.1.1/2.1.2 | Applicable operations work without a pointer; no unintended trap. Modal containment is valid with an expected exit |
| Label in name 2.5.3 | Accessible name includes visible text; starting with it is useful practice. An icon-only control needs a meaningful name |
| Labels/errors | Associated labels/instructions (3.3.2), textual error identification (3.3.1), and known correction suggestions (3.3.3). Preserve entered data |
| Status 4.1.3 | Meaningful updates without focus changes are available to assistive technology; do not announce every cosmetic change |
| Drag 2.5.7 | A non-drag single-pointer alternative is required except where an applicable exception holds. Keyboard alternatives serve a separate requirement |
| Consequences 3.3.4 | Applicable legal/financial/data/test submissions need reversibility, checking, or review/confirmation. Not a mandatory modal for every Save |
| Input/auth 3.3.7/3.3.8 | Avoid unjustified re-entry of known information; allow password managers/paste and appropriate help or alternatives to cognitive tests |
| Flashing 2.3.1 | A: at most three flashes per second, or below general/red flash thresholds. Includes status blinking, glitch effects, and game strobes |
| Pause 2.2.2 | A: automatically starting motion/blinking/scrolling lasting more than 5 s alongside other content needs pause/stop/hide unless essential |
| Motion 2.3.3 | AAA: interaction-triggered animation can be disabled. Reduced-motion support improves quality: remove spatial movement/scale/parallax while retaining feedback/state. See [[web/frontend/visual-craft]] |

Use native semantics and appropriate headings, landmarks, lists, tables, and forms. Use ARIA where needed. Hide decorative icons from assistive technology; give informative images meaningful alt text and decorative images empty alt text. Supplement graphics and color states with accessible values or other cues. An accessibility tree is not a screen-reader run.

## Testing

Automated scanners (axe, Lighthouse, and similar) reliably catch only a portion of issues; published estimates of automated coverage vary widely (from roughly a tenth of success criteria fully detectable up to around half of issues by some vendor measures), so a clean automated pass is necessary but far from sufficient. Always also: tab through the entire interface with the keyboard only, operate every control without a mouse, run a screen reader over the key flows, test at 200 percent zoom and at the reflow width (320px), and verify in grayscale and with a color-blindness simulation (protanopia, deuteranopia, tritanopia). Verify both light and dark modes against the same bar.

## Accessibility tells

- No visible keyboard focus state, or outlines removed and not replaced.
- Placeholder text used as the only label.
- Status or meaning conveyed by color alone.
- Icon-only buttons with no accessible name.
- Body text below 4.5:1 contrast, or off-white-on-near-white low-contrast fashions that fail.
- Custom controls (divs as buttons) with no keyboard support or role.
- Tiny targets below 24px with no spacing compensation.
- Drag-only interactions with no button alternative.
- Modals that do not trap or return focus; tooltips with interactive content.
- Motion that ignores `prefers-reduced-motion`.
