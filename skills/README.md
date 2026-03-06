# Skill Authoring Guide

This guide covers everything you need to know to create a skill for the TL Skills marketplace.

## File Structure

Each skill lives in its own folder under `skills/`:

```
skills/
  your-skill-name/
    SKILL.md              # Required — the main skill file
    references/           # Optional — supporting reference files
      REFERENCE-FILE.md
      ANOTHER-REF.md
```

The `SKILL.md` file is the only required file. The `references/` subdirectory is optional and should contain supporting material that the skill instructs the agent to read (token tables, templates, examples, etc.).

## Required Frontmatter

Every `SKILL.md` must begin with a YAML frontmatter block:

```yaml
---
name: your-skill-name
description: >
  Use when you need to... (describe the trigger condition and what the skill enables).
  Keep this under 1024 characters.
---
```

### Frontmatter rules

- `name`: Must match the folder name exactly. Letters, numbers, and hyphens only — no spaces, underscores, or special characters.
- `description`: Must start with "Use when..." to make the trigger condition explicit. Maximum 1024 characters. Write in plain, direct language.

## Naming Convention

Skill folder names follow an active-voice, verb-first pattern:

- `tl-branding` — noun-first for brand/identity skills (exception)
- `creating-skills` — verb-first for process skills
- `generating-reports` — verb-first for generation skills
- `reviewing-code` — verb-first for review skills

Use lowercase letters and hyphens only. No numbers at the start. Keep names short and descriptive — the name is the primary identifier in the CLI and marketplace.

## Content Guidelines

### Target length

Aim for 110-120 lines in `SKILL.md` — enough to be complete, not so long an agent skips reading it. Shorter is fine if the skill is simple. Skills that exceed 150 lines should be split or moved into `references/` files.

### Structure

A well-formed SKILL.md typically includes:

1. A mandatory workflow section — numbered steps the agent must follow in order
2. A quick reference section — tables or short lists the agent can scan at runtime
3. References to supporting files — explicit instructions on when to read each file in `references/`

### Writing style

- Write instructions in the imperative ("Read the example first", "Copy the logo SVG")
- Address the agent directly ("You MUST", "Before writing ANY code")
- Be explicit about what to do AND what not to do
- Include the reasoning for non-obvious rules

### Reference files

If your skill needs supporting material (token tables, HTML templates, data files), put them in `references/`. In your `SKILL.md`, tell the agent exactly which file to read and when:

```markdown
## Reference Files — When to Read Each

- **`references/TOKENS.md`** — Read when you need color values or typography specs.
- **`references/TEMPLATES.md`** — Read when starting any new artifact — it has copy-paste-ready boilerplates.
```

## Example Skill Structure

```
skills/
  tl-branding/
    SKILL.md
    references/
      BRAND-TOKENS.md
      HTML-TEMPLATES.md
      DATA-VIZ.md
```

## Submitting a Skill

1. Fork the repo and create a branch: `skill/your-skill-name`
2. Create `skills/your-skill-name/SKILL.md` following this guide
3. Add any reference files to `skills/your-skill-name/references/`
4. Open a PR with a short description of what the skill does and when to use it
5. The site auto-deploys on merge to main

## Validation Checklist

Before opening a PR, verify:

- [ ] Folder name uses letters, numbers, and hyphens only
- [ ] `SKILL.md` has valid YAML frontmatter with `name` and `description`
- [ ] `name` in frontmatter matches the folder name exactly
- [ ] `description` starts with "Use when..."
- [ ] `description` is under 1024 characters
- [ ] `SKILL.md` is roughly 110-120 lines (guideline — shorter is fine for simple skills)
- [ ] Any files referenced in `SKILL.md` exist in `references/`
