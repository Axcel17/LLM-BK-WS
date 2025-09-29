import OpenAI from 'openai';
import {
  VectorItem,
  VectorEmbedItem,
  VectorStoreQuery,
  VectorSearchResult,
} from '../types/search';
import { ProductFilters, ProductSearchFilters, FilteredProductsResult } from '../types/product';
import { config } from '../config';
import { Logger } from '../utils/logger';
import { EmbeddingCacheService } from '../cache/EmbeddingCacheService';

export class ProductVectorStoreService {
  private openai: OpenAI;
  private items: VectorEmbedItem[] = [];
  private isInitialized = false;
  private sourceItems: VectorItem[];
  private cache: EmbeddingCacheService;

  constructor(items: VectorItem[]) {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.sourceItems = items;
    this.cache = new EmbeddingCacheService();
  }

  /**
   * Initialize vector store by creating embeddings for all products
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    Logger.info('🔄 Initializing product vector store...');

    try {
      // Try to load from cache first
      const cachedEmbeddings = await this.cache.loadFromCache(
        this.sourceItems,
        config.openai.embeddingModel
      );

      if (cachedEmbeddings) {
        this.items = cachedEmbeddings;
        this.isInitialized = true;
        Logger.success(
          `✅ Product vector store initialized from cache with ${this.items.length} products`
        );
        return;
      }

      // Generate embeddings if no valid cache
      Logger.info('🔄 Generating new embeddings...');
      const itemsWithEmbeddings = await Promise.all(
        this.sourceItems.map(async (item) => {
          const embedding = await this.createEmbedding(item.content);
          return {
            ...item,
            embedding,
          } as VectorEmbedItem;
        })
      );

      this.items = itemsWithEmbeddings;
      this.isInitialized = true;

      // Save to cache
      await this.cache.saveToCache(
        this.sourceItems,
        this.items,
        config.openai.embeddingModel
      );

      Logger.success(
        `✅ Product vector store initialized with ${this.items.length} products`
      );
    } catch (error) {
      Logger.error('❌ Failed to initialize product vector store:', error);
      throw error;
    }
  }

  /**
   * Create embedding for text using OpenAI's embedding model
   */
  private async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: config.openai.embeddingModel, // text-embedding-3-large
      input: text,
    });

    return response.data[0].embedding;
  }

  /**
   * Search for similar products based on query
   */
  async searchSimilar(
    query: string,
    limit: number = 3,
    threshold: number = 0.4 // Más permisivo para productos
  ): Promise<VectorSearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    Logger.debug('🔍 Searching product vector store for:', query);

    // Create embedding for the query
    const queryEmbedding = await this.createEmbedding(query);

    // Calculate similarity with all products
    const similarities = this.items.map((item) => ({
      item,
      similarity: this.cosineSimilarity(queryEmbedding, item.embedding),
    }));


    Logger.debug(
      `🏆 Top ${limit} most similar products:`,
      similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map((result) => ({
          id: result.item.id,
          name: result.item.title,
          similarity: result.similarity,
        }))
    );

    // Filter by threshold and sort by similarity
    const results = similarities
      .filter((result) => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return results;
  }

  /**
   * Search products by category
   */
  async searchByCategory(category: string, limit: number = 10): Promise<VectorEmbedItem[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.items
      .filter(item => item.category === category)
      .slice(0, limit);
  }

  /**
   * Search products by brand
   */
  async searchByBrand(brand: string, limit: number = 10): Promise<VectorEmbedItem[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.items
      .filter(item => item.brand === brand)
      .slice(0, limit);
  }

  /**
   * Search products by price range
   */
  async searchByPriceRange(minPrice: number, maxPrice: number, limit: number = 10): Promise<VectorEmbedItem[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.items
      .filter(item => item.price && item.price >= minPrice && item.price <= maxPrice)
      .slice(0, limit);
  }

  /**
   * Get random products (for "sorpréndeme" type queries)
   */
  getRandomProducts(limit: number = 3): VectorEmbedItem[] {
    const shuffled = [...this.items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same dimension');
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Get all products (for debugging)
   */
  getAllItems(): VectorEmbedItem[] {
    return this.items;
  }

  /**
   * Get product by ID
   */
  getItemById(id: string): VectorEmbedItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  /**
   * Get stats about the vector store
   */
  getStats() {
    const categories = [...new Set(this.items.map(item => item.category))];
    const brands = [...new Set(this.items.map(item => item.brand).filter(Boolean))];
    const priceRange = this.items
      .filter(item => item.price)
      .map(item => item.price!)
      .sort((a, b) => a - b);

    return {
      totalProducts: this.items.length,
      categories,
      brands,
      priceRange: {
        min: priceRange[0] || 0,
        max: priceRange[priceRange.length - 1] || 0,
      },
      isInitialized: this.isInitialized
    };
  }

  /**
   * Apply filters to product search results with detailed analysis
   * Returns both matching and non-matching products with reasons
   */
  applyFiltersToProducts(
    products: VectorSearchResult[], 
    filters: ProductSearchFilters,
  ): FilteredProductsResult {
    Logger.info('🎯 Applying filters:', filters);

    const matching: Array<{
      id: string;
      title: string;
      price: number;
      category: string;
      brand?: string;
      description: string;
      similarity: number;
    }> = [];

    const nonMatching: Array<{
      id: string;
      title: string;
      price: number;
      category: string;
      brand?: string;
      description: string;
      reason: string;
      similarity: number;
    }> = [];

    products.forEach(searchResult => {
      const product = searchResult.item;
      const failureReasons: string[] = [];
      let productMatches = true;

      // Check category filter
      if (filters.category && product.category !== filters.category) {
        failureReasons.push(`categoría es ${product.category}, no ${filters.category}`);
        productMatches = false;
      }

      // Check brand filter
      if (filters.brand && product.brand !== filters.brand) {
        failureReasons.push(`marca es ${product.brand}, no ${filters.brand}`);
        productMatches = false;
      }

      // Check max price filter
      if (filters.maxPrice && product.price && product.price > filters.maxPrice) {
        failureReasons.push(`precio es $${product.price}, excede presupuesto de $${filters.maxPrice}`);
        productMatches = false;
      }

      // Check min price filter
      if (filters.minPrice && product.price && product.price < filters.minPrice) {
        failureReasons.push(`precio es $${product.price}, menor al mínimo de $${filters.minPrice}`);
        productMatches = false;
      }

      // Convert to common product format
      const productData = {
        id: product.id,
        title: product.title,
        price: product.price || 0,
        category: product.category,
        brand: product.brand,
        description: product.content,
        similarity: searchResult.similarity
      };

      if (productMatches) {
        matching.push(productData);
      } else {
        nonMatching.push({
          ...productData,
          reason: failureReasons.join(', ')
        });
      }
    });

    Logger.info(`🔍 Filter results: ${matching.length} matching, ${nonMatching.length} not matching`);

    return {
      matching,
      nonMatching
    };
  }
}