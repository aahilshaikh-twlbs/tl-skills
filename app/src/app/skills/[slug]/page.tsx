import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getManifest, getSkill } from '@/lib/manifest';
import { CopyButton } from '@/components/CopyButton';
import { FileTree } from '@/components/FileTree';
import { Logo } from '@/components/Logo';

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
    <div style={{ minHeight: '100vh', background: '#F4F3F3' }}>
      {/* Nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
      }}>
        <Logo width={120} color="#1D1C1B" />
        <Link href="/" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          color: '#8F8984',
        }}>
          ← All Skills
        </Link>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px 64px' }}>
        {/* Header card */}
        <div style={{ background: '#ECECEC', borderRadius: 24, padding: 32, marginBottom: 24 }}>
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
            color: '#1D1C1B',
            marginBottom: 12,
          }}>
            {skill.name}
          </h1>
          <p style={{
            fontFamily: "'Milling', 'Noto Sans', sans-serif",
            fontSize: 16,
            color: '#8F8984',
            lineHeight: 1.5,
          }}>
            {skill.description}
          </p>
        </div>

        {/* Install command */}
        <div style={{
          background: '#ECECEC',
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
              color: '#8F8984',
              textTransform: 'uppercase' as const,
              letterSpacing: '2px',
              marginBottom: 8,
            }}>
              INSTALL
            </div>
            <code style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 15,
              color: '#1D1C1B',
            }}>
              {installCmd}
            </code>
          </div>
          <CopyButton text={installCmd} />
        </div>

        {/* Files */}
        <div style={{ background: '#ECECEC', borderRadius: 24, padding: 24, marginBottom: 24 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: '#8F8984',
            textTransform: 'uppercase' as const,
            letterSpacing: '2px',
            marginBottom: 12,
          }}>
            INCLUDED FILES — {skill.files.length}
          </div>
          <FileTree files={skill.files} />
        </div>

        {/* Skill content */}
        <div style={{ background: '#ECECEC', borderRadius: 24, padding: 32 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: '#8F8984',
            textTransform: 'uppercase' as const,
            letterSpacing: '2px',
            marginBottom: 24,
          }}>
            SKILL CONTENT
          </div>
          <div className="skill-content">
            <ReactMarkdown>{skill.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
