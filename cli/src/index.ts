#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

const MANIFEST_URL =
  'https://raw.githubusercontent.com/aahilshaikh-twlbs/tl-skills/main/skills-manifest.json';
const RAW_BASE =
  'https://raw.githubusercontent.com/aahilshaikh-twlbs/tl-skills/main/skills';

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
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status} ${res.statusText}`);
  return res.json() as Promise<Manifest>;
}

function getSkillsDir(): string {
  return join(homedir(), '.claude', 'skills');
}

function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

const program = new Command();

program
  .name('tl-skills')
  .description('TwelveLabs skills marketplace CLI')
  .version('0.1.0');

// find [query]
program
  .command('find [query]')
  .description('Search skills by name or description')
  .action(async (query: string = '') => {
    try {
      const manifest = await fetchManifest();
      const results = manifest.skills.filter(s =>
        query === '' ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
      );
      if (results.length === 0) {
        console.log(query ? `No skills found matching "${query}"` : 'No skills available.');
        return;
      }
      console.log(`\nFound ${results.length} skill${results.length !== 1 ? 's' : ''}:\n`);
      for (const skill of results) {
        const excerpt = skill.description.length > 100
          ? skill.description.slice(0, 100) + '...'
          : skill.description;
        console.log(`  ${skill.name} (${skill.slug})`);
        console.log(`  ${excerpt}`);
        console.log(`  Install: npx tl-skills add ${skill.slug}\n`);
      }
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

// add <skill-name>
program
  .command('add <skill-name>')
  .description('Download a skill to ~/.claude/skills/')
  .action(async (skillName: string) => {
    try {
      const manifest = await fetchManifest();
      const skill = manifest.skills.find(s => s.slug === skillName);
      if (!skill) {
        console.error(`Skill "${skillName}" not found. Run "npx tl-skills find" to browse.`);
        process.exit(1);
      }

      const skillsDir = getSkillsDir();
      const destDir = join(skillsDir, skill.slug);
      ensureDir(destDir);

      console.log(`Installing ${skill.name}...\n`);

      for (const file of skill.files) {
        const url = `${RAW_BASE}/${skill.slug}/${file}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`  Warning: could not fetch ${file} (${res.status})`);
          continue;
        }
        const content = await res.text();
        const destPath = join(destDir, file);
        ensureDir(dirname(destPath));
        writeFileSync(destPath, content);
        console.log(`  + ${file}`);
      }

      console.log(`\nInstalled "${skill.name}" → ${destDir}`);
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

// list
program
  .command('list')
  .description('Show all locally installed tl skills')
  .action(() => {
    const skillsDir = getSkillsDir();
    if (!existsSync(skillsDir)) {
      console.log('No skills installed yet. Run "npx tl-skills add <skill>" to get started.');
      return;
    }
    const installed = readdirSync(skillsDir).filter(name => {
      const p = join(skillsDir, name);
      return statSync(p).isDirectory() && existsSync(join(p, 'SKILL.md'));
    });
    if (installed.length === 0) {
      console.log('No skills installed yet. Run "npx tl-skills add <skill>" to get started.');
      return;
    }
    console.log(`\nInstalled skills (${skillsDir}):\n`);
    for (const name of installed) {
      console.log(`  - ${name}`);
    }
    console.log('');
  });

// update [skill-name]
program
  .command('update [skill-name]')
  .description('Update one or all installed skills')
  .action(async (skillName?: string) => {
    try {
      const skillsDir = getSkillsDir();
      const manifest = await fetchManifest();

      const toUpdate: string[] = skillName
        ? [skillName]
        : (() => {
            if (!existsSync(skillsDir)) return [];
            return readdirSync(skillsDir).filter(name => {
              const p = join(skillsDir, name);
              return statSync(p).isDirectory() && existsSync(join(p, 'SKILL.md'));
            });
          })();

      if (toUpdate.length === 0) {
        console.log('No skills to update.');
        return;
      }

      for (const slug of toUpdate) {
        const skill = manifest.skills.find(s => s.slug === slug);
        if (!skill) {
          console.warn(`  Skipping ${slug}: not found in marketplace`);
          continue;
        }
        console.log(`Updating ${skill.name}...`);
        for (const file of skill.files) {
          const url = `${RAW_BASE}/${skill.slug}/${file}`;
          const res = await fetch(url);
          if (!res.ok) {
            console.warn(`  Warning: could not fetch ${file} (${res.status})`);
            continue;
          }
          const content = await res.text();
          const destPath = join(skillsDir, slug, file);
          ensureDir(dirname(destPath));
          writeFileSync(destPath, content);
          console.log(`  ~ ${file}`);
        }
      }
      console.log('\nUpdate complete.');
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

// info <skill-name>
program
  .command('info <skill-name>')
  .description('Show skill details without installing')
  .action(async (skillName: string) => {
    try {
      const manifest = await fetchManifest();
      const skill = manifest.skills.find(s => s.slug === skillName);
      if (!skill) {
        console.error(`Skill "${skillName}" not found. Run "npx tl-skills find" to browse.`);
        process.exit(1);
      }
      console.log(`\nName:        ${skill.name}`);
      console.log(`Slug:        ${skill.slug}`);
      console.log(`Files:       ${skill.files.length}`);
      console.log(`\nDescription:\n  ${skill.description}`);
      console.log(`\nFiles included:`);
      for (const f of skill.files) {
        console.log(`  - ${f}`);
      }
      console.log(`\nInstall with: npx tl-skills add ${skill.slug}\n`);
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
