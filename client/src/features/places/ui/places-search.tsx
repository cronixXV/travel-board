import { Globe2, LockKeyhole, Search, X } from 'lucide-react';

import { TPlaceVisibilityFilter } from '@/entities/place';

interface IPlacesSearchProps {
  search: string;
  visibility: TPlaceVisibilityFilter;
  totalCount: number;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onVisibilityChange: (value: TPlaceVisibilityFilter) => void;
  onReset: () => void;
  onClose: () => void;
}

const filters: Array<{
  value: TPlaceVisibilityFilter;
  label: string;
}> = [
  {
    value: 'all',
    label: 'Все',
  },
  {
    value: 'public',
    label: 'Публичные',
  },
  {
    value: 'private',
    label: 'Скрытые',
  },
];

export const PlacesSearch = ({
  search,
  visibility,
  totalCount,
  filteredCount,
  onSearchChange,
  onVisibilityChange,
  onReset,
  onClose,
}: IPlacesSearchProps) => {
  const hasFilters = search.trim() || visibility !== 'all';

  return (
    <div className="pointer-events-auto w-[min(22rem,calc(100vw-2rem))] rounded-[28px] wb-card p-3 shadow-[0_16px_50px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 backdrop-blur-xl dark:ring-white/10">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
              Поиск мест
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Название, страна, описание
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Свернуть поиск"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Поиск по месту, стране, описанию"
          className="h-11 w-full rounded-2xl wb-input pl-11 pr-10 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-[#ffdf3d] focus:ring-3 focus:ring-[#ffdf3d]/30"
        />

        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Очистить поиск"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {filters.map((filter) => {
          const isActive = visibility === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onVisibilityChange(filter.value)}
              className={`rounded-2xl px-3 py-2 text-xs font-bold transition ${
                isActive
                  ? 'bg-[#ffdf3d] text-slate-950 shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl wb-muted-card px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {visibility === 'public' ? (
            <Globe2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          ) : visibility === 'private' ? (
            <LockKeyhole className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          ) : (
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          )}

          <span>
            Найдено {filteredCount} из {totalCount}
          </span>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  );
};
