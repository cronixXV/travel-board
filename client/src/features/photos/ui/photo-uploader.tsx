import { useCallback,useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { IPlacePhoto, useRemovePhoto, useUploadPhotos } from '@/entities/place';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const imageAccept: Accept = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
}

interface PhotoUploaderProps {
  placeId: number
  photos: IPlacePhoto[]
}

export const PhotoUploader = ({ placeId, photos }: PhotoUploaderProps) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const { mutate: uploadPhotos, isPending: isUploading } =
    useUploadPhotos(placeId)

  const { mutate: removePhoto } = useRemovePhoto(placeId)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadPhotos(acceptedFiles)
      }
    },
    [uploadPhotos]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: imageAccept,
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  })

  const slides = photos.map((photo) => ({
    src: `${API_URL}/uploads/${photo.filename}`,
  }))

  return (
    <div className="space-y-3">
      <div
        {...getRootProps({
          className: `border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-slate-400 bg-slate-50'
              : 'border-slate-200 hover:border-slate-300'
          }`,
        })}
      >
        <input {...getInputProps({ 'aria-label': 'Загрузка фото' })} />

        {isUploading ? (
          <p className="text-sm text-slate-500">Загружаем...</p>
        ) : isDragActive ? (
          <p className="text-sm text-slate-500">Отпустите файлы...</p>
        ) : (
          <p className="text-sm text-slate-400">
            Перетащите фото или кликните для выбора
          </p>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative group aspect-square">
              <img
                src={`${API_URL}/uploads/${photo.filename}`}
                alt={photo.originalName || ''}
                className="w-full h-full object-cover rounded-md cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              />

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  removePhoto(photo.id)
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  )
}