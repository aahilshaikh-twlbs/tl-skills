import { NextRequest, NextResponse } from 'next/server';
import type { SkillFormData } from '@/lib/skillAssembler';
import { assembleSkillMd, assemblePrBody } from '@/lib/skillAssembler';

// ── GitHub helper ──────────────────────────────────────────────────────────────

async function gh(path: string, pat: string, options?: RequestInit) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'tl-skills-marketplace',
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

// ── Claude skill generator ─────────────────────────────────────────────────────

async function generateSkillMd(data: SkillFormData): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[submit] ANTHROPIC_API_KEY not set — using template fallback');
    return assembleSkillMd(data);
  }

  const today = new Date().toISOString().slice(0, 10);
  const displayName = data.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const tagsList = data.tags.length > 0 ? `[${data.tags.join(', ')}]` : '[]';

  const prompt = `You are a TwelveLabs AI Skills architect. Generate a complete, production-quality SKILL.md for a Claude Code skill based on this community submission.

Skill slug: ${data.slug}
Display name: ${displayName}
Submitted description: "${data.description}"
Tags: ${data.tags.join(', ') || 'none'}

A SKILL.md is loaded into Claude Code as a system prompt. It must be detailed enough that Claude can execute the workflow without asking basic questions.

Output ONLY the SKILL.md file content — no preamble, no explanation, no markdown fences around the whole thing.

The file must follow this exact structure:

---
name: ${data.slug}
description: >
  [Polished "Use when..." sentence(s) that precisely describe when this skill activates. Be specific about triggers.]
tags: ${tagsList}
updated: ${today}
---

# ${displayName}

[1-2 sentence summary of what this skill does and the value it delivers.]

## When to Use
- [Specific trigger scenario 1]
- [Specific trigger scenario 2]
- [Specific trigger scenario 3]

## Workflow

[Number the steps. Be concrete — each step should tell Claude exactly what to do, what to ask, or what to produce. Include sub-steps where helpful. 4-8 steps total.]

## Output Template

\`\`\`markdown
[A realistic, filled-in example of what the final output looks like. Use placeholder values in brackets.]
\`\`\`

## Adaptations

[2-4 bullet points or sub-sections for different variants of this skill — different contexts, tools, or user types it should handle differently.]

## Tips
- [Practical tip for best results]
- [Edge case or common mistake to avoid]`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    console.error('[submit] Claude API error:', await res.text());
    return assembleSkillMd(data);
  }

  const json = await res.json();
  return (json.content?.[0]?.text ?? '').trim() || assembleSkillMd(data);
}

// ── PR body ────────────────────────────────────────────────────────────────────

function buildPrBody(data: SkillFormData, generatedSkillMd: string): string {
  const githubHandle = data.submitterGithub ? ` (@${data.submitterGithub})` : '';
  return `## New Skill Submission

**Skill:** \`${data.slug}\`
**Submitted by:** ${data.submitterName}${githubHandle}
**Email:** ${data.submitterEmail}
**Tags:** ${data.tags.join(', ') || 'none'}

### Original description
> ${data.description}

---

### Generated SKILL.md

\`\`\`markdown
${generatedSkillMd}
\`\`\`

---
*Submitted via the TwelveLabs Skills Marketplace — AI-generated from the community submission above. Review before merging.*`;
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const OWNER = process.env.GITHUB_REPO_OWNER;
    const REPO = process.env.GITHUB_REPO_NAME;
    const PAT = process.env.GITHUB_PAT;

    if (!OWNER || !REPO || !PAT) {
      throw new Error('GitHub integration is not configured (missing env vars)');
    }

    const data: SkillFormData = await req.json();

    if (!data.slug || !data.description || !data.submitterName || !data.submitterEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate rich skill content via Claude (falls back to template if no API key)
    const skillMd = await generateSkillMd(data);
    const prBody = buildPrBody(data, skillMd);
    const branchName = `skill-submission/${data.slug}-${Date.now()}`;
    const filePath = `skills/${data.slug}/SKILL.md`;

    // 1. Get latest main SHA
    const ref = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/main`, PAT);
    const sha: string = ref.object.sha;

    // 2. Create branch
    await gh(`/repos/${OWNER}/${REPO}/git/refs`, PAT, {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha }),
    });

    // 3. Create SKILL.md on branch (in-memory only — never written to disk)
    const content = Buffer.from(skillMd, 'utf-8').toString('base64');
    await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}`, PAT, {
      method: 'PUT',
      body: JSON.stringify({
        message: `feat: add ${data.slug} skill (community submission)`,
        content,
        branch: branchName,
      }),
    });

    // 4. Open PR
    const pr = await gh(`/repos/${OWNER}/${REPO}/pulls`, PAT, {
      method: 'POST',
      body: JSON.stringify({
        title: `feat: add \`${data.slug}\` skill`,
        head: branchName,
        base: 'main',
        body: prBody,
      }),
    });

    return NextResponse.json({ prUrl: pr.html_url, prNumber: pr.number });
  } catch (err) {
    console.error('[submit]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Submission failed' },
      { status: 500 }
    );
  }
}
