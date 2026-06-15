"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  detectLocale,
  isRtl,
  LOCALE_LABELS,
  LOCALES,
  translations,
  type Locale,
  type Translations,
} from "@/lib/i18n/translations";

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  rtl: boolean;
  setLocale: (locale: Locale) => void;
  localeLabels: typeof LOCALE_LABELS;
  locales: typeof LOCALES;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem("meetscribe-locale", next);
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: translations[locale],
        rtl: isRtl(locale),
        setLocale,
        localeLabels: LOCALE_LABELS,
        locales: LOCALES,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
