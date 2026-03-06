'use client';
import { useState } from 'react';
import type { SkillEntry } from '@/lib/manifest';
import { SkillCard } from '@/components/SkillCard';
import { SearchBar } from '@/components/SearchBar';

export function SearchClient({ skills }: { skills: SkillEntry[] }) {
  const [query, setQuery] = useState('');

  const filtered = skills.filter(s =>
    query === '' ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 24px 16px',
        gap: 16,
        flexWrap: 'wrap' as const,
      }}>
        <SearchBar value={query} onChange={setQuery} />
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: 'var(--ash)',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px',
          whiteSpace: 'nowrap' as const,
        }}>
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

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
            color: 'var(--ash)',
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
          }}>
            No skills match &quot;{query}&quot;
          </div>
        )}
      </div>
    </>
  );
}
