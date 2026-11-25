---
kind: knowledge
when-and-why-to-read: When the user asks to design a website or product UI, or wants a design system / design-document.html generated, this knowledge should be read because it runs an interactive workflow that gathers requirements, explores preferences, and produces a comprehensive design document with component examples.
short-form: Interactive product-design workflow — gather requirements, commit to words (adjectives, essence, sliders, personality-to-token table), explore preferences, decide constants vs variables, generate a design document with components.
rationale: >-
  The discovery sections (protocol, commit to words, question bank, sliders, personality-to-token translation, questions by artifact type, system governance, reference transposition) are adapted from frontend-design-deslop by samber (github.com/samber/cc-skills, MIT) references/discovery.md and SKILL.md Phase 0, wording kept, with its question-tool wording replaced by `crtr human ask`. The product-experience interview (how a product should feel) lives in [[design-discovery/product-design-interview]]; the visual-direction process in [[web/frontend/art-direction]] and [[web/frontend/anti-default-direction]]; named looks in [[web/frontend/style-presets]].
---

# Product Design Workflow

You are a product designer creating a comprehensive design system. Follow these steps in order.

## Step 1: Gather initial requirements

Ask the user to describe their product at a high level. Accept any degree of specificity.

If the project already has a design document, read it, honor its tokens, skip the questions it already answers, and extend it rather than starting over.

The question bank below is generous on purpose; the asking is selective. Batch related questions, give 2 to 4 concrete options each, infer from context first and confirm inferences, ask only the high-signal subset. Do not interrogate.

### Protocol

1. Classify the artifact type: marketing/landing page, pricing page, SaaS application, dashboard/data tool, ecommerce, marketplace, mobile app, AI/conversational interface, email/newsletter, blog/editorial publication, onboarding/auth flow, settings/admin/CMS, presentation/deck, docs/API reference, portfolio/brand site. Type decides which questions matter. A composite artifact (a marketing site with an embedded app, an AI chat inside a SaaS app) is designed region by region.
2. Infer from context (prompt, domain, repo, existing brand) and state inferences so they are cheap to correct.
3. Ask the high-signal subset. Offer to go deeper rather than front-loading.
4. Commit to words before designing.
5. Gather references: 1 to 3 sites admired (and what specifically), 1 to 2 to avoid, key competitors. If none and direction is unclear, web-search current strong examples of the type plus positioning and transpose. On a generic brief (another dashboard, another SaaS landing page) where the category itself has little to say, widen the reference search past the product's own category rather than asking for more creativity within it (see [[web/frontend/anti-default-direction]]).

### Commit to words (do before any visual)

The highest-leverage step.

- Lock 3 to 5 brand adjectives. These translate directly into type, color, density, and motion.
- Write a one-line visual word translation per adjective: adjective -> concrete visual move. Example: "precise" -> tight grid, monospace numerals, hairline rules; "warm" -> humanist sans, soft saturated accent, generous spacing; "bold" -> oversized display, high contrast, one loud accent.
- Distil a 3-word aesthetic essence capturing the overall feel (for example "quiet, technical, exact" or "bold, editorial, loud").
- State a single-minded proposition: the one impression the UI must leave.

### Core question bank (ask the relevant subset)

- Artifact and primary action: what is this, and what single outcome matters most (sign up, buy, explore data, read, book a demo, present)?
- Audience: who uses it; B2B/B2C/developer/internal; technical sophistication; decision-maker or end-user; demographics if relevant?
- Positioning: corporate/enterprise, creative/design-forward, technical/developer, luxury/premium, playful/consumer, or utilitarian/internal?
- Personality: 3 to 5 adjectives, or place on the sliders below.
- Archetype (optional): Hero, Sage, Outlaw, Innocent, Explorer, Caregiver, Creator, Ruler, Magician, Lover, Jester, Everyman. Drives both color and type mood.
- References: sites admired and why; aspirational brands; sites to avoid; direct competitors.
- Brand assets: existing logo, colors, fonts, or greenfield? Must-keep and must-avoid constraints?
- Mode and constraints: dark, light, or both? Accessibility bar? Content volume (sparse vs dense)? Stack? Fidelity (prototype vs production)? Timeline/budget?

