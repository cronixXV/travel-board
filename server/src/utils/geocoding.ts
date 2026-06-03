type TNominatimReverseResponse = {
  address?: {
    country?: string;
  };
};

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';
const GEOCODING_TIMEOUT_MS = 5000;

export const getCountryByCoords = async (
  lat: number,
  lng: number
): Promise<string | null> => {
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
        `Failed to resolve country by coords: Nominatim returned ${response.status}`
      );
      return null;
    }

    const data = (await response.json()) as TNominatimReverseResponse;

    return data.address?.country ?? null;
  } catch (error) {
    console.error('Failed to resolve country by coords:', error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
};
