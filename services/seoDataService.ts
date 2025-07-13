import { queryMotherDuck } from '../lib/motherduck';
import { SEOEntity, SEORelationship } from '../types/seo';

export class SEODataService {
  
  // Get all topic clusters for the dropdown
  async getAllTopicClusters(): Promise<SEOEntity[]> {
    try {
      const query = `
        SELECT 
          id,
          name,
          'topic_cluster' as type,
          total_search_volume as search_volume,
          avg_difficulty as difficulty,
          'informational' as intent,
          NULL as url,
          CASE WHEN content_count > 0 OR keyword_count > 0 THEN true ELSE false END as has_more,
          'root' as direction
        FROM topic_clusters 
        ORDER BY total_search_volume DESC
        LIMIT 50
      `;
      
      const results = await queryMotherDuck(query);
      
      return results.map(row => ({
        id: row.id,
        name: row.name,
        type: 'topic_cluster' as const,
        searchVolume: row.search_volume,
        difficulty: row.difficulty,
        intent: row.intent as any,
        url: row.url,
        hasMore: row.has_more,
        direction: 'root' as const,
        metadata: {
          searchVolume: row.search_volume,
          difficulty: row.difficulty,
        }
      }));
    } catch (error) {
      console.error('Error fetching topic clusters:', error);
      return [];
    }
  }

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
          CASE WHEN COUNT(r2.to_id) > 0 THEN true ELSE false END as has_more,
          'inside' as direction
        FROM seo_entities e
        LEFT JOIN seo_relationships r ON r.to_id = e.id
        LEFT JOIN seo_relationships r2 ON r2.from_id = e.id
        WHERE r.from_id = '${clusterId}' 
          AND r.relationship_type IN ('keyword_cluster', 'topic_hierarchy')
          AND e.type IN ('pillar_page', 'cluster_content', 'keyword')
        GROUP BY e.id, e.name, e.type, e.search_volume, e.difficulty, e.intent, e.url
        ORDER BY e.search_volume DESC NULLS LAST
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
          CASE WHEN COUNT(r2.to_id) > 0 THEN true ELSE false END as has_more,
          'outside' as direction
        FROM seo_entities e
        LEFT JOIN seo_relationships r ON r.to_id = e.id
        LEFT JOIN seo_relationships r2 ON r2.from_id = e.id
        WHERE r.from_id = '${clusterId}' 
          AND r.relationship_type IN ('competitor_overlap', 'content_gap', 'semantic_similarity')
          AND e.type IN ('competitor', 'content_gap')
        GROUP BY e.id, e.name, e.type, e.search_volume, e.difficulty, e.intent, e.url
        ORDER BY e.search_volume DESC NULLS LAST
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
          COALESCE(r.similarity_score, 0) as similarity_score,
          COALESCE(r.link_count, 0) as link_count,
          COALESCE(r.shared_keywords, 0) as shared_keywords
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
        strength: row.strength || 0.5,
        description: row.description || `${row.relationship_type} relationship`,
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
    try {
      const query = `
        SELECT DISTINCT
          k.id,
          k.keyword as name,
          'keyword' as type,
          k.search_volume,
          k.difficulty,
          k.intent,
          NULL as url,
          false as has_more,
          'outside' as direction
        FROM keywords k
        LEFT JOIN cluster_keywords ck ON ck.keyword_id = k.id
        WHERE k.difficulty < 50 
          AND k.search_volume > 100
          AND (ck.cluster_id IS NULL OR ck.cluster_id != '${clusterId}')
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
    } catch (error) {
      console.error('Error fetching keyword opportunities:', error);
      return [];
    }
  }

  // Get content gaps
  async getContentGaps(clusterId: string): Promise<SEOEntity[]> {
    try {
      const query = `
        SELECT 
          cg.id,
          cg.topic as name,
          'content_gap' as type,
          cg.search_volume,
          cg.difficulty,
          cg.intent,
          NULL as url,
          false as has_more,
          'outside' as direction
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
    } catch (error) {
      console.error('Error fetching content gaps:', error);
      return [];
    }
  }

  // Get competitor analysis
  async getCompetitorOverlap(clusterId: string): Promise<SEOEntity[]> {
    try {
      const query = `
        SELECT 
          c.id,
          c.domain as name,
          'competitor' as type,
          NULL as search_volume,
          NULL as difficulty,
          NULL as intent,
          c.url,
          true as has_more,
          'outside' as direction,
          COUNT(DISTINCT ck.keyword_id) as shared_keywords
        FROM competitors c
        JOIN competitor_keywords ck ON ck.competitor_id = c.id
        JOIN cluster_keywords clk ON clk.keyword_id = ck.keyword_id
        WHERE clk.cluster_id = '${clusterId}'
        GROUP BY c.id, c.domain, c.url
        HAVING COUNT(DISTINCT ck.keyword_id) >= 3
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
        metadata: {
          shared_keywords: row.shared_keywords,
        }
      }));
    } catch (error) {
      console.error('Error fetching competitor overlap:', error);
      return [];
    }
  }

  // Get cluster statistics for dashboard
  async getClusterStats(clusterId: string): Promise<{
    totalSearchVolume: number;
    avgDifficulty: number;
    contentCount: number;
    keywordCount: number;
    competitorCount: number;
    gapCount: number;
  }> {
    try {
      const query = `
        SELECT 
          tc.total_search_volume,
          tc.avg_difficulty,
          tc.content_count,
          tc.keyword_count,
          COUNT(DISTINCT comp.id) as competitor_count,
          COUNT(DISTINCT gaps.id) as gap_count
        FROM topic_clusters tc
        LEFT JOIN seo_relationships comp_rel ON comp_rel.from_id = tc.id AND comp_rel.relationship_type = 'competitor_overlap'
        LEFT JOIN seo_entities comp ON comp.id = comp_rel.to_id AND comp.type = 'competitor'
        LEFT JOIN content_gaps gaps ON gaps.cluster_id = tc.id
        WHERE tc.id = '${clusterId}'
        GROUP BY tc.id, tc.total_search_volume, tc.avg_difficulty, tc.content_count, tc.keyword_count
      `;

      const results = await queryMotherDuck(query);
      if (results.length > 0) {
        const row = results[0];
        return {
          totalSearchVolume: row.total_search_volume || 0,
          avgDifficulty: row.avg_difficulty || 0,
          contentCount: row.content_count || 0,
          keywordCount: row.keyword_count || 0,
          competitorCount: row.competitor_count || 0,
          gapCount: row.gap_count || 0,
        };
      }
      
      return {
        totalSearchVolume: 0,
        avgDifficulty: 0,
        contentCount: 0,
        keywordCount: 0,
        competitorCount: 0,
        gapCount: 0,
      };
    } catch (error) {
      console.error('Error fetching cluster stats:', error);
      return {
        totalSearchVolume: 0,
        avgDifficulty: 0,
        contentCount: 0,
        keywordCount: 0,
        competitorCount: 0,
        gapCount: 0,
      };
    }
  }
}