import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';
import { VectorItem, VectorEmbedItem } from '../types/search';
import { Logger } from '../utils/logger';

interface CacheEntry {
  hash: string;
  embeddings: VectorEmbedItem[];
  createdAt: string;
  model: string;
}

export class EmbeddingCacheService {
  private cacheDir: string;
  private cacheFile: string;

  constructor(cacheDir: string = 'cache') {
    this.cacheDir = path.resolve(cacheDir);
    this.cacheFile = path.join(this.cacheDir, 'embeddings-cache.json');
  }

  /**
   * Generate hash for items to detect changes
   */
  private generateHash(items: VectorItem[]): string {
    const content = items
      .map(item => `${item.id}|${item.content}|${item.category}`)
      .sort()
      .join('||');
    
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Ensure cache directory exists
   */
  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.access(this.cacheDir);
    } catch {
      await fs.mkdir(this.cacheDir, { recursive: true });
      Logger.info(`📁 Created cache directory: ${this.cacheDir}`);
    }
  }

  /**
   * Load embeddings from cache if available and valid
   */
  async loadFromCache(items: VectorItem[], model: string): Promise<VectorEmbedItem[] | null> {
    try {
      await this.ensureCacheDir();
      
      const cacheExists = await fs.access(this.cacheFile).then(() => true).catch(() => false);
      if (!cacheExists) {
        Logger.info('📋 No embedding cache found');
        return null;
      }

      const cacheData = await fs.readFile(this.cacheFile, 'utf-8');
      const cache: CacheEntry = JSON.parse(cacheData);

      const currentHash = this.generateHash(items);
      
      // Validate cache
      if (cache.hash !== currentHash) {
        Logger.info('🔄 Product catalog changed, cache invalid');
        return null;
      }

      if (cache.model !== model) {
        Logger.info(`🔄 Embedding model changed (${cache.model} → ${model}), cache invalid`);
        return null;
      }

      const cacheAge = Date.now() - new Date(cache.createdAt).getTime();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      if (cacheAge > maxAge) {
        Logger.info('⏰ Cache expired (>7 days), will regenerate');
        return null;
      }

      Logger.success(`✅ Loaded ${cache.embeddings.length} embeddings from cache`);
      Logger.info(`📅 Cache created: ${new Date(cache.createdAt).toLocaleString()}`);
      
      return cache.embeddings;
      
    } catch (error) {
      Logger.warn('⚠️ Failed to load embedding cache:', error);
      return null;
    }
  }

  /**
   * Save embeddings to cache
   */
  async saveToCache(items: VectorItem[], embeddings: VectorEmbedItem[], model: string): Promise<void> {
    try {
      await this.ensureCacheDir();

      const cache: CacheEntry = {
        hash: this.generateHash(items),
        embeddings,
        createdAt: new Date().toISOString(),
        model,
      };

      await fs.writeFile(this.cacheFile, JSON.stringify(cache, null, 2));
      
      Logger.success(`💾 Saved ${embeddings.length} embeddings to cache`);
      Logger.info(`📁 Cache location: ${this.cacheFile}`);
      
    } catch (error) {
      Logger.error('❌ Failed to save embedding cache:', error);
    }
  }

  /**
   * Clear embedding cache
   */
  async clearCache(): Promise<void> {
    try {
      await fs.unlink(this.cacheFile);
      Logger.info('🗑️ Embedding cache cleared');
    } catch (error) {
      Logger.warn('⚠️ No cache to clear or failed to clear:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    exists: boolean;
    size?: number;
    createdAt?: string;
    itemCount?: number;
    model?: string;
  }> {
    try {
      const stats = await fs.stat(this.cacheFile);
      const cacheData = await fs.readFile(this.cacheFile, 'utf-8');
      const cache: CacheEntry = JSON.parse(cacheData);

      return {
        exists: true,
        size: stats.size,
        createdAt: cache.createdAt,
        itemCount: cache.embeddings.length,
        model: cache.model,
      };
    } catch {
      return { exists: false };
    }
  }
}