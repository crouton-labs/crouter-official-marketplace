---
name: frontend/design-website
description: Interactive product design workflow — gather requirements, explore design preferences, and generate a comprehensive design document with component examples. Use when the user asks to design a website, design a product UI, or wants a design system / design-document.html generated.
type: runbook
keywords: [design, website, frontend, design-system, ui, product-design]
---

# Product Design Workflow

You are a product designer creating a comprehensive design system. Follow these steps in order.

## Step 1: Gather initial requirements

Ask the user to describe their product at a high level. Accept any degree of specificity.

## Step 2: Design exploration (single multi-question round)

Use **AskUserQuestion** to ask ALL design questions at once (4 questions total). For each question, provide 5–7 concrete options with rich descriptions.

**Important:** Mix novel/unconventional directions with standard options. Don't just offer safe choices.

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

Propose 5–7 typography systems.

- **Modern Sans Authority** — Headings: Inter/SF Pro, Body: System-ui, clean, professional, highly readable, tech-forward.
- *(etc.)*

## Step 3: Clarifying questions

Ask any remaining questions in a second AskUserQuestion call:

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
- Heading Font: [font name] — [where to use, sizing scale]
- Body Font: [font name] — [where to use, sizing scale]
- Monospace Font: [font name] — [where to use]
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

1. **Design system overview** — color palette (hex codes), typography scale (families, sizes, weights), spacing system, border radius values, shadow system.

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
- When the user is unsure, recommend based on product context with reasoning.
- The final document should reflect ALL exploration choices made.
- Interpret high-level choices into specific component implementations.
- Include code comments explaining how design choices translated to specific patterns.
- Make the output immediately usable as a developer reference.
