import OpenAI from 'openai';
import { ProductVectorStoreService } from '../services/ProductVectorStoreService';
import { QueryParserService } from '../services/QueryParserService';
import { VectorItem, VectorSearchResult } from '../types/search';
import { FilteredProductsResult, SmartRecommendationInput, ProductRecommendation, ProductFilters } from '../types/product';
import { config, openai } from '../config';
import { Logger } from '../utils/logger';

export class ProductRAGService {
  private openai: OpenAI;
  private vectorStore: ProductVectorStoreService;
  private queryParser: QueryParserService;
  private items: VectorItem[];

  constructor(items: VectorItem[]) {
    this.openai = openai;
    this.items = items;
    this.vectorStore = new ProductVectorStoreService(items);
    this.queryParser = new QueryParserService();
  }

  /**
   * Initialize RAG service
   */
  async initialize(): Promise<void> {
    Logger.info('🔄 Initializing Product RAG service...');
    await this.vectorStore.initialize();
    Logger.success('✅ Product RAG service ready');
  }

  /**
   * Search products using natural language (with automatic filter extraction)
   * Now uses functional utilities pipeline
   */
  async searchProductsNaturalLanguage(query: string, limit: number = 3): Promise<{
    answer: string;
    products: Array<{
      id: string;
      title: string;
      similarity?: number;
      price?: string;
      category: string;
      brand?: string;
    }>;
    tokensUsed: number;
    filters?: any;
  }> {
    Logger.info('🚀 Processing natural language search with smart pipeline:', query);

    try {
      // 1. Extract filters using improved QueryParserService (hybrid approach)
      const extractedFilters = await this.queryParser.extractFilters(query);
      
      // 2. Search products with extracted filters
      return await this.searchProducts(query, extractedFilters, limit);

    } catch (error) {
      Logger.error('❌ Error during natural language search:', error);

      // Fallback to basic search without filters
      return await this.searchProducts(query);
    }
  }

  async searchProducts(query: string, filters?: ProductFilters, limit: number = 5): Promise<{
    answer: string;
    products: Array<{
      id: string;
      title: string;
      price?: string;
      category: string;
      brand?: string;
      similarity?: number;
    }>;
    tokensUsed: number;
    filters?: ProductFilters;
  }> {
    Logger.info('🔍 Processing product search:', query);
    Logger.info('🎯 With filters:', filters);

    try {

      // 1. Search products using vector similarity  
      const searchResults = await this.searchProductsByVector(query, limit * 2);

      // 2. Apply extracted filters to products
      let { matching, nonMatching } = this.vectorStore.applyFiltersToProducts(searchResults, filters);

      matching = matching.slice(0, limit);

      Logger.info(`🔍 Limited to top ${limit} matching products`);

      // 3. Generate AI recommendation with budget awareness
      const { answer, tokensUsed } = await this.generateProductRecommendation({
        query,
        filteredProducts: { matching, nonMatching },
        filters
      });

      return {
        answer,
        products: matching.map(product => ({
          id: product.id,
          title: product.title,
          price: product.price ? `$${product.price}` : undefined,
          category: product.category,
          brand: product.brand,
          similarity: product.similarity,
        })),
        tokensUsed,
        filters
      };
      
    } catch (error) {
      
      // Fallback to simple vector search without filters
      const searchResults = await this.searchProductsByVector(query, limit);
      const simpleFilteredResults = {
        matching: searchResults.map(result => ({
          id: result.item.id,
          title: result.item.title,
          price: result.item.price || 0,
          category: result.item.category,
          brand: result.item.brand,
          description: result.item.content,
          similarity: result.similarity,
        })),
        nonMatching: []
      };
      const { answer, tokensUsed } = await this.generateProductRecommendation({
        query,
        filteredProducts: simpleFilteredResults
      });

      return {
        answer,
        products: simpleFilteredResults.matching.map(product => ({
          id: product.id,
          title: product.title,
          category: product.category,
          brand: product.brand,
          price: product.price ? `$${product.price}` : undefined,
          similarity: product.similarity,
        })),
        tokensUsed,
        filters
      };
    }
  }
  /**
   * Search products using vector similarity (internal method)
   */
  private async searchProductsByVector(
    query: string, 
    limit: number = 5,
    threshold: number = 0.35
  ): Promise<VectorSearchResult[]> {
    Logger.info('🔍 Performing internal vector search:', query);

    // Use our vector store to search for similar products
    const searchResults = await this.vectorStore.searchSimilar(query, limit, threshold);

    if (searchResults.length === 0) {
      Logger.warn('⚠️ No products found above similarity threshold');
      return [];
    }

    Logger.success(`✅ Found ${searchResults.length} relevant products`);
    return searchResults;
  }

