---
name: session
description: >
  Use for any work session task — wrapping up a session to preserve state and
  capture next steps, or analyzing a completed session or period to extract
  patterns and productivity insights. Wrap mode: creates a structured end-of-
  session document with decisions, artifacts, and the exact next action. Analyze
  mode: reviews time allocation, focus quality, and blockers across a session,
  day, or week. Triggers on session end, "wrap this up", "how did I spend my
  time", or work period review requests.
tags: [productivity, analytics, context]
name_ko: 세션
description_ko: >
  작업 세션 마무리(상태 보존 및 다음 단계 기록) 또는 완료된 세션/기간을 분석하여
  패턴과 생산성 인사이트를 추출하는 통합 스킬. 활동 로그, 체크인/아웃,
  캘린더 데이터를 수집합니다.
updated: 2026-03-13
---

# Session

Handle any work session task — preserving state at the end of a session or analyzing how a session or period went. Identify the mode first.

## Mode Selection

**Ask the user (or infer from context):**
- **Wrap mode** — ending a session: capture decisions, artifacts, and the next action
- **Analyze mode** — reviewing a session or period: patterns, time allocation, productivity insights

---

## Wrap Mode

Preserve session state before context is lost. A good wrap means the next session starts immediately productive — no re-reading, no re-deciding.

### Wrap Workflow

1. Identify the session scope: what task or project was being worked on
2. Extract all decisions made — explicit and implicit
3. Catalog artifacts produced (code, docs, designs, messages, analyses)
4. Capture the current state of in-progress work with enough detail to resume cold
5. State the single next action needed to continue

### Wrap Output Template

```markdown
# Session Wrap — [Project/Task] — [Date Time]

## What Was Worked On
[One paragraph: the task, its context, and what was being attempted]

## Decisions Made
- **[Decision]**: [Rationale in one sentence]

## Artifacts Produced
- [File/doc/PR name + link or location]

## Current State
[Precise description of where things stand — what's done, what's partial, what's blocked]
**Exact stopping point:** [The last action taken and its result]

## Open Questions
- [ ] [Unresolved question that needs an answer to proceed]

## Next Action
**Do this first:** [Single, specific next step — no ambiguity]

## Context to Reload
- [Link to relevant doc, PR, or thread]
```

### Wrap Usage Modes

**Personal (default):** Full template saved to Notion daily note or personal log
**Handoff:** Add "Who to contact" section — expand context for a colleague
**Claude context:** Use when ending a long Claude session — feed this back in on resume
**Quick (< 30 min session):** Decisions + Current State + Next Action only

### State Capture Rules

The "Current State" section is the most critical. Be precise:
- Name the file/branch/page and its current status
- State what works and what doesn't if partially complete
- Note any environment state that matters (configs, flags, etc.)
- If blocked, name what's needed to unblock

---

## Analyze Mode

Turn raw activity data into honest insights about how time was spent and where effort created the most value.

### Analyze Workflow

1. Define the analysis window: single session, day, week, or sprint
2. Collect inputs (session wraps, calendar, Slack activity, git commits, Notion activity)
3. Categorize work into activity types and measure time allocation
4. Identify patterns — peak focus periods, interruption sources, recurring blockers
5. Generate the analysis with observations and recommendations

### Activity Categories

| Category | Description |
|----------|-------------|
| **Deep work** | Focused, uninterrupted creation |
| **Collaboration** | Meetings, reviews, pair work |
| **Communication** | Async Slack, email, comments |
| **Planning/admin** | Scoping, ticketing, scheduling |
| **Learning** | Research, reading, demos |
| **Blocked/idle** | Waiting on dependency |

### Analysis Output Template

```markdown
# Session Analysis — [Date or Period]

## Time Allocation
| Category | Hours | % |
|----------|-------|---|
| Deep work | | |
| Collaboration | | |
| Communication | | |
| Planning/admin | | |
| Blocked/idle | | |

## Key Observations
- **Peak focus window:** [Time range]
- **Biggest interruption source:** [Meetings / Slack / context switching]
- **Carry-forward rate:** [% planned tasks completed]

## What Went Well
- [Pattern worth repeating]

## What to Improve
- [Friction point with a concrete change suggestion]

## Recommendations
1. [Scheduling suggestion — protect deep work]
2. [Process change — reduce interruption]
```

### Pattern Signals

**Healthy:** 40%+ deep work · Carry-forward rate under 20% · Blockers resolved same day
**Warning:** 3+ context switches per day · Same task carried forward 2+ days · No 90-min deep work block · Communication > 30% of time

---

## Storage Recommendations

| Wrap Type | Store In |
|-----------|----------|
| Personal session | Notion daily note |
| Project work | Notion project page |
| Collaborative handoff | Slack thread + Notion |
| Analysis report | Notion weekly review page |

## Quality Checks

**Wrap:** "Next Action" is specific enough to start without re-reading anything else. All artifacts have locations (links, not just names).
**Analyze:** Time allocations sum to 100%. Recommendations are specific, not generic. Observations cite data points, not impressions.
