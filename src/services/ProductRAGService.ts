import OpenAI from 'openai';
import { ProductVectorStoreService } from '../services/ProductVectorStoreService';
import { QueryParserService } from '../services/QueryParserService';
import { VectorItem } from '../types/rag';
import { config, openai } from '../config';
import { Logger } from '../utils/logger';

export class ProductRAGService {
  private openai: OpenAI;
  private vectorStore: ProductVectorStoreService;
  private queryParser: QueryParserService;

  constructor(items: VectorItem[]) {
    this.openai = openai;
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
   */
  async searchProductsNatural(query: string, limit: number = 5): Promise<{
    answer: string;
    products: Array<{
      id: string;
      title: string;
      similarity: number;
      price?: string;
      category: string;
      brand?: string;
    }>;
    tokensUsed: number;
    extractedFilters?: any;
    cleanedQuery?: string;
  }> {
    Logger.info('🤖 Processing natural language search:', query);

    try {
      // Parse query to extract filters automatically
      const { cleanedQuery, extractedFilters, searchFilters } = await this.queryParser.parseQuery(query);
      
      Logger.info(`🔍 Using cleaned query: "${cleanedQuery}"`);
      Logger.info('🎯 Auto-extracted filters:', searchFilters);

      // Use the existing search with auto-extracted filters
      const result = await this.searchProducts(cleanedQuery, { ...searchFilters, limit });

      return {
        ...result,
        extractedFilters,
        cleanedQuery
      };
      
    } catch (error) {
      Logger.error('❌ Natural language search failed:', error);
      // Fallback to original query without filters
      return await this.searchProducts(query, { limit });
    }
  }
  async searchProducts(query: string, filters?: {
    category?: string;
    maxPrice?: number;
    brand?: string;
    limit?: number;
  }): Promise<{
    answer: string;
    products: Array<{
      id: string;
      title: string;
      similarity: number;
      price?: string;
      category: string;
      brand?: string;
    }>;
    tokensUsed: number;
  }> {
    Logger.info('🔍 Processing product search:', query);

    const limit = filters?.limit || 3;
    const threshold = 0.4; // Más preciso para productos

    // 1. Search for relevant products
    let searchResults = await this.vectorStore.searchSimilar(query, limit, threshold);

    // 2. Apply filters if provided
    if (filters?.category) {
      searchResults = searchResults.filter(result => 
        result.item.category === filters.category
      );
    }

    if (filters?.maxPrice) {
      searchResults = searchResults.filter(result => 
        !result.item.price || result.item.price <= filters.maxPrice!
      );
    }

    if (filters?.brand) {
      searchResults = searchResults.filter(result => 
        result.item.brand === filters.brand
      );
    }

    // Limit final results
    searchResults = searchResults.slice(0, limit);

    if (searchResults.length === 0) {
      Logger.warn('⚠️ No relevant products found for query');
      return {
        answer: 'Lo siento, no encontré productos que coincidan con tu búsqueda. ¿Podrías ser más específico o probar con otros términos?',
        products: [],
        tokensUsed: 0,
      };
    }

    // 3. Build context from relevant products
    const productsContext = searchResults
      .map((result, index) =>
        `${index + 1}. **${result.item.title}** (Relevancia: ${(
          result.similarity * 100
        ).toFixed(1)}%)\n${result.item.content}\nPrecio: $${result.item.price || 'No disponible'}\nMarca: ${result.item.brand || 'N/A'}`
      )
      .join('\n\n');

    // 4. Generate contextualized response
    const systemPrompt = `Eres un experto asistente de compras. Tu trabajo es recomendar productos basándote ÚNICAMENTE en la información proporcionada.

INSTRUCCIONES:
1. Responde de forma amigable y útil
2. Menciona los productos más relevantes por nombre
3. Explica brevemente por qué cada producto es una buena opción
4. Incluye información de precios cuando sea relevante
5. Si la consulta no está bien cubierta, sugiere alternativas
6. Mantén un tono conversacional pero profesional

PRODUCTOS ENCONTRADOS:
${productsContext}

Responde como si fueras un vendedor experto recomendando estos productos específicos.`;

    const completion = await this.openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.4, // Un poco más creativo para recomendaciones
      max_tokens: 200,
    });

    const answer = completion.choices[0].message.content || 
      'No se pudo generar una recomendación.';
    const tokensUsed = completion.usage?.total_tokens || 0;

    Logger.success(`✅ Product search processed (${tokensUsed} tokens used)`);

    return {
      answer,
      products: searchResults.map((result) => ({
        id: result.item.id,
        title: result.item.title,
        similarity: result.similarity,
        category: result.item.category,
        brand: result.item.brand,
        price: result.item.price ? `$${result.item.price}` : undefined,
      })),
      tokensUsed,
    };
  }

  /**
   * Get vector store instance (for debugging/testing)
   */
  getVectorStore(): ProductVectorStoreService {
    return this.vectorStore;
  }
}