// The only module that talks to slack.com/api. Owns the bot token, recipient
// resolution (channel id, one person, or several people), the two Web API
// calls (conversations.open, chat.postMessage), and translation of Slack and
// transport failures into typed plugin errors. Node built-ins and global fetch
// only — this plugin has no dependencies and no build step.

const SLACK_API = 'https://slack.com/api';

/** A recoverable failure the executable reports as a protocol error envelope:
 *  `{ ok: false, error: { code, message, field?, next } }`. */
export class PluginError extends Error {
  constructor(code, message, { field, next } = {}) {
    super(message);
    this.code = code;
    this.field = field;
    this.next = next;
  }
}

/** The calling app's bot token, from the daemon-managed env store. */
export function resolveToken() {
  const env = process.env['SLACK_BOT_TOKEN'];
  if (typeof env === 'string' && env.trim() !== '') return env.trim();
  throw new PluginError('missing_credential', 'no Slack bot token found', {
    next: 'Set the bot token (xoxb-…) with crtr sys env set --name SLACK_BOT_TOKEN.',
  });
}

// What to do next for the Slack errors an agent can act on.
const SLACK_ERROR_NEXT = {
  invalid_auth: 'The token is not a valid bot token. Set a current xoxb- token with crtr sys env set --name SLACK_BOT_TOKEN.',
  not_authed: 'Set the bot token with crtr sys env set --name SLACK_BOT_TOKEN.',
  token_revoked: 'The bot token was revoked. Reinstall the Slack app and set the new token with crtr sys env set --name SLACK_BOT_TOKEN.',
  account_inactive: 'The bot token was revoked. Reinstall the Slack app and set the new token with crtr sys env set --name SLACK_BOT_TOKEN.',
  missing_scope: 'The Slack app lacks a bot scope this call needs (chat:write, chat:write.public, im:write, mpim:write). Add it in the app settings and reinstall.',
  channel_not_found: 'Check the channel id. A private channel or an existing DM the bot is not part of is invisible to it; invite the bot, or address the person by user id instead.',
  not_in_channel: 'The bot is not a member of this private channel. Invite it to the channel, or address the person by user id.',
  is_archived: 'The channel is archived. Post somewhere else.',
  user_not_found: 'Check the user id (U…). Look it up in the person\'s Slack profile under "Copy member ID".',
  user_disabled: 'That Slack account is deactivated.',
  thread_not_found: 'Check --thread: it must be the ts of a message in the same channel.',
  msg_too_long: 'Shorten the message (Slack limit: 40,000 characters).',
  ratelimited: 'Slack rate-limited the bot. Wait a minute and retry.',
};

/** POST a JSON body to a Slack Web API method and return the parsed response.
 *  Slack answers HTTP 200 with `ok: false` for most failures, so `ok` — not
 *  the status code — decides success. */
async function slackCall(method, body) {
  const token = resolveToken();

  let res;
  try {
    res = await fetch(`${SLACK_API}/${method}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new PluginError('slack_unreachable', `Slack ${method} request failed: ${detail}`, {
      next: 'Check network connectivity and retry.',
    });
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw new PluginError('slack_error', `Slack ${method} returned HTTP ${res.status} with a non-JSON body`, {
      next: 'Retry. If it persists, check https://slack-status.com.',
    });
  }

  if (json?.ok !== true) {
    const error = typeof json?.error === 'string' ? json.error : `http_${res.status}`;
    const needed = typeof json?.needed === 'string' ? ` (needed: ${json.needed})` : '';
    throw new PluginError('slack_error', `Slack ${method} error: ${error}${needed}`, {
      next: SLACK_ERROR_NEXT[error] ?? `Look the error up at https://api.slack.com/methods/${method} and correct the request.`,
    });
  }
  return json;
}

const CHANNEL_ID = /^[CGD][A-Z0-9]+$/;
const USER_ID = /^[UW][A-Z0-9]+$/;

/** Parse `<to>` into either a conversation id or a list of user ids. */
export function parseRecipient(to) {
  const raw = typeof to === 'string' ? to.trim() : '';
  if (CHANNEL_ID.test(raw)) return { channel: raw };
  const users = raw.split(',').map((u) => u.trim()).filter((u) => u !== '');
  if (users.length > 0 && users.every((u) => USER_ID.test(u))) {
    if (users.length > 8) {
      throw new PluginError('invalid_input', `a group DM holds at most 8 people besides the bot; got ${users.length}`, {
        field: 'to',
        next: 'Post to a channel instead, or split the recipients.',
      });
    }
    return { users };
  }
  throw new PluginError('invalid_input', `not a Slack channel id or user id list: ${JSON.stringify(raw)}`, {
    field: 'to',
    next: 'Pass a channel id (C…, G…, D…), one user id (U…), or comma-separated user ids. Channel names like #general are not accepted.',
  });
}

/** Post `text` as the bot. Opens (or reuses) the DM or group DM when the
 *  recipient is people. Returns the conversation id and the message ts. */
export async function postMessage({ to, text, thread }) {
  const recipient = parseRecipient(to);
  let channel = recipient.channel;
  if (channel === undefined) {
    const opened = await slackCall('conversations.open', { users: recipient.users.join(',') });
    channel = opened.channel?.id;
  }

  const body = { channel, text, mrkdwn: true };
  if (thread !== undefined) body.thread_ts = thread;
  const posted = await slackCall('chat.postMessage', body);
  return { channel: posted.channel, ts: posted.ts };
}
