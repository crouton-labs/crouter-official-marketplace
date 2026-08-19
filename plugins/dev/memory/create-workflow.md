---
kind: knowledge
when-and-why-to-read: When a repeatable repository procedure deserves a stable command — a development lifecycle, a release, a migration, a benchmark — this knowledge should be read because building it as one executable plus one entry document leaves agents operating a live contract instead of instructions that drift out of date the first time the command changes.
short-form: Build a repository workflow as one repository-owned executable plus one entry memory document sharing its name.
rationale: The first version was written as a procedure for authoring dev.md and dev.sh specifically, so it read as "how to set up the development workflow" rather than how to build any workflow; Silas corrected it 2026-08-12 — a workflow is the generic pairing of scripts with an entry memory document, and development is only its commonest instance.
slash: true
surfaces:
  - on: boot
    at: name
---

# /dev:create-workflow — build a repository workflow

Create or update one workflow for this repository: $ARGUMENTS

A workflow is a pair sharing one name: an executable the repository owns, and an entry memory document an agent reads before invoking it. A `dev` document beside a `dev` script is the development instance of that pair; a release, migration, or benchmark workflow has the same shape. Inspect whatever arrangement already exists and update it in place rather than adding a second path to the same work.

## The split

**The executable** owns deterministic mechanics and its own `-h`: grammar, effects, exit codes, scripting output, and repository-specific defaults. It lives with the repository's configuration, so it is the only piece entitled to encode them.

**The entry document** owns judgment: when this workflow is the right move, what outcome each operation produces, what evidence to read, diagnostic ordering, and repository-specific gotchas. It invokes the executable rather than reimplementing it, and never copies its help — `-h` is the live contract, so exact syntax comes from running it.

## Where each piece lives

The executable sits in the repository beside the code it drives. The entry document is a project memory document named for the command, linked from the project's existing memory front door — add the workflow to that store rather than standing up a competing one.

## Keep them honest

Update the document when an operation's meaning or its right use changes, not merely when the executable gains a flag. Include only examples worth executing, each verified against the live command. When the workflow already exists, extend it in place — a second wrapper, or help text copied into memory, is the failure this command exists to prevent.
