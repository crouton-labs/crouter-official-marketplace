---
kind: knowledge
when-and-why-to-read: When you are drafting or editing prose a person will read — an article, post, email, docs page or marketing copy — or de-slopping an AI-assisted draft, this knowledge should be read because LLM-default vocabulary, padding and structure (delve, "It's not just X, it's Y", tricolons, recap closers, false balance) make readers discount everything else on the page.
short-form: "AI writing tells: strip chat artifacts, Markdown residue and em-dash density; cut padding (challenge/optimism sandwich, negative parallelism, forced threes, filler phrases, hedging, generic upbeat endings); fix discourse patterns (recap, catalog structure, false balance, ghost Q&A, constant granularity); single-word and phrase tell tables, structural, punctuation and statistical tells, detector unreliability, and a grep-able audit."
rationale: >-
  Adapted from samber's humanizer-en-asd-ste100, copywriting-prose-creator and copywriting-hooks skills (github.com/samber/cc-skills, MIT); French tells and tool workflows were dropped, and STE rule cross-references removed from the de-slop passes. This document owns AI tells in prose. Visual and UI-copy tells live in [[web/frontend/ai-tells]]; the ASD-STE100 rules in [[web/copy/plain-technical-english]]; voice and style rules in [[web/copy/voice]].
---

# AI writing tells

The dominant prose-drift risk is convergence on LLM-default register. Lexical and structural tells evolve as models change; refresh this list yearly. Visual and interface-copy tells (labels that repeat themselves, sparkle icons, stock buttons) live in [[web/frontend/ai-tells]].

## Generation artifacts

A delivered document cannot carry chat leftovers or decoration, and a reader has no way to know they are not part of the content. Clear these first.

**Register artifacts — chat leftovers that never belong in a document:**

- **Zero decorative emojis, always.** A technical document has exactly one register — formal, plain, single-purpose — so there is no context in which an emoji belongs, unlike general prose where an emoji can carry tone.
- **No conversation or meta-commentary inside the deliverable.** Kill on sight: `Here is the rewritten procedure:`, `Sure, I can help with that`, `Absolutely!`, `Would you like me to...`, `Let me know if...`, `Feel free to...`. These are chat artifacts, not content — remove them entirely rather than rewording them.
- **No knowledge-limitation disclaimers.** Kill on sight: `As of [date]`, `According to available information`, `While specific details are limited...`, `Based on the information available...`. A technical document states what it knows; when a value is genuinely unconfirmed, flag it as unconfirmed instead of hedging inside the deliverable text.
- **No sycophantic or servile tone.** Kill on sight: `Great question!`, `You're absolutely right`, `Excellent point`. A technical document has no reader to flatter — state the fact directly.

**Typographic and formatting artifacts:**

