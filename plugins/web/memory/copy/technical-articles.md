---
kind: knowledge
when-and-why-to-read: When you are writing a technical blog post or article for developers (a bug hunt, migration story, architecture walkthrough, tutorial, benchmark or explainer), this knowledge should be read because most technical articles fail on structure (buried lede, mixed content types, kitchen-sink scope, restating conclusions), not on the idea.
short-form: "Technical articles: a single thesis and content type before drafting; Evans's and Shapiro's idea filters; developer title constraints; hook-stakes-promise intro answering three objections; one idea per section, show then tell, snippets under 20 lines; conclusions that add implication, open question or CTA; eight content-type templates with word allocations, Diataxis, structural anti-patterns and transitions."
rationale: >-
  Adapted from samber's technical-article-writer skill (github.com/samber/cc-skills, MIT); the interview workflow, skill delegation and image-prompt phase were dropped. This document owns article structure. Hooks and titles live in [[web/copy/hooks-and-titles]]; end-of-article CTAs in [[web/copy/cta]]; AI tells in [[web/copy/ai-writing-tells]]; reference docs for non-native readers in [[web/copy/plain-technical-english]].
---

# Technical articles

## Why they fail

Most technical articles fail because of structural problems, not bad ideas: burying the lede, mixing content types, weak openings, no clear motivation, or trying to cover too much.

Developer audiences have a built-in BS detector. The best technical content leads with specificity and honesty. It sounds like a smart colleague explaining something interesting, not a marketer pitching. Acknowledge your expertise level, solve a specific problem, use real examples.

## Before drafting

Settle these before drafting: the topic, the single primary objective (one CTA; see [[web/copy/cta]]), the audience, the content type, the length target (short 800-1200, medium 1500-2500, long 3000+) and a one-sentence thesis. If you can't state the thesis, ask: "What's the one thing you want the reader to remember?" If there is no answer, find it through what surprised the writer, what they'd tell a colleague, or what they wish they'd known earlier. If the content type is ambiguous (could be a tutorial or an explainer), decide which experience the reader should have: following along hands-on, or building a mental model.

**Idea quality filters.** Apply these before investing in a draft:

Julia Evans's heuristic: the best technical content comes from what you struggled with, not what you mastered. If the topic feels too "textbook", push toward the specific struggle, surprise, or counterintuitive finding.

Julian Shapiro's novelty filter. The idea should fit at least one:

- **Counter-intuitive**: "I never realized the world worked that way"
- **Counter-narrative**: "That's not how I was told it worked"
- **Shock and awe**: "I had no idea that was possible"
- **Elegant articulation**: "I always felt that way but couldn't put it into words"
- **Makes you feel seen**: "Finally someone gets my experience"

If the idea doesn't pass any filter, find the angle that does.

## Titles

Generate many title variants across different hook types, then revisit them once the full draft exists. Formulas and data are in [[web/copy/hooks-and-titles]].

Constraints for developer audiences:

- 7-12 words optimal for LinkedIn/B2B sharing
- Specificity over cleverness ("How to profile Go allocations with pprof" > "Mastering Go Performance")
- Numbers and data signal rigor
- Avoid superlatives ("ultimate", "complete", "everything you need")
- Technical keywords attract the right audience
- Cognitive dissonance creates curiosity without clickbait

## Intro

1. **Hook** (see [[web/copy/hooks-and-titles]])
2. **Stakes** (1-2 sentences): Why should the reader care? What's the cost of not knowing this?
3. **Promise** (1 sentence): What will the reader gain by the end?

Address three reader objections:

- **Untrustworthy**: Why should I listen to you? (credibility hook or specific experience)
- **Irrelevant**: Why does this matter to me? (stakes)
- **Implausible**: Will this actually deliver? (promise + specificity)

Anti-patterns to avoid:

- Starting with a dictionary definition
- "In today's fast-paced world..."
- "Have you ever wondered..."
- Burying the interesting part after 3 paragraphs of context
- Explaining what the article will cover instead of demonstrating value

## Body

General structural principles:

- **One idea per section.** If a section does two things, split it.
- **Show, then tell.** Lead with the example, code snippet, or observation. Then explain.
- **Progressive disclosure.** Start with the simplest version, then add complexity.
- **Every section earns the next.** Each section should create enough momentum to pull the reader forward. If a section could be skipped, cut it.

For code-heavy articles:

- Snippets < 20 lines, focused on one concept
- Always show "before" (problem) and "after" (solution)
- Annotate non-obvious lines
- Link to repo for full code, show only the interesting parts inline

For opinion/analysis:

- Steelman the opposing view before arguing against it
- Concrete examples, not abstract reasoning
- Quantify claims ("2x faster" not "much faster")

## Conclusion

For the **conclusion**, avoid restating the article. Instead pick one of:

- **Implication**: What does this mean for the reader's work going forward?
- **Open question**: What's still unresolved or worth exploring?
- **Call to action**: What should the reader do next?

## Editing pass

Strip AI-generated patterns ([[web/copy/ai-writing-tells]]). **Preserve the hook and title.** The opening hook and title were deliberately engineered for curiosity and credibility. Leave them intact — rewriting them for "naturalness" destroys the copywriting structure that earns the click and the first scroll.

## Eight content type templates

Each template defines sections, purpose, and approximate word allocation for a medium-length article (1500-2500 words). Adapt proportions to target length.

### The Bug Hunt

Debugging narrative. The reader follows your investigation like a mystery.

1. **The symptom** (10%): What went wrong? Error messages, metrics, user reports.
2. **First hypothesis** (15%): What you assumed. Why it seemed reasonable.
3. **The investigation** (30%): What you tried. Dead ends matter. Show commands, logs, code.
4. **The revelation** (20%): The actual root cause. The payoff. Make it vivid.
5. **The fix** (15%): Code, config, architecture change.
6. **The lesson** (10%): The generalizable insight beyond this specific bug.

