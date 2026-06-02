import { ICreatePlaceData, IPlace } from '@/entities/place';
import { api } from '@/shared/api/base-api';
import { IPublicMapResponse } from '../model/types/place.types';

export const placesApi = {
  getAll: async (): Promise<IPlace[]> => {
    const response = await api.get('/api/places');
    return response.data.places;
  },

  create: async (data: ICreatePlaceData): Promise<IPlace> => {
    const response = await api.post('/api/places', data);
    return response.data.place;
  },

  update: async (
    id: number,
    data: Partial<ICreatePlaceData>
  ): Promise<IPlace> => {
    const response = await api.patch(`/api/places/${id}`, data);
    return response.data.place;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/places/${id}`);
  },

  getPublic: async (username: string): Promise<IPublicMapResponse> => {
    const response = await api.get(`/api/places/public/${username}`);
    return response.data;
  },
};
