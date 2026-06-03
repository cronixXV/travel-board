import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.string().default('3000'),

  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL обязателен',
  }),

  JWT_SECRET: z
    .string({
      required_error: 'JWT_SECRET обязателен',
    })
    .min(32, 'JWT_SECRET должен быть минимум 32 символа'),

  JWT_REFRESH_SECRET: z
    .string({
      required_error: 'JWT_REFRESH_SECRET обязателен',
    })
    .min(32, 'JWT_REFRESH_SECRET должен быть минимум 32 символа'),

  CLIENT_URL: z.string().default('http://localhost:5173'),

  APP_PUBLIC_URL: z.string().default('http://localhost:3000'),

  API_PUBLIC_URL: z.string().default('http://localhost:3000'),

  CLIENT_DIST_PATH: z.string().optional(),

  UPLOADS_DIR: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Ошибка конфигурации:');
  parsed.error.issues.forEach((issue) =>
    console.error(` • ${issue.path.join('.')}: ${issue.message}`)
  );
  process.exit(1);
}

export const env = parsed.data;
