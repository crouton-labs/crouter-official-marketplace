#!/usr/bin/env node
// Generate `.crouter-plugin/commands.json` from lib/commands.mjs — the command
// tree is the single source of truth, this file is its build product.
//
//   node scripts/generate-commands.mjs           # write the manifest
//   node scripts/generate-commands.mjs --check    # exit 1 if it is stale

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildCommandManifest } from '../lib/commands.mjs';

const pluginRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(pluginRoot, '.crouter-plugin', 'commands.json');
const rendered = `${JSON.stringify(buildCommandManifest(), null, 2)}\n`;

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(manifestPath, 'utf8');
  } catch {
    console.error(`missing ${manifestPath} — run: node scripts/generate-commands.mjs`);
    process.exit(1);
  }
  if (current !== rendered) {
    console.error(`${manifestPath} is stale — run: node scripts/generate-commands.mjs`);
    process.exit(1);
  }
  console.log('commands.json matches lib/commands.mjs');
} else {
  writeFileSync(manifestPath, rendered);
  console.log(`wrote ${manifestPath}`);
}
