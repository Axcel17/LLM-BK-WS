import { openai } from '../config';
import { Logger } from '../utils/logger';
import { ProductRAGService } from './ProductRAGService';
import { PurchasePoliciesService } from './PurchasePoliciesService';
import { PRODUCTS_CATALOG } from '../data/product-catalog';
import {
  SearchProductsRequest,
  SearchProductsResult,
  GetPurchasePoliciesRequest,
  PurchasePoliciesResult,
  ToolResponse,
} from '../types/tools';


// Define the schema for the tool's input and output
export const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'search_products',
      description: 'Search products using natural language queries with automatic filter extraction. Extracts brands, price ranges (min/max), categories, and features from user queries. Use this when user asks to find, search, or discover products with any criteria including budget constraints.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Natural language search query including any criteria like brand preferences, price ranges, categories, features, etc. Examples: "wireless headphones under $200", "Nike shoes between $100-300", "home cleaning products for floors"'
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
      name: 'get_purchase_policies',
      description: 'Search company purchase policies, terms, procedures and FAQ information. Use this when user asks about returns, discounts, shipping, payments, warranties, corporate policies, or any company procedure questions.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Natural language query about policies, procedures, or company information. Examples: "return policy", "shipping costs", "how to get refund", "corporate discounts", "warranty terms"'
          },
          category: {
            type: 'string',
            enum: ['returns', 'discounts', 'shipping', 'payments', 'warranties', 'corporate', 'general'],
            description: 'Optional category filter to narrow search to specific policy type'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of policies to return (default: 5, max: 10)',
            minimum: 1,
            maximum: 10
          }
        },
        required: ['query']
      }
    }
  }
];

export class ToolService {
  private ragService: ProductRAGService;
  private policiesService: PurchasePoliciesService;
  private isInitialized = false;

  constructor() {
    this.ragService = new ProductRAGService(PRODUCTS_CATALOG);
    this.policiesService = new PurchasePoliciesService();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    Logger.info('🔧 Initializing Tool Service...');
    await this.ragService.initialize();
    this.isInitialized = true;
    Logger.success('✅ Tool Service ready with search_products and get_purchase_policies tools');
  }


  async searchProducts(params: SearchProductsRequest): Promise<ToolResponse> {
    const startTime = Date.now();
    
    try {
      Logger.info(`🔍 Tool: search_products("${params.query}", limit=${params.limit})`);
      
      // Use the complete natural language search that handles everything internally
      const searchResult = await this.ragService.searchProductsNaturalLanguage(params.query, params.limit);
      
      // Transform to tool response format
      const result: SearchProductsResult = {
        products: searchResult.products.map(product => ({
          id: product.id,
          title: product.title,
          category: product.category,
          price: product.price,
          brand: product.brand,
          similarity: product.similarity || 0,
          summary: product.title
        })),
        total_found: searchResult.products.length,
        search_query: params.query,
        filters_applied: searchResult.filters || {}
      };

      const processingTime = Date.now() - startTime;
      Logger.success(`✅ search_products completed in ${processingTime}ms: ${result.total_found} products found`);

      return {
        success: true,
        data: result,
        tokens_used: searchResult.tokensUsed,
        execution_time_ms: processingTime,
        tool_name: 'search_products'
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      Logger.error('❌ search_products failed:', error);

      return {
        success: false,
        data: { error: `Error searching products: ${error instanceof Error ? error.message : 'Unknown error'}` },
        tokens_used: 0,
        execution_time_ms: processingTime,
        tool_name: 'search_products'
      };
    }
  }

  async getPurchasePolicies(params: GetPurchasePoliciesRequest): Promise<ToolResponse> {
    const startTime = Date.now();
    
    try {
      Logger.info(`📋 Tool: get_purchase_policies("${params.query}"${params.category ? `, category: ${params.category}` : ''})`);
      
      // Search policies using the service
      const searchResult = this.policiesService.searchPolicies(
        params.query,
        params.category,
        params.limit
      );
      
      // Transform to tool response format
      const result: PurchasePoliciesResult = {
        policies: searchResult.policies,
        total_found: searchResult.total_found,
        search_query: params.query,
        category_filter: params.category,
        available_categories: searchResult.available_categories
      };

      const processingTime = Date.now() - startTime;
      Logger.success(`✅ get_purchase_policies completed in ${processingTime}ms: ${result.total_found} policies found`);

      return {
        success: true,
        data: result,
        tokens_used: 0, // Policy search doesn't use OpenAI tokens
        execution_time_ms: processingTime,
        tool_name: 'get_purchase_policies'
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      Logger.error('❌ get_purchase_policies failed:', error);

      return {
        success: false,
        data: { error: `Error searching policies: ${error instanceof Error ? error.message : 'Unknown error'}` },
        tokens_used: 0,
        execution_time_ms: processingTime,
        tool_name: 'get_purchase_policies'
      };
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  getToolDefinitions() {
    return TOOL_DEFINITIONS;
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }

  async executeToolCall(toolName: string, params: any): Promise<ToolResponse> {

    if (!this.isInitialized) {
      await this.initialize();
    }

    switch (toolName) {
      case 'search_products':
        return await this.searchProducts(params);
      case 'get_purchase_policies':
        return await this.getPurchasePolicies(params);
      default:
        Logger.error(`❌ Unknown tool: ${toolName}`);
        return {
          success: false,
          data: { error: 'Unknown tool', tool_name: toolName },
          tool_name: toolName
        };
    }
  }
}