import { queryMotherDuck } from '../lib/motherduck';
import { SEOEntity, SEORelationship } from '../types/seo';

export class SEODataService {
  
  // Get topic cluster data from MotherDuck
  async getTopicCluster(clusterId: string): Promise<{
    inside: SEOEntity[];
    outside: SEOEntity[];
    edges: SEORelationship[];
  }> {
    try {
      // Query for related entities (cluster content, keywords, etc.)
      const insideQuery = `
        SELECT 
          e.id,
          e.name,
          e.type,
          e.search_volume,
          e.difficulty,
          e.intent,
          e.url,
          CASE WHEN COUNT(r2.to_id) > 0 THEN true ELSE false END as has_more
        FROM seo_entities e
        LEFT JOIN seo_relationships r ON r.to_id = e.id
        LEFT JOIN seo_relationships r2 ON r2.from_id = e.id
        WHERE r.from_id = '${clusterId}' 
          AND r.relationship_type IN ('keyword_cluster', 'topic_hierarchy')
        GROUP BY e.id, e.name, e.type, e.search_volume, e.difficulty, e.intent, e.url
      `;

      // Query for external connections (competitors, content gaps)
      const outsideQuery = `
        SELECT 
          e.id,
          e.name,
          e.type,
          e.search_volume,
          e.difficulty,
          e.intent,
          e.url,
          CASE WHEN COUNT(r2.to_id) > 0 THEN true ELSE false END as has_more
        FROM seo_entities e
        LEFT JOIN seo_relationships r ON r.to_id = e.id
        LEFT JOIN seo_relationships r2 ON r2.from_id = e.id
        WHERE r.from_id = '${clusterId}' 
          AND r.relationship_type IN ('competitor_overlap', 'content_gap', 'semantic_similarity')
        GROUP BY e.id, e.name, e.type, e.search_volume, e.difficulty, e.intent, e.url
      `;

      // Query for relationships
      const edgesQuery = `
        SELECT 
          r.id,
          r.from_id,
          r.to_id,
          r.relationship_type,
          r.strength,
          r.description,
          r.similarity_score,
          r.link_count,
          r.shared_keywords
        FROM seo_relationships r
        WHERE r.from_id = '${clusterId}' OR r.to_id = '${clusterId}'
      `;

      const [insideResults, outsideResults, edgeResults] = await Promise.all([
        queryMotherDuck(insideQuery),
        queryMotherDuck(outsideQuery),
        queryMotherDuck(edgesQuery)
      ]);

      const inside: SEOEntity[] = insideResults.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        searchVolume: row.search_volume,
        difficulty: row.difficulty,
        intent: row.intent,
        url: row.url,
        hasMore: row.has_more,
        direction: 'inside' as const,
        metadata: {
          searchVolume: row.search_volume,
          difficulty: row.difficulty,
        }
      }));

      const outside: SEOEntity[] = outsideResults.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        searchVolume: row.search_volume,
        difficulty: row.difficulty,
        intent: row.intent,
        url: row.url,
        hasMore: row.has_more,
        direction: 'outside' as const,
        metadata: {
          searchVolume: row.search_volume,
          difficulty: row.difficulty,
        }
      }));

      const edges: SEORelationship[] = edgeResults.map(row => ({
        id: row.id,
        fromId: row.from_id,
        toId: row.to_id,
        relationshipType: row.relationship_type,
        strength: row.strength,
        description: row.description,
        metadata: {
          similarity_score: row.similarity_score,
          link_count: row.link_count,
          shared_keywords: row.shared_keywords,
        }
      }));

      return { inside, outside, edges };
    } catch (error) {
      console.error('Error fetching topic cluster data:', error);
      return { inside: [], outside: [], edges: [] };
    }
  }

  // Get keyword opportunities
  async getKeywordOpportunities(clusterId: string): Promise<SEOEntity[]> {
    const query = `
      SELECT DISTINCT
        k.id,
        k.keyword as name,
        'keyword' as type,
        k.search_volume,
        k.difficulty,
        k.intent,
        NULL as url,
        false as has_more
      FROM keywords k
      LEFT JOIN seo_relationships r ON r.to_id = k.id
      WHERE k.difficulty < 50 
        AND k.search_volume > 100
        AND r.from_id IS NULL  -- Not already connected to any cluster
      ORDER BY k.search_volume DESC, k.difficulty ASC
      LIMIT 20
    `;

    const results = await queryMotherDuck(query);
    return results.map(row => ({
      id: row.id,
      name: row.name,
      type: 'keyword' as const,
      searchVolume: row.search_volume,
      difficulty: row.difficulty,
      intent: row.intent,
      hasMore: false,
      direction: 'outside' as const,
      metadata: {
        searchVolume: row.search_volume,
        difficulty: row.difficulty,
      }
    }));
  }

  // Get content gaps
  async getContentGaps(clusterId: string): Promise<SEOEntity[]> {
    const query = `
      SELECT 
        cg.id,
        cg.topic as name,
        'content_gap' as type,
        cg.search_volume,
        cg.difficulty,
        cg.intent,
        NULL as url,
        false as has_more
      FROM content_gaps cg
      WHERE cg.cluster_id = '${clusterId}'
        AND cg.priority = 'high'
      ORDER BY cg.search_volume DESC
    `;

    const results = await queryMotherDuck(query);
    return results.map(row => ({
      id: row.id,
      name: row.name,
      type: 'content_gap' as const,
      searchVolume: row.search_volume,
      difficulty: row.difficulty,
      intent: row.intent,
      hasMore: false,
      direction: 'outside' as const,
      metadata: {
        searchVolume: row.search_volume,
        difficulty: row.difficulty,
      }
    }));
  }

  // Get competitor analysis
  async getCompetitorOverlap(clusterId: string): Promise<SEOEntity[]> {
    const query = `
      SELECT 
        c.id,
        c.domain as name,
        'competitor' as type,
        NULL as search_volume,
        NULL as difficulty,
        NULL as intent,
        c.url,
        true as has_more
      FROM competitors c
      JOIN competitor_keywords ck ON ck.competitor_id = c.id
      JOIN cluster_keywords clk ON clk.keyword_id = ck.keyword_id
      WHERE clk.cluster_id = '${clusterId}'
      GROUP BY c.id, c.domain, c.url
      HAVING COUNT(DISTINCT ck.keyword_id) >= 3  -- At least 3 overlapping keywords
      ORDER BY COUNT(DISTINCT ck.keyword_id) DESC
    `;

    const results = await queryMotherDuck(query);
    return results.map(row => ({
      id: row.id,
      name: row.name,
      type: 'competitor' as const,
      url: row.url,
      hasMore: row.has_more,
      direction: 'outside' as const,
    }));
  }
}