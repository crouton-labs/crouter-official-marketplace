---
kind: knowledge
when-and-why-to-read: When you must tell a person something on Slack — a question for them, a finished result, an alert — read this because a message sent as that person through their own Slack account never notifies them, so it looks delivered but nobody sees it.
short-form: To notify a person on Slack, post as the bot with `crtr slack-bot post <user-id|channel-id>`; posting as them never pings them.
surfaces:
  - on: command
    match:
      - "*slack-bot*"
      - "*integrations*slack*"
    at: preview
---

# Notifying people on Slack

Slack does not notify a person about messages from their own account. An agent that posts through `crtr integrations` acts *as* the connected person, so a DM or mention it sends to that person never pings them. The message lands, but they get no notification.

To reach a person, post as the bot with `crtr slack-bot post`. The bot is a separate Slack user, so the recipient is notified as for a message from a colleague.

- **One person:** pass their user id (`U…`). The bot opens a DM with them.
- **Several people:** pass comma-separated user ids. The bot opens a group DM with them.
- **A channel:** pass its id (`C…`). Any public channel works without an invite. A private channel needs the bot invited first.
- **Follow-up:** pass `--thread <ts>` and the channel id the first post printed. The reply goes into that message's thread.

Use `crtr integrations` to read Slack or to act as the person. Use the bot only to notify. It cannot read replies, so ask for an answer in a place you can read, or tell the person where to reply.

The bot needs `SLACK_BOT_TOKEN`, the bot token of the Slack app it posts as. Set it with `crtr sys env set --name SLACK_BOT_TOKEN`.
