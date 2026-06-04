import { z } from 'zod';

export const CreatePlaceSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional().nullable(),
  lat: z.number(),
  lng: z.number(),
  visitedAt: z.string().optional().nullable(),
  isPublic: z.boolean().default(false),
});

export const UpdatePlaceSchema = z.object({
  name: z.string().min(1, 'Название обязательно').optional(),
  description: z.string().optional().nullable(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  visitedAt: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
});

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof UpdatePlaceSchema>;
