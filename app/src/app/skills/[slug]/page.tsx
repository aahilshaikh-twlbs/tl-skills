import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getManifest, getSkill } from '@/lib/manifest';
import { CopyButton } from '@/components/CopyButton';
import { FileTree } from '@/components/FileTree';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

export function generateStaticParams() {
  const { skills } = getManifest();
  return skills.map(s => ({ slug: s.slug }));
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const installCmd = `npx tl-skills add ${skill.slug}`;

  // Parse changelog into structured entries: "v1.0.0 (date): description"
  const changelogEntries = skill.changelog
    ? skill.changelog
        .split(/(?=v\d+\.\d+\.\d+)/)
        .map(e => e.trim())
        .filter(Boolean)
        .map(entry => {
          const m = entry.match(/^(v[\d.]+)\s*\(([^)]+)\):\s*([\s\S]*)$/);
          return m
            ? { version: m[1], date: m[2], description: m[3].trim() }
            : { version: '', date: '', description: entry };
        })
    : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
      {/* Nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <Logo width={120} color="var(--charcoal)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThemeToggle />
          <Link href="/" style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            color: 'var(--ash)',
          }}>
            ← All Skills
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 64px' }}>

        {/* Dark hero card */}
        <div style={{
          background: 'var(--hero-bg)',
          borderRadius: 24,
          padding: '40px 48px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top row: pill + version badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{
              display: 'inline-flex',
              background: '#BFF3A4',
              color: '#1D1C1B',
              borderRadius: 999,
              padding: '3px 10px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: '1px',
            }}>
              SKILL
            </div>
            {skill.version && (
              <div style={{
                display: 'inline-flex',
                background: 'rgba(255,255,255,0.08)',
                color: '#9B9895',
                borderRadius: 999,
                padding: '3px 10px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.5px',
              }}>
                v{skill.version}
              </div>
            )}
          </div>

          <h1 style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 48,
            fontWeight: 400,
            color: '#F4F3F3',
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}>
            {skill.name}
          </h1>
          <p style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 19,
            color: '#9B9895',
            lineHeight: 1.6,
            maxWidth: 640,
            marginBottom: 32,
          }}>
            {skill.description}
          </p>

          {/* Author + date row */}
          {(skill.author || skill.updatedAt) && (
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {skill.author && (
                <div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: '#5C5A58',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1.5px',
                    marginBottom: 3,
                  }}>Author</div>
                  <div style={{
                    fontFamily: "'Milling', 'Noto Sans', sans-serif",
                    fontSize: 14,
                    color: '#9B9895',
                  }}>{skill.author}</div>
                </div>
              )}
              {skill.updatedAt && (
                <div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: '#5C5A58',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1.5px',
                    marginBottom: 3,
                  }}>Last Updated</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    color: '#9B9895',
                  }}>{skill.updatedAt}</div>
                </div>
              )}
            </div>
          )}

          {/* Masterbrand gradient bar */}
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

        {/* Two-column grid */}
        <div className="detail-grid">
          {/* Left: install + skill content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Install command */}
            <div style={{ background: 'var(--fog)', borderRadius: 24, padding: 24 }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: 'var(--ash)',
                textTransform: 'uppercase' as const,
                letterSpacing: '2px',
                marginBottom: 12,
              }}>
                INSTALL
              </div>
              <div style={{
                background: 'var(--hero-bg)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}>
                <code style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 14,
                  color: '#F4F3F3',
                }}>
                  {installCmd}
                </code>
                <CopyButton text={installCmd} />
              </div>
            </div>

            {/* Skill content — collapsible raw markdown */}
            <div style={{ background: 'var(--fog)', borderRadius: 24, padding: 32 }}>
              <details className="skill-content-details">
                <summary>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    color: 'var(--ash)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '2px',
                  }}>
                    SKILL CONTENT
                  </span>
                  <svg
                    className="chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ color: 'var(--ash)', flexShrink: 0 }}
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <pre style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: 'var(--charcoal)',
                  background: 'var(--chalk)',
                  borderRadius: 12,
                  padding: 20,
                  marginTop: 20,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {skill.content}
                </pre>
              </details>
            </div>
          </div>

          {/* Right sidebar: changelog + files */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Changelog */}
            {changelogEntries.length > 0 && (
              <div style={{ background: 'var(--fog)', borderRadius: 24, padding: 24 }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: 'var(--ash)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '2px',
                  marginBottom: 16,
                }}>
                  CHANGELOG
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {changelogEntries.map((entry, i) => (
                    <div key={i}>
                      {i > 0 && (
                        <div style={{ borderTop: '1px dashed var(--smoke)', margin: '14px 0' }} />
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {entry.version && (
                          <span style={{
                            background: '#BFF3A4',
                            color: '#1D1C1B',
                            borderRadius: 999,
                            padding: '2px 8px',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                            letterSpacing: '0.5px',
                          }}>
                            {entry.version}
                          </span>
                        )}
                        {entry.date && (
                          <span style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                            color: 'var(--ash)',
                          }}>
                            {entry.date}
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontFamily: "'Milling', 'Noto Sans', sans-serif",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: 'var(--shadow)',
                        margin: 0,
                      }}>
                        {entry.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            <div style={{ background: 'var(--fog)', borderRadius: 24, padding: 24 }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: 'var(--ash)',
                textTransform: 'uppercase' as const,
                letterSpacing: '2px',
                marginBottom: 12,
              }}>
                INCLUDED FILES — {skill.files.length}
              </div>
              <FileTree files={skill.files} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
