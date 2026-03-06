'use client';

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Search skills..."
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        maxWidth: 480,
        padding: '12px 20px',
        fontSize: 16,
        fontFamily: "'Milling', 'Noto Sans', sans-serif",
        color: 'var(--charcoal)',
        background: 'var(--fog)',
        border: '1px solid var(--smoke)',
        borderRadius: 12,
        outline: 'none',
      }}
    />
  );
}
