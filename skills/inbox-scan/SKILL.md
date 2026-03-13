---
name: inbox-scan
description: >
  Use when scanning any communication inbox — email or Slack — to surface
  action items, decisions, and important context. Triggers on inbox triage
  requests, "what do I need to action", catch-up after being away, digest
  creation, or "what did I miss" prompts. Works across Gmail and Slack channels,
  threads, and DMs. Classifies messages by urgency, extracts asks, and
  optionally drafts replies.
tags: [productivity, communication, email, slack]
name_ko: 인박스 스캔
description_ko: >
  이메일 또는 Slack 등 모든 커뮤니케이션 받은 편지함을 스캔하여 액션 아이템,
  결정사항, 중요한 맥락을 파악할 때 활용합니다. Gmail과 Slack 채널, 스레드,
  DM에서 작동합니다.
updated: 2026-03-13
---

# Inbox Scan

Cut through communication noise across email and Slack to surface what actually matters. Extract commitments, deadlines, and decisions — and discard what doesn't need attention.

## Step 1 — Identify Scope

Ask the user (or infer):
- **Platform**: Email (Gmail), Slack, or both
- **Scope**: Inbox / specific channels / DMs / @mentions / date range
- **Goal**: Full triage, action items only, or catch-up digest

---

## Email Scan

### Workflow
1. Define scan scope: inbox, label/folder, date range, or sender
2. Retrieve emails using Gmail tools or pasted content
3. Classify each email by type and urgency
4. Extract action items, decisions, and FYIs into a digest
5. Optionally draft replies for top action-required threads

### Email Classification

| Type | Description | Action |
|------|-------------|--------|
| **Action required** | Requests a response, decision, or task | Capture with deadline |
| **FYI** | Informational, no response needed | Log key facts only |
| **Decision** | Decision made that affects your work | Extract and log |
| **Automated** | Notifications, alerts, system emails | Summarize or skip |
| **Low signal** | Newsletters, promotions | Mark and skip |

### Email Priority Signals

**High:** From exec or external customer · Deadline within 48h · Blocking another person · Financial or legal content
**Low:** No explicit ask · CC'd without direct mention · Recurring notification

---

## Slack Scan

### Workflow
1. Define scope: channels, DMs, @mentions, or time window
2. Read channels and threads — prioritize @mentions and DMs first
3. Classify messages: action required, decision, FYI, or noise
4. Aggregate into a structured digest with priority ordering
5. Optionally draft responses to direct asks

### Default Channel Priority
1. Direct @mentions across all channels
2. DMs with unread messages
3. Key project and team channels
4. Broad announcement channels (#general, #announcements)
5. Interest channels — lowest priority

### Slack Classification

**Action required:** Direct @mention with a question or request, DM awaiting reply
**Decision:** Explicit consensus reached, vote result, "we decided X"
**FYI:** Important update, announcement — no response needed
**Noise:** Reactions, off-topic tangents, social content

### Reading Threads
- Read the full thread — later messages often reverse earlier ones
- Check the last message in a resolution thread for the outcome
- Reactions signal state: ✅ = resolved, 👀 = acknowledged, ❓ = still open

---

## Unified Digest Template

```markdown
# Inbox Scan — [Date] [Scope]

## Action Required
| From | Platform | Summary / Ask | Deadline | Priority |
|------|----------|---------------|----------|----------|
| [Name] | Email / Slack | [What's needed] | [Date/ASAP/TBD] | High/Med/Low |

## Decisions to Note
- **[Sender/Channel]**: [Decision and its impact on your work]

## Important Context (FYI)
- [Key fact or development you should know — platform noted]

## Suggested Responses
[Optional: draft responses for top 2-3 action-required items]

## Skipped / Low Signal
[Count of automated and social items — not itemized]
```

## Drafting Replies

When drafting replies:
- Match the sender's formality level
- Answer the question directly in the first sentence
- State any timeline or dependencies upfront
- Email: keep under 5 sentences unless detail is required
- Slack: respond in-thread; use reactions for simple acknowledgments

## Tool Reference

**Gmail:** `gmail_search_messages`, `gmail_read_thread`, `gmail_read_message`
**Slack:** `slack_read_channel`, `slack_read_thread`, `slack_search_public_and_private`

## Quality Checks

Before delivering:
- All @mentions and direct emails are accounted for — none missed
- Deadlines are specific dates, not relative terms
- Nothing with a hard deadline is below High priority
- Draft replies answer the question asked, not a paraphrase of it
