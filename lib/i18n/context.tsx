"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translate, type Language, type DictKey } from "./dictionary";

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "polarisbi-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "id" || saved === "en") {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, newLang);
    }
  };

  const t = (key: DictKey, vars?: Record<string, string | number>) =>
    translate(key, lang, vars);

  const value = mounted
    ? { lang, setLang, t }
    : { lang: "en" as Language, setLang, t };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
