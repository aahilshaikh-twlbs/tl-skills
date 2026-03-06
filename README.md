# TL Skills

Curated agent skills for TwelveLabs teams. Browse, install, and contribute.

**Site:** https://tl-skills.vercel.app · **Repo:** https://github.com/aahilshaikh-twlbs/tl-skills

---

## Quick Start

```bash
# Install a skill into Claude Code
npx tl-skills add tl-branding

# List all available skills
npx tl-skills list

# Find skills by keyword
npx tl-skills find "marketing"
```

Skills are installed to `~/.claude/skills/` and picked up automatically by Claude Code.

---

## Repo Layout

```
tl-skills/
├── skills/               ← Skill content (add new skills here)
│   ├── README.md         ← Authoring guide
│   ├── tl-branding/
│   │   ├── SKILL.md
│   │   └── references/
│   └── …
├── app/                  ← Next.js marketplace site (Vercel)
│   └── README.md         ← Site dev guide
├── cli/                  ← npx tl-skills CLI
│   └── README.md         ← CLI dev guide
├── scripts/
│   └── generate-manifest.ts  ← Builds skills-manifest.json
├── skills-manifest.json  ← Generated index (committed, used by CLI)
└── package.json          ← Root scripts: generate, build
```

---

## Adding a Skill

1. Create `skills/your-skill-name/SKILL.md` — see [`skills/README.md`](skills/README.md) for the full authoring guide
2. Run `bun run generate` from repo root to update the manifest
3. Open a PR — the site auto-deploys on merge

**Frontmatter required:**
```yaml
---
name: your-skill-name
description: >
  Use when... (trigger conditions)
tags: [category, another-category]
updated: YYYY-MM-DD
---
```

---

## Development

**Prerequisites:** [Bun](https://bun.sh)

```bash
# Generate manifest + start site
bun run generate
cd app && bun run dev

# Regenerate manifest only
bun run generate

# Full production build
bun run build
```

See [`app/README.md`](app/README.md) and [`cli/README.md`](cli/README.md) for per-package details.

---

## Available Tags

| Tag | Skills |
|-----|--------|
| `brand` | tl-branding, tl-copywriting |
| `design` | tl-branding |
| `html` | tl-branding |
| `marketing` | tl-copywriting |
| `writing` | tl-copywriting, technical-writer |
| `sales` | tl-sales-engineer |
| `tl-internal` | tl-sales-engineer |
| `productivity` | meeting-synthesizer, project-manager |
| `meetings` | meeting-synthesizer |
| `documentation` | technical-writer |
| `management` | project-manager |
