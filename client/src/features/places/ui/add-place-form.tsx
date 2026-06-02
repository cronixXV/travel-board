import React, { useState } from 'react';
import { Loader2, MapPin, Navigation, X } from 'lucide-react';

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

export const AddPlaceForm = ({ lat, lng, onClose }: IAddPlaceFormProps) => {
  const { mutate: createPlace, isPending } = useCreatePlace();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) return;

    createPlace(
      {
        name: name.trim(),
        description: description.trim(),
        lat,
        lng,
        isPublic: false,
      },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          onClose();
        },
      }
    );
  };

  return (
    <div className="overflow-hidden rounded-[28px] wb-card ring-1 ring-slate-200/70 dark:ring-white/10">
      <div className="h-2 bg-[#ffdf3d]" />

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl wb-brand-icon shadow-sm">
              <MapPin className="h-5 w-5" />
            </div>

            <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-50">
              Новое место
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
              Добавьте точку на свою карту путешествий.
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

        <div className="mb-5 flex items-center gap-2 rounded-2xl wb-muted-card px-3 py-2 text-xs font-medium">
          <Navigation className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <span>
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="min-h-23 w-full resize-none rounded-2xl border wb-input px-4 py-3 text-sm leading-6 shadow-none outline-none transition placeholder:text-muted-foreground focus:border-[#ffdf3d] focus:ring-3 focus:ring-[#ffdf3d]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Сохраняем
                </span>
              ) : (
                'Добавить'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
