import { lazy, Suspense } from 'react';
import { useMap } from 'react-leaflet';
import { Globe2, LockKeyhole, Trash2, X } from 'lucide-react';

import { IPlace, useUpdatePlace } from '@/entities/place';
import { PlacePopupCard } from '@/entities/place/ui/place-popup-card';

const PhotoUploader = lazy(() =>
  import('@/features/photos/ui/photo-uploader').then((module) => ({
    default: module.PhotoUploader,
  }))
);

interface PlacePopupContentProps {
  place: IPlace;
  onDelete: (id: number) => void;
}

const PhotoUploaderFallback = () => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
      <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-3 h-3 w-44 animate-pulse rounded-full bg-slate-200" />
    </div>
  );
};

export const PlacePopupContent = ({
  place,
  onDelete,
}: PlacePopupContentProps) => {
  const map = useMap();
  const { mutate: updatePlace, isPending: isUpdatingPublic } = useUpdatePlace();

  const handleDelete = () => {
    onDelete(place.id);
    map.closePopup();
  };

  const handleTogglePublic = () => {
    updatePlace({
      id: place.id,
      data: {
        isPublic: !place.isPublic,
      },
    });
  };

  return (
    <PlacePopupCard
      place={place}
      actions={
        <>
          <button
            type="button"
            onClick={handleDelete}
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
        </>
      }
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
            {place.isPublic ? (
              <Globe2 className="h-4 w-4" />
            ) : (
              <LockKeyhole className="h-4 w-4" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">
              {place.isPublic ? 'Публичное место' : 'Скрытое место'}
            </p>
            <p className="text-xs text-slate-500">
              {place.isPublic ? 'Будет видно по ссылке' : 'Видно только вам'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTogglePublic}
          disabled={isUpdatingPublic}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            place.isPublic ? 'bg-[#ffdf3d]' : 'bg-slate-200'
          } disabled:opacity-60`}
          aria-label="Изменить публичность места"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
              place.isPublic ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      <Suspense fallback={<PhotoUploaderFallback />}>
        <PhotoUploader placeId={place.id} photos={place.photos || []} />
      </Suspense>
    </PlacePopupCard>
  );
};
