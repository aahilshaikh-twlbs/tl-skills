export function FileTree({ files }: { files: string[] }) {
  return (
    <div style={{
      background: 'var(--chalk)',
      borderRadius: 12,
      padding: 16,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13,
      color: 'var(--shadow)',
      lineHeight: 1.8,
    }}>
      {files.map(f => (
        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--smoke)' }}>—</span>
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}
