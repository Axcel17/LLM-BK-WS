import { Router, Request, Response } from 'express';
import { openai } from '../config/index';
import { QueryParserService } from '../services/QueryParserService';
import { Logger } from '../utils/logger';
import { ProductFiltersSchema } from '../types/product';
import fs from 'fs';
import path from 'path';

const router = Router();
const queryParser = new QueryParserService();

/**
 * Fine-tuning Routes - Branch 4
 * Following workshop modular route structure and cost optimization patterns
 */

/**
 * Extract filters using specified model
 * POST /fine-tuning/extract-filters
 */
router.post('/extract-filters', async (req: Request, res: Response) => {
    
  try {
    const { query, modelId = 'gpt-4o-mini-2024-07-18' } = req.body;

    // Input validation with helpful error messages
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required',
        workshop: 'Progressive Product Semantic Search',
        currentBranch: 'Branch 4: Fine-tuning',
        example: {
          query: "busco laptop gaming barata",
          modelId: "gpt-4o-mini-2024-07-18" // optional
        }
      });
    }

    Logger.info(`🔍 Extracting filters with model: ${modelId}`);
    Logger.info(`📝 Query: "${query}"`);

    const startTime = Date.now();

    // Use QueryParserService with specified model following workshop patterns
    const filters = await queryParser.extractFilters(query, modelId);
    
    const responseTime = Date.now() - startTime;

    // Structured response with usage metadata following workshop patterns
    res.json({
      success: true,
      query,
      modelUsed: modelId,
      extractedFilters: filters,
      performance: {
        responseTime: `${responseTime}ms`,
        modelType: modelId.includes('ft:') ? 'fine-tuned' : 'base'
      },
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning',
      costOptimization: {
        baseModel: 'gpt-4o-mini (100x cheaper than GPT-4o)',
        tokenLimit: 150,
        temperature: 0.1
      }
    });

  } catch (error) {
    Logger.error('❌ Filter extraction failed:', error);
    
    // Comprehensive error handling with workshop context
    res.status(500).json({
      success: false,
      error: 'Filter extraction failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning',
      troubleshooting: [
        'Verify model ID is correct',
        'Check OpenAI API connectivity',
        'Ensure query is a valid string'
      ]
    });
  }
});

/**
 * Compare base model vs fine-tuned model
 * POST /fine-tuning/compare-models
 */
router.post('/compare-models', async (req: Request, res: Response) => {
  try {
    const { query, fineTunedModelId } = req.body;

    // Input validation following workshop patterns
    if (!query || !fineTunedModelId) {
      return res.status(400).json({
        success: false,
        error: 'Both query and fineTunedModelId are required',
        workshop: 'Progressive Product Semantic Search',
        currentBranch: 'Branch 4: Fine-tuning',
        example: {
          query: "busco smartphone Samsung económico",
          fineTunedModelId: "ft:gpt-4o-mini-2024-07-18:personal::abc123"
        }
      });
    }

    Logger.info(`🔄 Comparing models for query: "${query}"`);

    const startTime = Date.now();

    // Test base model following cost optimization
    const baseModelResult = await queryParser.extractFilters(query, 'gpt-4o-mini-2024-07-18');
    const baseModelTime = Date.now() - startTime;

    const fineTunedStartTime = Date.now();

    // Test fine-tuned model
    const fineTunedResult = await queryParser.extractFilters(query, fineTunedModelId);
    const fineTunedTime = Date.now() - fineTunedStartTime;

    // Calculate improvements following workshop metrics
    const baseFields = Object.keys(baseModelResult).length;
    const fineTunedFields = Object.keys(fineTunedResult).length;
    const fieldsImprovement = fineTunedFields - baseFields;

    // Structured response with workshop metadata
    res.json({
      success: true,
      query,
      comparison: {
        baseModel: {
          modelId: 'gpt-4o-mini-2024-07-18',
          extractedFilters: baseModelResult,
          fieldsExtracted: baseFields,
          responseTime: `${baseModelTime}ms`
        },
        fineTunedModel: {
          modelId: fineTunedModelId,
          extractedFilters: fineTunedResult,
          fieldsExtracted: fineTunedFields,
          responseTime: `${fineTunedTime}ms`
        },
        improvement: {
          additionalFields: fieldsImprovement,
          fieldsImprovement: fieldsImprovement > 0 ? `+${fieldsImprovement} more fields` : 'No additional fields',
          speedComparison: fineTunedTime < baseModelTime ? 'Faster' : 'Similar speed',
          overallAssessment: fieldsImprovement > 0 ? 'Fine-tuned model extracts more information' : 'Similar performance'
        }
      },
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning',
      costOptimization: {
        note: 'Both models use gpt-4o-mini base for cost efficiency',
        tokenLimits: '150 max tokens per request'
      }
    });

  } catch (error) {
    Logger.error('❌ Model comparison failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Model comparison failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning',
      troubleshooting: [
        'Verify fine-tuned model ID is correct',
        'Ensure fine-tuning job completed successfully',
        'Check: npm run fine-tuning:status'
      ]
    });
  }
});

