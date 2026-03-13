export interface SkillFormData {
  submitterName: string;
  submitterEmail: string;
  submitterGithub: string;
  slug: string;
  description: string; // "Use when..." trigger
  overview: string;    // free-form: what it does, how it works, example output
  tags: string[];
}

export function assembleSkillMd(data: SkillFormData): string {
  const today = new Date().toISOString().slice(0, 10);
  const tagsList = data.tags.length > 0 ? `[${data.tags.join(', ')}]` : '[]';
  const displayName = data.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return `---
name: ${data.slug}
description: >
  ${data.description}
tags: ${tagsList}
updated: ${today}
---

# ${displayName}

${data.overview.trim()}
`;
}

export function assemblePrBody(data: SkillFormData, skillMdContent: string): string {
  const githubHandle = data.submitterGithub ? ` (@${data.submitterGithub})` : '';

  return `## New Skill Submission

**Skill:** \`${data.slug}\`
**Submitted by:** ${data.submitterName}${githubHandle}
**Email:** ${data.submitterEmail}
**Tags:** ${data.tags.join(', ') || 'none'}

### Trigger condition
${data.description}

### Overview
${data.overview}

---

### SKILL.md
\`\`\`markdown
${skillMdContent}
\`\`\`

---
*Submitted via the TwelveLabs Skills Marketplace. Please review and structure before merging.*
`;
}
