import { getContinentByCountryCode } from './continent';

type TNominatimReverseResponse = {
  address?: {
    country?: string;
    country_code?: string;
  };
};

type TLocationByCoords = {
  country: string | null;
  continent: string | null;
};

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';
const GEOCODING_TIMEOUT_MS = 5000;

export const getLocationByCoords = async (
  lat: number,
  lng: number
): Promise<TLocationByCoords> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEOCODING_TIMEOUT_MS);

  try {
    const url = new URL(NOMINATIM_REVERSE_URL);

    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lng));
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('zoom', '3');
    url.searchParams.set('accept-language', 'ru');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Wanderboard/1.0 (contact: egruzdev14@gmail.com)',
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(
        `Failed to resolve location by coords: Nominatim returned ${response.status}`
      );

      return {
        country: null,
        continent: null,
      };
    }

    const data = (await response.json()) as TNominatimReverseResponse;

    const country = data.address?.country ?? null;
    const countryCode = data.address?.country_code?.toUpperCase() ?? null;
    const continent = getContinentByCountryCode(countryCode);

    return {
      country,
      continent,
    };
  } catch (error) {
    console.error('Failed to resolve location by coords:', error);

    return {
      country: null,
      continent: null,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Оставляем старую функцию, чтобы не сломать существующие импорты, но новые места лучше создавать через getLocationByCoords.
 */
export const getCountryByCoords = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  const location = await getLocationByCoords(lat, lng);

  return location.country;
};
