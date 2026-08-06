// Single source of truth for the `crtr search` command surface.
//
// Each leaf carries BOTH its declaration (the help/param/output descriptors crtr
// renders and validates against) and the `run` that answers an invocation. The
// checked-in `.crouter-plugin/commands.json` is generated from this tree by
// scripts/generate-commands.mjs — never hand-edited — so the manifest and the
// executable can never describe different commands.

import {
  exaSearch,
  exaAnswer,
  exaContents,
  parseUrls,
  parseDomains,
  projectResult,
  projectCitation,
  PluginError,
  TEXT_MAX_CHARACTERS,
} from './exa.mjs';

const SEARCH_TYPES = ['auto', 'fast', 'instant', 'deep-lite', 'deep', 'deep-reasoning'];

const webLeaf = {
  kind: 'leaf',
  name: 'web',
  description: 'find web pages relevant to a query, with highlight excerpts',
  whenToUse:
    'you need to discover web pages relevant to a query and read query-matched excerpts from them — the default web search. Use this for open-ended research, finding sources, or gathering current information. Reach for `answer` instead when you want one synthesized, cited answer to a specific question rather than a ranked list of pages; reach for `contents` when you already hold the URLs and only need their content.',
  summary: 'web search via Exa — ranked results with query-relevant highlight excerpts (or full text)',
  params: [
    {
      kind: 'positional',
      name: 'query',
      type: 'string',
      required: true,
      constraint: 'The search query. Natural language; be specific.',
    },
    {
      kind: 'flag',
      name: 'type',
      type: 'enum',
      choices: SEARCH_TYPES,
      required: false,
      default: 'auto',
      constraint:
        'Search depth. auto balances relevance and speed; fast/instant trade depth for latency; deep-lite/deep/deep-reasoning run multi-query expansion and rank the combined set for harder synthesis.',
    },
    {
      kind: 'flag',
      name: 'num',
      type: 'int',
      required: false,
      default: 10,
      constraint: 'Number of results to return.',
    },
    {
      kind: 'flag',
      name: 'text',
      type: 'bool',
      required: false,
      constraint: `Return cleaned full page text (capped at ${TEXT_MAX_CHARACTERS} characters per result) instead of highlight excerpts. Off by default; highlights keep token usage predictable.`,
    },
    {
      kind: 'flag',
      name: 'include-domains',
      type: 'string',
      required: false,
      constraint: 'Comma-separated domain allowlist — restrict results to these domains.',
    },
    {
      kind: 'flag',
      name: 'exclude-domains',
      type: 'string',
      required: false,
      constraint: 'Comma-separated domain blocklist — drop results from these domains.',
    },
  ],
  output: [
    { name: 'query', type: 'string', required: true, constraint: 'Echo of the query searched.' },
    {
      name: 'results',
      type: 'object[]',
      required: true,
      constraint:
        'Ranked best-first, each: title, url, published date and author when present, and either highlight excerpts (default) or capped full text (--text).',
    },
    {
      name: 'follow_up',
      type: 'string',
      required: true,
      constraint:
        'Decision road sign: either read selected result URLs through `crtr search contents` after checking its schema, or refine the query.',
    },
  ],
  outputKind: 'object',
  effects: ['Sends one search request to the Exa API (network). No local state changes.'],
  run: async (input) => {
    const query = input['query'];
    const type = typeof input['type'] === 'string' ? input['type'] : 'auto';
    const num = typeof input['num'] === 'number' ? input['num'] : 10;
    const wantText = input['text'] === true;

    const contents = wantText ? { text: { maxCharacters: TEXT_MAX_CHARACTERS } } : { highlights: true };
    const body = { query, type, numResults: num, contents };

    const include = parseDomains(input['includeDomains']);
    const exclude = parseDomains(input['excludeDomains']);
    if (include !== undefined) body['includeDomains'] = include;
    if (exclude !== undefined) body['excludeDomains'] = exclude;

    const res = await exaSearch(body);
    return {
      query,
      results: (res.results ?? []).map(projectResult),
      follow_up:
        'Fetch full content for selected result URLs with `crtr search contents` after checking its schema. No good hits? Broaden the query, drop domain filters, or try --type deep.',
    };
  },
};

