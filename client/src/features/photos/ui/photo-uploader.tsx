import { useCallback, useState } from 'react';
import { type Accept, useDropzone } from 'react-dropzone';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Camera, ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';

import { IPlacePhoto, useRemovePhoto, useUploadPhotos } from '@/entities/place';
import { cn } from '@/shared/lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const MAX_PHOTOS = 10;

const imageAccept: Accept = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

interface PhotoUploaderProps {
  placeId: number;
  photos: IPlacePhoto[];
}

export const PhotoUploader = ({ placeId, photos }: PhotoUploaderProps) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const {
    mutate: uploadPhotos,
    isPending: isUploading,
    progress,
  } = useUploadPhotos(placeId);

  const { mutate: removePhoto } = useRemovePhoto(placeId);

  const remainingSlots = MAX_PHOTOS - photos.length;
  const isLimitReached = remainingSlots <= 0;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadPhotos(acceptedFiles.slice(0, remainingSlots));
      }
    },
    [uploadPhotos, remainingSlots]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: imageAccept,
    maxFiles: remainingSlots,
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    disabled: isUploading || isLimitReached,
  });

  const slides = photos.map((photo) => ({
    src: `${API_URL}/uploads/${photo.filename}`,
  }));

  return (
    <div className="space-y-3">
      {!isLimitReached && (
        <div
          {...getRootProps({
            className: cn(
              'group cursor-pointer rounded-2xl border border-dashed p-3 transition-all',
              'bg-slate-50/80 hover:bg-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]',
              isDragActive
                ? 'border-[#ffdf3d] bg-[#ffdf3d]/10'
                : 'border-slate-200',
              isUploading && 'pointer-events-none opacity-70'
            ),
          })}
        >
          <input {...getInputProps({ 'aria-label': 'Загрузка фото' })} />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ffdf3d] text-slate-950 shadow-sm">
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isDragActive ? (
                <UploadCloud className="h-5 w-5" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-950">
                {isUploading
                  ? `Загружаем фото... ${progress}%`
                  : isDragActive
                    ? 'Отпустите файлы'
                    : 'Добавить фото'}
              </p>

              {isUploading ? (
                <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1">
                  <div
                    className="bg-slate-800 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : (
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  JPEG, PNG или WebP до 5 МБ · ещё {remainingSlots} из{' '}
                  {MAX_PHOTOS}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      s
      {isLimitReached && (
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <Camera className="h-4 w-4 text-slate-400" />
          Достигнут лимит в {MAX_PHOTOS} фото
        </div>
      )}
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/70"
            >
              <img
                src={`${API_URL}/uploads/${photo.filename}`}
                alt={photo.originalName || 'Фото места'}
                className="h-full w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                onClick={() => setLightboxIndex(index)}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />

              <button
                type="button"
                aria-label="Удалить фото"
                onClick={(event) => {
                  event.stopPropagation();
                  removePhoto(photo.id);
                }}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-700 opacity-0 shadow-sm transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <Camera className="h-4 w-4 text-slate-400" />
          Пока нет фотографий
        </div>
      )}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  );
};
