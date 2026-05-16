#!/usr/bin/env node
// Update a "version" field in a JSON file via targeted regex so that
// hand-formatted whitespace (e.g. single-line `keywords` arrays) is
// preserved. `jq`/JSON.stringify both reflow the file.
//
// Usage:
//   set-version.mjs <file> <new-version>                 # top-level "version"
//   set-version.mjs <file> <new-version> --plugin <name> # version inside the
//                                                       # plugin block named <name>

import fs from 'node:fs';

const args = process.argv.slice(2);
const [file, newVersion, ...rest] = args;
if (!file || !newVersion) {
  console.error('usage: set-version.mjs <file> <new-version> [--plugin <name>]');
  process.exit(2);
}
const pluginIdx = rest.indexOf('--plugin');
const pluginName = pluginIdx >= 0 ? rest[pluginIdx + 1] : null;

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let text = fs.readFileSync(file, 'utf8');

let re;
if (pluginName) {
  re = new RegExp(
    `("name":\\s*"${escape(pluginName)}"[^}]*?"version":\\s*")[^"]+(")`,
    's'
  );
} else {
  re = /^(\s{0,2}"version":\s*")[^"]+(")/m;
}

if (!re.test(text)) {
  console.error(`version field not found in ${file}${pluginName ? ` for plugin ${pluginName}` : ''}`);
  process.exit(1);
}
text = text.replace(re, `$1${newVersion}$2`);
fs.writeFileSync(file, text);
