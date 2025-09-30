import fs from 'fs';
import path from 'path';
import { openai } from '../../src/config/index';
import { Logger } from '../../src/utils/logger';
import { ProductFiltersSchema } from '../../src/types/product';
import { QUERY_PARSER_SYSTEM_PROMPT } from '../../src/constants/query-parser';

interface EvaluationResult {
  query: string;
  expected: any;
  baseModel: {
    result: any;
    success: boolean;
    tokensUsed: number;
    responseTime: number;
  };
  fineTunedModel: {
    result: any;
    success: boolean;
    tokensUsed: number;
    responseTime: number;
  };
  improvement: {
    fieldsExtracted: string;
    accuracy: string;
    tokenEfficiency: string;
  };
}

/**
 * Fine-tuning Model Evaluator
 * Compares base model vs fine-tuned model performance
 * Part of Branch 4: Fine-tuning implementation
 * Following workshop cost optimization patterns
 */
class ModelEvaluator {
  private readonly jobsFilePath: string;
  private readonly testDataPath: string;

  constructor() {
    this.jobsFilePath = path.join(__dirname, 'fine-tuning-jobs.json');
    this.testDataPath = path.join(__dirname, 'test_data.jsonl');
  }

  /**
   * Load job info following workshop file patterns
   */
  private loadJobInfo(): any {
    if (!fs.existsSync(this.jobsFilePath)) {
      throw new Error('No fine-tuning jobs found. Run: npm run fine-tuning:train');
    }

    const jobData = fs.readFileSync(this.jobsFilePath, 'utf8');
    const jobInfo = JSON.parse(jobData);

    if (!jobInfo.fineTunedModel) {
      throw new Error('Fine-tuning not completed yet. Check status: npm run fine-tuning:status');
    }

    return jobInfo;
  }

  /**
   * Load test examples from JSONL
   */
  private loadTestExamples(): any[] {
    if (!fs.existsSync(this.testDataPath)) {
      throw new Error('Test data not found. Run: npm run fine-tuning:generate');
    }

    const content = fs.readFileSync(this.testDataPath, 'utf8');
    return content.trim().split('\n').map(line => JSON.parse(line));
  }

