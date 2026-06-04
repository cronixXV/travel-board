import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Введите почту')
    .email('Некорректный email')
    .transform((value) => value.toLowerCase()),

  password: z.string().min(8, 'Минимум 8 символов'),

  username: z
    .string()
    .trim()
    .min(3, 'Минимум 3 символа')
    .max(30, 'Максимум 30 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только латинские буквы, цифры и _')
    .transform((value) => value.toLowerCase()),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Введите почту')
    .email('Некорректный email')
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1, 'Введите пароль'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
