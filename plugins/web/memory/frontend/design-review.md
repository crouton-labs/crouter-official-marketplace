---
kind: knowledge
when-and-why-to-read: When you have built the first screen of a page, finished a page, or finished a redesign, and are about to hand it back, this knowledge should be read because the agent that built a page is its weakest reviewer, and a reviewer that starts with no knowledge of your plan sees what is actually on the screen instead of what the plan says is there.
short-form: "Design review: spawn a child with no inherited context, give it only screenshots, the source paths, the user's brief and one line on what the page is for, paste the matching brief below, wait for its first word (recapture, rebuild, fix, ship), fix what is real, recapture, and score each finding resolved, partial or unresolved, with one scoring round at most."
rationale: >-
  Adapted from Hallmark's hero review, finish review and the fresh-context section of its gates reference (github.com/Nutlope/hallmark, MIT), with its screenshot scripts, theme files, stamp and records removed. The checklist the reviewer works from is [[web/frontend/ai-tells]]; what a marketing page holds and how each screen is built is [[web/frontend/marketing-pages]]; the visual direction is [[web/frontend/visual-design]]; what a redesign keeps and checks is [[web/frontend/redesign]]. This document owns only how to run the review, what to give the reviewer, the two briefs, and what to do with the reply.
---

# Design review

The agent that built a page knows what it meant to put there, so it sees the plan instead of the screen. A review by a child node (or a subagent) that starts with no inherited transcript, and sees only the screenshots and a short brief, catches what the plan hid.

There are two reviews:

- **The first-screen review** runs once, after the first screen of a page is built and before any section below it exists. A weak first screen is cheap to change then and expensive later.
- **The finished-page review** runs once the whole page is built, before you hand it back.

An app screen (a dashboard, an admin screen, a tool) and a redesign that keeps the layout skip the first-screen review and get only the finished-page review.

## Capture the screenshots

Capture with whatever real browser you have (a headless browser, Playwright, a capture tool), from the running page, after fonts and images have loaded:

- **First-screen review:** the first screen at a phone width (375×812), at 1280×800, and at 1920×1080.
- **Finished-page review:** the same three, plus a full-page capture at 1280 wide and at 375 wide.
- **Redesign:** the same set, taken before you change anything, kept as the before screenshots (see [[web/frontend/redesign]]).

Look at each file before sending it. A blank frame, a fallback font, a half-loaded image or a cookie banner over the page wastes the review.

## Start the reviewer

Spawn a child node (or a subagent) with no inherited transcript. Its prompt is the matching brief below, pasted as written, followed by its inputs. Give files as absolute paths and short facts as quoted text. Give it nothing else: not your design plan, not your token choices, not why anything is the way it is. Every reason you add is a reason it stops looking.

Wait for its reply before you go on. The first-screen review must come back before you build the sections below it, and the finished-page review must come back before you hand the page over. Do not continue building past it or schedule a check-in; its report is what you act on next.

If you cannot start a child or subagent, then and only then read the brief yourself, look at the screenshots again as if you had never seen the page, answer the brief honestly, and say in your handoff that the review was done by the builder.

## The first-screen review

Inputs to append after the brief:

- The three first-screen screenshots (375, 1280×800, 1920), as paths.
- The user's request, quoted.
- One line saying what the page is for: the subject, who it is for, and the one action it should drive.
- Which kind of build this is: a new page, or a redesign at full depth.

```text
You are reviewing the first screen of a page that is still being built. You did not build it and you will not be told why anything is the way it is. Your inputs, and nothing else: the screenshots of the first screen at a phone width, at 1280×800 and at 1920×1080, the user's request, and one line saying what the page is for. Your checklist of what makes a page look machine-made is [[web/frontend/ai-tells]]; read it once. Batch your reads, stop reading by your tenth turn, and write.

The first word of your reply is `ship` or `fix`.

Then at most five findings, one line each, worst first: what is wrong, where, and what you would do. Ask:

- Does the headline say something only this product could say, in seven words or fewer?
- Is this a first screen you would expect a model to make for this request? If it is, say what gives it away.
- Is the content placed in the screen, or does it stop early over a band of nothing? If there is a picture, is it a real one (the user's own, a photograph, a capture of the product, the product built at full fidelity), and is it big enough to hold its place? Where the first screen has no picture by design, the type is the visual: does it fill the screen? At 1920 wide the container and the type stop growing on purpose, so extra space at the sides is not a finding.
- Does anything read as a template: a centred stack, a pill or a small label above the headline, a gradient blob, an empty coloured box where a picture should be, a drawn illustration standing in for the product, a row of counting marks, two filled buttons side by side? A filled primary button beside an outlined or text action that goes somewhere else is a normal pair, and a sample of the product built into a slot is the product; neither is a finding. Grey bars or outline cards inside that slot are.
- Is the page's strongest real thing on this screen? Delete the picture in your head: if the screen still says the same thing, the picture is too weak or too small.
- Does the type carry the page's character at this size, or could it be any page's type?

Not findings: a direction you would not have chosen; a look the user's request asked for in so many words. On a redesign the page's content is fixed and everything below the first screen is the old page, not yet rebuilt: neither is a finding. Never ask for copy, an action or a picture the page does not have; say in one line what the owner could supply instead.

Do not fix anything.
```

