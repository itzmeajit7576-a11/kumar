import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANGUAGE, INDIAN_LANGUAGES, LanguageOption } from "../i18n/languages";
import { TRANSLATIONS } from "../i18n/translations";

const STORAGE_KEY = "cybershield_lang_v1";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  currentLang: LanguageOption;
  availableLanguages: LanguageOption[];
  t: (keyPath: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function resolveKey(dict: any, path: string): string | undefined {
  if (!dict) return undefined;
  const parts = path.split(".");
  let curr = dict;
  for (const part of parts) {
    if (curr && typeof curr === "object" && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return typeof curr === "string" ? curr : undefined;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && INDIAN_LANGUAGES.some((l) => l.code === stored)) {
        return stored;
      }
    } catch {
      // ignore
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (newLang: string) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      const opt = INDIAN_LANGUAGES.find((l) => l.code === newLang);
      if (opt?.dir) {
        document.documentElement.dir = opt.dir;
      } else {
        document.documentElement.dir = "ltr";
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const opt = INDIAN_LANGUAGES.find((l) => l.code === language);
    if (opt?.dir) {
      document.documentElement.dir = opt.dir;
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [language]);

  const currentLang =
    INDIAN_LANGUAGES.find((l) => l.code === language) || INDIAN_LANGUAGES[0];

  const t = (keyPath: string, fallback?: string): string => {
    // 1. Try selected language dictionary
    const langDict = TRANSLATIONS[language];
    const val = resolveKey(langDict, keyPath);
    if (val) return val;

    // 2. Try default English dictionary
    const enVal = resolveKey(TRANSLATIONS.en, keyPath);
    if (enVal) return enVal;

    // 3. Fallback or keyPath
    return fallback || keyPath.split(".").pop() || keyPath;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLang,
        availableLanguages: INDIAN_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
