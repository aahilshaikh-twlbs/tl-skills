# TL Skills

A curated marketplace of agent skills for TwelveLabs teams. Built on top of the open skills ecosystem.

## What's a skill?

A skill is a reusable markdown guide that extends an AI agent's capabilities. Skills live in `skills/` and follow the SKILL.md format.

## Install a skill

Run: npx tl-skills add tl-branding

This copies the skill files into ~/.claude/skills/ where Claude Code can find them.

## Browse skills

Visit https://tl-skills.vercel.app to browse and discover skills.

## Add a skill

1. Create a folder under skills/your-skill-name/
2. Add a SKILL.md with frontmatter (name, description)
3. Add any supporting reference files
4. Open a PR — the site auto-deploys on merge

See skills/README.md for the full authoring guide.

## Development

See `app/README.md` for site setup and `cli/README.md` for CLI development.
