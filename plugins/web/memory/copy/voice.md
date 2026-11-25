---
kind: knowledge
when-and-why-to-read: When you are defining or applying a voice, tone or prose style guide for a product, brand or publication, or editing copy to sound like one consistent writer, this knowledge should be read because "friendly but professional" attributes, word bans with no replacement and uniform sentence lengths produce bland copy that drifts between writers and reads as generated.
short-form: "Voice and prose style: 3-5 'X but never Y' voice attributes with do/don't and real anti-examples; NN/g four dimensions, archetypes, BrandSort; five prose layers with numbers (15-20 word mean, σ ≥ 6, ≤ 10% sentences over 25 words, breath point every 3-5 sentences, max 2 subordinate clauses, 2-5 sentence paragraphs); psychic distance; voice markers; punctuation and formatting policy; banned-term table with replacements; person, contractions, reading age, numerals; inclusive language; localisation; adversarial reading."
rationale: >-
  Adapted from samber's copywriting-tone-of-voice-creator and copywriting-prose-creator skills (github.com/samber/cc-skills, MIT): voice-attributes and lexicon-mechanics from the first, five-layers and the adversarial-reading section of audit-tools from the second. Where both covered a topic (active/passive, sentence length, punctuation, capitalisation) one version was kept. The PROSE.md/TONE.md generator workflows, brand atlases, channel and category playbooks, tool setup and French material were dropped. This document owns voice and prose style. AI tells live in [[web/copy/ai-writing-tells]]; hooks in [[web/copy/hooks-and-titles]]; landing-page copy in [[web/frontend/marketing-pages]].
---

# Voice and prose style

Voice is the brand's fixed personality; it does **not** change across channels. Tone modulates per situation; voice does not. Prose style is the five layers below (lexicon, syntax, rhythm, structure, plus voice markers, punctuation and formatting policy), and each is codified independently.

## Voice attributes

How to define, document, and validate the 3-5 voice attributes that anchor a voice guide. Voice is the brand's fixed personality — it does **not** change across channels. Tone modulates per situation; voice does not.

### The "X but never Y" pattern

The single most useful documentation device in the discipline. Slack's published voice:

> _"Confident (never cocky), Witty (but never silly), Conversational (but always appropriate and respectful), Intelligent (but not arrogant), Friendly (but not ingratiating), Helpful (never overbearing), Clear, concise and human."_

Why it works: every attribute carries its own anti-attribute. Writers learn what to do AND what to avoid in the same memorable phrase. Without the "never Y" half, "confident" reads as a synonym for "cocky" to half the team.

For each attribute, produce **three** "we are X but we are not Y" statements during the BrandSort exercise. The triplet forces specificity — by the third statement, generic phrasing collapses and concrete language emerges.

