import { Router } from "express";
import { config } from "../config";
import { Logger } from "../utils/logger";
import { ProductRAGService } from "../services/ProductRAGService";
import { PRODUCTS_CATALOG } from "../data/product-catalog";
import { RAGQuerySchema, RAGResponseSchema } from "../types/search";
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
router.post("/search-by-filters", async (req, res) => {
  try {
    // Validate input using Zod schema
    const validatedData = RAGQuerySchema.parse(req.body);
    const { query, filters = {}, limit = 5 } = validatedData;

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
    const searchResult = await ragService.searchProducts(query, filters, limit);

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
    const searchResult = await ragService.searchProductsNaturalLanguage(query, limit);

    res.json({
      success: true,
      answer: searchResult.answer,
      products: searchResult.products,
      metadata: {
        originalQuery: query,
        extractedFilters: searchResult.filters,
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

// Health check for RAG service
router.get("/health", async (req, res) => {
  try {
    const stats = ragService?.getVectorStore().getStats();

    res.json({
      status: stats?.isInitialized ? "healthy" : "initializing",
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