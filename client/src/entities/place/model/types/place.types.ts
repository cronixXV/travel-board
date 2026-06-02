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
  lat: number;
  lng: number;
  description?: string;
  visitedAt?: string;
  isPublic?: boolean;
}

export interface IPublicMapUser {
  id: number;
  username: string;
}

export interface IPublicMapResponse {
  user: IPublicMapUser;
  places: IPlace[];
}
