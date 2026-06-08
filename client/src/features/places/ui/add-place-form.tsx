import React, { useState } from 'react';
import {
  CalendarDays,
  Globe2,
  Loader2,
  LockKeyhole,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';

import { useCreatePlace } from '@/entities/place';
import { Button } from '@/shared/ui/button/ui/button';
import { Input } from '@/shared/ui/input/ui/input';
import { Label } from '@/shared/ui/label/ui/label';

interface IAddPlaceFormProps {
  lat: number;
  lng: number;
  onClose: () => void;
}

const labelClassName =
  'text-sm font-semibold text-slate-700 dark:text-slate-200';

const inputClassName =
  'h-12 rounded-2xl wb-input px-4 text-base shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40';

const stopMapEvent = (event: React.SyntheticEvent) => {
  event.stopPropagation();
};

export const AddPlaceForm = ({ lat, lng, onClose }: IAddPlaceFormProps) => {
  const { mutate: createPlace, isPending } = useCreatePlace();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visitedAt, setVisitedAt] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) return;

    createPlace(
      {
        name: name.trim(),
        description: description.trim() || null,
        visitedAt: visitedAt || null,
        lat,
        lng,
        isPublic,
      },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          setVisitedAt('');
          setIsPublic(false);
          onClose();
        },
      }
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-place-title"
      aria-describedby="add-place-description"
      className="pointer-events-auto flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-[28px] wb-card ring-1 ring-slate-200/70 dark:ring-white/10"
      onClick={stopMapEvent}
      onDoubleClick={stopMapEvent}
      onMouseDown={stopMapEvent}
      onPointerDown={stopMapEvent}
      onWheel={stopMapEvent}
    >
      <div className="h-2 shrink-0 bg-[#ffdf3d]" aria-hidden="true" />

      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col"
        aria-busy={isPending}
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl wb-brand-icon shadow-sm">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3
                id="add-place-title"
                className="text-xl font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-50"
              >
                Новое место
              </h3>

              <p
                id="add-place-description"
                className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400"
              >
                Добавьте точку на свою карту путешествий.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть форму добавления места"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div
            className="flex items-center gap-2 rounded-2xl wb-muted-card px-3 py-2 text-xs font-medium"
            aria-label={`Координаты места: широта ${lat.toFixed(
              4
            )}, долгота ${lng.toFixed(4)}`}
          >
            <Navigation
              className="h-4 w-4 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
            <span aria-hidden="true">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-name" className={labelClassName}>
              Название
            </Label>

            <Input
              id="place-name"
              type="text"
              placeholder="Например, Париж"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
              autoFocus
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-description" className={labelClassName}>
              Описание
            </Label>

            <textarea
              id="place-description"
              placeholder="Что запомнилось в этом месте?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="min-h-28 w-full resize-none rounded-2xl border wb-input px-4 py-3 text-sm leading-6 shadow-none outline-none transition placeholder:text-muted-foreground focus:border-[#ffdf3d] focus:ring-3 focus:ring-[#ffdf3d]/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-visited-at" className={labelClassName}>
              Дата посещения
            </Label>

            <div className="relative">
              <CalendarDays
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />

              <Input
                id="place-visited-at"
                type="date"
                value={visitedAt}
                onChange={(event) => setVisitedAt(event.target.value)}
                className="h-12 w-full min-w-0 max-w-full appearance-none rounded-2xl wb-input pl-12 pr-4 text-base shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl wb-muted-card px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-950/70 dark:text-slate-300">
                {isPublic ? (
                  <Globe2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0">
                <p
                  id="add-place-public-label"
                  className="text-sm font-semibold text-slate-950 dark:text-slate-50"
                >
                  {isPublic ? 'Публичное место' : 'Скрытое место'}
                </p>

                <p
                  id="add-place-public-description"
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  {isPublic ? 'Будет видно по ссылке' : 'Видно только вам'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPublic((prev) => !prev)}
              role="switch"
              aria-checked={isPublic}
              aria-labelledby="add-place-public-label"
              aria-describedby="add-place-public-description"
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                isPublic ? 'bg-[#ffdf3d]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  isPublic ? 'left-6' : 'left-1'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200/70 bg-white/95 px-5 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Отмена
            </Button>

            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="h-11 rounded-2xl wb-brand-button text-sm font-bold shadow-none disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Сохраняем
                </span>
              ) : (
                'Добавить'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
