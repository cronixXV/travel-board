import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICreatePlaceData, IPlace, placesApi } from '@/entities/place';

export const usePlaces = () => {
  return useQuery<IPlace[]>({
    queryKey: ['places'],
    queryFn: placesApi.getAll,
  });
};

export const useCreatePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreatePlaceData) => placesApi.create(data),
    onSuccess: (newPlace) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) => [
        newPlace,
        ...(oldData || []),
      ]);
    },
  });
};

export const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; data: Partial<ICreatePlaceData> }) =>
      placesApi.update(data.id, data.data),

    onSuccess: (updatedPlace) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[] = []) =>
        oldData.map((place) =>
          place.id === updatedPlace.id
            ? {
                ...place,
                ...updatedPlace,
                photos: updatedPlace.photos || place.photos || [],
              }
            : place
        )
      );
    },
  });
};

export const useDeletePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => placesApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        oldData.filter((place) => place.id !== id)
      );
    },
  });
};
