import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Layout, Card, Row, Col, Select, Button, message, Spin } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import SEOKnowledgeGraph from '../components/SEOKnowledgeGraph';
import { SEOEntity } from '../types/seo';
import { queryMotherDuck } from '../lib/motherduck';

const { Header, Content } = Layout;
const { Option } = Select;

const SEOClustersPage: NextPage = () => {
  const [clusters, setClusters] = useState<SEOEntity[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<SEOEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopicClusters();
  }, []);

  const loadTopicClusters = async () => {
    try {
      setLoading(true);
      
      // Query to get all topic clusters from MotherDuck
      const query = `
        SELECT 
          id,
          name,
          'topic_cluster' as type,
          search_volume,
          difficulty,
          intent,
          url,
          true as has_more
        FROM topic_clusters 
        ORDER BY search_volume DESC
        LIMIT 50
      `;
      
      const results = await queryMotherDuck(query);
      
      const clusterData: SEOEntity[] = results.map(row => ({
        id: row.id,
        name: row.name,
        type: 'topic_cluster' as const,
        searchVolume: row.search_volume,
        difficulty: row.difficulty,
        intent: row.intent,
        url: row.url,
        hasMore: row.has_more,
        direction: 'root' as const,
        metadata: {
          searchVolume: row.search_volume,
          difficulty: row.difficulty,
        }
      }));
      
      setClusters(clusterData);
      
      if (clusterData.length > 0) {
        setSelectedCluster(clusterData[0]);
      }
    } catch (error) {
      console.error('Error loading topic clusters:', error);
      message.error('Failed to load topic clusters. Using sample data.');
      
      // Fallback sample data
      const sampleCluster: SEOEntity = {
        id: 'cluster-1',
        name: 'Content Marketing Strategy',
        type: 'topic_cluster',
        searchVolume: 12000,
        difficulty: 45,
        intent: 'informational',
        hasMore: true,
        direction: 'root',
        metadata: {
          searchVolume: 12000,
          difficulty: 45,
          traffic_potential: 8500
        }
      };
      
      setClusters([sampleCluster]);
      setSelectedCluster(sampleCluster);
    } finally {
      setLoading(false);
    }
  };

  const handleClusterChange = (clusterId: string) => {
    const cluster = clusters.find(c => c.id === clusterId);
    if (cluster) {
      setSelectedCluster(cluster);
    }
  };

  const createNewCluster = () => {
    message.info('New cluster creation feature coming soon!');
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            <SearchOutlined style={{ marginRight: '8px' }} />
            SEO Topic Clusters
          </h1>
          
          <Select
            style={{ width: 300 }}
            placeholder="Select a topic cluster"
            value={selectedCluster?.id}
            onChange={handleClusterChange}
            showSearch
            filterOption={(input, option) =>
              option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
            }
          >
            {clusters.map(cluster => (
              <Option key={cluster.id} value={cluster.id}>
                {cluster.name} ({cluster.searchVolume?.toLocaleString()} searches)
              </Option>
            ))}
          </Select>
        </div>

        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={createNewCluster}
        >
          New Cluster
        </Button>
      </Header>

      <Content style={{ padding: '24px' }}>
        {selectedCluster ? (
          <SEOKnowledgeGraph 
            initialCluster={selectedCluster}
            width="100%"
            height="calc(100vh - 140px)"
          />
        ) : (
          <Card style={{ textAlign: 'center', marginTop: '100px' }}>
            <h3>No topic clusters available</h3>
            <p>Connect to your MotherDuck database to load SEO data</p>
            <Button type="primary" onClick={loadTopicClusters}>
              Retry Connection
            </Button>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default SEOClustersPage;