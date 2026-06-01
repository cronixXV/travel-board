import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Compass, ImageIcon, Loader2, MapPin, Sparkles } from 'lucide-react';

import { IPlace, placesApi } from '@/entities/place';
import { PublicPlacePopupContent } from './public-place-popup-content';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const createPlaceIcon = () =>
  L.divIcon({
    className: 'wanderboard-marker',
    html: `
      <div class="wanderboard-marker__pin">
        <div class="wanderboard-marker__dot"></div>
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38],
  });

const getPlacesWord = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return 'место';

  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return 'места';
  }

  return 'мест';
};

const FitMapToPlaces = ({ places }: { places: IPlace[] }) => {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    const bounds = L.latLngBounds(
      places.map((place) => [place.lat, place.lng] as [number, number])
    );

    map.fitBounds(bounds, {
      paddingTopLeft: [80, 120],
      paddingBottomRight: [80, 80],
      maxZoom: 6,
    });
  }, [map, places]);

  return null;
};

export const PublicMapPage = () => {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-map', username],
    queryFn: () => placesApi.getPublic(username!),
    enabled: !!username,
  });

  const placeIcon = useMemo(() => createPlaceIcon(), []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f5ef]">
        <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-5 py-3 shadow-[0_16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
          <span className="text-sm font-semibold text-slate-700">
            Загружаем публичную карту...
          </span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f5ef] px-4">
        <div className="w-full max-w-md rounded-[28px] border border-white/80 bg-white/90 p-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffdf3d] text-slate-950">
            <MapPin className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
            Карта не найдена
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Пользователь не существует или пока не открыл публичные места.
          </p>

          <Link
            to="/register"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#ffdf3d] px-5 text-sm font-bold text-slate-950 transition hover:bg-[#ffd21f]"
          >
            Создать свою карту
          </Link>
        </div>
      </div>
    );
  }

  const { user, places } = data;

  const pageUrl = `${window.location.origin}/map/${user.username}`;
  const title = `@${user.username} · Wanderboard`;
  const description = `Публичная карта путешествий @${user.username} — ${
    places.length
  } ${getPlacesWord(places.length)}.`;

  const ogImage = places[0]?.photos?.[0]
    ? `${API_URL}/uploads/${places[0].photos[0].filename}`
    : `${window.location.origin}/og-default.jpg`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <div className="relative h-screen overflow-hidden bg-[#f6f5ef]">
        <header className="pointer-events-none absolute left-0 right-0 top-0 z-[1200] px-4 pt-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </div>

              <div className="pr-2">
                <p className="text-base font-bold leading-none tracking-[-0.02em] text-slate-950">
                  @{user.username}
                </p>
                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                  {places.length} {getPlacesWord(places.length)} на карте
                </p>
              </div>
            </div>

            <Link
              to="/register"
              className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-full border border-white/80 bg-white/90 px-5 text-sm font-bold text-slate-950 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:bg-white"
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
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <FitMapToPlaces places={places} />

          {places.map((place: IPlace) => (
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

        <div className="pointer-events-none absolute bottom-5 left-5 z-[1000] hidden rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:block">
          <p className="text-xs font-medium text-slate-500">Публичная карта</p>
          <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-slate-950">
            {places.length} {getPlacesWord(places.length)}
          </p>
        </div>

        {places.length === 0 && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
            <div className="rounded-[28px] border border-white/80 bg-white/90 p-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffdf3d] text-slate-950">
                <ImageIcon className="h-6 w-6" />
              </div>

              <h2 className="text-xl font-bold text-slate-950">
                Публичных мест пока нет
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Автор карты ещё не открыл ни одно место для просмотра.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
