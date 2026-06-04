import { Request, Response, Router } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { Place } from '../database/models/place';
import { PlacePhoto } from '../database/models/place-photo';
import { User } from '../database/models/user';
import {
  CreatePlaceSchema,
  UpdatePlaceSchema,
} from '@wanderboard/shared/schemas/place.schema';
import { authenticate } from '../middleware/authenticate';
import { getCountryByCoords } from '../utils/geocoding';

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
    const country = await getCountryByCoords(parsed.data.lat, parsed.data.lng);

    const createdPlace = await Place.create({
      ...parsed.data,
      country,
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

    const shouldUpdateCountry =
      parsed.data.lat !== undefined || parsed.data.lng !== undefined;

    const country = shouldUpdateCountry
      ? await getCountryByCoords(nextLat, nextLng)
      : place.country;

    await place.update({
      ...parsed.data,
      country,
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
