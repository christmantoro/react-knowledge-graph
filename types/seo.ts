export interface SEOEntity {
  id: string;
  name: string;
  type: 'topic_cluster' | 'pillar_page' | 'cluster_content' | 'keyword' | 'intent' | 'competitor';
  searchVolume?: number;
  difficulty?: number;
  intent?: 'informational' | 'navigational' | 'transactional' | 'commercial';
  url?: string;
  hasMore: boolean;
  direction: 'root' | 'inside' | 'outside';
  metadata?: {
    searchVolume?: number;
    difficulty?: number;
    cpc?: number;
    serp_features?: string[];
    content_gap?: boolean;
    ranking_position?: number;
    traffic_potential?: number;
  };
}

export interface SEORelationship {
  id: string;
  fromId: string;
  toId: string;
  relationshipType: 'semantic_similarity' | 'keyword_cluster' | 'internal_link' | 'topic_hierarchy' | 'content_gap' | 'competitor_overlap';
  strength: number; // 0-1 scale
  description: string;
  metadata?: {
    similarity_score?: number;
    link_count?: number;
    shared_keywords?: number;
    content_overlap?: number;
  };
}

export interface TopicCluster {
  id: string;
  name: string;
  pillar_page: SEOEntity;
  cluster_content: SEOEntity[];
  keywords: SEOEntity[];
  total_search_volume: number;
  content_gaps: SEOEntity[];
  competitor_overlap: SEOEntity[];
}