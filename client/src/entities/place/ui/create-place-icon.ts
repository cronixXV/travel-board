import L from 'leaflet';

export const createPlaceIcon = () =>
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
