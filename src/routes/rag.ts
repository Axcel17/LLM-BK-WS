import { Router } from "express";
import { config } from "../config";
import { Logger } from "../utils/logger";
import { ProductRAGService } from "../services/ProductRAGService";
import { PRODUCTS_CATALOG, AVAILABLE_CATEGORIES } from "../data/product-catalog";
import { RAGQuerySchema, RAGResponseSchema } from "../types/rag";
import { z } from "zod";

const router = Router();

// Initialize RAG service
let ragService: ProductRAGService;

// Initialize RAG service on module load
(async () => {
  try {
    ragService = new ProductRAGService(PRODUCTS_CATALOG);
    await ragService.initialize();
  } catch (error) {
    Logger.error("Failed to initialize RAG service:", error);
  }
})();

// Search products using semantic search
router.post("/search", async (req, res) => {
  try {
    // Validate input using Zod schema
    const validatedData = RAGQuerySchema.parse(req.body);
    const { query, filters = {} } = validatedData;

    if (!ragService) {
      return res.status(503).json({
        success: false,
        error: "RAG service not initialized",
        message: "The search service is still starting up. Please try again in a moment.",
        workshop: "Product Semantic Search - RAG Implementation",
      });
    }

    Logger.info(`🔍 Processing search query: "${query}"`);

    // Perform RAG search
    const searchResult = await ragService.searchProducts(query, filters);

    // Build structured response
    const response: z.infer<typeof RAGResponseSchema> = {
      success: true,
      answer: searchResult.answer,
      products: searchResult.products,
      metadata: {
        query,
        totalFound: searchResult.products.length,
        tokensUsed: searchResult.tokensUsed,
        model: config.openai.model,
        processingTime: new Date().toISOString(),
        workshop: "Product Semantic Search - RAG Implementation",
      },
    };

    res.json(response);
  } catch (error: any) {
    Logger.error("Search error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid request format",
        details: error.errors,
        example: {
          query: "Necesito auriculares para trabajar desde casa",
          filters: {
            category: "electronics",
            maxPrice: 200,
            limit: 5,
          },
        },
        workshop: "Product Semantic Search - RAG Implementation",
      });
    }

    res.status(500).json({
      success: false,
      error: "Search processing failed",
      message: error.message,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  }
});

// Natural language search (NEW - with automatic filter extraction)
router.post("/search-natural-language", async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Query is required",
        example: {
          query: "Busco auriculares baratos para trabajar desde casa"
        },
        workshop: "Product Semantic Search - RAG Implementation",
      });
    }

    if (!ragService) {
      return res.status(503).json({
        success: false,
        error: "RAG service not initialized",
        message: "The search service is still starting up. Please try again in a moment.",
        workshop: "Product Semantic Search - RAG Implementation",
      });
    }

    Logger.info(`🤖 Processing natural language query: "${query}"`);

    // Perform natural language search with auto-filter extraction
    const searchResult = await ragService.searchProductsNatural(query, limit);

    res.json({
      success: true,
      answer: searchResult.answer,
      products: searchResult.products,
      metadata: {
        originalQuery: query,
        cleanedQuery: searchResult.cleanedQuery,
        extractedFilters: searchResult.extractedFilters,
        totalFound: searchResult.products.length,
        tokensUsed: searchResult.tokensUsed,
        model: config.openai.model,
        processingTime: new Date().toISOString(),
        workshop: "Product Semantic Search - RAG Implementation",
      },
    });

  } catch (error: any) {
    Logger.error("Natural search error:", error);

    res.status(500).json({
      success: false,
      error: "Natural language search failed",
      message: error.message,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  }
});

// Get available categories and filters
router.get("/categories", async (req, res) => {
  try {
    if (!ragService) {
      return res.status(503).json({
        error: "RAG service not initialized",
        workshop: "Product Semantic Search - RAG Implementation",
      });
    }

    const stats = ragService.getVectorStore().getStats();

    res.json({
      categories: AVAILABLE_CATEGORIES,
      brands: stats.brands,
      priceRange: stats.priceRange,
      totalProducts: stats.totalProducts,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  } catch (error: any) {
    Logger.error("Categories error:", error);
    res.status(500).json({
      error: "Failed to retrieve categories",
      message: error.message,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  }
});

// Get products by category (for exploration)
router.get("/browse/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!AVAILABLE_CATEGORIES.includes(category as any)) {
      return res.status(400).json({
        error: "Invalid category",
        availableCategories: AVAILABLE_CATEGORIES,
        workshop: "Product Semantic Search - RAG Implementation",
      });
    }

    if (!ragService) {
      return res.status(503).json({
        error: "RAG service not initialized",
        workshop: "Product Semantic Search - RAG Implementation",
      });
    }

    const products = await ragService.getVectorStore().searchByCategory(category, limit);

    res.json({
      category,
      totalProducts: products.length,
      products: products.map(product => ({
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price ? `$${product.price}` : undefined,
        brand: product.brand,
      })),
      workshop: "Product Semantic Search - RAG Implementation",
    });
  } catch (error: any) {
    Logger.error("Browse error:", error);
    res.status(500).json({
      error: "Failed to browse category",
      message: error.message,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  }
});

// Initialize vector store (utility endpoint for debugging)
router.post("/initialize", async (req, res) => {
  try {
    if (ragService) {
      await ragService.initialize();
    } else {
      ragService = new ProductRAGService(PRODUCTS_CATALOG);
      await ragService.initialize();
    }

    const stats = ragService.getVectorStore().getStats();

    res.json({
      success: true,
      message: "RAG service initialized successfully",
      stats,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  } catch (error: any) {
    Logger.error("Initialization error:", error);
    res.status(500).json({
      success: false,
      error: "Initialization failed",
      message: error.message,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  }
});

// Health check for RAG service
router.get("/health", async (req, res) => {
  try {
    const isHealthy = ragService && ragService.getVectorStore().getStats().isInitialized;
    const stats = ragService?.getVectorStore().getStats();

    res.json({
      status: isHealthy ? "healthy" : "initializing",
      service: "ProductRAGService",
      stats: stats || null,
      timestamp: new Date().toISOString(),
      workshop: "Product Semantic Search - RAG Implementation",
    });
  } catch (error: any) {
    Logger.error("Health check error:", error);
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      workshop: "Product Semantic Search - RAG Implementation",
    });
  }
});

export default router;