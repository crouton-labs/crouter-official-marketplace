---
kind: knowledge
when-and-why-to-read: When you start or extend a Chrome extension and need to decide which execution context (service worker, content script, popup, side panel, offscreen) owns a feature, this knowledge should be read because putting logic in the wrong context, forgetting the service worker is ephemeral, or relaying network calls the wrong way are the root of most MV3 bugs.
short-form: "Chrome extension (MV3) architecture: five execution contexts, how they message, the key rules, a decision tree for which context handles what, the build workflows, a minimal manifest, core code patterns and what not to do."
rationale: >-
  Adapted from samber/cc-skills (github.com/samber/cc-skills, MIT), skill chrome-extension (SKILL.md). This document owns extension architecture and routing; each linked document under web/chrome-extension owns one context or API area, and [[web/chrome-extension/crxjs]] owns the CRXJS build.
surfaces:
  - on: read
    match:
      - "**/manifest.json"
      - "**/background.ts"
      - "**/background.js"
      - "**/content-script*"
      - "**/service-worker.*"
    at: preview
  - on: command
    match:
      - "*crxjs*"
      - "*chrome.runtime*"
    at: preview
---

# Chrome Extension Development (Manifest V3)

This document covers the architecture and decision points for building, debugging, and publishing Chrome extensions with MV3; the linked documents hold implementation details.

## Documents

Read only the documents relevant to the current task. Each is self-contained.

| Document | When to read |
| --- | --- |
| [[web/chrome-extension/manifest-v3]] | Setting up or modifying manifest.json, configuring icons, versioning |
| [[web/chrome-extension/service-worker]] | Background logic, lifecycle, state persistence, alarms, events |
| [[web/chrome-extension/content-scripts]] | Injecting code into pages, isolated/main world, dynamic injection, SPA handling, orphaning |
| [[web/chrome-extension/messaging-rpc]] | Communication between any contexts, typed protocols, RPC layer, async handler patterns |
| [[web/chrome-extension/ui-surfaces]] | Popup, options page, side panel, context menus, commands, notifications, omnibox, devtools panel |
| [[web/chrome-extension/storage]] | chrome.storage (local/sync/session), quotas, reactive patterns, framework hooks |
| [[web/chrome-extension/network-csp]] | HTTP requests from content scripts, CSP bypass relay, declarativeNetRequest, offscreen docs, CORS |
| [[web/chrome-extension/permissions]] | Required/optional permissions, host permissions, activeTab, runtime request flow |
| [[web/chrome-extension/web-accessible-resources]] | Exposing extension files to web pages, security implications |
| [[web/chrome-extension/typescript-build]] | TypeScript setup, project structure, build tools comparison, bundling |
| [[web/chrome-extension/publishing]] | Chrome Web Store submission, review process, rejection reasons, updates, privacy policy |
| [[web/chrome-extension/execution-contexts]] | Communication flow diagrams, per-context capabilities/limits, choosing the right messaging method |
| [[web/chrome-extension/debugging-mistakes]] | DevTools for extensions, testing SW termination, common gotchas, error patterns |

## Architecture overview

A Chrome extension has up to 5 execution contexts that communicate via message passing:

