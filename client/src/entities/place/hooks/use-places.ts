import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICreatePlaceData, IPlace,IPlacePhoto,  placesApi, photosApi } from '@/entities/place';

export const usePlaces = () => {
  return useQuery<IPlace[]>({
    queryKey: ['places'],
    queryFn: placesApi.getAll,
  })
}

export const useCreatePlace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ICreatePlaceData) => placesApi.create(data),
    onSuccess: (newPlace) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        [newPlace, ...(oldData || [])]
      )
    }
  })
}

export const useUpdatePlace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: number; data: Partial<ICreatePlaceData> }) => placesApi.update(data.id, data.data),
    onSuccess: (updatedPlace) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        oldData.map((place) =>
          place.id === updatedPlace.id ? updatedPlace : place
        )
      );
    }
  })
}

export const useDeletePlace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => placesApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        oldData.filter(place => place.id !== id)
      )
    }
  })
}

export const useUploadPhotos = (placeId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: File[]) => photosApi.upload(placeId, files),
    onSuccess: (newPhotos) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        oldData.map((place) =>
          place.id === placeId
            ? { ...place, photos: [...(place.photos || []), ...newPhotos] }
            : place
        )
      )
    },
  })
}

export const useRemovePhoto = (placeId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (photoId: number) => photosApi.remove(placeId, photoId),
    onSuccess: (_, photoId) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        oldData.map((place) =>
          place.id === placeId
            ? {
              ...place,
              pphotos: (place.photos || []).filter((p: IPlacePhoto) => p.id !== photoId),
            }
            : place
        )
      )
    },
  })
}

