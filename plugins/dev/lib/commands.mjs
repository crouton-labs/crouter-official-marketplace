// Single source of truth for the native `crtr dev` branch.
// Run scripts/generate-commands.mjs after editing; commands.json is generated.

const BASIC_STEPS = 7;
const ADVANCED_STEPS = 2;
const SCENARIO_IDS = "idle-nodes | pending-ask";

/** A tutorial track leaf. Both tracks are the same machine over different
 *  content, so they are built from one shape. */
function trackLeaf(name, total, summary, description, whenToUse, contents) {
  return {
    kind: "leaf",
    name,
    description,
    whenToUse: `${whenToUse} Invoke with no arguments to begin at lesson 1; each served lesson names the command for the next. Contents: ${contents}`,
    summary,
    params: [
      {
        kind: "flag",
        name: "step",
        type: "int",
        required: false,
        default: 1,
        constraint: `Which lesson to serve, 1–${total}. Omit to begin at 1; pass a later number to skip ahead to a lesson the user needs.`,
      },
    ],
    output: [
      { name: "track", type: "string", required: true, constraint: "Which tutorial track this lesson belongs to." },
      { name: "step", type: "number", required: true, constraint: "The lesson number served." },
      { name: "total", type: "number", required: true, constraint: "How many lessons the track holds." },
      { name: "title", type: "string", required: true, constraint: "The lesson title." },
      { name: "body", type: "string", required: true, constraint: "The lesson itself — instructions for you, the teaching agent." },
      { name: "next", type: "string", required: false, constraint: "Command that serves the next lesson; absent on the final one." },
      { name: "teaching_contract", type: "string", required: true, constraint: "How to deliver this lesson, restated on every step." },
      { name: "contents", type: "string", required: false, constraint: "Numbered table of contents; present only on step 1." },
    ],
    outputKind: "object",
    effects: [
      "None. Read-only — serves lesson text and changes nothing. Any machine change a lesson calls for is made by you, with the user's approval.",
    ],
  };
}

