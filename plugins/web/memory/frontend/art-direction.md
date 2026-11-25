---
kind: knowledge
when-and-why-to-read: When you are creating or redesigning a surface whose identity is part of the task (a brand, landing page, portfolio, consumer app, game, editorial product or launcher), or deciding whether to inherit an existing look, this knowledge should be read because negative rules alone only move output to the next popular template, and character comes from a concept, real references, genuinely different options and a critique of the render.
short-form: "Art direction before styles: decide scope and what to inherit, define the task, write a one-sentence concept from the subject, analyze 3–5 real references, explore 2–3 directions by leading device, derive palette/type/motion from the concept, compose by dominance and contrast, pick 1–2 signature details, keep the system closed, then critique the render (swap, squint, motion tests)."
rationale: >-
  Adapted from better-design (github.com/Moddingflow/better-design, MIT, Moddingflow 2026): references/art-direction.md, the page-level parts of SKILL.md steps 1–4, and design-contract.md "Decisions before styles". Its scripts, DESIGN.md template, contract JSON and effects-pool IDs are left out. This document owns the art-direction process for a surface that has a look to choose. Neighbours: what to do when nobody gave any visual cue ([[web/frontend/anti-default-direction]]), ready named looks ([[web/frontend/style-presets]]), the token plan and quality checks ([[web/frontend/visual-design]]), numeric craft ranges ([[web/frontend/visual-craft]]), AI-default looks ([[web/frontend/ai-tells]]), screenshot review ([[web/frontend/design-review]]), imagery ([[web/frontend/imagery]]).
---

# Art direction: an idea before styles

Read this for creation or redesign when a surface is new or identity is part of the task: a brand, landing page, portfolio, consumer app, game, editorial product, or launcher. For a change within an existing system, use "Inherited direction" below.

When the user gives no visual direction and nothing exists to inherit, run [[web/frontend/anti-default-direction]] first: it deals starting materials and a structure, and replaces section 3's free choice with seven ranked directions and a roll that never builds the top two. Then continue here from section 4 inside the built direction. A ready style from [[web/frontend/style-presets]] is used only when the user asks for it; then its preset fixes palette and type, and sections 1, 5, 6, and 7 still apply.

An average model response combines familiar templates. Prohibitions may push it toward the next popular template without creating character. Character needs a process: a concept from the subject, analyzed references, genuinely different options, a deliberate choice, and critique of the rendered result.

## 0. Scope, grounding and the task

- Choose a mode: creation, focused improvement, audit, or plan. Keep audits read-only; do not implement changes in a plan. Do not add features the user did not request.
- Inspect the existing screen in the current runtime or through confirmed current captures, then inspect nearby components, tokens, styles, and project rules. The absence of a design document does not mean there is no design system: the code tokens are then the system. Preserve unrelated work in progress.
- Distinguish an implementation defect from a redesign request. Address the cause first: unclear ordering, an unpredictable action, poor feedback, data loss, or lost content.
- Make decisions in this order: explicit task and constraints → the project's design document and the existing system → platform conventions → domain tasks → a configurable baseline. Functionality and applicable accessibility requirements apply at every level.
- **No visual direction is not a style.** When the user names no visual style and the project has no design document, brand, code tokens, or live UI to inherit, do not fall back to a fixed look: deal a direction with [[web/frontend/anti-default-direction]]. Two things are not cues and not systems: the product's domain, industry, audience, or name ("a coffee roastery", "for developers") feeds the concept, not the look; untouched scaffold defaults (the shadcn/ui default theme, Tailwind's default palette, create-next-app, Vite, or Expo starters, Bootstrap, MUI, or Chakra defaults) are not a system to inherit. Both mean "no cue": deal, keep the component library, and map the dealt tokens onto it. Any visual cue from the user (colors, mood, theme, reference, brand, audience style) replaces the deal: follow the request with this document. Never restyle an existing product unless asked. Games keep their own art direction.
- Preserve the established brand, density, game-like, editorial, or expressive composition. Do not replace them with a generic gray CRM. For a real conflict, choose the smallest accessible adjustment and explain the specific deviation.
- Clarify only unknowns that materially change the decision; state reasonable assumptions briefly.
- Describe the primary scenario in plain language and its observable outcome. Walk through entry → action → result → error/retry → back/cancel. Separate the primary task, secondary actions, and help.

### Decisions before styles

