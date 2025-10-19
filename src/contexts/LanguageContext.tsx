import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { LanguageCode } from '../services/translationService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();

  // Get initial language from user metadata, localStorage, or default to English
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved as LanguageCode) || 'en';
  });

  // Load language from user metadata when user logs in
  useEffect(() => {
    if (user?.user_metadata?.preferred_language) {
      const userLang = user.user_metadata.preferred_language as LanguageCode;
      setLanguageState(userLang);
      localStorage.setItem('appLanguage', userLang);
    }
  }, [user]);

  // Memoize isRTL to prevent recalculation on every render
  const isRTL = useMemo(() => language === 'fa', [language]);

  // Memoize setLanguage to prevent re-creation on every render
  const setLanguage = useCallback(
    async (lang: LanguageCode) => {
      setLanguageState(lang);
      localStorage.setItem('appLanguage', lang);

      // Save to Supabase user metadata if user is logged in
      if (user) {
        try {
          await supabase.auth.updateUser({
            data: { preferred_language: lang },
          });
        } catch (error) {
          console.error('Failed to save language preference:', error);
        }
      }
    },
    [user]
  );

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

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isRTL,
    }),
    [language, setLanguage, isRTL]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