```
┌──────────────────────────────────────────────────────────┐
│ Extension Process                                        │
│  ┌─────────────────┐  ┌───────┐  ┌─────────┐  ┌──────┐ │
│  │ Service Worker   │  │ Popup │  │ Options │  │ Side │ │
│  │ (background)     │  │       │  │  Page   │  │Panel │ │
│  │ - No DOM         │  │ Full  │  │  Full   │  │ Full │ │
│  │ - Ephemeral      │  │ DOM   │  │  DOM    │  │ DOM  │ │
│  │ - All chrome.*   │  │ All   │  │  All    │  │ All  │ │
│  │   APIs           │  │ APIs  │  │  APIs   │  │ APIs │ │
│  └────────┬─────────┘  └───┬───┘  └────┬────┘  └──┬───┘ │
│           │ chrome.runtime.sendMessage / connect   │     │
└───────────┼────────────────┼───────────┼──────────┼──────┘
            │                │           │          │
    chrome.tabs.sendMessage  │           │          │
            │                │           │          │
┌───────────┼────────────────┼───────────┼──────────┼──────┐
│ Web Page  ▼                                              │
│  ┌──────────────────┐    ┌──────────────────┐            │
│  │ Content Script    │    │ Main World Script │            │
│  │ (isolated world)  │◄──►│ (page context)    │            │
│  │ - Shared DOM      │    │ - Shared DOM      │            │
│  │ - Own JS scope    │    │ - Page JS scope   │            │
│  │ - chrome.runtime  │    │ - No chrome.* API │            │
│  │ - chrome.storage  │    │ - Full page access│            │
│  │ - Subject to CSP  │    │ - Subject to CSP  │            │
│  │   (network only)  │    │   (fully)         │            │
│  └──────────────────┘    └──────────────────┘            │
│           ▲ window.postMessage                           │
│           │ (through shared DOM)                         │
└──────────────────────────────────────────────────────────┘
```

### Communication flows (labeled channels)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Extension Process                                                         │
│                                                                           │
│  ┌─────────────────┐  chrome.runtime   ┌───────┐  ┌─────────┐  ┌──────┐ │
│  │ Service Worker   │◄─.sendMessage()──│ Popup │  │ Options │  │ Side │ │
│  │ (background)     │◄─.connect()──────│       │  │  Page   │  │Panel │ │
│  │                  │                  └───────┘  └─────────┘  └──────┘ │
│  │ - No DOM         │  ┌────────────────────────────────────────────┐   │
│  │ - Ephemeral 30s  │  │ SW cannot push to these pages.             │   │
│  │ - All chrome.*   │  │ Use: ports (.connect) or storage.onChanged │   │
│  └────────┬─────────┘  └────────────────────────────────────────────┘   │
│           │                                                              │
│  chrome.storage.onChanged ◄── fires across ALL contexts simultaneously  │
│                                                                           │
└───────────┼──────────────────────────────────────────────────────────────┘
            │ chrome.tabs.sendMessage(tabId, ...) [SW must know tabId]
            │
