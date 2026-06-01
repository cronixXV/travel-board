import { z } from 'zod';

export const CreatePlaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional().nullable(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  visitedAt: z.string().date().optional().nullable(),
  isPublic: z.boolean().default(false),
});

export const UpdatePlaceSchema = CreatePlaceSchema.partial();

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof UpdatePlaceSchema>;
