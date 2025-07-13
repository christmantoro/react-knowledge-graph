-- Sample SEO data for testing

-- Insert sample topic clusters
INSERT INTO topic_clusters (id, name, total_search_volume, avg_difficulty, content_count, keyword_count) VALUES
('cluster-1', 'Content Marketing Strategy', 45000, 42.5, 12, 25),
('cluster-2', 'SEO Best Practices', 38000, 55.2, 8, 18),
('cluster-3', 'Digital Marketing Tools', 52000, 48.7, 15, 32),
('cluster-4', 'Social Media Marketing', 67000, 35.8, 20, 28),
('cluster-5', 'Email Marketing Automation', 29000, 51.3, 9, 15);

-- Insert sample SEO entities
INSERT INTO seo_entities (id, name, type, search_volume, difficulty, intent, url) VALUES
-- Topic clusters
('cluster-1', 'Content Marketing Strategy', 'topic_cluster', 12000, 45, 'informational', NULL),
('cluster-2', 'SEO Best Practices', 'topic_cluster', 8500, 55, 'informational', NULL),
('cluster-3', 'Digital Marketing Tools', 'topic_cluster', 15000, 48, 'commercial', NULL),

-- Pillar pages
('pillar-1', 'Complete Guide to Content Marketing', 'pillar_page', 5000, 40, 'informational', '/content-marketing-guide'),
('pillar-2', 'SEO Optimization Handbook', 'pillar_page', 3500, 50, 'informational', '/seo-handbook'),
('pillar-3', 'Digital Marketing Tools Comparison', 'pillar_page', 6000, 45, 'commercial', '/marketing-tools'),

-- Cluster content
('content-1', 'Content Calendar Templates', 'cluster_content', 2500, 35, 'informational', '/content-calendar'),
('content-2', 'Blog Post Writing Tips', 'cluster_content', 1800, 30, 'informational', '/blog-writing-tips'),
('content-3', 'Video Content Strategy', 'cluster_content', 3200, 42, 'informational', '/video-content'),
('content-4', 'On-Page SEO Checklist', 'cluster_content', 2100, 38, 'informational', '/on-page-seo'),
('content-5', 'Link Building Strategies', 'cluster_content', 2800, 65, 'informational', '/link-building'),
('content-6', 'Google Analytics Setup', 'cluster_content', 1900, 25, 'informational', '/analytics-setup'),

-- Keywords
('keyword-1', 'content marketing strategy', 'keyword', 12000, 45, 'informational', NULL),
('keyword-2', 'content calendar template', 'keyword', 2500, 35, 'informational', NULL),
('keyword-3', 'blog content ideas', 'keyword', 1800, 28, 'informational', NULL),
('keyword-4', 'seo best practices 2024', 'keyword', 8500, 55, 'informational', NULL),
('keyword-5', 'on page seo checklist', 'keyword', 2100, 38, 'informational', NULL),
('keyword-6', 'digital marketing tools', 'keyword', 15000, 48, 'commercial', NULL),

-- Competitors
('comp-1', 'HubSpot Blog', 'competitor', NULL, NULL, NULL, 'https://blog.hubspot.com'),
('comp-2', 'Moz Blog', 'competitor', NULL, NULL, NULL, 'https://moz.com/blog'),
('comp-3', 'Neil Patel Blog', 'competitor', NULL, NULL, NULL, 'https://neilpatel.com/blog'),

-- Content gaps
('gap-1', 'AI Content Creation Tools', 'content_gap', 4500, 42, 'commercial', NULL),
('gap-2', 'Content ROI Measurement', 'content_gap', 1200, 35, 'informational', NULL),
('gap-3', 'Voice Search SEO', 'content_gap', 2800, 48, 'informational', NULL);

