import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isLang, type Lang } from '@/lib/i18n';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: 'uz', setLang: () => {} });

const readStoredLang = (): Lang | null => {
  try {
    const stored = localStorage.getItem('eco-lang');
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
};

const readUrlLang = (): Lang | null => {
  const value = new URLSearchParams(window.location.search).get('lang');
  return isLang(value) ? value : null;
};

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  // URL ?lang= takes priority so search engines can index every language version.
  const [lang, setLangState] = useState<Lang>(() => readUrlLang() || readStoredLang() || 'uz');
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('eco-lang', l);
    } catch {
      // Storage may be unavailable (private mode); the URL still carries the language.
    }
  };
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};

/** Keeps ?lang= in the URL in sync with the selected language. Must render inside the router. */
export const LangUrlSync = () => {
  const { lang, setLang } = useLang();
  const [params, setParams] = useSearchParams();
  const urlLang = params.get('lang');
  const lastUrlLang = useRef(urlLang);

  useEffect(() => {
    if (urlLang !== lastUrlLang.current && isLang(urlLang)) {
      lastUrlLang.current = urlLang;
      if (urlLang !== lang) {
        setLang(urlLang);
        return;
      }
    }
    lastUrlLang.current = urlLang;

    const desired = lang === 'uz' ? null : lang;
    if (urlLang !== desired) {
      const next = new URLSearchParams(params);
      if (desired) next.set('lang', desired);
      else next.delete('lang');
      setParams(next, { replace: true });
    }
  }, [lang, urlLang]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
