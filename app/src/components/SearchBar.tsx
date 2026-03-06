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
        color: '#1D1C1B',
        background: '#FFFFFF',
        border: 'none',
        borderRadius: 12,
        outline: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    />
  );
}
