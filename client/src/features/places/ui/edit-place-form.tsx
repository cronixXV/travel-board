import React, { useState } from 'react';
import {
  CalendarDays,
  Globe2,
  Loader2,
  LockKeyhole,
  MapPin,
  Navigation,
  Save,
  X,
} from 'lucide-react';

import { IPlace, useUpdatePlace } from '@/entities/place';
import { Button } from '@/shared/ui/button/ui/button';
import { Input } from '@/shared/ui/input/ui/input';
import { Label } from '@/shared/ui/label/ui/label';

interface EditPlaceFormProps {
  place: IPlace;
  onCancel: () => void;
  onClose: () => void;
  onSuccess?: () => void;
}

const labelClassName =
  'text-sm font-semibold text-slate-700 dark:text-slate-200';

const inputClassName =
  'h-11 rounded-2xl wb-input px-4 text-sm shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40';

const stopMapEvent = (event: React.SyntheticEvent) => {
  event.stopPropagation();
};

const toDateInputValue = (value?: string | null) => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
};

const toCoordInputValue = (value: number) => {
  return Number(value).toFixed(6);
};

export const EditPlaceForm = ({
  place,
  onCancel,
  onClose,
  onSuccess,
}: EditPlaceFormProps) => {
  const { mutate: updatePlace, isPending } = useUpdatePlace();

  const [name, setName] = useState(place.name || '');
  const [description, setDescription] = useState(place.description || '');
  const [visitedAt, setVisitedAt] = useState(toDateInputValue(place.visitedAt));
  const [lat, setLat] = useState(toCoordInputValue(place.lat));
  const [lng, setLng] = useState(toCoordInputValue(place.lng));
  const [isPublic, setIsPublic] = useState(Boolean(place.isPublic));

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);

  const isCoordsValid =
    Number.isFinite(parsedLat) && Number.isFinite(parsedLng);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !isCoordsValid) return;

    updatePlace(
      {
        id: place.id,
        data: {
          name: name.trim(),
          description: description.trim() || null,
          visitedAt: visitedAt || null,
          lat: parsedLat,
          lng: parsedLng,
          isPublic,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div
      className="pointer-events-auto flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-[28px] wb-card ring-1 ring-slate-200/70 dark:ring-white/10"
      onClick={stopMapEvent}
      onDoubleClick={stopMapEvent}
      onMouseDown={stopMapEvent}
      onPointerDown={stopMapEvent}
      onWheel={stopMapEvent}
    >
      <div className="h-2 shrink-0 bg-[#ffdf3d]" />

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl wb-brand-icon shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>

              <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-50">
                Редактировать место
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                Измените данные точки на карте.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            <div className="flex items-start gap-2">
              <Navigation className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                При изменении координат страна будет определена заново
                автоматически.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`edit-place-name-${place.id}`}
              className={labelClassName}
            >
              Название
            </Label>

            <Input
              id={`edit-place-name-${place.id}`}
              type="text"
              placeholder="Например, Париж"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`edit-place-description-${place.id}`}
              className={labelClassName}
            >
              Описание
            </Label>

            <textarea
              id={`edit-place-description-${place.id}`}
              placeholder="Что запомнилось в этом месте?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="min-h-28 w-full resize-none rounded-2xl border wb-input px-4 py-3 text-sm leading-6 shadow-none outline-none transition placeholder:text-muted-foreground focus:border-[#ffdf3d] focus:ring-3 focus:ring-[#ffdf3d]/40"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`edit-place-visited-at-${place.id}`}
              className={labelClassName}
            >
              Дата посещения
            </Label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

              <Input
                id={`edit-place-visited-at-${place.id}`}
                type="date"
                value={visitedAt}
                onChange={(event) => setVisitedAt(event.target.value)}
                className="h-11 w-full min-w-0 max-w-full appearance-none rounded-2xl wb-input pl-12 pr-4 text-sm shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="min-w-0 space-y-2">
              <Label
                htmlFor={`edit-place-lat-${place.id}`}
                className={labelClassName}
              >
                Широта
              </Label>

              <Input
                id={`edit-place-lat-${place.id}`}
                type="number"
                step="any"
                value={lat}
                onChange={(event) => setLat(event.target.value)}
                aria-invalid={!Number.isFinite(parsedLat)}
                className="h-11 rounded-2xl wb-input px-3 text-sm shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40 aria-invalid:border-red-300 aria-invalid:ring-red-100"
              />
            </div>

            <div className="min-w-0 space-y-2">
              <Label
                htmlFor={`edit-place-lng-${place.id}`}
                className={labelClassName}
              >
                Долгота
              </Label>

              <Input
                id={`edit-place-lng-${place.id}`}
                type="number"
                step="any"
                value={lng}
                onChange={(event) => setLng(event.target.value)}
                aria-invalid={!Number.isFinite(parsedLng)}
                className="h-11 rounded-2xl wb-input px-3 text-sm shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40 aria-invalid:border-red-300 aria-invalid:ring-red-100"
              />
            </div>
          </div>

          {!isCoordsValid && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              Укажите корректные координаты.
            </p>
          )}

          <div className="flex items-center justify-between gap-3 rounded-2xl wb-muted-card px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-950/70 dark:text-slate-300">
                {isPublic ? (
                  <Globe2 className="h-4 w-4" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {isPublic ? 'Публичное место' : 'Скрытое место'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isPublic ? 'Будет видно по ссылке' : 'Видно только вам'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPublic((prev) => !prev)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                isPublic ? 'bg-[#ffdf3d]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
              aria-label="Изменить публичность места"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  isPublic ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200/70 bg-white/95 px-5 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Отмена
            </Button>

            <Button
              type="submit"
              disabled={isPending || !name.trim() || !isCoordsValid}
              className="h-11 rounded-2xl wb-brand-button text-sm font-bold shadow-none disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Сохраняем
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