Identify the audience, frequency of use, inputs, primary task, and outcome. Inspect what exists: the design document first, live UI, components, tokens, typography, icons, and input model. Do not fill context gaps with an invented persona or feature.

| Surface | Basis for decisions | Common mistake |
| --- | --- | --- |
| Working tool | Scanning, comparison, predictable actions | Huge hero and a card for every row |
| Reading/editorial | Text rhythm, line measure, navigation, content | Dashboard chrome around an article |
| Commerce | Clear terms, selection, price, and order correction | Fake urgency, hidden fees, forced consent |
| Brand/portfolio | A specific concept, content, expressive hierarchy | Generic slogans and arbitrary uniqueness |
| Game/HUD | Fast reading, world state, input, artistic task | Moving an office web kit into a game |

References explain rhythm, density, material, or navigation; they do not authorize copying assets or fabricating metrics. Preserve existing identity, including appropriate purple, serif type, a 12px radius, 2px spacing, or a platform's material language.

## 1. A concept from the subject

Write one sentence naming **the object, place, or craft in the product's world that defines the interface's language**. Derive it from the domain, audience, and content.

| Generic | Derived from the subject |
| --- | --- |
| "Modern, clean, minimal" | "A station departure board: monospaced rows, yellow on black, departure time first" |
| "Premium and elegant" | "A cellar label: high-contrast serif, paper, embossing, batch number" |
| "Playful and bright" | "The computer panel of an old cargo ship: grid, service codes, amber" |

Add three target qualities and three concrete qualities to avoid, such as banking blue, SaaS glassmorphism, or a children's cartoon style.

## 2. Analyze references

Collect 3–5 real works: websites, products, posters, packaging, game interfaces, typography, architecture, or film. AI-generated images and marketplace templates are not references. User-provided references take priority.

For each, write one line naming **exactly what you are taking**: rhythm, density, number presentation, material, light, or the text/image relationship. "The overall vibe" is not analysis. A reference explains a principle; it does not authorize copying assets, text, logos, or metrics.

## 3. Explore, then choose

Describe 2–3 directions with different **leading devices**, not different button colors:

- **Typographic:** type scale, weight contrast, and layout organize the composition.
- **Image-led:** photography, illustration, or 3D organizes it.
- **Structural:** a grid, diagram, data, or spatial model organizes it.

Give each 3–5 lines: leading device, palette, type, and first-viewport composition. Choose one for a reason tied to the task and audience. If the user participates, show concise options; do not turn this into a mandatory approval gate.

## 4. Use constraints deliberately

- **Palette:** one logic derived from material, era, product, or content; 1–2 accents and neutrals tinted toward its temperature. Assign canvas, text, action, and status roles.
- **Type:** shortlist three families from the concept, then choose with a reason. Check glyph coverage, including Cyrillic when needed, weights, numerals, and actual sizes. No font is prohibited. Habitually replacing Inter with Space Grotesk, DM Sans, or Instrument Serif is still a template choice. Reflex faces and alternatives by class: [[web/frontend/visual-craft]].
- **Colour posture** before colours: restrained (accent under ~5% of a screen), committed (one colour carries 30–60% of the surface), full palette, or drenched (the ground is the colour). Light or dark ground comes from the physical scene (who, where, what light), not from habit or the category.
- **Grid and rhythm:** one grid with a defined step and deliberate exceptions.
- **Motion:** how things behave in the concept's world: tempo, weight, physics, and elasticity. A board flips in steps, a label appears slowly, a console responds with a short spring. Derive duration/easing/spring tokens and one signature motion detail. Palette, type, and motion should speak in one voice; strict typography with cartoon bouncing is inconsistent.

## 5. Composition: dominance and contrast

