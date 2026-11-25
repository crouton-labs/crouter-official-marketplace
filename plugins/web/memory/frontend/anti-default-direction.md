---
kind: knowledge
when-and-why-to-read: When a visual choice is left open to you (no style named, nothing to inherit), or the user says the result is too generic, too safe or "looks like AI", this knowledge should be read because a model's first pick is nearly the same for every brief, telling it to avoid that pick only lands on its second favourite, and a model that picks from its own shortlist picks the same winner every run.
short-form: "Escaping the default pick: name the default and don't use it; start from the case's facts or a manually rolled seed; why rejection and self-selection fail; the dealt-direction procedure (scene, material inventory, job, the rut, calibration clusters, tone, seven ranked directions, build #3–#7, structure, mirror test, direction card); craft before boldness; working tools; pre-emit critique; ground borrowed forms in a produced system; commit before softening; strip the skin and check the skeleton; the default app shell; escapes that become defaults; check before showing."
rationale: >-
  Adapted from three MIT sources, wording kept: antialgorithm (github.com/mankidev/antialgorithm, MIT) SKILL.md and visuals.md; frontend-design-deslop by samber (github.com/samber/cc-skills, MIT) references/divergence.md; better-design (github.com/Moddingflow/better-design, MIT) references/direction-deal.md, which itself credits Hallmark (github.com/Nutlope/hallmark, MIT) and Impeccable (github.com/pbakaus/impeccable, Apache-2.0). Their scripts (seed.py, moves.py, deal_direction.mjs, rough.py, check.py) and the deal log are left out; rolling a seed and keeping a log of moves are described as things done by hand. This document owns what to do when no look was chosen. Neighbours: the art-direction process it feeds ([[web/frontend/art-direction]]), named looks to start from ([[web/frontend/style-presets]]), the list of AI-default looks ([[web/frontend/ai-tells]]), image methods and their marks ([[web/frontend/imagery]]).
---

# Anti-default direction: when nobody chose a look

Use this when a surface's identity is part of the task (landing, brand, portfolio, consumer app, event, shop, launcher) and the user gave **no visual cue** and there is **nothing to inherit** (no design document, brand, code tokens, or live UI). Not for: an existing system (inherit it), an explicit visual request (follow it with [[web/frontend/art-direction]]), a focused fix, or an audit.

The user's standing rules, in CLAUDE.md, AGENTS.md or similar files and memory, always win over this document. If a rule there fixes the shape, the wording, the palette or the content of a piece, follow it and use this only for what is still open. If the user asks for the plain, standard or expected version, give it.

## The rule

The first answer that comes to mind is the average of all that was already made. It feels right because it is familiar, and that is the problem: the user has seen it a thousand times.

Before you give a creative answer, find the obvious one first. Say it to yourself in one line: "the default here is X." Then do not use X unless the context truly asks for it.

Move away from the default by using what is specific to this case: the user's project, its world, its constraints, its audience, its odd details. A good choice could only belong here. A default choice could belong anywhere.

Do not swap one cliche for its well-known opposite. "Dark instead of bright" or "minimal instead of busy" is just the second most common answer.

Strange is not the goal. A choice that is odd but has no reason is as empty as a safe one. Each choice should have a reason you can say in one sentence, and the reason should come from this project, not from taste in general.

When you give options, make them different in kind, not small variations of one safe idea. One option may be the safe one, but say so, and never make it the only real choice. Give one recommendation and the reason for it. Do not hide behind a long neutral list.

## Where to start

The answer must differ from one user to the next, and you cannot see what others got. So the start point has to come from outside your own taste:

1. If the request carries real context, such as a project, a place, a person, a purpose or a constraint, start from that.
2. If the work is long or costly, such as a full design, ask one short question first: who it is for, where it lives or what it is about. If the work is short, make it from a seed or a stated guess, then ask one short question at the end that would make it fit better. The question asks for a fact about the case, not for leave to redo the work.
3. If the request is thin and the user wants the work now, or cannot answer, roll a seed: pick, by an arbitrary rule you fix before looking (the minute of the clock, a die, the Nth item of a list), a starting material, a method (print, screen, camera, material), a region and a verb. Use what it gives as the starting point. Build the idea behind the piece from the verb, who does what, instead of a twist you think of yourself. You may re-roll one axis once if it truly fights the subject. Then tie the seed to the subject with a reason.