function tutorialBranch() {
  return {
    kind: "branch",
    name: "tutorial",
    description: "guided walkthrough that teaches a user to drive crouter",
    whenToUse:
      "a user is new to crouter and needs to learn to operate it, or an experienced user wants the runtime model behind orchestration and node lifecycles. Distinct from `crtr sys setup`, which installs providers and dependencies but teaches nothing — a user can finish setup and still be unable to open the menu.",
    summary: "the crouter tutorial — hands-on lessons an agent teaches, one per invocation",
    model:
      "Two tracks. `basic` makes a user able to drive crouter at all: the terminal and tmux setup every keybinding depends on, the Alt+C menu, resuming, memory, the graph, and the inbox. `advanced` explains the runtime model — orchestration and node lifecycles — and assumes the basics. You are the teacher and each track leaf is a prompt server: it hands you one lesson of instructions and holds no progress state, so `--step` skips freely. Lessons that change the machine tell YOU to make the edit with the user watching a diff; the command itself never writes anything. `scenario` builds disposable canvas state for the two lessons that need something real to point at.",
    children: [
      trackLeaf(
        "basic",
        BASIC_STEPS,
        "the first-run crouter tutorial — serves one lesson per invocation, in order",
        "teach a first-time user to drive crouter, one lesson per invocation",
        "a user is new to crouter and needs to be able to actually operate it — the terminal and tmux setup every keybinding depends on, the Alt+C menu, resuming a conversation, memory, the graph, and the inbox. Run this before any advanced material; it is the track that turns a fresh install into a usable one.",
        "1. Terminal Option key. 2. tmux. 3. The Alt+C menu. 4. Resuming a conversation. 5. Memory. 6. The graph. 7. The inbox.",
      ),
      trackLeaf(
        "advanced",
        ADVANCED_STEPS,
        "the advanced crouter tutorial — orchestration and node lifecycle, one lesson per invocation",
        "teach the runtime model — orchestration and node lifecycles",
        "a user already drives crouter comfortably and wants to understand what it is doing underneath: when to promote a node to an orchestrator, and why terminal and resident nodes end differently. Run the basic track first; this one assumes the user can already navigate and has done real work.",
        "1. Promotion to orchestrator. 2. Terminal and resident nodes.",
      ),
      {
        kind: "branch",
        name: "scenario",
        description: "build and tear down demo canvas state for a lesson",
        whenToUse:
          "a tutorial lesson needs something real on the canvas to point at. The graph and inbox lessons both call for one; other lessons do not need this at all.",
        summary: "demo canvas state for tutorial lessons — build one, teach against it, tear it down",
        model:
          "A scenario is disposable demo state built for one lesson and removed after it. Everything created is recorded in a ledger, and teardown removes exactly what that ledger names. Scenario nodes are created without a kickoff, so a row renders in the graph but no turn ever runs and building one costs no tokens. Start, teach, clean — a scenario left standing puts demo rows on the user's real canvas.",
        children: [
          {
            kind: "leaf",
            name: "list",
            description: "list demo scenarios and which are currently standing",
            whenToUse:
              "choosing a scenario for a lesson, or checking whether a previous run left anything on the canvas that still needs cleaning up.",
            summary: "list the tutorial demo scenarios and their current state",
            params: [],
            output: [
              { name: "scenarios", type: "object[]", required: true, constraint: "Each scenario: id, title, what it teaches, what it builds, and whether it is standing." },
              { name: "standing", type: "number", required: true, constraint: "How many scenarios currently have canvas state." },
            ],
            outputKind: "object",
            effects: ["None. Read-only."],
          },
          {
            kind: "leaf",
            name: "start",
            description: "build one demo scenario on the canvas",
            whenToUse:
              "a tutorial lesson needs real canvas state to point at — idle nodes for the graph lesson, a pending question for the inbox lesson. Always pair it with `scenario clean` once the lesson lands.",
            summary: "build one tutorial demo scenario — idle nodes or a pending inbox item, costing no tokens",
            params: [
              {
                kind: "positional",
                name: "scenario",
                type: "string",
                required: true,
                constraint: `Which scenario to build: ${SCENARIO_IDS}. See \`crtr dev tutorial scenario list\` for what each builds.`,
              },
            ],
            output: [
              { name: "scenario", type: "string", required: true, constraint: "The scenario that was built." },
              { name: "nodes", type: "string[]", required: false, constraint: "Node ids created, for scenarios that build nodes." },
              { name: "requests", type: "string[]", required: false, constraint: "Human request ids, for scenarios that publish an inbox item." },
              { name: "clean_with", type: "string", required: true, constraint: "The exact teardown command for what was just built." },
              { name: "look_at", type: "string", required: true, constraint: "Which surface to open to see what was built." },
            ],
            outputKind: "object",
            effects: [
              "idle-nodes: creates three independent nodes with no kickoff — brokers exist, no turn ever runs.",
              "pending-ask: publishes one durable pending request into the human inbox.",
              "Records what was created in a ledger under the user's crouter directory, so teardown removes exactly this and nothing else.",
            ],
          },
          {
            kind: "leaf",
            name: "clean",
            description: "tear down one demo scenario",
            whenToUse:
              "a tutorial lesson using a scenario is finished. Always run it — a scenario left standing clutters the user's real canvas with demo rows they did not create.",
            summary: "remove exactly the canvas state one tutorial scenario created",
            params: [
              {
                kind: "positional",
                name: "scenario",
                type: "string",
                required: true,
                constraint: `Which scenario to tear down: ${SCENARIO_IDS}. Cleaning one that is not standing succeeds and does nothing.`,
              },
            ],
            output: [
              { name: "scenario", type: "string", required: true, constraint: "The scenario torn down." },
              { name: "was_standing", type: "boolean", required: true, constraint: "False when there was nothing to remove." },
              { name: "closed_nodes", type: "number", required: false, constraint: "How many nodes were closed." },
              { name: "canceled_requests", type: "number", required: false, constraint: "How many pending inbox requests were withdrawn." },
            ],
            outputKind: "object",
            effects: [
              "Closes exactly the nodes this scenario recorded; nothing else is touched.",
              "Cancels the scenario's recorded pending human requests.",
              "Clears the scenario from the tutorial scenario ledger.",
            ],
          },
        ],
      },
    ],
  };
}

function prBranch() {
  return {
    kind: "branch",
    name: "pr",
    description: "pull-request work on the current repository",
    whenToUse: "a branch is ready to be looked at as a pull request — reviewed against its base with a companion agent that holds the diff.",
    summary: "pull-request surfaces for the current repository",
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
            prBranch(),
            tutorialBranch(),
          ],
        },
      },
    ],
  };
}
