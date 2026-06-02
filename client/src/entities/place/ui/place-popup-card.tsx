import { ReactNode } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

import { IPlace } from '@/entities/place';

interface IPlacePopupCardProps {
  place: IPlace;
  actions?: ReactNode;
  children?: ReactNode;
}

export const PlacePopupCard = ({
  place,
  actions,
  children,
}: IPlacePopupCardProps) => {
  return (
    <div className="w-85 overflow-hidden rounded-[28px] bg-(--wb-panel-solid) text-foreground">
      <div className="flex items-start justify-between gap-4 p-5 pb-4">
        <div className="min-w-0">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl wb-brand-icon shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
            {place.name}
          </h3>

          {place.country && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {place.country}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      <div className="space-y-4 px-5 pb-5">
        {place.description && (
          <p className="rounded-2xl wb-muted-card px-4 py-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {place.description}
          </p>
        )}

        {place.visitedAt && (
          <div className="flex w-fit items-center gap-2 rounded-full wb-muted-card px-3 py-2 text-xs font-medium">
            <CalendarDays className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>{new Date(place.visitedAt).toLocaleDateString('ru-RU')}</span>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