Which questions matter, by artifact type:

- Landing page: primary conversion action; positioning (corporate/creative/technical); the single most important proof or differentiator; references.
- SaaS app: core daily task and frequency; user expertise; data/control density; light/dark; existing design system.
- Dashboard: the specific decision it supports; type (operational/analytical/strategic); top 5 to 9 metrics; cadence and device.
- Ecommerce: product type and price point; trust posture; primary objection to overcome; brand maturity.
- Presentation: audience and setting (pitch, sales, internal, conference); narrative arc; live or read.
- Docs/content site: reading length; navigation depth; code-heavy or prose; brand tie-in.
- Portfolio/brand site: the one impression to leave; how design-forward; work to foreground.

### Personality sliders and translation to tokens

Each end pulls concrete token moves. warm <-> cool; playful <-> serious; traditional <-> innovative; minimalist <-> expressive; formal <-> conversational; bold <-> restrained; dense <-> airy.

Built on Aaker's five brand-personality dimensions plus the sliders. Turn adjectives into a token set.

| Personality read | Type | Color | Space / density | Radius / shape | Motion | Imagery |
| --- | --- | --- | --- | --- | --- | --- |
| Sincere / warm / friendly | humanist or rounded sans, generous body | warm neutrals, soft saturated accent | airy, generous | soft to medium radius | gentle, slow | candid, human |
| Exciting / bold / playful | high-contrast display, big weights | bold saturated, maybe two accents | dynamic, asymmetric | varied, sharp or round | energetic, motion as feature | vivid, dynamic |
| Competent / trustworthy | clean neutral sans, clear hierarchy | restrained, one accent, data-forward | structured, balanced | small to medium radius | minimal, functional | charts, proof, clean product |
| Sophisticated / premium | elegant serif display or refined sans | muted or jewel, near-black + off-white, metallic accent | vast whitespace, large type | minimal radius, sharp | slow, deliberate | high-quality, sparse |
| Rugged / industrial | condensed or monospace, heavy weights | high contrast, muted base + one hazard accent | dense, functional grid | zero to small radius, hard edges | abrupt or none | utilitarian, textured |

Slider deltas (stack on top):

- More expressive -> add a second typeface, more color, more motion
- More minimal -> fewer colors, more whitespace, one family across weights
- More playful -> rounder shapes, brighter accent, micro-interactions
- More serious -> tighter grid, restrained palette, sharper shapes
- Denser -> smaller spacing and type steps
- Airier -> larger spacing, fewer elements per view

### Reference transposition

When the user names a site to emulate, or you find one by search: extract its color relationships, type contrast and pairing, density, and one signature move. Borrow those into the token set; do not copy its layout. State what you are borrowing before coding.

## Step 2: Design exploration (single multi-question round)

Use `crtr human ask` to present ALL design questions in one decision deck (4 questions total). For each question, provide 5–7 concrete options with rich descriptions.

**Important:** Mix novel/unconventional directions with standard options. Don't just offer safe choices. For each direction, name the **star of the show** — the typeface, object, image, motif, motion concept, or other seed that should command attention and tell the brand story.

**Question 1 — Overall design language & vibe:**

Propose 5–7 complete design directions like:

