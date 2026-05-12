---
name: developing-crtr-dev
description: How to install, use, and extend the crtr-dev plugin — the canonical home for skills that guide crtr's own development. Use when adding a skill to crtr-dev, bumping its version, or onboarding to the self-hosting workflow.
keywords: [crtr-dev, plugin, marketplace, self-hosting, workflow]
---

# Developing the crtr-dev plugin

`crtr-dev` is the meta-plugin: it ships skills that explain how to build crtr itself. We dogfood the plugin/skill system to develop the plugin/skill system. New crtr feature → new skill in `crtr-dev` → next session, the agent already knows how to use it.

The plugin lives in the `crouter-official-marketplace` repo, the first-party marketplace for crtr.

## Repo layout

```
crouter-official-marketplace/
├── .crouter-marketplace/marketplace.json   # marketplace manifest
└── plugins/
    └── crtr-dev/
        ├── .crouter-plugin/plugin.json     # plugin manifest
        └── skills/
            ├── authoring-skills/SKILL.md
            └── developing-crtr-dev/SKILL.md  # you are here
```

The marketplace and plugin manifests both carry `version` fields. Bump them when content changes meaningfully.

## Installing for use

One-time, per scope:

```bash
# Register the marketplace (user scope is private; project scope checks in)
crtr marketplace add https://github.com/CaptainCrouton89/crouter-official-marketplace --scope user

# Install the plugin (symlinks <scope>/plugins/crtr-dev → marketplace path)
crtr marketplace install crouter-official-marketplace:crtr-dev --scope user
```

Verify:

```bash
crtr plugin list                    # crtr-dev should appear, enabled
crtr skill list --plugin crtr-dev   # authoring-skills, developing-crtr-dev
crtr skill show authoring-skills    # prints body to stdout
```

Because marketplace-sourced plugins install via symlink (per SPEC Decision 2), a `crtr marketplace update crouter-official-marketplace` is enough to pick up new skills — no second clone, no plugin re-install.

## Adding a new skill

The full loop, from scratch:

```bash
# 1. From the marketplace repo root
cd ~/Code/cli/crouter-official-marketplace

# 2. Scaffold via crtr (it writes the frontmatter and enforces the name rule)
crtr skill new crtr-dev:<new-skill-name> \
  --description "Use when <trigger> — covers <topics>."

# 3. Write the body. See [[authoring-skills]] for the format rules.
$EDITOR plugins/crtr-dev/skills/<new-skill-name>/SKILL.md

# 4. Validate
crtr doctor

# 5. Bump versions (both manifests)
#    - plugins/crtr-dev/.crouter-plugin/plugin.json   → version
#    - .crouter-marketplace/marketplace.json          → plugins[name=crtr-dev].version
#    Use semver: patch for typos/clarifications, minor for new skills, major for breaking renames.

# 6. Commit & push
git add -A
git commit -m "crtr-dev: add <new-skill-name>"
git push
```

Anyone with the marketplace installed picks it up on their next `crtr marketplace update` (or auto-update tick, if they've set `auto_update.content: "apply"`).

## Editing an existing skill

```bash
$EDITOR $(crtr skill path crtr-dev:authoring-skills)
# or, if the file lives in this checkout:
$EDITOR plugins/crtr-dev/skills/authoring-skills/SKILL.md
```

Bump `version` in `plugin.json` and `marketplace.json` if the edit is anything more than a typo. Doctor first, commit second.

## Renaming or moving a skill

The `name:` frontmatter field must match the directory path under `skills/`. If you move `skills/foo/SKILL.md` → `skills/bar/SKILL.md`, also update `name: foo` → `name: bar`. `crtr doctor` will flag the drift if you forget.

For nested renames (`skills/web/foo/SKILL.md` → `skills/web/bar/SKILL.md`), update to `name: web/bar`.

## Versioning rules of thumb

| Change | Bump |
|---|---|
| Typo, wording polish | patch (0.1.0 → 0.1.1) |
| New skill, new section, new example | minor (0.1.0 → 0.2.0) |
| Removed skill, renamed skill, changed frontmatter contract | major (0.1.0 → 1.0.0) |

Bump *both* `plugin.json` and the matching entry in `marketplace.json`. The marketplace version itself moves with any plugin change too — patch for plugin patches, minor when adding/removing whole plugins.

## When to add a new skill to crtr-dev

Add a skill when:

- A crtr feature has non-obvious mechanics the agent will need next session (e.g., resolution order, symlink behavior, `--json` schema versioning).
- A workflow spans multiple commands and an agent could reasonably get it wrong without a reference.
- Something in the SPEC is dense enough that the agent benefits from a focused, skill-shaped excerpt rather than re-reading 200 lines of SPEC every time.

Don't add a skill when:

- The information is one `crtr <cmd> --help` away.
- It's a one-off troubleshooting note (those go in commit messages or `crtr doctor`'s output).
- It duplicates `SPEC.md` without compression — link to the SPEC instead.

## Future scope

Eventually `crtr-dev` will include skills for:

- Authoring **plugins** (not just skills) — manifest layout, vendored vs URL `source`, choosing scope defaults.
- Authoring **marketplaces** — the curated index pattern, dual-publish with `.claude-plugin/`.
- Adding new **artifact types** (commands, rules, hooks, agents) once the SPEC moves past v0.
- The `crtr-dev:contributing` skill — how to make a PR against crouter itself.

Track these in the crouter repo's issue tracker, not here.

## See also

- [[authoring-skills]] — the format rules for any new SKILL.md you add.
- `SPEC.md` in the crouter repo — install/resolution/update semantics this skill assumes.
