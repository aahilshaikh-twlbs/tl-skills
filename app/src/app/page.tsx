import { getManifest } from '@/lib/manifest';
import { Logo } from '@/components/Logo';
import { SearchClient } from '@/components/SearchClient';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function HomePage() {
  const { skills } = getManifest();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
      {/* Dark hero card */}
      <div style={{
        position: 'relative',
        background: '#1D1C1B',
        borderRadius: 24,
        margin: '24px 24px 0',
        padding: '48px 48px 52px',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Logo width={160} color="#F4F3F3" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            <p style={{
              fontFamily: "'Milling', 'Noto Sans', sans-serif",
              fontSize: 20,
              color: '#9B9895',
              margin: 0,
            }}>
              Curated agent skills for TwelveLabs teams.
            </p>
            <a href="/submit" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', color: '#F4F3F3',
              border: '1px solid rgba(244,243,243,0.3)',
              borderRadius: 10, padding: '8px 18px',
              fontFamily: "'Milling', 'Noto Sans', sans-serif",
              fontSize: 14, fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              + Submit a Skill
            </a>
          </div>
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

      {/* Client search + grid */}
      <SearchClient skills={skills} />

      {/* Footer */}
      <div style={{
        borderTop: '1px dashed var(--smoke)',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--ash)' }}>
          TwelveLabs Internal
        </span>
        <a href="https://github.com/aahilshaikh-twlbs/tl-skills" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--ash)',
        }}>
          GitHub
        </a>
      </div>
    </div>
  );
}
