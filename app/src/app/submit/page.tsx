'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import type { SkillFormData } from '@/lib/skillAssembler';
import { assembleSkillMd } from '@/lib/skillAssembler';
import { validateSkill } from '@/lib/skillValidator';

const AVAILABLE_TAGS = [
  'productivity', 'meetings', 'communication', 'slack', 'notion',
  'research', 'reporting', 'analytics', 'engineering', 'documentation',
  'planning', 'hiring', 'intelligence', 'data', 'architecture',
  'visualization', 'open-source', 'meta',
];

const EMPTY_FORM: SkillFormData = {
  submitterName: '',
  submitterEmail: '',
  submitterGithub: '',
  slug: '',
  description: '',
  tags: [],
  nameKo: '',
  descriptionKo: '',
  workflowSteps: ['', '', '', ''],
  outputTemplate: '',
  qualityChecks: ['', '', ''],
};

const STEPS = ['About You', 'Identity', 'Content', 'Preview'];

// ── shared styles ──────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--fog)', border: '1px solid var(--smoke)',
  borderRadius: 10, padding: '10px 14px',
  fontFamily: "'Milling', 'Noto Sans', sans-serif", fontSize: 15,
  color: 'var(--charcoal)', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
  color: 'var(--ash)', letterSpacing: '0.5px', textTransform: 'uppercase',
  display: 'block', marginBottom: 6,
};
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 0 };
const hintStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
  color: 'var(--ash)', marginTop: 5,
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Milling', 'Noto Sans', sans-serif", fontSize: 22,
  fontWeight: 700, color: 'var(--charcoal)', marginBottom: 24,
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ ...fieldStyle, marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  );
}

