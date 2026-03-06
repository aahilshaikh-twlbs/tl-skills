'use client';
import { useState, useMemo } from 'react';
import type { SkillEntry } from '@/lib/manifest';
import { SkillCard } from '@/components/SkillCard';
import { SearchBar } from '@/components/SearchBar';

type SortKey = 'az' | 'za' | 'updated';

const SORT_LABELS: Record<SortKey, string> = { az: 'A → Z', za: 'Z → A', updated: 'Updated' };

export function SearchClient({ skills }: { skills: SkillEntry[] }) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('az');

  // Collect all unique tags sorted alphabetically
  const allTags = useMemo(() => {
    const set = new Set<string>();
    skills.forEach(s => s.tags?.forEach(t => set.add(t)));
    return [...set].sort();
  }, [skills]);

  const filtered = useMemo(() => {
    let result = skills.filter(s => {
      const q = query.toLowerCase();
      const matchesQuery = q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags?.some(t => t.includes(q));
      const matchesTag = !activeTag || s.tags?.includes(activeTag);
      return matchesQuery && matchesTag;
    });

    if (sort === 'az') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'updated') {
      result = [...result].sort((a, b) => {
        if (!a.updatedAt && !b.updatedAt) return 0;
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    }
    return result;
  }, [skills, query, activeTag, sort]);

  return (
    <>
      {/* Controls row */}
      <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Search + count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
          <SearchBar value={query} onChange={setQuery} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: 'var(--ash)',
            textTransform: 'uppercase' as const,
            letterSpacing: '1px',
            whiteSpace: 'nowrap' as const,
          }}>
            {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tag filters + sort */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const }}>
          {/* Tag chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            <button
              onClick={() => setActiveTag(null)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                borderRadius: 999,
                padding: '4px 12px',
                border: 'none',
                cursor: 'pointer',
                background: activeTag === null ? 'var(--charcoal)' : 'var(--fog)',
                color: activeTag === null ? 'var(--chalk)' : 'var(--ash)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  borderRadius: 999,
                  padding: '4px 12px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTag === tag ? '#BFF3A4' : 'var(--fog)',
                  color: activeTag === tag ? '#1D1C1B' : 'var(--ash)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.5px',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort pills */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(Object.keys(SORT_LABELS) as SortKey[]).map(key => (
              <button
                key={key}
                onClick={() => setSort(key)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  borderRadius: 8,
                  padding: '4px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  background: sort === key ? 'var(--charcoal)' : 'var(--fog)',
                  color: sort === key ? 'var(--chalk)' : 'var(--ash)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.5px',
                  transition: 'background 0.15s, color 0.15s',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {SORT_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
        padding: '16px 24px 48px',
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