- **No Markdown residue that is not native to the delivery format.** Unrendered `**bold**`, a broken citation marker (`:contentReference[oaicite:2]{index=2}`), or a leftover refusal (`I'm sorry, but I can't...`) have no place in a plain-text manual or a rendered document that was not asked for in Markdown. Flatten to plain sentences unless the target format is genuinely Markdown-rendered documentation. Strip zero-width characters (U+200B, U+200C, U+200D, U+FEFF) — they are copy-paste artifacts with no legitimate use in prose — but do not strip legitimate technical symbols (`°`, `±`, `µ`, `Ω`) while doing it.
- **No mechanical bold.** Remove bold that flags every term as important rather than aiding navigation.
- **No bold-header feature lists.** A `- **Feature:** description` list summarizing unrelated facts is a generation habit, not a real list. Convert it to plain sentences, or to a vertical list only when the items are truly comparable.
- **No heading-capitalization drift.** Pick one heading convention — sentence case or title case — and hold it throughout a document; switching between them mid-document is a generation tell, not a style choice.
- **One quote style, held throughout.** Pick straight quotes (`"..."`) as the default for plain-text technical documents and for downstream translation tooling, and do not mix them with curly quotes or apostrophes within the same document.
- **No em dash overuse.** AI-generated English defaults to em dashes for parenthetical asides at a rate no human technical writer matches. Split the aside into its own short sentence, or use a comma when it is brief. Presence alone proves little (a 2025 change to a major chatbot's defaults already reduced this tell, and technical writers use em dashes too) — the signal is density, more than one or two per paragraph, not any single instance.

## Padding constructions

These constructions add words without adding information. **No challenge/optimism sandwich.** `Despite its many advantages, the system faces several implementation challenges. Despite these challenges, the outlook remains positive.` states nothing. Name the actual constraint, or delete the frame: `The new system requires a firmware update on devices older than model X200, which affects about 12% of the current fleet.`

**No negative parallelism.** `Not only does this reduce downtime, it also improves accuracy.` `It's not just a filter, it's a complete air-handling upgrade.` `This procedure reduces downtime and improves accuracy.`

**No systematic rule of three.** Forcing findings into exactly three parallel items (`faster, safer, more reliable`) when the source supports two or four is padding, not precision. State the actual count: `The upgrade reduces boot time by 40%.`

**No filler phrases.** 

| Kill                               | Replace with             |
| ---------------------------------- | ------------------------ |
| in order to achieve this           | to do this               |
| due to the fact that               | because                  |
| at this time / at the present time | now                      |
| it is important to note that       | (delete, state directly) |
| it should be noted that            | (delete, state directly) |
| with regard to / in terms of       | about, for               |
| in the event that                  | if                       |
| has the ability to                 | can                      |

**No excessive hedging.** `One could potentially argue that this might possibly reduce failure rates to some extent.` A technical document states what it knows directly, and states an actual, named limit when it does not (`Failure-rate data is not available for this configuration.`) rather than qualifying a claim into vagueness.

**No generic positive conclusions.** Kill on sight: `The future looks promising.`, `This represents a significant step forward.`, `Overall, this is an exciting improvement.` Replace with a concrete next fact or step, or delete the sentence — a technical document does not need a closing sentiment.

## Discourse-architecture patterns

These are structural tells, not lexical ones — a passage can pass every word-level check and still read as generated because of how it is built.

**No redundant recap.** A closing paragraph that restates the opening in the same words adds nothing a reader has not already read. State a genuinely new closing fact, or end the document where the last necessary instruction ends.

**No catalog structure without a throughline.** Covering every aspect of a system at equal, shallow depth — definition, advantages, disadvantages, best practices, all given the same weight regardless of relevance — reads as generated. Each section should depend on what the previous one established, or state only what is operationally relevant.

**No false balance.** Pairing every stated fact with an immediate counterbalancing qualifier (`However, it should also be noted that...`), or closing with `it depends on the context` instead of naming the dependency, is hedging at the paragraph level. State the actual condition: not `it depends`, but `it depends on the operating pressure — above 40 psi, use the reinforced seal.`

**No ghost Q&A.** A self-directed question with no real FAQ behind it (`Why is this step necessary? Because...`) is a padding device. State the fact directly: `This step relieves residual pressure before the housing is opened.`

**No constant granularity.** A document with no torque value, no error code, no part number, no measured tolerance anywhere reads as generated regardless of how compliant its sentences are, because real technical writing changes altitude — it drops to a specific, verifiable detail and climbs back. When the source material has a specific value, keep it; when it is missing, flag the gap rather than writing around the gap with vague language.

**State scope and known limits explicitly.** A descriptive passage that answers every question it raises, with no stated boundary, reads as generated — and, unlike an essay, a technical document should state its actual boundary rather than imply universal coverage the source does not support: `This procedure covers model X200 only; earlier models use a different filter housing.` This is about honest scoping, not withholding information — a procedure must still be complete and fully executable within the scope it states.

**No list as a substitute for a decision.** A bullet list appearing exactly where the source supports one specific answer (five possible torque values instead of the one that applies) replaces a decision with an enumeration. State the answer directly, and reserve lists for items that are genuinely comparable, not for avoiding a choice.

**State what the document applies to.** Generic, context-free instructions that could describe any equipment (`Replace the filter cartridge.` with no model, system, or version named) are a drafting tell — a real technical document is always written for a specific system and says so, even briefly: `On the X200 series pump, replace the filter cartridge as follows.`

## Lexical tells

Words and phrases that appear at elevated frequency in LLM-generated text. Roger J. Kreuz (_The Conversation_, 2025) documented "a dramatic increase in relatively uncommon words, such as 'delves' or 'crucial,' in articles published in scientific journals over the past couple of years."

### Single-word tells

| Word | Common in LLM output as | Replacement strategy |
| --- | --- | --- |
| delve | "let's delve into…" | "examine", or just say the thing |
| leverage | "leverage X to achieve Y" | "use", or restructure to active verb |
| crucial | "this is crucial" | drop or be specific about why |
| robust | "robust framework / system" | name the property concretely |
| underscore | "this underscores the importance of…" | "shows" / "proves" / "means" |
| navigate | "navigate the complexities of…" | drop the navigation metaphor; say the thing |
| seamlessly | "integrates seamlessly" | replace with what it actually does |
| vibrant | "vibrant community" | give a concrete signal of vibrancy |
| dynamic | "dynamic landscape" | be specific about what changes |
| embark | "embark on a journey" | drop the journey metaphor |
| foster | "foster collaboration" | "build" / "support" / "encourage" |
| harness | "harness the power of" | drop the harnessing metaphor |
| myriad | "a myriad of options" | "many" / specific number |
| tapestry | "rich tapestry of" | drop the tapestry metaphor |
| paradigm | "new paradigm" | "model" / "approach" — usually drop |
| pivotal | "pivotal moment" | be specific about why it pivoted what |
| holistic | "holistic approach" | name the components |
| synergize | n/a | banned in any register |
| utilize | "utilize" | "use" |
| facilitate | "facilitate" | "help" / "let" / "enable" |
| commence | "commence operations" | "start" / "begin" |
| furthermore | sentence opener | replace with "and" / drop / restructure |
| moreover | sentence opener | replace with "also" / drop |
| notwithstanding | "notwithstanding the…" | "despite" |

### Phrase tells

- "It's not just X, it's Y" — the formula construction; LLMs emit this 5–10× human baseline rate
- "In conclusion,…" — summative closer; humans usually skip it
- "It's important to note that…" — hedging that adds nothing
- "It's worth noting that…" — same
- "Crucially,", "Notably,", "Importantly,", "Essentially," — sentence-opener hedges
- "Picture this:" / "Imagine a world where" / "What if I told you" — manufactured-curiosity openings
- "Whether you're a seasoned X or a curious newcomer" — audience-segmenting filler
- "In the realm of" / "Navigating the landscape of" — empty scene-setting
- "Unlock the power of" / "Dive into" / "Buckle up" / "Let's dive in" — hype openers
- "From the comfort of your own home" — copywriting cliché
- "At the end of the day" — empty connector
- "Last but not least" — banned in lists
- "In today's fast-paced world" / "In an era of" — universally banned opener
- "Hope this helps!" — chatbot signature

## Structural tells

Isabel Al-Dhahir (_Verdict_, 2024): "AI models also overuse tricolons, a rhetorical device that consists of a series of three parallel words, phrases, or clauses."

| Pattern | Why it's a tell | Counter |
| --- | --- | --- |
| Tricolons in series ("X, Y, and Z") | LLMs default to threes everywhere; humans vary list lengths | Limit lists of 3 to 1 per 1000 words; use 2-item or 4-item lists elsewhere |
| Colon-titles ("The Future of X: A New Paradigm") | Over-represented in LLM headlines | Use single-clause titles; drop the colon |
| Summative closers ("In conclusion,…") | Humans skip this in 80%+ of pieces | End on the thing itself; no recap |
| Bullet-list overuse | LLMs convert prose to bullets reflexively | Audit: bullet-density per piece. Cap. |
| Hedged claims without source | "It is widely believed that…" / "Many experts agree…" | Force citations or remove |
| Symmetric paragraph lengths | Uniform 4-sentence paragraphs across the piece | Force variance via the rhythm rules |
| Anaphora overuse | Repeated openers in clusters | Reserve anaphora for closings only |
| "Not only X, but also Y" | LLM-favored coordination | Use "X. And Y." or restructure |

## Punctuation tells

The em-dash debate is contested. Ann Handley's published rebuttal (_The Em Dash Is NOT an AI Tell_, annhandley.com) argues it is unreliable as a single signal. Treat as suspicion, not proof.

| Punctuation pattern | Strength of signal |
| --- | --- |
| Em-dash density > 1 per 200 words | Weak — humans vary widely |
| Ellipsis outside direct quotation | Moderate |
| Parenthetical asides > 1 per 200 words | Weak |
| Em dash + tricolon + summative closer in same piece | Strong |

## Statistical tells

GPTZero (Edward Tian) frames detection as **perplexity** (how predictable to a language model) plus **burstiness** (sentence-length variance).

- **Low perplexity** correlates with AI generation. Hard to measure without tooling.
- **Low burstiness** = uniform sentence length. Measurable: σ < 4 words per 100-sentence window suggests automation. σ ≥ 6 is the human baseline target.

## Detection unreliability

Liang et al. (2023), _GPT detectors are biased against non-native English writers_ (_Patterns_, Cell Press; Stanford HAI): "These platforms incorrectly labeled more than half of the essays as AI-generated, with one detector flagging nearly 98%" of TOEFL essays by non-native English writers.

**Operational consequence**: use detectors as triage, not verdict. Codify rules LLMs cannot follow by default — that is the durable defense, not a detector arms race.

## Cliché openers

These all immediately disqualify the writer (the full opener catalog is in [[web/copy/hooks-and-titles]]):

**English**:

- "In today's fast-paced world…"
- "Have you ever wondered…?"
- "Did you know…?"
- "What if I told you…?"
- Dictionary opener played straight ("Productivity, defined as…")
- "In this article, I'll discuss…"
- "I'm not an expert, but…"
- Three rhetorical questions in a row
- "Imagine waking up…" without a specific scene
- "Hot take:", "Unpopular opinion:"
- "At [Company], we believe…"
- "Recently,…" without a specific date
- "You're not alone."
- "We've all been there."
- "Buckle up,"
- Misattributed Einstein / Seneca / Confucius / Bouddha quotes

## More current AI phrase tells

Beyond the phrase tells above, these patterns currently signal "this was written by or with an LLM with no humanizing pass". They are especially deadly in opening sentences because they prime the reader to read everything else as machine output.

- "Here's the kicker:"
- "At its core,"
- "That said,"
- Em dash overuse in body prose (one per article is fine; one per paragraph is a tell)
- Tricolons ("X, Y, and Z") where the three items are near-synonyms

## Diagnose

When auditing a piece for AI tells:

1. `grep -c -iE 'delve|leverage|crucial|robust|underscore|seamlessly|navigate|harness|foster|embark|myriad|tapestry|holistic|paradigm|utilize|facilitate|commence'` — count single-word tells. > 1 per 500 words = strong tell.
2. Count em dashes per 1000 words. > 5 = check the context.
3. Compute sentence-length σ on a 100-sentence sample. σ < 4 = robotic cadence.
4. Search for the formula constructions ("It's not just X, it's Y"; "Whether you're a seasoned X"). Any hit = rewrite.
5. Check tricolon density per 500 words. > 3 = AI-favored.