## The finished-page review

Inputs to append after the brief:

- The three first-screen screenshots and the two full-page screenshots (1280 and 375 wide), as paths.
- The paths of the page's HTML or component source.
- The user's request, quoted, and the one line saying what the page is for.
- The first-screen review's findings, each with how it was settled, when that review ran.
- Which kind of build this is: a new page; a redesign at full depth or restyle; a redesign at polish depth; or an app screen.
- On a redesign, the before screenshots, as paths. On a polish, send only the full-page captures at 1280, before and after.

```text
You are reviewing a built page. You did not build it and you will not be told why anything is the way it is. Read the page, not the intent. Your inputs, and nothing else: the screenshots (the first screen at a phone width, 1280×800 and 1920×1080, and the full page at 1280 and 375 wide), the page's source, the user's request, one line saying what the page is for, and the first-screen review's findings with how each was settled. Your checklist of what makes a page look machine-made is [[web/frontend/ai-tells]], and what a marketing page holds screen by screen is [[web/frontend/marketing-pages]]; read each once. Look at the screenshots first, and open the source only to quote copy or to locate a finding. A pinned panel appears once in a full-page capture: the column beside its later screens is the pin, not an empty half. Batch your reads, stop reading by your tenth turn, and write.

The first word of your reply is one of:
- `recapture`: a screenshot is missing, blank, or shows the wrong thing (a fallback font, a half-loaded page). List what to recapture and stop.
- `rebuild`: the first screen fails the page's purpose wholesale.
- `fix`: findings follow.
- `ship`: nothing is owed.

Before the findings, write two lines of your own from the screenshots: what the page is about, and the one thing a visitor would remember.

Then the findings, ranked by how much each costs the page, at most eight, one line each: the defect, where it is, what you would do.

Scroll the 1280 full page one screen at a time before ranking. A screen with nothing big enough to be its reason outranks every detail finding: a heading and a line adrift, a narrow column beside an empty half, a section heading under 40px, an empty coloured box or a drawn illustration where a photograph or the product should be, a row of counting marks. Then the copy: name any heading that would pass unchanged on a competitor's page.

Check three things in particular:
- Seen before: the page, or a section of it, reads as a template or a familiar site. Name which and where.
- Clean: something is on the page without a job (a repeated device, a decoration, a box around nothing), or a screen has nothing worth looking at.
- Carried: the page's idea lives in the first screen and stops there.

Then answer the question no checklist can: does the line saying what the page is for describe the page in front of you? Name the largest gap, or say there is none.

Not findings: a direction you would not have chosen; a look the user's request asked for in so many words; something the first-screen review already settled, unless you name a new reason.

On a redesign the content is fixed: never ask for copy, an action or a picture the old page did not have. Compare the before screenshots and answer one more question: what did the old page do better? Name anything a visitor could do, read or find before that is harder now; if nothing, say so.

On a polish you get only the full pages at 1280, before and after. The layout was kept on purpose, so ask one thing: does anything still read as machine-made? At most five findings.

On an app screen (a dashboard, an admin screen, a tool) there is no hero, first screen or section rhythm to judge. Read the full screens at 1280 and 375 and ask what someone fluent in that kind of tool would: is the hierarchy clear, is the density even, does every control and table work on a phone, are the empty, loading and error states there?

Close with one line naming what must not be diluted while fixing. Do not fix anything.
```

## Act on the reply

Act on the first word.

- **`recapture`:** the screenshots were wrong. Retake them and start the review again from the beginning. This does not use up your one scoring round.
- **`ship`:** hand the page back.
- **`fix` or `rebuild`:** fix what is real, then recapture the same screenshots. Score each finding yourself against its recapture as `resolved`, `partial` or `unresolved`, with a one-line reason.

Send the recaptures back to the reviewer for one scoring round only when the first word was `rebuild`, or when a finding was a hard failure (an invented fact, text that fails contrast, a broken or unreachable control, content cut off on a phone). That round scores the old findings against the new screenshots; it is not a second review, and it runs once.

Do not hand back with a hard failure unresolved. Any other finding you leave unresolved goes in the handoff with the reason it stayed. A finding you disagree with is answered there too, in one line; it is not silently ignored.
