---
kind: knowledge
when-and-why-to-read: When you are building or rewriting a landing page, a marketing site, a product homepage, or any page whose job is to make a visitor take one action, this knowledge should be read because a page built from the default hero, features, call-to-action band and email sign-up reads as generated, and real sites in each category are built around what the visitor came to do and are laid out on a grid at sizes a template never reaches.
short-form: "Marketing pages: name the visitor's job and build the sections its category uses; one capped 12-column container; section heads at 52px and hero heads at 84px at 1440; 120–176px between sections; every section holds something big; pick from 17 section compositions and 8 hero layouts; order sections by the argument, end on the job; decide the nav and footer; few specific words; scroll and squint before shipping."
rationale: >-
  Adapted from Hallmark's anatomy, layout and copy references (github.com/Nutlope/hallmark, MIT), with its scaffold tokens, gate numbers, stamp and log removed. The visual direction and the no-invented-facts rule live in [[web/frontend/visual-design]]; the named whole-page structures in [[web/frontend/page-shapes]]; pictures in [[web/frontend/imagery]]; type, colour, the spacing scale, separators, radii and motion values in [[web/frontend/visual-craft]]; small-screen behaviour in [[web/frontend/responsive]]; the tells checklist in [[web/frontend/ai-tells]]. This document owns what a page contains, in what order, how it is laid out on the grid, and what it says.
---

# Marketing pages

Read [[web/frontend/visual-design]] first: it owns the visual direction and the rule against invented facts. This document owns the page's structure, its layout and its words. For a dashboard, an admin screen, or a tool, use [[web/frontend/interface-design]] instead. A page looks made when every screen holds one idea at the right size. Numbers are at 1440×900 unless a line says otherwise.

## Start from the visitor's job

Name the one thing a visitor comes to do: subscribe, book, visit, attend, buy, try, sign up, hire, join, or listen. The job sets where the action lives, which sections the page needs, and how it ends. The default software layout (text beside a picture, a row of figures, three steps, an email band) fits almost no category except software, and it reads as generated even there.

On every job:

- The nav carries the job's own action word: Book, Tickets, Shop, Listen, Start free.
- The hero shows the thing itself: the room, the cover, the dates, the product screen.
- Proof comes in the category's own form (a menu, a lineup, an archive, a client list), never a generic band of numbers.

| Job | Where the action sits | The category's own sections | How it ends |
|---|---|---|---|
| **subscribe** (newsletter, waitlist, podcast) | In the hero; often the hero is the name, one line, and the email field | A sample or latest issue, set as it arrives; who writes it; the archive with dates; reader count only if given | A second field under the archive. The only job whose close may be an email field |
| **book** (restaurant, class, clinic, studio) | A booking picker or the next free times, in the nav and hero, repeated beside the menu or classes | The room or food as a photograph; the menu or timetable; how to find it; hours and address | Hours, address, and the booking again |
| **visit** (shop, gallery, venue, place) | Today's hours and the address, in the nav or hero | What is on now; what is coming as dated rows; for a shop, the products; getting there | Visit information, or a list for what is on next |
| **attend** (event, festival, conference) | Tickets in the nav from the first screen; the date and place are the headline | Lineup or speakers with names set large; the schedule; ticket tiers with prices; venue and travel; questions | Tickets again, or the questions |
| **buy** (physical product, small shop) | The product with price and options, often as the hero; a buy action after the sections that earn it | The range with prices; the product in use, close up; how it is made; delivery and guarantee as plain facts; reviews only if given | The offer again or the guarantee. An email field goes in the footer, not as the close |
| **try** (app, game, desktop tool) | Store or download buttons right under the headline, one per platform | The main screen captured from the product; features shown as screens, not icon tiles; a before and after; platforms | The download again beside one last screen. Five or six sections is a full page |
| **sign up** (software, API, developer tool) | Start free in the nav and hero, its terms in one line beneath; for a developer tool the install command may be the action | The product at work; what it does, shown; a code sample or integration; pricing with its period switch; questions | The hero's action again in a short band, or the code sample. Never a newsletter |
| **hire** (studio, freelancer, agency) | A plain contact (email, phone, "Talk to us") in the nav and once after the work | The work is the page: projects with client, year, and pictures, one opened as a case study; a short list of services; location | Contact details |
| **join** (club, community, membership) | Join, or "your first visit", in the hero | What a session is like, shown; when and where; membership options with prices; first-visit guidance | The first visit, the options, or a sign-up field |
| **listen** (band, film, publication) | The new release or current issue with its listen, watch, or order buttons | The release with its tracks or contents; dates with ticket links; earlier work; videos | The dates or more of the catalogue |

