'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const from = searchParams.get('from') ?? '/';
        router.replace(from);
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch {
      setError('Something went wrong, try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--charcoal)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Milling, sans-serif',
    }}>
      <div style={{
        background: 'var(--chalk)',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        {/* Logo / wordmark */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--charcoal)',
            color: 'var(--chalk)',
            borderRadius: 10,
            padding: '6px 14px',
            fontSize: 13,
            letterSpacing: '0.08em',
            fontWeight: 700,
            marginBottom: 16,
          }}>
            TL SKILLS
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 4 }}>
            Skills Marketplace
          </h1>
          <p style={{ fontSize: 14, color: '#8F8984' }}>
            Internal access only
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            required
            style={{
              border: '1.5px solid var(--smoke)',
              borderRadius: 10,
              padding: '12px 14px',
              fontSize: 15,
              fontFamily: 'inherit',
              background: 'var(--fog)',
              color: 'var(--charcoal)',
              outline: 'none',
              width: '100%',
            }}
          />

          {error && (
            <div style={{
              background: '#FFF0F0',
              border: '1px solid #FFCCC0',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#8B0000',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              background: 'var(--charcoal)',
              color: 'var(--chalk)',
              border: 'none',
              borderRadius: 10,
              padding: '13px',
              fontSize: 15,
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
