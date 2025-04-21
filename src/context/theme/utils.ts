import { ThemeMode } from './interfaces';

// Get system preference
export const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light'; // Default for SSR
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

// Get preferred theme from localStorage or default to system
export const getInitialTheme = (): ThemeMode => {
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
