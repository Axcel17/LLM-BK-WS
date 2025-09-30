import fs from 'fs';
import path from 'path';
import { Logger } from '../../src/utils/logger';
import { QUERY_PARSER_SYSTEM_PROMPT } from '../../src/constants/query-parser';

interface TrainingExample {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
}

/**
 * Fine-tuning Dataset Generator
 * Generates training and test data for improving filter extraction precision
 * Part of Branch 4: Fine-tuning implementation
 */
class DatasetGenerator {
  
  /**
   * Generate 30 training examples for fine-tuning
   * Focus: Improve extraction of category, brand, minPrice, maxPrice, priceRange
   */
  private generateTrainingExamples(): TrainingExample[] {
    const examples: TrainingExample[] = [];

    // BATCH 1: Basic category + brand extraction (10 examples)
    const batch1 = [
      {
        query: "Busco un smartphone Samsung económico",
        response: '{"category":"electronics","brand":"Samsung","priceRange":"economic"}'
      },
      {
        query: "Quiero una laptop Apple para diseño gráfico, presupuesto máximo 2000 dólares",
        response: '{"category":"electronics","brand":"Apple","maxPrice":2000}'
      },
      {
        query: "¿Tienen televisores premium?",
        response: '{"category":"electronics","priceRange":"premium"}'
      },
      {
        query: "Necesito una aspiradora para el hogar, que no pase de 300 dólares",
        response: '{"category":"home","maxPrice":300}'
      },
      {
        query: "Busco ropa deportiva Nike barata",
        response: '{"category":"clothing","brand":"Nike","priceRange":"economic"}'
      },
      {
        query: "Quiero una cafetera para mi cocina, máximo 150 dólares",
        response: '{"category":"home","maxPrice":150}'
      },
      {
        query: "¿Tienen tablets Samsung de gama media?",
        response: '{"category":"electronics","brand":"Samsung","priceRange":"mid-range"}'
      },
      {
        query: "Busco una camisa formal para hombre, presupuesto hasta 80 dólares",
        response: '{"category":"clothing","maxPrice":80}'
      },
      {
        query: "Necesito una licuadora económica para mi casa",
        response: '{"category":"home","priceRange":"economic"}'
      },
      {
        query: "Quiero unos audífonos Sony, no más de 120 dólares",
        response: '{"category":"electronics","brand":"Sony","maxPrice":120}'
      }
    ];

    // BATCH 2: Complex price ranges and brand combinations (10 examples)
    const batch2 = [
      {
        query: "iPhone entre 800 y 1200 dólares para mi trabajo",
        response: '{"category":"electronics","brand":"Apple","minPrice":800,"maxPrice":1200}'
      },
      {
        query: "Zapatos deportivos Adidas de precio medio",
        response: '{"category":"clothing","brand":"Adidas","priceRange":"mid-range"}'
      },
      {
        query: "Televisor LG premium para mi sala",
        response: '{"category":"electronics","brand":"LG","priceRange":"premium"}'
      },
      {
        query: "Electrodomésticos baratos para cocina, hasta 200 dólares",
        response: '{"category":"home","maxPrice":200,"priceRange":"economic"}'
      },
      {
        query: "Ropa casual marca Levi's, presupuesto entre 50 y 150",
        response: '{"category":"clothing","brand":"Levi\'s","minPrice":50,"maxPrice":150}'
      },
      {
        query: "Laptop gaming HP de gama alta",
        response: '{"category":"electronics","brand":"HP","priceRange":"premium"}'
      },
      {
        query: "Muebles para oficina en casa, económicos",
        response: '{"category":"home","priceRange":"economic"}'
      },
      {
        query: "Smartwatch Apple Watch, máximo 500 dólares",
        response: '{"category":"electronics","brand":"Apple","maxPrice":500}'
      },
      {
        query: "Jeans marca Gap de precio accesible",
        response: '{"category":"clothing","brand":"Gap","priceRange":"economic"}'
      },
      {
        query: "Refrigerador Samsung entre 1000 y 1500 dólares",
        response: '{"category":"home","brand":"Samsung","minPrice":1000,"maxPrice":1500}'
      }
    ];

    // BATCH 3: Mixed filters and edge cases (10 examples)
    const batch3 = [
      {
        query: "Busco algo de tecnología Sony barato",
        response: '{"category":"electronics","brand":"Sony","priceRange":"economic"}'
      },
      {
        query: "Ropa de marca para mujer, presupuesto flexible hasta 300",
        response: '{"category":"clothing","maxPrice":300}'
      },
      {
        query: "Necesito equipos para mi hogar, presupuesto mínimo 100 hasta 500",
        response: '{"category":"home","minPrice":100,"maxPrice":500}'
      },
      {
        query: "Tablet económica para estudios, cualquier marca",
        response: '{"category":"electronics","priceRange":"economic"}'
      },
      {
        query: "Zapatillas Nike para correr, gama media-alta",
        response: '{"category":"clothing","brand":"Nike","priceRange":"mid-range"}'
      },
      {
        query: "Electrodomésticos premium marca Bosch",
        response: '{"category":"home","brand":"Bosch","priceRange":"premium"}'
      },
      {
        query: "Celular económico para regalo, hasta 250 dólares",
        response: '{"category":"electronics","maxPrice":250,"priceRange":"economic"}'
      },
      {
        query: "Vestido elegante marca Zara, precio medio",
        response: '{"category":"clothing","brand":"Zara","priceRange":"mid-range"}'
      },
      {
        query: "Aspiradora robot de alta gama, presupuesto entre 400 y 800",
        response: '{"category":"home","minPrice":400,"maxPrice":800,"priceRange":"premium"}'
      },
      {
        query: "Audífonos inalámbricos marca Bose, los mejores",
        response: '{"category":"electronics","brand":"Bose","priceRange":"premium"}'
      }
    ];

    // Convert all batches to training format
    [batch1, batch2, batch3].forEach((batch, index) => {
      batch.forEach(example => {
        examples.push({
          messages: [
            { role: 'system', content: QUERY_PARSER_SYSTEM_PROMPT },
            { role: 'user', content: example.query },
            { role: 'assistant', content: example.response }
          ]
        });
      });
      Logger.info(`✅ Generated batch ${index + 1}: ${batch.length} examples`);
    });

    return examples;
  }