function toSlug(val: string) {
  return val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ── Step 1: About You ──────────────────────────────────────────────────────────
function Step1({ data, set }: { data: SkillFormData; set: (k: keyof SkillFormData, v: string) => void }) {
  return (
    <div>
      <p style={sectionTitle}>About You</p>
      <Field label="Full Name *">
        <input style={inputStyle} value={data.submitterName} placeholder="Ada Lovelace"
          onChange={e => set('submitterName', e.target.value)} />
      </Field>
      <Field label="Email *">
        <input style={inputStyle} type="email" value={data.submitterEmail} placeholder="ada@twelvelabs.io"
          onChange={e => set('submitterEmail', e.target.value)} />
      </Field>
      <Field label="GitHub Username" hint="Optional — for PR attribution">
        <input style={inputStyle} value={data.submitterGithub} placeholder="adalovelace"
          onChange={e => set('submitterGithub', e.target.value)} />
      </Field>
    </div>
  );
}

// ── Step 2: Identity ───────────────────────────────────────────────────────────
function Step2({ data, set, setTags }: {
  data: SkillFormData;
  set: (k: keyof SkillFormData, v: string) => void;
  setTags: (tags: string[]) => void;
}) {
  const slugPreview = data.slug ? `skills/${data.slug}/SKILL.md` : 'skills/your-skill-name/SKILL.md';
  const descLen = data.description.length;
  const descOk = data.description.toLowerCase().startsWith('use when');

  function toggleTag(tag: string) {
    if (data.tags.includes(tag)) setTags(data.tags.filter(t => t !== tag));
    else setTags([...data.tags, tag]);
  }

  return (
    <div>
      <p style={sectionTitle}>Skill Identity</p>
      <Field label="Skill Name *" hint={slugPreview}>
        <input
          style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
          value={data.slug}
          placeholder="my-skill-name"
          onChange={e => set('slug', toSlug(e.target.value))}
        />
      </Field>
      <Field
        label={`Description * (${descLen}/1024)`}
        hint={!descOk && data.description ? '⚠ Must start with "Use when..."' : undefined}
      >
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
          value={data.description}
          placeholder="Use when you need to..."
          onChange={e => set('description', e.target.value)}
        />
      </Field>
      <Field label="Tags">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {AVAILABLE_TAGS.map(tag => {
            const active = data.tags.includes(tag);
            return (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                background: active ? '#BFF3A4' : 'var(--fog)',
                color: active ? '#1D1C1B' : 'var(--ash)',
                border: active ? 'none' : '1px solid var(--smoke)',
                borderRadius: 999, padding: '4px 12px',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '1px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {tag}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Korean Name" hint="Optional — leave blank if not needed">
        <input style={inputStyle} value={data.nameKo} placeholder="스킬 이름"
          onChange={e => set('nameKo', e.target.value)} />
      </Field>
      {data.nameKo && (
        <Field label="Korean Description">
          <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
            value={data.descriptionKo} placeholder="사용 시점을 설명하세요..."
            onChange={e => set('descriptionKo', e.target.value)} />
        </Field>
      )}
    </div>
  );
}

// ── Step 3: Content ────────────────────────────────────────────────────────────
function Step3({ data, setSteps, setChecks, set }: {
  data: SkillFormData;
  setSteps: (steps: string[]) => void;
  setChecks: (checks: string[]) => void;
  set: (k: keyof SkillFormData, v: string) => void;
}) {
  function updateStep(i: number, val: string) {
    const next = [...data.workflowSteps]; next[i] = val; setSteps(next);
  }
  function addStep() { if (data.workflowSteps.length < 6) setSteps([...data.workflowSteps, '']); }
  function removeStep(i: number) {
    if (data.workflowSteps.length > 4) setSteps(data.workflowSteps.filter((_, idx) => idx !== i));
  }

  function updateCheck(i: number, val: string) {
    const next = [...data.qualityChecks]; next[i] = val; setChecks(next);
  }
  function addCheck() { if (data.qualityChecks.length < 8) setChecks([...data.qualityChecks, '']); }
  function removeCheck(i: number) {
    if (data.qualityChecks.length > 3) setChecks(data.qualityChecks.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <p style={sectionTitle}>Skill Content</p>

      <Field label={`Workflow Steps (${data.workflowSteps.length}/6) *`}
        hint="4–6 steps the agent follows in order. Use imperative language.">
        {data.workflowSteps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...labelStyle, margin: 0, minWidth: 20 }}>{i + 1}.</span>
            <input style={{ ...inputStyle, flex: 1 }} value={step}
              placeholder={`Step ${i + 1} — e.g. "Identify the scope and confirm with user"`}
              onChange={e => updateStep(i, e.target.value)} />
            {data.workflowSteps.length > 4 && (
              <button onClick={() => removeStep(i)} style={{
                background: 'none', border: 'none', color: 'var(--ash)',
                cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px',
              }}>×</button>
            )}
          </div>
        ))}
        {data.workflowSteps.length < 6 && (
          <button onClick={addStep} style={{
            background: 'none', border: '1px dashed var(--smoke)', borderRadius: 8,
            padding: '6px 14px', color: 'var(--ash)', cursor: 'pointer',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, marginTop: 4,
          }}>+ Add step</button>
        )}
      </Field>

      <Field label="Output Template *" hint="The exact markdown structure your skill produces. Be concrete.">
        <textarea
          style={{ ...inputStyle, minHeight: 140, resize: 'vertical', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
          value={data.outputTemplate}
          placeholder={`# Output Title\n**Field:** [value]\n**Owner:** [name]\n\n## Section\n[content]`}
          onChange={e => set('outputTemplate', e.target.value)}
        />
      </Field>

      <Field label={`Quality Checks (${data.qualityChecks.length}) *`}
        hint="Testable assertions the agent verifies before delivering output. Minimum 3.">
        {data.qualityChecks.map((check, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...labelStyle, margin: 0 }}>–</span>
            <input style={{ ...inputStyle, flex: 1 }} value={check}
              placeholder={`e.g. "Every action item has an owner"`}
              onChange={e => updateCheck(i, e.target.value)} />
            {data.qualityChecks.length > 3 && (
              <button onClick={() => removeCheck(i)} style={{
                background: 'none', border: 'none', color: 'var(--ash)',
                cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px',
              }}>×</button>
            )}
          </div>
        ))}
        {data.qualityChecks.length < 8 && (
          <button onClick={addCheck} style={{
            background: 'none', border: '1px dashed var(--smoke)', borderRadius: 8,
            padding: '6px 14px', color: 'var(--ash)', cursor: 'pointer',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, marginTop: 4,
          }}>+ Add check</button>
        )}
      </Field>
    </div>
  );
}

// ── Step 4: Preview ────────────────────────────────────────────────────────────
function Step4({ data, skillMd }: { data: SkillFormData; skillMd: string }) {
  const { checks, hardFail } = validateSkill(data, skillMd);

  return (
    <div>
      <p style={sectionTitle}>Preview & Validate</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>
        {/* SKILL.md preview */}
        <div style={{ background: 'var(--fog)', borderRadius: 16, padding: 20 }}>
          <div style={{ ...labelStyle, marginBottom: 12 }}>SKILL.md</div>
          <pre style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
            color: 'var(--charcoal)', lineHeight: 1.6, whiteSpace: 'pre-wrap',
            wordBreak: 'break-word', margin: 0, maxHeight: 480, overflowY: 'auto',
          }}>
            {skillMd}
          </pre>
        </div>

        {/* Validation */}
        <div style={{ background: 'var(--fog)', borderRadius: 16, padding: 20 }}>
          <div style={{ ...labelStyle, marginBottom: 12 }}>Validation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {checks.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0,
                  background: c.passed ? (c.warning ? '#FFF3B0' : '#BFF3A4') : '#FFD5D5',
                  color: c.passed ? (c.warning ? '#7A5700' : '#1D5C00') : '#8B0000',
                  borderRadius: 999, padding: '2px 8px',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {c.passed ? (c.warning ? 'WARN' : 'OK') : 'FAIL'}
                </span>
                <span style={{ fontFamily: "'Milling', sans-serif", fontSize: 12, color: 'var(--charcoal)', lineHeight: 1.4 }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
          {hardFail && (
            <p style={{ ...hintStyle, color: '#8B0000', marginTop: 16 }}>
              Fix the FAIL items above before submitting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main form orchestrator ─────────────────────────────────────────────────────
export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SkillFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function set(key: keyof SkillFormData, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  const skillMd = useMemo(() => assembleSkillMd(form), [form]);
  const { hardFail } = useMemo(() => validateSkill(form, skillMd), [form, skillMd]);

  function canAdvance(): boolean {
    if (step === 0) return !!form.submitterName.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail);
    if (step === 1) return !!form.slug && !!form.description.toLowerCase().startsWith('use when') && form.description.length <= 1024;
    if (step === 2) return form.workflowSteps.filter(s => s.trim()).length >= 4 && !!form.outputTemplate.trim() && form.qualityChecks.filter(c => c.trim()).length >= 3;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      router.push(`/submit/success?pr=${json.prNumber}&url=${encodeURIComponent(json.prUrl)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
      {/* Nav */}
      <div style={{
        position: 'relative', background: '#1D1C1B',
        borderRadius: 24, margin: '24px 24px 0', padding: '32px 48px 36px', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Link href="/"><Logo width={130} color="#F4F3F3" /></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <h1 style={{ fontFamily: "'Milling', sans-serif", fontSize: 36, fontWeight: 400, color: '#F4F3F3', letterSpacing: '-0.01em' }}>
            Submit a Skill
          </h1>
          <p style={{ fontFamily: "'Milling', sans-serif", fontSize: 16, color: '#9B9895', marginTop: 8 }}>
            Your submission opens a PR — the team reviews and merges it to the marketplace.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #60E21B 0%, #FABA17 32.5%, #FFB592 69%, #FFB0CD 100%)', borderRadius: '0 0 24px 24px' }} />
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, padding: '28px 48px 0', alignItems: 'center' }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              opacity: i > step ? 0.4 : 1,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i === step ? '#1D1C1B' : i < step ? '#60E21B' : 'var(--fog)',
                color: i === step ? '#F4F3F3' : i < step ? '#1D1C1B' : 'var(--ash)',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
                transition: 'all 0.2s',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: i === step ? 'var(--charcoal)' : 'var(--ash)' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: 'var(--smoke)' }} />}
          </div>
        ))}
      </div>

      {/* Form body */}
      <div style={{ maxWidth: 760, margin: '32px auto', padding: '0 24px' }}>
        <div style={{ background: 'var(--fog)', borderRadius: 20, padding: 40 }}>
          {step === 0 && <Step1 data={form} set={set} />}
          {step === 1 && <Step2 data={form} set={set} setTags={tags => setForm(f => ({ ...f, tags }))} />}
          {step === 2 && (
            <Step3
              data={form}
              setSteps={steps => setForm(f => ({ ...f, workflowSteps: steps }))}
              setChecks={checks => setForm(f => ({ ...f, qualityChecks: checks }))}
              set={set}
            />
          )}
          {step === 3 && <Step4 data={form} skillMd={skillMd} />}

          {error && (
            <p style={{ color: '#8B0000', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, marginTop: 16 }}>
              ⚠ {error}
            </p>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingBottom: 48 }}>
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/')}
            style={{
              background: 'none', border: '1px solid var(--smoke)', borderRadius: 10,
              padding: '10px 24px', fontFamily: "'Milling', sans-serif", fontSize: 15,
              color: 'var(--charcoal)', cursor: 'pointer',
            }}
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
              style={{
                background: canAdvance() ? '#1D1C1B' : 'var(--smoke)',
                border: 'none', borderRadius: 10, padding: '10px 28px',
                fontFamily: "'Milling', sans-serif", fontSize: 15,
                color: canAdvance() ? '#F4F3F3' : 'var(--ash)',
                cursor: canAdvance() ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={hardFail || submitting}
              style={{
                background: hardFail || submitting ? 'var(--smoke)' : '#60E21B',
                border: 'none', borderRadius: 10, padding: '10px 28px',
                fontFamily: "'Milling', sans-serif", fontSize: 15, fontWeight: 700,
                color: hardFail || submitting ? 'var(--ash)' : '#1D1C1B',
                cursor: hardFail || submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              }}
            >
              {submitting ? 'Opening PR…' : 'Submit Skill →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