**Bad** (generic, won't survive use):

- "We are friendly."
- "We are professional."

**Good** (specific, falsifiable):

- "Confident, never cocky."
- "Plainspoken, not patronising."
- "Warm, but never saccharine."

### Attribute documentation template

Document each attribute in this structure:

```
#### N. <Attribute name>

**Definition:** <one line — what this attribute means in practice>

**Sounds like:** "<one example sentence in the voice>"

**Does not sound like:** "<one anti-example — generic, off-brand, or category default>"

**Do:**
- <concrete behaviour 1>
- <concrete behaviour 2>
- <concrete behaviour 3>

**Don't:**
- <concrete behaviour 1>
- <concrete behaviour 2>
- <concrete behaviour 3>

**Anti-example from past content:** "<actual past sentence that violated this attribute>"
```

**Why anti-examples from past content matter:** abstract anti-examples ("don't be too formal") fail to bite. Anti-examples sourced from the brand's own historical copy bite because writers recognise them — "oh, I wrote that exact sentence last quarter." This is where the guide stops being theatre and starts shaping behaviour.

### Worked attribute example

Drawn from a B2B SaaS context — adapt for the brand at hand.

```
#### 1. Plainspoken

**Definition:** We say what we mean in the fewest credible words.

**Sounds like:** "Your invoice failed. Update your card to keep your subscription."

**Does not sound like:** "Unfortunately, we were unable to process the transaction at this time."

**Do:**
- Use active voice — name who does what.
- Lead with the most important fact.
- Use one idea per sentence.

**Don't:**
- Hedge ("perhaps", "potentially").
- Use insurance-language passives ("an error has occurred").
- Stack qualifiers ("we are currently unable to potentially process...").

**Anti-example from past content:** "It has come to our attention that, in some cases, certain customers may have experienced..."
```

### NN/g 4 dimensions

Nielsen Norman Group's measurement layer for voice. Four spectra, each a 3-point scale (or 5-point if you want finer granularity):

| Dimension | One end | Other end | Default for most brands |
| --- | --- | --- | --- |
| Funny ↔ Serious | Funny | Serious | Lean serious; reserve funny for moments of relief |
| Formal ↔ Casual | Formal | Casual | Most modern brands lean casual |
| Respectful ↔ Irreverent | Respectful | Irreverent | Respectful unless the brand is Outlaw archetype |
| Enthusiastic ↔ Matter-of-fact | Enthusiastic | Matter-of-fact | Matter-of-fact for B2B trust; enthusiastic for D2C |

**Use case:** plot the brand on all four dimensions. Plot 3-5 competitors on the same chart. Look for clustering — if you're at the same coordinates as two competitors, your voice is not differentiating. Move at least one dimension.

**Anti-pattern:** clustering near the midpoint on all four dimensions. Per Quasa.io's diagnosis: _"teams defaulting to mid-range scores (4-7), result in bland, forgettable voices."_ If three dimensions are at midpoint, the brand has no voice.

**Empirically grounded:** NN/g research shows tone of voice measurably affects perceived friendliness, trustworthiness, and desirability. On average, **52% of the variability in desirability scores is explained by trustworthiness** — meaning trust-building tone dimensions (matter-of-fact, plainspoken, respectful) pay more than charm.

### Jung's 12 archetypes

Strategic personality alignment with audience psychology. Each archetype maps to a core motivation — pick the one whose audience your buyer most resembles.

| Archetype | Core motivation | Example brands |
| --- | --- | --- |
| **Innocent** | Safety, simplicity, optimism | Coca-Cola, Dove |
| **Sage** | Truth, knowledge, mastery | Stripe (docs), Harvard, BBC |
| **Explorer** | Freedom, discovery, autonomy | Patagonia, Jeep, REI |
| **Outlaw / Rebel** | Disruption, freedom, revolution | Harley-Davidson, Liquid Death, Oatly |
| **Magician** | Vision, transformation | Apple, Disney, Tesla |
| **Hero** | Mastery, courage, achievement | Nike, FedEx, Patagonia (also) |
| **Lover** | Intimacy, beauty, pleasure | Chanel, Godiva, Häagen-Dazs |
| **Jester** | Joy, play, mischief | Old Spice, Mailchimp, Duolingo (TikTok) |
| **Everyman** | Belonging, realism, equality | IKEA, Target, Budweiser |
| **Caregiver** | Service, compassion, protection | Johnson & Johnson, Volvo, charity: water |
| **Ruler** | Control, leadership, prosperity | Rolex, Mercedes-Benz, Microsoft (enterprise) |
| **Creator** | Self-expression, craft, innovation | Lego, Apple (also), Adobe |

**Use caveats:**

1. Most brands lead with one archetype and borrow from one adjacent (e.g. Apple = Magician primary, Creator secondary).
2. Archetype is a positioning shortcut, not a voice solution. Two "Hero" brands can sound completely different (Nike vs FedEx). Don't stop at the archetype label — derive concrete voice attributes from it.
3. Brands that lean too hard on archetype end up in cosplay. The archetype should inform decisions, not become a costume.

### BrandSort / message architecture

Margot Bloomstein's exercise (_Content Strategy at Work_, Morgan Kaufmann, 2012) for surfacing brand attributes through a card-sort:

1. Use a deck of ~100 brand-attribute adjective cards (or generate a list).
2. Sort each card into one of three piles: **who we are now**, **who we'd like to be**, **who we are not**.
3. Narrow the "who we'd like to be" pile to ~9 cards.
4. Group those 9 into three clusters of three; pick the strongest from each cluster.
5. The top 3 are the message architecture and the seed for voice attributes.

**Run with a cross-functional group of 6-10 people**: leadership, marketing, sales, customer success, product writing, support, HR. The disagreements between groups are diagnostic — surface them explicitly rather than averaging them out.

**Reconcile** by running BrandSort three times:

1. Once with leadership
2. Once with the writing team
3. Once with sales / customer success (who hear how customers actually talk)

Differences between the three runs reveal where the brand's self-image diverges from its operational reality. Force a decision in the room rather than letting it persist as ambiguity in the guide.

### Brand-as-person exercise

A forcing function for concreteness. If the brand were a person at a dinner party:

- Job, age range, hobbies?
- What do they read?
- Who do they admire?
- How do they introduce themselves?
- What do they refuse to talk about?
- What do they wear?

For B2B brands, substitute "ideal colleague" or "celebrity spokesperson" — Slack explicitly aims to be _"an ideal colleague"_. This frames voice as a relationship the brand has with the reader, not an abstract personality.

**Output:** one paragraph describing this person. Then check: does the brand actually sound like this person in its current content? If not, that gap is what the voice guide is for.

### Frameworks compared

| Framework | What it gives you | Where it falls short |
| --- | --- | --- |
| **NN/g 4 dimensions** | Measurable axes; comparable profiles; falsifiable decisions | Misses culture and lexicon; can produce average outputs if everyone clusters near midpoint |
| **Mailchimp voice/tone** | Cleanest articulation of voice/tone distinction; mature documentation pattern | Specific to a SaaS context; not a discovery method |
| **Jung's 12 archetypes** | Strategic personality alignment; audience psychology link | Often used too literally; archetypes become cosplay |
| **"We are / We are not"** | Forces specificity; produces usable do/don't pairs | Easy to write trivially ("we are friendly but not unfriendly") if not facilitated |
| **Voice attributes with do/don't tables** | The operational atom of any modern guide | Without examples, becomes abstract |
| **Tone spectrums** (Builtvisible / Adobe Spectrum) | Channel-by-channel modulation made visible | Maintenance burden if too many spectrums |
| **Margot Bloomstein's BrandSort** | Stakeholder alignment; prioritised attributes; basis for content audit | Outputs are inputs; still need lexicon, examples, modulation matrix |
| **GV Brand Sprint (3 Circles)** | Speed; useful for early-stage startups | Lightweight; not a substitute for the full method |

**No single framework is sufficient.** Combine: BrandSort for stakeholder alignment, NN/g 4 dimensions for differentiation, "X but never Y" for documentation, archetype as positioning shortcut. Each addresses a different stage of the work.

## The five layers of prose

Two organizing principles before codifying any layer.

**Style is content, not decoration.** Presentation shapes meaning — a faulty rhythm in a sentence can wreck it as surely as a wrong word. Every syntax choice, every breath point, every clause depth decision is a semantic act, not an aesthetic afterthought.

**Concision is the baseline.** Every word must justify its inclusion. Not brevity for its own sake — lean sentences carry more authority than padded ones because they never ask the reader to work without payoff.

Codify each layer independently. The layers are orthogonal: a brand can have distinctive lexicon and generic syntax (Liquid Death), or distinctive syntax and generic lexicon (Basecamp). Decide per layer where to conform and where to differentiate.

### 1. Lexicon

Word-level rules. Deterministic, testable.

#### 1.1 Use / avoid A–Z

A 50–200 entry table. GOV.UK is the gold standard — short entries, alternatives provided, exceptions enumerated.

| Term to use | Why | Term to avoid | Why avoid | Exceptions |
| --- | --- | --- | --- | --- |
| customer | active subject, dignified | user | reductive outside product docs | "user" OK in product docs |
| help | plain | facilitate | empty Latinate | — |
| build / create | concrete | leverage | empty verb | financial sense permitted |
| use | direct | utilize | wordy | — |
| because | causal | due to the fact that | wordy | — |
| make | concrete | deliver (abstract) | GOV.UK: "only pizzas, post and services are delivered" | concrete senses OK |

**Why bother:** banning a word without an alternative creates a vacuum writers fill with the next-worst word. Always pair ban with replacement.

#### 1.2 Terminology table

Product names, feature names, capitalization, hyphenation, plural forms. Update on every product launch — a guide that drifts from product reality is ignored by engineers.

#### 1.3 Jargon ladder per channel

| Channel grouping   | Specialist terms permitted                              |
| ------------------ | ------------------------------------------------------- |
| Long-form articles | Up to 5 per piece, with one-line glosses                |
| Social posts       | Up to 2 per post, no glosses (link to glossary instead) |
| Email & newsletter | Up to 1 per issue                                       |
| Marketing copy     | None unless category requires (compliance, deep-tech)   |

#### 1.4 Acronyms

Spell out on first use per page (GOV.UK convention) OR allow known acronyms unexpanded (Microsoft convention). Pick one. The choice depends on audience expertise — Expert audiences resent expansion of acronyms they own.

#### 1.5 Naming conventions

Company, products, features, methodologies. Include possessive forms. Critical for brands with non-standard capitalization (innocent).

#### 1.6 Foreign words

Italics or not, accents preserved or stripped, translation in parentheses or not. Especially critical for French-origin brands writing in English.

#### 1.7 Technical depth scale

Three-level: Layperson · Practitioner · Expert. Allocate per channel. Mixing levels within a single piece is the dominant readability failure.

### 2. Syntax

Sentence- and paragraph-level rules.

#### 2.1 Sentence length distribution

Plain Language Commission default: **15–20 words mean per sentence**.

| Metric | Default target | Why |
| --- | --- | --- |
| Mean sentence length | category-specific (10–22) | matches reading age, audience patience |
| Standard deviation | ≥ 6 words per 100-word window | uniform = robotic; variance = human |
| Sentences ≥ 25 words | ≤ 10% | long sentences load short-term memory; rationing protects comprehension |
| Sentences ≤ 8 words | ≥ 15% | punch sentences carry rhythm; their absence = monotony |

**Diagnose:** count words per sentence on a 1000-word sample; read the piece aloud, mark every breath point.

#### 2.2 Sentence types

- Declarative as default
- Rhetorical questions: max 1 per long-form piece (or banned entirely — they signal low confidence)
- Imperatives: reserved for CTAs and how-to steps
- Exclamations: rationed per the punctuation policy below

#### 2.3 Clause depth

Max 2 levels of subordination per sentence. Beyond that, comprehension drops. Coordination preferred for B2C, subordination acceptable for B2B and industry.

#### 2.4 Active vs passive

**Default: active.** Subject acts on object — "We charge the card" beats "The card is charged."

**Passive allowed for:**

- **Time-sensitive softening** (Fenton/Kiefer Lee, _Nicely Said_): _"In certain situations it helps you sound softer... It's especially useful for time-sensitive messages like payment confirmations and error messages."_ "Your card was charged" softens "We charged your card" in a payment confirmation.
- **Process descriptions where the actor is unimportant** ("The data is encrypted in transit").
- **Avoiding blame** when blame would damage the relationship ("An error occurred" beats "You did something wrong").

**Zombie test**: append "by zombies" after the verb. If it works, it's passive ("The data was analyzed [by zombies]").

#### 2.5 Parallelism

Enforced in lists, headings, tricolons. Parallel structures must share grammatical category (all noun phrases, or all verb phrases starting with the same tense).

#### 2.6 Paragraph length

- Target 2–5 sentences, max 80 words on web
- One-sentence paragraphs permitted for emphasis but ≤ 15% of paragraphs (else they lose impact)

#### 2.7 Paragraph architecture

Codify one or two house structures. Defaults:

- **TES**: Topic sentence + 2–3 evidence sentences + implication
- **PEEL**: Point, Evidence, Explanation, Link
- **PAS**: Problem, Agitation, Solution (newsletters, email)
- **Inverted pyramid**: most important first (newsletters, news)

### 3. Rhythm

How sentences move together. Hardest layer to codify; easiest to audit by reading aloud.

#### 3.1 Cadence

Target sentence-length variance such that σ ≥ 6 words per 100-word window. Lower = robotic / AI tell. See [[web/copy/ai-writing-tells]].

#### 3.2 Breath points

One short sentence (≤ 8 words) every 3–5 sentences. **Why:** reading is breathing; missing breath points exhaust the reader's working memory.

#### 3.3 Repetition

- Anaphora (repeated openers): permitted in closings and CTAs only, or banned
- Epistrophe (repeated endings): reserved for signature moments

#### 3.4 Callbacks

If the hook names a person, the closing returns to that person. **Why:** structural symmetry is a low-cost ethos signal that the piece is built, not generated.

#### 3.5 List patterns

- Prefer prose-then-list (introduce in a sentence) over list-then-prose
- Cap lists at 7 items (Miller's law)
- Parallel grammar enforced

#### 3.6 White space

- Long-form: subheading every 200–350 words
- Social posts: line break every 1–3 sentences
- Email & newsletter: one idea per paragraph

### 4. Structure

Macrostructures across the piece.

#### 4.1 Openings (hooks)

The full catalog is in [[web/copy/hooks-and-titles]]. State 3–5 permitted hook types per channel grouping. **Forbid**:

- Dictionary-definition openings ("Productivity, defined as...")
- "In today's fast-paced world", "À l'heure du tout-numérique"
- Self-referential openings ("This article will discuss...")

#### 4.2 Closings

End-of-article CTAs: [[web/copy/cta]]. State 2–3 permitted closing types. **Forbid**: generic "Thanks for reading", "What do you think?" unless signature.

#### 4.3 Transitions

Prefer logical connectors (because, therefore, however, but) over additive (also, moreover, furthermore). **Ban** "Last but not least."

#### 4.4 Headings

Sentence case, no terminal punctuation, frontloaded with topic noun or active verb, scannable in isolation. GOV.UK rule: "Frontload your headings so that the words that match your users' tasks are at the beginning."

#### 4.5 Subheadings

Parallel structure within an article (all questions, or all noun phrases, not mixed).

#### 4.6 Lists

Bulleted vs numbered policy (numbered only when order matters). Leading sentence required. No nested lists beyond one level.

#### 4.7 Asides

Parentheticals capped at one per 200 words.

#### 4.8 Quotations

Attribution style (name, title, organization; no honorifics on second reference). Minimum quote quality bar: does the quote say something the body cannot?

#### 4.9 Citations and links

Inline, frontloaded link text. **Never** "click here", "read more", "learn more".

#### 4.10 Blockquotes

Reserved for quotes of 25+ words or for high-emphasis claims.

#### 4.11 Reader positioning (psychic distance)

Gardner's psychic distance continuum describes how close or far the reader sits from the action, the brand, or the subject matter. In brand prose (not fiction), the spectrum runs:

| Distance | Register | Example |
| --- | --- | --- |
| **Far** | Third-person, external, historical | "Acme was founded in 2005 with a mission to reduce infrastructure costs." |
| **Medium-far** | Category framing, industry truth | "Most infrastructure teams spend 40% of their time firefighting, not building." |
| **Medium-close** | Reader-adjacent, hypothetical | "Your team is probably dealing with this right now." |
| **Close** | Second-person present, internal experience | "You open the dashboard. The number is wrong. Again." |

**Why it matters:** distance controls emotional temperature. Far establishes authority and context. Close creates empathy and drives conversion. Uncontrolled oscillation reads as schizophrenic; deliberate oscillation creates emotional shape.

##### Default positions per channel

| Channel grouping | Default | Rationale |
| --- | --- | --- |
| Long-form articles | Medium-far opening → close at key anecdote → far for analysis → close at CTA | Authority frame, then humanity, then rigor, then conversion |
| Social posts | Close hook → medium for argument → close for CTA | Hook must land immediately; brevity requires intimacy |
| Email & newsletter | Medium-close default | Personalization convention; inbox is a private channel |
| Marketing copy | Close default for emotional sections, far for proof/credibility | Conversion copy needs immersion; proof copy needs objectivity |

##### Shift signals

Moving **closer**: second-person pronouns ("you", "your"), present tense, sensory detail, internal monologue framing ("You're wondering if…"), short sentences, concrete nouns.

Moving **farther**: third-person, past tense, statistics, brand history, passive constructions, abstract nouns, long sentences.

**Diagnose:** scan a 1500-word piece and annotate each paragraph with its distance level (F / MF / MC / C). A flat distribution (all one level) means the piece has no emotional shape. High variance without a pattern means oscillation is accidental. The target is an intentional arc.

### 5. Voice markers

The small set of repeatable signature elements that make the brand recognizable in a blind test. Catalogue 5–12 markers; more is unenforceable.

| Marker | Definition | Example |
| --- | --- | --- |
| Signature moves | Recurring rhetorical move | Basecamp's contrarian one-sentence paragraph |
| Signoffs | Fixed or templated closing line | Innocent's "Win." |
| Recurring metaphors | 2–3 metaphors the brand owns and reuses | — |
| Idioms | Curated short list (drift is a strong signal of distributed-team decay) | — |
| Taboos | Explicit list of phrases the brand never uses | "leverage", "delve", "in today's fast-paced world" |
| Intentional tics | Deliberately quirky moves (named, rationed) | Innocent's lowercase brand name; Oatly's parenthetical meta-commentary |

**Rationing matters.** Innocent's puns work because they are rationed. Unrationed quirks collapse into self-parody (the Wackywriting failure mode, per Nick Asbury).

### 6. Punctuation policy

Declare a position on each. The list is non-negotiable — silence creates drift.

| Mark | Position |
| --- | --- |
| Em dash | Permitted / banned (declare) — current AI-tell candidate; rationed even when permitted |
| En dash | Ranges only (2024–2026) |
| Semicolon | Permitted in long-form, banned in social and email subject lines |
| Colon | Lists, examples, rephrased restatements; max 1 per paragraph |
| Ellipsis | Banned outside direct quotation (AI tell) |
| Parentheses | Rationed: 1 per 200 words |
| Italics | Foreign words, titles of works, technical first-use emphasis |
| Bold | Scannable phrases in long-form only |
| Quotation marks | Single (UK) or double (US) per locale; consistent |
| Exclamation marks | 1 per 1000 words in long-form; 1 per LinkedIn post; 1 per newsletter |
| Brackets | Editorial insertions in quotations only |
| Hyphens | Compound modifiers before nouns (well-known author); maintain a hyphenated-compound list |
| Oxford comma | Declare yes/no, enforce |
| Capitalization | Sentence case for headings (Microsoft, Mailchimp, IBM Carbon default); title case for proper nouns and product names |

### 7. Formatting policy

| Element | Rule |
| --- | --- |
| H1 | One per page |
| H2 | Sections |
| H3 | Sub-sections |
| H4+ | Technical docs only |
| Heading length | ≤ 70 characters |
| Bullets | 3–7 items, parallel grammar, leading sentence required, max 1 level of nesting |
| Numbered lists | Only when sequence matters |
| Code blocks | Language tag mandatory, max 30 lines, prose explanation precedes code |
| Images | Sentence-case captions, descriptive alt text mandatory (WCAG 2.2) |
| Callouts (note, warning, tip) | Rationed: 1 per 800 words in long-form |
| Tables | Only when relationship is two-dimensional |
| Links | Frontloaded link text — never "click here", "learn more", "read more" |

## Lexicon decisions

The vocabulary and grammar layer of voice. **Banned-word lists do more work than power-word lists** — prevention is cheaper than prescription. A writer encountering "we don't use 'leverage' (unless in the financial sense)" never reaches for it again, while a power-words list, by contrast, rarely gets consulted in the moment of drafting.

### Preferred terms

Named concepts and nouns the brand uses consistently. Each entry: term, meaning, what NOT to confuse it with.

| Term                    | Use for              | Don't confuse with        |
| ----------------------- | -------------------- | ------------------------- |
| `<brand-specific term>` | `<one-line meaning>` | `<near-synonym to avoid>` |

**Common decision: what to call the customer.**

| Choice | Connotation | Example brands |
| --- | --- | --- |
| **Members** | Belonging, community, recurring | YMCA, Equinox, Costco |
| **Customers** | Transactional, broad | Most B2B SaaS |
| **Users** | Functional, neutral | Engineering-led brands |
| **Readers** | Editorial relationship | Substack, NYT |
| **Subscribers** | Ongoing relationship | Streaming, newsletters |
| **Players** | Active participation | Gaming, fantasy sports |
| **Patients** | Care relationship | Healthcare |
| **Clients** | Service, expertise | Consulting, legal, finance |

Pick one. Use it everywhere. Modulating the customer-noun across channels confuses the brand-customer relationship.

### Banned terms

The single highest-leverage section of a voice guide.

**Pattern (GOV.UK style):** for each banned term, name the replacement and the reason.

| Banned | Use instead | Reason |
| --- | --- | --- |
| Agenda | Plan | Loaded political connotation in many contexts |
| Deliver | Make, create, provide | Used in too many contexts to mean anything specific |
| Leverage (non-financial) | Use, influence | Corporate cliché; concrete verbs are stronger |
| Empower / empowerment | (omit) | Saturated; signals filler |
| Solution | Product, service, fix | Vague; replace with the specific noun |
| Robust | Reliable, well-tested, durable | Vague intensifier; pick the actual property |
| Synergy | (omit) | Self-parody at this point |
| Drive (transitive, abstract) | (omit) | "Drive growth", "drive engagement" — replace with the concrete mechanism |
| Innovative / innovation | (omit, or describe the actual innovation) | Empty claim |
| Cutting-edge / next-generation | (omit) | Empty intensifier |
| Disruptive | (omit) | Saturated; describe what the disruption is |
| Ecosystem | Product set, integrations, marketplace | Overloaded term |
| Touch base | Talk, meet, call | Business-speak |
| At the end of the day | (omit) | Filler |
| Going forward | (omit, or use "from now on") | Filler |
| Best-of-breed | Best | Acquired meaning; meaningless |
| Game-changer | (omit) | Empty claim |
| Thought leader / thought leadership | (omit, or describe the actual perspective) | Self-aggrandising; reads as marketing |
| Reach out | Contact, ask, email | Business-speak |
| Bandwidth (non-technical) | Time, capacity, attention | Lazy substitution |

### Power words

10-30 words that consistently appear in best-performing copy for the brand. Mine your top 10 best-performing pieces; the words that repeat across them are your power words.

**Examples (D2C):** free, new, you, save, easy, now, today, last, finally, real.

**Examples (B2B):** because, specifically, exactly, never, fastest, reduced, prevented, real, evidence, named.

Power words are less load-bearing than banned-word lists. Treat them as descriptive (what we already do well) rather than prescriptive (what we must do).

### Jargon policy

| Audience × channel | Jargon policy |
| --- | --- |
| Technical audience × dev docs | Allowed; assumed shared vocabulary |
| Technical audience × marketing top-of-funnel | Define on first use; use sparingly |
| Mixed audience × marketing | Avoid; substitute with plain-English equivalent |
| Non-technical audience × any | Banned |
| Internal audience × internal comms | Allowed |
| Sensitive comms (apology, crisis) × any | Banned without exception |

### Naming conventions

| Element | Rule |
| --- | --- |
| Brand name | `<exact capitalisation, e.g. "GitHub" not "Github">` |
| Product names | `<rules — e.g. always capitalised; never pluralised>` |
| Feature names | `<sentence case unless trademarked>` |
| Competitors | `<how to refer to them, if at all — many brands name competitors only in comparison content>` |
| Internal teams | `<external-facing names — usually different from internal Slack channel names>` |

## Mechanics decisions

### Person

| Choice | Effect | Default for most brands |
| --- | --- | --- |
| First plural ("we") | Brand-as-collective; warmer | Most consumer brands |
| Second ("you") | Reader-centric; direct | Most product and marketing copy |
| Third | Distant; journalistic or press | Press releases, case studies |
| Mixed | Use "you" for reader actions, "we" for brand actions | The modern default |

### Contractions

| Choice | When |
| --- | --- |
| Yes (informal: don't, can't, you're) | Conversational brands, consumer-facing copy |
| No | Formal contexts, multi-language readability, GOV.UK style |
| Contextual | Most brands — yes in marketing and product, no in legal/regulatory |

**Rule worth knowing:** GOV.UK avoids **negative** contractions (don't, can't, won't) because they confuse non-native readers — the apostrophe is easy to miss, flipping the meaning. Allow positive contractions ("we're", "you're") even when banning negative ones.

### Reading age

**GOV.UK target:** reading age of 9. Sarah Richards (GDS): _"Writing for a reading age of 9 isn't the same as writing for a 9-year-old. It's about making sure your content is quick to scan, easy to read and simple to understand."_

**Tools to measure:** Flesch-Kincaid grade level, Hemingway Editor. Aim for grade 6-8 (US) / reading age 9 (UK) for general-public content.

**Higher reading age justified for:** dev docs, expert reference material, specifications.

### Emoji policy

For each channel in scope, decide:

- Allowed? (Y/N)
- Which emoji set? (Most brands restrict to a subset to avoid mismatched register.)
- Frequency cap? (1 per post? 1 per paragraph? None?)
- Specific emojis banned? (e.g. faces with unclear connotation: 😅, 😬)

In-product UI generally bans emoji except in marketing-adjacent surfaces (onboarding, empty states).

### Numerals, dates, currencies

| Element | Common convention |
| --- | --- |
| Numerals under 10 | Spell out ("three options") unless in tables/headlines |
| Numerals 10+ | Use figures ("12 options") |
| Mixed in one sentence | Use figures throughout ("3 to 12 options") |
| Dates | DD MMM YYYY (en-GB); MMM DD, YYYY (en-US); ISO 8601 (YYYY-MM-DD) for technical contexts |
| Currencies | Symbol + amount (€1,234.56); ISO codes (EUR, USD) for technical contexts |
| Percentages | Use "%" (not "percent") in body copy |
| Phone numbers | E.164 format (+44 20 7946 0958) for international |

## Inclusive language

**Base references:**

- Karen Yin, _Conscious Style Guide_ — the canonical living resource
- APA Inclusive Language Guidelines
- For UK English: Citizens Advice plain-language guide

**Yin's principle:** _"To write consciously is to be aware of and compassionate toward the actual people who determine not only the success but also the meaning of any work."_

**Decisions to document per locale:**

- **Gendered language:** default to avoidance; use singular "they" when gender is unknown. Mailchimp: _"Avoid gendered language and use the singular 'they.' When writing about a person, use their preferred pronouns; if you don't know those, just use their name."_
- **Disability / ability:** person-first ("person with diabetes") vs identity-first ("autistic person"). Defer to the community's expressed preference where it exists.
- **Race, ethnicity, nationality:** specific over abstract; capitalisation per community preference (e.g. "Black" capitalised in US convention).
- **Age:** avoid "elderly"; prefer "older adult" or specific age range.
- **Class, education, geography:** avoid sneering shorthand ("flyover country", "uneducated voters", "low-skilled workers").
- **Neurodiversity:** community-led terminology; defer to current consensus.

## Localisation

**Per market, document:**

- Which idioms, sports metaphors, pop-culture references, and humour styles do **not** travel.
- Regional variants: en-US vs en-GB vs en-AU; pt-BR vs pt-PT; es-ES vs es-MX vs es-AR; zh-CN vs zh-TW.
- Date, time, address, phone, currency conventions.
- Honorifics and formal-vs-informal address (tu/vous in French; tú/usted in Spanish; T-V distinctions widely).
- Politeness register: Japanese teineigo / sonkeigo / kenjogo; Korean nida-form vs haeyo-form.

**Transcreation, not translation.** Surface-translating English brand voice into French or Japanese produces tin-eared copy that fails the local market. Hire writers in each market; do not rely on translation memory alone for surface tone. Lokalise and similar platforms operationalise transcreation workflows.

## Adversarial reading

Quantitative tools surface signals. Adversarial reading surfaces what the numbers miss: the sentences that don't earn their place, the moments authority collapses, the reader questions that go unanswered.

**Core posture:** the writer already believes the draft works. Challenge that assumption. Read to find what fails, not to confirm what succeeds.

### Protocol (per piece)

Read the piece once without stopping. Then re-read and mark:

1. **Dead weight** — sentences or phrases that could be deleted without information loss. Count them. A ratio above 15% signals a draft, not a final piece.
2. **Authority collapse** — claims that invite "says who?", statistics without sources, analogies that don't hold, jargon used to signal expertise rather than convey meaning.
3. **Reader dropout points** — paragraphs where a reader would disengage: slow accumulation with no payoff, five consecutive medium-length sentences with no breath point, transitions that require re-reading.
4. **Unanswered questions** — the "so what?" question every factual claim generates. If the paragraph raises a question and the next paragraph doesn't resolve it, the structure is broken.
5. **Distance incoherence** — sudden shifts in psychic distance (see § 4.11 above) with no structural reason (e.g., a close-second-person hook that snaps to third-person-corporate in paragraph two).

### Critique dimensions for brand prose

Adapted from fiction critique methodology (haowjy/creative-writing-skills@prose-critique):

| Dimension | For brand prose | Key question |
| --- | --- | --- |
| **Structure** | Piece-level coherence, pacing, payoff mechanics | Does each section earn its length? Does the opening pay off at the close? |
| **Voice** | POV stability, dialogue effectiveness, implicit meaning | Does the brand voice hold across the full piece, or drift mid-article? |
| **Prose** | Sentence-level craft, rhythm, word repetition, descriptor-to-narrative ratio | Are there more than 3 consecutive sentences of the same type? |
| **Brand persona** | Motivational consistency of the brand character | Does the brand's stated archetype match the brand's actual prose behavior? |
| **Continuity** | Factual accuracy, claim consistency within the piece | Does the piece contradict itself across sections? |

### Sorting findings

Map each finding to a bucket:

- **Signature** — recurring and working; codify as rules to preserve
- **Default** — recurring and neutral; decide whether to keep or differentiate
- **Noise** — accidental and inconsistent; no action needed
- **Liability** — recurring and harmful to credibility or engagement; codify as explicit prohibitions

The liability bucket is what adversarial reading surfaces that metrics miss.

These tools surface signals; none replaces editorial judgment. A piece can pass every quantitative check and still read flat — because the voice markers are missing, or the structure is wrong, or the hook doesn't earn the close. Use audit tools as the first filter, then ship to human editorial review for the rest.