  /**
   * Generate 20 test examples for comprehensive evaluation
   */
  private generateTestExamples(): TrainingExample[] {
    const testExamples = [
      // Electronics with brands and prices
      {
        query: "iPhone 15 Pro barato para estudiante",
        response: '{"category":"electronics","brand":"Apple","priceRange":"economic"}'
      },
      {
        query: "Laptop Dell entre 800 y 1200 para trabajo",
        response: '{"category":"electronics","brand":"Dell","minPrice":800,"maxPrice":1200}'
      },
      {
        query: "Smart TV Samsung premium 65 pulgadas",
        response: '{"category":"electronics","brand":"Samsung","priceRange":"premium"}'
      },
      {
        query: "Auriculares Beats económicos máximo 150",
        response: '{"category":"electronics","brand":"Beats","maxPrice":150,"priceRange":"economic"}'
      },
      {
        query: "Tablet para niños, precio accesible",
        response: '{"category":"electronics","priceRange":"economic"}'
      },
      
      // Clothing with various filters
      {
        query: "Zapatos Nike para correr, presupuesto 200 dólares",
        response: '{"category":"clothing","brand":"Nike","maxPrice":200}'
      },
      {
        query: "Jeans Levi's de gama media",
        response: '{"category":"clothing","brand":"Levi\'s","priceRange":"mid-range"}'
      },
      {
        query: "Ropa deportiva Adidas premium",
        response: '{"category":"clothing","brand":"Adidas","priceRange":"premium"}'
      },
      {
        query: "Camisa formal barata hasta 50 dólares",
        response: '{"category":"clothing","maxPrice":50,"priceRange":"economic"}'
      },
      {
        query: "Vestido elegante marca Zara entre 80 y 150",
        response: '{"category":"clothing","brand":"Zara","minPrice":80,"maxPrice":150}'
      },
      
      // Home products with diverse scenarios
      {
        query: "Refrigerador premium para mi cocina nueva",
        response: '{"category":"home","priceRange":"premium"}'
      },
      {
        query: "Aspiradora Dyson de alta calidad",
        response: '{"category":"home","brand":"Dyson","priceRange":"premium"}'
      },
      {
        query: "Microondas económico hasta 100 dólares",
        response: '{"category":"home","maxPrice":100,"priceRange":"economic"}'
      },
      {
        query: "Muebles IKEA para sala, presupuesto 500",
        response: '{"category":"home","brand":"IKEA","maxPrice":500}'
      },
      {
        query: "Cafetera Nespresso gama media",
        response: '{"category":"home","brand":"Nespresso","priceRange":"mid-range"}'
      },
      
      // Mixed and complex scenarios
      {
        query: "Productos Apple baratos para oficina",
        response: '{"category":"electronics","brand":"Apple","priceRange":"economic"}'
      },
      {
        query: "Electrodomésticos marca Bosch entre 300 y 800",
        response: '{"category":"home","brand":"Bosch","minPrice":300,"maxPrice":800}'
      },
      {
        query: "Tecnología premium para gaming",
        response: '{"category":"electronics","priceRange":"premium"}'
      },
      {
        query: "Ropa casual marca Gap económica",
        response: '{"category":"clothing","brand":"Gap","priceRange":"economic"}'
      },
      {
        query: "Smart home devices hasta 250 dólares",
        response: '{"category":"electronics","maxPrice":250}'
      }
    ];

    return testExamples.map(example => ({
      messages: [
        { role: 'system', content: QUERY_PARSER_SYSTEM_PROMPT },
        { role: 'user', content: example.query },
        { role: 'assistant', content: example.response }
      ]
    }));
  }

