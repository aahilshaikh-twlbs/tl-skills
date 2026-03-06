---
name: meeting-synthesizer
description: >
  Transform meeting notes, transcripts, or recordings into actionable summaries
  with decisions, action items, and follow-ups. Use when processing any meeting
  content from Zoom, Google Meet, Granola, Avoma, or raw notes. Triggers on
  meeting summary requests, transcript processing, action item extraction, meeting
  minutes creation, decision documentation, or post-meeting documentation tasks.
  Integrates with Notion for output and Google Drive for source materials.
---

# Meeting Synthesizer

Transform raw meeting content into structured, actionable documentation. Extract decisions, action items, key discussion points, and follow-up questions from any meeting format.

## Workflow

1. Identify meeting source and format (transcript, notes, recording summary)
2. Extract core meeting metadata (date, attendees, purpose)
3. Analyze content for decisions, actions, and key points
4. Generate structured summary in requested output format
5. Deliver to specified destination (Notion, Google Drive, or direct output)

## Input Sources

**Zoom**: Cloud recordings with transcripts, chat logs, AI Companion summaries
**Google Meet**: Transcripts from Meet, attached recordings, chat exports
**Granola**: AI-generated meeting notes and summaries
**Avoma**: AI-generated notes, transcripts, talk-time analytics, topic segments, and CRM-synced summaries
**Raw notes**: Unstructured notes, bullet points, or freeform text
**Audio/video files**: Transcribe first, then process

## Output Template

Generate meeting summaries using this structure:

```markdown
# [Meeting Title]
**Date:** [Date]
**Attendees:** [Names]
**Duration:** [Length]
**Meeting Type:** [Standup | 1:1 | Planning | Review | External | Other]

## TL;DR
[2-3 sentence executive summary of what happened and why it matters]

## Decisions Made
- **[Decision 1]**: [Brief context and rationale]
- **[Decision 2]**: [Brief context and rationale]

## Action Items
| Owner | Action | Due Date | Priority |
|-------|--------|----------|----------|
| @Name | [Specific task] | [Date] | High/Med/Low |

## Key Discussion Points
### [Topic 1]
[Summary of discussion, different viewpoints, conclusions reached]

### [Topic 2]
[Summary of discussion, different viewpoints, conclusions reached]

## Open Questions / Follow-ups
- [ ] [Question requiring resolution]
- [ ] [Topic deferred to future discussion]

## Next Steps
[What happens after this meeting, next meeting scheduled, etc.]
```

## Processing Guidelines

**Action item extraction:**
- Identify explicit commitments ("I'll do X", "Can you handle Y")
- Capture implicit ownership from discussion context
- Flag items without clear owners for follow-up
- Infer deadlines from context or mark as TBD

**Decision identification:**
- Look for consensus statements ("We agreed", "Let's go with")
- Note dissenting opinions if significant
- Capture rationale when provided
- Flag decisions needing formal approval

**Priority assignment:**
- High: Blocking other work, external deadlines, exec visibility
- Medium: Important but not urgent, internal deadlines
- Low: Nice-to-have, exploratory, no fixed timeline

## Platform Integration

### Notion Output
When outputting to Notion:
- Use database properties for action items (Owner, Due Date, Status, Priority)
- Link to relevant Notion pages for context
- Use toggles for detailed discussion sections
- Tag attendees using @mentions

### Google Drive Integration
When sourcing from or outputting to Drive:
- Support Docs, Sheets, and transcript files
- Maintain folder organization by project/date
- Link back to source recordings when available

### Granola Processing
Granola provides pre-structured AI notes. When processing:
- Preserve Granola's timestamp markers for reference
- Enhance with explicit action item formatting
- Add owner assignments if Granola missed them
- Cross-reference with calendar for attendee list

### Avoma Processing
Avoma provides transcripts, AI notes, and conversation intelligence. When processing:
- Leverage Avoma's topic segmentation for discussion point organization
- Use talk-time analytics to identify key speakers and decision-makers
- Preserve Avoma's action items but reformat to standard template
- Pull CRM context (deal stage, account info) when available for customer calls
- Cross-reference Avoma's "Next Steps" with extracted action items for completeness

## Meeting Type Adaptations

**Standup/Daily sync**: Focus on blockers, brief updates, skip detailed discussion
**1:1s**: Emphasize personal action items, career topics, feedback given/received
**Planning sessions**: Detailed scope decisions, resource assignments, timeline commitments
**Customer/External**: Capture customer quotes verbatim, track commitments made to external parties
**All-hands/Town halls**: Key announcements, Q&A highlights, policy changes

## Quality Checks

Before finalizing:
- Every action item has an owner
- Decisions are clearly stated (not buried in discussion)
- No dangling references ("as discussed" without context)
- Attendee names spelled correctly
- Dates are specific (not "next week")

## Examples

**Input (raw notes):**
```
sync with eng team
- talked about the api redesign, maya said she can start next sprint
- need to decide on auth approach - went with oauth2
- james concerned about timeline but we'll see
- should probably loop in security team
```

**Output:**
```markdown
# Engineering Sync
**Date:** [Today]
**Attendees:** Maya, James, [Author]
**Meeting Type:** Planning

## TL;DR
Aligned on API redesign timeline and authentication approach. Maya to lead implementation starting next sprint using OAuth2.

## Decisions Made
- **Authentication approach**: OAuth2 selected for API redesign

## Action Items
| Owner | Action | Due Date | Priority |
|-------|--------|----------|----------|
| Maya | Begin API redesign implementation | Next sprint start | High |
| TBD | Loop in security team for OAuth2 review | TBD | Medium |

## Key Discussion Points
### API Redesign Timeline
Maya confirmed capacity to start next sprint. James raised timeline concerns—team acknowledged risk but proceeding with current plan.

### Authentication Approach
Team evaluated options and selected OAuth2 for the redesign.

## Open Questions / Follow-ups
- [ ] Address James's timeline concerns—what's driving the risk?
- [ ] Identify owner for security team coordination
```

Always prioritize actionability—every summary should answer "what do I need to do next?" for each attendee.
