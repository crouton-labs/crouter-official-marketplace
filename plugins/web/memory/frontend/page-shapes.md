---
kind: knowledge
when-and-why-to-read: When you have designed a landing page or marketing site and need to name and check its overall structure, or a brief gives you no sense of what shape the whole page should take, this knowledge should be read because twenty-one recognisable page shapes each carry a coherent set of heading, body, divider, button, image and reveal choices, and a page that mixes choices from different shapes, or always lands on the same three, reads as generated.
short-form: "Page shapes: 21 whole-page structures (bento grid, long document, statement first screen, led by a figure, product tour, questions and answers, manifesto, photographs first, led by a quote, type and publishing page, catalogue, letter, list of links, stages over time, split rows, pinned feature run, typeface demonstration, portfolio grid, one big diagram, browse page, live examples with code), each described by six choices; three candidate shapes per domain; the honest section set for a software page. A vocabulary to name what you designed, not a menu to pick from first."
rationale: >-
  Adapted from Hallmark's macrostructures reference and its 21 shape files (github.com/Nutlope/hallmark, MIT), with its rotation log, stamp, picks block, mirror test and gate numbers removed and its shape names restated plainly. The section compositions, hero layouts, page order, nav and footer that these shapes are built from live in [[web/frontend/marketing-pages]]; pictures and the photograph share in [[web/frontend/imagery]]; motion durations and easings in [[web/frontend/visual-craft]]; scroll-linked patterns in [[web/frontend/scroll-animation]]; disclosures, rails and switchers in [[web/frontend/states-and-interactions]]; charts in [[web/frontend/data-viz]].
---

# Page shapes

A page shape is the structure of a whole page: where headings sit, how the body is laid out, what separates sections, how the action looks, how pictures are treated, and what moves. This document names twenty-one of them. The section compositions and hero layouts they are built from are in [[web/frontend/marketing-pages]].

**This is a vocabulary, not a menu.** Design the page the brief asks for, starting from the visitor's job in [[web/frontend/marketing-pages]], then name the shape you designed and check it against that shape's entry. Reaching in here first and building whatever comes back is how twenty-one shapes collapse into the same three. When nothing here fits what you designed, say so, describe it by the six choices below, and give it a short plain name ("a season page"). Name the shape in your design plan and the handoff, so a reviewer knows what the page is trying to be. Two pages for two different briefs must look like different sites, not colour swaps of one template.

## The six choices that describe a page's structure

Make one choice on each line, and make them from the same world: a justified newspaper body wants a link set in type as its action, not an oversized filled button.

1. **Heading placement.** In the left margin beside the body (never a small label beside a heading; see opening a section in [[web/frontend/marketing-pages]]) · hanging, with open space above the body · centred display · at the foot, with content above it · over a photograph or a block of colour · sticky or pinned · numbered because the content is a sequence (a real `<ol>` with CSS counters, or one numeral at poster size) · inline with the body, emerging from the prose. Any placement works; what reads as a mistake is a narrow centred heading over full-width left-aligned content.
2. **Body layout.** Single column · two unequal columns (a wide body, a narrow margin for captions) · several justified, hyphenated columns · sidenotes in the outer margin · three equal columns for reference density · a 65-character body with quotes and pictures running full-bleed · unequal spans on the grid (2, 1, 3).
3. **Divider.** A hairline rule (0.5 to 1px, inset or full width) · an ornament (a fleuron, a dot, a mark) · space alone · a change of background colour · a double rule. Use one kind of divider for the page and vary its weight and placement from seam to seam: the same rule at the same gap at every seam is the template. The general order of separators is in [[web/frontend/visual-craft]].
4. **Button style.** One filled primary · outlined · an underlined word · an oversized filled button · a word in a heavier weight with no box · a form field as the action.
5. **Image treatment.** Full-bleed · cropped tightly to the grid · inline with the text · aligned to the margin · none.
6. **Reveal.** A staggered fade-up, once · content sliding in from the side · a clip-path opening over a heading · a figure counting up (only on real figures) · typed text (a terminal only, the cursor inside a typed command) · none. One reveal per page; durations and easings are in [[web/frontend/visual-craft]].

