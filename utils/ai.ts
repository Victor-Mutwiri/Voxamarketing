import { pipeline, env } from '@xenova/transformers';
import { Business } from '../types';

// Skip local model checks since we are in browser
env.allowLocalModels = false;
env.useBrowserCache = true;

class AI {
  private static instance: any = null;
  // Small, fast model good for semantic similarity
  private static modelName = 'Xenova/all-MiniLM-L6-v2';

  static async getInstance() {
    if (!this.instance) {
      this.instance = await pipeline('feature-extraction', this.modelName);
    }
    return this.instance;
  }

  // Calculate cosine similarity between two vectors
  static cosineSimilarity(a: number[], b: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  static async generateEmbedding(text: string): Promise<number[]> {
    const extractor = await this.getInstance();
    // Normalize and pool to get a single vector per input
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  static getEntityWeight(type: string | undefined): number {
    switch (type) {
      case 'Company':
      case 'Organization':
        return 1.0;
      case 'Business':
        return 0.9;
      case 'Consultant':
        return 0.8;
      default:
        return 0.5;
    }
  }

  static async search(query: string, businesses: Business[]): Promise<Business[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    
    // We need to generate embeddings for businesses on the fly since we don't have a backend DB with vectors yet.
    
    const scoredBusinesses = await Promise.all(businesses.map(async (biz) => {
      // Create a rich context string for the business
      const content = `${biz.name} ${biz.industry} ${biz.fullDescription} ${biz.specialties.join(' ')} ${biz.tags.join(' ')} ${biz.location}`;
      
      const embedding = await this.generateEmbedding(content);
      const similarity = this.cosineSimilarity(queryEmbedding, embedding);
      
      const entityWeight = this.getEntityWeight(biz.entityType);
      
      // Ranking Logic (Updated):
      // 85% based on semantic relevance (AI) - Increased from 70%
      // 15% based on business tier (Premium Listing) - Decreased from 30%
      const finalScore = (similarity * 0.85) + (entityWeight * 0.15);

      return { ...biz, score: finalScore, matchScore: similarity };
    }));

    // Filter out very low relevance (noise)
    // MIN_RELEVANCE_THRESHOLD set to 0.25 to strict filter out irrelevant results
    const relevant = scoredBusinesses.filter(b => b.matchScore && b.matchScore > 0.25);

    // Sort by Final Score (Descending)
    return relevant.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
}

export default AI;