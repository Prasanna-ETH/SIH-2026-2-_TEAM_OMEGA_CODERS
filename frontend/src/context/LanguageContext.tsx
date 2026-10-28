import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  fontSize: number; // 0 = normal, 1 = larger, -1 = smaller
  setFontSize: (size: number) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
}

const dictionaries: Record<Language, Record<string, string>> = { en, hi };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  const t = (key: string): string => {
    return dictionaries[language][key] || dictionaries['en'][key] || key;
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      return next;
    });
  };

  useEffect(() => {
    if (fontSize === 1) {
      document.documentElement.style.fontSize = '18px';
    } else if (fontSize === -1) {
      document.documentElement.style.fontSize = '14px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [fontSize]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        fontSize,
        setFontSize,
        isHighContrast,
        toggleHighContrast
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
