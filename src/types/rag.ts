import { z } from 'zod';

// Base vector item schema
export const VectorItemSchema = z.object({
  id: z.string(),
  title: z.string(), // Nombre del producto
  content: z.string(), // Contenido para embedding (nombre + descripción + features)
  category: z.string(),
  price: z.number().optional(), // Precio del producto para filtros
  brand: z.string().optional(), // Marca del producto
  date: z.string().datetime(),
});

// Vector item with embedding schema  
export const VectorEmbedItemSchema = VectorItemSchema.extend({
  embedding: z.array(z.number()),
});

// Query schema for RAG searches
export const RAGQuerySchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  filters: z.object({
    category: z.string().optional(),
    maxPrice: z.number().positive().optional(),
    brand: z.string().optional(),
    limit: z.number().int().min(1).max(20).default(5),
  }).optional().default({}),
});

export const VectorStoreQuerySchema = z.object({
  query: z.string(),
  embedding: z.array(z.number()),
  limit: z.number().optional(),
  threshold: z.number().optional(),
});

export const VectorSearchResultSchema = z.object({
  item: VectorEmbedItemSchema,
  similarity: z.number(),
});

// RAG Response schema
export const RAGResponseSchema = z.object({
  success: z.boolean(),
  answer: z.string(),
  products: z.array(z.object({
    id: z.string(),
    title: z.string(),
    similarity: z.number(),
    price: z.string().optional(),
    category: z.string(),
    brand: z.string().optional(),
  })),
  metadata: z.object({
    query: z.string(),
    totalFound: z.number(),
    tokensUsed: z.number(),
    model: z.string(),
    processingTime: z.string(),
    workshop: z.string(),
  }),
});

export type VectorItem = z.infer<typeof VectorItemSchema>;
export type VectorEmbedItem = z.infer<typeof VectorEmbedItemSchema>;
export type RAGQuery = z.infer<typeof RAGQuerySchema>;
export type VectorStoreQuery = z.infer<typeof VectorStoreQuerySchema>;
export type VectorSearchResult = z.infer<typeof VectorSearchResultSchema>;
export type RAGResponse = z.infer<typeof RAGResponseSchema>;