Never pick the start point by thinking about what would be most interesting. That thought lands on the same place for all users.

A region places the setting: the land, the weather and the buildings around it, and the names, habits and way of speaking of the people there. Take what someone who lives there would know from a normal week: the brand on the bus stop, the way a neighbor greets you, what is broken and nobody fixes. Leave out what an outsider lists first, such as the national dish, the costume, the famous sight, the flag colors or the accent played for laughs. If you do not know enough real daily detail about the region, use less of it instead of filling the gap with the famous parts.

## Why the model converges

Exhortation is not a mechanism. These findings come from a measured campaign of about 200 sampled, human-graded concepts.

**It's variance, not creativity.** Asking a model to "be creative," "think differently," or "avoid the obvious" through a dozen different framings (a pep talk, an impossible client, taste vocabulary, a world-building metaphor) still converges on the same concept almost every time. The model is not short on ideas; it is short on **variance between attempts**. Exhortation prose changes the wording of the answer, not the answer. Do not spend effort rephrasing "be original" — spend it on a mechanism that forces a different output.

**Rejection advances a queue, it does not generate.** "Write your first three ideas, discard them unseen, build the fourth" reliably escapes the model's single most-probable concept — but it lands on its _second_ most-probable one, every time. A model's concept prior for a given brief is roughly two ideas deep, so telling it to avoid something produces the runner-up rut, not fresh thinking.

**A model cannot pick its own diverse output.** Forcing a real derivation procedure — seven candidate directions, each with a written rationale, genuinely different from each other — works: the _list_ is diverse. Then asking the model to pick "the most resonant one" from its own list collapses back to the same winner every run, because one model scoring its own candidates is one deterministic function (argmax), regardless of how the prompt is worded. Diversity lives in generation and dies at selection. Handing the shortlist to a simulated persona, a veto rule, or "pick what a user would like" does not fix this. Separate generation from selection: something outside the model's own judgment — a die roll, a fixed index, a coin flip — picks which one gets built. If no external picker is available, a cheap proxy works: ask for the shortlist in one pass, then in a _fresh_ pass (no memory of ranking them) ask only "build candidate #3" with no discussion of the others.

Left alone, a model ships its first answer, and its first answer is nearly the same for every brief: a pale or near-black ground, one careful accent, a split hero, three cards, a figure row, a closing band. Given a house style, it ships that house style every time. What breaks convergence is a decision the model did not make from habit: a dealt starting material, a structure drawn against recent builds, and a rule to build one of its *lower-ranked* ideas instead of the top one.

## The procedure

Hold all of it in working notes; the user sees it once, as the direction card (step 10).

