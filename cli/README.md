# tl-skills CLI

Install and manage TwelveLabs agent skills from the command line.

## Usage

No install needed — run directly with npx:

```bash
npx tl-skills find                     # list all skills
npx tl-skills find branding            # search by keyword
npx tl-skills add tl-branding          # install a skill
npx tl-skills list                     # show installed skills
npx tl-skills update                   # update all installed skills
npx tl-skills update tl-branding       # update one skill
npx tl-skills info tl-branding         # show details without installing
```

## How it works

Skills are downloaded from the `skills/` directory in this GitHub repo and copied to `~/.claude/skills/`, where Claude Code automatically discovers them.

## Development

```bash
cd cli
bun install
bun run dev -- find          # run locally
bun run build                # build to dist/
```

## Publishing

Not yet published to npm. To use before publishing, build and run directly:
```bash
bun run build
node dist/index.js find
```
