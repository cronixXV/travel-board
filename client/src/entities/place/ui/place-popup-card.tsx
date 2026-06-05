import { ReactNode } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

import { IPlace } from '@/entities/place';

interface IPlacePopupCardProps {
  place: IPlace;
  actions?: ReactNode;
  children?: ReactNode;
  isEditing?: boolean;
  showDetails?: boolean;
}

export const PlacePopupCard = ({
  place,
  actions,
  children,
  showDetails = true,
}: IPlacePopupCardProps) => {
  return (
    <div
      className="pointer-events-auto flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-white dark:bg-slate-950"
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <div className="shrink-0 p-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffdf3d] text-slate-950 shadow-sm">
              <MapPin className="h-6 w-6" />
            </div>

            <h3 className="truncate text-xl font-bold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
              {place.name}
            </h3>

            {place.country && (
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {place.country}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
        {showDetails && place.description && (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {place.description}
          </p>
        )}

        {showDetails && place.visitedAt && (
          <div className="flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <CalendarDays className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            {new Date(place.visitedAt).toLocaleDateString('ru-RU')}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
