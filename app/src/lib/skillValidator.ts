import type { SkillFormData } from './skillAssembler';

export interface ValidationCheck {
  label: string;
  passed: boolean;
  warning?: boolean; // amber — valid but worth noting
}

export interface ValidationResult {
  checks: ValidationCheck[];
  hardFail: boolean; // blocks submission
}

export function validateSkill(data: SkillFormData, skillMd: string): ValidationResult {
  const lineCount = skillMd.split('\n').length;
  const descLength = data.description.length;
  const workflowCount = data.workflowSteps.filter(s => s.trim()).length;
  const qualityCount = data.qualityChecks.filter(c => c.trim()).length;

  const slugValid = /^[a-z][a-z0-9-]*$/.test(data.slug) && !data.slug.endsWith('-');

  const checks: ValidationCheck[] = [
    {
      label: 'Skill name is lowercase with hyphens only',
      passed: slugValid,
    },
    {
      label: 'Description starts with "Use when..."',
      passed: data.description.toLowerCase().startsWith('use when'),
    },
    {
      label: `Description under 1024 characters (${descLength})`,
      passed: descLength <= 1024,
    },
    {
      label: `Workflow has 4–6 steps (${workflowCount})`,
      passed: workflowCount >= 4 && workflowCount <= 6,
    },
    {
      label: 'Output template is present',
      passed: data.outputTemplate.trim().length > 0,
    },
    {
      label: `At least 3 quality checks (${qualityCount})`,
      passed: qualityCount >= 3,
    },
    {
      label: `Line count 110–150 (${lineCount} lines)`,
      passed: lineCount >= 90 && lineCount <= 150,
      warning: lineCount > 120 && lineCount <= 150,
    },
    {
      label: 'Submitter name provided',
      passed: data.submitterName.trim().length > 0,
    },
    {
      label: 'Submitter email provided',
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.submitterEmail),
    },
  ];

  const hardFail = checks.some(c => !c.passed && !c.warning);

  return { checks, hardFail };
}
