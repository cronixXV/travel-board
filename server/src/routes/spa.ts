import type { Request, Response } from 'express';
import { Router } from 'express';
import { Place } from '../database/models/place';
import { PlacePhoto } from '../database/models/place-photo';
import { User } from '../database/models/user';
import { renderHtmlWithMeta } from '../utils/render-html-with-meta';

type TPublicPlace = Place & {
  photos?: PlacePhoto[];
};

const router = Router();

const APP_PUBLIC_URL = process.env.APP_PUBLIC_URL || 'http://localhost:3000';

const API_PUBLIC_URL = process.env.API_PUBLIC_URL || APP_PUBLIC_URL;

const trimSlash = (value: string) => value.replace(/\/$/, '');

const getPlacesWord = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return 'место';

  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return 'места';
  }

  return 'мест';
};

const getDefaultMeta = () => {
  const appUrl = trimSlash(APP_PUBLIC_URL);

  return {
    title: 'Wanderboard',
    description: 'Личная карта путешествий с местами, фото и воспоминаниями.',
    url: appUrl,
    image: `${appUrl}/og-default.jpg`,
  };
};

router.get('/map/:username', async (req: Request, res: Response) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username'],
    });

    const appUrl = trimSlash(APP_PUBLIC_URL);
    const apiUrl = trimSlash(API_PUBLIC_URL);

    if (!user) {
      const html = await renderHtmlWithMeta({
        title: 'Карта не найдена · Wanderboard',
        description: 'Пользователь не найден или карта недоступна.',
        url: `${appUrl}/map/${username}`,
        image: `${appUrl}/og-default.jpg`,
      });

      res.status(404).type('html').send(html);
      return;
    }

    const places = await Place.findAll({
      where: {
        userId: user.id,
        isPublic: true,
      },
      include: [
        {
          model: PlacePhoto,
          as: 'photos',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const placesJson = places.map((place) => place.toJSON() as TPublicPlace);

    const firstPhoto = placesJson
      .flatMap((place) => place.photos ?? [])
      .find(Boolean);

    const title = `@${user.username} · Wanderboard`;

    const description = `Публичная карта путешествий @${user.username} — ${
      places.length
    } ${getPlacesWord(places.length)}.`;

    const image = firstPhoto?.filename
      ? `${apiUrl}/uploads/${firstPhoto.filename}`
      : `${appUrl}/og-default.jpg`;

    const html = await renderHtmlWithMeta({
      title,
      description,
      url: `${appUrl}/map/${user.username}`,
      image,
    });

    res.setHeader('Cache-Control', 'public, max-age=60');
    res.type('html').send(html);
  } catch (error) {
    console.error(error);

    const html = await renderHtmlWithMeta(getDefaultMeta());
    res.status(500).type('html').send(html);
  }
});

router.get('*', async (_req: Request, res: Response) => {
  const html = await renderHtmlWithMeta(getDefaultMeta());
  res.type('html').send(html);
});

export default router;
