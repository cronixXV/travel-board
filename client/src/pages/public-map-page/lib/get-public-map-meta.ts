import { IPlace, IPublicMapUser } from '@/entities/place';
import { API_URL } from '@/shared/config/env';
import { getPlacesWord } from '@/shared/lib/get-word-helpers';

type TGetPublicMapMetaParams = {
  user: IPublicMapUser;
  places: IPlace[];
};

export const getPublicMapMeta = ({ user, places }: TGetPublicMapMetaParams) => {
  const pageUrl = `${window.location.origin}/map/${user.username}`;

  const title = `@${user.username} · Wanderboard`;

  const description = `Публичная карта путешествий @${user.username} — ${
    places.length
  } ${getPlacesWord(places.length)}.`;

  const ogImage = places[0]?.photos?.[0]
    ? `${API_URL}/uploads/${places[0].photos[0].filename}`
    : `${window.location.origin}/og-default.jpg`;

  return {
    title,
    description,
    pageUrl,
    ogImage,
  };
};
