import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

import {
  ICreatePlaceData,
  IPlaceFilters,
  TUpdatePlaceData,
  placesApi,
} from '@/entities/place';

export const placesQueryKey = (filters?: IPlaceFilters) =>
  ['places', filters] as const;

export const usePlacesWithMeta = (filters?: IPlaceFilters) => {
  return useQuery({
    queryKey: placesQueryKey(filters),
    queryFn: () => placesApi.getAll(filters),
    placeholderData: keepPreviousData,
  });
};

export const usePlaces = (filters?: IPlaceFilters) => {
  return useQuery({
    queryKey: placesQueryKey(filters),
    queryFn: () => placesApi.getAll(filters),
    select: (data) => data.places,
    placeholderData: keepPreviousData,
  });
};

export const useCreatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreatePlaceData) => placesApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
};

export const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; data: TUpdatePlaceData }) =>
      placesApi.update(data.id, data.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
};

export const useDeletePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => placesApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
};
