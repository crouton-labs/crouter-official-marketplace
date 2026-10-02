# crouter-official-marketplace — the official plugin marketplace for crouter

![crouter-official-marketplace](https://raw.githubusercontent.com/crouton-labs/crouter-official-marketplace/main/assets/banner.svg)

The official plugin marketplace for [crouter](https://github.com/crouton-labs/crouter), maintained by Crouton Labs. It is a git repository of 15 plugins that `crtr`, crouter's command line, can install. Some plugins add commands (`crtr exa-search`, `crtr capture`); the rest add markdown documents that agents are shown when they become relevant.

The same list, with install notes, is on the docs site: [docs.crouter.ai/docs/cli/official-marketplace](https://docs.crouter.ai/docs/cli/official-marketplace).

## Install

You need crouter installed (`npm install -g crouter`). `crtr sys setup` offers to register this marketplace and install `capture` and `exa-search` from it. To do it by hand, add the marketplace, then install a plugin by its ref, `crouter-official-marketplace/<plugin>`:

```bash
crtr pkg market add https://github.com/crouton-labs/crouter-official-marketplace.git
crtr pkg market browse crouter-official-marketplace
crtr pkg plugin install crouter-official-marketplace/tsym
```

`--scope user` or `--scope project` on either `add` or `install` chooses where it is installed; the default is `project` when a project is available, otherwise `user`. A plugin's commands are available on your next `crtr` invocation. If a plugin needs an executable that is not on your `PATH`, the install still succeeds and prints a warning with the install hint.

To update, remove or inspect:

```bash
crtr pkg market update                 # refresh the marketplace and plugins installed from it
crtr pkg plugin update --name tsym
crtr pkg plugin show tsym
crtr pkg plugin remove tsym
```

## Plugins

### Plugins that add commands

| Plugin | What it does | Requires |
|---|---|---|
| `capture` | `crtr capture` forwards to the Capture CLI: CDP screenshots, rendered-geometry measurement, HAR, accessibility trees, JS execution, site libraries. | Capture CLI: `npm install -g @crouton-kit/capture` |
| `tsym` | `crtr tsym` forwards to the tsym CLI: read a TypeScript codebase by symbol from the compiler's own resolution. | tsym CLI: `npm install -g @crouton-kit/tsym` |
| `exa-search` | `crtr exa-search`: web search, answers with citations, and content extraction from URLs, through the Exa API. | An Exa API key in `EXA_API_KEY` or `~/.crouter/exa.key` |
| `bird` | `crtr bird` forwards to the bird CLI: read, search, post and reply on X/Twitter with your browser's X cookies. `tweet` and `reply` post publicly as you. | bird CLI, built from [CaptainCrouton89/bird](https://github.com/CaptainCrouton89/bird) (needs `bun`) |
| `github-asset` | `crtr github-asset attach <file> --pr <number>` uploads a local file through GitHub's attachment flow and prints its permanent URL. | Capture CLI, `gh` signed in, and a running CDP-enabled browser signed in to GitHub |
| `dev` | Development workflow documents, `crtr human pr review`, a `dev` track in `crtr sys tutorial`, `crtr dev`, and a `dev` command that forwards to Grove, plus lifecycle hooks that manage Grove instances for nodes. | Grove, for the Grove commands and hooks |

### Plugins that add documents

| Plugin | What it contains |
|---|---|
| `ai` | Playbooks for building on LLMs: prompts and agent context, agent-facing CLIs and tools, human-facing agent UI/UX, multi-agent orchestration, structured output, evals, testing. |
| `claude-authoring` | Guides to writing `CLAUDE.md` files, hooks, rules, skills, commands and scripts for Claude Code. |
| `knowledge-capture` | Four working modes for saving what you learn: `collaborate`, `interview`, `epiphany`, `learn`. |
| `design-discovery` | A Socratic product-design interview, run through `crtr human`, for deciding how a product or feature should feel before building it. |
| `web` | Frontend knowledge: visual direction, interface design, UX heuristics, design workflow, HTML mockups, a UX-consultant role, debugging. |
| `cloudflare` | Cloudflare from a shell: Wrangler, the REST API with `curl`, the OpenAPI spec and `llms.txt`. |
| `vercel` | Vercel from a shell: the Vercel CLI, the REST API with a bearer token, `llms.txt`. |
| `railway` | Railway from a shell: the Railway CLI, the GraphQL API with a token, `llms.txt`. |
| `fly` | Fly.io from a shell: `flyctl`, the Machines API with a bearer token, docs discovery. Named `fly` because plugin names cannot contain a dot. |

The four hosting plugins document how to install and sign in to each provider's own CLI. Installing the plugin does not install that CLI or store a credential.

## Layout

```
.crouter-marketplace/marketplace.json   the catalog: name, version, description, keywords per plugin
plugins/<name>/
  .crouter-plugin/plugin.json           manifest: name, version, description, transport, requires
  .crouter-plugin/commands.json         commands the plugin adds (command plugins)
  .crouter-plugin/hooks.json            lifecycle hooks (dev only)
  memory/                               markdown documents agents are shown
  bin/, lib/, scripts/                  executables behind an exec command plugin
```

`marketplace.json` lists each plugin with `source: ./plugins/<name>`. A command plugin declares `transport.kind: exec` in `plugin.json`, and `commands.json` describes the command tree `crtr` mounts. A `requires` entry names an executable that must be on `PATH`, with a one-line install hint. For `exa-search` and `github-asset`, `commands.json` is generated by `scripts/generate-commands.mjs`.

To write a plugin, see the [plugin authoring guide](https://docs.crouter.ai/docs/plugin). For hosting a plugin as an HTTP service instead of a directory in this repository, see [`@crouter/plugin`](https://www.npmjs.com/package/@crouter/plugin).

## Propose a plugin

Open a pull request that adds `plugins/<name>/` and a matching entry in `.crouter-marketplace/marketplace.json`. Run the validator before you push:

```bash
node .github/scripts/validate-marketplace.mjs
```

It checks that every plugin directory has a manifest, that the catalog and manifests agree, that `bin` and `requires` entries are well formed, and that documents have the frontmatter and resolvable `[[links]]` crouter expects. For anything larger than a document bundle, open an issue first so the direction can be agreed.

Versions are set by CI. When a change to `plugins/` lands on `main`, the auto-bump workflow raises that plugin's version and the marketplace version from the commit messages (`feat:` is a minor bump, `!:` a major one, anything else a patch) and tags the release. Leave the version fields alone in a pull request, except that a new plugin starts at its first version.

## Contact

Crouton Labs maintains this repository. Open an issue here for a plugin bug or a plugin request. The contact address for the maintainer is in `.crouter-marketplace/marketplace.json`.
