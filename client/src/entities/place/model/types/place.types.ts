export interface IPlacePhoto {
  id: number;
  placeId: number;
  filename: string;
  originalName: string | null;
  createdAt: string;
}

export interface IPlace {
  id: number;
  name: string;
  description?: string | null;
  lat: number;
  lng: number;
  country?: string | null;
  continent?: string | null;
  visitedAt?: string | null;
  isPublic: boolean;
  photos?: IPlacePhoto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreatePlaceData {
  name: string;
  description?: string | null;
  lat: number;
  lng: number;
  visitedAt?: string | null;
  isPublic?: boolean;
}

export type TUpdatePlaceData = Partial<ICreatePlaceData>;

export type TPlaceVisibilityFilter = 'all' | 'public' | 'private';

export interface IPlaceFilters {
  search?: string;
  visibility?: TPlaceVisibilityFilter;
}

export interface IPlacesResponse {
  places: IPlace[];
  meta: {
    total: number;
    filtered: number;
    filters: {
      search: string;
      visibility: TPlaceVisibilityFilter;
    };
  };
}

export interface IPublicMapUser {
  id: number;
  username: string;
}

export interface IPublicMapResponse {
  user: IPublicMapUser;
  places: IPlace[];
}

export interface IPlacesStats {
  totalPlaces: number;
  totalCountries: number;
  totalContinents: number;
  totalPhotos: number;

  visibility: {
    public: number;
    private: number;
  };

  byCountry: Array<{
    country: string;
    count: number;
  }>;

  byContinent: Array<{
    continent: string;
    count: number;
  }>;

  byYear: Array<{
    year: string;
    count: number;
  }>;
}

export interface IPlacesStatsResponse {
  stats: IPlacesStats;
}
