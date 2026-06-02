import { Globe2, Images, MapPin } from 'lucide-react';

import { usePlaces } from '@/entities/place';
import {
  getCountriesWord,
  getPhotosWord,
  getPlacesWord,
} from '@/shared/lib/get-word-helpers';

export const MapStats = () => {
  const { data: places = [] } = usePlaces();

  const stats = {
    places: places.length,
    countries: new Set(places.map((place) => place.country).filter(Boolean))
      .size,
    photos: places.reduce((acc, place) => acc + (place.photos?.length || 0), 0),
  };

  const items = [
    {
      label: getPlacesWord(stats.places),
      value: stats.places,
      icon: MapPin,
    },
    {
      label: getCountriesWord(stats.countries),
      value: stats.countries,
      icon: Globe2,
    },
    {
      label: getPhotosWord(stats.photos),
      value: stats.photos,
      icon: Images,
    },
  ];

  return (
    <div className="pointer-events-none rounded-2xl wb-panel p-2">
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex min-w-21.5 items-center gap-2 rounded-xl px-2.5 py-2 transition"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl wb-brand-icon shadow-sm">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold leading-none tracking-[-0.02em] text-slate-950 dark:text-slate-50">
                  {item.value}
                </p>

                <p className="mt-1 truncate text-xs font-medium leading-none text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
