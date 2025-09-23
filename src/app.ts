import express from 'express';
import { config } from './config';
import { Logger } from './utils/logger';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.server.nodeEnv
  });
});

// Welcome endpoint - Introduction to the workshop
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Product Semantic Search Workshop v2 - OpenAI API Practitioner',
    description: 'Progressive multimodal AI system: Setup → RAG → Tool Calling → Fine-tuning → Production',
    currentBranch: '1-initial-project',
    objective: 'Build an intelligent product search system that understands voice, text, and images',
    nextStep: 'Switch to branch 2-rag-implementation to start building the semantic search',
    documentation: '/docs',
    health: '/health',
    demo: 'Ready for multimodal product recommendations! 🎯'
  });
});

// Docs endpoint
app.get('/docs', (req, res) => {
  res.json({
    workshop: 'Product Semantic Search Workshop v2',
    certification: 'OpenAI API Practitioner Certification Ready',
    tagline: 'From "zapatillas deportivas" to intelligent product discovery',
    branches: {
      '1-initial-project': {
        description: 'Setup multimodal basics: chat, speech-to-text, text-to-speech, image analysis',
        features: ['OpenAI SDK configuration', 'Basic chat with GPT-4o', 'Audio transcription', 'Voice responses', 'Image analysis'],
        duration: '40 minutes'
      },
      '2-rag-implementation': {
        description: 'Semantic search with embeddings and vector store',
        features: ['text-embedding-3-large', 'Product catalog indexing', 'Hybrid search (text + image)', 'Similarity scoring', 'Smart filtering'],
        duration: '50 minutes'
      },
      '3-tool-calling': {
        description: 'Intelligent tools for search, comparison, and recommendations',
        features: ['search_products tool', 'compare_products tool', 'get_product_details tool', 'GPT-4o-mini optimization', 'Cost-efficient implementation'],
        duration: '50 minutes'
      },
      '4-fine-tuning': {
        description: 'Specialized model for commercial intent understanding',
        features: ['Commercial intent dataset', 'gpt-4o-mini fine-tuning', 'Intent parsing', 'Base vs fine-tuned comparison', 'Structured output'],
        duration: '40 minutes'
      },
      '5-moderation-production': {
        description: 'Production-ready system with safety and robustness',
        features: ['omni-moderation-latest', 'Rate limiting', 'Error handling', 'Metrics & monitoring', 'Graceful fallbacks'],
        duration: '40 minutes'
      }
    },
    totalDuration: '3.5 hours + breaks',
    currentFeatures: [
      'Express server with TypeScript',
      'OpenAI SDK integration', 
      'Professional logging system',
      'Health monitoring',
      'Ready for multimodal inputs'
    ],
    upcomingFeatures: [
      'Voice-to-product search',
      'Image-based product discovery', 
      'Intelligent product comparison',
      'Commercial intent understanding',
      'Production-grade safety'
    ]
  });
});

// Workshop progress endpoint
app.get('/progress', (req, res) => {
  res.json({
    currentBranch: '1-initial-project',
    completed: ['✅ Project setup', '✅ OpenAI configuration', '✅ Basic server'],
    inProgress: ['🔄 Multimodal capabilities'],
    upcoming: [
      '⏳ RAG with product embeddings',
      '⏳ Intelligent tool calling', 
      '⏳ Fine-tuned intent recognition',
      '⏳ Production deployment'
    ],
    demoReady: false,
    nextMilestone: 'Complete multimodal setup to unlock product search',
    workshopGoal: 'Intelligent product assistant that understands voice, text, and images'
  });
});

// Features showcase endpoint
app.get('/features', (req, res) => {
  res.json({
    title: 'Product Semantic Search - Feature Showcase',
    multimodal: {
      voice: 'Users can ask "Necesito algo para ejercicio en casa" by voice',
      text: 'Natural language queries like "regalo para mi mamá cocinera"',
      image: 'Upload product photos to find similar items',
      response: 'AI responds via text or personalized voice'
    },
    intelligence: {
      semantic: 'Understands intent, not just keywords',
      contextual: 'Considers budget, recipient, occasion automatically',
      comparative: 'Smart product comparisons with recommendations',
      personalized: 'Learns from user preferences and context'
    },
    technical: {
      embedding: 'text-embedding-3-large for semantic similarity',
      models: 'GPT-4o for vision, GPT-4o-mini for efficiency',
      tools: 'Specialized functions for search, compare, detail',
      safety: 'Content moderation and production-grade error handling'
    },
    useCases: [
      '🎤 "Auriculares para trabajar desde casa" → Voice search',
      '📷 Photo of shoes → "Find similar products"',
      '💭 "Regalo $100 para mamá" → Personalized recommendations',
      '⚖️ "Compare iPhone vs Samsung" → Intelligent comparison'
    ]
  });
});

// Cost optimization info
app.get('/costs', (req, res) => {
  res.json({
    title: 'Workshop Cost Optimization Strategy',
    estimated: 'Total workshop cost: ~$0.20 for complete demo',
    optimizations: {
      model: 'GPT-4o-mini for tool calling (10x cheaper)',
      limits: 'Max 3 products per search, 2 tools per query',
      caching: 'Smart embedding reuse and response caching',
      efficiency: 'Optimized token usage and concise responses'
    },
    breakdown: {
      'setup + basic chat': '$0.02',
      'RAG implementation': '$0.05', 
      'Tool calling demos': '$0.08',
      'Fine-tuning': '$0.03',
      'Production testing': '$0.02'
    },
    tips: [
      'Use provided product catalog (no real API calls)',
      'Limit demo queries during development',
      'Test with short, focused queries',
      'Use mock data for reviews and specs'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available: ['/', '/health', '/docs', '/progress', '/features', '/costs'],
    currentBranch: '1-initial-project',
    hint: 'This is the initial setup! Switch to other branches for more endpoints:',
    nextEndpoints: {
      'branch-2': ['/search', '/index'],
      'branch-3': ['/assistant', '/tools'],
      'branch-4': ['/fine-tune', '/intent'],
      'branch-5': ['/moderate', '/metrics']
    }
  });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  Logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message || 'Something went wrong',
    workshop: 'Product Semantic Search Workshop',
    support: 'Check logs for detailed error information'
  });
});

// Start server
app.listen(config.server.port, () => {
  Logger.success(`🛍️ Product Semantic Search Workshop v2 running on port ${config.server.port}`);
  Logger.info(`📚 Workshop branch: 1-initial-project`);
  Logger.info(`🎯 Objective: Build intelligent multimodal product assistant`);
  Logger.info(`🔗 Visit: http://localhost:${config.server.port}`);
  Logger.info(`📖 Documentation: http://localhost:${config.server.port}/docs`);
  Logger.info(`💡 Features: http://localhost:${config.server.port}/features`);
  Logger.info(`💰 Costs: http://localhost:${config.server.port}/costs`);
  Logger.info(`⏭️  Next: Switch to branch 2-rag-implementation for semantic search`);
  Logger.info(`🎓 Goal: OpenAI API Practitioner Certification Ready!`);
});

export default app;