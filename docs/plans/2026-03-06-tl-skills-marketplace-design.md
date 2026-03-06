# TL Skills Marketplace — Design Document

**Date:** 2026-03-06
**Status:** Approved

---

## Overview

Build a TwelveLabs-branded skills marketplace — a discovery site + CLI tool for curated agent skills. Modeled on skills.sh and anthropics/skills. Hosted on Vercel, source in this repo.

---

## Repo Structure

```
tl-skills/
├── skills/                        ← ONLY skill content (SKILL.md + supporting files)
│   └── tl-branding/
│       ├── SKILL.md
│       └── references/
│
├── skills-manifest.json           ← auto-generated from skills/, committed to repo
│
├── app/                           ← Next.js 14 site (isolated from skills/)
│   ├── src/
│   │   ├── app/                   ← App Router pages
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
├── cli/                           ← npx tl-skills CLI package (isolated)
│   ├── src/
│   │   └── index.ts
│   └── package.json
│
├── scripts/
│   └── generate-manifest.ts       ← reads skills/, writes skills-manifest.json
│
├── docs/
│   └── plans/
├── README.md
└── bun.lockb
```

**Key constraint:** `skills/` is pure content — no framework files, no build artifacts, no config. It can be used standalone by any agent without the site being present.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Package manager | Bun | Fast, modern, consistent with team preference |
| Site framework | Next.js 14 (App Router) | Static generation, Vercel-native |
| Language | TypeScript | Type safety across site + CLI |
| Styling | TL brand system (tl-branding skill) | On-brand, CDN fonts, no Tailwind |
| Hosting | Vercel | Zero-config Next.js deploys |
| CLI runtime | Node.js (npx-compatible) | Universal, no install required |

---

## Site Pages

### `/` — Marketplace Homepage
- Dark hero card with TL logo + masterbrand gradient accent bar
- Search bar (client-side filtering by name/description)
- Skill cards grid — each card shows: name, description, category pill, install command
- No auth, no server

### `/skills/[slug]` — Skill Detail Page
- Full rendered SKILL.md content
- File tree of included files (from manifest)
- One-click copy install command: `npx tl-skills add <slug>`
- Back navigation

### Static Generation
- `generateStaticParams` reads `skills-manifest.json` at build time
- All pages pre-rendered — zero server needed
- Vercel build command: `bun run generate && bun run build`

---

## CLI Commands

```bash
npx tl-skills find [query]        # search skills by name or description
npx tl-skills add <skill-name>    # download skill files to ~/.claude/skills/
npx tl-skills list                # show all locally installed tl skills
npx tl-skills update [skill-name] # update one or all installed skills
npx tl-skills info <skill-name>   # show skill details without installing
```

- `add` fetches raw files from GitHub and copies them to `~/.claude/skills/<skill-name>/`
- All commands fetch manifest from: `https://raw.githubusercontent.com/twelvelabs/tl-skills/main/skills-manifest.json`
- Hardcoded repo URL, no config file needed

---

## Data Flow

```
skills/*/SKILL.md
      |
      v
scripts/generate-manifest.ts
      |  reads frontmatter (name, description) + file tree
      v
skills-manifest.json  <- committed to repo
      |
  .---+---.
  v       v
app/    cli/
(build  (fetches from raw.githubusercontent.com at runtime)
 time)
```

### Manifest Schema

```typescript
interface SkillManifest {
  generated: string;           // ISO timestamp
  skills: SkillEntry[];
}

interface SkillEntry {
  slug: string;                // folder name, e.g. "tl-branding"
  name: string;                // from SKILL.md frontmatter
  description: string;         // from SKILL.md frontmatter
  files: string[];             // relative paths of all files in skill folder
  readmeExcerpt: string;       // first 200 chars of SKILL.md body
}
```

---

## Branding

The site follows the tl-branding skill exactly:
- Background: `#F4F3F3` (Chalk)
- Cards: `#ECECEC` (Fog), `border-radius: 24px`
- Accent: `#60E21B` (Lima Green)
- Font: Milling (CDN), IBM Plex Mono for code/tags
- Hero: dark card `#1D1C1B` with masterbrand gradient bottom bar
- Pill tags: `#BFF3A4` background, uppercase, IBM Plex Mono

---

## Documentation Plan

- `README.md` — project overview, how to add a skill, CLI usage
- `skills/README.md` — skill authoring guide (format, frontmatter, file rules)
- `app/README.md` — local dev setup, Vercel deployment
- `cli/README.md` — CLI usage and publishing
- Inline TSDoc comments on all exported functions

---

## Out of Scope (this iteration)

- Database / CMS
- Auth / private skills
- Skill ratings or comments
- npm publish for CLI (just npx from source for now)
- CI/CD beyond Vercel auto-deploy