-- Insert sample keywords
INSERT INTO keywords (id, keyword, search_volume, difficulty, cpc, intent, ranking_position, traffic_potential) VALUES
('kw-1', 'content marketing strategy', 12000, 45, 3.25, 'informational', NULL, 8500),
('kw-2', 'content calendar template', 2500, 35, 2.10, 'informational', NULL, 1800),
('kw-3', 'blog content ideas', 1800, 28, 1.85, 'informational', NULL, 1300),
('kw-4', 'content marketing examples', 3200, 40, 2.95, 'informational', NULL, 2200),
('kw-5', 'content marketing roi', 1500, 52, 4.15, 'commercial', NULL, 950),
('kw-6', 'seo best practices 2024', 8500, 55, 3.80, 'informational', NULL, 6000),
('kw-7', 'on page seo checklist', 2100, 38, 2.45, 'informational', NULL, 1500),
('kw-8', 'technical seo audit', 1800, 62, 5.20, 'informational', NULL, 1200),
('kw-9', 'digital marketing tools', 15000, 48, 6.50, 'commercial', NULL, 10500),
('kw-10', 'marketing automation software', 8200, 58, 12.30, 'commercial', NULL, 5800);

-- Insert sample relationships
INSERT INTO seo_relationships (id, from_id, to_id, relationship_type, strength, description, similarity_score, link_count, shared_keywords) VALUES
-- Topic cluster to pillar page relationships
('rel-1', 'cluster-1', 'pillar-1', 'topic_hierarchy', 1.0, 'Main pillar page for content marketing cluster', 0.95, 1, 0),
('rel-2', 'cluster-2', 'pillar-2', 'topic_hierarchy', 1.0, 'Main pillar page for SEO cluster', 0.92, 1, 0),
('rel-3', 'cluster-3', 'pillar-3', 'topic_hierarchy', 1.0, 'Main pillar page for tools cluster', 0.88, 1, 0),

-- Cluster to content relationships
('rel-4', 'cluster-1', 'content-1', 'keyword_cluster', 0.85, 'Content calendar supports content marketing', 0.82, 2, 5),
('rel-5', 'cluster-1', 'content-2', 'keyword_cluster', 0.78, 'Blog writing is part of content marketing', 0.75, 3, 4),
('rel-6', 'cluster-1', 'content-3', 'keyword_cluster', 0.72, 'Video content strategy', 0.70, 1, 3),
('rel-7', 'cluster-2', 'content-4', 'keyword_cluster', 0.88, 'On-page SEO is core SEO practice', 0.85, 4, 6),
('rel-8', 'cluster-2', 'content-5', 'keyword_cluster', 0.82, 'Link building is key SEO strategy', 0.80, 2, 5),
('rel-9', 'cluster-3', 'content-6', 'keyword_cluster', 0.75, 'Analytics tools for marketing', 0.72, 1, 3),

-- Keyword relationships
('rel-10', 'cluster-1', 'keyword-1', 'keyword_cluster', 0.95, 'Primary keyword for cluster', 0.95, 0, 0),
('rel-11', 'cluster-1', 'keyword-2', 'keyword_cluster', 0.75, 'Supporting keyword', 0.72, 0, 0),
('rel-12', 'cluster-1', 'keyword-3', 'keyword_cluster', 0.68, 'Related keyword', 0.65, 0, 0),
('rel-13', 'cluster-2', 'keyword-4', 'keyword_cluster', 0.92, 'Primary SEO keyword', 0.90, 0, 0),
('rel-14', 'cluster-2', 'keyword-5', 'keyword_cluster', 0.78, 'Supporting SEO keyword', 0.75, 0, 0),

-- Competitor relationships
('rel-15', 'cluster-1', 'comp-1', 'competitor_overlap', 0.65, 'HubSpot competes on content marketing', 0.62, 0, 8),
('rel-16', 'cluster-2', 'comp-2', 'competitor_overlap', 0.78, 'Moz is strong SEO competitor', 0.75, 0, 12),
('rel-17', 'cluster-1', 'comp-3', 'competitor_overlap', 0.58, 'Neil Patel covers content marketing', 0.55, 0, 6),

-- Content gap relationships
('rel-18', 'cluster-1', 'gap-1', 'content_gap', 0.70, 'AI tools gap in content marketing', 0.68, 0, 0),
('rel-19', 'cluster-1', 'gap-2', 'content_gap', 0.75, 'ROI measurement gap', 0.72, 0, 0),
('rel-20', 'cluster-2', 'gap-3', 'content_gap', 0.68, 'Voice search SEO opportunity', 0.65, 0, 0),

