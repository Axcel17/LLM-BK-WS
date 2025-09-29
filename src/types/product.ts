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

// Product filters for searches  
export const ProductFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  priceRange: z.enum(['economic', 'mid-range', 'premium']).optional(),
  occasion: z.string().optional(),
  targetUser: z.string().optional()
});

export type ProductFilters = z.infer<typeof ProductFiltersSchema>;

// Search filters for vector store operations
export interface ProductSearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Product with similarity score (for search results)
export interface ProductSearchResult {
  id: string;
  title: string;
  price: number;
  category: string;
  brand?: string;
  description: string;
  similarity?: number;
}

// Result of filtered products with smart recommendations
export interface FilteredProductsResult {
  matching: ProductSearchResult[];
  nonMatching: Array<ProductSearchResult & {
    reason: string;
  }>;
}

// Product recommendation response
export interface ProductRecommendation {
  answer: string;
  tokensUsed: number;
  products: Array<{
    id: string;
    title: string;
    similarity: number;
    price?: string;
    category: string;
    brand?: string;
  }>;
}

// Input for generating smart product recommendations
export interface SmartRecommendationInput {
  query: string;
  filteredProducts: FilteredProductsResult;
  filters?: ProductFilters;
}