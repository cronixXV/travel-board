import { IPlace } from '@/entities/place';
import { useMap } from 'react-leaflet';
import { CalendarDays, MapPin, Trash2, X } from 'lucide-react';
import { PhotoUploader } from '@/features/photos';

interface PlacePopupContentProps {
  place: IPlace;
  onDelete: (id: number) => void;
}

export const PlacePopupContent = ({
  place,
  onDelete,
}: PlacePopupContentProps) => {
  const map = useMap();

  return (
    <div className="w-[340px] overflow-hidden rounded-[28px] bg-white">
      <div className="flex items-start justify-between gap-4 p-5 pb-4">
        <div className="min-w-0">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffdf3d] text-slate-950 shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
            {place.name}
          </h3>

          {place.country && (
            <p className="mt-1 text-sm text-slate-500">{place.country}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onDelete(place.id);
              map.closePopup();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100"
            aria-label="Удалить место"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => map.closePopup()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4 px-5 pb-5">
        {place.description && (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            {place.description}
          </p>
        )}

        {place.visitedAt && (
          <div className="flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {new Date(place.visitedAt).toLocaleDateString('ru-RU')}
          </div>
        )}

        <PhotoUploader placeId={place.id} photos={place.photos || []} />
      </div>
    </div>
  );
};
