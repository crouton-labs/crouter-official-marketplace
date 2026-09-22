// Single source of truth for the native `crtr dev` branch and mounted commands.
// Run scripts/generate-commands.mjs after editing; commands.json is generated.

function devTrackLeaf() {
  return {
    kind: "leaf",
    name: "dev",
    description: "teach the development workflow, one lesson per invocation",
    whenToUse: "a user wants to learn repository setup, isolated checkouts, repository lifecycle commands, or taking a branch through pull-request review. The four lessons cover /dev:init, worktrees and Grove, crtr dev, and /dev:pr-loop.",
    summary: "the development workflow tutorial — one lesson per invocation",
    params: [
      {
        kind: "flag",
        name: "step",
        type: "int",
        required: false,
        default: 1,
        constraint: "Which lesson to serve, 1–4. Omit to begin at 1; pass a later number to skip ahead.",
      },
    ],
    output: [
      { name: "track", type: "string", required: true, constraint: "The tutorial track this lesson belongs to." },
      { name: "step", type: "number", required: true, constraint: "The lesson number served." },
      { name: "total", type: "number", required: true, constraint: "How many lessons the track holds." },
      { name: "title", type: "string", required: true, constraint: "The lesson title." },
      { name: "body", type: "string", required: true, constraint: "Instructions for the teaching agent." },
      { name: "next", type: "string", required: false, constraint: "Command that serves the next lesson; absent on the final one." },
      { name: "teaching_contract", type: "string", required: true, constraint: "How to deliver this lesson." },
      { name: "contents", type: "string", required: false, constraint: "Numbered table of contents; present only on step 1." },
    ],
    outputKind: "object",
    effects: ["None. Read-only — serves lesson text and changes nothing."],
  };
}

function prBranch() {
  return {
    kind: "branch",
    name: "pr",
    description: "pull-request review by a person, on the current repository",
    whenToUse: "a branch is ready for a person to look at as a pull request — reviewed against its base with a companion agent that holds the diff.",
    summary: "pull-request review surfaces for the current repository",
    model: "Pull-request surfaces work on a local branch against a base ref; nothing here needs the PR to exist on a forge yet. `review` opens the review window.",
    children: [
      {
        kind: "leaf",
        name: "review",
        description: "review a branch's diff against its base beside a companion agent that holds the diff",
        whenToUse:
          "the user wants to review a branch as a pull request before or instead of opening it on GitHub: read the diff file by file in a lazygit-style surface, leave comments on line ranges, and have an agent beside them that already has the whole diff in context and can answer why the code is the way it is. Must run from a shell inside tmux; it opens a new window there.",
        summary: "open a PR review window — diff surface on the left, companion agent on the right",
        params: [
          {
            kind: "positional",
            name: "branch",
            type: "string",
            required: false,
            constraint: "The branch under review. Defaults to the checked-out branch. `base...branch` is accepted in place of --base.",
          },
          {
            kind: "flag",
            name: "base",
            type: "string",
            required: false,
            constraint: "The ref the branch would merge into. Defaults to origin's HEAD branch, else `main`, else `master`. The diff is `base...branch`, exactly what a pull-request page shows.",
          },
        ],
        output: [
          { name: "node_id", type: "string", required: true, constraint: "The companion node created for this review; it stays open after the review surface quits." },
          { name: "window", type: "string", required: true, constraint: "The tmux window id holding the review: surface on the left, companion viewer on the right." },
          { name: "branch", type: "string", required: true, constraint: "The branch under review, as resolved." },
          { name: "base", type: "string", required: true, constraint: "The base ref, as resolved." },
          { name: "files", type: "number", required: true, constraint: "How many files the diff touches." },
          { name: "commits", type: "number", required: true, constraint: "How many commits the branch has past the base." },
          { name: "brief_chars", type: "number", required: true, constraint: "Size of the companion's first message (framing plus the diff, truncated past 160000 characters of diff)." },
          { name: "comments_store", type: "string", required: true, constraint: "Where the review's comments persist: a JSON file under the repository's git dir, keyed by base...branch." },
          { name: "guidance", type: "string", required: true, constraint: "What is on screen now and how comments reach the companion." },
        ],
        outputKind: "object",
        effects: [
          "Creates one resident root node (kind general) with cwd at the repository top, whose first message is the PR-reviewer framing, the commit list, the file list, any comments saved from an earlier session, and the diff (truncated past 160000 characters; omitted files are named).",
          "Opens one tmux window in the caller's session: the viewer window `crtr node new --root` opens for the companion, with the review surface split in on its left. Fails with no_tmux outside tmux.",
          "Comments the reviewer saves, revises, or deletes in the surface are delivered to the companion's inbox by `crtr node message send`, and persist under <git-dir>/crtr/pr-review/.",
          "The companion is not closed when the surface quits; close it from its viewer or with `crtr node lifecycle close`.",
        ],
      },
    ],
  };
}

export function buildDevCommandManifest() {
  return {
    schemaVersion: 1,
    mounts: [
      {
        parent: [],
        node: {
          kind: "branch",
          name: "dev",
          description: "repository development commands and the full Grove instance surface",
          whenToUse: "you need this repository's declared development lifecycle commands, or need Grove's full instance surface through `crtr dev grove …`.",
          extensible: true,
          rootEntry: {
            concept: "the current repository's own development CLI — lifecycle commands and Grove instances",
            description: "renders repository commands generated from its declared development tree",
            whenToUse: "you are working inside a repository and need its declared development services or operational surfaces. Repository commands appear after its generated `.crouter/commands/dev.json` is committed; use `crtr dev grove …` for Grove itself.",
          },
          summary: "repository development commands plus direct access to Grove's full instance surface",
          model: "This native branch contains the repository commands declared in its generated fragment, so crtr owns their help, parsing, validation, and output. The plugin-owned `grove` child remains a raw forwarding branch to Grove's full current surface: declarative apply and configuration drift, labels and selectors, the warm pool with claim and release, rollout and rollback, and pending-operation recovery. Read `grove <verb> -h` for grammar rather than trusting this discovery pointer. Bare-shell `dev` keeps its existing dispatcher behavior.",
          children: [
            {
              kind: "branch",
              name: "grove",
              description: "forward raw arguments to Grove's full current instance surface",
              whenToUse: "you need a Grove operation rather than a repository-defined development command, including declarative apply and drift, labels and selectors, the warm pool, rollout or rollback, or pending-operation recovery.",
              summary: "direct access to Grove's full current instance surface",
              model: "This is a raw passthrough: Grove owns its grammar, parsing, effects, and output. Read `grove <verb> -h` for the current grammar; this branch does not enumerate or validate Grove arguments.",
              passthrough: {
                bin: "bin/grove",
                installHint: "Install Grove, then run `grove setup` in the source repository.",
              },
              children: [],
            },
          ],
        },
      },
      {
        parent: ["human"],
        node: prBranch(),
      },
      {
        parent: ["sys", "tutorial"],
        node: devTrackLeaf(),
      },
    ],
  };
}
