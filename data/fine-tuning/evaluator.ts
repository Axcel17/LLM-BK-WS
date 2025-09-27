import { openai } from '../../src/config/index';
import { readFileSync } from 'fs';
import * as path from 'path';
import { Logger } from '../../src/utils/logger';

// ============================================================================
// ADVANCED EVALUATION METRICS SYSTEM
// ============================================================================

interface IntentClassification {
  intent_type: 'GIFT' | 'PERSONAL_USE' | 'BUSINESS' | 'COMPARISON' | 'URGENT';
  category?: string;
  budget_tier: 'economic' | 'mid_range' | 'premium' | 'unspecified';
  recipient?: string;
  context_tags: string[];
  priority_features: string[];
}

interface TestExample {
  query: string;
  expected: IntentClassification;
  predicted?: IntentClassification;
}

interface DetailedMetrics {
  // Overall accuracy
  overallAccuracy: number;
  
  // Specific metrics
  intentAccuracy: number;        // Correct intent classification
  budgetAccuracy: number;        // Correct budget tier
  categoryAccuracy: number;      // Correct category when specified
  contextRelevance: number;      // Quality of context tags
  featureQuality: number;        // Relevance of priority features
  
  // Detailed breakdowns
  intentConfusionMatrix: Record<string, Record<string, number>>;
  budgetDistribution: Record<string, { correct: number; total: number }>;
  
  // Performance metrics
  avgResponseTime: number;
  validJsonRate: number;
  
  // Error analysis
  commonErrors: Array<{
    type: string;
    count: number;
    examples: string[];
  }>;
}

// ============================================================================
// EVALUATION FUNCTIONS
// ============================================================================

export class AdvancedEvaluator {
  private model: string;
  
  constructor(modelName: string) {
    this.model = modelName;
  }
  
