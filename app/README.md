# TL Skills — Web App

The Next.js site for the TL Skills marketplace. Statically generated, deployed on Vercel.

## Local Development

Prerequisites: [Bun](https://bun.sh) installed.

```bash
# From repo root — generate the manifest first
bun run generate

# Start the dev server
cd app && bun run dev
```

Open http://localhost:3000.

## Adding a Skill

Skills live in `../skills/`. To add one:

1. Create `skills/your-skill-name/SKILL.md`
2. Run `bun run generate` from repo root
3. The site picks it up automatically on next build

## Build

```bash
# From repo root
bun run build
```

This runs `generate` then `next build`. Output goes to `app/out/`.

## Deployment

Connected to Vercel. Every push to `main` triggers a new deploy automatically.

Build command: `bun run generate && cd app && bun run build`
Output directory: `app/out`

## Tech

- Next.js 15+ (App Router, static export)
- TypeScript, strict mode
- Bun package manager
- TL brand system (inline CSS, Milling font via CDN)
- No Tailwind, no CSS framework