When the brief gives none of a section's content, build it as a sample the user replaces (an example issue, dishes typical of the cuisine, placeholder track titles) and mark it in the handoff. A sample shows the shape of the real thing; it never states a price, a date, a name, a count, or a review a visitor could take as true. A section whose whole content would be facts nobody gave is one line and a slot, or it is cut.

## Page order

- **The job decides the sections:** where the action lives (in the hero, in a sticky bar, repeated beside the content, at the close) and which of the category's own sections the page is built around. A newsletter puts the subscribe field in the hero and shows the issues; a restaurant shows the menu and the booking; a band shows the record and the dates. The visual direction dresses those sections; it never replaces them.
- **Order follows the argument the page makes,** never hero, three features, a call-to-action band and a footer. Lead with the strongest real thing after the hero, and put each fact where it does work. When the whole page has a recognisable structure (a long document, a bento grid, a tour of the product), [[web/frontend/page-shapes]] names it and says which compositions it uses.
- **Not every page has steps, figures or a schedule.** Steps only for a process the visitor really goes through (booking, joining, getting a festival ticket). A row of figures only for three numbers the brief states outright, never one derived from it (365 mornings from "every day"). Steps, figures, a one-sentence statement and a closing band are the easiest sections to reach for and appear on most generated pages; use each only when the content calls for it, and make that point another way when it does not.
- **Variety:** never the same composition in neighbouring sections (except in a page shape built from one composition); mirror a split once at most, never a zigzag; at least one full-width visual on a product page; one or two bands.
- **Balance:** how much of the page photographs may take is in [[web/frontend/imagery]]; the sections between them are built from type, figures, rules, the product, a table or a form.
- **Pace:** a dense section (a grid, a table, a bento grid, an index) is followed by a quiet one (a statement, a wide picture).
- **The close is the job, not a form.** End on what the visitor came to do, in the form the job takes (the next times to book, the buy box, the store buttons, the next date and the address, the latest issue), or simply on the last strong section and the footer. An email field closes a page only when a mailing list is native to the job (subscribe, join, attend, listen, visit) and the category calls for it, or the user asked for one. A page whose action already sits in the hero or a sticky bar need not repeat it at the foot.

## The canvas

- **One container, centred and capped** at 1360 to 1520px; 1440px with 64px gutters is a good default, so content is 1312px wide at 1440 and stays 1312px at 1920 while the gutters grow to 120px or more. Column counts hold as the screen widens; a grid never gains columns past 1440.
- **Twelve columns inside it,** 32px apart: one column is 80px, four are 416px, six 640px, eight 864px. Every section places its parts on these columns, so left edges line up from the nav to the footer.
- **Every section:** the outer element owns the background and the top and bottom padding; the inner container owns the width and only its left and right padding (a `padding` shorthand on the container silently zeroes the vertical spacing). A full-bleed band changes the background and keeps the container inside it.
- **One container width and one column gap** below the hero. Corner radii, one per nesting level, are in [[web/frontend/visual-craft]].

## Sizes

| Role | At 1440 | Fluid size | Element |
|---|---|---|---|
| Hero heading | 84px | `clamp(2.75rem, 5vw + 1rem, 5.25rem)` | `h1` |
| Long hero heading, or a statement | 60px | `clamp(2.25rem, 4vw + 0.5rem, 3.75rem)` | a class on the heading |
| Section heading | 52px | `clamp(2rem, 2.5vw + 1rem, 3.5rem)` | `h2` |
| Item title | 25px | `clamp(1.25rem, 0.75vw + 0.875rem, 1.625rem)` | `h3` |
| Lead (the one line under a heading) | 21px | `clamp(1.125rem, 0.35vw + 1rem, 1.375rem)` | a class on the paragraph |
| Body | 16px | 1rem | `p` |
| Label, caption, meta | 14px | 0.875rem | `small`, `figcaption`, `th` |

- A section heading under 40px at 1440 is the most common reason a page looks unfinished. The hero heading is about one and a half times the section heading, the section heading about twice the item title. The visual direction changes faces, weights, tracking and case; the steps hold, except that a direction may set its display one step larger.
- A heading and its lead sit 16 to 24px apart; the heading block and the section's content 48 to 64px apart, 40px in a tight composition.
- Grid items sit 32px apart across and 48 to 64px apart down; a card or tinted panel takes 32 to 40px of padding.
- Tracking, leading and measure for each size are in [[web/frontend/visual-craft]]; how the sizes step down on small screens is in [[web/frontend/responsive]].

