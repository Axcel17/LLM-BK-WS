import { generateEnhancedDatasets } from './dataset-generator';
import { AdvancedEvaluator } from './evaluator';
import { readFileSync } from 'fs';
import * as path from 'path';

async function setupBaseline() {
  console.log('🎯 FINE-TUNING BASELINE SETUP');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Generate datasets
    console.log('1️⃣ Generating training and test datasets...');
    const results = generateEnhancedDatasets();
    
    console.log(`   ✓ Generated ${results.trainingExamples} training examples`);
    console.log(`   ✓ Generated ${results.testExamples} test examples`);
    
    // Step 2: Test baseline model
    console.log('\n2️⃣ Testing baseline model performance...');
    
    // Load test queries
    const testData = readFileSync(path.join(__dirname, 'test_data.jsonl'), 'utf8');
    const testQueries = testData.split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          const parsed = JSON.parse(line);
          return parsed.messages.find((m: any) => m.role === 'user')?.content;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .slice(0, 10); // Test with first 10 for quick baseline
    
    console.log(`   Testing with ${testQueries.length} queries...`);
    
    // Evaluate baseline
    const evaluator = new AdvancedEvaluator('gpt-4o-mini-2024-07-18');
    const testExamples = testData.split('\n')
      .filter(line => line.trim())
      .slice(0, 10)
      .map(line => {
        const parsed = JSON.parse(line);
        const userMessage = parsed.messages.find((m: any) => m.role === 'user')?.content;
        const assistantMessage = parsed.messages.find((m: any) => m.role === 'assistant')?.content;
        
        return {
          query: userMessage,
          expected: JSON.parse(assistantMessage)
        };
      });
    
    const baselineResults = await evaluator.evaluateModel(testExamples);
    
    console.log('\n📊 BASELINE RESULTS:');
    console.log(`   Overall Accuracy: ${(baselineResults.overallAccuracy * 100).toFixed(1)}%`);
    console.log(`   Intent Accuracy: ${(baselineResults.intentAccuracy * 100).toFixed(1)}%`);
    console.log(`   Budget Accuracy: ${(baselineResults.budgetAccuracy * 100).toFixed(1)}%`);
    console.log(`   Avg Response Time: ${baselineResults.avgResponseTime.toFixed(0)}ms`);
    console.log(`   Valid JSON Rate: ${(baselineResults.validJsonRate * 100).toFixed(1)}%`);
    
    // Step 3: Next steps
    console.log('\n3️⃣ NEXT STEPS:');
    console.log('   📤 Upload datasets to OpenAI Fine-tuning');
    console.log('   🚀 Create fine-tuning job');
    console.log('   ⏳ Wait for training completion (~20-30 minutes)');
    console.log('   🔬 Run comparative evaluation');
    console.log('   🚦 Make Go/No-Go decision');
    
    console.log('\n✅ Baseline setup complete!');
    console.log('\n🔄 To start fine-tuning:');
    console.log('   npm run fine-tuning:start');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupBaseline();
}

export { setupBaseline };