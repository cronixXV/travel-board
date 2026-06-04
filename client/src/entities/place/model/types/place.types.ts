export interface IPlacePhoto {
  id: number;
  placeId: number;
  filename: string;
  originalName: string | null;
  createdAt: string;
}

export interface IPlace {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  country: string | null;
  visitedAt: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  photos: IPlacePhoto[];
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

export interface IPublicMapUser {
  id: number;
  username: string;
}

export interface IPublicMapResponse {
  user: IPublicMapUser;
  places: IPlace[];
}
