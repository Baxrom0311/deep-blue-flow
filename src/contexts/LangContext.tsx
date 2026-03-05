import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang } from '@/lib/i18n';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: 'uz', setLang: () => {} });

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('eco-lang') as Lang) || 'uz');
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('eco-lang', l); };
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};
