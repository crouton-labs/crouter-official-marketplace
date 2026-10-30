---
kind: knowledge
when-and-why-to-read: When you are asked to redesign, restyle, reskin or polish an existing page, site or app screen in the user's own code, this knowledge should be read because a redesign that drops a link, a form field, a handler or a test hook breaks the product while looking finished, and one that quietly changes the words, the brand or the depth the user asked for is not the redesign they wanted.
short-form: "Redesign: keep the content, the wiring, the files, the brand and the words; work at the depth the request names (full by default, restyle or polish only when asked); ask three questions; plan the files before touching any; write down every link, field, handler, id and heading before changing anything and confirm each one after; run the project's own checks; finish with the before/after review."
rationale: >-
  Adapted from Hallmark's redesign reference (github.com/Nutlope/hallmark, MIT), with its linter's before/after record replaced by a manual inventory and its stamp, log, scaffold and audit tooling removed. The finished-page review and its redesign variant are [[web/frontend/design-review]]; the checklist of machine-made tells is [[web/frontend/ai-tells]]; the visual direction for a full redesign is [[web/frontend/visual-design]]; page structure and copy are [[web/frontend/marketing-pages]]; app screens are [[web/frontend/interface-design]]. This document owns what a redesign keeps, its depths, the ask, the plan, and the before/after check.
---

# Redesign

A redesign rebuilds a page that already exists. The target is the user's own code: a file, a folder, or a route on a dev server. A live URL with no source behind it can only be reviewed, not redesigned. Everything in [[web/frontend/visual-design]] still applies; this document says what the redesign keeps, how deep it goes, what to ask, and how to prove nothing went missing.

## What a redesign keeps

- **The content.** Every fact, claim, name, price, date and quote the page states. Figures, quotes and logos already there are the user's material: carry them over as found and list them in the handoff for the user to verify, including any you doubt (a trend line nobody measured). Add nothing: no action, section, claim or picture the page did not have, beyond what the user hands over and what correctness requires (a pause control on a looping animation, a focus ring). A drawing made from the page's own facts (its steps, its channels, one of its figures) is composition, and a full redesign may make one.
- **The wiring.** Every link, form, field, handler, route, id and test hook; every script, data call and analytics call. Edit markup inside the component that owns it. Never move logic, rename a prop, or drop a `name`, `id`, `key`, `type`, `href` or `data-testid` that a script or a test reads. A prop that only fed something the redesign removes on purpose (an emoji passed in as an icon) may go with it, named in the handoff. A state the screen has no logic for (a failed load, an undo) is listed for the owner, never built.
- **The files.** No file deleted, no route removed and no component tree replaced without a file-level plan the user approved, and no test edited to make the redesign pass. Documents in the repo (a README, a prompt, a deck) explain the product; they are not page copy. In a git project, start from a clean working tree: ask the user to commit or stash, never do it for them, so the redesign is one diff they can read and revert.
- **The brand, when there is one.** A brand is chosen: a logo, a colour or a typeface the project names (a brand file, a logo asset, named design tokens, a font file of its own) or the user states. It stays at every depth, its values read from the project's files, never from memory. A framework default or a generic AI look (the purple-to-blue gradient, Inter as the display face, a stock framework palette) is not a brand: a restyle or full redesign replaces it, and the plan says so in case the user meant it.
- **The words, unless they read as generated.** Wording that is a template line, a generic opener, or a heading that would fit any competitor ([[web/frontend/marketing-pages]] and [[web/frontend/ai-tells]] name these) is tightened using only the facts already on the page, and the handoff lists every changed line, before and after. A small label above a heading is never just deleted: where the heading is figurative, the plain label becomes the heading ("Opening hours" over "When to find us" becomes "Opening hours"). Terms, disclaimers and consent text are never reworded. When the user says to keep every word, keep every word, and mention in the handoff any line you would have changed.

## Depth

The default is a **full** redesign. A lighter depth runs only when the request asks for it in so many words, and the plan names the depth.

| Depth | Stays | Changes | Only when the request says |
| --- | --- | --- | --- |
| **full** | the content and the wiring | the visual system and the composition: page shape, hero, sections, nav and footer | nothing else; it is what "redesign" means |
| **restyle** | the layout | the visual system: colour, type, corner radius, shadow, motion, the controls | "keep the layout", "restyle", "reskin", "only the colours and type" |
| **polish** | the visual system and the layout | only defects and machine-made tells: contrast, missing states, motion, stray values | "polish", "keep our look", "only fix what looks generated" |

The depths do not blend. A polish that finds the concept wrong says so and recommends a full redesign; it never slips one in. Where the layout stays (restyle and polish), do not re-space or re-scale the page and do not cut words to fit a word budget: list the layout problems only a full redesign would fix in the handoff instead.

**A full redesign of an app screen** recomposes each screen inside the shell it already has: what leads, and how the figures, tables and forms are arranged ([[web/frontend/interface-design]]). Routes, destinations and each component's logic stay. There is no hero and no first-screen review.

