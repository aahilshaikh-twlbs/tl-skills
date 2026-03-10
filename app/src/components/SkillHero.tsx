'use client';
import { useLang } from '@/context/LanguageContext';
import type { SkillEntry } from '@/lib/manifest';

export function SkillHero({ skill }: { skill: SkillEntry }) {
  const { lang } = useLang();
  const name = lang === 'ko' && skill.nameKo ? skill.nameKo : skill.name;
  const description = lang === 'ko' && skill.descriptionKo ? skill.descriptionKo : skill.description;

  return (
    <>
      {/* Top row: pill + version badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{
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
        </div>
        {skill.version && (
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255,255,255,0.08)',
            color: '#9B9895',
            borderRadius: 999,
            padding: '3px 10px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.5px',
          }}>
            v{skill.version}
          </div>
        )}
      </div>

      <h1 style={{
        fontFamily: "'Milling', 'Noto Sans', sans-serif",
        fontSize: 48,
        fontWeight: 400,
        color: '#F4F3F3',
        marginBottom: 16,
        letterSpacing: '-0.01em',
      }}>
        {name}
      </h1>

      <p style={{
        fontFamily: "'Milling', 'Noto Sans', sans-serif",
        fontSize: 19,
        color: '#9B9895',
        lineHeight: 1.6,
        maxWidth: 640,
        marginBottom: 32,
      }}>
        {description}
      </p>

      {/* Author + date row */}
      {(skill.author || skill.updatedAt) && (
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {skill.author && (
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: '#5C5A58',
                textTransform: 'uppercase' as const,
                letterSpacing: '1.5px',
                marginBottom: 3,
              }}>Author</div>
              <div style={{
                fontFamily: "'Milling', 'Noto Sans', sans-serif",
                fontSize: 14,
                color: '#9B9895',
              }}>{skill.author}</div>
            </div>
          )}
          {skill.updatedAt && (
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: '#5C5A58',
                textTransform: 'uppercase' as const,
                letterSpacing: '1.5px',
                marginBottom: 3,
              }}>Last Updated</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: '#9B9895',
              }}>{skill.updatedAt}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
