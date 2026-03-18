export interface SkillFormData {
  submitterName: string;
  submitterEmail: string;
  submitterGithub: string;
  slug: string;
  description: string; // "Use when..." — both the trigger and the skill body
  tags: string[];
}

export function assembleSkillMd(data: SkillFormData): string {
  const today = new Date().toISOString().slice(0, 10);
  const tagsList = data.tags.length > 0 ? `[${data.tags.join(', ')}]` : '[]';
  const displayName = data.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Build a structured scaffold from the submission — reviewer fills in the gaps
  return `---
name: ${data.slug}
description: >
  ${data.description}
tags: ${tagsList}
updated: ${today}
---

# ${displayName}

${data.description.trim()}

## When to Use
<!-- Reviewer: expand into 2–4 specific trigger scenarios -->
- ${data.description.trim()}

## Workflow

<!-- Reviewer: break this into numbered steps Claude should follow -->
1. Identify the context and confirm the user's goal
2. Gather any required inputs (files, links, prior context)
3. Execute the core task
4. Deliver output in the format most useful to the user

## Output Template

\`\`\`markdown
<!-- Reviewer: replace with a realistic filled-in example of what this skill produces -->
# ${displayName} Output

[Output goes here]
\`\`\`

## Adaptations

<!-- Reviewer: add variations for different tools, contexts, or user types -->
- **Default**: ${data.description.trim()}

## Tips
- Be specific in your prompt to get better output
<!-- Reviewer: add skill-specific tips and common mistakes to avoid -->
`;
}

export function assemblePrBody(data: SkillFormData, skillMdContent: string): string {
  const githubHandle = data.submitterGithub ? ` (@${data.submitterGithub})` : '';

  return `## New Skill Submission

**Skill:** \`${data.slug}\`
**Submitted by:** ${data.submitterName}${githubHandle}
**Email:** ${data.submitterEmail}
**Tags:** ${data.tags.join(', ') || 'none'}

### Description
${data.description}

---

### SKILL.md (scaffold — reviewer should flesh out before merging)
\`\`\`markdown
${skillMdContent}
\`\`\`

---
*Submitted via the TwelveLabs Skills Marketplace. Please review and structure before merging.*
`;
}
