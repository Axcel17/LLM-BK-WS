import { openai } from '../config';
import { Logger } from '../utils/logger';
import { ProductFilters, ProductFiltersSchema } from '../types/product';
import { QUERY_PARSER_SYSTEM_PROMPT } from '../constants/query-parser';

export class QueryParserService {
  /**
   * Extract structured filters from natural language query
   * Uses hybrid approach: regex for budget + OpenAI for intelligent parsing
   */
  async extractFilters(query: string, modelId?: string): Promise<ProductFilters> {
    
    try {
      const modelToUse = modelId || 'gpt-4o-mini';
      Logger.info('🔍 Parsing query for filters with hybrid approach:', { query, model: modelToUse });

      // 1. OPENAI APPROACH: Intelligent extraction with context
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          { 
            role: 'system', 
            content: QUERY_PARSER_SYSTEM_PROMPT 
          },
          { role: 'user', content: query }
        ],
        temperature: 0.1,
        max_tokens: 150,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No content returned from OpenAI');

      let parsed = JSON.parse(content);

      const validated = ProductFiltersSchema.parse(parsed);
      return validated;

    } catch (error) {
      Logger.error('❌ Failed to extract filters:', error);
      
      return {};
    }
  }

  /**
   * Convert extracted filters to search filters format
   */
  convertToSearchFilters(extracted: ProductFilters): {
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
}