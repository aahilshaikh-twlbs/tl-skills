# TL Skills Marketplace Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a TwelveLabs-branded skills marketplace site (Next.js) + CLI tool (`npx tl-skills`) backed by markdown files in this repo.

**Architecture:** Skills live as `SKILL.md` files in `skills/`. A build-time script parses them into `skills-manifest.json`. The Next.js site reads that manifest for static generation. The CLI fetches the manifest at runtime from GitHub raw URLs to install skills into `~/.claude/skills/`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Bun, inline CSS (TL brand system), gray-matter (frontmatter parsing), commander (CLI), fs-extra (CLI file ops)

---

## Task 1: Initialize Repo Structure

**Files:**
- Create: `skills/README.md`
- Create: `skills/tl-branding/` (move existing SKILL.md from root)
- Create: `.gitignore`
- Create: `README.md`

**Step 1: Move the existing tl-branding skill into skills/**

```bash
mkdir -p skills
mv tl-branding skills/tl-branding
```

**Step 2: Verify the skills folder looks clean**

```bash
ls skills/tl-branding/
# Expected: SKILL.md (and any references/ folder if present)
```

**Step 3: Create root .gitignore**

```
node_modules/
.next/
dist/
.env
.env.local
*.log
.DS_Store
```

**Step 4: Create root README.md**

```markdown
# TL Skills

A curated marketplace of agent skills for TwelveLabs teams. Built on top of the open skills ecosystem.

## What's a skill?

A skill is a reusable markdown guide that extends an AI agent's capabilities. Skills live in `skills/` and follow the SKILL.md format.

## Install a skill

```bash
npx tl-skills add tl-branding
```

This copies the skill files into `~/.claude/skills/` where Claude Code can find them.

## Browse skills

Visit [tl-skills.vercel.app](https://tl-skills.vercel.app) to browse and discover skills.

## Add a skill

1. Create a folder under `skills/your-skill-name/`
2. Add a `SKILL.md` with frontmatter (`name`, `description`)
3. Add any supporting reference files
4. Open a PR — the site auto-deploys on merge

See `skills/README.md` for the full authoring guide.

## Development

See `app/README.md` for site setup and `cli/README.md` for CLI development.
```

**Step 5: Create skills/README.md (skill authoring guide)**

```markdown
# Skill Authoring Guide

Skills are markdown files that teach AI agents how to do specific things.

## File Structure

```
skills/
  your-skill-name/
    SKILL.md              # Required. Main skill content.
    references/           # Optional. Supporting files linked from SKILL.md.
      tokens.md
      examples/
        example.html
```

## SKILL.md Format

Every SKILL.md must start with YAML frontmatter:

```yaml
---
name: your-skill-name
description: >
  Use when [specific triggering condition]. Describes when an agent
  should load this skill — not what it does.
---

# Skill Title

## Overview
One paragraph explaining what this skill is and its core principle.

## When to Use
- Bullet list of situations where this applies
- Be specific about symptoms or contexts

## Core Pattern
The main technique, pattern, or reference content.

## Quick Reference
A table or bullets for scanning common operations.

## Common Mistakes
What goes wrong and how to fix it.
```

## Rules

- `name`: letters, numbers, hyphens only. No spaces.
- `description`: max 1024 characters total for frontmatter. Start with "Use when...".
- Target 110-120 lines of content.
- One excellent code example beats five mediocre ones.
- Supporting files go in subdirectories, linked from SKILL.md.

## Naming

Use active voice, verb-first: `creating-skills`, `debugging-memory-leaks`, `tl-branding`
```

**Step 6: Commit**

```bash
git add skills/ .gitignore README.md
git commit -m "chore: initialize repo structure with skills/ directory"
```

---

## Task 2: Manifest Generator Script

**Files:**
- Create: `scripts/generate-manifest.ts`
- Create: `scripts/package.json`
- Create: `skills-manifest.json` (generated output)

**Step 1: Install dependencies for scripts**

```bash
mkdir -p scripts
cd scripts && bun init -y && bun add gray-matter glob
```

**Step 2: Write the generate-manifest script**

Create `scripts/generate-manifest.ts`:

```typescript
import matter from 'gray-matter';
import { glob } from 'glob';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';

const SKILLS_DIR = join(__dirname, '..', 'skills');
const OUTPUT_PATH = join(__dirname, '..', 'skills-manifest.json');

interface SkillEntry {
  slug: string;
  name: string;
  description: string;
  files: string[];
  readmeExcerpt: string;
}

interface SkillManifest {
  generated: string;
  skills: SkillEntry[];
}

function getAllFiles(dir: string, base: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath, base));
    } else {
      files.push(relative(base, fullPath));
    }
  }
  return files;
}

function generateManifest(): void {
  const skillDirs = readdirSync(SKILLS_DIR).filter(name => {
    const fullPath = join(SKILLS_DIR, name);
    return statSync(fullPath).isDirectory();
  });

  const skills: SkillEntry[] = [];

  for (const slug of skillDirs) {
    const skillPath = join(SKILLS_DIR, slug);
    const skillMdPath = join(skillPath, 'SKILL.md');

    if (!existsSync(skillMdPath)) {
      console.warn(`Skipping ${slug}: no SKILL.md found`);
      continue;
    }

    const raw = readFileSync(skillMdPath, 'utf-8');
    const { data, content } = matter(raw);

    if (!data.name || !data.description) {
      console.warn(`Skipping ${slug}: missing name or description in frontmatter`);
      continue;
    }

    const files = getAllFiles(skillPath, SKILLS_DIR);
    const readmeExcerpt = content
      .replace(/^#+\s.+$/gm, '')   // strip headings
      .replace(/```[\s\S]*?```/g, '') // strip code blocks
      .trim()
      .slice(0, 200);

    skills.push({
      slug,
      name: data.name,
      description: typeof data.description === 'string'
        ? data.description.trim()
        : String(data.description).trim(),
      files,
      readmeExcerpt,
    });
  }

  const manifest: SkillManifest = {
    generated: new Date().toISOString(),
    skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest with ${skills.length} skills → skills-manifest.json`);
}

// Missing import fix
import { existsSync } from 'fs';

generateManifest();
```

**Step 3: Add generate script to root package.json**

Create root `package.json`:

```json
{
  "name": "tl-skills",
  "private": true,
  "scripts": {
    "generate": "bun run scripts/generate-manifest.ts",
    "dev": "cd app && bun run dev",
    "build": "bun run generate && cd app && bun run build"
  }
}
```

**Step 4: Run the generator and verify output**

```bash
bun run generate
```

Expected output:
```
Generated manifest with 1 skills → skills-manifest.json
```

Check `skills-manifest.json` — should contain the `tl-branding` entry with `name`, `description`, `files`, `readmeExcerpt`.

**Step 5: Commit**

```bash
git add scripts/ package.json skills-manifest.json
git commit -m "feat: add manifest generator script"
```

---

## Task 3: Scaffold Next.js App

**Files:**
- Create: `app/` (full Next.js project)

**Step 1: Create the Next.js app**

```bash
cd /Users/aahil/Documents/Code/tl-skills
bunx create-next-app@latest app --typescript --no-tailwind --no-eslint --app --src-dir --import-alias "@/*" --use-bun
```

When prompted:
- TypeScript: Yes
- ESLint: No (keep build clean for now)
- Tailwind: No (we use TL brand CSS)
- App Router: Yes
- src/ directory: Yes

**Step 2: Clean out boilerplate**

```bash
rm app/src/app/page.tsx app/src/app/globals.css app/public/next.svg app/public/vercel.svg
```

**Step 3: Update app/next.config.ts to allow reading the manifest**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',        // static export for Vercel
  trailingSlash: true,
};

export default nextConfig;
```

**Step 4: Create brand token CSS file**

Create `app/src/app/globals.css`:

```css
@font-face {
  font-family: 'Milling';
  font-style: normal;
  font-weight: 400;
  src: url('https://d2n8i6crd2t3p1.cloudfront.net/font/milling/205TF-Milling-Duplex1mm.woff2') format('woff2');
}
@font-face {
  font-family: 'Milling';
  font-style: normal;
  font-weight: 700;
  src: url('https://d2n8i6crd2t3p1.cloudfront.net/font/milling/205TF-Milling-Triplex1mm.woff2') format('woff2');
}

*, *::before, *::after { box-sizing: border-box; }
h1, h2, h3, h4, h5, h6, p, ul, ol, li, figure, blockquote, hr { margin: 0; padding: 0; }
table, td, th { margin: 0; padding: 0; border-collapse: collapse; }
img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }

:root {
  --chalk: #F4F3F3;
  --fog: #ECECEC;
  --charcoal: #1D1C1B;
  --ash: #8F8984;
  --smoke: #D3D1CF;
  --green: #60E21B;
  --green-light: #BFF3A4;
  --gradient: linear-gradient(90deg, #60E21B 0%, #FABA17 32.5%, #FFB592 69%, #FFB0CD 100%);
}

body {
  background: var(--chalk);
  color: var(--charcoal);
  font-family: 'Milling', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}
```

**Step 5: Update app/src/app/layout.tsx**

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TL Skills',
  description: 'A curated marketplace of agent skills for TwelveLabs teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Noto+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Step 6: Create the manifest lib**

Create `app/src/lib/manifest.ts`:

```typescript
import manifestData from '../../../skills-manifest.json';

export interface SkillEntry {
  slug: string;
  name: string;
  description: string;
  files: string[];
  readmeExcerpt: string;
}

export interface SkillManifest {
  generated: string;
  skills: SkillEntry[];
}

export function getManifest(): SkillManifest {
  return manifestData as SkillManifest;
}

export function getSkill(slug: string): SkillEntry | undefined {
  return manifestData.skills.find((s: SkillEntry) => s.slug === slug);
}
```

Update `app/tsconfig.json` to resolve the manifest JSON:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    ...existing options
  }
}
```

**Step 7: Verify the app builds**

```bash
cd app && bun run build
```

Expected: Successful build with no errors.

**Step 8: Commit**

```bash
git add app/
git commit -m "feat: scaffold Next.js app with TL brand tokens"
```

---

## Task 4: Logo SVG Component

**Files:**
- Create: `app/src/components/Logo.tsx`

**Step 1: Read the logo SVG from the skill reference**

Open `~/.claude/skills/tl-branding/references/BRAND-TOKENS.md` and copy the Full Lockup SVG verbatim. Do NOT retype path data.

**Step 2: Create the Logo component**

Create `app/src/components/Logo.tsx`:

```typescript
interface LogoProps {
  width?: number;
  color?: string;
}

export function Logo({ width = 160, color = '#1D1C1B' }: LogoProps) {
  return (
    <div style={{ color, width }}>
      {/* PASTE THE EXACT LOGO SVG FROM ~/.claude/skills/tl-branding/references/BRAND-TOKENS.md HERE */}
      {/* SVG must use currentColor, set width to "100%" */}
    </div>
  );
}
```

After pasting the SVG, set `width="100%"` and `fill="currentColor"` (or verify it already uses currentColor).

**Step 3: Commit**

```bash
git add app/src/components/Logo.tsx
git commit -m "feat: add TL logo component"
```

---

## Task 5: Homepage

**Files:**
- Create: `app/src/app/page.tsx`
- Create: `app/src/components/SkillCard.tsx`
- Create: `app/src/components/SearchBar.tsx`

**Step 1: Create SkillCard component**

Create `app/src/components/SkillCard.tsx`:

```typescript
'use client';
import Link from 'next/link';
import { SkillEntry } from '@/lib/manifest';

