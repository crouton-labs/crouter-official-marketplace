import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildDevCommandManifest } from "../lib/commands.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, ".crouter-plugin/commands.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(buildDevCommandManifest(), null, 2)}\n`);
