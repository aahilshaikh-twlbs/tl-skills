import matter from 'gray-matter';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SKILLS_DIR = join(__dirname, '..', 'skills');
const OUTPUT_PATH = join(__dirname, '..', 'skills-manifest.json');

interface SkillEntry {
  slug: string;
  name: string;
  description: string;
  files: string[];
  readmeExcerpt: string;
  content: string;
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

    const files = getAllFiles(skillPath, skillPath);
    const readmeExcerpt = content
      .replace(/^#+\s.+$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim()
      .slice(0, 200);

    const description = typeof data.description === 'string'
      ? data.description.trim()
      : String(data.description).trim();

    skills.push({
      slug,
      name: data.name,
      description,
      files,
      readmeExcerpt,
      content,
    });
  }

  const manifest: SkillManifest = {
    generated: new Date().toISOString(),
    skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest with ${skills.length} skills → skills-manifest.json`);
}

generateManifest();
