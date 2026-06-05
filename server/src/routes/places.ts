import { Request, Response, Router } from 'express';
import { Op, WhereOptions } from 'sequelize';

import {
  CreatePlaceSchema,
  UpdatePlaceSchema,
} from '@wanderboard/shared/schemas/place.schema';

import { Place } from '../database/models/place';
import { PlacePhoto } from '../database/models/place-photo';
import { User } from '../database/models/user';
import { authenticate } from '../middleware/authenticate';
import { getLocationByCoords } from '../utils/geocoding';
import { getContinentByCountryName } from '../utils/continent';

const router = Router();

type TVisibilityFilter = 'all' | 'public' | 'private';

const getVisibilityFilter = (value: unknown): TVisibilityFilter => {
  if (value === 'public' || value === 'private' || value === 'all') {
    return value;
  }

  return 'all';
};

const getSearchQuery = (value: unknown) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

// GET /api/places — места текущего пользователя с поиском и фильтрацией
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const search = getSearchQuery(req.query.search);
    const visibility = getVisibilityFilter(req.query.visibility);

    const where: WhereOptions = {
      userId: req.user!.userId,
    };

    if (visibility === 'public') {
      Object.assign(where, {
        isPublic: true,
      });
    }

    if (visibility === 'private') {
      Object.assign(where, {
        isPublic: false,
      });
    }

    if (search) {
      Object.assign(where, {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            country: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            continent: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      });
    }

    const places = await Place.findAll({
      where,
      include: [
        {
          model: PlacePhoto,
          as: 'photos',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const totalPlaces = await Place.count({
      where: {
        userId: req.user!.userId,
      },
    });

    res.json({
      places,
      meta: {
        total: totalPlaces,
        filtered: places.length,
        filters: {
          search,
          visibility,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/places/public/:username — публичные места пользователя
// Важно: этот route должен быть ДО /:id
router.get('/public/:username', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
      attributes: ['id', 'username'],
    });

    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
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

    res.json({ user, places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/places/stats — расширенная статистика текущего пользователя
router.get('/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const places = await Place.findAll({
      where: {
        userId: req.user!.userId,
      },
      include: [
        {
          model: PlacePhoto,
          as: 'photos',
        },
      ],
    });

    const totalPlaces = places.length;

    const totalPhotos = places.reduce(
      (acc, place) => acc + (place.photos?.length || 0),
      0
    );

    const countries = new Set(
      places.map((place) => place.country).filter(Boolean)
    );

    const getPlaceContinent = (place: Place) => {
      return place.continent || getContinentByCountryName(place.country);
    };

    const continents = new Set(
      places.map((place) => getPlaceContinent(place)).filter(Boolean)
    );

    const visibility = places.reduce(
      (acc, place) => {
        if (place.isPublic) {
          acc.public += 1;
        } else {
          acc.private += 1;
        }

        return acc;
      },
      {
        public: 0,
        private: 0,
      }
    );

    const countryMap = new Map<string, number>();
    const continentMap = new Map<string, number>();
    const yearMap = new Map<string, number>();

    places.forEach((place) => {
      if (place.country) {
        countryMap.set(place.country, (countryMap.get(place.country) || 0) + 1);
      }

      const continent = getPlaceContinent(place);

      if (continent) {
        continentMap.set(continent, (continentMap.get(continent) || 0) + 1);
      }

      if (place.visitedAt) {
        const year = String(place.visitedAt).slice(0, 4);

        if (/^\d{4}$/.test(year)) {
          yearMap.set(year, (yearMap.get(year) || 0) + 1);
        }
      }
    });

    const byCountry = Array.from(countryMap.entries())
      .map(([country, count]) => ({
        country,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const byContinent = Array.from(continentMap.entries())
      .map(([continent, count]) => ({
        continent,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const byYear = Array.from(yearMap.entries())
      .map(([year, count]) => ({
        year,
        count,
      }))
      .sort((a, b) => Number(b.year) - Number(a.year));

    res.json({
      stats: {
        totalPlaces,
        totalCountries: countries.size,
        totalContinents: continents.size,
        totalPhotos,
        visibility,
        byCountry,
        byContinent,
        byYear,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/places/:id — одно место текущего пользователя
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const place = await Place.findOne({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      include: [
        {
          model: PlacePhoto,
          as: 'photos',
        },
      ],
    });

    if (!place) {
      res.status(404).json({ error: 'Место не найдено' });
      return;
    }

    res.json({ place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/places — создать место
router.post('/', authenticate, async (req: Request, res: Response) => {
  const parsed = CreatePlaceSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  try {
    const location = await getLocationByCoords(
      parsed.data.lat,
      parsed.data.lng
    );

    const createdPlace = await Place.create({
      ...parsed.data,
      country: location.country,
      continent: location.continent,
      userId: req.user!.userId,
    });

    const place = await Place.findOne({
      where: {
        id: createdPlace.id,
        userId: req.user!.userId,
      },
      include: [
        {
          model: PlacePhoto,
          as: 'photos',
        },
      ],
    });

    res.status(201).json({ place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PATCH /api/places/:id — обновить место
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  const parsed = UpdatePlaceSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  try {
    const place = await Place.findOne({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!place) {
      res.status(404).json({ error: 'Место не найдено' });
      return;
    }

    const nextLat = parsed.data.lat ?? place.lat;
    const nextLng = parsed.data.lng ?? place.lng;

    const shouldUpdateLocation =
      parsed.data.lat !== undefined || parsed.data.lng !== undefined;

    const location = shouldUpdateLocation
      ? await getLocationByCoords(nextLat, nextLng)
      : {
          country: place.country ?? null,
          continent: place.continent ?? null,
        };

    await place.update({
      ...parsed.data,
      lat: nextLat,
      lng: nextLng,
      country: location.country,
      continent: location.continent,
    });

    const updatedPlace = await Place.findOne({
      where: {
        id: place.id,
        userId: req.user!.userId,
      },
      include: [
        {
          model: PlacePhoto,
          as: 'photos',
        },
      ],
    });

    res.json({ place: updatedPlace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/places/:id — удалить место
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const place = await Place.findOne({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!place) {
      res.status(404).json({ error: 'Место не найдено' });
      return;
    }

    await place.destroy();

    res.json({ message: 'Место удалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
