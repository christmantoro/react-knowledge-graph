-- SEO Topic Clusters Schema for MotherDuck

-- Main entities table
CREATE TABLE IF NOT EXISTS seo_entities (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL, -- 'topic_cluster', 'pillar_page', 'cluster_content', 'keyword', 'intent', 'competitor'
    search_volume INTEGER,
    difficulty INTEGER, -- 0-100 scale
    intent VARCHAR, -- 'informational', 'navigational', 'transactional', 'commercial'
    url VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relationships between entities
CREATE TABLE IF NOT EXISTS seo_relationships (
    id VARCHAR PRIMARY KEY,
    from_id VARCHAR NOT NULL,
    to_id VARCHAR NOT NULL,
    relationship_type VARCHAR NOT NULL, -- 'semantic_similarity', 'keyword_cluster', 'internal_link', 'topic_hierarchy', 'content_gap', 'competitor_overlap'
    strength DECIMAL(3,2), -- 0.00-1.00 scale
    description VARCHAR,
    similarity_score DECIMAL(3,2),
    link_count INTEGER,
    shared_keywords INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_id) REFERENCES seo_entities(id),
    FOREIGN KEY (to_id) REFERENCES seo_entities(id)
);

-- Topic clusters main table
CREATE TABLE IF NOT EXISTS topic_clusters (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    pillar_page_id VARCHAR,
    total_search_volume INTEGER,
    avg_difficulty DECIMAL(5,2),
    content_count INTEGER DEFAULT 0,
    keyword_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pillar_page_id) REFERENCES seo_entities(id)
);

-- Keywords table with detailed metrics
CREATE TABLE IF NOT EXISTS keywords (
    id VARCHAR PRIMARY KEY,
    keyword VARCHAR NOT NULL,
    search_volume INTEGER,
    difficulty INTEGER,
    cpc DECIMAL(10,2),
    intent VARCHAR,
    serp_features JSON,
    ranking_position INTEGER,
    traffic_potential INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content gaps analysis
CREATE TABLE IF NOT EXISTS content_gaps (
    id VARCHAR PRIMARY KEY,
    cluster_id VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    search_volume INTEGER,
    difficulty INTEGER,
    intent VARCHAR,
    priority VARCHAR, -- 'high', 'medium', 'low'
    competitor_coverage INTEGER, -- How many competitors cover this
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cluster_id) REFERENCES topic_clusters(id)
);

-- Competitors table
CREATE TABLE IF NOT EXISTS competitors (
    id VARCHAR PRIMARY KEY,
    domain VARCHAR NOT NULL,
    url VARCHAR,
    authority_score INTEGER,
    organic_traffic INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Competitor keyword overlap
CREATE TABLE IF NOT EXISTS competitor_keywords (
    id VARCHAR PRIMARY KEY,
    competitor_id VARCHAR NOT NULL,
    keyword_id VARCHAR NOT NULL,
    ranking_position INTEGER,
    estimated_traffic INTEGER,
    FOREIGN KEY (competitor_id) REFERENCES competitors(id),
    FOREIGN KEY (keyword_id) REFERENCES keywords(id)
);

-- Cluster to keyword mapping
CREATE TABLE IF NOT EXISTS cluster_keywords (
    id VARCHAR PRIMARY KEY,
    cluster_id VARCHAR NOT NULL,
    keyword_id VARCHAR NOT NULL,
    relevance_score DECIMAL(3,2),
    FOREIGN KEY (cluster_id) REFERENCES topic_clusters(id),
    FOREIGN KEY (keyword_id) REFERENCES keywords(id)
);

-- Content performance tracking
CREATE TABLE IF NOT EXISTS content_performance (
    id VARCHAR PRIMARY KEY,
    entity_id VARCHAR NOT NULL,
    organic_traffic INTEGER,
    ranking_keywords INTEGER,
    avg_position DECIMAL(5,2),
    click_through_rate DECIMAL(5,4),
    impressions INTEGER,
    date_recorded DATE,
    FOREIGN KEY (entity_id) REFERENCES seo_entities(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_entities_type ON seo_entities(type);
CREATE INDEX IF NOT EXISTS idx_seo_relationships_from_id ON seo_relationships(from_id);
CREATE INDEX IF NOT EXISTS idx_seo_relationships_to_id ON seo_relationships(to_id);
CREATE INDEX IF NOT EXISTS idx_keywords_search_volume ON keywords(search_volume DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_difficulty ON keywords(difficulty);
CREATE INDEX IF NOT EXISTS idx_content_gaps_cluster_id ON content_gaps(cluster_id);
CREATE INDEX IF NOT EXISTS idx_competitor_keywords_competitor_id ON competitor_keywords(competitor_id);
CREATE INDEX IF NOT EXISTS idx_cluster_keywords_cluster_id ON cluster_keywords(cluster_id);