import express from "express";
import { config } from "./config";
import { Logger } from "./utils/logger";
import basicsRoutes from "./routes/basics";
import ragRoutes from "./routes/rag";
import toolsRoutes from "./routes/tools";
import fineTuningRoutes from "./routes/fine-tuning";

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
    message: "🛍️ Product Semantic Search Workshop v4 - OpenAI API Practitioner",
    description:
      "Complete AI pipeline: Setup → RAG → Tool Calling → Fine-tuning → Production",
    currentBranch: "4-fine-tuning",
    objective:
      "Intent classification with fine-tuned models and performance measurement",
    nextStep:
      "Run fine-tuning baseline: npm run fine-tuning:setup",
    documentation: "/docs",
    health: "/health",
    demo: "Ready for fine-tuning experiments! 🎯",
  });
});

// Mount route modules
app.use("/", basicsRoutes);
app.use("/rag", ragRoutes);
app.use("/tools", toolsRoutes);
app.use("/fine-tuning", fineTuningRoutes);

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
          "POST /rag/search - Semantic product search",
          "GET /rag/categories - Available filters",
          "GET /rag/browse/:category - Browse by category",
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
          "Commercial intent dataset with 400+ examples",
          "gpt-4o-mini fine-tuning with 100% accuracy",
          "Intent parsing with dynamic model selection",
          "Base vs fine-tuned comparison (0% vs 100% accuracy)",
          "HTTP endpoints for intent classification",
          "Structured output with confidence metrics"
        ],
        duration: "40 minutes",
        endpoints: [
          "POST /fine-tuning/classify-intent - Classify user intent with model selection",
          "POST /fine-tuning/smart-recommend - Complete integrated workflow",
          "GET /fine-tuning/models - List available models and performance",
          "GET /fine-tuning/health - Fine-tuning service status"
        ],
        models: {
          base: "60% JSON validity, 0% intent accuracy, ~2s response",
          fineTuned: "100% JSON validity, 100% intent accuracy, ~9s response"
        },
        integratedWorkflow: {
          description: "Fine-tuned intent classification + Enhanced RAG search + Smart recommendations",
          steps: ["Intent Analysis (100% accuracy)", "Context-Enhanced Search", "Personalized Recommendations"],
          totalTime: "~12s with fine-tuned, ~4s with base model"
        },
        testFiles: "Use /fine-tuning endpoints directly with JSON payloads"
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

