'use client';
import Link from 'next/link';
import type { SkillEntry } from '@/lib/manifest';

export function SkillCard({ skill }: { skill: SkillEntry }) {
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
        <div style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          background: '#BFF3A4',
          color: '#1D1C1B',
          borderRadius: 999,
          padding: '3px 10px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          SKILL
        </div>
        <div style={{
          fontFamily: "'Milling', 'Noto Sans', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--charcoal)',
        }}>
          {skill.name}
        </div>
        <div style={{
          fontFamily: "'Milling', 'Noto Sans', sans-serif",
          fontSize: 14,
          color: 'var(--ash)',
          lineHeight: 1.5,
          flex: 1,
        }}>
          {skill.description.length > 120
            ? skill.description.slice(0, 120) + '...'
            : skill.description}
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
