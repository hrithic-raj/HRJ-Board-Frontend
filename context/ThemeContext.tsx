'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'hrj_theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // The inline script in <head> (see app/layout.tsx) already applies the
  // correct class to <html> before hydration to avoid a flash of the wrong
  // theme - here we just read it back into React state.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage may be unavailable (e.g. private browsing) - safe to ignore
      }
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
