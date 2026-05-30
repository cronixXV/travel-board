import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { IPlace, IPlacePhoto } from '@/entities/place';
import { photosApi } from '../api/photo.api';

export const useUploadPhotos = (placeId: number) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (files: File[]) =>
      photosApi.upload(placeId, files, (percent) => setProgress(percent)),
    onSuccess: (newPhotos) => {
      setProgress(0);
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        oldData.map((place) =>
          place.id === placeId
            ? { ...place, photos: [...(place.photos || []), ...newPhotos] }
            : place
        )
      );
    },
    onError: () => setProgress(0),
  });

  return { ...mutation, progress };
};

export const useRemovePhoto = (placeId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: number) => photosApi.remove(placeId, photoId),
    onSuccess: (_, photoId) => {
      queryClient.setQueryData(['places'], (oldData: IPlace[]) =>
        oldData.map((place) =>
          place.id === placeId
            ? {
                ...place,
                photos: place.photos.filter(
                  (p: IPlacePhoto) => p.id !== photoId
                ),
              }
            : place
        )
      );
    },
  });
};
