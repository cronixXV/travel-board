import { Loader2 } from 'lucide-react';

export const PublicMapLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center wb-page">
      <div className="flex items-center gap-3 rounded-full wb-panel px-5 py-3">
        <Loader2 className="h-5 w-5 animate-spin text-slate-950 dark:text-slate-50" />

        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Загружаем публичную карту...
        </span>
      </div>
    </div>
  );
};
