import { FileRejection } from 'react-dropzone';

const MAX_FILE_SIZE_MB = 5;

export const getDropErrorMessage = (rejections: FileRejection[]) => {
  const firstError = rejections[0]?.errors[0];

  if (!firstError) {
    return 'Не удалось выбрать файл. Попробуйте другое изображение.';
  }

  if (firstError.code === 'file-invalid-type') {
    return 'Поддерживаются только JPEG, PNG или WebP.';
  }

  if (firstError.code === 'file-too-large') {
    return `Файл слишком большой. Максимум ${MAX_FILE_SIZE_MB} МБ.`;
  }

  if (firstError.code === 'too-many-files') {
    return 'Вы выбрали слишком много файлов.';
  }

  return firstError.message || 'Не удалось загрузить файл.';
};
