#!/usr/bin/env node
// Generate `.crouter-plugin/commands.json` from lib/commands.mjs — the command
// tree is the single source of truth, this file is its build product.
//
//   node scripts/generate-commands.mjs           # write the manifest

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildCommandManifest } from '../lib/commands.mjs';

const pluginRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(pluginRoot, '.crouter-plugin', 'commands.json');
const rendered = `${JSON.stringify(buildCommandManifest(), null, 2)}\n`;

writeFileSync(manifestPath, rendered);
console.log(`wrote ${manifestPath}`);
