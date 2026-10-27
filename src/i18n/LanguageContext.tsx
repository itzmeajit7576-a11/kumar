import React, { createContext, useContext, useEffect, useState } from "react";
import { SupportedLanguage } from "../types/security";
import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  LanguageOption,
  Translations,
} from "./translations";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentTranslations: Translations;
  currentLangOption: LanguageOption;
  languages: LanguageOption[];
}

const STORAGE_KEY = "cybershield_language_preference_v1";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (initialLanguage) return initialLanguage;
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && (saved === "en" || saved === "hi" || saved === "kn")) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "en";
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguageState(initialLanguage);
    }
  }, [initialLanguage]);

  const currentTranslations = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentTranslations,
        currentLangOption,
        languages: SUPPORTED_LANGUAGES,
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
