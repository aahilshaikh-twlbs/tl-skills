---
name: notion
description: >
  Use for any Notion task — reading and querying databases or pages, or
  drafting and writing structured content back to Notion. Read mode: extracts
  data from databases, collections, and pages for analysis or reporting. Write
  mode: drafts well-structured page content, database entries, project updates,
  decision records, or documentation. Triggers on "query Notion", "add this to
  Notion", "what's in the Notion DB", "draft a Notion page", or any
  Notion read/write request.
tags: [notion, data, productivity, documentation]
name_ko: 노션
description_ko: >
  모든 Notion 작업을 위한 통합 스킬 — 데이터베이스나 페이지 읽기/쿼리, 또는
  Notion에 구조화된 콘텐츠 작성. 읽기 모드: 분석 또는 보고를 위한 데이터 추출.
  쓰기 모드: 페이지 콘텐츠, 데이터베이스 항목, 업데이트, 결정 기록 작성.
updated: 2026-03-13
---

# Notion

Handle any Notion interaction — reading data from a collection or writing structured content to a page. Identify the mode first.

## Mode Selection

**Ask the user (or infer from context):**
- **Read mode** — querying, extracting, or analyzing data from Notion databases or pages
- **Write mode** — drafting or posting content to Notion pages or database entries

---

## Read Mode

Extract structured, usable information from Notion databases and turn it into analysis, reports, or inputs for other tools.

### Read Workflow

1. Identify the target database(s): name, URL, or description
2. Fetch the database schema to understand available properties and types
3. Query with appropriate filters and sorts based on the task
4. Extract and normalize the data into a structured format
5. Deliver as analysis, report, or table per the user's goal

### Property Types Reference

| Type | How to Handle |
|------|--------------|
| Title | Primary identifier — always include |
| Select / Multi-select | Treat as categorical — good for grouping |
| Date / Date range | Normalize to ISO format |
| Checkbox | Boolean — use for filtering completion |
| Number | Numeric — available for aggregation |
| Relation | Resolve to linked page title |
| Rollup / Formula | Read computed result directly |
| Person | Extract name and email |

### Query Strategies

**Status overview:** Filter Status ≠ Done, group by assignee or project
**Trend analysis:** Filter by date range, sort by created/updated date
**Completeness check:** Filter for empty required fields
**Cross-database join:** Query both databases, match on shared property
**Full export:** No filter, sorted by creation date

### Read Output Template

```markdown
# Notion Export — [Database Name]
**Extracted:** [Date] | **Records:** [N] | **Filters:** [Description]

## Data Table
| [Property 1] | [Property 2] | [Property 3] |
|-------------|-------------|-------------|
| [Value] | [Value] | [Value] |

## Summary Statistics
- Total records: [N]
- [Property]: [Distribution by value]

## Notable Gaps
- [Records missing required fields or data quality issues]
```

### Common Use Patterns

**OKR database:** Extract by quarter, compute completion rates, surface at-risk KRs
**Project tracker:** Group by status, identify overdue items and blockers
**Content calendar:** Filter by publish date, group by author or channel
**People directory:** Extract roles, teams, and reporting relationships

---

## Write Mode

Draft well-structured Notion content that fits workspace conventions. Write it right the first time — clear hierarchy, correct properties, consistent tone.

### Write Workflow

1. Identify the target: specific page, database, or section
2. Fetch the existing page or database schema to match conventions
3. Determine content type and apply the appropriate template
4. Draft in Notion-compatible markdown
5. Confirm and post using Notion tools, or return for manual paste

### Content Templates

**Project Status Update:**
```markdown
## Status Update — [Date]
**Status:** On Track / At Risk / Blocked / Completed

### Progress
- [Completed milestone]
- [In progress — X% done]

### Blockers
- [Blocker with owner, or "None"]

### Next Week
- [Priority action]
```

**Decision Record:**
```markdown
## Decision: [Title]
**Date:** [Date] | **Made by:** [Name(s)] | **Status:** Decided

### Context
[What prompted this decision — 2-3 sentences]

### Decision
[What was decided — be specific]

### Rationale
[Why this option over alternatives]

### Consequences
[What changes as a result — trade-offs acknowledged]
```

**New Database Entry:**
```
Title: [Entry name]
Status: [Match existing select options exactly]
Owner: [Name]
Date: [ISO date]
Tags: [Match existing multi-select values]
Notes: [Body content]
```

### Notion Formatting Rules

- Use `##` for top-level sections — Notion H1 is reserved for page title
- Use callout blocks for important warnings (`> ⚠️`) or tips (`> 💡`)
- Use tables for structured comparisons — keep under 6 columns
- Avoid bold for whole sentences — use for key terms only
- Match existing property names exactly (case-sensitive)

---

## Tool Reference

```
notion-fetch           — read a specific page or database
notion-search          — find pages by keyword
notion-query-data-sources — list available databases
notion-update-page     — post approved updates
notion-create-pages    — create new pages with full content
```

## Quality Checks

**Read mode:** Schema was read before querying. All records in scope included. Null values represented explicitly.
**Write mode:** Property values match existing select options exactly. No placeholder text like "[TBD]" unless intentional. All linked pages reference real pages.
