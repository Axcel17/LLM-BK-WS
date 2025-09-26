import { openai } from '../config';
import { Logger } from '../utils/logger';
import { z } from 'zod';

// Schema for extracted filters
const ExtractedFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  priceRange: z.enum(['economic', 'mid-range', 'premium']).optional(),
  occasion: z.string().optional(),
  targetUser: z.string().optional(),
});

type ExtractedFilters = z.infer<typeof ExtractedFiltersSchema>;

export class QueryParserService {
  private static readonly SYSTEM_PROMPT = `Eres un experto analizando consultas de productos para extraer filtros de búsqueda.

CATEGORÍAS DISPONIBLES:
- electronics (smartphones, laptops, tablets, auriculares, monitores, teclados, webcams)
- clothing (zapatillas, chaquetas, leggings, camisas, ropa deportiva)
- home (aspiradoras, purificadores, humidificadores, lámparas, organizadores)
- kitchen (freidoras, licuadoras, sartenes, procesadores, cafeteras, cuchillos)
- sports (mancuernas, bicicletas, kettlebells, caminadoras, pelotas, colchonetas)
- education (cursos, kits, libros, materiales educativos)
- accessories (mochilas, powerbanks, relojes, botellas)
- beauty (cepillos faciales, secadores, productos spa, cuidado personal)

MARCAS COMUNES:
Apple, Samsung, Sony, Nike, Adidas, Dell, LG, HP, ChefMaster, BrewMaster, PowerFlex, 
GameZone, TechView, MechPro, CleanBot, AirPure, FlexFit, BusinessElite, CodeAcademy, 
FitCycle, IronFit, RunMaster, AirChef, NutriBlend, GlowSkin, ProDry, SecurePack

RANGOS DE PRECIO:
- economic: < $100
- mid-range: $100-$500  
- premium: > $500

Extrae SOLO la información explícita o claramente implícita. Si no hay información sobre un campo, no lo incluyas.

EJEMPLOS:
"Necesito auriculares baratos" → {"category": "electronics", "priceRange": "economic"}
"Smartphone Samsung de gama alta para fotos" → {"category": "electronics", "brand": "Samsung", "priceRange": "premium"}
"Algo para cocinar, no muy caro, máximo 50 dólares" → {"category": "kitchen", "maxPrice": 50}
"Ropa Nike para entrenar" → {"category": "clothing", "brand": "Nike"}
"Quiero un curso de programación" → {"category": "education"}
"Productos para limpiar la casa" → {"category": "home"}

Responde SOLO con JSON válido, sin explicaciones.`;

  /**
   * Extract structured filters from natural language query
   */
  async extractFilters(query: string): Promise<ExtractedFilters> {
    try {
      Logger.info('🔍 Parsing query for filters:', query);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: QueryParserService.SYSTEM_PROMPT },
          { role: 'user', content: query }
        ],
        temperature: 0.1,
        max_tokens: 150,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        Logger.warn('⚠️ No filters extracted from query');
        return {};
      }

      const parsed = JSON.parse(content);
      const validated = ExtractedFiltersSchema.parse(parsed);
      
      Logger.success('✅ Extracted filters:', validated);
      return validated;

    } catch (error) {
      Logger.error('❌ Failed to extract filters:', error);
      return {}; // Return empty filters on error, don't break search
    }
  }

  /**
   * Convert extracted filters to search filters format
   */
  convertToSearchFilters(extracted: ExtractedFilters): {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  } {
    const filters: any = {};

    // Direct mappings
    if (extracted.category) filters.category = extracted.category;
    if (extracted.brand) filters.brand = extracted.brand;
    if (extracted.minPrice) filters.minPrice = extracted.minPrice;
    if (extracted.maxPrice) filters.maxPrice = extracted.maxPrice;

    // Convert price range to actual prices
    if (extracted.priceRange) {
      switch (extracted.priceRange) {
        case 'economic':
          filters.maxPrice = filters.maxPrice || 100;
          break;
        case 'mid-range':
          filters.minPrice = filters.minPrice || 100;
          filters.maxPrice = filters.maxPrice || 500;
          break;
        case 'premium':
          filters.minPrice = filters.minPrice || 500;
          break;
      }
    }

    return filters;
  }

  /**
   * Parse complete query and return both cleaned query and filters
   */
  async parseQuery(originalQuery: string): Promise<{
    cleanedQuery: string;
    extractedFilters: ExtractedFilters;
    searchFilters: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
    };
  }> {
    const extractedFilters = await this.extractFilters(originalQuery);
    const searchFilters = this.convertToSearchFilters(extractedFilters);
    
    // Clean query by removing price/brand mentions that are now in filters
    let cleanedQuery = originalQuery;
    
    // Remove common price indicators
    cleanedQuery = cleanedQuery.replace(/(barato|económico|caro|premium|gama alta|gama baja)/gi, '');
    
    // Remove explicit price mentions if captured
    if (extractedFilters.maxPrice || extractedFilters.minPrice) {
      cleanedQuery = cleanedQuery.replace(/(\$?\d+\s*(dólares?|usd|pesos?))/gi, '');
      cleanedQuery = cleanedQuery.replace(/(hasta|máximo|menos de|mayor a|más de)\s*\$?\d+/gi, '');
    }
    
    // Remove brand name if captured
    if (extractedFilters.brand) {
      cleanedQuery = cleanedQuery.replace(new RegExp(extractedFilters.brand, 'gi'), '');
    }
    
    // Clean up extra spaces
    cleanedQuery = cleanedQuery.replace(/\s+/g, ' ').trim();
    
    Logger.info(`🔄 Query transformation: "${originalQuery}" → "${cleanedQuery}"`);
    
    return {
      cleanedQuery,
      extractedFilters,
      searchFilters
    };
  }
}