import manifestData from '../../skills-manifest.json';

export interface SkillEntry {
  slug: string;
  name: string;
  description: string;
  files: string[];
  readmeExcerpt: string;
  content: string;
  author?: string;
  version?: string;
  updatedAt?: string;
  changelog?: string;
  tags?: string[];
  nameKo?: string;
  descriptionKo?: string;
}

export interface SkillManifest {
  generated: string;
  skills: SkillEntry[];
}

export function getManifest(): SkillManifest {
  return manifestData as SkillManifest;
}

export function getSkill(slug: string): SkillEntry | undefined {
  return (manifestData as SkillManifest).skills.find(s => s.slug === slug);
}
