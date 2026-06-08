import { useMemo, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { Loader2 } from 'lucide-react';

import { createPlaceIcon, IPlace, useDeletePlace } from '@/entities/place';
import { AddPlaceForm, EditPlaceForm } from '@/features/places';
import { MapStats } from '@/widgets/map-stats';
import { useTheme } from '@/shared/hooks/use-theme';
import { getTileUrl } from '@/shared/lib/get-tile-url';

import { MapClickHandler } from './map-click-handler';
import { PlacePopupContent } from './place-popup-content';
import { createClusterIcon } from './create-cluster-icon';

interface ITravelMapProps {
  places: IPlace[];
  isLoading: boolean;
  isFetching?: boolean;
}

const formOverlayClassName =
  'pointer-events-none fixed inset-x-0 top-[7rem] bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[1300] flex items-center justify-center px-4 sm:absolute sm:left-1/2 sm:right-auto sm:top-auto sm:bottom-6 sm:block sm:w-full sm:max-w-95 sm:-translate-x-1/2 sm:px-4';

export const TravelMap = ({
  places,
  isLoading,
  isFetching = false,
}: ITravelMapProps) => {
  const { mutate: deletePlace } = useDeletePlace();

  const [pendingCoords, setPendingCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [editingPlaceId, setEditingPlaceId] = useState<number | null>(null);

  const selectedPlace = useMemo(() => {
    return places.find((place) => place.id === selectedPlaceId) || null;
  }, [places, selectedPlaceId]);

  const editingPlace = useMemo(() => {
    return places.find((place) => place.id === editingPlaceId) || null;
  }, [places, editingPlaceId]);

  const placeIcon = useMemo(() => createPlaceIcon(), []);

  const { theme } = useTheme();
  const tileUrl = getTileUrl(theme);

  const closeAllOverlays = () => {
    setPendingCoords(null);
    setSelectedPlaceId(null);
    setEditingPlaceId(null);
  };

  const handleOpenPlace = (place: IPlace) => {
    setPendingCoords(null);
    setEditingPlaceId(null);
    setSelectedPlaceId(place.id);
  };

  const handleOpenEdit = (place: IPlace) => {
    setPendingCoords(null);
    setSelectedPlaceId(null);
    setEditingPlaceId(place.id);
  };

  const handleDeletePlace = (id: number) => {
    deletePlace(id);
    closeAllOverlays();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f6f5ef] dark:bg-slate-950">
        <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-5 py-3 shadow-[0_16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
          <Loader2 className="h-5 w-5 animate-spin text-slate-950 dark:text-slate-50" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Загружаем карту...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
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
          onDblClick={(lat, lng) => {
            setSelectedPlaceId(null);
            setEditingPlaceId(null);
            setPendingCoords({ lat, lng });
          }}
        />

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          maxClusterRadius={48}
          iconCreateFunction={createClusterIcon}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={placeIcon}
              eventHandlers={{
                click: () => handleOpenPlace(place),
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <div className="pointer-events-none absolute bottom-5 left-5 z-1000 hidden sm:block">
        <MapStats places={places} />
      </div>

      {isFetching && (
        <div className="pointer-events-none absolute bottom-5 right-5 z-1000 hidden rounded-full wb-panel px-4 py-2 text-xs font-bold text-slate-500 sm:block dark:text-slate-300">
          Обновляем...
        </div>
      )}

      {selectedPlace && !editingPlace && !pendingCoords && (
        <div className={formOverlayClassName}>
          <PlacePopupContent
            place={selectedPlace}
            onDelete={handleDeletePlace}
            onEdit={handleOpenEdit}
            onClose={() => setSelectedPlaceId(null)}
          />
        </div>
      )}

      {pendingCoords && (
        <div className={formOverlayClassName}>
          <AddPlaceForm
            lat={pendingCoords.lat}
            lng={pendingCoords.lng}
            onClose={() => setPendingCoords(null)}
          />
        </div>
      )}

      {editingPlace && (
        <div className={formOverlayClassName}>
          <EditPlaceForm
            place={editingPlace}
            onCancel={() => setEditingPlaceId(null)}
            onClose={() => setEditingPlaceId(null)}
            onSuccess={() => setEditingPlaceId(null)}
          />
        </div>
      )}
    </div>
  );
};
