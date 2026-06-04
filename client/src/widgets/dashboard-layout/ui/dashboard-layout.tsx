import { ReactNode, useState } from 'react';
import {
  Check,
  Compass,
  LogOut,
  MousePointer2,
  Share2,
  UserRound,
} from 'lucide-react';

import { useCurrentUser, useLogout } from '@/entities/auth';
import { Button } from '@/shared/ui/button/ui/button';
import { ThemeToggle } from '@/shared/ui/theme-toggle/ui/theme-toggle';

interface IDashboardLayoutProps {
  children: ReactNode;
  afterUserSlot?: ReactNode;
}

const headerPanelClassName =
  'pointer-events-auto wb-panel flex items-center shadow-none';

const actionButtonClassName =
  'h-10 w-10 rounded-full border-slate-200 bg-white p-0 font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-4 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800';

export const DashboardLayout = ({
  children,
  afterUserSlot,
}: IDashboardLayoutProps) => {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const [copied, setCopied] = useState(false);

  const getPublicAppUrl = () => {
    return import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin;
  };

  const handleShare = async () => {
    if (!user?.username) return;

    const url = `${getPublicAppUrl()}/map/${user.username}`;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Скопируйте ссылку:', url);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden wb-page">
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-1200 px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-3">
          <div className="flex justify-start">
            <div
              className={`${headerPanelClassName} gap-2 rounded-full p-2 sm:gap-3 sm:px-3 sm:py-2`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm dark:bg-slate-50 dark:text-slate-950">
                <Compass className="h-5 w-5" />
              </div>

              <div className="hidden pr-2 sm:block">
                <p className="text-base font-bold leading-none tracking-[-0.02em] text-slate-950 dark:text-slate-50">
                  Wanderboard
                </p>
                <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                  Карта путешествий
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${headerPanelClassName} hidden items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-slate-700 md:flex dark:text-slate-200`}
          >
            <MousePointer2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            Двойной клик по карте — добавить место
          </div>

          <div className="flex justify-end">
            <div className={`${headerPanelClassName} gap-2 rounded-full p-2`}>
              <div className="hidden items-center gap-2 rounded-full wb-muted-card px-3 py-2 sm:flex">
                <UserRound className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  @{user?.username || 'user'}
                </span>
              </div>

              {afterUserSlot}

              <ThemeToggle />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShare}
                className={actionButtonClassName}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500 sm:mr-1 dark:text-green-400" />
                    <span className="hidden text-green-600 sm:inline dark:text-green-400">
                      Скопировано
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Поделиться</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className={actionButtonClassName}
              >
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="h-screen">{children}</main>
    </div>
  );
};
