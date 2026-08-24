---
kind: knowledge
when-and-why-to-read: When drafting the plan document itself, this knowledge should be read because a plan whose task table closes its own preconditions executes without an implementer discovering a missing input mid-build.
short-form: The plan artifact schema — overview, phases, verification, the task-row columns, parallel-safe and bounded task rules, the precondition-closure check, and the index-plan form.
rationale: >-
  Task shape and plan structure rode at boot content inside the plan guide, charging every plan wake for a shape needed only at writing time. Plans also stored cross-cutting invariants once at the top where task-executing nodes never saw them, and shipped tasks assuming inputs no earlier task produced — both failures surfaced during implementation, the most expensive place to find them.
---

# Plan schema

Write `plan-<subject>.md` with an **overview**, **ordered phases** broken into tasks, and a **verification** section stating how the finished work is checked against its contract. Close with the **Pointers** section per [[dev/artifacts]], naming the spec, design, and exploration maps the plan rests on.

## The task row

A task is the atomic unit one implementation node picks up cold and executes in a single context window. Each task row carries:

- the file paths it exclusively owns;
- what changes in each;
- its hard dependencies, including a type or export a sibling task defines;
- its output — what the next task can assume exists;
- the cross-cutting invariants this task can violate.

An invariant rides on every task row that can violate it, never only in a section at the top of the plan — the node executing one task reads its row, not the preamble.

## Task rules

A task is **parallel-safe**: no other task in its phase owns its files. Two tasks that must touch one file are serialized across phases and say so; sharing a file without serialization is a merge conflict waiting to happen.

A task is **bounded**: finishable in one window without re-reading the plan. A task description longer than a short paragraph is too large — split it.

## Precondition closure

Before finishing, walk the task table once: for every input a task assumes — a file, type, export, migration, or running service — name the earlier task that produces it or confirm it exists today. A plan that fails this walk ships a guess as a dependency.

## Index-plan form

A decomposed plan produces an index plan in this same schema at stitched altitude: the task table the implementation orchestrator executes, phases and dependencies across parts, and Pointers naming each `plan-<subject>-<part>.md` by absolute path. Detail lives in the part-plans; the index is not allowed to carry it.