## The twenty-one shapes

### 1. Bento grid

Blocks of mixed sizes in an irregular grid, each a feature, a figure the user gave, a picture or a supplied quote. The rhythm comes from the size changes, not from identical cards.

- **Heading:** a display heading over the grid's first row; the hero is one screen and the grid starts inside it or right under it, never after a tall empty band.
- **Body:** six to nine blocks of mixed spans (1×1, 2×1, 1×2, 2×2); image tracks `minmax(0, 1fr)`.
- **Divider:** the grid gap alone, no rules.
- **Button:** outlined in the hero; inside a tile, a link carrying a verb.
- **Image:** cropped tightly inside single blocks, never full-bleed.
- **Reveal:** none, or one fade as the grid enters.
- **Use** when there are many small things to show and several equally good entry points: a feature page, a software landing page. A block holding a figure or a quote exists only when the user supplied it. **Avoid** when the message is one idea; a bento grid spreads attention.
- **Compositions:** bento grid and grid.

### 2. Long document

Reads like a memo, a letter or a journal entry: continuous prose with inline section headings and no marketing structure.

- **Heading:** inline with the body; section headings emerge from the paragraphs as short bold phrases.
- **Body:** a single column, line-height 1.65 or more, 60 to 65 characters wide.
- **Divider:** space; at most one centred ornament for emphasis.
- **Button:** a link inside a paragraph carrying a verb, never a separate block; it is the first screen's one visible action.
- **Image:** inline, as wide as the text column, never full-bleed.
- **Reveal:** none.
- **Use** for case studies, founder posts, mission pages, and products whose sale is an argument; the brief says "tell a story", not "list features". **Avoid** when there is one decisive action to take, because the actions hide inside sentences.
- **Recipe:** the inline heading is the heavier lead-in from opening a section in [[web/frontend/marketing-pages]]:

```css
.prose { max-width: 65ch; }
.prose h2.inline { display: inline; font: inherit; font-weight: 700; letter-spacing: normal; }
.prose h2.inline + p { display: inline; }
```

### 3. Statement first screen

One statement or one picture fills the first screen; below it the page becomes something else (a list, a grid, prose).

- **Heading:** display type filling the first screen at `clamp(4rem, 10vw, 9rem)`, reaching the container's edges; an uppercase heading that can wrap keeps line-height 1.0 or more.
- **Body:** below the first screen, a list of work or one block of content; the hero does not continue.
- **Divider:** a thick rule or a hard change of background between the first screen and the rest.
- **Button:** one action at the foot of the statement, with the one sentence, both small: a link or a single button.
- **Image:** none in the first screen (the type is the picture), or one full-bleed photograph behind it.
- **Reveal:** the first screen is still; the content below may slide in from the side.
- **Use** when the brand or the person is the message: designer and director portfolios, small products with one strong voice, any "this is who we are" page. **Avoid** for products that need explaining in seconds; the visitor has to scroll before they understand.
- **Compositions:** a full-bleed photograph or one-narrow-column hero; below it rows, a grid or a wide picture.

### 4. Led by a figure

The hero is a number the user gave, with the line that says what it means; everything after supports or qualifies it.

- **Heading:** a large numeral at poster scale with tabular figures, beside or above a worded headline that says what it means ("Four seconds. From the alert link to the slow span."). The figure is the largest element and never the hero's only words.
- **Body:** each section anchored by a supporting figure or chart.
- **Divider:** hairlines between figure blocks; tabular figures throughout.
- **Button:** outlined, under the qualifying line, carrying a verb ("Read the report").
- **Image:** charts (see [[web/frontend/data-viz]]); product photographs only where the user asked for them.
- **Reveal:** the hero figure counts up from 0 over about 420ms, allowed only because the figure is real; the markup holds the final number, so it reads with scripting off and under reduced motion.
- **Use** when the user has proof in numbers: enterprise and business software, fundraising, climate and impact pages. **Avoid** when the user has given no number. Every figure carries its unit and its source; a made-up big number is worse than none.
- **Compositions:** figures for the supporting row, rows for the qualifications.

