import {
  BarChart3,
  Camera,
  Globe2,
  LockKeyhole,
  MapPin,
  PieChart,
  X,
} from 'lucide-react';

import { usePlacesStats } from '@/entities/place';
import { StatCard } from './stats-card';
import { StatsList } from './stats-list';
import { useCallback } from 'react';
import { useEscapeKey } from '@/shared/hooks/use-escape-key';

interface IPlacesStatsButtonProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

const statsPanelId = 'places-stats-panel';

export const PlacesStatsButton = ({
  isOpen,
  onOpenChange,
}: IPlacesStatsButtonProps) => {
  const { data: stats, isLoading } = usePlacesStats();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEscapeKey(handleClose, isOpen);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full p-0 text-sm font-bold transition sm:w-auto sm:px-4 ${
          isOpen
            ? 'bg-[#ffdf3d] text-slate-950 shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
        }`}
        aria-expanded={isOpen}
        aria-label="Статистика путешествий"
        aria-controls={statsPanelId}
      >
        <BarChart3 className="h-4 w-4" aria-hidden="true" />

        <span className="hidden lg:ml-2 lg:inline">Статистика</span>
      </button>

      {isOpen && (
        <div
          id={statsPanelId}
          role="dialog"
          aria-label="Статистика путешествий"
          className="fixed left-3 right-3 top-20 z-[1400] max-h-[calc(100dvh-7rem)] overflow-y-auto overflow-x-hidden rounded-[28px] wb-card p-3 shadow-[0_20px_70px_rgba(15,23,42,0.22)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-[24rem] dark:ring-white/10"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
                Статистика путешествий
              </p>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Страны, континенты, годы и публичность
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Закрыть статистику"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {isLoading || !stats ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl wb-muted-card px-4 py-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400"
            >
              Загружаем статистику...
            </div>
          ) : (
            <div className="space-y-3" aria-live="polite">
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  label="мест"
                  value={stats.totalPlaces}
                  icon={MapPin}
                />

                <StatCard
                  label="стран"
                  value={stats.totalCountries}
                  icon={Globe2}
                />

                <StatCard
                  label="континентов"
                  value={stats.totalContinents}
                  icon={PieChart}
                />

                <StatCard
                  label="фото"
                  value={stats.totalPhotos}
                  icon={Camera}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl wb-muted-card px-4 py-3">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-950/70 dark:text-slate-300">
                    <Globe2 className="h-4 w-4" aria-hidden="true" />
                  </div>

                  <p className="text-lg font-black leading-none text-slate-950 dark:text-slate-50">
                    {stats.visibility.public}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    публичных
                  </p>
                </div>

                <div className="rounded-2xl wb-muted-card px-4 py-3">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-950/70 dark:text-slate-300">
                    <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                  </div>

                  <p className="text-lg font-black leading-none text-slate-950 dark:text-slate-50">
                    {stats.visibility.private}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    скрытых
                  </p>
                </div>
              </div>

              <StatsList
                title="Континенты"
                items={stats.byContinent.map((item) => ({
                  label: item.continent,
                  count: item.count,
                }))}
              />

              <StatsList
                title="Топ стран"
                items={stats.byCountry.map((item) => ({
                  label: item.country,
                  count: item.count,
                }))}
              />

              <StatsList
                title="Места по годам"
                items={stats.byYear.map((item) => ({
                  label: item.year,
                  count: item.count,
                }))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
