import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';
import * as path from 'path';

// ============================================================================
// IMPROVED DATASET GENERATOR WITH FAKER
// ============================================================================

interface IntentExample {
  query: string;
  expected_intent: {
    intent_type: 'GIFT' | 'PERSONAL_USE' | 'BUSINESS' | 'COMPARISON' | 'URGENT';
    category?: string;
    budget_tier: 'economic' | 'mid_range' | 'premium' | 'unspecified';
    recipient?: string;
    context_tags: string[];
    priority_features: string[];
  };
}

// Product categories and their characteristics
const PRODUCT_CATEGORIES = {
  electronics: {
    items: ['laptop', 'smartphone', 'tablet', 'cámara', 'auriculares', 'smartwatch', 'televisor'],
    contexts: ['work', 'gaming', 'photography', 'entertainment', 'productivity'],
    features: ['high_performance', 'portable', 'battery_life', 'latest_technology', 'user_friendly']
  },
  sports: {
    items: ['zapatillas deportivas', 'ropa deportiva', 'equipo de yoga', 'pesas', 'bicicleta'],
    contexts: ['fitness', 'home_workout', 'outdoor', 'gym', 'wellness'],
    features: ['comfort', 'durability', 'performance_boost', 'beginner_friendly', 'professional_grade']
  },
  home: {
    items: ['muebles', 'decoración', 'electrodomésticos', 'iluminación', 'organización'],
    contexts: ['new_home', 'renovation', 'comfort', 'smart_home', 'organization'],
    features: ['space_optimization', 'style', 'functionality', 'smart_integration', 'durability']
  },
  kitchen: {
    items: ['utensilios de cocina', 'electrodomésticos', 'vajilla', 'cuchillos', 'ollas'],
    contexts: ['cooking', 'baking', 'professional_chef', 'home_cooking', 'entertaining'],
    features: ['cooking_enhancement', 'professional_grade', 'easy_cleanup', 'durability', 'versatility']
  },
  beauty: {
    items: ['productos de belleza', 'maquillaje', 'cuidado de la piel', 'perfumes', 'herramientas de belleza'],
    contexts: ['daily_routine', 'special_occasion', 'professional', 'anti_aging', 'natural'],
    features: ['quality_ingredients', 'long_lasting', 'skin_friendly', 'professional_results', 'easy_application']
  }
};

const RECIPIENTS = ['mother', 'father', 'spouse', 'friend', 'colleague', 'boss', 'sibling', 'child', 'grandmother', 'grandfather'];
const BUDGET_CONTEXTS = ['tight budget', 'mid range', 'premium', 'no limit', 'best value'];
const URGENCY_CONTEXTS = ['urgent', 'last minute', 'emergency', 'replacement needed', 'immediate'];

// ============================================================================
// FAKER-POWERED DATASET GENERATION
// ============================================================================

export function generateGiftExamples(count: number): IntentExample[] {
  const examples: IntentExample[] = [];
  
  for (let i = 0; i < count; i++) {
    const recipient = faker.helpers.arrayElement(RECIPIENTS);
    const category = faker.helpers.arrayElement(Object.keys(PRODUCT_CATEGORIES));
    const categoryData = PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES];
    const item = faker.helpers.arrayElement(categoryData.items);
    const occasion = faker.helpers.arrayElement([
      'cumpleaños', 'aniversario', 'graduación', 'jubilación', 'día de la madre', 
      'día del padre', 'navidad', 'boda', 'baby shower'
    ]);
    
    const budgetHint = faker.helpers.arrayElement([
      'algo especial', 'presupuesto limitado', 'sin límite de precio', 
      'calidad premium', 'algo económico pero bonito'
    ]);
    
    const query = `${budgetHint} para mi ${recipient} en su ${occasion}, busco ${item}`;
    
    examples.push({
      query,
      expected_intent: {
        intent_type: 'GIFT',
        category,
        budget_tier: inferBudgetTier(budgetHint),
        recipient,
        context_tags: ['gift', occasion, category, budgetHint.includes('especial') ? 'special' : 'standard'],
        priority_features: faker.helpers.arrayElements(categoryData.features, { min: 2, max: 4 })
      }
    });
  }
  
  return examples;
}

