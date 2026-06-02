import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';

import {
  createPlaceIcon,
  IPlace,
  useDeletePlace,
  usePlaces,
} from '@/entities/place';
import { AddPlaceForm } from '@/features/places';
import { MapClickHandler } from './map-click-handler';
import { PlacePopupContent } from './place-popup-content';
import { MapStats } from '@/widgets/map-stats';
import { useTheme } from '@/shared/hooks/use-theme';
import { getTileUrl } from '@/shared/lib/get-tile-url';

export const TravelMap = () => {
  const { data: places = [], isLoading } = usePlaces();
  const { mutate: deletePlace } = useDeletePlace();

  const [pendingCoords, setPendingCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const placeIcon = useMemo(() => createPlaceIcon(), []);

  const { theme } = useTheme();
  const tileUrl = getTileUrl(theme);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f6f5ef]">
        <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-5 py-3 shadow-[0_16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
          <span className="text-sm font-semibold text-slate-700">
            Загружаем карту...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
        zoomControl={true}
      >
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />

        <MapClickHandler
          onDblClick={(lat, lng) => setPendingCoords({ lat, lng })}
        />

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
              closeButton={false}
              autoPan
              autoPanPaddingTopLeft={[24, 110]}
              autoPanPaddingBottomRight={[24, 24]}
            >
              <PlacePopupContent place={place} onDelete={deletePlace} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-5 left-5 z-1000 hidden sm:block">
        <MapStats />
      </div>

      {pendingCoords && (
        <div className="absolute bottom-6 left-1/2 z-1000 w-full max-w-95 -translate-x-1/2 px-4">
          <AddPlaceForm
            lat={pendingCoords.lat}
            lng={pendingCoords.lng}
            onClose={() => setPendingCoords(null)}
          />
        </div>
      )}
    </div>
  );
};