/**
 * List available models
 * GET /fine-tuning/models
 */
router.get('/models', async (req: Request, res: Response) => {
  try {
    Logger.info('📋 Listing available fine-tuned models');

    // Get fine-tuned models from OpenAI following workshop patterns
    const models = await openai.fineTuning.jobs.list({ limit: 10 });
    
    const completedModels = models.data
      .filter(job => job.status === 'succeeded' && job.fine_tuned_model)
      .map(job => ({
        modelId: job.fine_tuned_model,
        jobId: job.id,
        baseModel: job.model,
        createdAt: new Date(job.created_at * 1000).toISOString(),
        purpose: 'Product filter extraction improvement'
      }));

    // Check local job info following workshop file patterns
    const jobsFilePath = path.join(__dirname, '../../data/fine-tuning/fine-tuning-jobs.json');
    let localJobInfo = null;
    
    if (fs.existsSync(jobsFilePath)) {
      const jobData = fs.readFileSync(jobsFilePath, 'utf8');
      localJobInfo = JSON.parse(jobData);
    }

    // Structured response following workshop patterns
    res.json({
      success: true,
      availableModels: {
        baseModel: {
          modelId: 'gpt-4o-mini-2024-07-18',
          type: 'base',
          description: 'Cost-optimized base model for filter extraction',
          costPer1MTokens: '$0.15'
        },
        fineTunedModels: completedModels
      },
      currentWorkshopModel: localJobInfo?.fineTunedModel || null,
      modelCount: {
        total: completedModels.length + 1,
        base: 1,
        fineTuned: completedModels.length
      },
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning',
      costOptimization: {
        note: 'All models based on gpt-4o-mini for cost efficiency',
        fineTuningCost: '$8 per 1M training tokens'
      }
    });

  } catch (error) {
    Logger.error('❌ Failed to list models:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to list models',
      details: error instanceof Error ? error.message : 'Unknown error',
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning',
      troubleshooting: [
        'Check OpenAI API connectivity',
        'Verify API key permissions for fine-tuning',
        'Run: npm run fine-tuning:status'
      ]
    });
  }
});

/**
 * Health check for fine-tuning system
 * GET /fine-tuning/health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Check system components following workshop patterns
    const jobsFilePath = path.join(__dirname, '../../data/fine-tuning/fine-tuning-jobs.json');
    const trainingDataPath = path.join(__dirname, '../../data/fine-tuning/training_data.jsonl');
    const testDataPath = path.join(__dirname, '../../data/fine-tuning/test_data.jsonl');

    const systemStatus = {
      jobsFile: fs.existsSync(jobsFilePath),
      trainingData: fs.existsSync(trainingDataPath),
      testData: fs.existsSync(testDataPath),
      queryParserService: true, // Always available
      openaiConnection: true // Assume true if we reach this point
    };

    const allSystemsHealthy = Object.values(systemStatus).every(status => status);

    // Structured response following workshop patterns
    res.json({
      success: true,
      status: allSystemsHealthy ? 'healthy' : 'partial',
      systemComponents: systemStatus,
      availableEndpoints: [
        'POST /fine-tuning/extract-filters',
        'POST /fine-tuning/compare-models', 
        'GET /fine-tuning/models',
        'GET /fine-tuning/health'
      ],
      npmScripts: [
        'npm run fine-tuning:generate - Create training dataset',
        'npm run fine-tuning:train - Start model training',
        'npm run fine-tuning:status - Check training progress',
        'npm run fine-tuning:evaluate - Compare model performance'
      ],
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning',
      costOptimization: {
        baseModel: 'gpt-4o-mini-2024-07-18',
        tokenLimits: 'Max 150 tokens per extraction',
        purpose: 'Improve QueryParserService filter extraction'
      }
    });

  } catch (error) {
    Logger.error('❌ Health check failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      workshop: 'Progressive Product Semantic Search',
      currentBranch: 'Branch 4: Fine-tuning'
    });
  }
});

export default router;