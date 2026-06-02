import { useQuery } from '@tanstack/react-query';

import { placesApi } from '@/entities/place';

export const usePublicMapQuery = (username?: string) => {
  return useQuery({
    queryKey: ['public-map', username],
    queryFn: () => placesApi.getPublic(username!),
    enabled: Boolean(username),
  });
};
