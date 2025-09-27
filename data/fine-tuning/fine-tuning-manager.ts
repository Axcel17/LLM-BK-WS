import OpenAI from 'openai';
import { readFileSync, createReadStream } from 'fs';
import * as path from 'path';
import { Logger } from '../../src/utils/logger';
import { openai as openaiClient } from '../../src/config/index';
import { AdvancedEvaluator } from './evaluator';

// OpenAI Client (using centralized config)
const openai = openaiClient;

// Configuration
const FINE_TUNING_CONFIG = {
  BASE_MODEL: 'gpt-4o-mini-2024-07-18',
  TRAINING_FILE: path.join(__dirname, 'training_data.jsonl'),
  VALIDATION_FILE: path.join(__dirname, 'test_data.jsonl'),
  EPOCHS: 1,
  BATCH_SIZE: 1,
  LEARNING_RATE_MULTIPLIER: 2
};

interface FineTuningJob {
  id: string;
  status: string;
  created_at: number;
  finished_at?: number;
  fine_tuned_model?: string;
  error?: any;
}

// ============================================================================
// FILE MANAGEMENT
// ============================================================================

export async function uploadTrainingFile(): Promise<string> {
  console.log('📤 Uploading training file to OpenAI...');
  
  try {
    const file = await openai.files.create({
      file: createReadStream(FINE_TUNING_CONFIG.TRAINING_FILE),
      purpose: 'fine-tune'
    });
    
    console.log(`✓ Training file uploaded: ${file.id}`);
    Logger.info('Fine-tuning file uploaded', { fileId: file.id, purpose: 'training' });
    
    return file.id;
  } catch (error) {
    console.error('❌ Error uploading training file:', error);
    throw error;
  }
}

export async function uploadValidationFile(): Promise<string> {
  console.log('📤 Uploading validation file to OpenAI...');
  
  try {
    const file = await openai.files.create({
      file: createReadStream(FINE_TUNING_CONFIG.VALIDATION_FILE),
      purpose: 'fine-tune'
    });
    
    console.log(`✓ Validation file uploaded: ${file.id}`);
    Logger.info('Fine-tuning file uploaded', { fileId: file.id, purpose: 'validation' });
    
    return file.id;
  } catch (error) {
    console.error('❌ Error uploading validation file:', error);
    throw error;
  }
}

// ============================================================================
// FINE-TUNING JOB MANAGEMENT
// ============================================================================

export async function createFineTuningJob(trainingFileId: string, validationFileId: string): Promise<FineTuningJob> {
  console.log('🚀 Creating fine-tuning job...');
  
  try {
    const job = await openai.fineTuning.jobs.create({
      training_file: trainingFileId,
      validation_file: validationFileId,
      model: FINE_TUNING_CONFIG.BASE_MODEL,
      hyperparameters: {
        n_epochs: FINE_TUNING_CONFIG.EPOCHS,
        batch_size: FINE_TUNING_CONFIG.BATCH_SIZE,
        learning_rate_multiplier: FINE_TUNING_CONFIG.LEARNING_RATE_MULTIPLIER
      }
    });
    
    console.log(`✓ Fine-tuning job created: ${job.id}`);
    console.log(`  Status: ${job.status}`);
    console.log(`  Model: ${job.model}`);
    
    Logger.info('Fine-tuning job created', {
      jobId: job.id,
      model: job.model,
      status: job.status
    });
    
    return job as FineTuningJob;
  } catch (error) {
    console.error('❌ Error creating fine-tuning job:', error);
    throw error;
  }
}

export async function checkJobStatus(jobId: string): Promise<FineTuningJob> {
  try {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    return job as FineTuningJob;
  } catch (error) {
    console.error('❌ Error checking job status:', error);
    throw error;
  }
}

export async function listFineTuningJobs(): Promise<FineTuningJob[]> {
  try {
    const jobs = await openai.fineTuning.jobs.list({ limit: 10 });
    return jobs.data as FineTuningJob[];
  } catch (error) {
    console.error('❌ Error listing jobs:', error);
    throw error;
  }
}