-- Internal linking relationships
('rel-21', 'pillar-1', 'content-1', 'internal_link', 0.80, 'Pillar links to content calendar', 0.78, 3, 0),
('rel-22', 'pillar-1', 'content-2', 'internal_link', 0.75, 'Pillar links to blog tips', 0.72, 2, 0),
('rel-23', 'pillar-2', 'content-4', 'internal_link', 0.85, 'SEO handbook links to checklist', 0.82, 4, 0),
('rel-24', 'pillar-2', 'content-5', 'internal_link', 0.78, 'Handbook links to link building', 0.75, 2, 0),

-- Semantic similarity relationships
('rel-25', 'content-1', 'content-2', 'semantic_similarity', 0.65, 'Both about content creation', 0.62, 1, 2),
('rel-26', 'content-4', 'content-5', 'semantic_similarity', 0.72, 'Both SEO techniques', 0.70, 1, 3),
('rel-27', 'keyword-1', 'keyword-2', 'semantic_similarity', 0.68, 'Related content marketing terms', 0.65, 0, 0);

-- Insert sample competitors
INSERT INTO competitors (id, domain, url, authority_score, organic_traffic) VALUES
('comp-1', 'blog.hubspot.com', 'https://blog.hubspot.com', 92, 2500000),
('comp-2', 'moz.com', 'https://moz.com/blog', 88, 1800000),
('comp-3', 'neilpatel.com', 'https://neilpatel.com/blog', 85, 1200000),
('comp-4', 'contentmarketinginstitute.com', 'https://contentmarketinginstitute.com', 82, 950000),
('comp-5', 'searchengineland.com', 'https://searchengineland.com', 89, 1600000);

-- Insert content gaps
INSERT INTO content_gaps (id, cluster_id, topic, search_volume, difficulty, intent, priority, competitor_coverage) VALUES
('gap-1', 'cluster-1', 'AI Content Creation Tools', 4500, 42, 'commercial', 'high', 3),
('gap-2', 'cluster-1', 'Content ROI Measurement', 1200, 35, 'informational', 'medium', 2),
('gap-3', 'cluster-1', 'Content Personalization', 2800, 48, 'informational', 'high', 4),
('gap-4', 'cluster-2', 'Voice Search SEO', 2800, 48, 'informational', 'high', 2),
('gap-5', 'cluster-2', 'Core Web Vitals', 1900, 52, 'informational', 'medium', 5),
('gap-6', 'cluster-3', 'Marketing Attribution Tools', 1500, 58, 'commercial', 'medium', 3);

-- Insert cluster-keyword mappings
INSERT INTO cluster_keywords (id, cluster_id, keyword_id, relevance_score) VALUES
('ck-1', 'cluster-1', 'kw-1', 0.95),
('ck-2', 'cluster-1', 'kw-2', 0.75),
('ck-3', 'cluster-1', 'kw-3', 0.68),
('ck-4', 'cluster-1', 'kw-4', 0.72),
('ck-5', 'cluster-1', 'kw-5', 0.65),
('ck-6', 'cluster-2', 'kw-6', 0.92),
('ck-7', 'cluster-2', 'kw-7', 0.78),
('ck-8', 'cluster-2', 'kw-8', 0.82),
('ck-9', 'cluster-3', 'kw-9', 0.88),
('ck-10', 'cluster-3', 'kw-10', 0.75);

-- Insert competitor keyword data
INSERT INTO competitor_keywords (id, competitor_id, keyword_id, ranking_position, estimated_traffic) VALUES
('compkw-1', 'comp-1', 'kw-1', 3, 2500),
('compkw-2', 'comp-1', 'kw-2', 5, 800),
('compkw-3', 'comp-1', 'kw-4', 8, 450),
('compkw-4', 'comp-2', 'kw-6', 2, 4200),
('compkw-5', 'comp-2', 'kw-7', 4, 1200),
('compkw-6', 'comp-2', 'kw-8', 1, 1800),
('compkw-7', 'comp-3', 'kw-1', 7, 1200),
('compkw-8', 'comp-3', 'kw-3', 3, 650),
('compkw-9', 'comp-4', 'kw-1', 4, 2000),
('compkw-10', 'comp-5', 'kw-6', 6, 2800);