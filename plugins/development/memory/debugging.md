---
kind: knowledge
when-and-why-to-read: When you are stuck on a hard bug that resists quick fixes, this skill should be read because it gives systematic methodologies — rubber ducking, code tracing, hypothesis testing, logging strategy — to find the root cause.
short-form: Systematic debugging for hard bugs — rubber ducking, code tracing, hypothesis testing, logging.
system-prompt-visibility: name
file-read-visibility: none
gate:
  kind:
    imatches: '^developer$'
---

# Debugging Hard Bugs

## Rubber Ducking

Quote code snippets and explain what each chunk *should* do vs *actually* does. Don't assume—verbalize the logic. Discrepancies reveal bugs.

## Code Flow Tracing

Trace data from entry point to failure. At each transformation: what goes in, what comes out? Mark where expectations diverge.

**Failure-prone boundaries:** async, serialization, type coercion, null propagation, state mutations.

## Hypothesis Testing

1. List 3-5 possible causes
2. List 3-5 assumptions you're making
3. Test to eliminate possibilities
4. Repeat until one remains

**Don't** change code hoping it helps—that creates noise.

## Logging

Log at decision points and async boundaries, not everywhere.

**Workflow:**
1. Add targeted logs
2. Have user perform action and report output
3. Diagnose and fix
4. **After user confirms fix works:** remove all added logging

## Delegated Investigation

For complex or unfamiliar code acting as a black box, create a focused `explore` child to trace the code path while you continue investigating. Use an `advisor` child when the task is diagnosis or a recommendation rather than current-state mapping.

Pass children the relevant file paths and observed behavior, but not your hypotheses or assumptions, so they form independent conclusions instead of inheriting your bias.

## Before Fixing

- [ ] Identified exact failing line(s)?
- [ ] Understand *why* it fails?

If no, keep investigating.

## Related

- [Frontend Debugging](debugging-frontend.md)