Redesigning "from scratch" is a new build, not a depth: build in new files beside the old ones, using the old page as the list of what the new one must contain.

## Before you change anything

1. **List the pages in the target:** route, file, and whether each is a marketing page or an app screen. In a framework project, start the dev server and work from the rendered routes; a framework's empty shell `index.html` read from disk is not the page.
2. **Write down the inventory**, in a file in your working notes, one section per page. Get it from both the source (grep it) and the rendered page (read the DOM in a browser), because each misses things the other has:
   - every link and its `href`;
   - every form, its `action` and `method`, and every field with its `name`, `id` and `type`;
   - every event handler (`onClick`, `onSubmit`, inline `on*` attributes, listeners a script attaches);
   - every route the page links to or the router defines for it;
   - every `id` and every `data-testid`;
   - every script tag, data call and analytics call;
   - every selector a script or a test queries (`querySelector`, `getElementById`, test locators);
   - every heading, in order, with its text;
   - every figure, image and number the page states.
3. **Take the before screenshots:** the first screen at a phone width (375×812), at 1280×800 and at 1920×1080, plus a full-page capture at 1280 and at 375 wide. Keep them; the finished-page review needs them.
4. **Write the read**, in four lines, after looking at the screenshots and before reading any list of problems: what the page is for (the audience, the one action); what works and stays (at least one thing); what reads as generated (the worst tells, from [[web/frontend/ai-tells]]); what is broken.

If the user asked only for an audit or a review, stop here: report the read and the problems with `file:line`, the lightest depth that would fix them, and what only a deeper one would. Change no files.

## The ask

Send one message, unless the request already answers it or no one is there to answer:

> Before I redesign, three things. 1. **What must stay**: the brand, a section, a page? Say "keep the layout" and I will only restyle. 2. **What is wrong with it**, in your words, and the feeling you want instead. 3. **Anything new to show**: screenshots, photos, numbers, a quote. Or say **go ahead** and I will redesign it in full.

## The plan

Before deleting or moving anything, show the user a short plan and wait for approval of the file changes:

```markdown
- **Redesign** · full · 3 pages (/, /pricing, /docs)
- **Before** · a centred template in a stock indigo; the pricing table is clear and stays
- **Keeps** · every link, field and handler · the green and the brand typeface · the pricing table
- **Files** · edit: app/page.tsx, app/pricing/page.tsx, app/globals.css · create: app/tokens.css · delete: none
```

At restyle and full depth, follow it with the visual direction ([[web/frontend/visual-design]]); at full depth, also the page shape, hero and sections, built from the page's own content ([[web/frontend/marketing-pages]]). When choosing a direction, describe the page in plain nouns from your read, not with the page's own copy, which is what the redesign is leaving behind. At polish the plan stops after Files.

## Build

- **Polish:** fix in place, single elements and values, never restructure.
- **Restyle and full:** put the new colour, type, spacing and radius values in one token file beside the project's stylesheet (or in its existing token or theme config) and import it; then the shared components and the nav and footer, then the pages, the most visited first, each checked before the next.
- **More than one page** at restyle or full: settle the visual system once and write it down where every page reads it. Pages share colour, type and accent, and differ only in shape. Past three pages, give each page to its own child node with the written system, the page's files and this document.
- **Full depth** builds the first screen and runs the first-screen review ([[web/frontend/design-review]]) before the rest; restyle and polish skip it. At that stage the old sections still sit below the new first screen; they are dealt with in the full build, not judged then. Keeping the page's order of content in a new composition is fine.

## After

1. **Check the inventory.** Go through every line of the list you wrote before and confirm, in the source and in the rendered page, that it is still there and still works: the link still points where it did, the field keeps its `name`, `id` and `type`, the handler still fires, the selector still matches. Each item is either still present, or was dropped on purpose and is named in the handoff with the reason (the user is retiring the blog; a heading was reworded and here is the before and after). A link, form, field, handler, test hook, script or queried selector that went missing by accident is restored before you go on.
2. **Run the project's own checks,** where it has them: the type check, the build, the tests. A redesign that breaks one is not finished.
3. **Run the finished-page review** ([[web/frontend/design-review]]), with the before screenshots, so it also answers what the old page did better. A polish sends only the full pages at 1280, before and after, and takes at most five findings. A finding that is a plain defect (a misalignment, a broken glyph, a label that lies) is fixed at any depth; one that asks for a new composition goes in the handoff's layout list when the layout was meant to stay; one that asks for content the page never had goes to the owner in the handoff.
4. **Hand off.** Where the layout stayed, add a Layout row listing what only a full redesign would fix:

```text
Redesign · full · 3 pages
Kept     14/14 links · 5/5 fields · 9/9 handlers · 11/11 headings · every figure
Changed  the visual system and the composition: page shape, hero, sections, nav and footer
Dropped  none
Yours    2 claims kept as found ("50,000+ teams", the Acme quote) · 4 lines reworded, listed below
Before   before screenshots at <path>; after screenshots at <path>
```