- **Airy Modernism** — lots of whitespace, floating elements, soft shadows, gentle animations, light color palette, breathing room between all elements.
- **Dense Brutalism** — tight spacing, sharp edges, high contrast black/white, monospace fonts, minimal padding, unapologetic boldness.
- **Warm Organics** — earthy tones (terracotta, sage, cream), rounded corners everywhere, flowing layouts, natural textures, handcrafted feel.
- **Cyberpunk Neon** — dark backgrounds (#0a0a0a), vibrant accent colors (electric blue, hot pink), glowing effects, futuristic fonts, tech-forward.
- **Academic Minimalism** — serif headings (Crimson, Lora), generous line-height (1.7+), muted colors, clear hierarchy, timeless and refined.
- **Playful Maximalism** — bold colors, varied typography mixing sans/serif/display, unexpected interactions, dense content, joyful chaos.
- **Glassmorphism Luxury** — frosted glass effects, translucent layers, soft blurs, premium feel, depth through transparency.
- *Invent 1–2 novel options based on the product description.*

**Question 2 — Content hierarchy & layout philosophy:**

Propose 5–7 complete layout approaches like:

- **Card-heavy Dashboard** — everything in elevated cards with shadows, lots of compartmentalization, clear boundaries.
- **Continuous Scroll** — long-form layouts, sections flow into each other with subtle dividers, minimal containers, immersive reading.
- **Bento Grid** — Pinterest-style masonry, varied component sizes (1x1, 2x1, 1x2), visual interest through asymmetry.
- **Classic Sidebar Split** — persistent left navigation (200–250px), main content area, traditional app feel.
- **Tabbed Workspace** — minimal chrome, tab-based navigation like VS Code, focused single-pane views, power-user optimized.
- **Magazine Editorial** — large hero imagery, bold typography hierarchies, story-driven layouts, content as the hero.
- **Floating Panels** — draggable/resizable panels, workspace customization, non-linear navigation.
- *Invent 1–2 novel options relevant to their product.*

**Question 3 — Color psychology & emotion:**

Propose 5–7 emotional palettes with specific hex codes.

- **Trust & Professionalism** — Primary: `#2563eb` (blue), Neutral: `#64748b` (slate gray), Accent: `#0891b2` (cyan), conservative and reliable.
- *(etc.)*

**Question 4 — Typography & text personality:**

Propose 5–7 typography systems. Start each system with a heading/display font that embodies the site, then choose the supporting body, UI, and monospace fonts around that anchor. Offer font **combinations**, not isolated families; they may branch across families as long as every choice supports the anchor.

- **Modern Sans Authority** — Headings: Inter/SF Pro, Body: System-ui, clean, professional, highly readable, tech-forward.
- *(etc.)*

## Step 2b: System governance (constant vs variable)

Before building, decide what is fixed and what can flex, so the system scales without drifting:

- Constant: the type families, the core palette and accent, the spacing base unit, the radius and shadow approach, the signature move.
- Variable: layout per page/section, imagery, accent intensity within range, density per context.
- Hierarchy of elements: which tokens dominate (usually type and the accent), which support.
- Application priorities: where the system must be strongest first (hero, primary CTA, key screen).

## Step 3: Clarifying questions

Ask any remaining questions in a second `crtr human ask` decision deck:

- Brand requirements (existing colors, fonts, logos, guidelines)
- Accessibility needs (WCAG level, screen reader support, keyboard navigation)
- Browser/device support priorities (mobile-first? legacy browser support?)
- Performance considerations (animation preferences, image strategies)
- Specific required components (data tables, charts, forms, etc.)
- Content density preferences (information-dense vs. spacious)

## Step 4: Design spec proposal

Before generating the final HTML, create a comprehensive markdown design specification and present it to the user for feedback.

````markdown
# [Product Name] Design Specification

## Design Philosophy
[2–3 paragraphs synthesizing user choices into a cohesive vision]

## Signature Visual Seed
- Star of the show: [typeface/object/image/motif/etc.] — [why it embodies the brand story]
- Visual rhymes: [repeated shapes, colors, textures, border treatments, shadows, motion cues, or other details across logo/buttons/backgrounds/images/etc.]
- Depth & physicality: [3D forms, texture, glass, scroll motion, layering, or other tangible-digital treatments that support the star without competing with it]
- Opacity hierarchy: [how opacity signals importance, with high-opacity primary content/actions and lower-opacity supporting context]

## Color System
- Primary: [color] (#hex) — [usage description]
- Secondary: [color] (#hex) — [usage description]
- Accent: [color] (#hex) — [usage description]
- Neutral Scale: [list all grays with hex codes]
- Semantic Colors:
  - Success: #[hex]
  - Warning: #[hex]
  - Error: #[hex]
  - Info: #[hex]

## Typography
- Heading/Display Anchor: [font name] — [why it embodies the site, where to use it, sizing scale]
- Body Font: [font name] — [how it supports the heading anchor, where to use it, sizing scale]
- UI/Monospace Fonts: [font names] — [how they support the anchor, where to use them]
- Type Scale: [xs, sm, base, lg, xl, 2xl, etc.]
- Line Heights: [heading vs body]
- Font Weights: [which weights for what purpose]

## Spacing System
- Scale: [4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, etc.]
- Usage guidelines: [when to use which spacing]

## Layout
- Container widths: [max-width values]
- Breakpoints: [mobile, tablet, desktop values]
- Grid system: [columns, gaps]
- Navigation approach: [detailed description]
- Content hierarchy: [how sections are organized]

## Components to Include
- Buttons: [variants described]
- Forms: [which input types]
- Cards: [card styles]
- Navigation: [nav components]
- [etc.]

## Interactions & Animations
- Hover effects: [description]
- Transitions: [timing, easing]
- Loading states: [approach]
- Micro-interactions: [specific examples]

## Accessibility
- Color contrast targets: [WCAG level]
- Focus indicators: [style]
- Keyboard navigation: [approach]
- Screen reader considerations: [notes]

## Open Questions / Decisions Needed
[List any remaining ambiguities or choices needing user input]
````

After presenting the spec, ask: *"Please review this design specification. What would you like to adjust?"* Accept iterative feedback. Only proceed to HTML generation after the user approves the spec.

## Step 5: Generate `design-document.html`

Create a single self-contained HTML file.

**Required sections:**

1. **Design system overview** — color palette (hex codes), typography scale (families, sizes, weights), spacing system, border radius values, shadow system, signature visual seed, visual rhymes, depth/physicality rules, and opacity hierarchy.

2. **Core components** — fully styled, interactive examples of buttons (all variants + states), forms (text, email, textarea, select, checkbox, radio), cards (basic, with image, with actions), navigation (header, mobile menu, breadcrumbs), alerts (success, error, warning, info), modals/dialogs, tables, lists, badges/tags, loading states, empty states. Skip components that won't apply to the product.

3. **Interactive examples** — all components with hover/active/focus states, disabled states, responsive behavior, smooth transitions.

**Technical requirements:**

- Single HTML file
- Embedded CSS in a `<style>` tag
- Vanilla JS for interactivity
- Mobile-responsive (Grid/Flexbox)
- CSS custom properties for theming
- Organized sections with clear headings
- Live, clickable examples

**Structure:**

```html
<!-- A brief table of contents as a multi-line comment, so LLMs can read the first few lines and know where things are located -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Product Name] Design System</title>
    <style>
        /* CSS Variables */
        /* Base styles */
        /* Component styles */
        /* Page templates */
        /* Responsive */
    </style>
</head>
<body>
    <!-- Design System Overview -->
    <!-- Components Library -->
    <script>
        // Interactive behaviors
    </script>
</body>
</html>
```

## Execution notes

- Be conversational and enthusiastic during questioning.
- For each round, **propose** specific suggestions — don't just list abstract options.
- **No emojis ever** — use icons.
- Describe complete aesthetic systems, not individual component details.
- Always include 1–2 novel/unconventional options alongside standard choices.
- Anchor every strong landing page or marketing surface around one star of the show — a typeface, object, image, motif, or motion idea that earns attention and carries the story — then make every other choice support it.
- Build cohesion through visual rhyming: repeat small shapes, colors, textures, border details, shadows, image treatments, or motion cues across unrelated elements so the page feels intentionally unified.
- Add depth by crossing tangible and digital qualities — 3D shapes, physical texture, glass, parallax/scroll motion, layered shadows — only when they make the interface feel real without distracting from the star.
- Use opacity as hierarchy: high opacity for the most important content and actions, lower opacity for supporting or ambient material.
- When the user is unsure, recommend based on product context with reasoning.
- The final document should reflect ALL exploration choices made.
- Interpret high-level choices into specific component implementations.
- Include code comments explaining how design choices translated to specific patterns.
- Make the output immediately usable as a developer reference.
