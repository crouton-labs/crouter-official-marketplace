#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCommandManifest } from '../lib/commands.mjs';

const pluginRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(pluginRoot, '.crouter-plugin', 'commands.json');
writeFileSync(manifestPath, `${JSON.stringify(buildCommandManifest(), null, 2)}\n`);
console.log(`wrote ${manifestPath}`);
