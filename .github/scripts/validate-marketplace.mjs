#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const pluginsDir = path.join(root, 'plugins');
const marketplacePath = path.join(root, '.crouter-marketplace', 'marketplace.json');
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${path.relative(root, file)}: ${error.message}`);
    return null;
  }
}

function markdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

function validateBins(name, manifest) {
  if (!Object.hasOwn(manifest, 'bin')) return;
  if (manifest.bin === null || Array.isArray(manifest.bin) || typeof manifest.bin !== 'object') {
    fail(`${name}: bin must be an object`);
    return;
  }

  const pluginRoot = fs.realpathSync(path.join(pluginsDir, name));
  for (const [binName, target] of Object.entries(manifest.bin)) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(binName)) {
      fail(`${name}: bin name ${JSON.stringify(binName)} must be a bare binary name`);
    }
    if (typeof target !== 'string') {
      fail(`${name}: bin target for ${JSON.stringify(binName)} must be a string`);
      continue;
    }
    if (path.isAbsolute(target)) {
      fail(`${name}: bin target for ${JSON.stringify(binName)} must be plugin-root-relative`);
      continue;
    }

    let resolved;
    try {
      resolved = fs.realpathSync(path.resolve(pluginRoot, target));
    } catch {
      fail(`${name}: bin target for ${JSON.stringify(binName)} does not exist`);
      continue;
    }
    const relative = path.relative(pluginRoot, resolved);
    if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      fail(`${name}: bin target for ${JSON.stringify(binName)} must stay inside the plugin root`);
      continue;
    }

    const stat = fs.statSync(resolved);
    if (!stat.isFile()) {
      fail(`${name}: bin target for ${JSON.stringify(binName)} must be a regular file`);
    } else if ((stat.mode & 0o111) === 0) {
      fail(`${name}: bin target for ${JSON.stringify(binName)} must carry the exec bit`);
    }
  }
}

function validateRequires(name, manifest) {
  if (!Object.hasOwn(manifest, 'requires')) return;
  if (manifest.requires === null || Array.isArray(manifest.requires) || typeof manifest.requires !== 'object') {
    fail(`${name}: requires must be an object`);
    return;
  }

  for (const [executable, hint] of Object.entries(manifest.requires)) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(executable)) {
      fail(`${name}: requires name ${JSON.stringify(executable)} must be a bare executable name`);
    }
    if (typeof hint !== 'string' || hint.trim() === '' || /[\r\n]/.test(hint)) {
      fail(`${name}: requires hint for ${JSON.stringify(executable)} must be a non-empty one-line string`);
    }
  }
}

function hasField(frontmatter, name) {
  return new RegExp(`^${name}:`, 'm').test(frontmatter);
}

const marketplace = readJson(marketplacePath);
const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();
const manifests = new Map();

for (const name of pluginDirs) {
  const manifestPath = path.join(pluginsDir, name, '.crouter-plugin', 'plugin.json');
  if (!fs.existsSync(manifestPath)) {
    fail(`plugins/${name}: missing .crouter-plugin/plugin.json`);
    continue;
  }
  const manifest = readJson(manifestPath);
  if (manifest) {
    manifests.set(name, manifest);
    validateBins(name, manifest);
    validateRequires(name, manifest);
  }
}

if (!marketplace || !Array.isArray(marketplace.plugins)) {
  fail('.crouter-marketplace/marketplace.json: plugins must be an array');
} else {
  if (!/^\d+\.\d+\.\d+$/.test(marketplace.version ?? '')) {
    fail('.crouter-marketplace/marketplace.json: version must be major.minor.patch');
  }
  const catalogNames = new Set();
  for (const entry of marketplace.plugins) {
    if (!entry || typeof entry.name !== 'string') {
      fail('marketplace catalog entry is missing a string name');
      continue;
    }
    if (catalogNames.has(entry.name)) fail(`marketplace catalog duplicates ${entry.name}`);
    catalogNames.add(entry.name);

    const manifest = manifests.get(entry.name);
    if (!manifest) {
      fail(`marketplace catalog references missing plugin ${entry.name}`);
      continue;
    }
    const expectedSource = `./plugins/${entry.name}`;
    if (entry.source !== expectedSource) {
      fail(`${entry.name}: catalog source must be ${expectedSource}`);
    }
    const resolvedSource = path.resolve(root, entry.source ?? '');
    if (resolvedSource !== path.join(pluginsDir, entry.name)) {
      fail(`${entry.name}: catalog source does not resolve to its plugin directory`);
    }
    for (const field of ['name', 'version', 'description']) {
      if (entry[field] !== manifest[field]) {
        fail(`${entry.name}: catalog ${field} does not match plugin manifest`);
      }
    }
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? '')) {
      fail(`${entry.name}: manifest version must be major.minor.patch`);
    }
    try {
      new URL(manifest.source);
    } catch {
      fail(`${entry.name}: manifest source must be a URL`);
    }
  }
  for (const name of manifests.keys()) {
    if (!catalogNames.has(name)) fail(`plugin ${name} is missing from the marketplace catalog`);
  }
}

const canonicalNames = new Set();
const memoryDocuments = [];
for (const name of pluginDirs) {
  const memoryDir = path.join(pluginsDir, name, 'memory');
  const files = markdownFiles(memoryDir);
  for (const file of files) {
    const relative = path.relative(memoryDir, file).replace(/\.md$/, '');
    if (relative !== 'INDEX') canonicalNames.add(`${name}/${relative}`);
    memoryDocuments.push(file);

    const text = fs.readFileSync(file, 'utf8');
    const match = text.match(/^---\n([\s\S]*?)\n---\n/);
    const displayPath = path.relative(root, file);
    if (!match) {
      fail(`${displayPath}: missing YAML frontmatter`);
      continue;
    }
    for (const field of ['kind', 'when-and-why-to-read', 'short-form', 'system-prompt-visibility', 'file-read-visibility']) {
      if (!hasField(match[1], field)) fail(`${displayPath}: missing frontmatter ${field}`);
    }
  }
}

for (const file of memoryDocuments) {
  const displayPath = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  for (const [, target] of text.matchAll(/\[\[([^\]]+)\]\]/g)) {
    if (!/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/.test(target)) {
      fail(`${displayPath}: invalid canonical link [[${target}]]`);
      continue;
    }
    const plugin = target.split('/', 1)[0];
    if (pluginDirs.includes(plugin) && !canonicalNames.has(target)) {
      fail(`${displayPath}: unresolved canonical link [[${target}]]`);
    }
  }
}

const captureManifest = manifests.get('capture');
if (captureManifest) {
  if (captureManifest.transport?.kind !== 'exec') fail('capture: transport.kind must be exec');
  if (captureManifest.commands !== '.crouter-plugin/commands.json') {
    fail('capture: commands must reference .crouter-plugin/commands.json');
  }
  const commandsPath = path.join(pluginsDir, 'capture', '.crouter-plugin', 'commands.json');
  const commands = readJson(commandsPath);
  const mount = commands?.mounts?.[0];
  if (commands?.schemaVersion !== 1 || !Array.isArray(commands.mounts) || commands.mounts.length !== 1) {
    fail('capture: commands manifest must have schemaVersion 1 and one mount');
  }
  if (JSON.stringify(mount?.parent) !== '[]' || mount?.node?.kind !== 'branch' || mount?.node?.name !== 'capture' || mount?.node?.passthrough?.bin !== 'capture') {
    fail('capture: commands manifest must mount the capture passthrough at the root');
  }
}

const searchManifest = manifests.get('search');
if (searchManifest) {
  const searchRoot = path.join(pluginsDir, 'search');
  if (searchManifest.transport?.kind !== 'exec') fail('search: transport.kind must be exec');
  if (searchManifest.transport?.executable !== 'bin/crtr-search.mjs') {
    fail('search: transport.executable must be bin/crtr-search.mjs');
  }
  if (searchManifest.commands !== '.crouter-plugin/commands.json') {
    fail('search: commands must reference .crouter-plugin/commands.json');
  }
  const executable = path.join(searchRoot, 'bin', 'crtr-search.mjs');
  if (!fs.existsSync(executable)) {
    fail('search: bin/crtr-search.mjs is missing');
  } else if ((fs.statSync(executable).mode & 0o111) === 0) {
    fail('search: bin/crtr-search.mjs must carry the exec bit');
  }
  // The command tree in lib/commands.mjs is the single source of truth; the
  // checked-in commands.json is its build product and must not drift.
  const { buildCommandManifest } = await import(pathToFileURL(path.join(searchRoot, 'lib', 'commands.mjs')));
  const expected = `${JSON.stringify(buildCommandManifest(), null, 2)}\n`;
  const commandsPath = path.join(searchRoot, '.crouter-plugin', 'commands.json');
  const actual = fs.existsSync(commandsPath) ? fs.readFileSync(commandsPath, 'utf8') : null;
  if (actual === null) {
    fail('search: .crouter-plugin/commands.json is missing');
  } else if (actual !== expected) {
    fail('search: commands.json is stale — run node plugins/search/scripts/generate-commands.mjs');
  }
}

if (errors.length) {
  console.error(`Marketplace source validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Marketplace source validation passed: ${manifests.size} plugins and ${memoryDocuments.length} memory documents.`);