  /**
   * Generate AI recommendation based on filtered products (internal method)
   */
  private async generateProductRecommendation(input: SmartRecommendationInput): Promise<{
    answer: string;
    tokensUsed: number;
  }> {
    Logger.info('🤖 Generating smart AI recommendation');

    const { filteredProducts, query, filters } = input;

    if (filteredProducts.matching.length === 0 && filteredProducts.nonMatching.length === 0) {
      return {
        answer: 'Lo siento, no encontré productos que coincidan con tu búsqueda. ¿Podrías ser más específico o probar con otros términos?',
        tokensUsed: 0
      };
    }

    // Build context for matching products
    let contextsContent = '';

    if (filteredProducts.matching.length > 0) {
      const matchingContext = filteredProducts.matching
        .map((product, index) =>
          `${index + 1}. **${product.title}** ✅ DENTRO DE CRITERIOS\nPrecio: $${product.price || 'No disponible'}\nMarca: ${product.brand || 'N/A'}\nDescripción: ${product.description.substring(0, 100)}...`
        )
        .join('\n\n');
      contextsContent += `PRODUCTOS QUE CUMPLEN TUS CRITERIOS:\n${matchingContext}\n\n`;
    }

    if (filteredProducts.nonMatching.length > 0 && filters?.maxPrice) {
      const notMatchingContext = filteredProducts.nonMatching
        .slice(0, 3) // Limitar a los 3 más relevantes
        .map((product, index) => {
          return `${index + 1}. **${product.title}** ⚠️ FUERA DE PRESUPUESTO\nPrecio: $${product.price || 'No disponible'} (excede $${filters.maxPrice})\nMarca: ${product.brand || 'N/A'}\nMotivo: ${product.reason}`;
        })
        .join('\n\n');
      contextsContent += `PRODUCTOS FUERA DE TU PRESUPUESTO PERO RELEVANTES:\n${notMatchingContext}`;
    }

    const systemPrompt = `Eres un experto asistente de compras. 
Tu trabajo es dar recomendaciones inteligentes de nuestros productos. 
Te pasaremos una listado de productos QUE CUMPLEN CON SU INTENCION DE COMPRA y otros que están FUERA DEL PRESUPUESTO pero relevantes, en caso de que aplique. 
Usa esta información para ayudar al usuario a tomar la mejor decisión de compra.

INSTRUCCIONES:
1. Si hay productos DENTRO de criterios: recomiéndalos con entusiasmo
2. Si NO hay productos dentro del presupuesto: explica la situación de forma empática y ofrece las mejores alternativas
3. Menciona precios específicos para ayudar en la decisión
4. Si sugiere productos fuera del presupuesto, explica el beneficio extra que obtendrían

CONTEXTO DE PRODUCTOS:
${contextsContent}

Genera una respuesta útil que ayude al usuario a tomar la mejor decisión.`;

    try {

      const completion = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.4,
        max_tokens: 250, // Más tokens para respuestas más detalladas
      });

      const answer = completion.choices[0].message.content || 
        'No se pudo generar una recomendación.';
      const tokensUsed = completion.usage?.total_tokens || 0;

      Logger.success(`✅ Smart recommendation generated (${tokensUsed} tokens used)`);

      return {
        answer,
        tokensUsed
      };

    } catch (error) {
      Logger.error('❌ Failed to generate recommendation:', error);
      return {
        answer: 'Lo siento, no pude generar una recomendación en este momento.',
        tokensUsed: 0
      };
    }
  }

  /**
   * Get vector store instance (for debugging/testing)
   */
  getVectorStore(): ProductVectorStoreService {
    return this.vectorStore;
  }
}