  async evaluateModel(testExamples: TestExample[]): Promise<DetailedMetrics> {
    console.log(`🔍 Starting detailed evaluation of ${this.model}`);
    console.log(`📊 Testing with ${testExamples.length} examples...\n`);
    
    const results: TestExample[] = [];
    const responseTimes: number[] = [];
    let validJsonCount = 0;
    
    // Process each test example
    for (let i = 0; i < testExamples.length; i++) {
      const example = testExamples[i];
      console.log(`Processing ${i + 1}/${testExamples.length}: "${example.query.substring(0, 50)}..."`);
      
      try {
        const startTime = Date.now();
        
        const response = await openai.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: "system",
              content: "Eres un experto clasificador de intenciones para un sistema de recomendación de productos. Analiza la consulta del usuario y extrae la intención, contexto y prioridades. Responde solo en formato JSON válido."
            },
            {
              role: "user",
              content: example.query
            }
          ],
          max_tokens: 250,
          temperature: 0.1 // Low temperature for consistent results
        });
        
        const endTime = Date.now();
        responseTimes.push(endTime - startTime);
        
        const resultText = response.choices[0]?.message?.content;
        if (resultText) {
          try {
            const predicted = JSON.parse(resultText) as IntentClassification;
            validJsonCount++;
            
            results.push({
              ...example,
              predicted
            });
          } catch (parseError) {
            console.log(`  ❌ Invalid JSON for query: ${example.query}`);
            results.push(example); // Add without prediction
          }
        }
        
        // Add small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`  ❌ Error processing: ${error}`);
        results.push(example); // Add without prediction
      }
    }
    
    // Calculate metrics
    return this.calculateDetailedMetrics(results, responseTimes, validJsonCount);
  }
  
  private calculateDetailedMetrics(results: TestExample[], responseTimes: number[], validJsonCount: number): DetailedMetrics {
    console.log('\n📊 Calculating detailed metrics...');
    
    const metrics: DetailedMetrics = {
      overallAccuracy: 0,
      intentAccuracy: 0,
      budgetAccuracy: 0,
      categoryAccuracy: 0,
      contextRelevance: 0,
      featureQuality: 0,
      intentConfusionMatrix: {},
      budgetDistribution: {},
      avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      validJsonRate: validJsonCount / results.length,
      commonErrors: []
    };
    
    let intentCorrect = 0;
    let budgetCorrect = 0;
    let categoryCorrect = 0;
    let contextRelevanceSum = 0;
    let featureQualitySum = 0;
    let overallCorrect = 0;
    
    const errors: Record<string, string[]> = {
      'intent_mismatch': [],
      'budget_mismatch': [],
      'category_mismatch': [],
      'missing_prediction': []
    };
    
    results.forEach(result => {
      if (!result.predicted) {
        errors.missing_prediction.push(result.query);
        return;
      }
      
      const { expected, predicted } = result;
      
      // Ensure arrays exist
      const expectedContextTags = expected.context_tags || [];
      const predictedContextTags = predicted.context_tags || [];
      const expectedFeatures = expected.priority_features || [];
      const predictedFeatures = predicted.priority_features || [];
      
      // Intent accuracy
      const intentMatch = expected.intent_type === predicted.intent_type;
      if (intentMatch) intentCorrect++;
      else errors.intent_mismatch.push(`Expected: ${expected.intent_type}, Got: ${predicted.intent_type} for "${result.query}"`);
      
      // Budget accuracy
      const budgetMatch = expected.budget_tier === predicted.budget_tier;
      if (budgetMatch) budgetCorrect++;
      else errors.budget_mismatch.push(`Expected: ${expected.budget_tier}, Got: ${predicted.budget_tier}`);
      
      // Category accuracy (if specified)
      if (expected.category && predicted.category) {
        const categoryMatch = expected.category === predicted.category;
        if (categoryMatch) categoryCorrect++;
        else errors.category_mismatch.push(`Expected: ${expected.category}, Got: ${predicted.category}`);
      }
      
      // Context relevance (how many expected tags are present)
      const contextScore = this.calculateContextRelevance(expectedContextTags, predictedContextTags);
      contextRelevanceSum += contextScore;
      
      // Feature quality (semantic similarity of features)
      const featureScore = this.calculateFeatureQuality(expectedFeatures, predictedFeatures);
      featureQualitySum += featureScore;
      
      // Overall correctness (all main fields correct)
      if (intentMatch && budgetMatch) {
        overallCorrect++;
      }
      
      // Build confusion matrix
      if (!metrics.intentConfusionMatrix[expected.intent_type]) {
        metrics.intentConfusionMatrix[expected.intent_type] = {};
      }
      if (!metrics.intentConfusionMatrix[expected.intent_type][predicted.intent_type]) {
        metrics.intentConfusionMatrix[expected.intent_type][predicted.intent_type] = 0;
      }
      metrics.intentConfusionMatrix[expected.intent_type][predicted.intent_type]++;
      
      // Budget distribution
      if (!metrics.budgetDistribution[expected.budget_tier]) {
        metrics.budgetDistribution[expected.budget_tier] = { correct: 0, total: 0 };
      }
      metrics.budgetDistribution[expected.budget_tier].total++;
      if (budgetMatch) {
        metrics.budgetDistribution[expected.budget_tier].correct++;
      }
    });
    
    const validResults = results.filter(r => r.predicted).length;
    
    // Calculate final metrics
    metrics.overallAccuracy = overallCorrect / validResults;
    metrics.intentAccuracy = intentCorrect / validResults;
    metrics.budgetAccuracy = budgetCorrect / validResults;
    metrics.categoryAccuracy = categoryCorrect / Math.max(1, results.filter(r => r.expected.category && r.predicted?.category).length);
    metrics.contextRelevance = contextRelevanceSum / validResults;
    metrics.featureQuality = featureQualitySum / validResults;
    
    // Common errors
    metrics.commonErrors = Object.entries(errors)
      .filter(([, examples]) => examples.length > 0)
      .map(([type, examples]) => ({
        type,
        count: examples.length,
        examples: examples.slice(0, 3) // Show first 3 examples
      }));
    
    return metrics;
  }
  
  private calculateContextRelevance(expected: string[], predicted: string[]): number {
    if (!expected || expected.length === 0) return 1;
    if (!predicted || predicted.length === 0) return 0;
    
    const matches = expected.filter(tag => 
      predicted.some(pTag => 
        pTag && tag && (
          pTag.toLowerCase().includes(tag.toLowerCase()) || 
          tag.toLowerCase().includes(pTag.toLowerCase())
        )
      )
    ).length;
    
    return matches / expected.length;
  }
  
  private calculateFeatureQuality(expected: string[], predicted: string[]): number {
    if (!expected || expected.length === 0) return 1;
    if (!predicted || predicted.length === 0) return 0;
    
    // Simple keyword matching for now
    const matches = expected.filter(feature => 
      predicted.some(pFeature => 
        pFeature && feature && this.semanticSimilarity(feature, pFeature) > 0.5
      )
    ).length;
    
    return matches / expected.length;
  }
  
  private semanticSimilarity(a: string, b: string): number {
    // Simple semantic similarity based on common words and concepts
    const synonyms: Record<string, string[]> = {
      'quality': ['premium', 'high_quality', 'professional', 'top_tier'],
      'portable': ['mobile', 'lightweight', 'travel_friendly', 'compact'],
      'reliable': ['durable', 'stable', 'trustworthy', 'consistent'],
      'performance': ['speed', 'efficiency', 'power', 'capability']
    };
    
    if (a === b) return 1;
    
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    // Check direct word matches
    const aWords = aLower.split('_');
    const bWords = bLower.split('_');
    
    let matches = 0;
    aWords.forEach(aWord => {
      if (bWords.includes(aWord)) matches++;
      
      // Check synonyms
      Object.entries(synonyms).forEach(([key, values]) => {
        if (aWord === key && values.some(v => bWords.includes(v))) matches += 0.8;
        if (values.includes(aWord) && bWords.includes(key)) matches += 0.8;
      });
    });
    
    return Math.min(1, matches / Math.max(aWords.length, bWords.length));
  }
  
  displayMetrics(metrics: DetailedMetrics): void {
    console.log('\n📈 DETAILED EVALUATION RESULTS');
    console.log('='.repeat(60));
    
    console.log('\n🎯 ACCURACY METRICS:');
    console.log(`  Overall Accuracy: ${(metrics.overallAccuracy * 100).toFixed(1)}%`);
    console.log(`  Intent Accuracy: ${(metrics.intentAccuracy * 100).toFixed(1)}%`);
    console.log(`  Budget Accuracy: ${(metrics.budgetAccuracy * 100).toFixed(1)}%`);
    console.log(`  Category Accuracy: ${(metrics.categoryAccuracy * 100).toFixed(1)}%`);
    console.log(`  Context Relevance: ${(metrics.contextRelevance * 100).toFixed(1)}%`);
    console.log(`  Feature Quality: ${(metrics.featureQuality * 100).toFixed(1)}%`);
    
    console.log('\n⚡ PERFORMANCE METRICS:');
    console.log(`  Avg Response Time: ${metrics.avgResponseTime.toFixed(0)}ms`);
    console.log(`  Valid JSON Rate: ${(metrics.validJsonRate * 100).toFixed(1)}%`);
    
    console.log('\n🔍 INTENT CONFUSION MATRIX:');
    Object.entries(metrics.intentConfusionMatrix).forEach(([expected, predictions]) => {
      const total = Object.values(predictions).reduce((a, b) => a + b, 0);
      const correct = predictions[expected] || 0;
      const accuracy = ((correct / total) * 100).toFixed(1);
      console.log(`  ${expected}: ${correct}/${total} correct (${accuracy}%)`);
    });
    
    console.log('\n💰 BUDGET TIER PERFORMANCE:');
    Object.entries(metrics.budgetDistribution).forEach(([tier, stats]) => {
      const accuracy = ((stats.correct / stats.total) * 100).toFixed(1);
      console.log(`  ${tier}: ${stats.correct}/${stats.total} correct (${accuracy}%)`);
    });
    
    if (metrics.commonErrors.length > 0) {
      console.log('\n❌ COMMON ERRORS:');
      metrics.commonErrors.forEach(error => {
        console.log(`  ${error.type}: ${error.count} occurrences`);
        error.examples.forEach(example => {
          console.log(`    - ${example.substring(0, 80)}...`);
        });
      });
    }
  }
}

