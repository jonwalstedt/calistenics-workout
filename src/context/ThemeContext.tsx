import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get system preference - moved outside of component to avoid re-creation
const getSystemPreference = (): 'light' | 'dark' => {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

// Get preferred theme from localStorage - moved outside of component to avoid re-creation
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'system'; // Default for SSR
  }

  const savedTheme = localStorage.getItem('theme') as ThemeMode;

  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme;
  }

  // Default to 'system' for new users
  return 'system';
};

interface ThemeProviderProps {
  children: ReactNode;
}

// The Provider component
export function ThemeProvider({ children }: ThemeProviderProps) {
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

  const value = {
    theme,
    toggleTheme,
    isDark: effectiveTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// The hook for using the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
