---
kind: knowledge
when-and-why-to-read: When a project has, needs or should get a DESIGN.md (the file recording a product's direction, fonts, type scale, colours, spacing, radii, components, icons and motion), or you start UI work in a repo that may have one, this knowledge should be read because screens built across sessions without one shared, closed set of values drift into 40px and 44px buttons, three heading fonts and arbitrary radii.
short-form: "DESIGN.md: one file of closed value sets that every UI change reads first and uses by token name; when to create it (new project, redesign, on request; not for a one-element fix or an audit); required contents; keep it and the code tokens changed together; check conformance of literals and rendered values; a fill-in template."
rationale: >-
  Adapted from better-design's design-md reference and DESIGN.template.md (github.com/Moddingflow/better-design, MIT), with the "why a file" and lifecycle sections and the closing notes from samber's frontend-design-deslop design-md reference (github.com/samber/cc-skills, MIT). Deslop's own DESIGN.md template was dropped in favour of better-design's, which covers the same sections with tables. References to the sources' scripts, contract JSON and effect IDs were removed. Neighbours own the values the file records: [[web/frontend/typography]], [[web/frontend/color]], [[web/frontend/visual-craft]], [[web/frontend/iconography]], [[web/frontend/dark-mode]]; the code tokens it describes [[web/frontend/design-tokens]].
surfaces:
  - on: read
    match:
      - "**/DESIGN.md"
    at: preview
---

# DESIGN.md

DESIGN.md records the project's direction, fonts, type scale, colors, spacing, radii, component sizes, icons, motion, and prohibited patterns. Screens made in different sessions by different agents or people should use the same values. Otherwise, repeated changes can produce 40px and 44px versions of the same button, three heading fonts, and arbitrary radii.

## Why a file

- Persistence: the design system survives across sessions and contributors. A new session reads DESIGN.md instead of re-running discovery.
- Single source of truth: tokens live in one place; the CSS/adapter is a projection of it.
- Reviewable: the rationale sits next to the values, so choices can be checked and changed deliberately.

## Lifecycle

1. On any UI task, first check for `DESIGN.md` at the project root (and common locations like `docs/`).
2. If it exists: read it, honor its tokens, skip questions it already answers, and extend it. Do not re-originate a theme.
3. If it does not exist: settle the direction and tokens, then write DESIGN.md before or alongside building components.
4. After a design review, append the review result and any fixes to DESIGN.md and update the Updated date.
5. Keep the token file and the chosen adapter in sync with DESIGN.md; if they drift, DESIGN.md wins.

## Find and read it first

- Before any UI work, look for `DESIGN.md` at the root, then `docs/DESIGN.md`, `design/DESIGN.md`, and paths named in CLAUDE.md/AGENTS.md/README. Match filenames case-insensitively. A monorepo may have a shared file and package-specific refinements.
- **Read the whole file before inspecting components or writing code.** It is required input.
- Take new or changed values **from DESIGN.md by token/role name**: family, size, weight, line height, color, spacing, radius, control height, icon size, duration, and easing. Do not eyeball, round, or introduce a nearby value because it seems slightly better.
- A missing value is a system decision. First check whether an existing role fits. Otherwise, add the role to DESIGN.md and code tokens **in the same change**, and report it. An undocumented one-off value is a defect.
- Find existing component variants by size, intent, and density. Record a new button, field, or card variant in the component section rather than styling it locally.

## When to create it

| Situation | Action |
| --- | --- |
| New project/interface | Create DESIGN.md from the chosen direction and tokens before laying out screens |
| Redesign or changes to several components without a file | Derive it **from live code**: CSS variables, themes, and tokens. Record contradictions under Discrepancies rather than silently fixing them |
| One-element fix without a file | Use existing tokens; do not create the file unless requested. Offer it in one line in the report |
| User asks to document the system | Create it even for a small change |
| Audit | Do not create/edit it; report absence or staleness as a finding |

Use the template below. Include only roles actually used; remove empty sections instead of leaving TBD. Use the project's documentation language.

If the project has agent instructions, suggest a line saying: "Before any UI work, read DESIGN.md and use its values." Change another instruction file only with the user's authorization.

## Required contents

Use **closed sets**: list the permitted values; do not introduce unlisted values.

- **Direction:** one-sentence concept, target/avoided qualities, and motion character.
- **Fonts:** 1–2 families, rarely a third data/mono family; roles, fallbacks, weights, loading method, and glyph coverage.
- **Type scale:** display, h1/h2/h3, body, small body, caption, label, mono as needed; size, line height, weight, tracking, and usage. Prefer no more than 6–8 steps.
- **Color:** canvas, surface, raised surface, text, muted text, border, action/on-action, focus, selection, and status roles; values per theme and code token names. Record permitted foreground/background pairs with measured contrast.
- **Spacing:** a scale such as 0/4/8/12/16/24/32/48/64; within-group, between-group, container-padding, and screen-edge rules (padding ≥ inner gaps).
- **Alignment:** keylines for lists/settings, row alignment, text centering method in controls, and declared optical offsets; see [[web/frontend/visual-craft]].
- **Radii:** 2–4 values with control/card/overlay/pill roles and a nesting rule.
- **Borders and depth:** hairline width, elevation levels, and permitted usage.
- **Icons:** one set, usually 2–3 sizes, stroke, and alignment with text.
- **Components:** button sm/md/lg height, padding, type, radius, icon size; input, list row, card, and target sizes.
- **Layout:** grid, maximum width, breakpoints, safe areas, and density.
- **Motion:** durations, curves/springs, press response, and reduced-motion behavior; see [[web/frontend/visual-craft]].
- **Voice and copy:** tone, prohibited patterns, number/date formats, punctuation, and when helper text adds information; see [[web/frontend/ai-tells]].
- **Project-specific prohibitions:** the tells from [[web/frontend/ai-tells]] that apply, and explicit visual brand exceptions.
- **Code mapping:** canonical token locations per platform and name mappings.
- **Discrepancies and exceptions:** `rule, scope, reason, source` for known departures.

## Keep DESIGN.md and code tokens aligned

- Code renders the UI, so values live in CSS variables, theme objects, or Kotlin/Swift constants. DESIGN.md is their **normative description of roles and rules**. They must agree. Components reference tokens instead of literals.
- Change a token and its documentation together. Unsynchronized edits are defects.
- If code and DESIGN.md disagree, do not silently choose or add a third value. Synchronize when the task establishes the intended change; otherwise identify the discrepancy and ask which value is authoritative.
- Platforms sharing a visual system retain consistent values; document units and px/dp/pt mappings explicitly.

## Check conformance

After editing and before acceptance:

1. Inspect style literals in changed code: hex/rgb/hsl, px/rem/dp/pt, font family/size, radius, shadow, and transition/duration. Each is a documented token or legitimate layout value such as 0, a 1px hairline, %, fr, calc, aspect ratio, or media dimensions.
2. Collect actual rendered values with computed styles or a layout inspector: families, font sizes, button/input heights, radii, and text colors. They stay within the documented sets; the same role uses the same value across screens.
3. Compare matching components on neighboring screens: primary-button height, heading level, and group spacing.
4. Record a `tokens` check: values compared, out-of-system findings, and fixes. A count of unique values is a review signal, not an automatic failure.

## Notes

- Express colors in OKLCH with a hex fallback so the file is both modern and portable; add CMYK/Pantone only if print is in scope.
- Keep DESIGN.md framework-agnostic in the Tokens section; the adapter line records which stack projection is in use.
- If the project already uses a different design-system file (a Tailwind config, a tokens.json, a visual-direction doc), reconcile into DESIGN.md as the human-readable source of truth and note the link.

## Template

````markdown
# DESIGN.md — <Product name>

> The shared source of interface values. Read this whole file before UI work.
> Use values by role/token name. Add a missing role here and in code tokens together.
> Do not introduce undocumented interface values.
>
> Remove sections the project does not need; do not leave TBD.

Updated: <YYYY-MM-DD>

## Direction

- **Concept:** <one sentence naming the object/place/craft that defines the language>
- **Qualities:** <three>
- **Avoid:** <three concrete qualities>
- **Motion:** <character, tempo, physics, signature motion detail>
- **Signature details:** <one or two>

## Code tokens

| Platform | File | Naming |
| --- | --- | --- |
| <web> | <src/styles/tokens.css> | `--color-text`, `--space-4` |
| <android> | <app/.../Theme.kt> | `AppColors.text`, `Space.s4` |

Units: <document CSS px / dp / pt mapping>.

## Fonts

| Role | Family | Fallback | Weights | Loading | Notes |
| --- | --- | --- | --- | --- | --- |
| UI / text | <Family> | <system-ui, sans-serif> | <400, 500, 600> | <bundled / @fontsource / res/font> | <required language coverage> |
| Mono / numerals | <Family Mono> | <ui-monospace, monospace> | <400, 500> | <method> | <tabular-nums> |

No other families. Use tabular numerals for comparisons.

## Type scale

| Role | Token | Size | Line height | Weight | Tracking | Usage |
| --- | --- | --- | --- | --- | --- | --- |
| display | `type-display` | <40> | <1.1> | <600> | <-0.02em> | <once per screen> |
| h1 | `type-h1` | <28> | <1.2> | <600> | <-0.01em> | <screen title> |
| h2 | `type-h2` | <20> | <1.3> | <600> | <0> | <section> |
| body | `type-body` | <16> | <1.5> | <400> | <0> | <main text> |
| body-small | `type-small` | <14> | <1.45> | <400> | <0> | <secondary text> |
| label | `type-label` | <13> | <1.2> | <500> | <0.01em> | <buttons, fields> |
| caption | `type-caption` | <12> | <1.4> | <400> | <0> | <metadata> |

## Color

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| canvas | `color-canvas` | <value> | <value> | <app background> |
| surface | `color-surface` | <value> | <value> | <panels, cards> |
| text | `color-text` | <value> | <value> | <main text> |
| text-muted | `color-text-muted` | <value> | <value> | <secondary text> |
| border | `color-border` | <value> | <value> | <hairline> |
| action | `color-action` | <value> | <value> | <primary button, links> |
| on-action | `color-on-action` | <value> | <value> | <text on action> |
| focus | `color-focus` | <value> | <value> | <focus ring> |
| danger | `color-danger` | <value> | <value> | <error with icon/text> |

Measured contrast pairs:

| Pair | Theme | Ratio | Requirement |
| --- | --- | --- | --- |
| text / canvas | <light> | <measured ratio> | 4.5 |
| on-action / action | <light> | <measured ratio> | 4.5 |
| focus / canvas | <light> | <measured ratio> | 3 (non-text) |

State never relies on color alone.

## Spacing

Scale: <0, 4, 8, 12, 16, 24, 32, 48, 64>. Tokens: space-1 = 4 … space-16 = 64.

- Within a group (label/field, icon/text): <4–8>
- Between group items: <12–16>
- Between groups/sections: <24–48>
- Container padding: <16 phone / 24 desktop>; never smaller than the gaps it contains.
- Screen edge margin: <safe area + 16 / 32 at the smallest supported resolution>.
- Siblings of one kind use one gap token, laid out by a container, never by hand offsets.

## Alignment and keylines

- Rows share top/center/bottom; mixed heights share centers. Sets of buttons share one size.
- Lists and settings: labels start on keyline <A: content edge + 16>, controls end on
  keyline <B: content edge − 16>, values align end with tabular numerals.
- Text in controls is centered by cap height (<text-box trim / TMP Capline / font fix>);
  icons are trimmed to a shared canvas with <2px> internal margin.
- Declared optical offsets: <play icon +2px x in icon-button>.

## Radii

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| control | `radius-control` | <8> | <buttons, fields> |
| container | `radius-container` | <12> | <panels, cards> |
| overlay | `radius-overlay` | <16> | <dialog, sheet> |
| pill | `radius-pill` | <9999> | <chip, avatar> |

Inner radius = outer radius − inset.

## Borders and depth

- Hairline: <1px color-border>. Thicker borders identify selected/focus/error states.
- Elevation: <flat default; 1 dropdown/popover; 2 dialog/sheet>. Shadows belong to overlays.

## Icons

- Set: <Lucide / Material Symbols / custom>. No mixed sets.
- Sizes: <16 in text/dense lists, 20 in buttons, 24 in navigation>. Stroke: <1.5>.
- Position next to text, align to cap height, and avoid decorative colored tiles.

## Components

### Button

| Size | Height | Horizontal padding | Type | Icon | Radius |
| --- | --- | --- | --- | --- | --- |
| sm | <32> | <12> | type-label | <16> | radius-control |
| md | <40> | <16> | type-label | <20> | radius-control |
| lg | <48> | <20> | type-body | <20> | radius-control |

Variants: <primary, secondary, ghost, danger>. One primary per task region.
States: default, pointer hover, pressed, focus-visible, pending, disabled.

### Input

Height <40>, padding <12>, label above in type-label, informative hint in type-caption,
and a textual error below. Descriptions are optional; omit their wrapper when unnecessary.

### <Other project components>

Target size: <44×44 pt / 48×48 dp / ≥24 CSS px with a 44px touch preference>.

## Layout

- Breakpoints: <360, 768, 1024, 1440>.
- Content max width: <1200>; reading measure: <60–80 characters>.
- Grid: <12 columns with 24 gutter / 4 columns with 16 gutter>.

## Motion

| Role | Token | Value |
| --- | --- | --- |
| press | `motion-press` | <80ms down / 180ms return> |
| micro | `motion-micro` | <120ms> |
| small | `motion-small` | <180ms> |
| medium | `motion-medium` | <260ms> |
| large | `motion-large` | <380ms> |
| standard | `ease-standard` | <cubic-bezier(0.2, 0, 0, 1)> |
| enter | `ease-enter` | <cubic-bezier(0, 0, 0, 1)> |
| exit | `ease-exit` | <cubic-bezier(0.3, 0, 1, 1)> |

Press: <scale 0.97 on pointerdown>. Reduced motion replaces movement with crossfade while retaining feedback.

## Voice and copy

- Tone: <voice>. Buttons name actions, for example "Save changes."
- Numbers/dates: <locale formats>. Punctuation: <language-appropriate quotes and unit spacing>.
- Avoid: <generic claims, forced contrast slogans, page narration, label paraphrases>.
- Helper text is optional. Keep only new facts needed to choose, predict consequences,
  enter valid data, or recover. Preserve necessary accessible instructions.
- Verified product facts used in explanations: <source of limits, timing, scope, and consequences>.

## Prohibited in this project

- <the tells from the AI-tells list that apply: icon tiles, the default AI palette, …>
- Deliberate visual brand exceptions: <for example, Geist chosen for a documented reason>

## Discrepancies and exceptions

| Rule | Scope | Reason | Source |
| --- | --- | --- | --- |
| <12px radius on legacy Dialog> | <Dialog> | <until migration> | <issue/commit> |
````