export function generatePersonalUseExamples(count: number): IntentExample[] {
  const examples: IntentExample[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(Object.keys(PRODUCT_CATEGORIES));
    const categoryData = PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES];
    const item = faker.helpers.arrayElement(categoryData.items);
    const context = faker.helpers.arrayElement(categoryData.contexts);
    const budgetAmount = faker.helpers.arrayElement(['100', '300', '500', '1000', '2000']);
    const currency = faker.helpers.arrayElement(['dólares', 'euros', 'pesos']);
    
    const queryTemplates = [
      `Necesito ${item} para ${context}, presupuesto ${budgetAmount} ${currency}`,
      `Busco ${item} de calidad, tengo ${budgetAmount} ${currency}`,
      `Quiero empezar con ${context}, necesito ${item}`,
      `${item} para uso personal, algo de ${context}`
    ];
    
    const query = faker.helpers.arrayElement(queryTemplates);
    
    examples.push({
      query,
      expected_intent: {
        intent_type: 'PERSONAL_USE',
        category,
        budget_tier: inferBudgetTier(budgetAmount + ' ' + currency),
        context_tags: ['personal', context, category],
        priority_features: faker.helpers.arrayElements(categoryData.features, { min: 2, max: 3 })
      }
    });
  }
  
  return examples;
}

export function generateBusinessExamples(count: number): IntentExample[] {
  const examples: IntentExample[] = [];
  
  const businessTypes = [
    'estudio de fotografía', 'consultora', 'startup tech', 'oficina legal',
    'clínica médica', 'restaurante', 'tienda online', 'agencia de marketing'
  ];
  
  for (let i = 0; i < count; i++) {
    const businessType = faker.helpers.arrayElement(businessTypes);
    const category = faker.helpers.arrayElement(['electronics', 'home']);
    const categoryData = PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES];
    const item = faker.helpers.arrayElement(categoryData.items);
    
    const query = `Equipo profesional para mi ${businessType}, necesito ${item} de grado comercial`;
    
    examples.push({
      query,
      expected_intent: {
        intent_type: 'BUSINESS',
        category,
        budget_tier: 'premium', // Business usually requires premium
        context_tags: ['business', 'professional', businessType.split(' ')[0], 'commercial_grade'],
        priority_features: ['professional_grade', 'reliable', 'scalable', 'ROI_positive']
      }
    });
  }
  
  return examples;
}

export function generateComparisonExamples(count: number): IntentExample[] {
  const examples: IntentExample[] = [];
  
  const comparisons = [
    { brands: ['Apple', 'Samsung'], category: 'electronics', item: 'smartphone' },
    { brands: ['Canon', 'Sony'], category: 'electronics', item: 'cámara' },
    { brands: ['Nike', 'Adidas'], category: 'sports', item: 'zapatillas' },
    { brands: ['Bose', 'Sony'], category: 'electronics', item: 'auriculares' }
  ];
  
  for (let i = 0; i < count; i++) {
    const comp = faker.helpers.arrayElement(comparisons);
    const query = `Compara ${comp.brands[0]} vs ${comp.brands[1]} en ${comp.item}, ¿cuál es mejor?`;
    
    examples.push({
      query,
      expected_intent: {
        intent_type: 'COMPARISON',
        category: comp.category,
        budget_tier: 'premium',
        context_tags: ['comparison', 'brand_comparison', comp.category],
        priority_features: ['quality_comparison', 'feature_analysis', 'value_assessment']
      }
    });
  }
  
  return examples;
}

