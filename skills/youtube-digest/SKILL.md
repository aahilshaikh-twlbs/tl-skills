---
name: youtube-digest
description: >
  Use when creating a digest, summary, or analysis from YouTube video content —
  extracting key points from talks, tutorials, demos, interviews, or podcast
  episodes. Triggers on "summarize this video", "what did [speaker] say about
  X", conference talk digests, learning notes from a tutorial, or competitive
  analysis of a product demo. Works from transcripts, provided summaries, or
  described content.
tags: [research, learning, content]
name_ko: 유튜브 다이제스트
description_ko: >
  YouTube 영상 콘텐츠에서 다이제스트, 요약, 분석을 만들 때 활용 — 강연,
  튜토리얼, 데모, 인터뷰, 팟캐스트 에피소드에서 핵심 내용 추출.
  스크립트, 제공된 요약, 또는 설명된 콘텐츠로 작업합니다.
updated: 2026-03-12
---

# YouTube Digest

Turn video content into a text-based record that's scannable, searchable, and shareable. Extract what matters — key arguments, demonstrations, quotes, and implications — without requiring everyone to watch the video.

## Workflow

1. Identify the video: URL, title, speaker, and duration
2. Obtain content: auto-generated transcript, provided summary, or described content
3. Identify the video type and apply the appropriate extraction lens
4. Extract key points, quotes, timestamps, and implications
5. Format as a digest appropriate for the use case and audience

## Video Type Lenses

| Type | What to Extract | What to Skip |
|------|----------------|--------------|
| **Conference talk** | Core argument, novel claims, demo highlights, Q&A insights | Speaker intros, housekeeping |
| **Technical tutorial** | Step-by-step summary, commands/code used, gotchas | Slow setup, repeated explanations |
| **Product demo** | Feature showcased, UX decisions, positioning claims | Marketing language, filler |
| **Interview / podcast** | Key opinions, memorable quotes, guest's position on topics | Social filler, tangents |
| **Research presentation** | Thesis, methodology, results, implications | Literature review background |
| **Panel discussion** | Each speaker's position on key questions, points of agreement/disagreement | Moderator logistics |

## Digest Output Template

```markdown
# YouTube Digest: [Video Title]
**Speaker(s):** [Names and affiliations]
**Published:** [Date]
**Duration:** [Length]
**URL:** [Link]
**Digest created:** [Date]

## TL;DR
[2-3 sentences: the core message and why it matters]

## Key Points
1. **[Point]** [MM:SS] — [Explanation or evidence given]
2. **[Point]** [MM:SS] — [Explanation or evidence given]
3. **[Point]** [MM:SS] — [Explanation or evidence given]

## Notable Quotes
> "[Verbatim quote]" — [Speaker] [MM:SS]

## Demo / Technical Highlights
[If applicable: what was shown, specific tools or techniques demonstrated]

## Implications for Our Work
- [How this is relevant to our team, product, or decisions]

## Follow-up Resources
- [Resources mentioned in the video worth checking out]
```

## Timestamp Conventions

Include timestamps `[MM:SS]` for any claim that:
- Is specific, quantitative, or potentially controversial
- A colleague might want to verify or share independently
- Represents a shift in argument or a key demonstration moment

Skip timestamps for general context that spans the whole video.

## Competitive Intelligence Mode

When digesting a competitor's demo or product announcement:
- Document every feature shown (not just highlighted ones)
- Note UX decisions and interaction patterns
- Record any performance or benchmark claims verbatim
- Flag anything that overlaps with or differs from our product
- Note the positioning language used — framing choices reveal strategy

## Learning Notes Mode

When digesting a tutorial or educational content:
- Structure as a step-by-step guide the viewer could follow without the video
- Extract exact commands, code snippets, or configuration values
- Note prerequisites and dependencies
- Flag areas where the video disagrees with current documentation

## Quality Checks

Before delivering:
- TL;DR is self-contained — useful without reading the rest
- Key points are in the speaker's voice (what they claimed), not editorialized
- Timestamps are included for all specific claims
- "Implications" section connects to something real in the user's context
- Quotes are verbatim — paraphrases are clearly marked as such