### 5. Product tour

Real screenshots of the product are the main content: a guided tour of the app in use, with short captions in place of marketing copy.

- **Heading:** plain and functional at the section heading size; the screenshots do the talking.
- **Body:** a sequence of screenshots, each a `<figure>` with a `<figcaption>` stating a fact, and one annotation on the screen.
- **Divider:** the figures themselves, with space between.
- **Button:** the hero's one action; optionally a sticky bottom bar carrying it after the third screenshot, labelled with the verb ("Start a project").
- **Image:** the real screenshot, unframed, with no drawn browser or device frame; until it exists, the product built in HTML (see [[web/frontend/imagery]]).
- **Reveal:** one clip-path opening on the first caption; the screenshots load at once.
- **Use** for software, developer tools, editor extensions, anywhere seeing the product in use is the sale. **Avoid** when the product is an idea or a service with no interface to show.
- **Compositions:** wide picture and split for the screenshots, a band for the close.

### 6. Questions and answers

Bold questions with prompt answers; the page reads like an honest interview with the product.

- **Heading:** each section is a question: a short direct phrase ending in "?".
- **Body:** the answer in one or two short paragraphs under the question.
- **Divider:** a hairline between pairs, or a change of background.
- **Button:** a link inside an answer carrying a verb ("Read the policy"); one outlined action at the foot.
- **Image:** sparse; at most one diagram in a long answer.
- **Reveal:** none on load. Each pair may be a `<details>` disclosure that opens over about 420ms by animating `grid-template-rows` from `0fr` to `1fr`; the build is in [[web/frontend/states-and-interactions]].
- **Use** near pricing, for products that meet scepticism, for regulated or educational fields. As the whole page it opens with a hero that asks the first question; otherwise it is a section inside another shape.
- **Compositions:** rows (questions on the left columns, answers on the right) or a single column.

### 7. Manifesto

Large polemical type: the page tells the reader what to believe before it tells them what to buy.

- **Heading:** uppercase display, set straight or tilted 2 to 4 degrees; one weight and one colour throughout, with emphasis from a line break, never from one word in another colour or italic; line-height 1.0 or more when it wraps.
- **Body:** short paragraphs, each one claim, large enough to read across a room.
- **Divider:** changes of background colour between sections, never cards.
- **Button:** one filled button in the accent colour, beside or under the declaration on the first screen, returning at the foot as the page's last word.
- **Image:** none when the cause is an idea; when it is physical (repair, housing, a river), photographs of it, at most one per screen.
- **Reveal:** one slide-in from the side on the first claim below the first screen.
- **Use** for repositioning announcements, mission-led products, a studio's beliefs page. **Avoid** for checkout, pricing or a product tour; a manifesto asks for agreement, and its one action is to show up, sign or join.
- **Compositions:** statements on alternating bands.

### 8. Photographs first

Huge photographs lead each screen and the text is small annotation; the page asks the visitor to look before it asks them to read.

- **Heading:** small: the headline and its sentence sit on a plain panel at the photograph's base, and a caption near a corner carries a fact in the body face; never a centred display heading.
- **Body:** full-bleed photograph bands alternating with sections built from type alone (a menu as rows, the hours as a table, a statement). Photographs may cover up to about 45% of the page below the hero and never lead two sections in a row (see [[web/frontend/imagery]]).
- **Divider:** the photograph's edge, no rules.
- **Button:** a link on the panel under the sentence, carrying a verb; the first screen's one visible action.
- **Image:** the whole point: full-bleed, the user's own photographs.
- **Reveal:** no movement; the photographs do the work.
- **Use** for fashion, hospitality, photography portfolios, lifestyle shops, any brand whose product is a feeling. **Avoid** when the subject has nothing to photograph.
- **Compositions:** a full-bleed photograph hero and wide pictures.

