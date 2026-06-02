import { useEffect, useState } from 'react';

import { Theme, THEME_CHANGE_EVENT, applyTheme, getTheme } from '../lib/theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<Theme>;
      setThemeState(customEvent.detail);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        setThemeState(getTheme());
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  };
};
