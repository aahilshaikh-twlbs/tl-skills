'use client';
import { useLang } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { lang, toggle } = useLang();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      style={{
        background: 'var(--fog)',
        border: 'none',
        borderRadius: 10,
        padding: '7px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--ash)',
        transition: 'background 0.15s',
        flexShrink: 0,
      }}
    >
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.5px',
        color: lang === 'en' ? 'var(--charcoal)' : 'var(--ash)',
        transition: 'color 0.15s',
      }}>
        EN
      </span>
      <span style={{ color: 'var(--smoke)', fontSize: 11 }}>·</span>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.5px',
        color: lang === 'ko' ? 'var(--charcoal)' : 'var(--ash)',
        transition: 'color 0.15s',
      }}>
        한국어
      </span>
    </button>
  );
}