1. **Scene.** One sentence: who uses this, where, in what light, in what mood. "A couple on the sofa on Sunday evening, phones in hand, settling who paid for groceries." The scene, not habit, decides light or dark ground and the density.
2. **Material inventory**, one line each:
   - *real*: every concrete thing the brief and project supply (name, place, offer, dates, numbers, images);
   - *pictures*: what the page can show and where it comes from (the user's files, the product built or captured, a typographic or data-led surface, clearly marked slots);
   - *absent*: every proof it will not have (logos, quotes, metrics, prices nobody gave).
   A page with pictures leads with them; a page of words carries type and facts.
3. **The job.** Name what the visitor comes to do (subscribe, book, visit, attend, buy, try, sign up, hire, join, listen) and read that job in [[web/frontend/marketing-pages]]: where the action lives, which sections are the category's own, and how the page ends.
4. **Name the rut.** Write the page this brief would get without trying, then its obvious twist. Neither ships. The common rut, any two of which make a plan a template:
   - split hero (head left, picture or mock right) on a pale or near-black ground;
   - three equal cards, a row of big figures, numbered three steps;
   - small grey or tracked-capital labels above every heading;
   - one careful accent on neutral paper, or near-black with one neon or one blue;
   - a closing band with a form, a dark footer under a huge wordmark.
5. **Calibration clusters.** Refuse these on sight unless the brief pins them or the deal handed you the material: cream paper + high-contrast serif + terracotta; near-black + one neon accent; broadsheet hairlines + italic serif + mono labels; neo-brutalism with hard offset shadows; purple into blue; a hue chosen by category (blue for software, green for health, pink for beauty); black canvas + one blue without a request. Two more that this process was caught falling into: light paper + one red or vermilion "stamp" ink built on printed ephemera (postmarks, stamps, labels, tickets), and the place's souvenir as the palette (amber for Kaliningrad, gold domes for Moscow, the sea for any coastal town). **Category test:** if someone could guess this aesthetic from the category alone, rework.
6. **Tone, as an extreme.** Pick one: editorial, brutal, soft, utilitarian, luxurious, playful, technical, austere, loud, nocturnal, handmade. "Clean and modern" is not a tone.
7. **Deal.** Pick three starting materials by an arbitrary rule fixed before you look (see "Where to start"), from three different families (print, screen, camera, material, a named look from [[web/frontend/style-presets]]), none used in this project or your recent builds, plus a page shape and first-screen posture from [[web/frontend/page-shapes]] and a roll from 3 to 7.
8. **Rank seven, build the roll.** Write seven directions, one line each: the idea from the product's world, ground, type voice, signal colour, signature. Three may start from the dealt materials (transformed by the idea); the rest come from the product's world: what it looked like before the web, what it would be as a physical object, what its people wear, print, or use. At least three families among the seven, at most one literal reading of the product's name or place, at least two on a dark or mid ground, and at most two built on paper or print. Rank them honestly, then **build the one the roll names (#3 to #7), never #1 or #2**: your top two are what every run would ship. Move to an adjacent rank only for a factual reason (it cannot be legible, accessible, or true to the audience); taste is never a reason. Show #1 in one line as the road not taken.
9. **Structure.** Take the drawn shape, first-screen posture, nav, footer, first section, and the two compositions to leave out, unless the brief's material refuses a pick; name every swap. **Mirror test:** would a neighbouring brief in the same category get this exact combination? If yes, change one decision and say which.
10. **Direction card**, said once in the reply before building, and written into the project's design document:

    ```markdown
    **Direction** · material 2/3 kiln-oxide → "the bakery's 5 a.m. oven room"
    - Scene · regulars stopping by before work, dark street, warm window light
    - Built · rank #5 of 7 (road not taken, #1: cream paper, serif, clay accent)
    - Type · Bitter 700 for heads, Golos Text for text (both Cyrillic)
    - Palette · committed: fired-clay ground, iron-oxide orange signal, flour-white text
    - Structure · marquee first screen, poster hero, slab nav, statement footer; left out: split, card grid
    - Job · book: today's bake and the pre-order times in the first screen; ends on hours and address
    - Signature · the day's bake list set as an oven-door timetable, the first thing you read
    - Absent · prices, reviews, opening year (slots, marked in the handoff)
    ```

11. **Build** with [[web/frontend/art-direction]] sections 4 to 6 inside this direction: palette, type, and motion derived from the idea. Pick the display face from a shortlist of three in the material's class, none from your recent builds. A face that keeps winning across unrelated briefs is a new reflex.
12. **Log** the main move after the build, in a few plain words (material, ground/type/temperature, display face, hue, shape), wherever notes persist for you: a project note or your memory. Name the move, not the project or the user's content. Before the next build, read the log: never reuse one of the last five display faces, and move at least 40° of hue from the last three.

## Ground borrowed forms in something specific, not a mood

When deriving candidate directions, the depth of the list is bounded by how much cultural material the brief actually contains. A brief rooted in a specific, textured domain (a regional TV culture, a niche hobby, a historic print medium) yields a deep, specific candidate list. A generic brief (another SaaS dashboard, another admin panel) yields a shallow one — terminals and postmortems, again — no matter how hard the model tries.

When the brief itself is thin, do not force the model to invent depth it does not have. Instead, deliberately borrow a **specific, produced graphic system** from outside the product's own domain — a naturalist's field guide, a broadsheet sports section, a teletext service, a transit map — and adapt it. A world is a graphic system with real production history (palette, type, composition, a topology), never a vague material, mood, or place: "1950s Blue Note sleeve," not "record covers."

Weigh a borrowed form on two axes before committing: does the audience recognize or identify with it, and does it make the product clearer, not just decorated.

## Commit fully before you soften — not the reverse

An instinct to add an "anti-gimmick" guard — "if a visitor would notice the borrowed form before the product, reject it" — sounds responsible but is usually the actual ceiling on the work. A fully-committed borrowed form (a page built entirely as teletext, entirely as a terminal session) is _supposed_ to be noticed; that is what makes it memorable, and it still works because the underlying task stays easy to complete.

Every hedge, caveat, and "keep it professional" instruction in a brief is a brake; every "commit," "go all the way," "own it" instruction is an accelerator. If the brakes outnumber the accelerators, the output lands timid, and timid reads as bland regardless of the underlying idea.

**Sequence matters more than the words used.** Land the concept fully committed first — that is the hard, high-variance part. Only in a later pass check legibility, restraint, and whether it still serves the artifact's job. Committing-then-clarifying consistently outperforms clarifying-while-committing; asking for both at once produces neither.

## Craft before boldness

A bold direction executed at 3 of 5 loses to a safe one executed at 4; clipped table text and a stray first-screen banner cost bolder pages their win. Before the critique, check on the render at every width:

- the nav's outer edges sit on the content column's edges;
- no text is truncated or spills out of its cell, badge, or column (an ellipsis only with the full value available, never on the value the row exists for);
- the first screen holds the headline, one sentence, and the primary action on desktop and on a phone, with nothing else competing (no banners, notices, or chips above it);
- one dominant element per screen: a big figure and a big headline do not compete;
- the material's decoration (texture, stamp, ground colour) never lowers the contrast or legibility of text that carries the task.
- Display type: check word spacing and letter fit on the rendered headline in every language the page ships; a display serif with tight tracking can collapse spaces ("Threenights").

**Samples are marked for the person who replaces them, not painted on the page.** Put sample content in the handoff list, in the design document, and on the element (`data-sample`, a code comment); on the page it looks like real content, with at most one quiet line in the footer saying the page is a prototype with sample content. Never a full-width "sample page" banner, dashed "sample" chips, or "example data" captions in the first screen. Facts nobody gave (prices, addresses, reviews, counts) are still never stated as real: use a neutral form ("Address to be confirmed", a price slot showing "—") inside the section that owns the fact, never in the header or the first screen, or leave the section out. The first screen shows only what is real or reads as real sample content.

## Working tools

A dashboard, admin, editor, or settings surface with no cue still gets a deal: the material sets ground, type voice, and signal, while density, grid, and component sizes come from the task. Keep the posture restrained or committed, express character through data typography and precision, and never put a page hero or marketing section inside the tool. The roll for an app names #2 or #3, not #3 to #7: a working tool needs a direction that is not the reflex, but its execution (dense tables that never clip, statuses that fit their columns, scannable rows) outranks novelty.

### The default app shell

An app screen, dashboard, web page or game HUD has a default shell, and that shell gives it away faster than its colors: a top bar with search, bell and avatar, a sidebar, a row of stat cards, rounded panels in a grid, chips, progress bars, a table and one accent color on a dark or white ground. A new subject poured into this shell still reads as a template. Change all three layers, not one:

1. Layout from the subject. Find the one question the user opens the screen to answer, and let the whole page be the shape of that answer. A schedule app can be the day itself, one pixel per minute across the full width. A tool about a place can be the place. Cards, tables and panels come back only when this case needs them.
2. A method that carries the data. Take the method from a seed or the subject, then let its own physics show the states: light and dark, ink and paper, worn and new, on and off. If a state could be swapped for any color without losing meaning, the method is only paint.
3. Type and color with poster scale. One huge stacked statement and huge markers next to small exact data. Take the colors from a place at a set hour or from the subject's material, and let them mean something, such as the hour, the zone or the state, instead of one accent on gray.

The method may own the surface, the ground and the big shapes. It never owns the working parts: data lines up with its axis, labels sit inside their areas, buttons are plain and pressable, and small text stays readable on whatever is behind it. Roughness, texture and silhouettes go behind or below the data, never through it.

If a standing rule of the user limits the look, such as a gray-only interface rule, follow it, and when the result comes back as flat or plain, say which rule shaped it.

## Pre-emit critique

Before the sweep, score the plan 1 to 5 on six axes; anything under 3 is revised first.

| Axis | 3 | 5 |
| --- | --- | --- |
| Philosophy | has a tone | has an argument a reader could disagree with |
| Hierarchy | needs a second look | survives the squint test |
| Execution | two or three loose details | passes the AI-tells check first time |
| Specificity | fits the category | could belong to no other product |
| Restraint | keeps one decoration too many | lost something you liked |
| Variety | differs from the rut on three structural decisions | shares almost nothing with the last builds |

Name the weakest axis and the fix taken. Never invent a weakness to fill the field.

## A committed skin can hide a template underneath

Concept, palette, composition, and motion each converge toward the default independently. Fixing one (a distinctive palette) does not fix the others (a completely standard hero-cards-testimonials grid underneath it). The failure mode is invisible to a judge — including the model itself — that only looks at the styled render: every surface detail speaks the committed direction, but the skeleton is the category's default template.

**The check:** strip color, texture, and type in your head (or literally, with a quick grayscale/wireframe pass) and compare the bare structure against the category's standard layout for this artifact type. If the wireframe is indistinguishable from the default, the direction only reached the surface — go back to layout, not color. Borrow the form's _skeleton_ (its composition, hierarchy, rhythm), not just its clothes (palette and iconography).

## Write the direction down, then have someone else check it

Models describe ambitious direction convincingly and then build the conservative default anyway, because nothing forces a comparison between the stated intent and the shipped result. A generic "does this look good?" self-critique in the same pass makes this worse, not better — a rubric invites additions, so output gets busier without getting more distinctive, and a thread grading its own work has every incentive to rubber-stamp it.

**What works:** write the committed direction as a short, explicit contract before or alongside building — what this page uniquely is, the category default it refuses, the first-viewport composition, the chosen form and why. The direction card above is that contract. Then audit the _render_ against the _contract_, promise by promise, from a fresh vantage point — a separate self-audit pass, a sub-agent with no memory of the build reasoning, or at minimum a deliberate re-read after stepping away from the generation context — rather than the same pass that just finished building rubber-stamping itself.

## The escape becomes a default

This process makes its own habits. An escape that worked once turns into the new safe pick if you use it again. Watch for these and do not reach for them by reflex:

- An old, analog or printed look chosen because it reads as "not AI", not because the subject asks for it.
- The same small palette, the same paper, the same texture, the same wobbly line from one piece to the next.
- Made-up names that all come from one stock: sea and tide words, old trades, rope and salt, small English towns. Take names from the way the people who live there name things, not from a list of objects found in the place.
- A cream, beige or off-white ground. Take the ground from the subject: its night, its wall, its water, its screen.
- Exact times, dates and numbers used only to look concrete.
- A clever frame borrowed from another domain, such as a table, a map, a form or a schedule, laid over the subject.
- A small numbered label in the corner and a dry joke in the fine print.

If your answer shares its main move with the last off-default answer you gave, it is a default now. Pick a different kind of move, or keep it only if you can say why this case needs it. You cannot see past sessions, so check the log of moves from step 12 before you show an off-default answer.

## Check before showing

Ask three questions about your answer:

1. Could this be the answer to a different project? If yes, it is too general.
2. Is this what most people would make first? If yes, move it.
3. Can I say why this choice fits here, in one sentence, using a fact about this project? If not, the choice has no reason.

Do not invent facts to make a page concrete. Use real details from the user or the project. If there are none, ask for them, or keep the detail clearly made up (see [[web/frontend/visual-design]] on never inventing facts).

## What still binds

Everything else in the web docs: the design document as the source of values, layout geometry, motion, accessibility, real states, the AI-tells list, and honest facts. A dealt material never excuses low contrast, a missing focus ring, or invented proof.
