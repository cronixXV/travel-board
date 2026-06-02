import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

import { IPlace } from '@/entities/place';

type TFitMapToPlacesProps = {
  places: IPlace[];
};

export const FitMapToPlaces = ({ places }: TFitMapToPlacesProps) => {
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
