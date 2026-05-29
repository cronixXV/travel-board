import { IPlace,ICreatePlaceData,IPlacePhoto } from '@/entities/place';
import { api } from '@/shared/api/base-api.ts';

export const placesApi = {
  getAll: async (): Promise<IPlace[]> => {
    const response = await api.get('/api/places')
    return response.data.places
  },


  create: async (data: ICreatePlaceData): Promise<IPlace> => {
    const response = await api.post('/api/places', data)
    return response.data.place
  },

  update: async (id: number, data: Partial<ICreatePlaceData>): Promise<IPlace> => {
    const response = await api.patch(`/api/places/${id}`, data)
    return response.data.place
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/places/${id}`)
  },

  getPublic: async (username: string): Promise<{ places: IPlace[] }> => {
    const response = await api.get(`/api/places/public/${username}`)
    return response.data
  },
}

export const photosApi = {
  upload: async (placeId: number, files: File[]): Promise<IPlacePhoto[]> => {
    const formData = new FormData()
    files.forEach((file) => formData.append('photos', file))

    const res = await api.post(`/api/places/${placeId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.photos
  },

  remove: async (placeId: number, photoId: number): Promise<void> => {
    await api.delete(`/api/places/${placeId}/photos/${photoId}`)
  },
}