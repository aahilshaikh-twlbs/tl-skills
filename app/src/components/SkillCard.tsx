'use client';
import Link from 'next/link';
import type { SkillEntry } from '@/lib/manifest';
import { useLang } from '@/context/LanguageContext';

export function SkillCard({ skill }: { skill: SkillEntry }) {
  const { lang } = useLang();
  const name = lang === 'ko' && skill.nameKo ? skill.nameKo : skill.name;
  const description = lang === 'ko' && skill.descriptionKo ? skill.descriptionKo : skill.description;

  return (
    <Link href={`/skills/${skill.slug}`}>
      <div
        className="skill-card"
        style={{
          background: 'var(--fog)',
          borderRadius: 24,
          padding: 24,
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {skill.tags && skill.tags.length > 0 ? skill.tags.map(tag => (
            <span key={tag} style={{
              display: 'inline-flex',
              background: '#BFF3A4',
              color: '#1D1C1B',
              borderRadius: 999,
              padding: '3px 10px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: '1px',
            }}>
              {tag}
            </span>
          )) : (
            <span style={{
              display: 'inline-flex',
              background: '#BFF3A4',
              color: '#1D1C1B',
              borderRadius: 999,
              padding: '3px 10px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: '1px',
            }}>
              SKILL
            </span>
          )}
        </div>
        <div style={{
          fontFamily: "'Milling', 'Noto Sans', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--charcoal)',
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: "'Milling', 'Noto Sans', sans-serif",
          fontSize: 14,
          color: 'var(--ash)',
          lineHeight: 1.5,
          flex: 1,
        }}>
          {description.length > 120
            ? description.slice(0, 120) + '...'
            : description}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: 'var(--shadow)',
          background: 'var(--chalk)',
          borderRadius: 8,
          padding: '6px 10px',
        }}>
          npx tl-skills add {skill.slug}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: 'var(--ash)',
        }}>
          {skill.files.length} file{skill.files.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
}
