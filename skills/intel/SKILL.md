---
name: intel
description: >
  Use when researching and compiling intelligence on a person or a piece of
  content (paper, article, report, video). Person mode: builds profiles for
  pre-meeting briefings, candidate research, stakeholder mapping, or
  relationship strategy. Content mode: extracts key claims, findings, and
  implications from research papers, whitepapers, or technical reports.
  Triggers on "tell me about [person]", "summarize this paper", pre-meeting
  person research, candidate background prep, or competitive technical analysis.
tags: [research, intelligence, people, analysis]
name_ko: 인텔
description_ko: >
  인물 또는 콘텐츠(논문, 기사, 보고서)에 대한 인텔리전스를 조사하고 정리하는
  통합 스킬. 인물 모드: 회의 전 브리핑, 후보자 조사, 이해관계자 매핑.
  콘텐츠 모드: 연구 논문, 백서, 기술 보고서에서 핵심 주장과 시사점 추출.
updated: 2026-03-13
---

# Intel

Research and synthesize intelligence on a person or a piece of content. Identify the mode first.

## Mode Selection

**Ask the user (or infer):**
- **Person mode** — building a profile of an individual
- **Paper / content mode** — extracting intelligence from a document, paper, or report

---

## Person Mode

Build an accurate, actionable profile before a meeting, hiring decision, or relationship strategy.

### Person Workflow

1. Identify the person and purpose: why is this profile needed and what decisions will it inform
2. Collect available information from approved sources
3. Organize by the most relevant dimensions for the use case
4. Surface key insights, connection points, and gaps
5. Deliver the briefing in the appropriate format

### Approved Sources

**Public:** LinkedIn, GitHub, published articles/talks/papers, company website, professional social media
**Internal:** Granola/Avoma transcripts, Notion pages, shared Slack channels, email threads, prior interview notes (if authorized)

**NEVER infer or fabricate.** Note gaps explicitly.

### Person Profile Template

```markdown
# Person Brief: [Full Name]
**Purpose:** [Meeting / Hiring / Partnership / etc.] | **Date:** [Date]

## At a Glance
- **Current role:** [Title @ Company]
- **Background:** [1-2 sentence career arc]
- **How we know them:** [Candidate / partner / customer / colleague]

## Professional Background
[3-5 bullets: career highlights, notable projects, accomplishments]

## Expertise Areas
- [Domain — evidence for this claim]

## Relevant Context for This Meeting / Decision
[What specifically matters for the purpose of this profile]

## Potential Connection Points
- [Shared experience, interest, or contact]

## Watch Points
[Optional: known preferences or communication style to navigate]

## Sources
- [Source 1 — URL or description]
```

### Use Case Adaptations

**Pre-meeting:** Focus on "Relevant Context" and "Connection Points" — keep to one page
**Candidate review:** Add skills evidence and culture signals
**Customer/partner:** Add company context, relationship history, current priorities

### Privacy Standards

- Public or internally authorized info only — no private account access
- No personal health, family, or financial information
- Treat sensitive data (comp, performance) as need-to-know
- When in doubt, leave it out

---

## Paper / Content Mode

Extract the signal from a document without reading everything. Identify what's novel, what's proven, and what it means for your work.

### Content Workflow

1. Identify the document(s) and extraction goal: summary, specific answer, or comparison
2. Read abstract/intro/conclusion first — assess relevance before deep reading
3. Extract key claims, methods, results, and limitations
4. Assess credibility: is the evidence sufficient for the claims?
5. Synthesize into the appropriate output format

### Reading Strategy by Goal

**Quick relevance check:** Abstract + conclusion only
**Claim extraction:** Abstract + results section
**Method understanding:** Introduction + methodology
**Full synthesis:** All sections with notes per section
**Comparison:** Abstract + results from each document — then compare

### Content Intel Template

```markdown
# Content Intel: [Title]
**Authors / Source:** [Names / Publication]
**Published:** [Year / Date] | **Type:** [Paper / Whitepaper / Report / Article]
**Relevance:** High / Medium / Low — [Why]

## Core Claim
[The single most important argument or finding — 1-2 sentences]

## Key Findings
- [Finding + supporting evidence: metric, experiment, or data]

## Methodology
[How they demonstrated the claim — experiment design, data, evaluation]

## Limitations / Caveats
- [What the authors acknowledge]
- [What a skeptic would challenge]

## Novelty
[What's genuinely new vs. incremental vs. repackaging prior work]

## Implications for Our Work
- [How this changes or validates our approach]

## Quotes Worth Preserving
> "[Verbatim quote]" (p. [N] or timestamp)
```

### Multi-Document Comparison

```markdown
## Comparison Matrix
| Document | Core Claim | Method | Key Result | Limitations |
|----------|-----------|--------|------------|-------------|
| [A] | | | | |
| [B] | | | | |

## Consensus
[What most sources agree on]

## Contested Claims
[Where sources disagree — and which has stronger evidence]
```

### Credibility Assessment

- **Venue:** Top-tier conference/journal vs. preprint vs. blog
- **Evaluation:** Standard benchmarks? Fair baselines?
- **Reproducibility:** Code or data released?

---

## Quality Checks

**Person mode:** Every claim has a source. Gaps are noted, not silently omitted. Profile fits the stated use case.
**Content mode:** Core claim is the actual thesis, not a peripheral finding. Implications connect to the user's specific context.
