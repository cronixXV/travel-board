import { useCallback, useState } from 'react';
import { type Accept, type FileRejection, useDropzone } from 'react-dropzone';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Camera, ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';

import { IPlacePhoto, useRemovePhoto, useUploadPhotos } from '@/entities/place';
import { cn } from '@/shared/lib/utils';
import { API_URL } from '@/shared/config/env';
import { getDropErrorMessage } from '../lib/get-drop-error-message';

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const imageAccept: Accept = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

interface IPhotoUploaderProps {
  placeId: number;
  photos: IPlacePhoto[];
}

export const PhotoUploader = ({ placeId, photos }: IPhotoUploaderProps) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [dropError, setDropError] = useState<string | null>(null);

  const {
    mutate: uploadPhotos,
    isPending: isUploading,
    progress,
  } = useUploadPhotos(placeId);

  const { mutate: removePhoto } = useRemovePhoto(placeId);

  const remainingSlots = MAX_PHOTOS - photos.length;
  const isLimitReached = remainingSlots <= 0;

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      setDropError(null);

      if (acceptedFiles.length === 0 || remainingSlots <= 0) {
        return;
      }

      uploadPhotos(acceptedFiles.slice(0, remainingSlots));
    },
    [uploadPhotos, remainingSlots]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    setDropError(getDropErrorMessage(fileRejections));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: imageAccept,
    maxFiles: Math.max(1, remainingSlots),
    maxSize: MAX_FILE_SIZE,
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
              'dark:bg-slate-900/70 dark:hover:bg-slate-900 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.28)]',
              isDragActive
                ? 'border-[#ffdf3d] bg-[#ffdf3d]/10 dark:bg-[#ffdf3d]/10'
                : 'border-slate-200 dark:border-white/10',
              isUploading && 'pointer-events-none opacity-70'
            ),
          })}
        >
          <input {...getInputProps({ 'aria-label': 'Загрузка фото' })} />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl wb-brand-icon shadow-sm">
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isDragActive ? (
                <UploadCloud className="h-5 w-5" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                {isUploading
                  ? `Загружаем фото... ${progress ?? 0}%`
                  : isDragActive
                    ? 'Отпустите файлы'
                    : 'Добавить фото'}
              </p>

              {isUploading ? (
                <div className="mt-1.5 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-1 rounded-full bg-slate-800 transition-all duration-300 dark:bg-[#ffdf3d]"
                    style={{ width: `${progress ?? 0}%` }}
                  />
                </div>
              ) : (
                <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  JPEG, PNG или WebP до {MAX_FILE_SIZE_MB} МБ · ещё{' '}
                  {remainingSlots} из {MAX_PHOTOS}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {dropError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-300">
          {dropError}
        </div>
      )}

      {isLimitReached && (
        <div className="flex items-center gap-2 rounded-2xl wb-muted-card px-3 py-2 text-xs">
          <Camera className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <span>Достигнут лимит в {MAX_PHOTOS} фото</span>
        </div>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/70 transition dark:bg-slate-900 dark:ring-white/10"
            >
              <img
                src={`${API_URL}/uploads/${photo.filename}`}
                alt={photo.originalName || 'Фото места'}
                className="h-full w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                onClick={() => setLightboxIndex(index)}
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />

              <button
                type="button"
                aria-label="Удалить фото"
                onClick={(event) => {
                  event.stopPropagation();
                  removePhoto(photo.id);
                }}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-700 opacity-0 shadow-sm transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:bg-slate-950/90 dark:text-slate-200 dark:hover:bg-red-950/70 dark:hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl wb-muted-card px-3 py-2 text-xs">
          <Camera className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <span>Пока нет фотографий</span>
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
