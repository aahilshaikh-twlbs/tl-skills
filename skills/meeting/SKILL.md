---
name: meeting
description: >
  Use for any meeting-related task — preparing before a meeting or synthesizing
  after one. Pre-meeting: builds structured agendas, surfaces relevant context,
  and prepares questions. Post-meeting: transforms notes, transcripts, or
  recordings into actionable summaries with decisions and action items. Triggers
  on meeting prep requests, agenda creation, transcript processing, action item
  extraction, or meeting minutes creation. Integrates with Notion, Granola,
  Avoma, Google Calendar, and Slack.
tags: [productivity, meetings]
name_ko: 회의
description_ko: >
  회의 전 준비 또는 회의 후 정리를 위한 통합 스킬. 사전 준비: 구조화된 의제
  작성, 관련 맥락 수집, 질문 준비. 사후 정리: 메모, 녹취록, 녹화를 결정사항
  및 액션 아이템이 포함된 실행 가능한 요약으로 변환합니다.
updated: 2026-03-13
---

# Meeting

Handle any meeting task — from preparation to synthesis. Identify the mode first, then apply the appropriate workflow.

## Mode Selection

**Ask the user (or infer from context):**
- **Prep mode** — before a meeting: build agenda, surface context, prepare questions
- **Synthesis mode** — after a meeting: extract decisions, action items, and summaries

---

## Prep Mode

Walk into every meeting with the right context, clear goals, and prepared questions.

### Prep Workflow

1. Gather meeting metadata: title, date/time, attendees, duration, and purpose
2. Pull relevant context — past meeting notes, Slack threads, Notion pages, email threads
3. Identify meeting type and apply the appropriate prep template
4. Draft a structured agenda with time allocations
5. Share briefing notes or pre-read with attendees if requested

### Prep Output Template

```markdown
# Meeting Prep: [Meeting Title]
**Date/Time:** [Date and time]
**Attendees:** [Names and roles]
**Duration:** [Length]
**Goal:** [Single sentence — what does success look like?]

## Context
[2-3 paragraphs: what led to this meeting, relevant recent events, state of play]

## Agenda
| Time | Item | Owner | Type |
|------|------|-------|------|
| 0:00 | [Topic] | [Name] | Discussion / Decision / Update |
| 0:50 | Wrap + action items | All | Logistics |

## Key Questions
- [Question that needs to be answered in this meeting]

## My Talking Points
- [Point I need to make or position I need to defend]

## Desired Outcomes
- [ ] [Decision to be made]
- [ ] [Alignment to achieve]
```

### Meeting Type Adaptations (Prep)

**1:1s**: Focus on relationship and career topics — skip formal agenda
**Exec review**: Lead with TL;DR and recommendation — data ready but don't present unless asked
**Customer call**: Research attendees, prep customer-specific talking points, anticipate objections
**Planning / scoping**: Bring estimates, dependency map, and success criteria
**Job interview**: Read JD and candidate background — prep role-specific questions

---

## Synthesis Mode

Transform raw meeting content into structured, actionable documentation.

### Synthesis Workflow

1. Identify meeting source and format (transcript, notes, recording summary)
2. Extract core meeting metadata (date, attendees, purpose)
3. Analyze content for decisions, actions, and key points
4. Generate structured summary
5. Deliver to specified destination (Notion, Slack, or direct output)

### Input Sources

**Granola / Avoma**: AI-generated notes and transcripts — preserve timestamp markers
**Zoom / Google Meet**: Cloud recordings, transcripts, chat logs
**Raw notes**: Unstructured notes, bullet points, or freeform text

### Synthesis Output Template

```markdown
# [Meeting Title]
**Date:** [Date] | **Attendees:** [Names] | **Type:** [Standup | 1:1 | Planning | Review | External]

## TL;DR
[2-3 sentence executive summary of what happened and why it matters]

## Decisions Made
- **[Decision]**: [Brief context and rationale]

## Action Items
| Owner | Action | Due Date | Priority |
|-------|--------|----------|----------|
| @Name | [Specific task] | [Date] | High/Med/Low |

## Key Discussion Points
### [Topic]
[Summary of discussion, viewpoints, conclusions]

## Open Questions / Follow-ups
- [ ] [Question requiring resolution]

## Next Steps
[What happens after this meeting]
```

### Processing Guidelines

**Action items:** Identify explicit commitments + implicit ownership from context. Flag items without owners.
**Decisions:** Look for consensus statements. Note dissenting opinions if significant.
**Priority:** High = blocking/external deadline; Medium = important not urgent; Low = exploratory

### Meeting Type Adaptations (Synthesis)

**Standup**: Focus on blockers — skip detailed discussion sections
**1:1s**: Emphasize personal action items, feedback given/received
**Customer/External**: Capture customer quotes verbatim, track commitments to external parties
**All-hands**: Key announcements, Q&A highlights, policy changes

---

## Context Sources

Before prepping or synthesizing, check:
- **Notion**: Project pages, previous meeting notes, OKRs
- **Slack**: Recent channel activity, DMs with attendees
- **Google Calendar**: Meeting series history, previous agenda items
- **Granola / Avoma**: Last meeting transcript if recurring

## Quality Checks

**Prep:** Agenda items have clear types (discussion/decision/update). Total time fits duration.
**Synthesis:** Every action item has an owner. Decisions are clearly stated. Dates are specific.
