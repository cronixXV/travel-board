import axios from 'axios';

type TNominatimReverseResponse = {
  address?: {
    country?: string;
  };
};

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

export const getCountryByCoords = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const { data } = await axios.get<TNominatimReverseResponse>(
      NOMINATIM_REVERSE_URL,
      {
        params: {
          lat,
          lon: lng,
          format: 'jsonv2',
          addressdetails: 1,
          zoom: 3,
          'accept-language': 'ru',
        },
        headers: {
          'User-Agent': 'Wanderboard/1.0 (contact: egruzdev14@gmail.com)',
        },
        timeout: 5000,
      }
    );

    return data.address?.country ?? null;
  } catch (error) {
    console.error('Failed to resolve country by coords:', error);
    return null;
  }
};