interface SkillCardProps {
  skill: SkillEntry;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link href={`/skills/${skill.slug}`}>
      <div style={{
        background: '#ECECEC',
        borderRadius: 24,
        padding: 24,
        cursor: 'pointer',
        transition: 'background 0.15s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#E2E2E2')}
      onMouseLeave={e => (e.currentTarget.style.background = '#ECECEC')}
      >
        {/* Category pill */}
        <div style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          background: '#BFF3A4',
          color: '#1D1C1B',
          borderRadius: 999,
          padding: '3px 10px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          SKILL
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Milling', 'Noto Sans', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#1D1C1B',
        }}>
          {skill.name}
        </div>

        {/* Description */}
        <div style={{
          fontFamily: "'Milling', 'Noto Sans', sans-serif",
          fontSize: 14,
          color: '#8F8984',
          lineHeight: 1.5,
          flex: 1,
        }}>
          {skill.description.length > 120
            ? skill.description.slice(0, 120) + '...'
            : skill.description}
        </div>

        {/* Install command */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: '#45423F',
          background: '#F4F3F3',
          borderRadius: 8,
          padding: '6px 10px',
          marginTop: 'auto',
        }}>
          npx tl-skills add {skill.slug}
        </div>

        {/* File count */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: '#8F8984',
        }}>
          {skill.files.length} file{skill.files.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
}
```

**Step 2: Create SearchBar component**

Create `app/src/components/SearchBar.tsx`:

```typescript
'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search skills..."
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        maxWidth: 480,
        padding: '12px 20px',
        fontSize: 16,
        fontFamily: "'Milling', 'Noto Sans', sans-serif",
        color: '#1D1C1B',
        background: '#FFFFFF',
        border: 'none',
        borderRadius: 12,
        outline: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    />
  );
}
```

**Step 3: Create the homepage**

Create `app/src/app/page.tsx`:

```typescript
'use client';
import { useState } from 'react';
import { getManifest } from '@/lib/manifest';
import { SkillCard } from '@/components/SkillCard';
import { SearchBar } from '@/components/SearchBar';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  const { skills } = getManifest();
  const [query, setQuery] = useState('');

  const filtered = skills.filter(s =>
    query === '' ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F4F3F3' }}>
      {/* Hero header */}
      <div style={{
        position: 'relative',
        background: '#1D1C1B',
        borderRadius: 24,
        margin: '24px 24px 0',
        padding: '48px 48px 52px',
        overflow: 'hidden',
      }}>
        <Logo width={160} color="#F4F3F3" />
        <div style={{ marginTop: 32 }}>
          <h1 style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 48,
            fontWeight: 400,
            color: '#F4F3F3',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}>
            Skills Marketplace
          </h1>
          <p style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 20,
            color: '#9B9895',
            marginTop: 12,
          }}>
            Curated agent skills for TwelveLabs teams.
          </p>
        </div>
        {/* Masterbrand gradient accent bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #60E21B 0%, #FABA17 32.5%, #FFB592 69%, #FFB0CD 100%)',
          borderRadius: '0 0 24px 24px',
        }} />
      </div>

      {/* Search + stats bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 24px 16px',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <SearchBar value={query} onChange={setQuery} />
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: '#8F8984',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          whiteSpace: 'nowrap',
        }}>
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Skills grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
        padding: '0 24px 48px',
      }}>
        {filtered.map(skill => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '64px 0',
            color: '#8F8984',
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
          }}>
            No skills match "{query}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px dashed #D3D1CF',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: '#8F8984',
        }}>
          TwelveLabs Internal
        </span>
        <a
          href="https://github.com/twelvelabs/tl-skills"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: '#8F8984',
          }}
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
```

**Step 4: Run dev server and verify visually**

```bash
cd app && bun run dev
```

Open `http://localhost:3000`. Verify:
- Dark hero with TL logo and gradient bottom bar
- Search bar works (type to filter)
- Skill cards show tl-branding skill
- Card links are clickable (will 404 until next task)

**Step 5: Commit**

```bash
git add app/src/
git commit -m "feat: add homepage with hero, search, and skill cards"
```

---

## Task 6: Skill Detail Page

**Files:**
- Create: `app/src/app/skills/[slug]/page.tsx`
- Create: `app/src/components/FileTree.tsx`
- Create: `app/src/components/CopyButton.tsx`

**Step 1: Install react-markdown for rendering SKILL.md content**

```bash
cd app && bun add react-markdown
```

**Step 2: Update manifest to include raw SKILL.md content**

Update `scripts/generate-manifest.ts` — add `content` field to `SkillEntry`:

```typescript
// In the skills loop, add:
skills.push({
  slug,
  name: data.name,
  description: ...,
  files,
  readmeExcerpt,
  content,            // full markdown body after frontmatter
});
```

Update `SkillEntry` interface in both the script and `app/src/lib/manifest.ts`:
```typescript
interface SkillEntry {
  // ...existing fields
  content: string;   // full SKILL.md body
}
```

Regenerate:
```bash
bun run generate
```

**Step 3: Create CopyButton component**

Create `app/src/components/CopyButton.tsx`:

```typescript
'use client';
import { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? '#BFF3A4' : '#1D1C1B',
        color: copied ? '#30710E' : '#F4F3F3',
        border: 'none',
        borderRadius: 10,
        padding: '8px 18px',
        fontFamily: "'Milling', 'Noto Sans', sans-serif",
        fontSize: 14,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

**Step 4: Create FileTree component**

Create `app/src/components/FileTree.tsx`:

```typescript
interface FileTreeProps {
  files: string[];
  slug: string;
}

export function FileTree({ files, slug }: FileTreeProps) {
  return (
    <div style={{
      background: '#F4F3F3',
      borderRadius: 12,
      padding: 16,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13,
      color: '#45423F',
      lineHeight: 1.8,
    }}>
      {files.map(f => (
        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#D3D1CF' }}>—</span>
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}
```

**Step 5: Create skill detail page**

Create `app/src/app/skills/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getManifest, getSkill } from '@/lib/manifest';
import { CopyButton } from '@/components/CopyButton';
import { FileTree } from '@/components/FileTree';
import { Logo } from '@/components/Logo';

export function generateStaticParams() {
  const { skills } = getManifest();
  return skills.map(s => ({ slug: s.slug }));
}

interface PageProps {
  params: { slug: string };
}

export default function SkillDetailPage({ params }: PageProps) {
  const skill = getSkill(params.slug);
  if (!skill) notFound();

  const installCmd = `npx tl-skills add ${skill.slug}`;

  return (
    <div style={{ minHeight: '100vh', background: '#F4F3F3' }}>
      {/* Nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
      }}>
        <Logo width={120} color="#1D1C1B" />
        <Link href="/" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          color: '#8F8984',
        }}>
          ← All Skills
        </Link>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px 64px' }}>
        {/* Header card */}
        <div style={{
          background: '#ECECEC',
          borderRadius: 24,
          padding: 32,
          marginBottom: 24,
        }}>
          <div style={{
            display: 'inline-flex',
            background: '#BFF3A4',
            color: '#1D1C1B',
            borderRadius: 999,
            padding: '3px 10px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            textTransform: 'uppercase' as const,
            letterSpacing: '1px',
            marginBottom: 16,
          }}>
            SKILL
          </div>
          <h1 style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 36,
            fontWeight: 400,
            color: '#1D1C1B',
            marginBottom: 12,
          }}>
            {skill.name}
          </h1>
          <p style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 16,
            color: '#8F8984',
            lineHeight: 1.5,
          }}>
            {skill.description}
          </p>
        </div>

        {/* Install command */}
        <div style={{
          background: '#ECECEC',
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap' as const,
        }}>
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: '#8F8984',
              textTransform: 'uppercase' as const,
              letterSpacing: '2px',
              marginBottom: 8,
            }}>
              INSTALL
            </div>
            <code style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 15,
              color: '#1D1C1B',
            }}>
              {installCmd}
            </code>
          </div>
          <CopyButton text={installCmd} />
        </div>

        {/* Files */}
        <div style={{
          background: '#ECECEC',
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: '#8F8984',
            textTransform: 'uppercase' as const,
            letterSpacing: '2px',
            marginBottom: 12,
          }}>
            INCLUDED FILES — {skill.files.length}
          </div>
          <FileTree files={skill.files} slug={skill.slug} />
        </div>

        {/* Skill content */}
        <div style={{
          background: '#ECECEC',
          borderRadius: 24,
          padding: 32,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: '#8F8984',
            textTransform: 'uppercase' as const,
            letterSpacing: '2px',
            marginBottom: 24,
          }}>
            SKILL CONTENT
          </div>
          <div className="skill-content">
            <ReactMarkdown>{skill.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Add skill content prose styles to globals.css**

Append to `app/src/app/globals.css`:

```css
/* Skill content prose */
.skill-content h1, .skill-content h2, .skill-content h3 {
  font-family: 'Milling', 'Noto Sans', sans-serif;
  font-weight: 400;
  color: #1D1C1B;
  margin-top: 24px;
  margin-bottom: 12px;
}
.skill-content h2 { font-size: 24px; }
.skill-content h3 { font-size: 20px; }
.skill-content p {
  font-family: 'Milling', 'Noto Sans', sans-serif;
  font-size: 16px;
  color: #1D1C1B;
  line-height: 1.6;
  margin-bottom: 12px;
}
.skill-content code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  background: #F4F3F3;
  padding: 2px 6px;
  border-radius: 4px;
}
.skill-content pre {
  background: #F4F3F3;
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}
.skill-content pre code {
  background: none;
  padding: 0;
}
.skill-content ul { list-style: none; padding: 0; margin-bottom: 12px; }
.skill-content ul li {
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
  font-family: 'Milling', 'Noto Sans', sans-serif;
  font-size: 16px;
  color: #1D1C1B;
}
.skill-content ul li::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #60E21B;
  border-radius: 50%;
  margin-top: 7px;
  flex-shrink: 0;
}
.skill-content table {
  width: 100%;
  margin: 16px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
}
.skill-content th {
  text-align: left;
  padding: 8px 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #8F8984;
  border-bottom: 2px solid #1D1C1B;
}
.skill-content td {
  padding: 8px 12px;
  border-bottom: 1px solid #E2E2E2;
  color: #1D1C1B;
}
```

**Step 7: Build and verify detail page works**

```bash
cd app && bun run build
```

Navigate to `http://localhost:3000/skills/tl-branding`. Verify:
- Header card with name, description, pill
- Install command with copy button
- File tree
- Rendered SKILL.md content with green bullets, code blocks

**Step 8: Commit**

```bash
git add app/src/ skills-manifest.json scripts/
git commit -m "feat: add skill detail page with markdown rendering"
```

---

## Task 7: CLI Package

**Files:**
- Create: `cli/package.json`
- Create: `cli/src/index.ts`
- Create: `cli/README.md`

**Step 1: Initialize CLI package**

```bash
mkdir -p cli/src
```

Create `cli/package.json`:

```json
{
  "name": "tl-skills",
  "version": "0.1.0",
  "description": "CLI for the TwelveLabs skills marketplace",
  "bin": {
    "tl-skills": "./dist/index.js"
  },
  "scripts": {
    "build": "bun build src/index.ts --outfile dist/index.js --target node",
    "dev": "bun run src/index.ts"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "fs-extra": "^11.0.0",
    "node-fetch": "^3.0.0"
  },
  "devDependencies": {
    "@types/fs-extra": "^11.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Step 2: Install CLI dependencies**

```bash
cd cli && bun install
```

**Step 3: Create CLI entry point**

Create `cli/src/index.ts`:

```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import fetch from 'node-fetch';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

const MANIFEST_URL =
  'https://raw.githubusercontent.com/twelvelabs/tl-skills/main/skills-manifest.json';
const RAW_BASE =
  'https://raw.githubusercontent.com/twelvelabs/tl-skills/main/skills';

interface SkillEntry {
  slug: string;
  name: string;
  description: string;
  files: string[];
  readmeExcerpt: string;
}

interface Manifest {
  generated: string;
  skills: SkillEntry[];
}

async function fetchManifest(): Promise<Manifest> {
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.statusText}`);
  return res.json() as Promise<Manifest>;
}

function getSkillsDir(): string {
  return path.join(os.homedir(), '.claude', 'skills');
}

const program = new Command();

program
  .name('tl-skills')
  .description('TwelveLabs skills marketplace CLI')
  .version('0.1.0');

program
  .command('find [query]')
  .description('Search skills by name or description')
  .action(async (query: string = '') => {
    const manifest = await fetchManifest();
    const results = manifest.skills.filter(s =>
      query === '' ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
    );
    if (results.length === 0) {
      console.log(`No skills found matching "${query}"`);
      return;
    }
    for (const skill of results) {
      console.log(`\n${skill.name} (${skill.slug})`);
      console.log(`  ${skill.description.slice(0, 100)}...`);
      console.log(`  Install: npx tl-skills add ${skill.slug}`);
    }
  });

program
  .command('add <skill-name>')
  .description('Download a skill to ~/.claude/skills/')
  .action(async (skillName: string) => {
    const manifest = await fetchManifest();
    const skill = manifest.skills.find(s => s.slug === skillName);
    if (!skill) {
      console.error(`Skill "${skillName}" not found. Run "npx tl-skills find" to browse.`);
      process.exit(1);
    }

    const destDir = path.join(getSkillsDir(), skill.slug);
    await fs.ensureDir(destDir);

    for (const file of skill.files) {
      const url = `${RAW_BASE}/${skill.slug}/${file}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`  Warning: could not fetch ${file}`);
        continue;
      }
      const content = await res.text();
      const destPath = path.join(destDir, file);
      await fs.ensureDir(path.dirname(destPath));
      await fs.writeFile(destPath, content);
      console.log(`  + ${file}`);
    }

    console.log(`\nInstalled "${skill.name}" to ${destDir}`);
  });

