import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode } from '../services/translationService';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or default to English
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved as LanguageCode) || 'en';
  });

  // Determine if current language is RTL (Right-to-Left)
  const isRTL = language === 'fa' || language === 'ar';

  // Update language and save to localStorage
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  };

  // Apply RTL direction to document when language changes
  useEffect(() => {
    if (isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = language;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