### 9. Led by a quote

The hero is a quote the user supplied, with its attribution; the headline is someone else's voice.

- **Heading:** the quote in an italic display at the statement size (60px at 1440), the whole quote italic, never one word; the attribution beneath in the body face, one quiet line.
- **Body:** more supplied quotes, case studies, or a quiet list of features.
- **Divider:** a centred quotation-mark glyph or a short rule between quotes.
- **Button:** a link under the attribution carrying a verb ("Read the case study").
- **Image:** the real person's photograph or the company's mark beside the attribution, or nothing.
- **Reveal:** none on the first screen; further down, a staggered fade is allowed.
- **Use** for business products with strong customer voices, agency case studies, fundraising, anywhere "people like me use this" is what persuades. **Avoid** when the user has not supplied the quote: it is the user's, word for word, with the name, role and company as given, or the shape is not used. Never write or paraphrase one.
- **Compositions:** the quote as a statement, further supplied quotes as rows.

### 10. Type and publishing page

Large serif display, unequal column spans, hairline rules, a link set in type as the action, and generous space: the voice of a foundry, a journal or a press.

- **Heading:** a large serif phrase standing alone. When the content is a real sequence, the number is generated on the heading itself (an `<ol>` with CSS counters), never typed beside or above it.
- **Body:** a narrow margin column (captions, dates, sidenotes) beside a wide content column.
- **Divider:** hairlines between sections.
- **Button:** a link carrying a verb ("Open your studio"), with no box, fill or arrow.
- **Image:** none, or one photograph of the type in print (a poster, a sign, a book spread).
- **Reveal:** a staggered fade-up on first load.
- **Use** only when the brief is about type, publishing or writing (a foundry, a journal, a press), or the user names it; an editorial tone alone does not qualify. It is the most-copied look in the field, and a vague brief that lands here has not been read. **Avoid** for products that need a demo; there is nowhere to put one.
- **Compositions:** rows and a statement.

### 11. Catalogue

A uniform grid of variations of one thing (typefaces, palettes, products); the page is a visual index of what is for sale.

- **Heading:** one line at display size over the grid; the products lead, so the heading never pushes the first row below the first screen.
- **Body:** same-sized cards, three to five a row, each one variant; image tracks `minmax(0, 1fr)`.
- **Divider:** hairlines between rows.
- **Button:** a link in each card to its detail page, no page-wide action; the first card's link is the first screen's visible action.
- **Image:** a thumbnail or swatch per card when the user gave images; otherwise each card set in type (the name, the one fact, the price, a colour swatch where colour is the variant), never a row of empty frames.
- **Reveal:** none.
- **Use** for foundries, palette tools, font shops, colour systems, small collections. **Avoid** for brands with a story or a product with a clear hierarchy; a catalogue treats every item as equal.
- **Compositions:** grid, one card per item with its image, name, price and one action; neighbouring grids change the ratio rather than the composition.

### 12. Letter

First person, written, personal: it opens with a greeting and reads as a note from the founder.

- **Heading:** the greeting ("Dear reader,") in the display italic at 1.5 to 2 times body size, the whole line one style.
- **Body:** a single column of prose, about 50 characters wide, as if typed.
- **Divider:** paragraph spacing; an occasional `* * *`.
- **Button:** none; a link in the sign-off carries the verb ("Join the list"), and on the first screen the visible action is a link in the first paragraph.
- **Image:** a scanned signature, one quiet inline photograph, or nothing.
- **Reveal:** none.
- **Use** for personal brands, founder announcements, sabbatical or change-of-direction pages, donation appeals. **Avoid** for shops; a letter is personal and a shop is functional.
- **Compositions:** the one-narrow-column hero; the footer is a sign-off and a date.

### 13. List of links

The page is a list of links: no hero picture, no narrative, the navigation is the design.

