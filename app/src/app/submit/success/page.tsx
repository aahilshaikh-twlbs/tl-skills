import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pr?: string; url?: string }>;
}) {
  const params = await searchParams;
  const prNumber = params.pr;
  const prUrl = params.url ? decodeURIComponent(params.url) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chalk)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{
        position: 'relative', background: '#1D1C1B',
        borderRadius: 24, margin: '24px 24px 0', padding: '32px 48px 36px', overflow: 'hidden',
      }}>
        <Link href="/"><Logo width={130} color="#F4F3F3" /></Link>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #60E21B 0%, #FABA17 32.5%, #FFB592 69%, #FFB0CD 100%)', borderRadius: '0 0 24px 24px' }} />
      </div>

      {/* Success card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ background: 'var(--fog)', borderRadius: 24, padding: '48px 56px', maxWidth: 520, width: '100%', textAlign: 'center' }}>
          {/* Green dot accent */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#BFF3A4', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>
            ✓
          </div>

          <h1 style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 28, fontWeight: 400, color: 'var(--charcoal)', marginBottom: 12,
          }}>
            Skill submitted
          </h1>

          <p style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 16, color: 'var(--ash)', lineHeight: 1.6, marginBottom: 32,
          }}>
            A pull request has been opened for review.
            The team will review your skill and merge it to the marketplace if it meets the standards.
          </p>

          {prUrl && (
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#1D1C1B', color: '#F4F3F3',
                borderRadius: 10, padding: '12px 24px',
                fontFamily: "'Milling', 'Noto Sans', sans-serif", fontSize: 15,
                marginBottom: 16, transition: 'opacity 0.15s',
              }}
            >
              View PR #{prNumber} on GitHub →
            </a>
          )}

          <div>
            <Link href="/" style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
              color: 'var(--ash)', borderBottom: '1px solid var(--smoke)',
            }}>
              ← Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
