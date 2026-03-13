---
name: retrospective
description: >
  Use when extracting insights from historical project data, git history,
  activity logs, decision records, or past documentation to understand what
  happened, why decisions were made, and what patterns emerge over time.
  Triggers on retrospective analysis, "what led to this", archaeological
  investigation of past work, root cause discovery, or building context from
  historical records.
tags: [analytics, retrospective, research]
name_ko: 히스토리 인사이트
description_ko: >
  과거 프로젝트 데이터, git 히스토리, 활동 로그, 결정 기록, 과거 문서에서
  인사이트를 추출하여 무슨 일이 있었는지, 왜 결정이 내려졌는지, 어떤 패턴이
  나타나는지 파악할 때 활용합니다.
updated: 2026-03-12
---

# History Insight

Reconstruct what happened from the artifacts it left behind. Turn git logs, Notion history, Slack archives, and past reports into a coherent account that informs better decisions going forward.

## Workflow

1. Define the investigation scope: subject (project, decision, person, system), time window, and goal
2. Identify available sources and read them in chronological order
3. Extract key events, decisions, and turning points from each source
4. Build a timeline and identify patterns, causes, and consequences
5. Deliver the insight report with evidence citations and forward-looking implications

## Source Hierarchy

Read sources in this priority order:
1. **Decision records** (Notion, docs) — explicit decisions with rationale
2. **Git history** — what changed and when; commit messages for intent
3. **Meeting notes** (Granola, Notion) — discussion and decision context
4. **Slack archives** — real-time reactions, debates, and informal decisions
5. **Project status updates** — milestones, blockers, and trajectory over time
6. **Check-ins / checkouts** — individual activity and signal patterns

## Investigation Types

**Post-mortem / incident analysis:**
- Reconstruct the timeline of events leading to the incident
- Identify the earliest signal that was missed or ignored
- Trace the decision chain: who knew what, when, and what they did

**Decision archaeology:**
- Find when and why a specific technical or product decision was made
- Surface the alternatives that were considered and why they were rejected
- Identify if the conditions that drove the decision have since changed

**Contribution analysis:**
- Map what a person or team contributed over a period
- Identify high-impact moments and periods of low output
- Surface patterns in where they added the most value

**Project trajectory:**
- Reconstruct a project's arc from inception to current state
- Identify inflection points: scope changes, pivots, acceleration, stalls

## Insight Output Template

```markdown
# History Insight: [Subject]
**Period analyzed:** [Start] to [End]
**Sources consulted:** [List]

## Timeline of Key Events
| Date | Event | Evidence | Significance |
|------|-------|----------|-------------|
| [Date] | [What happened] | [Source link] | [Why it mattered] |

## Key Decisions and Rationale
- **[Date] — [Decision]**: [Why it was made, who made it, what it led to]

## Patterns Identified
- [Pattern observed across multiple events or time periods]

## Root Causes / Explanations
[Evidence-based explanation of why things happened the way they did]

## What Could Have Been Different
[Specific decision points where a different choice was available — not blame, just options]

## Implications for Now
- [What this history means for current decisions or strategies]
```

## Evidence Standards

- Every insight claim must cite a specific source (link, date, quote)
- Do not infer intent — document what was said or done, not what was thought
- Note conflicting evidence when sources disagree — don't silently pick one
- Flag gaps: periods or decisions with no documentary evidence

## Common Traps to Avoid

- **Hindsight bias**: Don't judge past decisions by information that wasn't available then
- **Single-source conclusions**: Verify important claims against multiple sources
- **Recency bias**: Old events matter — don't skim them in favor of recent ones
- **Attribution errors**: Activity patterns in git/Slack may reflect context, not effort

## Quality Checks

Before delivering:
- Timeline has no unexplained gaps longer than a reporting period
- All major decisions have at least one source citation
- Patterns are observed across 3+ data points, not inferred from 1-2
- Implications are clearly separated from historical facts
