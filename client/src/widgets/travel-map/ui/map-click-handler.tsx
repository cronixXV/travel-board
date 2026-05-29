import { useMapEvents } from 'react-leaflet';

export const MapClickHandler = ({
                           onDblClick,
                         }: {
  onDblClick: (lat: number, lng: number) => void
}) => {
  useMapEvents({
    dblclick(e) {
      onDblClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}