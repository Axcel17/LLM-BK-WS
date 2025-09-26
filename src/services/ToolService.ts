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
   * Tool 1: Search Products (leverages existing RAG)
   */
  async searchProducts(params: SearchProductsRequest, context?: ToolCallContext): Promise<ToolResponse> {
    const startTime = Date.now();
    
    try {
      Logger.info(`🔍 Tool: search_products("${params.query}", limit=${params.limit})`);
      
      // Use existing RAG natural language search
      const ragResult = await this.ragService.searchProductsNatural(params.query, params.limit);
      
      // Transform to tool response format
      const result: SearchProductsResult = {
        products: ragResult.products.map(product => ({
          id: product.id,
          title: product.title,
          category: product.category,
          price: product.price,
          brand: product.brand,
          similarity_score: product.similarity,
          summary: product.title // Keep it concise for token efficiency
        })),
        total_found: ragResult.products.length,
        search_query: ragResult.cleanedQuery || params.query,
        filters_applied: ragResult.extractedFilters
      };

      const executionTime = Date.now() - startTime;
      Logger.success(`✅ search_products found ${result.total_found} products (${executionTime}ms)`);

      return {
        success: true,
        data: result,
        tokens_used: ragResult.tokensUsed,
        execution_time_ms: executionTime,
        tool_name: 'search_products'
      };

    } catch (error) {
      Logger.error('❌ search_products failed:', error);
      return {
        success: false,
        data: { error: 'Search failed', message: (error as Error).message },
        execution_time_ms: Date.now() - startTime,
        tool_name: 'search_products'
      };
    }
  }

  /**
   * Tool 2: Get Product Details
   */
  async getProductDetails(params: GetProductDetailsRequest, context?: ToolCallContext): Promise<ToolResponse> {
    const startTime = Date.now();
    
    try {
      Logger.info(`📋 Tool: get_product_details("${params.product_id}")`);
      
      // Find product in catalog
      const product = PRODUCTS_CATALOG.find(p => p.id === params.product_id);
      
      if (!product) {
        return {
          success: false,
          data: { error: 'Product not found', product_id: params.product_id },
          execution_time_ms: Date.now() - startTime,
          tool_name: 'get_product_details'
        };
      }

      // Extract features and specifications from content
      const features = this.extractFeatures(product.content);
      const specifications = this.extractSpecifications(product);

      const result: ProductDetailsResult = {
        product: {
          id: product.id,
          title: product.title,
          content: product.content,
          category: product.category,
          price: product.price ? `$${product.price}` : undefined,
          brand: product.brand,
          features,
          specifications
        }
      };

      const executionTime = Date.now() - startTime;
      Logger.success(`✅ get_product_details loaded "${product.title}" (${executionTime}ms)`);

      return {
        success: true,
        data: result,
        execution_time_ms: executionTime,
        tool_name: 'get_product_details'
      };

    } catch (error) {
      Logger.error('❌ get_product_details failed:', error);
      return {
        success: false,
        data: { error: 'Failed to get product details', message: (error as Error).message },
        execution_time_ms: Date.now() - startTime,
        tool_name: 'get_product_details'
      };
    }
  }

  /**
   * Tool 3: Compare Products
   */
  async compareProducts(params: CompareProductsRequest, context?: ToolCallContext): Promise<ToolResponse> {
    const startTime = Date.now();
    
    try {
      Logger.info(`⚖️ Tool: compare_products([${params.product_ids.join(', ')}])`);
      
      // Find all products
      const products = params.product_ids.map(id => {
        const product = PRODUCTS_CATALOG.find(p => p.id === id);
        if (!product) {
          throw new Error(`Product not found: ${id}`);
        }
        return product;
      });

      // Build comparison table
      const comparisonTable = params.comparison_criteria.map(criteria => {
        const values: Record<string, string> = {};
        let winner: string | undefined;

        products.forEach(product => {
          values[product.id] = this.getProductValueForCriteria(product, criteria);
        });

        // Determine winner for this criteria
        winner = this.determineWinner(products, criteria);

        return {
          criteria,
          values,
          winner
        };
      });

      // Generate concise summary
      const summary = this.generateComparisonSummary(products, comparisonTable);

      const result: CompareProductsResult = {
        comparison: {
          products: products.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            price: p.price ? `$${p.price}` : undefined,
            brand: p.brand
          })),
          comparison_table: comparisonTable,
          summary,
          recommendation: this.generateRecommendation(products, comparisonTable, context)
        },
        criteria_used: params.comparison_criteria
      };

      const executionTime = Date.now() - startTime;
      Logger.success(`✅ compare_products completed ${products.length} products (${executionTime}ms)`);

      return {
        success: true,
        data: result,
        execution_time_ms: executionTime,
        tool_name: 'compare_products'
      };

    } catch (error) {
      Logger.error('❌ compare_products failed:', error);
      return {
        success: false,
        data: { error: 'Comparison failed', message: (error as Error).message },
        execution_time_ms: Date.now() - startTime,
        tool_name: 'compare_products'
      };
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private extractFeatures(content: string): string[] {
    // Extract key features from product content
    const features: string[] = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      // Look for bullet points, key phrases, etc.
      if (line.includes('•') || line.includes('-') || line.includes('✓')) {
        features.push(line.trim().replace(/^[•\-✓]\s*/, ''));
      }
    });

    // Fallback: extract sentences that mention key product attributes
    if (features.length === 0) {
      const keyWords = ['calidad', 'resistente', 'cómodo', 'rendimiento', 'batería', 'diseño'];
      const sentences = content.split('.').filter(sentence => 
        keyWords.some(word => sentence.toLowerCase().includes(word))
      ).slice(0, 3);
      
      features.push(...sentences.map(s => s.trim()));
    }

    return features.slice(0, 5); // Limit to 5 features for token efficiency
  }

  private extractSpecifications(product: any): Record<string, string> {
    const specs: Record<string, string> = {};
    
    if (product.price) specs['Precio'] = `$${product.price}`;
    if (product.brand) specs['Marca'] = product.brand;
    specs['Categoría'] = product.category;
    
    // Extract additional specs from content
    const content = product.content.toLowerCase();
    if (content.includes('bluetooth')) specs['Conectividad'] = 'Bluetooth';
    if (content.includes('usb')) specs['Conectividad'] = specs['Conectividad'] ? `${specs['Conectividad']}, USB` : 'USB';
    if (content.includes('inalámbrico') || content.includes('wireless')) specs['Tipo'] = 'Inalámbrico';
    
    return specs;
  }

  private getProductValueForCriteria(product: any, criteria: string): string {
    switch (criteria.toLowerCase()) {
      case 'price':
      case 'precio':
        return product.price ? `$${product.price}` : 'No especificado';
      
      case 'brand':
      case 'marca':
        return product.brand || 'No especificado';
      
      case 'category':
      case 'categoría':
        return product.category;
      
      case 'features':
      case 'características':
        const features = this.extractFeatures(product.content);
        return features.slice(0, 2).join(', ') || 'Ver detalles';
      
      default:
        return 'No evaluado';
    }
  }

  private determineWinner(products: any[], criteria: string): string | undefined {
    if (criteria.toLowerCase() === 'price' || criteria.toLowerCase() === 'precio') {
      // Lowest price wins
      const productsWithPrice = products.filter(p => p.price);
      if (productsWithPrice.length === 0) return undefined;
      
      return productsWithPrice.reduce((min, current) => 
        current.price < min.price ? current : min
      ).id;
    }
    
    // For other criteria, no clear winner determination
    return undefined;
  }

  private generateComparisonSummary(products: any[], comparisonTable: any[]): string {
    const productCount = products.length;
    const categories = [...new Set(products.map(p => p.category))];
    
    let summary = `Comparando ${productCount} productos`;
    
    if (categories.length === 1) {
      summary += ` de ${categories[0]}`;
    }
    
    // Find price range
    const prices = products.filter(p => p.price).map(p => p.price);
    if (prices.length > 1) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      summary += `. Rango de precios: $${minPrice} - $${maxPrice}`;
    }
    
    return summary;
  }

  private generateRecommendation(products: any[], comparisonTable: any[], context?: ToolCallContext): string | undefined {
    // Simple recommendation logic based on context
    if (context?.budget_limit) {
      const affordableProducts = products.filter(p => p.price && p.price <= context.budget_limit!);
      if (affordableProducts.length > 0) {
        const cheapest = affordableProducts.reduce((min, current) => 
          current.price < min.price ? current : min
        );
        return `Para tu presupuesto de $${context.budget_limit}, recomendamos: ${cheapest.title}`;
      }
    }
    
    // Default: recommend based on best balance of features and price
    const productsWithPrice = products.filter(p => p.price);
    if (productsWithPrice.length > 0) {
      const balanced = productsWithPrice.sort((a, b) => a.price - b.price)[Math.floor(productsWithPrice.length / 2)];
      return `Equilibrio precio-calidad: ${balanced.title}`;
    }
    
    return undefined;
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
      
      case 'get_product_details':
        return await this.getProductDetails(params, context);
      
      case 'compare_products':
        return await this.compareProducts(params, context);
      
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