'use client';
import { useState, useMemo } from 'react';
import type { SkillEntry } from '@/lib/manifest';
import { SkillCard } from '@/components/SkillCard';
import { SearchBar } from '@/components/SearchBar';

type SortKey = 'az' | 'za' | 'updated';

const SORT_LABELS: Record<SortKey, string> = { az: 'A → Z', za: 'Z → A', updated: 'Updated' };

const selectStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 12,
  color: 'var(--charcoal)',
  background: 'var(--fog)',
  border: '1px solid var(--smoke)',
  borderRadius: 10,
  padding: '10px 14px',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238F8984' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: 28,
  minWidth: 110,
};

export function SearchClient({ skills }: { skills: SkillEntry[] }) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [sort, setSort] = useState<SortKey>('az');

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
      <div style={{
        padding: '24px 24px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap' as const,
      }}>
        <SearchBar value={query} onChange={setQuery} />

        <select value={activeTag} onChange={e => setActiveTag(e.target.value)} style={selectStyle}>
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>
          ))}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={selectStyle}>
          {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: 'var(--ash)',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px',
          whiteSpace: 'nowrap' as const,
          marginLeft: 4,
        }}>
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
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
