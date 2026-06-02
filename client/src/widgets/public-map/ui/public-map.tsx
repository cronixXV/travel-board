import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Compass, Sparkles } from 'lucide-react';

import {
  createPlaceIcon,
  IPlace,
  IPublicMapUser,
  PublicPlacePopupContent,
} from '@/entities/place';
import { useTheme } from '@/shared/hooks/use-theme';
import { getPlacesWord } from '@/shared/lib/get-word-helpers';
import { getTileUrl } from '@/shared/lib/get-tile-url';

import { FitMapToPlaces } from './fit-map-to-places';
import { PublicMapEmptyOverlay } from './public-map-empty-overlay';

type TPublicMapProps = {
  user: IPublicMapUser;
  places: IPlace[];
};

export const PublicMap = ({ user, places }: TPublicMapProps) => {
  const { theme } = useTheme();

  const placeIcon = useMemo(() => createPlaceIcon(), []);
  const tileUrl = getTileUrl(theme);

  const placesCount = places.length;
  const placesText = getPlacesWord(placesCount);

  return (
    <div className="relative h-screen overflow-hidden wb-page">
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-1200 px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full wb-panel px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm dark:bg-slate-50 dark:text-slate-950">
              <Compass className="h-5 w-5" />
            </div>

            <div className="pr-2">
              <p className="text-base font-bold leading-none tracking-[-0.02em] text-slate-950 dark:text-slate-50">
                @{user.username}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                {placesCount} {placesText} на карте
              </p>
            </div>
          </div>

          <Link
            to="/register"
            className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-full wb-panel px-5 text-sm font-bold text-slate-950 transition hover:bg-white dark:text-slate-50 dark:hover:bg-slate-900"
          >
            <Sparkles className="h-4 w-4 text-[#e0b800]" />

            <span className="hidden sm:inline">Создать свою карту</span>
            <span className="sm:hidden">Создать</span>
          </Link>
        </div>
      </header>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        style={{ height: '100%', width: '100%' }}
        zoomControl
      >
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />

        <FitMapToPlaces places={places} />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={placeIcon}
          >
            <Popup
              className="wanderboard-place-popup"
              minWidth={340}
              maxWidth={340}
              closeButton
              autoPan
              autoPanPaddingTopLeft={[24, 110]}
              autoPanPaddingBottomRight={[24, 24]}
            >
              <PublicPlacePopupContent place={place} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-5 left-5 z-1000 hidden rounded-2xl wb-panel px-4 py-3 sm:block">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Публичная карта
        </p>

        <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-50">
          {placesCount} {placesText}
        </p>
      </div>

      {placesCount === 0 && <PublicMapEmptyOverlay />}
    </div>
  );
};