export async function waitForJobCompletion(jobId: string): Promise<FineTuningJob> {
  console.log(`⏳ Waiting for job ${jobId} to complete...`);
  
  let job: FineTuningJob;
  let attempts = 0;
  const maxAttempts = 120; // 2 hours max
  
  while (attempts < maxAttempts) {
    job = await checkJobStatus(jobId);
    
    console.log(`  Status: ${job.status} (attempt ${attempts + 1})`);
    
    if (job.status === 'succeeded') {
      console.log(`✓ Job completed successfully!`);
      console.log(`  Fine-tuned model: ${job.fine_tuned_model}`);
      return job;
    }
    
    if (job.status === 'failed' || job.status === 'cancelled') {
      console.error(`❌ Job ${job.status}:`, job.error);
      throw new Error(`Fine-tuning job ${job.status}: ${job.error?.message || 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
    attempts++;
  }
  
  throw new Error('Fine-tuning job timeout');
}

// ============================================================================
// MODEL EVALUATION
// ============================================================================



// ============================================================================
// COMPARISON AND DECISION
// ============================================================================

export async function compareModels(baseModel: string, fineTunedModel: string): Promise<void> {
  console.log('\n🔬 COMPARATIVE EVALUATION');
  console.log('='.repeat(50));
  
  // Load test data in proper format
  const testData = readFileSync(FINE_TUNING_CONFIG.VALIDATION_FILE, 'utf8');
  const testExamples = testData.split('\n')
    .filter(line => line.trim())
    .slice(0, 20) // Test with first 20 for speed
    .map((line, index) => {
      try {
        const parsed = JSON.parse(line);
        const userMessage = parsed.messages.find((m: any) => m.role === 'user');
        const assistantMessage = parsed.messages.find((m: any) => m.role === 'assistant');
        
        // Parse expected response
        let expected: any = {
          intent_type: 'GIFT',
          category: 'unspecified',
          budget_tier: 'unspecified',
          recipient: 'unspecified',
          context_tags: [],
          priority_features: []
        };
        
        try {
          if (assistantMessage?.content) {
            expected = JSON.parse(assistantMessage.content);
          }
        } catch {
          // Use default expected structure
        }
        
        return {
          query: userMessage?.content || `Test query ${index}`,
          expected
        };
      } catch {
        return null;
      }
    })
    .filter((example): example is NonNullable<typeof example> => example !== null);
  
  console.log(`Testing with ${testExamples.length} examples...\n`);
  
  // Evaluate base model
  console.log('📊 Evaluating base model...');
  const baseEvaluator = new AdvancedEvaluator(baseModel);
  const baseResults = await baseEvaluator.evaluateModel(testExamples);
  
  // Evaluate fine-tuned model
  console.log('📊 Evaluating fine-tuned model...');
  const fineTunedEvaluator = new AdvancedEvaluator(fineTunedModel);
  const fineTunedResults = await fineTunedEvaluator.evaluateModel(testExamples);
  
  // Results comparison
  console.log('\n📈 RESULTS COMPARISON');
  console.log('-'.repeat(50));
  console.log(`Base Model (${baseModel}):`);
  console.log(`  Overall Accuracy: ${(baseResults.overallAccuracy * 100).toFixed(1)}%`);
  console.log(`  Intent Accuracy: ${(baseResults.intentAccuracy * 100).toFixed(1)}%`);
  console.log(`  Budget Accuracy: ${(baseResults.budgetAccuracy * 100).toFixed(1)}%`);
  console.log(`  Valid JSON Rate: ${(baseResults.validJsonRate * 100).toFixed(1)}%`);
  console.log(`  Avg Response Time: ${baseResults.avgResponseTime.toFixed(0)}ms`);
  
  console.log(`\nFine-tuned Model (${fineTunedModel}):`);
  console.log(`  Overall Accuracy: ${(fineTunedResults.overallAccuracy * 100).toFixed(1)}%`);
  console.log(`  Intent Accuracy: ${(fineTunedResults.intentAccuracy * 100).toFixed(1)}%`);
  console.log(`  Budget Accuracy: ${(fineTunedResults.budgetAccuracy * 100).toFixed(1)}%`);
  console.log(`  Valid JSON Rate: ${(fineTunedResults.validJsonRate * 100).toFixed(1)}%`);
  console.log(`  Avg Response Time: ${fineTunedResults.avgResponseTime.toFixed(0)}ms`);
  
  // Performance improvements
  const accuracyImprovement = ((fineTunedResults.overallAccuracy - baseResults.overallAccuracy) * 100);
  const intentImprovement = ((fineTunedResults.intentAccuracy - baseResults.intentAccuracy) * 100);
  const speedImprovement = ((baseResults.avgResponseTime - fineTunedResults.avgResponseTime) / baseResults.avgResponseTime * 100);
  
  console.log(`\n🎯 PERFORMANCE IMPROVEMENTS:`);
  console.log(`  Overall Accuracy: ${accuracyImprovement > 0 ? '+' : ''}${accuracyImprovement.toFixed(1)}%`);
  console.log(`  Intent Accuracy: ${intentImprovement > 0 ? '+' : ''}${intentImprovement.toFixed(1)}%`);
  console.log(`  Speed: ${speedImprovement > 0 ? '+' : ''}${speedImprovement.toFixed(1)}%`);
  
  // Go/No-Go decision
  console.log('\n🚦 GO/NO-GO DECISION:');
  const shouldDeploy = accuracyImprovement >= 10 && fineTunedResults.overallAccuracy > 0.85;
  
  if (shouldDeploy) {
    console.log('✅ GO - Deploy fine-tuned model');
    console.log('   Reasons:');
    console.log(`   - Overall accuracy improvement: ${accuracyImprovement.toFixed(1)}% (target: ≥10%)`);
    console.log(`   - Absolute accuracy: ${(fineTunedResults.overallAccuracy * 100).toFixed(1)}% (target: ≥85%)`);
  } else {
    console.log('❌ NO-GO - Keep base model');
    console.log('   Reasons:');
    if (accuracyImprovement < 10) {
      console.log(`   - Accuracy improvement too low: ${accuracyImprovement.toFixed(1)}% (target: ≥10%)`);
    }
    if (fineTunedResults.overallAccuracy <= 0.85) {
      console.log(`   - Absolute accuracy too low: ${(fineTunedResults.overallAccuracy * 100).toFixed(1)}% (target: ≥85%)`);
    }
  }
  
  Logger.info('Model comparison completed', {
    baseModel,
    fineTunedModel,
    baseAccuracy: baseResults.overallAccuracy,
    fineTunedAccuracy: fineTunedResults.overallAccuracy,
    improvement: accuracyImprovement,
    decision: shouldDeploy ? 'deploy' : 'reject'
  });
}

// ============================================================================
// MAIN WORKFLOW
// ============================================================================

export async function runFullFineTuningWorkflow(): Promise<void> {
  console.log('🎯 STARTING FINE-TUNING WORKFLOW');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Upload files
    const trainingFileId = await uploadTrainingFile();
    const validationFileId = await uploadValidationFile();
    
    // Step 2: Create job
    const job = await createFineTuningJob(trainingFileId, validationFileId);
    
    // Step 3: Wait for completion
    const completedJob = await waitForJobCompletion(job.id);
    
    // Step 4: Compare models
    if (completedJob.fine_tuned_model) {
      await compareModels(FINE_TUNING_CONFIG.BASE_MODEL, completedJob.fine_tuned_model);
    }
    
    console.log('\n✅ Fine-tuning workflow completed successfully!');
    
  } catch (error) {
    console.error('❌ Fine-tuning workflow failed:', error);
    throw error;
  }
}

// Export configuration for external use
export { FINE_TUNING_CONFIG };

// CLI Commands
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'upload':
      await uploadTrainingFile();
      await uploadValidationFile();
      break;
      
    case 'create-job':
      const trainingId = process.argv[3];
      const validationId = process.argv[4];
      if (!trainingId || !validationId) {
        console.error('Usage: ts-node fine-tuning-manager.ts create-job <training-file-id> <validation-file-id>');
        process.exit(1);
      }
      await createFineTuningJob(trainingId, validationId);
      break;
      
    case 'status':
      const jobId = process.argv[3];
      if (!jobId) {
        console.error('Usage: ts-node fine-tuning-manager.ts status <job-id>');
        process.exit(1);
      }
      const job = await checkJobStatus(jobId);
      console.log(JSON.stringify(job, null, 2));
      break;
      
    case 'list-jobs':
      const jobs = await listFineTuningJobs();
      console.log(JSON.stringify(jobs, null, 2));
      break;
      
    case 'compare':
      const baseModel = process.argv[3] || FINE_TUNING_CONFIG.BASE_MODEL;
      const fineTunedModel = process.argv[4];
      if (!fineTunedModel) {
        console.error('Usage: ts-node fine-tuning-manager.ts compare [base-model] <fine-tuned-model>');
        process.exit(1);
      }
      await compareModels(baseModel, fineTunedModel);
      break;
      
    case 'full-workflow':
      await runFullFineTuningWorkflow();
      break;
      
    default:
      console.log('Available commands:');
      console.log('  upload              - Upload training and validation files');
      console.log('  create-job          - Create fine-tuning job');
      console.log('  status <job-id>     - Check job status');
      console.log('  list-jobs           - List recent jobs');
      console.log('  compare <model>     - Compare models');
      console.log('  full-workflow       - Run complete workflow');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}