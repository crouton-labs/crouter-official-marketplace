// Single source of truth for the `crtr slack-bot` command surface.
//
// Each leaf carries BOTH its declaration (the help/param/output descriptors crtr
// renders and validates against) and the `run` that answers an invocation. The
// checked-in `.crouter-plugin/commands.json` is generated from this tree by
// scripts/generate-commands.mjs — never hand-edited — so the manifest and the
// executable can never describe different commands.

import { postMessage, PluginError } from './slack.mjs';

const THREAD_TS = /^\d+\.\d+$/;

const postLeaf = {
  kind: 'leaf',
  name: 'post',
  description: 'post a message as the Slack bot to a channel, one person, or a group DM',
  whenToUse:
    'a person must be notified on Slack — a question for them, a finished result, an alert. The bot is a separate Slack user, so its message pings the recipient. A message sent as the person through their own Slack account never notifies them.',
  summary: 'post a Slack message as the bot user and print its channel and ts',
  params: [
    {
      kind: 'positional',
      name: 'to',
      type: 'string',
      required: true,
      constraint:
        'Where to post. A channel id (C…, G…) or an existing DM id (D…): the bot can post in any public channel without an invite, and in a private channel only after it is invited. One user id (U…): a DM from the bot to that person. Comma-separated user ids (U…,U…, at most 8): a group DM of the bot and those people. Channel names (#general) are not accepted.',
    },
    {
      kind: 'flag',
      name: 'thread',
      type: 'string',
      required: false,
      constraint:
        'Reply in the thread of this message: its ts, as printed by an earlier post. <to> must then be that message\'s channel id, not a user id.',
    },
    {
      kind: 'stdin',
      name: 'message',
      required: true,
      constraint:
        "Message text in Slack mrkdwn (*bold*, _italic_, `code`, <https://url|label>, <@U…> mentions). Pipe it from a single-quoted heredoc (`<<'EOF'`) to preserve literal bytes.",
    },
  ],
  output: [
    {
      name: 'channel',
      type: 'string',
      required: true,
      constraint: 'Id of the conversation the message landed in — the opened DM id when <to> was user ids.',
    },
    {
      name: 'ts',
      type: 'string',
      required: true,
      constraint: 'Timestamp id of the posted message. Pass it as --thread with <to> set to channel to reply in its thread.',
    },
  ],
  outputKind: 'object',
  effects: [
    'Posts one message to Slack as the bot user (network); the recipients are notified. Opens or reuses a DM or group DM when <to> is user ids.',
  ],
  run: async (input) => {
    const text = typeof input['message'] === 'string' ? input['message'].replace(/\r?\n$/, '') : '';
    if (text.trim() === '') {
      throw new PluginError('invalid_input', 'the message on stdin is empty', {
        field: 'message',
        next: 'Pipe the message text on stdin.',
      });
    }
    const thread = typeof input['thread'] === 'string' ? input['thread'].trim() : undefined;
    if (thread !== undefined && !THREAD_TS.test(thread)) {
      throw new PluginError('invalid_input', `--thread is not a Slack message ts: ${JSON.stringify(thread)}`, {
        field: 'thread',
        next: 'Pass the ts printed by an earlier post, e.g. 1716400000.123456.',
      });
    }
    return postMessage({ to: input['to'], text, thread });
  },
};

/** The whole contributed forest: one top-level `slack-bot` branch with one
 *  leaf. Mounted at parent [] by the generated command manifest. */
export const slackBotBranch = {
  kind: 'branch',
  name: 'slack-bot',
  description: 'post Slack messages as a bot user so the people addressed are notified',
  whenToUse:
    'you must notify a person on Slack. Posting as the person through their own account never notifies them.',
  rootEntry: {
    concept: 'Slack messages from a bot user — notify a person in a DM, a group DM, or a channel',
    description: 'post Slack messages as a bot user so the people addressed are notified',
    whenToUse:
      'you must notify a person on Slack: a question, a finished result, an alert. Slack does not notify a person about messages sent from their own account, so a message sent as them through `crtr integrations` never pings them; the bot is a separate user and does. For reading Slack or acting as the person, use `crtr integrations`. Needs SLACK_BOT_TOKEN (`crtr sys env set --name SLACK_BOT_TOKEN`).',
  },
  summary: 'post Slack messages as a bot user — DMs, group DMs, channels, thread replies',
  model:
    'The bot is its own Slack user, installed in one workspace by the Slack app whose bot token (xoxb-…) is SLACK_BOT_TOKEN. Because Slack never notifies a person about their own messages, the bot is how an agent reaches a person on Slack. `post` addresses a channel id, one user id (a DM from the bot), or several user ids (a group DM of the bot and them), and prints the channel and ts of the message; post again with --thread <ts> and that channel to reply in its thread. The bot needs the scopes chat:write, chat:write.public, im:write and mpim:write. It posts only — it reads nothing.',
  children: [postLeaf],
};

/** Resolve a command path (e.g. ['slack-bot', 'post']) to its leaf, or null. */
export function findLeaf(commandPath) {
  if (!Array.isArray(commandPath) || commandPath[0] !== slackBotBranch.name) return null;
  let node = slackBotBranch;
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
    mounts: [{ parent: [], node: stripRuns(slackBotBranch) }],
  };
}

function stripRuns(node) {
  if (node.kind === 'branch') {
    return { ...node, children: node.children.map(stripRuns) };
  }
  const { run, ...declaration } = node;
  return declaration;
}
