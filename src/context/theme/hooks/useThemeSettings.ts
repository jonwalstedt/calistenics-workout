import { useEffect, useState } from 'react';
import { getInitialTheme, getSystemPreference } from '../utils';
import { ThemeMode } from '../interfaces';

export const useThemeSettings = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(
    getSystemPreference
  );

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPreference(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const effectiveTheme = theme === 'system' ? systemPreference : theme;
    document.documentElement.dataset.theme = effectiveTheme;
    localStorage.setItem('theme', theme);
  }, [theme, systemPreference]);

  // Toggle between light, dark, and system modes
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const effectiveTheme = theme === 'system' ? systemPreference : theme;

  return {
    theme,
    toggleTheme,
    effectiveTheme,
  };
};