  /**
   * Save examples to JSONL format required by OpenAI fine-tuning
   */
  private saveToJsonl(examples: TrainingExample[], filename: string): void {
    const outputPath = path.join(__dirname, filename);
    const jsonlContent = examples
      .map(example => JSON.stringify(example))
      .join('\n');

    fs.writeFileSync(outputPath, jsonlContent, 'utf8');
    Logger.info(`📁 Saved ${examples.length} examples to ${filename}`);
  }

  /**
   * Generate complete dataset for fine-tuning
   */
  async generate(): Promise<void> {
    try {
      Logger.info('🏗️ Starting fine-tuning dataset generation...');
      Logger.info('🎯 Workshop: Progressive Product Semantic Search - Branch 4');
      
      // Create output directory if it doesn't exist
      const outputDir = __dirname;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Generate training data (30 examples total)
      const trainingExamples = this.generateTrainingExamples();
      this.saveToJsonl(trainingExamples, 'training_data.jsonl');

      // Generate test data (20 examples)
      const testExamples = this.generateTestExamples();
      this.saveToJsonl(testExamples, 'test_data.jsonl');

      // Summary with workshop context
      Logger.info('🎯 Dataset generation completed!');
      Logger.info(`📊 Training examples: ${trainingExamples.length} (complete dataset)`);
      Logger.info(`🧪 Test examples: ${testExamples.length}`);
      Logger.info('📁 Files saved to data/fine-tuning/');
      Logger.info('💡 Ready for fine-tuning workflow');
      
      console.log('\n✅ Complete dataset generated successfully!');
      console.log('📋 Dataset composition:');
      console.log('   📊 Training: 30 examples (3 batches of 10)');
      console.log('   🧪 Testing: 20 examples (comprehensive evaluation)');
      console.log('📋 Next steps:');
      console.log('   1. npm run fine-tuning:train');
      console.log('   2. npm run fine-tuning:status');
      console.log('   3. npm run fine-tuning:evaluate');

    } catch (error) {
      Logger.error('❌ Dataset generation failed:', error);
      throw error;
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const generator = new DatasetGenerator();
  generator.generate().catch(console.error);
}

export { DatasetGenerator };