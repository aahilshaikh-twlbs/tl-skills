---
name: cluster-report
description: >
  Use when generating a report for a cluster (team pod or functional group)
  covering any period from a single day up to two weeks — aggregating
  individual updates, surfacing cross-team signals, tracking OKR progress, and
  producing a publishable digest for leadership. Triggers on cluster report
  requests, team update compilation, or any "write the [period] report for
  [cluster]" prompt. Ingests Slack updates, Notion trackers, and activity history.
tags: [reporting, teams, weekly]
name_ko: 클러스터 보고서
description_ko: >
  하루부터 최대 2주까지 특정 기간의 클러스터 보고서 생성 시 활용 — 개인 업데이트를
  집계하고, 팀 간 신호를 파악하며, OKR 진행 상황을 추적하고, 리더십을 위한
  배포 가능한 다이제스트를 생성합니다.
updated: 2026-03-13
---

# Cluster Report

Aggregate cluster-level updates into a coherent report that leadership can skim in two minutes. Adapts to any reporting window — one day to two weeks.

## Step 1 — Clarify Before Writing

Before collecting any data, ask the user:

1. **Cluster name and members** — who is in scope?
2. **Reporting period** — start and end date (1 day minimum, 14 days maximum)
3. **Audience** — team-internal, manager, or exec/leadership?
4. **Sections needed** — use the defaults below or let the user trim them

Do not proceed to data collection until these are confirmed.

## Step 2 — Scale Sections to Period Length

Adjust the report's depth based on window length:

| Period | Sections to include | OKR table? | Looking Ahead? |
|--------|--------------------|-----------:|---------------:|
| 1 day | TL;DR, Shipped, Blockers | No | Next day only |
| 2–3 days | TL;DR, Shipped, In Progress, Blockers | No | Next 2 days |
| 4–7 days (week) | Full template | Yes | Next 7 days |
| 8–14 days (2-week) | Full template + Trend note | Yes | Next 14 days |

## Step 3 — Input Collection

Gather from these sources for the confirmed period:
- **Slack**: `#[team]-updates`, `#standup`, project channels
- **Notion**: OKR database (filter by cluster + quarter), project status pages
- **Calendar**: Milestones or external meetings that were significant
- **Activity history**: Session wraps, status posts, or provided notes

## Step 4 — Generate Report

Use this base template and add or remove sections per the table in Step 2:

```markdown
# [Cluster Name] — [Period Label]
[e.g., "Week of Mar 10–14" | "Mar 10–11" | "Sprint Mar 3–14"]

## TL;DR
[2-3 sentence executive summary — what moved, what's at risk, headline win]

## Shipped
- [Milestone / feature / artifact] — [Owner] — [Link if applicable]

## In Progress
| Workstream | Status | Owner | Est. Completion |
|------------|--------|-------|----------------|
| [Initiative] | 🟢 / 🟡 / 🔴 | [Name] | [Date] |

## Blockers & Needs
| Blocker | Owner | Needs From | Days Open |
|---------|-------|------------|-----------|
| [Description] | [Name] | [Team/Person/Decision] | [N] |

## OKR Progress  ← include for 5+ day windows
| KR | Metric | Period Start | Now | Target |
|----|--------|-------------|-----|--------|
| [Key result] | [Metric] | [Value] | [Value] | [Value] |

## Wins & Recognition
- [Team member] — [specific contribution]

## Looking Ahead
- [Next priority and expected milestone — scale horizon to period length]

## Trend  ← include for 8–14 day windows only
[1-2 sentences: is the cluster accelerating, stable, or losing momentum? Evidence-based.]
```

## Status Indicators

- 🟢 **On Track** — progressing as planned
- 🟡 **At Risk** — possible delay, needs attention
- 🔴 **Blocked** — cannot progress until dependency resolved
- ✅ **Completed** — done in this period
- ⏸️ **Paused** — intentionally deprioritized

## Synthesis Guidelines

- Group related work by workstream, not by individual name
- Elevate blockers open for more than 20% of the reporting window (e.g., 1+ day in a 5-day window)
- OKR metrics must be actual numbers — not "improving" or "on track"
- Wins should call out specific people by name

## Quality Checks

Before publishing:
- Period label in the title matches the confirmed dates exactly
- Sections match the period length per the scaling table
- All 🔴 blocked items have an owner AND a named dependency
- OKR table only appears for 5+ day windows
- TL;DR is self-contained — readable without the rest of the report
