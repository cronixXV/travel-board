import { ImageIcon } from 'lucide-react';

export const PublicMapEmptyOverlay = () => {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-1000 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
      <div className="rounded-[28px] wb-card p-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl wb-brand-icon">
          <ImageIcon className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-bold text-slate-950 dark:text-slate-50">
          Публичных мест пока нет
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Автор карты ещё не открыл ни одно место для просмотра.
        </p>
      </div>
    </div>
  );
};
