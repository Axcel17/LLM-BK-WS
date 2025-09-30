import { Logger } from '../utils/logger';
import { PURCHASE_POLICIES, PurchasePolicy } from '../data/purchase-policies';

/**
 * Purchase Policies Service
 * Handles searching and filtering of purchase policies and company information
 */
export class PurchasePoliciesService {
  private policies: PurchasePolicy[];

  constructor() {
    this.policies = PURCHASE_POLICIES;
    Logger.info(`📋 Purchase Policies Service initialized with ${this.policies.length} policies`);
  }

  /**
   * Search policies using keywords and optional category filter
   */
  searchPolicies(
    query: string, 
    categoryFilter?: string, 
    limit: number = 5
  ): {
    policies: Array<{
      id: string;
      category: string;
      title: string;
      question: string;
      answer: string;
      last_updated: string;
      relevance_score: number;
    }>;
    total_found: number;
    available_categories: string[];
  } {
    Logger.info(`🔍 Searching policies: "${query}"${categoryFilter ? ` in category: ${categoryFilter}` : ''}`);

    // Normalize query for better matching
    const normalizedQuery = query.toLowerCase().trim();
    const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 2);

    // Filter by category if specified
    let filteredPolicies = this.policies;
    if (categoryFilter) {
      filteredPolicies = this.policies.filter(policy => policy.category === categoryFilter);
      Logger.info(`📂 Filtered to ${filteredPolicies.length} policies in category: ${categoryFilter}`);
    }

    // Score policies based on relevance
    const scoredPolicies = filteredPolicies.map(policy => {
      let score = 0;

      // Check exact matches in keywords (highest priority)
      const keywordMatches = policy.keywords.filter(keyword => 
        normalizedQuery.includes(keyword.toLowerCase())
      );
      score += keywordMatches.length * 10;

      // Check partial matches in keywords
      searchTerms.forEach(term => {
        policy.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(term)) {
            score += 5;
          }
        });
      });

      // Check matches in question and title
      searchTerms.forEach(term => {
        if (policy.question.toLowerCase().includes(term)) {
          score += 8;
        }
        if (policy.title.toLowerCase().includes(term)) {
          score += 6;
        }
        if (policy.answer.toLowerCase().includes(term)) {
          score += 3;
        }
      });

      // Boost score for category-specific searches
      if (categoryFilter && policy.category === categoryFilter) {
        score += 2;
      }

      return {
        ...policy,
        relevance_score: score
      };
    });

    // Filter and sort by relevance
    const relevantPolicies = scoredPolicies
      .filter(policy => policy.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, limit);

    // Get available categories for reference
    const availableCategories = [...new Set(this.policies.map(p => p.category))];

    Logger.success(`✅ Found ${relevantPolicies.length} relevant policies (from ${filteredPolicies.length} searched)`);

    return {
      policies: relevantPolicies.map(policy => ({
        id: policy.id,
        category: policy.category,
        title: policy.title,
        question: policy.question,
        answer: policy.answer,
        last_updated: policy.last_updated,
        relevance_score: policy.relevance_score
      })),
      total_found: relevantPolicies.length,
      available_categories: availableCategories
    };
  }

  /**
   * Get policies by specific category
   */
  getPoliciesByCategory(category: string, limit: number = 10): PurchasePolicy[] {
    Logger.info(`📂 Getting policies for category: ${category}`);
    
    const categoryPolicies = this.policies
      .filter(policy => policy.category === category)
      .slice(0, limit);
    
    Logger.success(`✅ Found ${categoryPolicies.length} policies in category: ${category}`);
    return categoryPolicies;
  }

  /**
   * Get all available categories
   */
  getAvailableCategories(): string[] {
    const categories = [...new Set(this.policies.map(policy => policy.category))];
    Logger.info(`📋 Available categories: ${categories.join(', ')}`);
    return categories;
  }

  /**
   * Get policy by ID
   */
  getPolicyById(id: string): PurchasePolicy | null {
    const policy = this.policies.find(p => p.id === id);
    if (policy) {
      Logger.info(`📄 Found policy: ${policy.title}`);
    } else {
      Logger.warn(`❌ Policy not found: ${id}`);
    }
    return policy || null;
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    total_policies: number;
    categories: { [key: string]: number };
    last_updated: string;
  } {
    const categories = this.policies.reduce((acc, policy) => {
      acc[policy.category] = (acc[policy.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const lastUpdated = this.policies
      .map(p => p.last_updated)
      .sort()
      .pop() || 'Unknown';

    return {
      total_policies: this.policies.length,
      categories,
      last_updated: lastUpdated
    };
  }
}