Technique: Build tension with plausible-but-wrong hypotheses before the real cause.

### We Rewrote It in X

Migration story. Readers want: should I do this too?

1. **Why we considered the rewrite** (15%): The pain. Be honest.
2. **Why we chose [new thing]** (10%): Decision criteria. What was rejected.
3. **The migration process** (30%): How. Phased? Big bang? Tooling?
4. **What went wrong** (15%): The pain. This is what makes it credible.
5. **Results and metrics** (20%): Before/after. Quantify everything.
6. **Would we do it again?** (10%): Honest assessment. Under what conditions?

Technique: The "what went wrong" section is what makes this valuable. Without it, it's a press release.

### How We Built It

Architecture walkthrough. Readers want design decisions.

1. **What and why** (10%): Product/system goal. User needs.
2. **Constraints** (15%): Performance targets, team size, timeline, compatibility.
3. **Architecture overview** (20%): High-level design. Diagram if possible.
4. **Key decisions and tradeoffs** (30%): For each: options, choice, and why. Core value.
5. **What we'd change** (15%): Hindsight. What would v2 look like?
6. **Takeaways** (10%): Principles the reader can apply.

Technique: Frame each decision as a tradeoff, not the "right" answer.

### Lessons Learned

Retrospective insight.

1. **Context** (10%): What experience generated these lessons. Credibility.
2. **Lesson 1** (20%): Most surprising or important. Lead with your best.
3. **Lesson 2** (20%): Build on or contrast with Lesson 1.
4. **Lesson 3** (20%): The one that took longest to learn.
5. **Lesson N** (if needed): Keep to 3-5 lessons. More dilutes impact.
6. **The meta-lesson** (10%): What ties these together.

Technique: Each lesson needs a specific story, not just the abstract principle.

### Thoughts on Trends

Industry analysis or opinion piece.

1. **The observation** (15%): What you're noticing. Be concrete.
2. **Evidence** (25%): Data, examples, trends.
3. **The steelman** (15%): Strongest argument against your position. Address honestly.
4. **Your thesis** (25%): Your take, informed by evidence and counterargument.
5. **Implications** (20%): What should the reader do differently?

Technique: The steelman separates good analysis from hot takes.

### Benchmark / Data-Driven

Technical comparison or measurement.

1. **What and why** (10%): The question. Why it matters.
2. **Methodology** (20%): Environment, tools, config. Reproducible detail.
3. **Results** (25%): Data first, interpretation second. Tables, charts, numbers.
4. **Analysis** (25%): What it means. Caveats. Where methodology might mislead.
5. **Practical recommendations** (15%): Given this data, what should the reader do?
6. **Reproduction notes** (5%): Repo, scripts, raw data links.

Technique: Lead with methodology. No trust in setup = no trust in conclusions.

### Tutorial / How-To

Step-by-step guide.

1. **What you'll build/achieve** (5%): End result. Screenshot or demo if possible.
2. **Prerequisites** (5%): What the reader needs. Be explicit.
3. **Steps** (70%): Numbered, sequential. Each step: action, code/command, expected result, common errors.
4. **Verification** (10%): How to confirm it worked.
5. **Next steps** (10%): Related topics, advanced usage.

Technique: Test from scratch on a clean environment. Every missing step loses readers.

### Explainer / Deep Dive

Concept explanation for a technical audience.

1. **Why this matters** (10%): Motivation. What problem does understanding this solve?
2. **The simple mental model** (20%): The 80/20 explanation. Standalone value.
3. **Going deeper** (40%): Nuances, edge cases, implementation details. Progressive complexity.
4. **Common misconceptions** (15%): What people get wrong. Cements understanding.
5. **Practical implications** (15%): How does knowing this change what you do?

Technique: Start with the simplest accurate mental model, then complicate it.

## The Diataxis Framework

For content closer to documentation than opinion, use Diataxis (Daniele Procida) to diagnose type:

|                 | Learning    | Working       |
| --------------- | ----------- | ------------- |
| **Practical**   | Tutorials   | How-to guides |
| **Theoretical** | Explanation | Reference     |

Common failure: mixing types. A tutorial drifting into reference, a how-to explaining theory. Fix: separate mixed content into its proper type.

For blog posts: tutorials need clear start/end states, how-tos solve specific problems without teaching theory, explanations build understanding without requiring action, reference rarely works as a blog post (put it in docs).

## Structural Anti-patterns

- **Burying the lede**: Interesting insight in paragraph 5. Move it to paragraph 1.
- **The unnecessary preamble**: 200 words of "In today's world of..." before content. Cut it.
- **The kitchen sink**: Covering everything about a topic. Pick one angle, go deep.
- **Unexplained jargon**: Terms without definitions. Not everyone has your context.
- **Missing motivation**: Explaining "how" without "why anyone should care."
- **The wall of code**: 50-line block with no annotation. Break up, explain interesting parts.
- **The false conclusion**: "In conclusion, [restate]." Add value: implications, open questions, CTA.
- **Monotone pacing**: Every section same length/intensity. Vary rhythm.
- **No signposting**: Reader doesn't know where they are. Use subheadings and transitions.

## Section Transitions

Techniques that create momentum:

- **Forward reference**: "But this creates a new problem..."
- **Question**: "So if X is true, what happens when we try Y?"
- **Contrast**: "That handles the common case. Edge cases are where it gets interesting."
- **Escalation**: "This works for small datasets. Let's scale it up."

Momentum killers:

- "Now let's talk about..." (no reason to continue)
- "Another important topic is..." (disconnected)
- "Moving on to..." (filler)
