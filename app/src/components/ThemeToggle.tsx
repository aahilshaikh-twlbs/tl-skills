'use client';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      style={{
        background: 'var(--fog)',
        border: 'none',
        borderRadius: 10,
        padding: '7px 12px',
        cursor: 'pointer',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        color: 'var(--ash)',
        letterSpacing: '0.5px',
        transition: 'background 0.15s',
      }}
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
