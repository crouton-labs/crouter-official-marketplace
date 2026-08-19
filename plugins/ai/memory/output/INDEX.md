---
kind: knowledge
when-and-why-to-read: When you are shaping what an LLM emits — reliable typed JSON, evals and quality gates, varied non-repetitive generation, or removing AI-writing tells — open this dir because it holds the output-engineering playbooks for those concerns.
short-form: LLM output engineering — structured output, evals/quality gates, output variety, sounding human.
---

# LLM output engineering

What an LLM emits, and how to make it reliable, varied, and human. Route by task:

- **"Get reliable typed JSON / extract structured data"** → [[ai/output/structured-output]] (constrained decoding, schema design).
- **"Build evals or a CI quality gate"** → [[ai/output/eval-and-quality-gates]] (LLM-as-judge, regression tests, metrics that work).
- **"Outputs feel samey across repeated calls"** → [[ai/output/output-variety]] (negative examples, constraint/seed rotation).
- **"Strip AI-writing tells from prose"** → [[ai/output/sounding-human]].

Docs:

- **structured-output** — reliable typed JSON via constrained decoding and schemas.
- **eval-and-quality-gates** — evals, LLM-as-judge, regression, guardrails.
- **output-variety** — varied, non-repetitive generation in loops.
- **sounding-human** — remove AI-writing tells from prose.
