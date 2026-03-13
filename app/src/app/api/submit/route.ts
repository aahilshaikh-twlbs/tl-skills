import { NextRequest, NextResponse } from 'next/server';
import type { SkillFormData } from '@/lib/skillAssembler';
import { assembleSkillMd, assemblePrBody } from '@/lib/skillAssembler';

const OWNER = process.env.GITHUB_REPO_OWNER!;
const REPO = process.env.GITHUB_REPO_NAME!;
const PAT = process.env.GITHUB_PAT!;

const GH_HEADERS = {
  Authorization: `Bearer ${PAT}`,
  'Content-Type': 'application/json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'tl-skills-marketplace',
};

async function gh(path: string, options?: RequestInit) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: { ...GH_HEADERS, ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const data: SkillFormData = await req.json();

    // Basic server-side guard
    if (!data.slug || !data.description || !data.submitterName || !data.submitterEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const skillMd = assembleSkillMd(data);
    const prBody = assemblePrBody(data, skillMd);
    const branchName = `skill-submission/${data.slug}-${Date.now()}`;
    const filePath = `skills/${data.slug}/SKILL.md`;

    // 1. Get latest main SHA
    const ref = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
    const sha: string = ref.object.sha;

    // 2. Create branch
    await gh(`/repos/${OWNER}/${REPO}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha }),
    });

    // 3. Create SKILL.md file on branch
    const content = Buffer.from(skillMd, 'utf-8').toString('base64');
    await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `feat: add ${data.slug} skill (community submission)`,
        content,
        branch: branchName,
      }),
    });

    // 4. Open PR
    const pr = await gh(`/repos/${OWNER}/${REPO}/pulls`, {
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
