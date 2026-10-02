# Contributing to crouter-official-marketplace

Issues and pull requests are welcome at [github.com/crouton-labs/crouter-official-marketplace](https://github.com/crouton-labs/crouter-official-marketplace).

## Before you start

- **Bugs:** open an issue with the plugin name and version (`crtr pkg plugin show <plugin>`), the `crtr` version (`npm ls -g crouter`), your OS, and the command that failed with its output.
- **Features and larger changes:** open an issue first, so the direction is agreed before you write the code. A new plugin that is only a bundle of documents can go straight to a pull request.
- **Questions:** ask in [Discord](https://discord.gg/afwW4saEtr) or open an issue. Plugin authoring is covered in the [plugin guide](https://docs.crouter.ai/docs/plugin).
- **Security problems:** do not open a public issue. See [SECURITY.md](SECURITY.md).

## Set up

You need Git and Node.js to run the validator. The repository pins no Node version, and CI uses whatever Node GitHub's `ubuntu-latest` runner provides. To try a plugin, you also need [crouter](https://github.com/crouton-labs/crouter) (`npm install -g crouter`). There is nothing to install or build.

```bash
git clone git@github.com:crouton-labs/crouter-official-marketplace.git
cd crouter-official-marketplace
```

## Add or change a plugin

Each plugin is a directory under [`plugins/`](plugins), and the catalog `crtr` reads is [`.crouter-marketplace/marketplace.json`](.crouter-marketplace/marketplace.json).

To add a plugin:

1. Create `plugins/<name>/.crouter-plugin/plugin.json` with `name`, `version`, `description`, `source` (the URL of this repository) and `owner`. Copy one from an existing plugin such as [`plugins/ai`](plugins/ai). The name is lowercase kebab-case.
2. Add what the plugin provides:
   - Documents that agents are shown go in `plugins/<name>/memory/` as markdown. Each needs `kind`, `when-and-why-to-read` and `short-form` in its frontmatter. See [`plugins/tsym/memory`](plugins/tsym/memory) for a small example.
   - Commands go behind `transport.kind: exec` in `plugin.json`, with the command tree in `.crouter-plugin/commands.json` and the executable under `bin/`. [`plugins/tsym`](plugins/tsym) forwards `crtr tsym` to an external binary, and [`plugins/exa-search`](plugins/exa-search) ships its own executable. For `exa-search`, `github-asset` and `dev`, `commands.json` is generated: edit `lib/commands.mjs` and run `node plugins/<name>/scripts/generate-commands.mjs`.
   - If the plugin needs an executable on `PATH`, declare it under `requires` with a one-line install hint.
3. Add an entry to `.crouter-marketplace/marketplace.json` with `name`, `source: "./plugins/<name>"`, `version`, `description` and `keywords`. `name`, `version` and `description` must match `plugin.json`.
4. Add a row for the plugin to the tables in [`README.md`](README.md) and update the plugin count in its intro.
5. Run the validator (below).

To change a plugin, edit its files, keep `marketplace.json` in step if you change its `description`, and run the validator.

Leave version numbers alone. When a change under `plugins/` reaches `main`, the [auto-bump workflow](.github/workflows/auto-bump.yml) raises that plugin's version and the marketplace version from the commit messages (`feat:` is a minor bump, `!:` a major one, anything else a patch), commits `chore: release vX.Y.Z` and tags it. A new plugin starts at the version you give it.

To install your branch locally, point `crtr` at the checkout:

```bash
crtr pkg plugin install ./plugins/<name>
```

## Run the checks

There is no test suite. The one check is the validator, which CI also runs before it bumps versions:

```bash
node .github/scripts/validate-marketplace.mjs
```

It checks that every plugin directory has a manifest, that `marketplace.json` and the manifests agree, that `bin` and `requires` entries are well formed, that generated `commands.json` files are current, and that memory documents have the required frontmatter and resolvable `[[links]]`. It prints the plugin and document counts when it passes.

## Pull requests

- Branch from the current `main`, and keep one change per pull request.
- Describe what changed and why in the pull request body, and say how you tested it.
- Keep the history linear: rebase onto `main` rather than merging it into your branch.
- Commit messages follow the style of the existing log: a short imperative subject with a prefix such as `feat(bird):`, `fix(dev):` or `docs:`.

## Repository layout

| Path | Contents |
|---|---|
| [`plugins/`](plugins) | One directory per plugin: `.crouter-plugin/` manifests, `memory/` documents, and `bin/`, `lib/`, `scripts/` for command plugins |
| [`.crouter-marketplace/`](.crouter-marketplace) | `marketplace.json`, the catalog of plugins |
| [`.github/`](.github) | The auto-bump workflow, the validator and the version script |
| [`assets/`](assets) | README images |

## License

crouter-official-marketplace is licensed under GPL-3.0. By contributing, you agree that your contribution is licensed under the same terms.
