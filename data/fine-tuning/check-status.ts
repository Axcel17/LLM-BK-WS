import fs from 'fs';
import path from 'path';
import { openai } from '../../src/config/index';
import { Logger } from '../../src/utils/logger';

/**
 * Fine-tuning Status Checker
 * Monitors OpenAI fine-tuning job progress and displays metrics
 * Part of Branch 4: Fine-tuning implementation
 */
class StatusChecker {
  private readonly jobsFilePath: string;

  constructor() {
    this.jobsFilePath = path.join(__dirname, 'fine-tuning-jobs.json');
  }

  /**
   * Load job information following workshop file patterns
   */
  private loadJobInfo(): any {
    if (!fs.existsSync(this.jobsFilePath)) {
      throw new Error('No fine-tuning jobs found. Run: npm run fine-tuning:train');
    }

    const jobData = fs.readFileSync(this.jobsFilePath, 'utf8');
    return JSON.parse(jobData);
  }

  /**
   * Get detailed job status from OpenAI
   */
  private async getJobStatus(jobId: string): Promise<any> {
    try {
      const job = await openai.fineTuning.jobs.retrieve(jobId);
      return job;
    } catch (error) {
      Logger.error('❌ Failed to retrieve job status:', error);
      throw error;
    }
  }

  /**
   * Format status display following workshop logging patterns
   */
  private displayStatus(job: any, localJobInfo: any): void {
    Logger.info('🎯 Workshop: Progressive Product Semantic Search - Branch 4');
    Logger.info(`📊 Fine-tuning Status Check`);
    Logger.info(`🆔 Job ID: ${job.id}`);
    Logger.info(`⏱️ Status: ${job.status}`);
    Logger.info(`📁 Training file: ${job.training_file}`);
    Logger.info(`🤖 Base model: ${job.model}`);
    
    if (job.fine_tuned_model) {
      Logger.info(`✅ Fine-tuned model: ${job.fine_tuned_model}`);
    }

    // Display metrics if available (cost optimization tracking)
    if (job.trained_tokens) {
      Logger.info(`📊 Trained tokens: ${job.trained_tokens.toLocaleString()}`);
    }

    if (job.hyperparameters) {
      Logger.info(`🔧 Hyperparameters:`);
      Logger.info(`   Epochs: ${job.hyperparameters.n_epochs}`);
      Logger.info(`   Batch size: ${job.hyperparameters.batch_size}`);
      Logger.info(`   Learning rate: ${job.hyperparameters.learning_rate_multiplier}`);
    }

    // Workshop context
    Logger.info(`🏗️ Created: ${localJobInfo.createdAt}`);
    Logger.info(`🎯 Purpose: ${localJobInfo.purpose}`);
  }

  /**
   * Update local job info with latest status
   */
  private updateJobInfo(job: any, localJobInfo: any): void {
    const updatedInfo = {
      ...localJobInfo,
      lastChecked: new Date().toISOString(),
      currentStatus: job.status,
      fineTunedModel: job.fine_tuned_model || null,
      trainedTokens: job.trained_tokens || null,
      estimatedFinish: job.estimated_finish || null
    };

    fs.writeFileSync(this.jobsFilePath, JSON.stringify(updatedInfo, null, 2));
    Logger.info('📁 Job info updated');
  }

  /**
   * Check training status following workshop patterns
   */
  async checkStatus(): Promise<void> {
    try {
      Logger.info('🔍 Checking fine-tuning job status...');

      // Load local job info
      const localJobInfo = this.loadJobInfo();
      
      // Get current status from OpenAI
      const job = await this.getJobStatus(localJobInfo.jobId);

      // Display status with workshop context
      this.displayStatus(job, localJobInfo);

      // Update local tracking
      this.updateJobInfo(job, localJobInfo);

      // Status-specific messaging following workshop patterns
      console.log('\n📊 Current Status:', job.status);
      
      switch (job.status) {
        case 'validating_files':
          console.log('🔍 Validating training data format and content...');
          console.log('⏳ This usually takes 1-2 minutes');
          break;
          
        case 'queued':
          console.log('📋 Job is queued for processing...');
          console.log('⏳ Waiting for available compute resources');
          break;
          
        case 'running':
          console.log('🚀 Training in progress!');
          console.log('⏳ Expected completion: 10-20 minutes');
          if (job.trained_tokens) {
            console.log(`📊 Progress: ${job.trained_tokens.toLocaleString()} tokens processed`);
          }
          break;
          
        case 'succeeded':
          console.log('✅ Training completed successfully!');
          console.log(`🤖 Fine-tuned model: ${job.fine_tuned_model}`);
          console.log('📋 Next step: npm run fine-tuning:evaluate');
          break;
          
        case 'failed':
          console.log('❌ Training failed');
          if (job.error) {
            console.log(`🔍 Error: ${job.error.message}`);
          }
          console.log('🛠️ Check your training data format');
          break;
          
        case 'cancelled':
          console.log('⏹️ Training was cancelled');
          break;
          
        default:
          console.log(`ℹ️ Status: ${job.status}`);
      }

      // Workshop cost tracking
      if (job.trained_tokens) {
        const estimatedCost = (job.trained_tokens / 1000000) * 8; // $8 per 1M tokens for gpt-4o-mini fine-tuning
        console.log(`💰 Estimated cost: ~$${estimatedCost.toFixed(4)} (workshop cost optimization)`);
      }

    } catch (error) {
      Logger.error('❌ Status check failed:', error);
      console.error('\n❌ Status check failed!');
      console.error('🔍 Error details:', error instanceof Error ? error.message : error);
      console.error('\n🛠️ Troubleshooting:');
      console.error('   1. Verify job was created: npm run fine-tuning:train');
      console.error('   2. Check OpenAI API connectivity');
      console.error('   3. Verify fine-tuning-jobs.json exists');
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const checker = new StatusChecker();
  checker.checkStatus().catch(console.error);
}

export { StatusChecker };