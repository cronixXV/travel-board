import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Place } from '../database/models/place';
import { PlacePhoto } from '../database/models/place-photo';
import { authenticate } from '../middleware/authenticate';
import { upload } from '../middleware/upload';
import { UPLOADS_DIR } from '../config/paths';

const router = Router();

// POST /api/places/:id/photos — загрузить фото
router.post(
  '/:id/photos',
  authenticate,
  upload.array('photos', 10),
  async (req: Request, res: Response) => {
    try {
      const place = await Place.findOne({
        where: { id: req.params.id, userId: req.user!.userId },
      });

      if (!place) {
        res.status(404).json({ error: 'Место не найдено' });
        return;
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({ error: 'Файлы не переданы' });
        return;
      }

      const photos = await Promise.all(
        req.files.map((file) =>
          PlacePhoto.create({
            placeId: place.id,
            filename: file.filename,
            originalName: file.originalname,
          })
        )
      );

      res.status(201).json({ photos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
);

// DELETE /api/places/:placeId/photos/:photoId — удалить фото
router.delete(
  '/:placeId/photos/:photoId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const place = await Place.findOne({
        where: { id: req.params.placeId, userId: req.user!.userId },
      });

      if (!place) {
        res.status(404).json({ error: 'Место не найдено' });
        return;
      }

      const photo = await PlacePhoto.findOne({
        where: { id: req.params.photoId, placeId: place.id },
      });

      if (!photo) {
        res.status(404).json({ error: 'Фото не найдено' });
        return;
      }

      const filePath = path.join(UPLOADS_DIR, photo.filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await photo.destroy();
      res.json({ message: 'Фото удалено' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
);

export default router;
