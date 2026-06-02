import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/shared/hooks/use-theme';
import { Button } from '@/shared/ui/button/ui/button';
import { cn } from '@/shared/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      className={cn(
        'h-10 w-10 rounded-full border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-50',
        'dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800',
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};
