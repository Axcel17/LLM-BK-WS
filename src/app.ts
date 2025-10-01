import express from "express";
import { config } from "./config";
import { Logger } from "./utils/logger";
import basicsRoutes from "./routes/basics";
import ragRoutes from "./routes/rag";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: config.server.nodeEnv,
  });
});

// Welcome endpoint - Introduction to the workshop
app.get("/", (req, res) => {
  res.json({
    message: "🛍️ Product Semantic Search Workshop - OpenAI API Practitioner",
    description:
      "Progressive multimodal AI system: Setup → RAG → Tool Calling → Fine-tuning → Production",
    currentBranch: "2-rag-implementation",
    objective:
      "Intelligent semantic search with embeddings and natural language understanding",
    nextStep:
      "Try semantic search: POST /rag/search-by-filters or /rag/search-natural-language",
    documentation: "/docs",
    health: "/health",
    demo: "Ready for intelligent semantic product search! 🔍�",
  });
});

// Mount route modules
app.use("/", basicsRoutes);
app.use("/rag", ragRoutes);

// Docs endpoint
app.get("/docs", (req, res) => {
  res.json({
    workshop: "Product Semantic Search Workshop v2",
    certification: "OpenAI API Practitioner Certification Ready",
    tagline: 'From "zapatillas deportivas" to intelligent product discovery',
    branches: {
      "1-initial-project": {
        description:
          "Setup multimodal basics: chat, speech-to-text, text-to-speech, image analysis",
        features: [
          "OpenAI SDK configuration",
          "Basic chat with GPT-4o-mini",
          "Audio transcription",
          "Voice responses",
          "Image analysis with GPT-4o Vision",
        ],
        duration: "40 minutes",
      },
      "2-rag-implementation": {
        description: "Semantic search with embeddings and vector store",
        features: [
          "text-embedding-3-small (cost-optimized)",
          "Product catalog with 42 items across 8 categories",
          "Vector similarity search with caching",
          "Brand and price filtering",
          "Natural language query processing",
        ],
        duration: "50 minutes",
        endpoints: [
          "POST /rag/search-by-filters - Filtered product search",
          "POST /rag/search-natural-language - Natural language search with filter extraction",
          "GET /rag/health - Service status",
        ],
        testFiles: "inputs/rag/*.json",
      },
      "3-tool-calling": {
        description:
          "Intelligent conversation with automated tool selection",
        features: [
          "search_products - Smart product discovery",
          "compare_products - Structured comparisons",
          "get_product_details - Deep product insights",
          "Budget-aware recommendations",
          "Context preservation across tool calls",
        ],
        duration: "50 minutes",
        endpoints: [
          "POST /tools/chat - Conversational AI with tools",
          "GET /tools/available - List available tools",
          "GET /tools/health - Tool service status",
        ],
        testFiles: "inputs/tools/*.json",
      },
      "4-fine-tuning": {
        description: "Specialized model for commercial intent understanding",
        features: [
          "Commercial intent dataset",
          "gpt-4o-mini fine-tuning",
          "Intent parsing",
          "Base vs fine-tuned comparison",
          "Structured output",
        ],
        duration: "40 minutes",
      },
      "5-moderation-production": {
        description: "Production-ready system with safety and robustness",
        features: [
          "omni-moderation-latest",
          "Rate limiting",
          "Error handling",
          "Metrics & monitoring",
          "Graceful fallbacks",
        ],
        duration: "40 minutes",
      },
    },
    totalDuration: "3.5 hours + breaks",
    currentFeatures: [
      "Express server with TypeScript",
      "OpenAI SDK integration",
      "Professional logging system",
      "Health monitoring",
      "Ready for multimodal inputs",
    ],
    upcomingFeatures: [
      "Voice-to-product search",
      "Image-based product discovery",
      "Intelligent product comparison",
      "Commercial intent understanding",
      "Production-grade safety",
    ],
  });
});

// Features showcase endpoint
app.get("/features", (req, res) => {
  res.json({
    title: "Product Semantic Search - Feature Showcase",
    multimodal: {
      voice: 'Users can ask "Necesito algo para ejercicio en casa" by voice',
      text: 'Natural language queries like "regalo para mi mamá cocinera"',
      image: "Upload product photos to find similar items",
      response: "AI responds via text or personalized voice",
    },
    intelligence: {
      semantic: "Understands intent, not just keywords",
      contextual: "Considers budget, recipient, occasion automatically",
      comparative: "Smart product comparisons with recommendations",
      personalized: "Learns from user preferences and context",
    },
    technical: {
      embedding: "text-embedding-3-small for cost optimization",
      models: "GPT-4o-mini for efficiency, GPT-4o Vision for images",
      vectorStore: "In-memory cosine similarity with filtering",
      safety: "Content moderation and production-grade error handling",
    },
    useCases: [
      '🎤 "Auriculares para trabajar desde casa" → Voice search',
      '📷 Photo of shoes → "Find similar products"',
      '💭 "Regalo $100 para mamá" → Personalized recommendations',
      '⚖️ "Compare iPhone vs Samsung" → Intelligent comparison',
    ],
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    available: [
      "/rag/search-by-filters",
      "/rag/search-natural-language",
      "/rag/health"
    ],
    multimodal: {
      "/chat": "POST - Text-to-text chat with GPT-4o-mini (300 tokens max)",
      "/query-voice-to-text": "POST - Speech-to-text with Whisper + product suggestions (multipart/form-data)",
      "/query-text-to-voice": "POST - Enhanced text-to-speech with TTS",
      "/analyze-image": "POST - Image analysis with GPT-4o-mini (supports file upload or URL)"
    },
    currentBranch: "2-rag-implementation",
    hint: "This is a RAG implementation branch! Switch to other branches for more endpoints:",
    nextEndpoints: {
      "branch-3": ["/assistant", "/tools"],
      "branch-4": ["/fine-tune", "/intent"],
      "branch-5": ["/moderate", "/metrics"]
    }
  });
});

// Error handler
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    Logger.error("Unhandled error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message || "Something went wrong",
      workshop: "Product Semantic Search Workshop",
      support: "Check logs for detailed error information",
    });
  }
);

// Start server
app.listen(config.server.port, () => {
  Logger.success(
    `🛍️ Product Semantic Search Workshop v2 running on port ${config.server.port}`
  );
  Logger.info(`📚 Workshop branch: 2-rag-implementation`);
  Logger.info(`🎯 Objective: Build intelligent multimodal product assistant`);
  Logger.info(`🔗 Documentation: http://localhost:${config.server.port}/docs`);
  Logger.info(`🚀 Try it out: http://localhost:${config.server.port}/rag/search-by-filters`)
  Logger.info(`🧪 Test files: inputs/rag/test-*.json`);
  Logger.info(`💡 Try it out: curl -X POST -H "Content-Type: application/json" -d @inputs/rag/test-search-by-filters.json http://localhost:${config.server.port}/rag/search-by-filters`);

  Logger.info(
    `⏭️  Next: Switch to branch 2-rag-implementation for semantic search`
  );
  Logger.info(`🎓 Goal: OpenAI API Practitioner Certification Ready!`);
});

export default app;