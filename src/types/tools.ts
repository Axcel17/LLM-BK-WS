import { z } from 'zod';

// ============================================================================
// TOOL DEFINITIONS - OpenAI Function Calling Format
// ============================================================================

export const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'search_products',
      description: 'Find products using semantic search. Use this when user asks to find, search, or discover products.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Natural language search query (e.g., "wireless headphones for work")'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return (default: 5, max: 10)',
            minimum: 1,
            maximum: 10
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_product_details',
      description: 'Get detailed information about a specific product. Use when user wants to know more about a particular product.',
      parameters: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: 'The unique identifier of the product'
          }
        },
        required: ['product_id']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'compare_products',
      description: 'Compare 2-4 products side by side. Use when user wants to compare specific products or asks "which is better".',
      parameters: {
        type: 'object',
        properties: {
          product_ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of product IDs to compare (2-4 products)',
            minItems: 2,
            maxItems: 4
          },
          comparison_criteria: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Optional criteria to focus comparison on (e.g., ["price", "features", "performance"])',
            default: ['price', 'features', 'category']
          }
        },
        required: ['product_ids']
      }
    }
  }
];

// ============================================================================
// ZOD SCHEMAS FOR TYPE SAFETY
// ============================================================================

// Tool Request Schemas
export const SearchProductsSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  limit: z.number().min(1).max(10).default(5)
});

export const GetProductDetailsSchema = z.object({
  product_id: z.string().min(1, 'Product ID cannot be empty')
});

export const CompareProductsSchema = z.object({
  product_ids: z.array(z.string()).min(2, 'Need at least 2 products').max(4, 'Maximum 4 products'),
  comparison_criteria: z.array(z.string()).default(['price', 'features', 'category'])
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

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type SearchProductsRequest = z.infer<typeof SearchProductsSchema>;
export type GetProductDetailsRequest = z.infer<typeof GetProductDetailsSchema>;  
export type CompareProductsRequest = z.infer<typeof CompareProductsSchema>;
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
    similarity_score: number;
    summary: string;
  }>;
  total_found: number;
  search_query: string;
  filters_applied?: any;
}

export interface ProductDetailsResult {
  product: {
    id: string;
    title: string;
    content: string;
    category: string;
    price?: string;
    brand?: string;
    features: string[];
    specifications: Record<string, string>;
  };
}

export interface CompareProductsResult {
  comparison: {
    products: Array<{
      id: string;
      title: string;
      category: string;
      price?: string;
      brand?: string;
    }>;
    comparison_table: Array<{
      criteria: string;
      values: Record<string, string>; // product_id -> value
      winner?: string; // product_id of best option
    }>;
    summary: string;
    recommendation?: string;
  };
  criteria_used: string[];
}

// Tool Function Type
export type ToolFunction = 
  | 'search_products' 
  | 'get_product_details' 
  | 'compare_products';

// Tool Call Context
export interface ToolCallContext {
  conversation_id?: string;
  user_query: string;
  previous_results?: any[];
  budget_limit?: number;
  user_preferences?: Record<string, any>;
}