┌───────────┼──────────────────────────────────────────────────────────────┐
│ Web Page  ▼                                                              │
│  ┌──────────────────┐  window.postMessage  ┌──────────────────┐         │
│  │ Content Script    │◄───────────────────►│ Main World Script │         │
│  │ (isolated world)  │  Custom DOM events  │ (page context)    │         │
│  │                   │                     │                   │         │
│  │ chrome.runtime ───┼── to/from SW        │ No chrome.* APIs  │         │
│  │ chrome.storage    │                     │ Full page JS      │         │
│  │ Shared DOM        │                     │ Shared DOM        │         │
│  │ Page CSP (network)│                     │ Page CSP (full)   │         │
│  └──────────────────┘                     └──────────────────┘         │
└──────────────────────────────────────────────────────────────────────────┘
```

For detailed flow diagrams (three-layer bridge, cross-extension, storage broadcast) and a per-context breakdown of permissions, limits, and workarounds: → Read [[web/chrome-extension/execution-contexts]]

### Communication methods at a glance

| Method | Direction | Best for |
| --- | --- | --- |
| `chrome.runtime.sendMessage` | Any ext context → SW | One-shot request/response (90% of cases) |
| `chrome.tabs.sendMessage` | SW → content script (by tabId) | Pushing data to a specific tab |
| `chrome.runtime.connect` (Port) | Bidirectional | Streaming, progress, SW ↔ popup |
| `window.postMessage` | Between worlds on same page | Page JS ↔ content script bridge |
| `chrome.storage.onChanged` | Broadcast to all contexts | Settings sync, no messaging needed |

→ Full matrix with limits and edge cases: [[web/chrome-extension/execution-contexts]] → Implementation patterns, typed protocols, RPC layer: [[web/chrome-extension/messaging-rpc]]

### Key architectural rules

1. **Service worker is ephemeral.** It terminates after 30s of inactivity. All state must be persisted to chrome.storage. All event listeners must be registered synchronously at the top level. Never use setTimeout/setInterval for anything beyond a few seconds. → Read [[web/chrome-extension/service-worker]]

2. **Content scripts run in the page's origin.** Network requests from content scripts are subject to the page's CSP and CORS. To bypass, relay through the service worker. → Read [[web/chrome-extension/network-csp]]

3. **Messaging is the backbone.** Every cross-context interaction uses chrome.runtime messaging. The #1 bug: forgetting to `return true` from async message listeners. → Read [[web/chrome-extension/messaging-rpc]]

4. **Permissions determine CWS review speed.** Broad host_permissions trigger manual review (weeks). activeTab + optional permissions = fast automated review. → Read [[web/chrome-extension/permissions]]

5. **Popup is destroyed on blur.** Side panel persists. Choose based on interaction duration. → Read [[web/chrome-extension/ui-surfaces]]

## Decision tree: which context handles what?

### "I need to run code when the user visits a page"

→ Content script. Static (manifest) for known URL patterns, dynamic (chrome.scripting) for user-triggered injection. Default to isolated world unless you need page JS access. → Read [[web/chrome-extension/content-scripts]]

### "I need to make an HTTP request to my API"

- From popup/options/side panel: direct fetch() works (extension origin, no CSP issues)
- From content script on a page with restrictive CSP: relay through service worker
- From service worker: direct fetch() works (requires host_permissions for the target domain) → Read [[web/chrome-extension/network-csp]]

### "I need to store user settings"

- Settings that sync across devices: chrome.storage.sync (100KB limit)
- Large data or caches: chrome.storage.local (10MB, or unlimited with permission)
- Ephemeral state surviving SW restarts: chrome.storage.session → Read [[web/chrome-extension/storage]]

### "I need to modify HTTP headers or block requests"

→ declarativeNetRequest (NOT webRequest, which lost blocking in MV3) → Read [[web/chrome-extension/network-csp]]

### "I need the page's JavaScript to talk to my extension"

→ Three-layer bridge: page (window.postMessage) → content script → service worker → Read [[web/chrome-extension/messaging-rpc]]

### "I need to understand what each context can and cannot do"

→ Read [[web/chrome-extension/execution-contexts]] — per-context cards listing chrome.\* access, DOM, network, storage, lifetime, hard limits, and practical workarounds.

### "I need periodic background tasks"

→ chrome.alarms (minimum 30s interval). NOT setTimeout. → Read [[web/chrome-extension/service-worker]]

### "I need DOM APIs in the background" (DOMParser, Canvas, Audio)

→ Offscreen document. One per extension, only chrome.runtime available. → Read [[web/chrome-extension/network-csp]]

### "I need to authenticate with OAuth"

→ chrome.identity.launchWebAuthFlow() or chrome.identity.getAuthToken() (Google only) → Read [[web/chrome-extension/service-worker]] (identity section)

## Workflow: new extension from scratch

1. **Define the manifest** with minimum permissions. Start with `activeTab` + `scripting`. → Read [[web/chrome-extension/manifest-v3]]

2. **Set up TypeScript and build tooling** (or use CRXJS for Vite-based dev: [[web/chrome-extension/crxjs]]). → Read [[web/chrome-extension/typescript-build]]

3. **Implement the service worker** with all event listeners at the top level. → Read [[web/chrome-extension/service-worker]]

4. **Add content scripts** if you need page interaction. → Read [[web/chrome-extension/content-scripts]]

5. **Build UI surfaces** (popup, options, side panel) as needed. → Read [[web/chrome-extension/ui-surfaces]]

6. **Wire up messaging** between all contexts. → Read [[web/chrome-extension/messaging-rpc]]

7. **Test with DevTools**, specifically test service worker termination. → Read [[web/chrome-extension/debugging-mistakes]]

8. **Publish to Chrome Web Store.** → Read [[web/chrome-extension/publishing]]

## Workflow: adding a feature to an existing extension

1. Identify which context the feature belongs to (see decision tree above).
2. Read the relevant reference file(s) for that context.
3. Check if new permissions are needed. Prefer optional_permissions for new capabilities. → Read [[web/chrome-extension/permissions]]
4. Update the manifest if adding new content scripts, UI surfaces, or permissions.
5. Handle extension updates gracefully (content script orphaning). → Read [[web/chrome-extension/content-scripts]] (orphaning section)

## Minimal manifest.json template

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "What it does in one sentence",
  "permissions": ["storage", "activeTab", "scripting"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

→ For the full manifest reference with all fields: [[web/chrome-extension/manifest-v3]]

## Code patterns quick reference

### Async message handler (the safe pattern)

```typescript
// Wrap async handlers to avoid the return-true trap
function asyncHandler(
  fn: (msg: any, sender: chrome.runtime.MessageSender) => Promise<any>,
) {
  return (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (r: any) => void,
  ) => {
    fn(message, sender)
      .then(sendResponse)
      .catch((e) => sendResponse({ __error: true, message: e.message }));
    return true; // literal true, not Promise<true>
  };
}