- **Heading:** a short heading at hero size naming the list ("Everything published here, newest first") and one line; the list starts on the first screen.
- **Body:** a vertical list of grouped links, with a filter row or a disclosure above it, never a sidebar by default.
- **Divider:** hairlines between rows, or bands of background colour.
- **Button:** the links are the buttons.
- **Image:** none, or one photograph of the collection, and a small mark by each entry.
- **Reveal:** none.
- **Use** for documentation hubs, knowledge bases, archive front pages, design-system entry pages, link pages with substance. **Avoid** for a hard sell (a launch, a checkout); a personal site offering its owner's time is fine.
- **Compositions:** rows at full width, or an index.

### 14. Stages over time

Numbered stages tell how the visitor uses the product over time; each section is a phase.

- **Heading:** the stage number inside the heading ("1.0 Intake") or generated by an `<ol>` with CSS counters, never a separate label beside the heading.
- **Body:** each stage has a short explanation and one object at full size: a screenshot 360px tall or more when the user gave screens, otherwise a figure or rows from the brief (a timer, a count, the thing the stage produces). Three stages holding the same kind of object read as three features; vary the object from stage to stage.
- **Divider:** a rule between stages; the number stays in the heading, never on the rule.
- **Button:** the hero's one action, returning once at the foot ("Start at stage one"); links inside the stages.
- **Image:** one real screenshot per stage, often annotated; with one screen or none, never an empty frame per stage.
- **Reveal:** one slide-in from the side on the first stage. A scroll-linked run through the stages may replace it (pinned steps in [[web/frontend/scroll-animation]]); one pattern per page.
- **Use** for products with a real workflow: project management, design-to-development pipelines, writing tools. **Avoid** for tools that work in one moment.
- **Compositions:** steps, each stage with its own picture or object.

### 15. Split rows

Every major block splits the screen, text on one side and evidence on the other; the evidence keeps its side down the page.

- **Heading:** half the screen wide; the other half holds a screenshot or a supplied quote.
- **Body:** text-and-evidence rows that vary by weight, not side: one lead row gives the evidence the larger share, the rest split evenly, all with one column gap. The evidence switches side once at most, never a zigzag.
- **Divider:** a clear gutter between the halves, no rules.
- **Button:** outlined, under the text half.
- **Image:** on the evidence side of every row: a real screenshot, or the product built in HTML (see [[web/frontend/imagery]]).
- **Reveal:** the hero's two halves fade in once, 60 to 100ms apart; the rows below are simply there.
- **Use** for software feature pages, developer tools that pair explanation with code, anything where every claim wants something to show for it. **Avoid** for brands built on a story or on photographs; splitting halves the attention.
- **Compositions:** split throughout, changing the ratio between rows.

### 16. Pinned feature run

A sticky left pane holds the heading while the right pane scrolls through related screenshots.

- **Heading:** inside the sticky pane, held while the content beside it changes.
- **Body:** two columns, the left sticky, the right scrolling through three to six screenshots per section.
- **Divider:** section bands; the sticky pane re-docks for each section, offset below a sticky nav.
- **Button:** in the sticky pane, shown once the section's last screenshot is reached; with scripting off it is simply there.
- **Image:** real screenshots in the scrolling column, or the product built in HTML; never a run of empty frames.
- **Reveal:** no fades; the sticky scroll is the motion. Build it with the pinned two-pane or pinned steps pattern in [[web/frontend/scroll-animation]]; one pattern per page.
- **Use** for premium products, complex features, anywhere the pace should be set as the visitor scrolls. **Avoid** for audiences mostly on phones unless the fallback is strong. Under 60rem the sticky pane becomes a heading above its screenshots, in normal flow.
- **Compositions:** pinned picture.

### 17. Typeface demonstration

The typeface is the design: foundry pages and design systems where a custom face is the evidence.