// Workshop progress endpoint
app.get("/progress", (req, res) => {
  res.json({
    currentBranch: "4-fine-tuning",
    completed: [
      "✅ Project setup",
      "✅ OpenAI configuration", 
      "✅ Multimodal endpoints (chat, voice, image)",
      "✅ Product catalog with embeddings (42 products)",
      "✅ Vector similarity search with caching",
      "✅ RAG service implementation",
      "✅ Tool calling with 3 smart tools",
      "✅ Natural language query processing",
      "✅ Fine-tuning dataset generation (400+ training, 50 test)",
      "✅ Baseline evaluation system",
      "✅ Fine-tuning model training completed",
      "✅ Model evaluation: 100% intent accuracy achieved", 
      "✅ HTTP endpoints for intent classification with model selection",
      "✅ Integrated workflow: Fine-tuned intent + Enhanced RAG + Smart recommendations"
    ],
    inProgress: [],
    upcoming: [
      "⏳ Production deployment optimization", 
      "⏳ Advanced monitoring and metrics",
      "⏳ Multi-model ensemble strategies"
    ],
    demoReady: true,
    nextMilestone: "Test integrated workflow: POST /fine-tuning/smart-recommend",
    workshopGoal:
      "Intent classification with measurable performance improvements - COMPLETED!",
    fineTuningStatus: {
      datasetsGenerated: true,
      modelTrained: true,
      baselineAccuracy: "60% JSON validity, 0% intent accuracy", 
      fineTunedAccuracy: "100% JSON validity, 100% intent accuracy",
      performanceGain: "+100% accuracy improvement",
      deploymentReady: true,
      modelId: "ft:gpt-4o-mini-2024-07-18:personal::CKAp8rjB",
      actualCost: "~$2-3 USD",
      trainingTime: "~25 minutes"
    }
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

// Cost optimization info
app.get("/costs", (req, res) => {
  res.json({
    title: "Workshop Cost Optimization Strategy",
    estimated: "Total workshop cost: ~$0.10 for complete demo",
    optimizations: {
      model: "GPT-4o-mini for most tasks (100x cheaper than GPT-4o)",
      tokens: "Max 300-400 tokens per response for cost efficiency",
      limits: "Max 3 products per search, 2 tools per query",
      caching: "Smart embedding reuse and response caching",
      efficiency: "Optimized token usage and concise responses",
    },
    breakdown: {
      "setup + basic chat": "$0.01",
      "RAG implementation": "$0.03",
      "Tool calling demos": "$0.04",
      "Fine-tuning": "$0.01",
      "Production testing": "$0.01",
    },
    tokenLimits: {
      "/chat": "300 tokens max",
      "/analyze-image": "50 tokens max (cost optimized)",
      "/query-voice-to-text": "Audio length based (Whisper) + 150 tokens for suggestions",
      "/query-text-to-voice": "30 tokens for enhancement + TTS based on text length",
      "/rag/search": "RAG context + 200 tokens for AI response"
    },
    tips: [
      "Use provided product catalog (no real API calls)",
      "Limit demo queries during development",
      "Test with short, focused queries",
      "Use mock data for reviews and specs",
      "Token limits ensure cost-effective responses",
    ],
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    available: [
      "/",
      "/health",
      "/docs",
      "/progress",
      "/features",
      "/costs",
      "/chat",
      "/query-voice-to-text",
      "/query-text-to-voice",
      "/analyze-image",
      "/rag/search",
      "/rag/categories",
      "/tools/chat",
      "/fine-tuning/classify-intent",
      "/fine-tuning/models",
      "/fine-tuning/health"
    ],
    multimodal: {
      "/chat": "POST - Text-to-text chat with GPT-4o-mini (300 tokens max)",
      "/query-voice-to-text": "POST - Speech-to-text with Whisper + product suggestions (multipart/form-data)",
      "/query-text-to-voice": "POST - Enhanced text-to-speech with TTS",
      "/analyze-image": "POST - Image analysis with GPT-4o-mini (supports file upload or URL)"
    },
    fineTuning: {
      "/fine-tuning/classify-intent": "POST - Intent classification with model selection (base|fine-tuned)",
      "/fine-tuning/smart-recommend": "POST - Complete integrated workflow (intent + RAG + recommendations)",
      "/fine-tuning/models": "GET - Available models and performance metrics", 
      "/fine-tuning/health": "GET - Fine-tuning service health check"
    },
    currentBranch: "4-fine-tuning",
    hint: "Try integrated workflow: POST /fine-tuning/smart-recommend with useFineTuned: true",
    nextEndpoints: {
      "current-branch-4": ["/fine-tuning/smart-recommend", "/fine-tuning/classify-intent"],
      "previous-branches": ["/rag/search", "/tools/chat"],
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
  Logger.info(`📚 Workshop branch: 1-initial-project`);
  Logger.info(`🎯 Objective: Build intelligent multimodal product assistant`);
  Logger.info(`🔗 Visit: http://localhost:${config.server.port}`);
  Logger.info(`📖 Documentation: http://localhost:${config.server.port}/docs`);
  Logger.info(`💡 Features: http://localhost:${config.server.port}/features`);
  Logger.info(`💰 Costs: http://localhost:${config.server.port}/costs`);
  Logger.info(
    `⏭️  Next: Switch to branch 2-rag-implementation for semantic search`
  );
  Logger.info(`🎓 Goal: OpenAI API Practitioner Certification Ready!`);
});

export default app;
