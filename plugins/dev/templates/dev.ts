#!/usr/bin/env node
// Copy this file and dev-cli.ts into the repository that owns the development lifecycle.
// Run with Node >=26: node .grove/dev.ts service -h
// Generate its native crtr surface: mkdir -p .crouter/commands && node .grove/dev.ts --emit-crtr-fragment > .crouter/commands/dev.json
// Replace the seed command tree below with the repository's real lifecycle contract.

import { defineCli, generateCrtrFragment, withExitCode } from "./dev-cli.ts";

const definition = {
  name: "dev",
  description: "repository development lifecycle.",
  commands: [
    {
      name: "service",
      description: "the local processes that support this repository.",
      whenToUse: "you need to inspect, start, or read the logs of a repository service.",
      model: "Lifecycle verbs change process state; inspection verbs only report the state the repository currently exposes.",
      children: [
        {
          name: "status",
          description: "report the development services currently declared by this repository.",
          whenToUse: "You need to establish whether this seed has been configured before acting on a local service.",
          output: [
            { name: "state", type: "string", description: "Configuration state for the repository lifecycle." },
            { name: "next", type: "string", description: "The one implementation location to update." },
          ],
          effects: ["None. Read-only."],
          result: {
            block: "service-status",
            render: (value) => {
              const status = value as { state: string; next: string };
              return { attributes: { state: status.state }, body: `next: ${status.next}` };
            },
          },
          run: async () => ({ state: "unconfigured", next: "Replace the command tree in `.grove/dev.ts` with this repository's real services and lifecycle handlers." }),
        },
        {
          name: "start",
          description: "start the repository's configured development services.",
          whenToUse: "The repository has declared a real service handler and its local processes need to be running.",
          output: [
            { name: "state", type: "string", description: "Whether this seed started a configured service." },
            { name: "next", type: "string", description: "The implementation location required before a start can occur." },
          ],
          effects: ["None. Read-only: this seed refuses to start services until a repository lifecycle handler replaces it."],
          result: {
            block: "service-start",
            render: (value) => {
              const start = value as { state: string; next: string };
              return { attributes: { state: start.state }, body: `next: ${start.next}` };
            },
          },
          run: async () => withExitCode({ state: "unconfigured", next: "Replace this seed handler with the repository's real start implementation, then retry." }, 1),
        },
        {
          name: "logs",
          description: "read records from a configured development service log.",
          whenToUse: "A configured service has a log source and you need recent records or a continuing event stream.",
          params: [
            {
              kind: "flag",
              name: "tail",
              type: "integer",
              description: "Maximum number of recent records to return. Omit to use the repository default.",
              default: 40,
            },
          ],
          output: [
            { name: "state", type: "string", description: "Whether a repository log source is configured." },
            { name: "records", type: "string[]", description: "Log records in the repository-defined stable order." },
          ],
          effects: ["None. Read-only."],
          result: {
            block: "service-logs",
            render: (value, input) => {
              const logs = value as { state: string; records: string[] };
              return { attributes: { state: logs.state, tail: input.tail as number }, body: `records: ${logs.records.length === 0 ? "none — no log source is configured" : logs.records.join("; ")}` };
            },
          },
          run: async () => ({ state: "unconfigured", records: [] }),
        },
      ],
    },
  ],
};

const cli = defineCli(definition);

if (process.argv.length === 3 && process.argv[2] === "--emit-crtr-fragment") {
  process.stdout.write(`${JSON.stringify(generateCrtrFragment(definition, ".grove/dev.ts"), null, 2)}\n`);
} else {
  cli.run();
}