chrome.runtime.onMessage.addListener(
  asyncHandler(async (msg, sender) => {
    if (msg.type === "FETCH") {
      const res = await fetch(msg.url);
      return { ok: res.ok, data: await res.text() };
    }
  }),
);
```

### CSP bypass relay (content script → service worker → API)

```typescript
// content-script.ts
async function apiCall(endpoint: string, options?: RequestInit) {
  return chrome.runtime.sendMessage({ type: "API_RELAY", endpoint, options });
}

// background.ts
const ALLOWED_ENDPOINTS = ["https://api.example.com"];
chrome.runtime.onMessage.addListener(
  asyncHandler(async (msg) => {
    if (msg.type !== "API_RELAY") return;
    if (!ALLOWED_ENDPOINTS.some((e) => msg.endpoint.startsWith(e))) {
      throw new Error("Blocked endpoint");
    }
    const res = await fetch(msg.endpoint, msg.options);
    return { ok: res.ok, status: res.status, data: await res.text() };
  }),
);
```

### Persist state across SW restarts

```typescript
// Use chrome.storage.session for ephemeral state
chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

async function getState<T>(key: string, fallback: T): Promise<T> {
  const result = await chrome.storage.session.get(key);
  return result[key] ?? fallback;
}
async function setState<T>(key: string, value: T): Promise<void> {
  await chrome.storage.session.set({ [key]: value });
}
```

### Orphaned content script detection

```typescript
function isExtensionContextValid(): boolean {
  try {
    return !!chrome.runtime?.id;
  } catch {
    return false;
  }
}

// Before any chrome.runtime call
if (!isExtensionContextValid()) {
  showRefreshBanner();
  return;
}
```

## What NOT to do

- Do NOT use `eval()`, `new Function()`, or load remote scripts. MV3 forbids it.
- Do NOT use `setTimeout`/`setInterval` for anything > 5s in service workers.
- Do NOT register event listeners inside callbacks or async functions.
- Do NOT use `<all_urls>` host permission unless absolutely necessary.
- Do NOT rely on DevTools keeping the service worker alive during testing.
- Do NOT forget `return true` in async message listeners.
- Do NOT use `localStorage` or `sessionStorage` in service workers (they don't exist there).
- Do NOT assume content scripts survive extension updates.
- Do NOT use `webRequest` blocking (removed in MV3). Use `declarativeNetRequest`.
- Do NOT use `chrome.extension.getBackgroundPage()` (removed in MV3).