program
  .command('list')
  .description('Show all locally installed tl skills')
  .action(() => {
    const skillsDir = getSkillsDir();
    if (!fs.existsSync(skillsDir)) {
      console.log('No skills installed yet. Run "npx tl-skills add <skill>" to get started.');
      return;
    }
    const installed = fs.readdirSync(skillsDir).filter(name => {
      const p = path.join(skillsDir, name);
      return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
    });
    if (installed.length === 0) {
      console.log('No skills installed yet.');
      return;
    }
    console.log(`Installed skills (${skillsDir}):`);
    for (const name of installed) {
      console.log(`  - ${name}`);
    }
  });

program
  .command('update [skill-name]')
  .description('Update one or all installed skills')
  .action(async (skillName?: string) => {
    const skillsDir = getSkillsDir();
    const manifest = await fetchManifest();

    const toUpdate = skillName
      ? [skillName]
      : fs.readdirSync(skillsDir).filter(name => {
          const p = path.join(skillsDir, name);
          return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
        });

    for (const slug of toUpdate) {
      const skill = manifest.skills.find(s => s.slug === slug);
      if (!skill) {
        console.warn(`  Skipping ${slug}: not found in marketplace`);
        continue;
      }
      console.log(`Updating ${slug}...`);
      // Re-add overwrites existing files
      for (const file of skill.files) {
        const url = `${RAW_BASE}/${skill.slug}/${file}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const content = await res.text();
        const destPath = path.join(skillsDir, slug, file);
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, content);
        console.log(`  ~ ${file}`);
      }
    }
    console.log('Update complete.');
  });

program
  .command('info <skill-name>')
  .description('Show skill details without installing')
  .action(async (skillName: string) => {
    const manifest = await fetchManifest();
    const skill = manifest.skills.find(s => s.slug === skillName);
    if (!skill) {
      console.error(`Skill "${skillName}" not found.`);
      process.exit(1);
    }
    console.log(`\nName:        ${skill.name}`);
    console.log(`Slug:        ${skill.slug}`);
    console.log(`Description: ${skill.description}`);
    console.log(`Files:       ${skill.files.length}`);
    console.log(`\nFiles included:`);
    for (const f of skill.files) {
      console.log(`  - ${f}`);
    }
    console.log(`\nInstall with: npx tl-skills add ${skill.slug}`);
  });

program.parse();
```

**Step 4: Test CLI locally**

```bash
cd cli && bun run dev -- find
# Expected: lists all skills from manifest (fetches from GitHub)
# If GitHub not set up yet, test with local manifest:
```

For local testing before GitHub is set up, temporarily point MANIFEST_URL to a local file path or test with `bun run dev -- --help`.

**Step 5: Create cli/README.md**

```markdown
# tl-skills CLI

Install and manage TwelveLabs agent skills from the command line.

## Usage

```bash
# No install needed — run directly
npx tl-skills find                    # list all skills
npx tl-skills find branding           # search by keyword
npx tl-skills add tl-branding         # install a skill
npx tl-skills list                    # show installed skills
npx tl-skills update                  # update all installed skills
npx tl-skills update tl-branding      # update one skill
npx tl-skills info tl-branding        # show details without installing
```

## How it works

Skills are downloaded from the `skills/` directory of the `twelvelabs/tl-skills` GitHub repo and copied to `~/.claude/skills/`, where Claude Code automatically discovers them.

## Development

```bash
cd cli
bun install
bun run dev -- find          # run locally
bun run build                # build to dist/
```

## Publishing

Not yet published to npm. To use before publishing:
```bash
bun run build
node dist/index.js find
```
```

**Step 6: Commit**

```bash
git add cli/
git commit -m "feat: add tl-skills CLI with find/add/list/update/info commands"
```

---

## Task 8: Vercel Config + App README

**Files:**
- Create: `vercel.json`
- Create: `app/README.md`

**Step 1: Create vercel.json**

```json
{
  "buildCommand": "bun run generate && cd app && bun run build",
  "outputDirectory": "app/out",
  "installCommand": "bun install && cd app && bun install && cd ../scripts && bun install"
}
```

**Step 2: Update app/next.config.ts to ensure static export output dir**

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
};
```

**Step 3: Create app/README.md**

```markdown
# TL Skills — Web App

The Next.js site for the TL Skills marketplace. Statically generated, deployed on Vercel.

## Local Development

Prerequisites: Bun installed (`curl -fsSL https://bun.sh/install | bash`)

```bash
# From repo root — generate the manifest first
bun run generate

# Then start the dev server
cd app && bun run dev
```

Open http://localhost:3000.

## Adding a Skill

Skills are in `../skills/`. To add one:
1. Create `skills/your-skill-name/SKILL.md`
2. Run `bun run generate` from repo root
3. The site picks it up automatically

## Build

```bash
# From repo root
bun run build
```

This runs `generate` then `next build`. Output goes to `app/out/`.

## Deployment

Connected to Vercel. Every push to `main` triggers a new deploy.
Vercel runs: `bun run generate && cd app && bun run build`

## Tech

- Next.js 14 (App Router, static export)
- TypeScript
- Bun
- TL brand system (inline CSS, Milling font via CDN)
- No Tailwind, no CSS framework
```

**Step 4: Final build verification**

```bash
# From repo root
bun run build
```

Expected:
- `skills-manifest.json` regenerated
- `app/out/` contains static HTML for `/` and `/skills/tl-branding/`
- No TypeScript errors

**Step 5: Commit**

```bash
git add vercel.json app/README.md app/next.config.ts
git commit -m "feat: add Vercel config and app README"
```

---

## Task 9: Documentation Polish

**Files:**
- Update: `README.md` (ensure accurate)
- Update: `skills/README.md` (ensure accurate)

**Step 1: Read the current README.md and verify all commands still work**

Check that `npx tl-skills add tl-branding` command in README matches actual CLI output.

**Step 2: Final commit**

```bash
git add .
git commit -m "docs: finalize README and skills authoring guide"
```

---

## Verification Checklist

Before calling this complete:

- [ ] `bun run generate` creates valid `skills-manifest.json`
- [ ] `cd app && bun run dev` serves the homepage with TL branding
- [ ] Skill cards display correctly (name, description, pill, install cmd)
- [ ] Search filters cards as you type
- [ ] `/skills/tl-branding` renders with content, copy button, file tree
- [ ] `cd app && bun run build` succeeds with no TS errors
- [ ] `cd cli && bun run dev -- --help` shows all commands
- [ ] All READMEs exist and are accurate