export function generateUrgentExamples(count: number): IntentExample[] {
  const examples: IntentExample[] = [];
  
  const urgentScenarios = [
    { item: 'laptop', reason: 'presentación mañana', timeline: 'urgente' },
    { item: 'traje', reason: 'entrevista hoy', timeline: 'inmediato' },
    { item: 'regalo', reason: 'cumpleaños en 2 horas', timeline: 'último minuto' },
    { item: 'cargador', reason: 'viaje mañana temprano', timeline: 'emergencia' }
  ];
  
  for (let i = 0; i < count; i++) {
    const scenario = faker.helpers.arrayElement(urgentScenarios);
    const query = `Necesito ${scenario.item} ${scenario.timeline}, ${scenario.reason}`;
    
    examples.push({
      query,
      expected_intent: {
        intent_type: 'URGENT',
        budget_tier: 'unspecified',
        context_tags: ['urgent', scenario.timeline, 'emergency', scenario.reason.split(' ')[0]],
        priority_features: ['immediate_availability', 'quick_delivery', 'emergency_solution']
      }
    });
  }
  
  return examples;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function inferBudgetTier(budgetHint: string): 'economic' | 'mid_range' | 'premium' | 'unspecified' {
  const hint = budgetHint.toLowerCase();
  
  if (hint.includes('económico') || hint.includes('barato') || hint.includes('100')) return 'economic';
  if (hint.includes('premium') || hint.includes('mejor') || hint.includes('2000') || hint.includes('sin límite')) return 'premium';
  if (hint.includes('300') || hint.includes('500') || hint.includes('medio')) return 'mid_range';
  
  return 'unspecified';
}

// ============================================================================
// ENHANCED DATASET GENERATION
// ============================================================================

export function generateEnhancedDatasets() {
  console.log('🚀 Generating enhanced datasets with Faker...\n');
  
  // Training dataset (400 examples total)
  const trainingExamples: IntentExample[] = [
    ...generateGiftExamples(180),      // 45% - Most common in e-commerce
    ...generatePersonalUseExamples(120), // 30% - Second most common
    ...generateBusinessExamples(40),    // 10% - Professional segment
    ...generateComparisonExamples(40),  // 10% - Shopping research
    ...generateUrgentExamples(20)       // 5% - Emergency purchases
  ];
  
  // Test dataset (50 high-quality examples)
  const testExamples: IntentExample[] = [
    ...generateGiftExamples(20),
    ...generatePersonalUseExamples(15),
    ...generateBusinessExamples(5),
    ...generateComparisonExamples(5),
    ...generateUrgentExamples(5)
  ];
  
  // Convert to OpenAI format
  const trainingData = trainingExamples.map(example => ({
    messages: [
      {
        role: "system" as const,
        content: "Eres un experto clasificador de intenciones para un sistema de recomendación de productos. Analiza la consulta del usuario y extrae la intención, contexto y prioridades. Responde solo en formato JSON válido."
      },
      {
        role: "user" as const,
        content: example.query
      },
      {
        role: "assistant" as const,
        content: JSON.stringify(example.expected_intent)
      }
    ]
  }));
  
  const testData = testExamples.map(example => ({
    messages: [
      {
        role: "system" as const,
        content: "Eres un experto clasificador de intenciones para un sistema de recomendación de productos. Analiza la consulta del usuario y extrae la intención, contexto y prioridades. Responde solo en formato JSON válido."
      },
      {
        role: "user" as const,
        content: example.query
      },
      {
        role: "assistant" as const,
        content: JSON.stringify(example.expected_intent)
      }
    ]
  }));
  
  // Save datasets
  const trainingJsonl = trainingData.map(item => JSON.stringify(item)).join('\n');
  const testJsonl = testData.map(item => JSON.stringify(item)).join('\n');
  
  writeFileSync(path.join(__dirname, 'training_data.jsonl'), trainingJsonl);
  writeFileSync(path.join(__dirname, 'test_data.jsonl'), testJsonl);
  
  // Statistics
  console.log('✅ ENHANCED DATASETS GENERATED');
  console.log('=' .repeat(50));
  console.log(`Training examples: ${trainingData.length}`);
  console.log(`Test examples: ${testData.length}`);
  console.log(`Total examples: ${trainingData.length + testData.length}`);
  
  // Intent distribution
  const intentCounts = trainingExamples.reduce((acc, example) => {
    const intent = example.expected_intent.intent_type;
    acc[intent] = (acc[intent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📊 Intent Distribution:');
  Object.entries(intentCounts).forEach(([intent, count]) => {
    const percentage = ((count / trainingData.length) * 100).toFixed(1);
    console.log(`  ${intent}: ${count} examples (${percentage}%)`);
  });
  
  console.log('\n💡 Sample queries generated:');
  testExamples.slice(0, 3).forEach((example, i) => {
    console.log(`  ${i + 1}. "${example.query}"`);
    console.log(`     → ${example.expected_intent.intent_type} (${example.expected_intent.budget_tier})`);
  });
  
  return {
    trainingExamples: trainingData.length,
    testExamples: testData.length,
    trainingPath: path.join(__dirname, 'training_data.jsonl'),
    testPath: path.join(__dirname, 'test_data.jsonl')
  };
}

// Run if called directly
if (require.main === module) {
  generateEnhancedDatasets();
}