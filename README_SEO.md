# SEO Semantic Topic Cluster Knowledge Graph

This project repurposes the React Knowledge Graph component for SEO semantic topic cluster visualization, connected to MotherDuck DB for real-time SEO data analysis.

## Features

### 🎯 SEO-Specific Visualizations
- **Topic Clusters**: Visualize main topic clusters with pillar pages and supporting content
- **Keyword Relationships**: See semantic relationships between keywords and search intent
- **Content Gaps**: Identify missing content opportunities in your topic clusters
- **Competitor Analysis**: Visualize competitor keyword overlap and content strategies
- **Internal Linking**: Map internal link structures and content hierarchies

### 📊 Real-Time SEO Metrics
- Search volume and keyword difficulty
- Search intent classification (informational, navigational, transactional, commercial)
- Ranking positions and traffic potential
- Content performance metrics
- Competitor overlap analysis

### 🔗 MotherDuck Integration
- Real-time data from your SEO tools
- Scalable cloud data warehouse
- SQL-based queries for complex SEO analysis
- Integration with popular SEO tools (Ahrefs, SEMrush, etc.)

## Setup Instructions

### 1. MotherDuck Configuration

1. Sign up for [MotherDuck](https://motherduck.com/)
2. Get your API token from the MotherDuck dashboard
3. Create a new database for your SEO data

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your MotherDuck credentials:

```bash
NEXT_PUBLIC_MOTHERDUCK_TOKEN=your_motherduck_token_here
MOTHERDUCK_DATABASE=your_database_name
```

### 3. Database Schema Setup

Run the SQL schema files in your MotherDuck database:

```sql
-- Run schema.sql first to create tables
-- Then run sample_data.sql for test data
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000/seo-clusters` to see your SEO knowledge graph.

## Data Structure

### Core Entities
- **Topic Clusters**: Main content themes
- **Pillar Pages**: Comprehensive guides for each cluster
- **Cluster Content**: Supporting articles and pages
- **Keywords**: Target keywords with metrics
- **Competitors**: Competing domains and their strategies
- **Content Gaps**: Identified opportunities

### Relationships
- **Keyword Clustering**: Semantic keyword groupings
- **Topic Hierarchy**: Parent-child content relationships
- **Internal Links**: Link structure between pages
- **Competitor Overlap**: Shared keyword targets
- **Content Gaps**: Missing content opportunities
- **Semantic Similarity**: Content theme relationships

## SEO Use Cases

### 1. Content Strategy Planning
- Visualize your content ecosystem
- Identify content gaps and opportunities
- Plan internal linking strategies
- Optimize topic cluster coverage

### 2. Keyword Research & Analysis
- See semantic relationships between keywords
- Identify keyword clustering opportunities
- Analyze search intent patterns
- Find long-tail keyword opportunities

### 3. Competitive Analysis
- Map competitor content strategies
- Identify keyword gaps vs competitors
- Analyze competitor link structures
- Find content differentiation opportunities

### 4. Technical SEO
- Visualize internal link architecture
- Identify orphaned content
- Optimize topic cluster structures
- Plan URL hierarchies

## Customization

### Node Types & Colors
Each SEO entity type has its own visual styling:
- 🎯 **Topic Clusters**: Blue (primary focus areas)
- 📄 **Pillar Pages**: Green (comprehensive guides)
- 📝 **Cluster Content**: Orange (supporting content)
- 🔍 **Keywords**: Purple (search terms)
- 💡 **Search Intent**: Pink (user intent)
- 🏆 **Competitors**: Red (competitive analysis)
- ⚡ **Content Gaps**: Yellow (opportunities)

### Relationship Types
- **Semantic Similarity**: Dotted lines for related concepts
- **Keyword Clustering**: Solid lines for keyword groups
- **Internal Links**: Thick lines for page connections
- **Topic Hierarchy**: Curved lines for parent-child relationships
- **Competitor Overlap**: Dashed lines for competitive analysis

## Data Integration

### Connecting SEO Tools

You can integrate data from popular SEO tools:

#### Ahrefs API
```javascript
// Example: Import keyword data from Ahrefs
const ahrefsData = await fetch('https://apiv2.ahrefs.com/v2/keywords-explorer', {
  headers: { 'Authorization': `Bearer ${AHREFS_TOKEN}` }
});
```

#### SEMrush API
```javascript
// Example: Import competitor data from SEMrush
const semrushData = await fetch('https://api.semrush.com/', {
  params: { key: SEMRUSH_API_KEY, type: 'domain_organic' }
});
```

#### Google Search Console
```javascript
// Example: Import performance data from GSC
const gscData = await google.searchconsole('v1').searchanalytics.query({
  siteUrl: 'https://yoursite.com',
  requestBody: { dimensions: ['query', 'page'] }
});
```

## Performance Optimization

### Large Dataset Handling
- Implements viewport-based rendering for large graphs
- Lazy loading of node relationships
- Efficient MotherDuck queries with proper indexing
- Client-side caching of frequently accessed data

### Query Optimization
```sql
-- Example optimized query for large keyword datasets
SELECT * FROM keywords 
WHERE search_volume > 1000 
  AND difficulty < 60
ORDER BY search_volume DESC, difficulty ASC
LIMIT 100;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your SEO-specific enhancements
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions about SEO implementation or MotherDuck integration, please open an issue or contact the maintainers.