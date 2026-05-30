import { ReactNode } from 'react';
import { Compass, LogOut, MousePointer2, UserRound } from 'lucide-react';

import { useCurrentUser, useLogout } from '@/entities/auth';
import { Button } from '@/shared/ui/button/ui/button';

interface IDashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: IDashboardLayoutProps) => {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();

  return (
    <div className="relative h-screen overflow-hidden bg-[#f6f5ef]">
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-[1200] px-4 pt-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex justify-start">
            <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </div>

              <div className="pr-2">
                <p className="text-base font-bold leading-none tracking-[-0.02em] text-slate-950">
                  Wanderboard
                </p>
                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                  Карта путешествий
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-3 text-sm font-bold text-slate-700 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl md:flex">
            <MousePointer2 className="h-4 w-4 text-slate-400" />
            Двойной клик по карте — добавить место
          </div>

          <div className="flex justify-end">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/80 bg-white/90 p-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-2 sm:flex">
                <UserRound className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">
                  @{user?.username || 'user'}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="h-10 rounded-full border-slate-200 bg-white px-4 font-semibold text-slate-700 hover:bg-slate-50"
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
