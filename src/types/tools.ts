import { z } from 'zod';

// Tool Request Schemas
export const SearchProductsSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  limit: z.number().min(1).max(10).default(5)
});

export const GetPurchasePoliciesSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  category: z.enum(['returns', 'discounts', 'shipping', 'payments', 'warranties', 'corporate', 'general']).optional(),
  limit: z.number().min(1).max(10).default(5)
});

// Tool Response Schemas
export const ToolResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  tokens_used: z.number().optional(),
  execution_time_ms: z.number().optional(),
  tool_name: z.string()
});

export const ChatWithToolsSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversation_id: z.string().optional(),
  max_tokens: z.number().min(50).max(500).default(300),
  include_tool_details: z.boolean().default(false)
});

export type SearchProductsRequest = z.infer<typeof SearchProductsSchema>;
export type GetPurchasePoliciesRequest = z.infer<typeof GetPurchasePoliciesSchema>;
export type ToolResponse = z.infer<typeof ToolResponseSchema>;
export type ChatWithToolsRequest = z.infer<typeof ChatWithToolsSchema>;

// Tool Results Types
export interface SearchProductsResult {
  products: Array<{
    id: string;
    title: string;
    category: string;
    price?: string;
    brand?: string;
    similarity?: number;
    summary: string;
  }>;
  total_found: number;
  search_query: string;
  filters_applied?: any
}

// Purchase Policies Result
export interface PurchasePoliciesResult {
  policies: Array<{
    id: string;
    category: string;
    title: string;
    question: string;
    answer: string;
    last_updated: string;
    relevance_score?: number;
  }>;
  total_found: number;
  search_query: string;
  category_filter?: string;
  available_categories: string[];
}