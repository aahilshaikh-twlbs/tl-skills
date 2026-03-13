export interface SkillFormData {
  // Step 1 — submitter
  submitterName: string;
  submitterEmail: string;
  submitterGithub: string;

  // Step 2 — identity
  slug: string;
  description: string;
  tags: string[];
  nameKo: string;
  descriptionKo: string;

  // Step 3 — content
  workflowSteps: string[];
  outputTemplate: string;
  qualityChecks: string[];
}

export function assembleSkillMd(data: SkillFormData): string {
  const today = new Date().toISOString().slice(0, 10);

  const displayName = data.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const tagsList = data.tags.length > 0
    ? `[${data.tags.join(', ')}]`
    : '[]';

  const koLines = data.nameKo
    ? `name_ko: ${data.nameKo}\ndescription_ko: >\n  ${data.descriptionKo || data.description}\n`
    : '';

  const workflowLines = data.workflowSteps
    .filter(s => s.trim())
    .map((s, i) => `${i + 1}. ${s.trim()}`)
    .join('\n');

  const qualityLines = data.qualityChecks
    .filter(c => c.trim())
    .map(c => `- ${c.trim()}`)
    .join('\n');

  // Tagline: first sentence of description (stripped of "Use when" prefix for body)
  const tagline = data.description.replace(/^Use when /i, 'Use this skill to ').split('.')[0].trim() + '.';

  return `---
name: ${data.slug}
description: >
  ${data.description}
tags: ${tagsList}
${koLines}updated: ${today}
---

# ${displayName}

${tagline}

## Workflow

${workflowLines}

## Output Template

\`\`\`markdown
${data.outputTemplate.trim()}
\`\`\`

## Quality Checks

Before delivering:
${qualityLines}
`;
}

export function assemblePrBody(data: SkillFormData, skillMdContent: string): string {
  const githubHandle = data.submitterGithub
    ? ` (@${data.submitterGithub})`
    : '';

  return `## New Skill Submission

**Skill:** \`${data.slug}\`
**Submitted by:** ${data.submitterName}${githubHandle}
**Email:** ${data.submitterEmail}
**Tags:** ${data.tags.join(', ') || 'none'}

### Description
${data.description}

---

### SKILL.md Preview

\`\`\`markdown
${skillMdContent}
\`\`\`

---

*Submitted via the TwelveLabs Skills Marketplace. Review against the [skill authoring guide](../../skills/README.md) before merging.*
`;
}
