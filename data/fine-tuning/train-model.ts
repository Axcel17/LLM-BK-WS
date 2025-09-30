import fs from 'fs';
import path from 'path';
import { openai } from '../../src/config/index';
import { Logger } from '../../src/utils/logger';

/**
 * Fine-tuning Training Manager
 * Uploads dataset and starts OpenAI fine-tuning job
 * Part of Branch 4: Fine-tuning implementation
 */
class TrainingManager {
  private readonly trainingDataPath: string;
  private readonly jobsFilePath: string;

  constructor() {
    this.trainingDataPath = path.join(__dirname, 'training_data.jsonl');
    this.jobsFilePath = path.join(__dirname, 'fine-tuning-jobs.json');
  }

  /**
   * Upload training dataset to OpenAI
   */
  private async uploadDataset(): Promise<string> {
    try {
      Logger.info('📤 Uploading training dataset to OpenAI...');
      
      if (!fs.existsSync(this.trainingDataPath)) {
        throw new Error('Training data file not found. Run: npm run fine-tuning:generate');
      }

      const file = await openai.files.create({
        file: fs.createReadStream(this.trainingDataPath),
        purpose: 'fine-tune'
      });

      Logger.info(`✅ Dataset uploaded successfully. File ID: ${file.id}`);
      return file.id;
    } catch (error) {
      Logger.error('❌ Dataset upload failed:', error);
      throw error;
    }
  }

  /**
   * Start fine-tuning job with cost-optimized parameters
   */
  private async startFineTuning(fileId: string): Promise<string> {
    try {
      Logger.info('🚀 Starting fine-tuning job...');
      Logger.info('🎯 Workshop: Progressive Product Semantic Search - Branch 4');

      const fineTuningJob = await openai.fineTuning.jobs.create({
        training_file: fileId,
        model: 'gpt-4o-mini-2024-07-18', // Cost-optimized base model
        hyperparameters: {
          n_epochs: 3,
          batch_size: 1,
          learning_rate_multiplier: 2
        },
        suffix: 'product-filter-extractor'
      });

      Logger.info(`✅ Fine-tuning job created. Job ID: ${fineTuningJob.id}`);
      Logger.info(`📊 Base model: ${fineTuningJob.model}`);
      Logger.info(`⏱️ Status: ${fineTuningJob.status}`);

      return fineTuningJob.id;
    } catch (error) {
      Logger.error('❌ Fine-tuning job creation failed:', error);
      throw error;
    }
  }

  /**
   * Save job information for monitoring
   */
  private saveJobInfo(jobId: string, fileId: string): void {
    const jobInfo = {
      jobId,
      fileId,
      createdAt: new Date().toISOString(),
      workshop: 'Progressive Product Semantic Search',
      branch: 'Branch 4: Fine-tuning',
      purpose: 'Improve QueryParserService filter extraction',
      baseModel: 'gpt-4o-mini-2024-07-18',
      status: 'validating_files'
    };

    fs.writeFileSync(this.jobsFilePath, JSON.stringify(jobInfo, null, 2));
    Logger.info(`📁 Job info saved to fine-tuning-jobs.json`);
  }

  /**
   * Execute complete training workflow
   */
  async train(): Promise<void> {
    try {
      Logger.info('🏗️ Starting fine-tuning training workflow...');
      Logger.info('💰 Cost optimization: Using gpt-4o-mini base model');
      Logger.info('📊 Dataset: 30 training examples for filter extraction');

      // Step 1: Upload dataset
      const fileId = await this.uploadDataset();

      // Step 2: Start fine-tuning
      const jobId = await this.startFineTuning(fileId);

      // Step 3: Save job info
      this.saveJobInfo(jobId, fileId);

      // Summary
      Logger.info('🎯 Training workflow completed!');
      Logger.info(`🆔 Job ID: ${jobId}`);
      Logger.info(`📁 File ID: ${fileId}`);
      Logger.info('⏳ Training status: validating_files → running → succeeded');
      
      console.log('\n✅ Fine-tuning job started successfully!');
      console.log('📋 Training details:');
      console.log(`   🆔 Job ID: ${jobId}`);
      console.log(`   📁 File ID: ${fileId}`);
      console.log(`   🤖 Base model: gpt-4o-mini-2024-07-18`);
      console.log(`   📊 Training examples: 30`);
      console.log(`   💰 Cost optimized: 3 epochs, batch size 1`);
      console.log('\n📋 Next steps:');
      console.log('   1. npm run fine-tuning:status (check progress)');
      console.log('   2. Wait for completion (usually 10-20 minutes)');
      console.log('   3. npm run fine-tuning:evaluate (test results)');

    } catch (error) {
      Logger.error('❌ Training workflow failed:', error);
      console.error('\n❌ Training failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const trainer = new TrainingManager();
  trainer.train().catch(console.error);
}

export { TrainingManager };