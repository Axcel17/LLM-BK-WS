import { openai } from '../config';
import { Logger } from '../utils/logger';
import { ProductFilters, ProductFiltersSchema } from '../types/product';
import { QUERY_PARSER_SYSTEM_PROMPT } from '../constants/query-parser';

export class QueryParserService {
  /**
   * Extract structured filters from natural language query
   * Uses hybrid approach: regex for budget + OpenAI for intelligent parsing
   */
  async extractFilters(query: string): Promise<ProductFilters> {
    let regexMaxPrice: number | undefined;
    
    try {
      Logger.info('🔍 Parsing query for filters with hybrid approach:', query);

      // 1. REGEX APPROACH: Extract budget (more reliable for numbers)
      const budgetPatterns = [
        /\$(\d+)/i,                           // $300
        /(\d+)\s*dolar/i,                     // 300 dólares  
        /(\d+)\s*peso/i,                      // 300 pesos
        /tengo\s*(\d+)/i,                     // tengo 300
        /presupuesto\s*de?\s*(\d+)/i,         // presupuesto de 300
        /hasta\s*(\d+)/i,                     // hasta 300
        /máximo\s*(\d+)/i,                    // máximo 300
        /no\s*más\s*de\s*(\d+)/i             // no más de 300
      ];

      for (const pattern of budgetPatterns) {
        const match = query.match(pattern);
        if (match) {
          regexMaxPrice = parseInt(match[1]);
          Logger.info(`💰 Regex found budget: $${regexMaxPrice}`);
          break;
        }
      }

      // 2. OPENAI APPROACH: Intelligent extraction with context
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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
      if (!content) {
        Logger.warn('⚠️ No content from OpenAI, using regex fallback');
        return regexMaxPrice ? { maxPrice: regexMaxPrice } : {};
      }

      let parsed = JSON.parse(content);
      Logger.info('📝 OpenAI extracted:', parsed);

      // 3. HYBRID VERIFICATION: Use regex budget if more reliable
      let finalMaxPrice = parsed.maxPrice || regexMaxPrice;
      
      // Prefer regex if both found and they're different (regex is more reliable for numbers)
      if (regexMaxPrice && parsed.maxPrice && regexMaxPrice !== parsed.maxPrice) {
        Logger.info(`🔧 Budget mismatch - Regex: $${regexMaxPrice}, OpenAI: $${parsed.maxPrice}. Using regex.`);
        finalMaxPrice = regexMaxPrice;
      } else if (regexMaxPrice && !parsed.maxPrice) {
        Logger.info(`🔧 Adding regex budget to result: $${regexMaxPrice}`);
        finalMaxPrice = regexMaxPrice;
      }

      // Build final result
      const result = {
        ...parsed,
        maxPrice: finalMaxPrice
      };
      
      const validated = ProductFiltersSchema.parse(result);
      Logger.success('✅ Final extracted filters:', validated);
      return validated;

    } catch (error) {
      Logger.error('❌ Failed to extract filters:', error);
      
      // Fallback: at least try regex for budget
      if (regexMaxPrice) {
        Logger.info(`🔧 Fallback using regex budget: $${regexMaxPrice}`);
        return { maxPrice: regexMaxPrice };
      }

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

  /**
   * Parse complete query and return both cleaned query and filters
   */
  async parseQuery(originalQuery: string, contextBudget?: number): Promise<{
    cleanedQuery: string;
    extractedFilters: ProductFilters;
    searchFilters: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
    };
  }> {
    // Extract all filters in one go
    const extractedFilters = await this.extractFilters(originalQuery);
    
    // Override with context budget if available and not already extracted
    if (contextBudget && !extractedFilters.maxPrice) {
      extractedFilters.maxPrice = contextBudget;
      Logger.info(`🔧 Using context budget: $${contextBudget}`);
    }
    
    const searchFilters = this.convertToSearchFilters(extractedFilters);
    
    // Use original query for semantic search - don't over-clean it
    const cleanedQuery = originalQuery;
    
    Logger.info(`✅ Final parsing result:`, {
      originalQuery,
      cleanedQuery,
      extractedFilters,
      searchFilters,
      contextBudget
    });
    
    return {
      cleanedQuery,
      extractedFilters,
      searchFilters
    };
  }
}