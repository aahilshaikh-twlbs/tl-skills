'use client';
import Link from 'next/link';
import type { SkillEntry } from '@/lib/manifest';

export function SkillCard({ skill }: { skill: SkillEntry }) {
  return (
    <Link href={`/skills/${skill.slug}`}>
      <div
        style={{
          background: '#ECECEC',
          borderRadius: 24,
          padding: 24,
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#E2E2E2'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#ECECEC'; }}
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
          color: '#1D1C1B',
        }}>
          {skill.name}
        </div>
        <div style={{
          fontFamily: "'Milling', 'Noto Sans', sans-serif",
          fontSize: 14,
          color: '#8F8984',
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
          color: '#45423F',
          background: '#F4F3F3',
          borderRadius: 8,
          padding: '6px 10px',
        }}>
          npx tl-skills add {skill.slug}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: '#8F8984',
        }}>
          {skill.files.length} file{skill.files.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
}
