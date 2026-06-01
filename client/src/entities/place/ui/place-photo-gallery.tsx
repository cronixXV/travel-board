import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Camera } from 'lucide-react';

import { IPlacePhoto } from '@/entities/place';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface PlacePhotoGalleryProps {
  photos: IPlacePhoto[];
}

export const PlacePhotoGallery = ({ photos }: PlacePhotoGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides = photos.map((photo) => ({
    src: `${API_URL}/uploads/${photo.filename}`,
  }));

  if (photos.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
        <Camera className="h-4 w-4 text-slate-400" />
        Пока нет фотографий
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/70"
          >
            <img
              src={`${API_URL}/uploads/${photo.filename}`}
              alt={photo.originalName || 'Фото места'}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </>
  );
};
