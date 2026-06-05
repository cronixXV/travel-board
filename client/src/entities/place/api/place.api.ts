import {
  ICreatePlaceData,
  IPlace,
  IPlaceFilters,
  IPlacesResponse,
  IPlacesStatsResponse,
  IPublicMapResponse,
  TUpdatePlaceData,
} from '@/entities/place';
import { api } from '@/shared/api/base-api';

export const placesApi = {
  getAll: async (filters?: IPlaceFilters): Promise<IPlacesResponse> => {
    const response = await api.get('/api/places', {
      params: {
        search: filters?.search?.trim() || undefined,
        visibility:
          filters?.visibility && filters.visibility !== 'all'
            ? filters.visibility
            : undefined,
      },
    });

    const places = response.data.places || [];

    return {
      places,
      meta: response.data.meta || {
        total: places.length,
        filtered: places.length,
        filters: {
          search: filters?.search?.trim() || '',
          visibility: filters?.visibility || 'all',
        },
      },
    };
  },

  getStats: async (): Promise<IPlacesStatsResponse> => {
    const response = await api.get('/api/places/stats');

    return response.data;
  },

  create: async (data: ICreatePlaceData): Promise<IPlace> => {
    const response = await api.post('/api/places', data);
    return response.data.place;
  },

  update: async (id: number, data: TUpdatePlaceData): Promise<IPlace> => {
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