- **Heading:** the typeface set at several sizes, showing what it does.
- **Body:** a progressive demonstration: display size, body size, italic, language coverage, OpenType features.
- **Divider:** a `<figcaption>` under each sample; a caption below is fine, a label above is not.
- **Button:** one outlined action ("Buy the family") on the first screen, returning at the foot.
- **Image:** none; the type is the picture.
- **Reveal:** one clip-path opening on the first sample as it paints.
- **Use** for type foundries, font product pages, design systems where a custom face is the difference. **Avoid** when the brand uses an off-the-shelf face.
- **Compositions:** statements and rows of samples at full width.

### 18. Portfolio grid

Filterable cards of projects; the work is the product.

- **Heading:** a short line above the grid, no display heading.
- **Body:** a grid of project cards, the same size or with slight size changes; image tracks `minmax(0, 1fr)`.
- **Divider:** the filter row above the grid, no rules inside it.
- **Button:** a link in each card ("View the case study"), no page-wide action; the first card's link is the first screen's visible action.
- **Image:** a thumbnail per card from the user's work; until it arrives, the projects set in type with at most one empty frame. Photographs may take up to about 45% of the page (see [[web/frontend/imagery]]).
- **Reveal:** cards fade when the filter changes.
- **Use** for design studios, agencies, photographers, any creative business where the work is the pitch. **Avoid** for products.
- **Compositions:** grid with a filter row, or an index.

### 19. One big diagram

A single large spatial diagram organises the page: a flowchart, a floor plan, a network graph, a system map.

- **Heading:** a short orienting heading at section size above or beside the diagram.
- **Body:** the diagram itself, nodes and edges, with a legend.
- **Divider:** none inside; the diagram is one composition.
- **Button:** links inside nodes; the page's one action sits with the orienting heading on the first screen, never under the diagram.
- **Image:** the diagram, an SVG drawn from the real places or the real system, with hover states; labelled, or `aria-hidden` with a text legend that carries every fact.
- **Reveal:** nodes appear one by one as the diagram enters the screen, five at most, once.
- **Use** for system overviews, maps of a set of products, process diagrams, organisation charts. **Avoid** as a substitute for a story that should be read in order. Under 60rem the diagram scrolls sideways inside a wrapper, or becomes an ordered list of its nodes.
- **Compositions:** one wide picture (the diagram) plus rows for detail.

### 20. Browse page

Several ways in to a platform's content (featured, latest, by category, by person); the value is browsing, not a claim.

- **Heading:** one positioning line, no display heading.
- **Body:** several horizontal rails or grids, each showing a different cut of the content.
- **Divider:** each rail opens with its own `<h2>`, never a label strip; a hairline or a change of background between rails.
- **Button:** a link at each rail's edge carrying a verb ("See all templates"); rarely a page-wide action, so the first rail's link is the first screen's visible action.
- **Image:** thumbnails throughout, all of them the platform's real content.
- **Reveal:** none.
- **Use** for community platforms, content marketplaces, asset stores, curated catalogue front pages. **Avoid** for a single product.
- **Compositions:** rails and grids.

### 21. Live examples with code

Interactive previews with their code are the page's main content; each block shows a thing and how to copy it.

- **Heading:** each category a real `<h2>` ("Buttons", "Forms", "Cards") in the display face, sentence case, never a label strip.
- **Body:** a preview, then its code, block after block, often with a row of tabs to switch frameworks; the tab row scrolls sideways under 60rem.
- **Divider:** a change of background per category, hairlines between examples.
- **Button:** a "Copy" button on every code block whose label changes to "Copied", never a toast.
- **Image:** the previews are the pictures; at most one photograph band.
- **Reveal:** none.
- **Use** for design systems, component libraries, snippet sites, framework documentation. **Avoid** for marketing pages; this is a utility, not a pitch. A monospace face appears only inside the code blocks; tab labels and captions stay in the body face.
- **Compositions:** switcher (for the framework tabs) and full-width examples.

## Three shapes for each domain

