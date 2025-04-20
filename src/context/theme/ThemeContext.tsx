import { createContext, useState, useEffect, type ReactNode } from 'react';
import { 
  type ThemeMode, 
  type ThemeContextType, 
  getSystemPreference, 
  getInitialTheme 
} from './theme-constants';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(getSystemPreference);
  
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
  
  const value = {
    theme,
    toggleTheme,
    isDark: effectiveTheme === 'dark'
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}; 