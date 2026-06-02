export type Theme = 'light' | 'dark';

export const THEME_CHANGE_EVENT = 'wanderboard-theme-change';

const isTheme = (value: string | null): value is Theme => {
  return value === 'light' || value === 'dark';
};

export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem('theme');

  if (isTheme(saved)) {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;

  localStorage.setItem('theme', theme);

  window.dispatchEvent(
    new CustomEvent<Theme>(THEME_CHANGE_EVENT, {
      detail: theme,
    })
  );
};