## Page size and spacing between sections

- **The hero is the first screen only.** At 1280×800 the headline, one sentence, and the primary action are all visible without scrolling.
- **Six to nine sections,** hero and footer included; five on a thin brief, never fewer.
- **About 80 words on any one screen** and 450 visible words on the whole page. A page feels full from scale and pictures, not from more words.
- **One idea per screen,** set big. Each section is built around something worth looking at: the product working, a photograph, a real fact set large, something to try.
- **Gaps between sections** of 120px, 144px and 176px, mixed, never the same at every seam; never under 120px at 1440, except 64px where the background colour changes. A band (a full-width change of background) takes 120px of padding top and bottom.
- **Space is earned by mass:** a 144px gap frames a 700px section and is a hole under a 200px one. An empty-looking page wants a bigger heading, a bigger visual or a fuller section, never a smaller gap.
- **Height follows content:** often 5,000 to 8,000px with pictures and a full brief, 3,000 to 4,000px on a thin one. Never pad toward a height.
- **One primary button style** on the page; button sizes and states are in [[web/frontend/states-and-interactions]].

## What a section holds

A section is one piece of the page's content shown at its best: the menu, the lineup, the latest issue, the product at work, the room, the price. Decide the content first, then the composition that shows it best. Most sections carry a heading block above or beside a body; a section whose content names itself (a menu, a timetable, a track list, a list of issues, the product's own screen) may go without one, or carry its heading inside the content (the menu's own title, the date over the lineup). Never more than two neighbouring sections with the same skeleton: a page of heading-then-block, heading-then-block reads as a template however good each block is.

- **The heading block:** an `h2` of six words or fewer at the section heading size, at most one line at the lead size beneath it, on columns 1 to 6 or 1 to 7, or split (heading on 1 to 5, the line on 7 to 12, baselines aligned). Centred only over a symmetric body, and never more centred heading blocks on the page than left-aligned ones.
- **The body fills the width:** its widest row reaches at least ten of the twelve columns. A narrow text block with the right half empty is the signature of a sparse page; pair it with a visual, split it, or set it as a statement.
- **The body has mass:** a visual 360px tall or more; a set of three or four items across the width; a list or table of three or more rows across ten columns; a working control on the brief's own facts; or a statement at the section heading size or larger. A heading and a paragraph are a heading block, never a section.
- **A split balances:** text and visual are centred on each other within 60px, and neither column leaves more than a fifth of the row empty.
- **Content sets the height:** usually 520 to 900px; under 360px only for a band (a call to action, a logo row, a statement), at most twice a page.

## Section compositions

These are layouts, not components: build each from the brief's content in the page's own visual direction. A page uses three to six different ones and never the same one twice in a row, except in a page shape built from one composition (split rows, a pinned feature run, a catalogue), where neighbours change the ratio and, where the shape allows, the side.

1. **Split.** A text block (heading, line, two to four short facts or one action) beside a visual on columns 6 to 12 or 7 to 12, 440px tall or more at 4:3 to 4:5 (portrait for a product photograph). Swap the side at most once a page; change the ratio (5 and 7, 4 and 8, 6 and 6) between two splits.
2. **Wide picture.** The heading block, then one visual across all twelve columns at 16:9 to 21:9, 560px tall or more; beneath it at most two smaller visuals at 8 and 4 or 7 and 5 columns, never three equal frames.
3. **Grid.** Three or four items across (or two by two): plans, products, places, rooms, dishes, each with its photograph, a large figure or a title big enough to carry the cell, then one line; equal heights, aligned tops, 240px or taller. Never empty frames, stock faces standing in for people, or icon tiles over headings.
4. **Bento grid.** Four to six tiles of mixed spans on six or twelve columns (8 and 4 over 4, 4 and 4; or 7 and 5 over 5 and 7), rows 280 to 360px, at least two tiles with a visual, one clearly the lead.
5. **Rows.** Three to five full-width rows parted by hairlines, 72 to 120px each: a title at the item title size on columns 1 to 5, its line or figure on 6 to 12. A heading block may sit on 1 to 4 beside rows on 5 to 12 (an FAQ, an index, a timeline, a price list).
6. **Table.** Full width, four or five rows of 56 to 72px, tabular numerals, the column that names the row one weight heavier.
7. **Figures.** Three or four real numbers at the statement size (60px), labels beneath, across the twelve columns, parted by vertical hairlines. Only figures the user gave.
8. **Steps.** Three or four stages across, each a numeral (a real `<ol>`, never a "01" label over a heading), a title and a line, with a visual beneath or beside where there is one; or a vertical run with a visual per stage on a fixed side.
9. **Statement.** One sentence filling eight to ten columns in two or three lines, from the section heading size up to the hero heading size (a condensed or light face takes the larger size), with its attribution or one action; once a page.
10. **Band.** A full-width change of background (a second background shade, the text colour as the background, or the accent colour where the direction allows) with the container inside, holding whatever the page's job wants there: the next free table times, the buy box, the store buttons beside a screen, the next date and the address. Never an email field by default.
11. **Form.** The fields on six or seven columns beside the heading block and two to four facts, inputs 48 to 56px tall, one primary action. Field rules are in [[web/frontend/states-and-interactions]].
12. **Rail.** A horizontal run past the container's edge (dates, issues, products, rooms, episodes): five or more items with the next one cut by the edge, scrollable by touch and keyboard, with snap points and no arrows needed past two. The recipe is in [[web/frontend/states-and-interactions]].
13. **Pinned picture.** One visual held sticky on six or seven columns while three or four short panels scroll past on the other side, each changing what the visual shows (a state, a crop, a step); static under 60rem. The scroll-linked build is in [[web/frontend/scroll-animation]].
14. **Switcher.** One area with two to five states behind a segmented control: the menu by lunch and dinner, the plans by month and year, the app on phone and watch, the schedule by day. Every state real; the first visible without script. The recipe is in [[web/frontend/states-and-interactions]].
15. **Index.** A dense, scannable list of the brief's own items with their facts in columns (issues with dates and topics, projects with year and client, episodes with length, lots with estimates), optionally filtered; 6 to 20 rows, the lead row larger.
16. **Schedule.** Time against place or day: a two-day festival as two columns of acts and times, a week of classes, opening hours as a strip; the current or next slot marked. Only for times the visitor picks or plans around, never a process, a workday or a delivery told as clock times.
17. **Offer.** The thing for sale with what a buyer needs at the moment of buying: the photograph or screen, the options (size, scent, plan), the price, the action and one line of delivery or terms. On a buy page it is often the hero. Pricing-table styling is in [[web/frontend/visual-craft]].

Under 60rem every composition stacks in reading order: the heading block, then the body; a split's visual after its text; a grid two across, then one under 40rem; a bento grid's lead tile first; a rail stays a rail; a pinned picture unpins; a schedule becomes one column per day. Visuals keep their aspect ratio and lose their minimum height; nothing scrolls sideways except a rail or a table that says so. The rest of small-screen behaviour is in [[web/frontend/responsive]].

## The hero

The hero is the first screen at 1440×900 and at 1920×1080, and only the first screen. Choose its layout from the job. Text beside a picture is the most common generated hero, so take it only when the picture is the strongest thing the brief has.

| Hero layout | Height | Content |
|---|---|---|
| **Text and picture, half each** | fills the screen under the nav | centred in the screen; the text on six columns, the visual on the other six |
| **Large picture beside the text** | fills the screen under the nav | the text on five columns, a visual on seven at 60 to 75% of the screen's height (reversed when a poster-size heading needs the width); the visual may run off the outer edge |
| **Short hero** | 50 to 60% of the screen | the first section shows above the fold; for references, docs, utilities |
| **Heading at the foot of a tall field** | fills the screen | a tall area of colour or picture above, the heading resting at its base; at 1920 the heading grows to its largest size first |
| **One narrow centred column** | fills the screen | a single column of 44 characters or less, the heading larger than usual |
| **Full-bleed photograph** | 92 to 100dvh | a photograph or canvas edge to edge, the text on its calmest part with room around it, low and left or centred, never squeezed into a corner |
| **The action as the picture** | fills the screen under the nav | the subscribe field with the latest issue, the booking times, the buy box with its options, the download with the screen, set large beside or under a shorter heading |
| **The list as the picture** | fills the screen under the nav | the lineup, the menu, the list of issues or projects, set as the page's lead with the heading small above it; for pages whose list is the reason to come |

- **Centred in its screen.** For the half-and-half, large-picture, short and narrow-column layouts, the space under the content is 1.0 to 1.5 times the space above it, and the lowest content sits within 160px of the fold. Spend spare height on a larger visual or larger type, never on more copy.
- **The visual is big:** six or seven columns wide and at least 60% of the screen's height (520px at 1440×900), or a portrait object (a cover, a phone, a bottle) at 75% of the height on four or five columns, its centre within 60px of the text block's. The hero grid is two tracks (`6fr 5fr` or `5fr 7fr`) with its own gap of 48 to 120px; spans on the twelve columns leave an empty column between text and visual. Under 60rem the gap becomes a 40px row gap. What the visual shows is in [[web/frontend/imagery]]; a working form belongs in a section or the close, not in the default hero.
- **No visual:** the heading grows to the hero size at its largest across eight to twelve columns, or the hero is the short layout and the first section starts by 640px.
- **The text:** a headline of seven words or fewer, one sentence of twelve words or fewer at the lead size, one or two actions. Under 60rem every hero layout shrinks to its content's height (a full-bleed photograph may stay full height).
- **Before it ships,** check the hero visual: it is big, it shows the real thing, the accent colour stays within its share (see [[web/frontend/visual-craft]]), it weighs under 2 MB, and any motion in it has a reduced-motion fallback. If a review finds the hero failing, change the visual, not the copy.

## Nav and footer

Decide both for this page; the default nav (wordmark left, inline links, button right, hairline under) and the default four-column footer are choices only when chosen. Nav height, link states and the sticky offset are in [[web/frontend/visual-craft]]; how the nav collapses on small screens is in [[web/frontend/responsive]].

- **The nav is one line,** sized to the page's real destinations. Options: edge-aligned (the wordmark and one or two links or an action at opposite edges); a floating pill; a masthead (a large centred wordmark over a rule); a heavy full-width bar; a search-led bar with a visible command button; an announcement strip over a bar that retracts on scroll; a three-part bar only for four or more real destinations. A side rail only where a sticky element earns it.
- **The footer closes the page,** 200 to 400px tall: the wordmark or one closing line, the page's real links, the legal line. Options: the wordmark large over the links; one closing sentence large with the links beneath; credits and address as one paragraph; the newsletter form first (only for a subscribe page); a letter's sign-off and a date; index columns only for a hub with a real sitemap. A single line under a hairline suits a letter, a document or a manifesto.

## Pictures

What fills the page (the user's own pictures, then real product screenshots, then the product built in HTML, then licensed photographs, then type), how much of the page photographs may take, and how they are placed are all in [[web/frontend/imagery]].

## Copy

Write as the owner would say it across a counter: the brief's own nouns, a real place, a number the user gave, the verb a customer would use.

- **Swap test.** If a headline would work on a competitor's page, rewrite it with a noun only this product has. "Software that works for you" fits anyone; "Invoices that chase themselves" fits one product.
- **Three tests per line:** can the reader picture it, could it be proven false, could only this business say it.
- **The subhead** says what it is, for whom, and the one difference, in twelve words or fewer.
- **Section headings** say what the visitor will see or get ("Three loaves a morning"), never a category label ("Features", "Our story", "Why us"). Read only the headings and the hero: if they tell the story, the rest is the right length.
- **Rhythm:** a short line beside a longer one; verbs over adjectives; one idea per sentence; no triads of adjectives ("fast, simple, powerful").
- **Refuse the generated voice:** "Reimagine", "Whether you're X or Y", "It's not just X, it's Y", "Say goodbye to", "game-changer", "journey", a colon title ("Focus: the app for…"), "Click here", "Enter your email below", a version string in marketing copy, em dashes.
- **Buttons** name the action ("Book a fitting"). "Continue" only as the second step of a flow.

## Opening a section

The reflex is a small tracked-caps label above every heading. Instead, ask what the reader does not yet know. If nothing, open with nothing. Good openings, one or two per page, alternated:

- Space above and the heading alone, its subject in the first two words. Usually the best choice.
- A lead-in in a heavier weight inside the first paragraph, not on its own line.
- A change of background colour, so the band's edge is the break.
- A caption below the content instead of a label above it.
- A real numbered list only when the content is a real sequence.
- One very large numeral per page at most, only when the number is real and is the point (an issue number, a year, a price that is the offer).

A label is fine when it names something present: a table head, a form label, a tab, a byline or date, a code block's real filename, a plan name.

## Before shipping: scroll, then squint

Scroll the page at 1440×900 one screen at a time and ask whether something on each screen is big enough to be its reason. A screen holding only a heading and a line wants a bigger visual, the line set as a statement, or two sections merged. Then squint: with the words blurred, each section still has a shape and the page a rhythm of heavy and light. Check the measurable parts too: each section body reaches ten columns, section headings are 40px or more, the hero's lowest content is within 160px of the fold, and the photograph share is within [[web/frontend/imagery]]'s limit. The full list of tells is in [[web/frontend/ai-tells]].
