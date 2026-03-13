import type { SkillFormData } from './skillAssembler';

export interface ValidationCheck {
  label: string;
  passed: boolean;
}

export interface ValidationResult {
  checks: ValidationCheck[];
  hardFail: boolean;
}

export function validateSkill(data: SkillFormData): ValidationResult {
  const checks: ValidationCheck[] = [
    {
      label: 'Skill name is lowercase with hyphens only',
      passed: /^[a-z][a-z0-9-]*$/.test(data.slug) && !data.slug.endsWith('-'),
    },
    {
      label: 'Trigger starts with "Use when..."',
      passed: data.description.toLowerCase().startsWith('use when'),
    },
    {
      label: `Trigger under 1024 characters (${data.description.length})`,
      passed: data.description.length > 0 && data.description.length <= 1024,
    },
    {
      label: 'Overview is filled in',
      passed: data.overview.trim().length > 40,
    },
    {
      label: 'Name provided',
      passed: data.submitterName.trim().length > 0,
    },
    {
      label: 'Valid email',
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.submitterEmail),
    },
  ];

  return {
    checks,
    hardFail: checks.some(c => !c.passed),
  };
}
