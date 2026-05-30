import { IPlacePhoto } from '@/entities/place';
import { api } from '@/shared/api/base-api.ts';

export const photosApi = {
  upload: async (
    placeId: number,
    files: File[],
    onProgress?: (percent: number) => void
  ): Promise<IPlacePhoto[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));

    const res = await api.post(`/api/places/${placeId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });
    return res.data.photos;
  },

  remove: async (placeId: number, photoId: number): Promise<void> => {
    await api.delete(`/api/places/${placeId}/photos/${photoId}`);
  },
};