const answerLeaf = {
  kind: 'leaf',
  name: 'answer',
  description: 'get one grounded, cited answer to a question',
  whenToUse:
    'you have a specific question and want a single synthesized answer grounded in sources, rather than a ranked list of pages to read yourself. Best for factual lookups and "what/who/when" questions where you want the conclusion plus its citations. Reach for `web` instead when you want to browse and judge the raw results, or when the task is open-ended research rather than one answerable question.',
  summary: 'grounded answer via Exa — one synthesized natural-language answer plus the sources it cites',
  params: [
    {
      kind: 'positional',
      name: 'question',
      type: 'string',
      required: true,
      constraint: 'The question to answer. Natural language; phrase it as a question.',
    },
  ],
  output: [
    {
      name: 'answer',
      type: 'string',
      required: true,
      constraint:
        'The synthesized natural-language answer grounded in the cited sources; empty when Exa returns no answer.',
    },
    {
      name: 'citations',
      type: 'object[]',
      required: true,
      constraint: 'The sources the answer draws on, each: title and url when Exa supplies them.',
    },
    {
      name: 'follow_up',
      type: 'string',
      required: true,
      constraint: 'Concrete next command — read a citation in full, or fall back to raw results.',
    },
  ],
  outputKind: 'object',
  effects: ['Sends one answer request to the Exa API (network). No local state changes.'],
  run: async (input) => {
    const res = await exaAnswer({ query: input['question'] });
    return {
      answer: typeof res.answer === 'string' ? res.answer : '',
      citations: (res.citations ?? []).map(projectCitation),
      follow_up:
        'Read any cited source in full with `crtr search contents` after checking its schema. Want raw ranked results instead of a synthesized answer? Use `crtr search web`.',
    };
  },
};

const contentsLeaf = {
  kind: 'leaf',
  name: 'contents',
  description: 'extract clean content from URLs you already have',
  whenToUse:
    'you already hold one or more URLs — from a prior `search web`/`answer`, a database, an RSS feed, or user input — and need their cleaned content or highlights. This does NOT search; it only extracts from the URLs you give it. Reach for `web` when you still need to find the pages, and `answer` when you want a synthesized response rather than raw page content.',
  summary: 'content extraction via Exa — cleaned highlights or full text for URLs you already have',
  params: [
    {
      kind: 'positional',
      name: 'urls',
      type: 'string',
      repeatable: true,
      required: true,
      constraint:
        'One or more URL tokens to extract. Each token may contain URLs separated by commas or whitespace.',
    },
    {
      kind: 'flag',
      name: 'text',
      type: 'bool',
      required: false,
      constraint: `Return cleaned full page text (capped at ${TEXT_MAX_CHARACTERS} characters per URL) instead of highlight excerpts. Off by default.`,
    },
    {
      kind: 'flag',
      name: 'max-age-hours',
      type: 'int',
      required: false,
      constraint:
        'Maximum acceptable age of cached content, in hours; content older than this is freshly crawled. 0 forces a fresh crawl every time. Omit to use cache when available and crawl as fallback.',
    },
  ],
  output: [
    {
      name: 'results',
      type: 'object[]',
      required: true,
      constraint:
        'One per successfully extracted URL, each: title, url, published date and author when present, and either highlight excerpts (default) or capped full text (--text).',
    },
    {
      name: 'failures',
      type: 'object[]',
      required: true,
      constraint: 'URLs Exa could not fetch, each: url and reason. Empty when every URL extracted.',
    },
    {
      name: 'follow_up',
      type: 'string',
      required: true,
      constraint: 'Concrete next command for retrying failures or refreshing stale content.',
    },
  ],
  outputKind: 'object',
  effects: ['Sends one contents request to the Exa API (network). No local state changes.'],
  run: async (input) => {
    const raw = Array.isArray(input['urls']) ? input['urls'] : [input['urls']];
    const urls = raw.flatMap(parseUrls);
    if (urls.length === 0) {
      throw new PluginError('invalid_input', 'no URLs provided', {
        field: 'urls',
        next: 'Pass one or more URLs separated by commas or whitespace.',
      });
    }

    const body = { urls };
    if (input['text'] === true) body['text'] = { maxCharacters: TEXT_MAX_CHARACTERS };
    else body['highlights'] = true;
    if (typeof input['maxAgeHours'] === 'number') body['maxAgeHours'] = input['maxAgeHours'];

    const res = await exaContents(body);
    const results = (res.results ?? []).map(projectResult);
    const fetched = new Set(results.map((r) => r.url).filter((u) => typeof u === 'string'));

    // A non-success status whose URL is absent from `results` is a genuine
    // failure — Exa returned nothing usable for it, and this plugin has no
    // second fetcher to fall back to.
    const failures = [];
    for (const status of res.statuses ?? []) {
      if (status?.status === 'success') continue;
      const url = typeof status?.id === 'string' ? status.id : '(unknown url)';
      if (fetched.has(url)) continue;
      const reason =
        typeof status?.error === 'string'
          ? status.error
          : status?.error?.tag ?? status?.status ?? 'unknown error';
      failures.push({ url, reason });
    }

    return {
      results,
      failures,
      follow_up:
        'Stale or empty content? Re-run with --max-age-hours 0 to force a fresh crawl. Need to find more pages? Use `crtr search web` after checking its schema.',
    };
  },
};