  /**
   * Extract filters using specified model following workshop patterns
   */
  private async extractFilters(query: string, modelId: string): Promise<{
    result: any;
    success: boolean;
    tokensUsed: number;
    responseTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      const completion = await openai.chat.completions.create({
        model: modelId,
        messages: [
          { role: 'system', content: QUERY_PARSER_SYSTEM_PROMPT },
          { role: 'user', content: query }
        ],
        temperature: 0.1, // Workshop consistency pattern
        max_tokens: 150, // Workshop cost optimization
        response_format: { type: 'json_object' }
      });

      const responseTime = Date.now() - startTime;
      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Validate with workshop schema
      const validatedResult = ProductFiltersSchema.parse(result);

      return {
        result: validatedResult,
        success: true,
        tokensUsed: completion.usage?.total_tokens || 0,
        responseTime
      };
    } catch (error) {
      Logger.error(`Model ${modelId} failed on query: ${query}`, error);
      return {
        result: {},
        success: false,
        tokensUsed: 0,
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Calculate improvement metrics following workshop patterns
   */
  private calculateImprovement(baseResult: any, fineTunedResult: any, expected: any): any {
    const baseFields = Object.keys(baseResult.result).length;
    const fineTunedFields = Object.keys(fineTunedResult.result).length;
    const expectedFields = Object.keys(expected).length;

    const baseAccuracy = this.calculateAccuracy(baseResult.result, expected);
    const fineTunedAccuracy = this.calculateAccuracy(fineTunedResult.result, expected);

    const tokenImprovement = baseResult.tokensUsed > 0 ? 
      ((baseResult.tokensUsed - fineTunedResult.tokensUsed) / baseResult.tokensUsed * 100) : 0;

    return {
      fieldsExtracted: `${baseFields}→${fineTunedFields} (+${fineTunedFields - baseFields})`,
      accuracy: `${baseAccuracy.toFixed(1)}%→${fineTunedAccuracy.toFixed(1)}% (+${(fineTunedAccuracy - baseAccuracy).toFixed(1)}%)`,
      tokenEfficiency: `${tokenImprovement.toFixed(1)}% fewer tokens`
    };
  }

  /**
   * Calculate accuracy percentage
   */
  private calculateAccuracy(result: any, expected: any): number {
    const expectedKeys = Object.keys(expected);
    if (expectedKeys.length === 0) return 100;

    let matches = 0;
    for (const key of expectedKeys) {
      if (result[key] === expected[key]) {
        matches++;
      }
    }

    return (matches / expectedKeys.length) * 100;
  }

  /**
   * Generate evaluation summary following workshop reporting patterns
   */
  private generateSummary(results: EvaluationResult[]): void {
    const totalTests = results.length;
    const baseSuccesses = results.filter(r => r.baseModel.success).length;
    const fineTunedSuccesses = results.filter(r => r.fineTunedModel.success).length;

    const avgBaseTokens = results.reduce((sum, r) => sum + r.baseModel.tokensUsed, 0) / totalTests;
    const avgFineTunedTokens = results.reduce((sum, r) => sum + r.fineTunedModel.tokensUsed, 0) / totalTests;

    const avgBaseTime = results.reduce((sum, r) => sum + r.baseModel.responseTime, 0) / totalTests;
    const avgFineTunedTime = results.reduce((sum, r) => sum + r.fineTunedModel.responseTime, 0) / totalTests;

    Logger.info('📊 Workshop Evaluation Summary:');
    Logger.info(`✅ Success rate: Base ${baseSuccesses}/${totalTests} → Fine-tuned ${fineTunedSuccesses}/${totalTests}`);
    Logger.info(`🚀 Token efficiency: ${avgBaseTokens.toFixed(1)} → ${avgFineTunedTokens.toFixed(1)} tokens`);
    Logger.info(`⚡ Response time: ${avgBaseTime}ms → ${avgFineTunedTime}ms`);

    console.log('\n📊 Workshop Fine-tuning Evaluation Results');
    console.log('==========================================');
    console.log(`🎯 Purpose: QueryParserService filter extraction improvement`);
    console.log(`📋 Test cases: ${totalTests}`);
    console.log(`🤖 Base model: gpt-4o-mini-2024-07-18`);
    console.log(`✨ Fine-tuned model: ${results[0]?.fineTunedModel ? 'Available' : 'Not available'}`);
    console.log('');
    console.log('📈 Performance Metrics:');
    console.log(`   Success rate: ${baseSuccesses}/${totalTests} → ${fineTunedSuccesses}/${totalTests}`);
    console.log(`   Token usage: ${avgBaseTokens.toFixed(1)} → ${avgFineTunedTokens.toFixed(1)} (avg per query)`);
    console.log(`   Response time: ${avgBaseTime}ms → ${avgFineTunedTime}ms (avg)`);
    console.log('');
    console.log('💰 Cost Optimization Impact:');
    const tokenSavings = ((avgBaseTokens - avgFineTunedTokens) / avgBaseTokens * 100);
    console.log(`   Token efficiency: ${tokenSavings.toFixed(1)}% improvement`);
    console.log(`   Estimated cost per 1000 queries: $${(avgFineTunedTokens * 1000 / 1000000 * 0.15).toFixed(4)}`);
  }

  /**
   * Run complete evaluation following workshop patterns
   */
  async evaluate(): Promise<void> {
    try {
      Logger.info('🔍 Starting fine-tuning model evaluation...');
      Logger.info('🎯 Workshop: Progressive Product Semantic Search - Branch 4');

      // Load job info and test data
      const jobInfo = this.loadJobInfo();
      const testExamples = this.loadTestExamples();

      Logger.info(`🤖 Base model: gpt-4o-mini-2024-07-18`);
      Logger.info(`✨ Fine-tuned model: ${jobInfo.fineTunedModel}`);
      Logger.info(`🧪 Test cases: ${testExamples.length}`);

      const results: EvaluationResult[] = [];

      // Evaluate each test case
      for (let i = 0; i < testExamples.length; i++) {
        const example = testExamples[i];
        const query = example.messages[1].content;
        const expected = JSON.parse(example.messages[2].content);

        Logger.info(`📝 Evaluating ${i + 1}/${testExamples.length}: "${query}"`);

        // Test base model
        const baseResult = await this.extractFilters(query, 'gpt-4o-mini-2024-07-18');
        
        // Test fine-tuned model
        const fineTunedResult = await this.extractFilters(query, jobInfo.fineTunedModel);

        // Calculate improvements
        const improvement = this.calculateImprovement(baseResult, fineTunedResult, expected);

        results.push({
          query,
          expected,
          baseModel: baseResult,
          fineTunedModel: fineTunedResult,
          improvement
        });
      }

      // Save detailed results
      const resultsPath = path.join(__dirname, 'evaluation-results.json');
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      Logger.info(`📁 Detailed results saved to evaluation-results.json`);

      // Generate summary
      this.generateSummary(results);

      console.log('\n✅ Evaluation completed successfully!');
      console.log('📋 Next steps:');
      console.log('   1. Review detailed results in evaluation-results.json');
      console.log('   2. Update QueryParserService to use fine-tuned model');
      console.log('   3. Test improved performance with real queries');

    } catch (error) {
      Logger.error('❌ Evaluation failed:', error);
      console.error('\n❌ Evaluation failed!');
      console.error('🔍 Error details:', error instanceof Error ? error.message : error);
      console.error('\n🛠️ Troubleshooting:');
      console.error('   1. Ensure fine-tuning completed: npm run fine-tuning:status');
      console.error('   2. Check test data exists: npm run fine-tuning:generate');
      console.error('   3. Verify OpenAI API access');
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const evaluator = new ModelEvaluator();
  evaluator.evaluate().catch(console.error);
}

export { ModelEvaluator };