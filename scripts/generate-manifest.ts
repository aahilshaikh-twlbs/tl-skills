import matter from 'gray-matter';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SKILLS_DIR = join(__dirname, '..', 'skills');
const OUTPUT_PATH = join(__dirname, '..', 'skills-manifest.json');

if (!existsSync(SKILLS_DIR)) {
  console.error(`skills/ directory not found at ${SKILLS_DIR}`);
  process.exit(1);
}

interface SkillEntry {
  slug: string;
  name: string;
  description: string;
  files: string[];
  readmeExcerpt: string;
  content: string;
  // Optional metadata
  author?: string;
  version?: string;
  updatedAt?: string;
  changelog?: string;
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

function coerceString(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (val instanceof Date) {
    // Format as YYYY-MM-DD
    return val.toISOString().slice(0, 10);
  }
  return typeof val === 'string' ? val.trim() : String(val).trim();
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

    let files: string[];
    try {
      files = getAllFiles(skillPath, skillPath);
    } catch (err) {
      console.warn(`Skipping ${slug}: error reading files — ${(err as Error).message}`);
      continue;
    }

    const readmeExcerpt = content
      .replace(/^#+\s.+$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim()
      .slice(0, 200);

    const entry: SkillEntry = {
      slug,
      name: typeof data.name === 'string' ? data.name.trim() : String(data.name).trim(),
      description: typeof data.description === 'string' ? data.description.trim() : String(data.description).trim(),
      files,
      readmeExcerpt,
      content,
    };

    // Optional metadata fields
    if (data.author) entry.author = coerceString(data.author);
    if (data.version) entry.version = coerceString(data.version);
    if (data.updated) entry.updatedAt = coerceString(data.updated);
    if (data.changelog) entry.changelog = coerceString(data.changelog);

    skills.push(entry);
  }

  const manifest: SkillManifest = {
    generated: new Date().toISOString(),
    skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest with ${skills.length} skills → skills-manifest.json`);
}

generateManifest();