/** The whole contributed forest: one top-level `search` branch with three
 *  leaves. Mounted at parent [] by the generated command manifest. */
export const searchBranch = {
  kind: 'branch',
  name: 'search',
  description: 'search the web, answer a question with citations, or extract content from known URLs',
  whenToUse:
    'you need information from the live web — current events, documentation, sources, facts beyond your training.',
  rootEntry: {
    concept: 'web search for agents — find pages, get grounded answers, extract page content (Exa)',
    description: 'search the web, answer a question with citations, or extract content from known URLs',
    whenToUse:
      'you need information from the live web — current events, documentation, sources, facts beyond your training. Use web for relevant pages with excerpts, answer for one synthesized cited answer, and contents for clean text from URLs you already hold. This reaches public pages read-only, not logged-in pages or service APIs. Needs an Exa API key (EXA_API_KEY or ~/.crouter/exa.key).',
  },
  summary: 'web search via the Exa API — find pages, answer questions with citations, extract page content',
  model:
    'Three leaves split by what you have and what you want. `web` is the default: a query in, ranked pages out with query-relevant highlight excerpts (or full text with --text) — use it for discovery and research. `answer` collapses a question into one synthesized, source-cited answer — use it when you want the conclusion, not a reading list. `contents` does no searching; it extracts cleaned content from URLs you already hold. Highlights are the default content mode everywhere (token-predictable); full text is opt-in and length-capped. Every leaf needs an Exa API key resolved on this machine from EXA_API_KEY or ~/.crouter/exa.key; a keyless call fails before any request is sent.',
  children: [webLeaf, answerLeaf, contentsLeaf],
};

/** Resolve a command path (e.g. ['search', 'web']) to its leaf, or null. */
export function findLeaf(commandPath) {
  if (!Array.isArray(commandPath) || commandPath[0] !== searchBranch.name) return null;
  let node = searchBranch;
  for (const token of commandPath.slice(1)) {
    if (node.kind !== 'branch') return null;
    const child = node.children.find((c) => c.name === token);
    if (child === undefined) return null;
    node = child;
  }
  return node.kind === 'leaf' ? node : null;
}

/** The command manifest crtr reads, derived from the tree above: the same
 *  nodes with every `run` stripped. */
export function buildCommandManifest() {
  return {
    schemaVersion: 1,
    mounts: [{ parent: [], node: stripRuns(searchBranch) }],
  };
}

function stripRuns(node) {
  if (node.kind === 'branch') {
    return { ...node, children: node.children.map(stripRuns) };
  }
  const { run, ...declaration } = node;
  return declaration;
}
