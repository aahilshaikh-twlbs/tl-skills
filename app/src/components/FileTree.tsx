export function FileTree({ files }: { files: string[] }) {
  return (
    <div style={{
      background: '#F4F3F3',
      borderRadius: 12,
      padding: 16,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13,
      color: '#45423F',
      lineHeight: 1.8,
    }}>
      {files.map(f => (
        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#D3D1CF' }}>—</span>
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}