When the brief names no structure, start from the domain's three. They come from different kinds of shape (led by a grid, by prose, by one big first screen, by the product), never three near-twins. Let the material decide between them: a shape built on screenshots or figures needs them, real or as slots the user asked for; with neither, choose a shape that carries type and facts. Words in the brief such as "data heavy", "tell a story", "a list of links", "many small features" or "personal note" point at one shape directly.

| Domain words | Three shapes |
|---|---|
| podcast, audio, music, listening | photographs first · led by a quote · letter |
| shop, store, product, merchandise | catalogue · photographs first · bento grid |
| docs, CLI, SDK, API, library, open source | product tour · long document · live examples with code |
| platform, infrastructure, observability, business tool | bento grid · product tour · led by a figure |
| agency, studio, case studies, portfolio | portfolio grid · split rows · list of links |
| personal one-pager, about me, résumé | long document · letter · list of links |
| restaurant, café, bar, food, menu | photographs first · long document · catalogue |
| fashion, apparel, beauty, lookbook | photographs first (with real photographs) · catalogue · statement first screen |
| fintech, banking, payments, trading | led by a figure · product tour · long document |
| manifesto, campaign, cause, advocacy | manifesto · led by a quote · led by a figure |
| editorial, foundry, magazine, type | type and publishing page · long document · typeface demonstration |
| product launch, software marketing | bento grid · product tour · led by a figure |
| conference, event, speaker | statement first screen · manifesto · photographs first |
| no signal at all | bento grid · long document · manifesto |

Developer documentation and developer marketing are different briefs (a walkthrough wants a product tour; the landing page wants a bento grid with a lead figure), as are a one-pager and a portfolio of case studies; what the page is for decides. A vague tone word ("modern", "clean") is read through the domain and stated as an inference, never asked as a second question.

## Sections for a software page

When the shape is a bento grid, led by a figure, a product tour or a statement first screen and the brief is business software, build from these sections. Each has a job, not a fixed position. The first set can always be built honestly without inventing anything; the second exists only when the user handed over the material.

**Always available:**

| Section | What it shows | Composition |
|---|---|---|
| Specifications | what it is, in figures the product ships with: limits, formats, versions, regions | table or rows |
| A worked example | the product doing one real job on the user's material: a command and its output, a screenshot and its caption | wide picture or split |
| Changelog | the last three or four entries with their real dates, showing the product is alive | rows |
| Side-by-side comparison | the product beside the way it is done today, row by row, no scores | table |
| Pricing | the actual price in two or three tiers; "Contact sales" on every tier tells buyers they are not trusted | offer; table styling in [[web/frontend/visual-craft]] |
| Questions | real objections answered like a person: "Yes, both providers work out of the box" beats "integrates with leading providers" | rows, as in questions and answers above |
| Call to action | the ask, once, one button | band |
| Footer | the close | see [[web/frontend/marketing-pages]] |

**Only with the user's material:**

| Section | Needs | Without it |
|---|---|---|
| Hero picture | a real screenshot | the product built in HTML (see [[web/frontend/imagery]]), or a hero made of type |
| Logo row | the user's own customer logos, with permission to show them | no section: no invented logos, no "Trusted by" line |
| Three features | three named capabilities, each with a screenshot or figure to show | fold them into the worked example or the specifications |
| Testimonials | quotes the user supplied word for word, with the person's name, role and company as given | no section: no plausible names, no paraphrase |

Do not build every available section in the order above. Leave at least one out (the call-to-action band is the usual cut; the footer never goes), and either move one into the hero's place (the specifications as the hero says "the numbers are the pitch"; a worked example as the hero says "watch it work") or swap a neighbouring pair where the order says something (pricing before the example says "the price is the pitch"). Keep at least five sections, or the page is too thin; add sections back or choose another shape.

The shape decides how each section looks: a bento grid places the specifications and the example inside the grid; a page led by a figure runs them top to bottom under the figure; a statement first screen lets the statement carry the claim and the example carry the evidence. Spacing between them follows [[web/frontend/marketing-pages]]. For any other kind of page (a bakery, a letter, a manifesto) this list does not apply.
