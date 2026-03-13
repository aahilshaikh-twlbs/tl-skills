---
name: tech-feasibility
description: >
  Use when assessing the technical feasibility of a proposed feature, system,
  integration, or project — evaluating complexity, risks, dependencies, effort,
  and alternatives. Triggers on "can we build X", "is this technically
  feasible", pre-scoping analysis, build vs. buy evaluation, spike planning,
  or architecture decision records (ADR) that need a feasibility basis.
tags: [engineering, architecture, planning, research]
name_ko: 기술 타당성 검토
description_ko: >
  제안된 기능, 시스템, 통합 또는 프로젝트의 기술적 타당성을 평가할 때 활용 —
  복잡성, 리스크, 종속성, 노력, 대안을 평가합니다. 아키텍처 결정 기록(ADR)의
  기반이 되는 분석을 제공합니다.
updated: 2026-03-12
---

# Tech Feasibility

Give a clear, honest answer to "can we build this?" before committing resources. Surface the real risks, constraints, and effort — not the best-case scenario.

## Workflow

1. Understand the proposal: what is being asked for, for whom, and by when
2. Identify the key technical questions that must be answered to assess feasibility
3. Research constraints: existing system capabilities, API limits, data availability, infra costs
4. Assess alternatives: build, buy, integrate, or defer
5. Produce the feasibility report with a clear recommendation

## Feasibility Dimensions

Evaluate across these dimensions for every assessment:

| Dimension | Key Questions |
|-----------|--------------|
| **Technical complexity** | How hard is the core engineering problem? Novel or solved? |
| **Integration risk** | What systems must be touched? How stable are their interfaces? |
| **Data feasibility** | Is the required data available, in the right shape, and accessible? |
| **Performance / scale** | Can it meet latency, throughput, and reliability requirements? |
| **Dependency risk** | Does it rely on third parties, external APIs, or other teams' timelines? |
| **Effort estimate** | Rough range: days / weeks / months — with confidence level |
| **Maintenance burden** | What does ongoing ownership look like once shipped? |

## Feasibility Output Template

```markdown
# Tech Feasibility Assessment: [Feature/System Name]
**Date:** [Date]
**Assessed by:** [Name]
**Verdict:** ✅ Feasible / ⚠️ Feasible with caveats / 🔴 Not recommended

## What Was Assessed
[1-2 sentence description of the proposal in technical terms]

## Verdict Summary
[3-5 sentences: the bottom line, the biggest risk, and what makes or breaks it]

## Dimension Analysis

### Technical Complexity
[Assessment and evidence]

### Integration Risk
[What needs to be touched; known fragile points]

### Data Feasibility
[What data is needed; gaps or quality issues]

### Performance / Scale
[Known constraints; estimated load vs. capacity]

### Dependencies
[External or internal; how controllable they are]

## Effort Estimate
- **Optimistic:** [Low-end — everything goes right]
- **Realistic:** [Most likely — accounts for known issues]
- **Pessimistic:** [High-end — major blockers materialize]
- **Confidence:** Low / Medium / High

## Alternatives Considered
| Option | Pros | Cons | Recommendation |
|--------|------|------|---------------|
| Build | | | |
| Buy / Vendor | | | |
| Integrate existing | | | |
| Defer | | | |

## Risks and Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk] | High/Med/Low | High/Med/Low | [How to reduce it] |

## Recommended Next Step
[Single action that would reduce the biggest uncertainty: spike, prototype, vendor call, etc.]
```

## Verdict Criteria

**✅ Feasible:** Core technical approach is understood, dependencies are manageable, effort is within team capacity
**⚠️ Feasible with caveats:** Technically doable but with meaningful risks that must be explicitly accepted
**🔴 Not recommended:** Fundamental blocker exists (missing data, API limitations, prohibitive cost, unacceptable dependency) — do not proceed without resolving it first

## Spike Planning

When the feasibility verdict requires a spike:
- Define the spike question precisely: "Can we achieve X with approach Y in environment Z?"
- Time-box it: 1-3 days for most spikes — if it takes longer, the scope is too broad
- Define the done condition: what result makes the spike complete?
- Document the spike outcome as an addendum to this assessment

## Quality Checks

Before delivering:
- Verdict is explicit — no "it depends" as a final answer
- Effort estimate has a range and a confidence level (not a single number)
- Alternatives were genuinely considered, not listed to justify a predetermined choice
- Biggest risk is identified and has a mitigation strategy (even if imperfect)
