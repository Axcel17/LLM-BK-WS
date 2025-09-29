import { openai } from '../config';
import { Logger } from '../utils/logger';
import { ProductRAGService } from './ProductRAGService';
import { PRODUCTS_CATALOG } from '../data/product-catalog';
import {
  TOOL_DEFINITIONS,
  SearchProductsRequest,
  GetProductDetailsRequest,
  CompareProductsRequest,
  SearchProductsResult,
  ProductDetailsResult,
  CompareProductsResult,
  ToolResponse,
  ToolCallContext
} from '../types/tools';

export class ToolService {
  private ragService: ProductRAGService;
  private isInitialized = false;

  constructor() {
    this.ragService = new ProductRAGService(PRODUCTS_CATALOG);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    Logger.info('🔧 Initializing Tool Service...');
    await this.ragService.initialize();
    this.isInitialized = true;
    Logger.success('✅ Tool Service ready with 3 core tools');
  }

  // ============================================================================
  // CORE TOOL IMPLEMENTATIONS
  // ============================================================================

  /**
   * Tool 1: Search Products (uses refactored RAG service with functional utilities)
   */
  async searchProducts(params: SearchProductsRequest, context?: ToolCallContext): Promise<ToolResponse> {
    const startTime = Date.now();
    
    try {
      Logger.info(`🔍 Tool: search_products("${params.query}", limit=${params.limit})`);
      
      // Use refactored RAG service that now uses functional utilities internally
      const searchResult = await this.ragService.searchProductsNaturalLanguage(params.query, params.limit);
      
      // Transform to tool response format
      const result: SearchProductsResult = {
        products: searchResult.products.map(product => ({
          id: product.id,
          title: product.title,
          category: product.category,
          price: product.price,
          brand: product.brand,
          similarity: product.similarity,
          summary: product.title
        })),
        total_found: searchResult.products.length,
        search_query: params.query,
        filters_applied: searchResult.filters
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

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  getToolDefinitions() {
    return TOOL_DEFINITIONS;
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }

  async executeToolCall(toolName: string, params: any, context?: ToolCallContext): Promise<ToolResponse> {

    if (!this.isInitialized) {
      await this.initialize();
    }

    switch (toolName) {
      case 'search_products':
        return await this.searchProducts(params, context);
      
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