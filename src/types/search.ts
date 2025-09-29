import { z } from 'zod';

// Base vector item schema
export const VectorItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  price: z.number().optional(),
  brand: z.string().optional(),
  date: z.string().datetime(),
});

export type VectorItem = z.infer<typeof VectorItemSchema>;