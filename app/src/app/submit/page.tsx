'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import type { SkillFormData } from '@/lib/skillAssembler';
import { validateSkill } from '@/lib/skillValidator';

const AVAILABLE_TAGS = [
  'productivity', 'meetings', 'communication', 'slack', 'notion',
  'research', 'reporting', 'analytics', 'engineering', 'documentation',
  'planning', 'hiring', 'intelligence', 'data', 'architecture',
  'visualization', 'open-source', 'meta',
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--chalk)', border: '1px solid var(--smoke)',
  borderRadius: 10, padding: '12px 16px',
  fontFamily: "'Milling', 'Noto Sans', sans-serif", fontSize: 15,
  color: 'var(--charcoal)', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
  color: 'var(--ash)', letterSpacing: '0.5px', textTransform: 'uppercase',
  display: 'block', marginBottom: 6,
};
const hintStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
  color: 'var(--ash)', marginTop: 5,
};

function toSlug(val: string) {
  return val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function SubmitPage() {
  const router = useRouter();
  const [form, setForm] = useState<SkillFormData>({
    submitterName: '',
    submitterEmail: '',
    submitterGithub: '',
    slug: '',
    description: '',
    overview: '',
    tags: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function set(key: keyof SkillFormData, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }
  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  }

  const { checks, hardFail } = useMemo(() => validateSkill(form), [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hardFail) return;
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

  const descOk = form.description.toLowerCase().startsWith('use when');
  const slugPath = form.slug ? `skills/${form.slug}/SKILL.md` : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
      {/* Hero */}
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
            Describe your skill and we'll open a PR for the team to review.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #60E21B 0%, #FABA17 32.5%, #FFB592 69%, #FFB0CD 100%)', borderRadius: '0 0 24px 24px' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 680, margin: '40px auto', padding: '0 24px 64px' }}>

        {/* Who are you */}
        <div style={{ background: 'var(--fog)', borderRadius: 20, padding: 32, marginBottom: 16 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>
            About you
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input style={inputStyle} value={form.submitterName} placeholder="Ada Lovelace"
                onChange={e => set('submitterName', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" value={form.submitterEmail} placeholder="ada@twelvelabs.io"
                onChange={e => set('submitterEmail', e.target.value)} required />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>GitHub username</label>
            <input style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
              value={form.submitterGithub} placeholder="adalovelace (optional)"
              onChange={e => set('submitterGithub', e.target.value)} />
          </div>
        </div>

        {/* Skill details */}
        <div style={{ background: 'var(--fog)', borderRadius: 20, padding: 32, marginBottom: 16 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>
            The skill
          </p>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Skill name *</label>
            <input
              style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
              value={form.slug}
              placeholder="my-skill-name"
              onChange={e => set('slug', toSlug(e.target.value))}
              required
            />
            {slugPath && (
              <span style={hintStyle}>{slugPath}</span>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>When to use it * ({form.description.length}/1024)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={form.description}
              placeholder="Use when you need to..."
              onChange={e => set('description', e.target.value)}
              required
            />
            {form.description && !descOk && (
              <span style={{ ...hintStyle, color: '#8B0000' }}>Must start with "Use when"</span>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Describe the skill *</label>
            <textarea
              style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
              value={form.overview}
              placeholder="What does this skill do? How does it work? What does the output look like? Any tools or platforms it uses?"
              onChange={e => set('overview', e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {AVAILABLE_TAGS.map(tag => {
                const active = form.tags.includes(tag);
                return (
                  <button type="button" key={tag} onClick={() => toggleTag(tag)} style={{
                    background: active ? '#BFF3A4' : 'var(--chalk)',
                    color: active ? '#1D1C1B' : 'var(--ash)',
                    border: active ? '1px solid #BFF3A4' : '1px solid var(--smoke)',
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
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8B0000', marginBottom: 16 }}>
            ⚠ {error}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{
            fontFamily: "'Milling', sans-serif", fontSize: 15, color: 'var(--ash)',
            border: '1px solid var(--smoke)', borderRadius: 10, padding: '10px 20px',
          }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={hardFail || submitting}
            style={{
              background: hardFail || submitting ? 'var(--smoke)' : '#1D1C1B',
              border: 'none', borderRadius: 10, padding: '12px 32px',
              fontFamily: "'Milling', sans-serif", fontSize: 15, fontWeight: 700,
              color: hardFail || submitting ? 'var(--ash)' : '#F4F3F3',
              cursor: hardFail || submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
            }}
          >
            {submitting ? 'Opening PR…' : 'Submit Skill →'}
          </button>
        </div>

        {/* Inline validation — only show once user has started filling */}
        {(form.slug || form.description || form.overview) && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {checks.filter(c => !c.passed).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{
                  background: '#FFD5D5', color: '#8B0000',
                  borderRadius: 999, padding: '2px 8px',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                  textTransform: 'uppercase',
                }}>fix</span>
                <span style={{ fontFamily: "'Milling', sans-serif", fontSize: 13, color: 'var(--ash)' }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
