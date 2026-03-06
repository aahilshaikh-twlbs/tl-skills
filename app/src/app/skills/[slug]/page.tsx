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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chalk)' }}>
      {/* Nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
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
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px 64px' }}>
        {/* Header card */}
        <div style={{ background: 'var(--fog)', borderRadius: 24, padding: 32, marginBottom: 24 }}>
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
            marginBottom: 16,
          }}>
            SKILL
          </div>
          <h1 style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--charcoal)',
            marginBottom: 12,
          }}>
            {skill.name}
          </h1>
          <p style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 19,
            color: 'var(--ash)',
            lineHeight: 1.6,
          }}>
            {skill.description}
          </p>
        </div>

        {/* Metadata */}
        {(skill.author || skill.version || skill.updatedAt || skill.changelog) && (
          <div style={{ background: 'var(--fog)', borderRadius: 24, padding: 24, marginBottom: 24 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: 'var(--ash)',
              textTransform: 'uppercase' as const,
              letterSpacing: '2px',
              marginBottom: 16,
            }}>
              ABOUT
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 24 }}>
              {skill.author && (
                <div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: 'var(--ash)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1.5px',
                    marginBottom: 4,
                  }}>Author</div>
                  <div style={{
                    fontFamily: "'Milling', 'Noto Sans', sans-serif",
                    fontSize: 14,
                    color: 'var(--charcoal)',
                  }}>{skill.author}</div>
                </div>
              )}
              {skill.version && (
                <div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: 'var(--ash)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1.5px',
                    marginBottom: 4,
                  }}>Version</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    color: 'var(--charcoal)',
                  }}>v{skill.version}</div>
                </div>
              )}
              {skill.updatedAt && (
                <div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: 'var(--ash)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1.5px',
                    marginBottom: 4,
                  }}>Last Updated</div>
                  <div style={{
                    fontFamily: "'Milling', 'Noto Sans', sans-serif",
                    fontSize: 14,
                    color: 'var(--charcoal)',
                  }}>{skill.updatedAt}</div>
                </div>
              )}
            </div>
            {skill.changelog && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed var(--smoke)' }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: 'var(--ash)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '1.5px',
                  marginBottom: 8,
                }}>Changelog</div>
                <pre style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: 'var(--shadow)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                }}>{skill.changelog}</pre>
              </div>
            )}
          </div>
        )}

        {/* Install command */}
        <div style={{
          background: 'var(--fog)',
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap' as const,
        }}>
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: 'var(--ash)',
              textTransform: 'uppercase' as const,
              letterSpacing: '2px',
              marginBottom: 8,
            }}>
              INSTALL
            </div>
            <code style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 15,
              color: 'var(--charcoal)',
            }}>
              {installCmd}
            </code>
          </div>
          <CopyButton text={installCmd} />
        </div>

        {/* Files */}
        <div style={{ background: 'var(--fog)', borderRadius: 24, padding: 24, marginBottom: 24 }}>
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
    </div>
  );
}
