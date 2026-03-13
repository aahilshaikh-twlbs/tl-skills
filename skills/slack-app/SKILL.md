---
name: slack-app
description: >
  Use when building, configuring, or extending a Slack app — creating slash
  commands, workflow steps, event listeners, interactive components, or Block
  Kit message formatting. Triggers on "build a Slack bot", "add a slash
  command", "create a Slack workflow", "format a Slack message with blocks",
  or any Slack app development task. Covers Bolt framework, Slack API, and
  Block Kit.
tags: [engineering, slack, integration]
name_ko: 슬랙 앱
description_ko: >
  Slack 앱 구축, 설정, 확장 시 활용 — 슬래시 명령어, 워크플로 단계, 이벤트
  리스너, 인터랙티브 컴포넌트, Block Kit 메시지 포맷 생성. Bolt 프레임워크,
  Slack API, Block Kit을 다룹니다.
updated: 2026-03-12
---

# Slack App

Build Slack integrations that feel native — fast responses, clean Block Kit formatting, and reliable event handling. Use the Bolt framework unless there's a compelling reason not to.

## Workflow

1. Identify what the app needs to do: slash command, event listener, workflow step, or bot message
2. Choose the implementation approach: Bolt (Node.js or Python) or raw HTTP API
3. Set up the Slack app manifest and required scopes
4. Implement the handler with proper error handling and response timing
5. Test with Slack's socket mode locally before deploying

## App Setup Checklist

```
- [ ] App created at api.slack.com/apps
- [ ] Bot token scopes defined (minimum required, not kitchen sink)
- [ ] Event subscriptions or socket mode enabled
- [ ] Slash commands registered (if needed)
- [ ] Interactivity URL set (for buttons, modals, shortcuts)
- [ ] App installed to workspace with correct scopes
- [ ] SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET in environment
```

## Bolt Framework — Quick Start

```javascript
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // use for local dev
  appToken: process.env.SLACK_APP_TOKEN,
});

// Slash command
app.command('/mycommand', async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: `Hello, ${command.user_name}!` });
});

// Event listener
app.event('message', async ({ event, client }) => {
  if (event.text?.includes('help')) {
    await client.chat.postMessage({
      channel: event.channel,
      text: "Here's how I can help...",
    });
  }
});

(async () => { await app.start(); })();
```

## Required Bot Token Scopes by Feature

| Feature | Required Scopes |
|---------|----------------|
| Post messages | `chat:write` |
| Read messages in channel | `channels:history` or `groups:history` |
| Read DMs | `im:history` |
| React to messages | `reactions:write` |
| Slash commands | `commands` |
| Read user profiles | `users:read`, `users:read.email` |
| Upload files | `files:write` |
| Create channels | `channels:manage` |

## Block Kit Patterns

### Informational message with sections
```javascript
const blocks = [
  {
    type: 'header',
    text: { type: 'plain_text', text: '📋 Title Here' }
  },
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*Key info:* Some detail here\n*Another field:* Another value' }
  },
  { type: 'divider' },
  {
    type: 'context',
    elements: [{ type: 'mrkdwn', text: 'Updated by @user · Just now' }]
  }
];
```

### Button with action
```javascript
{
  type: 'actions',
  elements: [{
    type: 'button',
    text: { type: 'plain_text', text: 'Approve' },
    style: 'primary',
    action_id: 'approve_button',
    value: 'item_id_123'
  }]
}
```

### Modal
```javascript
await client.views.open({
  trigger_id: body.trigger_id,
  view: {
    type: 'modal',
    callback_id: 'my_modal',
    title: { type: 'plain_text', text: 'My Form' },
    submit: { type: 'plain_text', text: 'Submit' },
    blocks: [
      {
        type: 'input',
        block_id: 'input_text',
        label: { type: 'plain_text', text: 'Enter value' },
        element: { type: 'plain_text_input', action_id: 'text_input' }
      }
    ]
  }
});
```

## Critical Response Rules

- **Acknowledge within 3 seconds** — Slack will retry otherwise. `await ack()` must be called immediately
- For long-running tasks: `ack()` first, then process asynchronously
- Use `respond()` for slash command replies (ephemeral or in-channel)
- Use `client.chat.postMessage()` for bot-initiated messages

## Common Patterns

**Ephemeral (only visible to user):** `respond({ text: '...', response_type: 'ephemeral' })`
**Update existing message:** `client.chat.update({ channel, ts, blocks })`
**Reply in thread:** `client.chat.postMessage({ channel, thread_ts: event.ts, text })`
**Scheduled message:** `client.chat.scheduleMessage({ channel, post_at: unixTimestamp, text })`

## Quality Checks

Before deploying:
- All interactions ack within 3 seconds (async operations run after ack)
- Error handling doesn't silently swallow failures — log and surface to user
- Scopes are minimal — don't request what's not needed
- Signing secret verification is enabled — never disable it in production
