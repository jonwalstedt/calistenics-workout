import { type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import { useThemeSettings } from './hooks';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, toggleTheme, effectiveTheme } = useThemeSettings();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: effectiveTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
