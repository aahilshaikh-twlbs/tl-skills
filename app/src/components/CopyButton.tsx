'use client';
import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? '#BFF3A4' : '#1D1C1B',
        color: copied ? '#30710E' : '#F4F3F3',
        border: 'none',
        borderRadius: 10,
        padding: '8px 18px',
        fontFamily: "'Milling', 'Noto Sans', sans-serif",
        fontSize: 14,
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