// ============================================================================
// COMPARISON UTILITY
// ============================================================================

export async function compareModelsDetailed(baseModel: string, fineTunedModel: string, testDataPath: string): Promise<void> {
  console.log('\n🔬 ADVANCED MODEL COMPARISON');
  console.log('='.repeat(60));
  
  // Load test data
  const testData = readFileSync(testDataPath, 'utf8');
  const testExamples: TestExample[] = testData.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const parsed = JSON.parse(line);
      const userMessage = parsed.messages.find((m: any) => m.role === 'user')?.content;
      const assistantMessage = parsed.messages.find((m: any) => m.role === 'assistant')?.content;
      
      return {
        query: userMessage,
        expected: JSON.parse(assistantMessage)
      };
    });
  
  console.log(`Testing with ${testExamples.length} examples...\n`);
  
  // Evaluate both models
  const baseEvaluator = new AdvancedEvaluator(baseModel);
  const fineTunedEvaluator = new AdvancedEvaluator(fineTunedModel);
  
  console.log('📊 Evaluating base model...');
  const baseMetrics = await baseEvaluator.evaluateModel(testExamples);
  
  console.log('\n📊 Evaluating fine-tuned model...');
  const fineTunedMetrics = await fineTunedEvaluator.evaluateModel(testExamples);
  
  // Display results
  console.log('\n🏆 BASE MODEL RESULTS:');
  baseEvaluator.displayMetrics(baseMetrics);
  
  console.log('\n🚀 FINE-TUNED MODEL RESULTS:');
  fineTunedEvaluator.displayMetrics(fineTunedMetrics);
  
  // Improvement analysis
  console.log('\n📈 IMPROVEMENT ANALYSIS:');
  console.log('='.repeat(60));
  
  const improvements = {
    overall: fineTunedMetrics.overallAccuracy - baseMetrics.overallAccuracy,
    intent: fineTunedMetrics.intentAccuracy - baseMetrics.intentAccuracy,
    budget: fineTunedMetrics.budgetAccuracy - baseMetrics.budgetAccuracy,
    context: fineTunedMetrics.contextRelevance - baseMetrics.contextRelevance,
    features: fineTunedMetrics.featureQuality - baseMetrics.featureQuality,
    speed: baseMetrics.avgResponseTime - fineTunedMetrics.avgResponseTime
  };
  
  Object.entries(improvements).forEach(([metric, improvement]) => {
    const sign = improvement > 0 ? '+' : '';
    const unit = metric === 'speed' ? 'ms' : '%';
    const value = metric === 'speed' ? improvement.toFixed(0) : (improvement * 100).toFixed(1);
    console.log(`  ${metric}: ${sign}${value}${unit}`);
  });
  
  // Go/No-Go Decision
  console.log('\n🚦 GO/NO-GO DECISION:');
  console.log('='.repeat(60));
  
  const criteriaMetric = improvements.overall >= 0.1 && fineTunedMetrics.overallAccuracy >= 0.85;
  const criteriaIntent = improvements.intent >= 0.1;
  const criteriaSpeed = improvements.speed >= -500; // Not more than 500ms slower
  
  const shouldDeploy = criteriaMetric && criteriaIntent && criteriaSpeed;
  
  if (shouldDeploy) {
    console.log('✅ GO - DEPLOY FINE-TUNED MODEL');
    console.log('Reasons:');
    console.log(`  ✓ Overall accuracy improvement: ${(improvements.overall * 100).toFixed(1)}% (≥10%)`);
    console.log(`  ✓ Intent accuracy improvement: ${(improvements.intent * 100).toFixed(1)}% (≥10%)`);
    console.log(`  ✓ Absolute accuracy: ${(fineTunedMetrics.overallAccuracy * 100).toFixed(1)}% (≥85%)`);
  } else {
    console.log('❌ NO-GO - KEEP BASE MODEL');
    console.log('Reasons:');
    if (!criteriaMetric) console.log(`  ❌ Overall improvement insufficient: ${(improvements.overall * 100).toFixed(1)}% (target: ≥10%)`);
    if (!criteriaIntent) console.log(`  ❌ Intent improvement insufficient: ${(improvements.intent * 100).toFixed(1)}% (target: ≥10%)`);
    if (!criteriaSpeed) console.log(`  ❌ Speed degradation too high: ${Math.abs(improvements.speed).toFixed(0)}ms slower (limit: 500ms)`);
  }
  
  Logger.info('Advanced model comparison completed', {
    baseModel,
    fineTunedModel,
    baseAccuracy: baseMetrics.overallAccuracy,
    fineTunedAccuracy: fineTunedMetrics.overallAccuracy,
    improvement: improvements.overall,
    decision: shouldDeploy ? 'deploy' : 'reject'
  });
}

export { DetailedMetrics, TestExample, IntentClassification };