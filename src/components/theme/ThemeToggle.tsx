import { Button } from '@radix-ui/themes';
import { useTheme } from '../../context';
import styles from './ThemeToggle.module.css';
import { MoonIcon, SunIcon, SystemIcon } from './icons';

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  const getAriaLabel = () => {
    if (theme === 'system') {
      return 'Using system preference. Click to switch to light mode';
    } else if (isDark) {
      return 'Dark mode. Click to switch to system preference';
    } else {
      return 'Light mode. Click to switch to dark mode';
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <SystemIcon />;
    } else if (isDark) {
      return <SunIcon />;
    } else {
      return <MoonIcon />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="2"
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
    </Button>
  );
}
