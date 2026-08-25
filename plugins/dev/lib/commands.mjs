// Single source of truth for the native `crtr dev` branch.
// Run scripts/generate-commands.mjs after editing; commands.json is generated.

export function buildDevCommandManifest() {
  return {
    schemaVersion: 1,
    mounts: [
      {
        parent: [],
        node: {
          kind: "branch",
          name: "dev",
          description: "repository development commands and Grove instance operations",
          whenToUse: "you need this repository's declared development lifecycle commands, or need to operate Grove directly through `crtr dev grove …`.",
          extensible: true,
          rootEntry: {
            concept: "the current repository's own development CLI — lifecycle commands and Grove instances",
            description: "renders repository commands generated from its declared development tree",
            whenToUse: "you are working inside a repository and need its declared development services or operational surfaces. Repository commands appear after its generated `.crouter/commands/dev.json` is committed; use `crtr dev grove …` for Grove itself.",
          },
          summary: "repository development commands generated from its declared CLI tree",
          model: "This native branch contains the repository commands declared in its generated fragment, so crtr owns their help, parsing, validation, and output. The plugin-owned `grove` child remains a raw forwarding branch for direct Grove operations. Bare-shell `dev` keeps its existing dispatcher behavior.",
          children: [
            {
              kind: "branch",
              name: "grove",
              description: "forward raw arguments to the Grove executable",
              whenToUse: "you need a Grove command rather than a repository-defined development command.",
              summary: "direct Grove access from the native dev branch",
              passthrough: {
                bin: "grove",
                installHint: "Install Grove, then run `grove setup` in the source repository.",
              },
              children: [],
            },
          ],
        },
      },
    ],
  };
}
