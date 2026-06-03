import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    error: 'Слишком много попыток. Попробуйте снова через 15 минут.',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: {
    error: 'Слишком много запросов обновления сессии. Попробуйте позже.',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});