- Give each screen or section **one leading element**; the rest supports it.
- Make scale contrast visible: expressive display text can be 3–5 times body size rather than one 1.25 step. Working tools need smaller steps but still need clear hierarchy.
- Asymmetry, offset axes, large crops, and deliberate departures from the grid are valid tools. Centering everything can signal a missing compositional decision.
- Adjacent sections differ in structure, not just wording; a grid of identical cards repeated down the page is one of the tells in [[web/frontend/ai-tells]].
- Empty space has a function: pause, emphasis, or grouping.
- **Squint test:** a blurred grayscale screenshot should still show hierarchy and a leading element. An even gray mass has no useful hierarchy.
- Do not make a primary screen a wall of uninterrupted prose when its content can be understood through actions, grouping, or visual anchors. Break dense explanations into scannable sections and pair them, where useful, with meaningful controls, icons, illustrations, previews, diagrams, or other task-relevant imagery. A dashboard or account area, for example, should expose its main sections and next actions rather than only describing what a user could configure. Do not add decorative visuals that compete with comprehension or create false affordances.
- The golden ratio may inform proportions, hierarchy, cropping, or whitespace when it improves the composition, but it is a visual tool rather than a mandatory formula. Prefer the actual task, content, responsive constraints, readability, and existing system whenever they conflict.
- For landing, event, shop, and portfolio pages, build from the visitor's job: headline, one sentence, and the primary action visible at 1280×800; about 80 words per screen; six to nine sections, each with mass; the page ends on the job's action, not a reflex email band. Page content and order: [[web/frontend/marketing-pages]].

## 6. Signature details and craft

Choose 1–2 memorable details that are difficult to obtain from a generic template: number presentation, a divider, a custom hover response, photo cropping, a recurring motif, a game's result sound/animation, or a signature transition/press response. Where appropriate, let at least one detail exist in motion. A still detail appears in a screenshot; motion is experienced through use. Neither may obstruct the task.

Craft includes:

- Optical alignment of icons and large letters, beyond bounding boxes.
- Deliberate kerning, line height, and negative tracking for large display headings.
- `font-variant-numeric: tabular-nums` for comparisons; correct dashes, locale-appropriate quotation marks, and nonbreaking spaces around units or short words where appropriate.
- Hanging punctuation and deliberate alignment for editorial work.
- Consistent light/shadow direction and nested radii (inner radius = outer radius − inset).
- Images with an intentional crop and light direction, rather than a generic person at a laptop.

## 7. A coherent system of decisions

- Reuse tokens and components from the design document and the code tokens. For a new system, define semantic roles for color, typography, spacing, radius, layers, and motion; then select component variants.
- Keep the sets closed so every screen is built from the same parts: one or two font families, a stepped type scale of a few roles, a fixed spacing scale, a few radii, and fixed component sizes (for example button sm/md/lg). Same role, same value on every screen. A missing value is a system decision: add the role to the design document and the code tokens in the same change.
- Do not tune every element with its own hex, gap, shadow, and radius. Change a shared token or variant when the cause is shared. Layout math, a 1px border, 0, fr, %, calc, aspect-ratio, and allowed project values are not violations by themselves.
- Write the chosen direction and its tokens into the project's design document so later screens and sessions build from the same values.

## 8. Critique the render

Do a separate critique after the interface works, in addition to functional QA:

1. Capture key screens at the target viewports.
2. **Swap test:** replace the brand and content mentally with another company in the category. If the design fits unchanged, identify transferable layout, palette, or imagery and replace it with a decision derived from the concept.
3. Run the **squint test**.
4. Compare the result with the concept and references. Rework or remove generic elements.
5. Confirm that expression has not broken the task, contrast, focus, or reflow.
6. **Motion test:** record the key scenario. Find dead moments and determine whether the press responses and state transitions express this product or reuse generic fade-ups/bounces.
7. Check the render against [[web/frontend/ai-tells]]. Record matched tells, replacements, and justified exceptions.
8. When a subagent is available, give the screenshots and the direction card (not your build notes) to a fresh-context reviewer for steps 2–4 and 7: a reviewer that inherits your transcript inherits your optimism. Act on its findings, then recapture. How to brief it: [[web/frontend/design-review]].

Re-examine a critique pass that finds nothing.

## Inherited direction

When a design document, a brand, or a design system exists, inherit its concept. Use its Direction section when present; otherwise summarize the live interface in one sentence and identify type, palette, motifs, motion tokens, and motion character. Work within those constraints. A button fix does not justify redesigning the product for originality.

## When not to run the full process

- Audit or focused change: verify that the change preserves existing character.
- Dense working tools such as CRM, admin, or IDE surfaces: express character through precision, data typography, and one or two details. With no cue, deal a direction for a working tool ([[web/frontend/anti-default-direction]]); density comes from the task ([[web/frontend/interface-design]]).
- An explicit request for a simple, standard, system-like interface is itself a direction.
- No direction from the user and nothing to inherit: the dealt direction, not a fixed style.
