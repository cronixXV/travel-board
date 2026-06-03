import { ErrorRequestHandler } from 'express';
import multer from 'multer';

type THttpError = Error & {
  status?: number;
  statusCode?: number;
};

const isJsonSyntaxError = (
  error: unknown
): error is SyntaxError & { body: unknown } => {
  return error instanceof SyntaxError && 'body' in error;
};

export const errorHandler: ErrorRequestHandler = (
  error: THttpError,
  _req,
  res,
  _next
) => {
  console.error(error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Файл слишком большой' });
      return;
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ error: 'Слишком много файлов' });
      return;
    }

    res.status(400).json({ error: 'Ошибка загрузки файла' });
    return;
  }

  if (isJsonSyntaxError(error)) {
    res.status(400).json({ error: 'Некорректный JSON' });
    return;
  }

  const status = error.status || error.statusCode || 500;

  res.status(status).json({
    error:
      status >= 500
        ? 'Внутренняя ошибка сервера'
        : error.message || 'Ошибка запроса',
  });
};
