import { z } from 'zod';

// Base product schema
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  brand: z.string(),
  features: z.array(z.string()),
  imageUrl: z.string().optional(),
  rating: z.number(),
  reviewCount: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;