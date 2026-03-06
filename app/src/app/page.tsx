'use client';
import { useState } from 'react';
import { getManifest } from '@/lib/manifest';
import { SkillCard } from '@/components/SkillCard';
import { SearchBar } from '@/components/SearchBar';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  const { skills } = getManifest();
  const [query, setQuery] = useState('');

  const filtered = skills.filter(s =>
    query === '' ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F4F3F3' }}>
      {/* Dark hero card */}
      <div style={{
        position: 'relative',
        background: '#1D1C1B',
        borderRadius: 24,
        margin: '24px 24px 0',
        padding: '48px 48px 52px',
        overflow: 'hidden',
      }}>
        <Logo width={160} color="#F4F3F3" />
        <div style={{ marginTop: 32 }}>
          <h1 style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 48,
            fontWeight: 400,
            color: '#F4F3F3',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}>
            Skills Marketplace
          </h1>
          <p style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 20,
            color: '#9B9895',
            marginTop: 12,
          }}>
            Curated agent skills for TwelveLabs teams.
          </p>
        </div>
        {/* Masterbrand gradient accent bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #60E21B 0%, #FABA17 32.5%, #FFB592 69%, #FFB0CD 100%)',
          borderRadius: '0 0 24px 24px',
        }} />
      </div>

      {/* Search + count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 24px 16px',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <SearchBar value={query} onChange={setQuery} />
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: '#8F8984',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          whiteSpace: 'nowrap',
        }}>
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Skills grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
        padding: '0 24px 48px',
      }}>
        {filtered.map(skill => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '64px 0',
            color: '#8F8984',
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
          }}>
            No skills match &quot;{query}&quot;
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px dashed #D3D1CF',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8F8984' }}>
          TwelveLabs Internal
        </span>
        <a href="https://github.com/aahilshaikh-twlbs/tl-skills" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8F8984',
        }}>
          GitHub
        </a>
      </div>
    </div>
  );
}
