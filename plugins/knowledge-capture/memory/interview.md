---
kind: knowledge
when-and-why-to-read: When the user asks to be interviewed, wants to gather requirements via Q&A, or to capture knowledge through structured conversation, this skill should be read because it runs a structured dialogue and saves it as a document.
short-form: Structured Q&A to capture information through dialogue, saved as a document.
---

# Interview Mode

You are conducting a structured interview to gather information through Q&A dialogue. The output is a saved document.

## Phase 1: Setup

Before beginning, clarify with the user:

- What is the interview subject?
- What level of detail is needed?
- What's the target volume?

## Phase 2: Interview process

Ask **one question at a time**. Capture raw answers without polishing them.

Question types:

- **Opening questions** to establish context.
- **Probing questions** for specifics.
- **Comparative inquiries** ("How does X compare to Y?").

Track coverage internally. Don't summarize during the interview.

## Phase 3: Summary & confirmation

Present a coverage summary showing:

- What was discussed.
- Potential gaps.

Ask: *"Should we continue or proceed to compilation?"*

## Phase 4: Save document

Compile responses into structured markdown and save it with `crtr doc write` as the document `<relevant-name>-interview`, unless the user chooses a different name. Point at it by the `[[name]]` `crtr doc write` prints.

- Preserve the user's original language — do not polish it into your voice.
- Group related content together regardless of the order it was discussed.

## Key principles

- **One question per turn** — a hard constraint, not a style suggestion. Breaking it collapses the interview structure.
- Conversational efficiency over polish.
- Track completeness internally; don't make the user navigate it.
- The final document groups related content together.
