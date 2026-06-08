import { divIcon } from 'leaflet';

export const createClusterIcon = (cluster: { getChildCount: () => number }) => {
  const count = cluster.getChildCount();

  return divIcon({
    html: `
      <div class="wanderboard-cluster">
        <span>${count}</span>
      </div>
    `,
    className: 'wanderboard-cluster-wrapper',
    iconSize: [44, 44],
  });
};
