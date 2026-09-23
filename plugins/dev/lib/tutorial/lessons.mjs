const DEV = [
  {
    title: '/dev:init — reconcile a repository for agent work',
    body: [
      'Show the user what `/dev:init` checks in this repository. It inspects the existing project memory, the Grove contract, the repository-owned development CLI, and the machine registration before it adds or repairs anything.',
      '',
      'Look at the repository together and identify which pieces are already present and which are missing or incomplete. A repository with memory but no Grove registration, or a Grove contract but no working lifecycle command, is partially set up; init reconciles those pieces rather than replacing everything with a template.',
      '',
      'If the user wants to run init, read `/dev:init` and follow its live instructions. Show proposed repository files and responsibilities before creating a contract or materially changing lifecycle behavior. Do not make setup changes merely to demonstrate this lesson.',
    ].join('\n'),
  },
  {
    title: 'Worktrees and Grove-backed checkouts',
    body: [
      'Show the user this node’s cwd and the source repository checkout. They may be different paths: a node works in the checkout it was given, not necessarily in the directory from which the user started the conversation.',
      '',
      'Explain the distinction between a source checkout, an isolated git worktree for a branch, and a Grove instance checkout with its own resolved development services and data state. Grove registers a source and plants separate instances so distinct work does not collide with the user’s current checkout or running services.',
      '',
      'Inspect the actual cwd and registered instance before making a change. A correct edit in the wrong checkout is still the wrong result. If the user wants fresh isolated work, read the `/dev` guidance and `grove plant -h` before choosing code and data provenance; do not plant an instance solely for this lesson.',
    ].join('\n'),
  },
  {
    title: 'crtr dev — repository lifecycle and Grove instances',
    body: [
      'Run `crtr dev -h` from this repository and show the commands its committed `.crouter/commands/dev.json` declares. The repository’s own development CLI supplies lifecycle operations; the generated fragment lets crtr expose their help, input, and output in its command tree.',
      '',
      'Contrast those repository-defined commands with `crtr dev grove`: that child forwards to Grove’s instance surface. Read the relevant leaf help before operating a service or instance. Show the user which checkout and instance the current cwd resolves to before running a lifecycle command; do not start or stop services just to demonstrate this lesson.',
    ].join('\n'),
  },
  {
    title: '/dev:pr-loop — reviewed pull request',
    body: [
      'Explain that `/dev:pr-loop` takes a branch to a reviewed, merged pull request: establish branch and checkout ownership, integrate the selected target linearly, run this repository’s verification, open or update the PR, and resolve checks and review comments.',
      '',
      'The agent does not merge the pull request on the user’s behalf. After a person merges it, the loop checks the target-branch run and updates the local target branch. If there is a real branch ready for review, read `/dev:pr-loop` and follow the repository’s PR policy; do not open a demonstration PR.',
    ].join('\n'),
  },
];

export function lessonsFor() {
  return DEV;
}

export function tableOfContents() {
  return DEV.map((lesson, index) => `${index + 1}. ${lesson.title}`).join('\n');
}
