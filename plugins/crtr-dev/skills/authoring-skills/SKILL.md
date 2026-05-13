---
name: authoring-skills
type: playbook
description: How to author a crtr skill — directory layout, SKILL.md frontmatter, naming rules, nested sub-skills, and the scaffold/validate loop. Use when creating a new skill in any crtr plugin or auditing an existing one.
keywords: [skill, SKILL.md, frontmatter, authoring, plugin]
---

# Authoring crtr skills

A **skill** is a directory. `SKILL.md` is its entry file — the same role `index.html` plays for a web directory. The dir *is* the skill: siblings (`reference.md`, scripts, examples) ride along, and nested subdirs are themselves skills addressed by path.

Audience: LLM agents loading this skill to create or audit another skill. Be decision-first.

## Minimum viable skill

```
plugins/<plugin>/skills/<name>/SKILL.md
```

```markdown
---
name: <name>
type: <type>
description: <one-sentence summary — used by the agent to decide when to load this skill>
keywords: [optional, list]
---

# Title

Body in markdown. This is what `crtr skill show <name>` prints to stdout.
```

No build step, no registry — drop the dir under `plugins/<plugin>/skills/`, and `crtr skill list` picks it up.

## Skill types

Pick the type that matches what the agent *does* after reading.

| Type | Agent action | Example |
|---|---|---|
| `playbook` | Decides — applies judgment rules ("when X, do Y because Z") | authoring-skills, cli-design |
| `primer` | Navigates — learns codebase/architectural facts; source of truth = code | crtr-internals, plugin-resolution |
| `reference` | Looks up — stable external facts; source of truth = docs/specs/protocols | semver-rules, http-status-codes |
| `runbook` | Executes — follows a numbered procedure with decision points and rollback | developing-crtr-dev, deploy-plugin |
| `freeform` | None of the above | catch-all |

Set the type in frontmatter; `crtr skill new --type <type>` does this for you.

## The `name` rule

The `name:` frontmatter field **must match the skill's path under `skills/`**. For a flat skill at `skills/cli-design/SKILL.md`, `name: cli-design`. For a nested skill at `skills/web/frontend/design-website/SKILL.md`, `name: web/frontend/design-website` — slashes and all.

`crtr skill new <plugin>:<name>` scaffolds this correctly. `crtr doctor` flags drift if you rename the directory without updating the frontmatter (or vice versa).

## Nested skills

Nesting is just directory nesting. There is no `parent:` field or registry — the path *is* the hierarchy.

```
skills/
├── prompting-effectively/SKILL.md         # flat
├── cli-design/                            # flat with assets
│   ├── SKILL.md
│   └── reference.md
└── web/
    └── frontend/
        └── design-website/SKILL.md        # name: web/frontend/design-website
```

Resolve with `crtr skill show web/frontend/design-website`.

## Assets and references

Anything sibling to `SKILL.md` is part of the skill. The `cli-design` shape — `SKILL.md` for the prose, `reference.md` for the long tables you don't want inline — is the canonical pattern. Scripts, example configs, screenshots all live as siblings. Reference them from `SKILL.md` with relative paths.

Do **not** put assets in a separate top-level `assets/` dir; the dir is the skill, and grouping by skill keeps moves atomic.

## Frontmatter fields

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Must equal the path under `skills/`. Slashes for nested. |
| `type` | yes (for new skills) | One of: `playbook`, `primer`, `reference`, `runbook`, `freeform`. Older skills without `type` warn but don't fail in doctor. |
| `description` | yes | One sentence. The agent uses this to decide when to load the skill — front-load the trigger ("Use when…"). |
| `keywords` | no | Array of strings. Improves `crtr skill grep` and future search. |

Keep the description **active and specific**. "Guide to X" is weak; "Use when doing X — covers Y and Z" is strong.

## The authoring loop

```bash
# 1. Scaffold
crtr skill new crtr-dev:my-new-skill --type playbook --description "Use when …"

# 2. Find and edit
crtr skill path crtr-dev:my-new-skill              # absolute path
$EDITOR $(crtr skill path crtr-dev:my-new-skill)   # or `crtr skill edit …`

# 3. Validate
crtr doctor                                        # parses frontmatter, checks name drift, checks type

# 4. Preview as the agent would see it
crtr skill show my-new-skill
```

## Cross-skill links

- Within-plugin siblings and nested skills are **auto-appended** by `crtr skill show` in a `<neighbors>` XML block inside the `<skill>` wrapper. Don't hand-roll them in the body.
- `## Related` (in the body) is for **cross-plugin or distant references only** — not siblings.
- Use `` `<plugin>/<name>` `` for cross-plugin refs, or `` `<scope>:<name>` `` for scope-direct.
- To suppress auto-neighbors when scripting: `crtr skill show <name> --no-neighbors`.

If a skill's `## Related` section would only contain siblings, delete the section.

Output shape:

```
<skill name="..." path="...">
{author-written body, including any cross-plugin ## Related}
<neighbors>
## Neighbors
...siblings + nested, auto...
</neighbors>
</skill>
```

Future auto-context (e.g., recent edits, schema) will land as additional XML blocks inside `<skill>`. Anything inside an XML tag other than `<skill>` itself is machine-generated; only the loose body is authored.

## Collisions and disambiguation

Skill names need not be globally unique — only unique *within a plugin*. If two plugins ship a skill with the same name, the resolution order (project plugin → user plugin → project marketplace → user marketplace) picks one, and `crtr` exits `4` for ambiguous lookups when you need to be explicit. Use `<plugin>:<skill>` to disambiguate: `crtr skill show crtr-dev:authoring-skills`.

## What goes in the body

Skills are *reference + methodology* for an agent. Good skills:

- Lead with the trigger conditions and a 1-paragraph summary so the agent can decide whether to read further.
- Use headings the agent can grep for (`## When to use`, `## Common pitfalls`, `## Reference`).
- Show concrete invocations — code blocks beat prose.
- Link sibling assets: `see [reference.md](./reference.md)` for tables and long lists.

Bad skills:

- Tell the agent *what they already know* (e.g., "markdown uses `#` for headings").
- Bury the trigger condition under five paragraphs of motivation.
- Pile every related-but-distinct topic into one skill — split into nested sub-skills instead.

## Validation contract

`crtr doctor` checks every skill:

- Frontmatter is valid YAML.
- `name` matches the dir path.
- `SKILL.md` exists and is non-empty.
- Referenced sibling files exist (best-effort: parses relative markdown links).
- `type` is present — **warn** if missing on skills created after the type field was introduced.
- `type` value is in the enum — **fail** if the value isn't one of the five recognized types.

A skill that fails doctor still loads — doctor is advisory — but `crtr skill list --json` flags it.

## See also

- [[developing-crtr-dev]] — workflow for shipping a skill through this plugin and marketplace.
- `SPEC.md` in the crouter repo — source of truth for the skill format and resolution order.
