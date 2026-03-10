'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'en' | 'ko';

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: 'en', toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored === 'ko') setLang('ko');
  }, []);

  const toggle = () => {
    const next: Lang = lang === 'en' ? 'ko' : 'en';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
