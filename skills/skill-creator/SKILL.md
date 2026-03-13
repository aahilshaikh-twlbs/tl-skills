---
name: skill-creator
description: >
  Use when a user wants to create and submit a new skill to the TwelveLabs
  skill marketplace. Guides the user through defining the skill's name,
  trigger conditions, workflow, and output templates — then formats a complete
  SKILL.md following TwelveLabs' structure and submits it as a skill request
  to the repo managers for review. Triggers on "create a skill", "add a skill",
  "I want to build a skill", or "submit a skill".
tags: [meta, skills, productivity]
name_ko: 스킬 생성
description_ko: >
  사용자가 TwelveLabs 스킬 마켓플레이스에 새 스킬을 만들고 제출하려 할 때
  활용합니다. 스킬 이름, 트리거 조건, 워크플로, 출력 템플릿 정의를 안내하고,
  TwelveLabs 구조에 맞는 완전한 SKILL.md를 포맷하여 검토를 위해 제출합니다.
updated: 2026-03-13
---

# Skill Creator

Guide the user through creating a well-formed TwelveLabs skill and submit it for review. Follow the structure exactly — skills that don't match the format will be rejected.

## Workflow

1. **Prompt** — ask the user the required questions (see Prompting section)
2. **Draft** — generate a complete SKILL.md using the TwelveLabs skill template
3. **Review** — show the draft to the user and iterate until they approve
4. **Submit** — format the submission and send to repo managers for review

---

## Step 1 — Prompt the User

Ask these questions in order. Do not proceed to drafting until all are answered:

```
1. What should this skill be named?
   (lowercase, hyphens only — e.g., "meeting", "inbox-scan", "tech-feasibility")

2. What is the trigger condition?
   Complete this sentence: "Use when..."
   (This becomes the skill description — be specific about what user action or context activates it)

3. What does the skill do, step by step?
   (List 4–6 numbered workflow steps the agent will follow)

4. What does the output look like?
   (Describe or paste a template — tables, markdown blocks, structured lists)

5. Are there any rules, constraints, or quality checks the agent must follow?

6. Which tags apply?
   (Choose from: productivity, communication, meetings, slack, notion, research,
   reporting, analytics, engineering, documentation, planning, hiring, brand, intelligence)

7. Should this skill have a Korean translation?
   (If yes, provide name_ko and a brief description_ko, or ask to auto-translate)
```

---

## Step 2 — Draft SKILL.md

Generate a complete SKILL.md using this exact structure:

```markdown
---
name: [skill-name]
description: >
  Use when [trigger condition — specific, starts with "Use when"].
  Triggers on [list of specific phrases or contexts that activate it].
  [Max 1024 characters total]
tags: [[tag1], [tag2]]
name_ko: [Korean name]
description_ko: >
  [Korean description — 2-3 sentences]
updated: [today's date YYYY-MM-DD]
---

# [Skill Title]

[One-sentence purpose statement — what the skill enables and why it matters]

## Workflow

1. [Step — imperative, specific]
2. [Step]
3. [Step]
4. [Step]
5. [Step — deliver or post output]

## [Core Reference Section]
[Tables, rules, or decision logic the agent needs at runtime]

## Output Template

\`\`\`markdown
[Exact output structure — headers, tables, fields]
\`\`\`

## [Additional Sections as needed]
[Adaptations, platform routing, tool reference, etc.]

## Quality Checks

Before delivering:
- [Specific, testable check]
- [Specific, testable check]
- [Specific, testable check]
```

### Skill Authoring Rules to Enforce

- `name` must match folder name exactly: lowercase, hyphens only, no spaces
- `description` MUST start with "Use when" — reject any that don't
- Target **110–120 lines** — complete but not bloated. Trim if over 150.
- Every section uses imperative language ("Read the file", "Ask the user", "Extract")
- Output templates must be concrete — no abstract placeholders like "[insert content]"
- Quality checks must be testable — not "ensure quality" but "every action item has an owner"
- If the skill needs supporting reference files, note them in a `## Reference Files` section

---

## Step 3 — Review Loop

After drafting:
1. Show the full SKILL.md to the user
2. Ask: "Does this look right? Any sections to adjust?"
3. Iterate until the user confirms it's ready
4. Run the validation checklist before submitting

### Validation Checklist

- [ ] `name` uses lowercase letters and hyphens only
- [ ] `name` in frontmatter matches the intended folder name
- [ ] `description` starts with "Use when..."
- [ ] `description` is under 1024 characters
- [ ] SKILL.md is 110–120 lines (warn if over 150)
- [ ] Workflow has 4–6 numbered steps
- [ ] At least one output template or reference table is present
- [ ] Quality checks section has 3+ specific, testable items
- [ ] All referenced files (if any) are listed in a Reference Files section

---

## Step 4 — Submit for Review

Format the submission and send to TwelveLabs repo managers:

### Submission Package

```
Skill name:        [name]
Submitted by:      [user name or email]
Date:              [date]
Description:       [one-line summary of what it does]
Tags:              [tag list]
Status:            Pending review

[Full SKILL.md content]
```

### Submission Routing

- **Repo managers** receive the submission and review against the skill authoring guide
- The submission appears in the **Skill Requests** view (requires manager login)
- Managers can: Approve → merge to main, Request changes → return to submitter, or Reject with reason
- Submitter is notified of the decision via email or Slack

> **Note for implementation:** Skill submission requires the frontend form flow (authenticated user context) and the manager review queue. See the platform engineering team for the submission API endpoint and auth requirements.

---

## Quality Checks

Before submitting:
- Validation checklist above is fully checked
- Skill does not duplicate an existing skill — check the marketplace first
- Workflow steps are specific enough that an agent could follow them without clarification
- Output template would produce something useful on the first attempt
