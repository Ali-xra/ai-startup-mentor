import React, { createContext, useContext, useEffect, ReactNode } from 'react';

export type Theme = 'dark'; // همیشه dark

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void; // برای سازگاری با کد قدیمی - هیچ کاری نمی‌کنه
  setTheme: (theme: Theme) => void; // برای سازگاری با کد قدیمی - هیچ کاری نمی‌کنه
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider
 * تم همیشه dark است - این provider فقط برای سازگاری با کد قدیمی نگه داشته شده
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // همیشه dark
  const theme: Theme = 'dark';

  useEffect(() => {
    const root = document.documentElement;
    // همیشه کلاس dark اضافه کن
    root.classList.add('dark');
    // همیشه dark ذخیره کن
    localStorage.setItem('theme', 'dark');
  }, []);

  // این توابع هیچ کاری نمی‌کنن - فقط برای سازگاری هستن
  const toggleTheme = () => {
    // هیچ کاری نمی‌کنه
  };

  const setTheme = (newTheme: Theme) => {
    // هیچ کاری نمی‌کنه
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * useTheme Hook
 * استفاده از theme context در کامپوننت‌ها
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
