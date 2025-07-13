import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Layout, Card, Row, Col, Select, Button, message, Spin, Statistic, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, DatabaseOutlined, LinkOutlined, FileTextOutlined, TrophyOutlined } from '@ant-design/icons';
import SEOKnowledgeGraph from '../components/SEOKnowledgeGraph';
import { SEOEntity } from '../types/seo';
import { SEODataService } from '../services/seoDataService';

const { Header, Content } = Layout;
const { Option } = Select;

const SEOClustersPage: NextPage = () => {
  const [clusters, setClusters] = useState<SEOEntity[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<SEOEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clusterStats, setClusterStats] = useState<any>(null);
  const [seoDataService] = useState(new SEODataService());

  useEffect(() => {
    loadTopicClusters();
  }, []);

  useEffect(() => {
    if (selectedCluster) {
      loadClusterStats(selectedCluster.id);
    }
  }, [selectedCluster]);

  const loadTopicClusters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const clusterData = await seoDataService.getAllTopicClusters();
      
      if (clusterData.length > 0) {
        setClusters(clusterData);
        setSelectedCluster(clusterData[0]);
        message.success(`Loaded ${clusterData.length} topic clusters from MotherDuck`);
      } else {
        setError('No topic clusters found in MotherDuck database. Please ensure your database contains SEO data.');
      }
    } catch (error) {
      console.error('Error loading topic clusters:', error);
      setError(`Failed to connect to MotherDuck: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadClusterStats = async (clusterId: string) => {
    try {
      const stats = await seoDataService.getClusterStats(clusterId);
      setClusterStats(stats);
    } catch (error) {
      console.error('Error loading cluster stats:', error);
      message.error('Failed to load cluster statistics');
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

  const testConnection = async () => {
    setLoading(true);
    try {
      await loadTopicClusters();
      message.success('Successfully connected to MotherDuck!');
    } catch (error) {
      message.error('Failed to connect to MotherDuck. Please check your token and database.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Connecting to MotherDuck...</p>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px' }}>
          <Alert
            message="MotherDuck Connection Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            action={
              <Button size="small" onClick={testConnection}>
                Retry Connection
              </Button>
            }
          />
          <Card style={{ textAlign: 'center' }}>
            <h3>Unable to load SEO data</h3>
            <p>Please check your MotherDuck configuration and ensure your database contains the required SEO schema.</p>
            <Button type="primary" onClick={testConnection} loading={loading}>
              Test MotherDuck Connection
            </Button>
          </Card>
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
            style={{ width: 350 }}
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
                {cluster.name} ({cluster.searchVolume?.toLocaleString() || 'N/A'} searches)
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            icon={<DatabaseOutlined />}
            onClick={testConnection}
            loading={loading}
          >
            Test Connection
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={createNewCluster}
          >
            New Cluster
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        {/* Cluster Statistics */}
        {selectedCluster && clusterStats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Total Search Volume"
                  value={clusterStats.totalSearchVolume}
                  suffix="monthly"
                  prefix={<SearchOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Avg Difficulty"
                  value={clusterStats.avgDifficulty}
                  suffix="/100"
                  precision={1}
                  valueStyle={{ color: clusterStats.avgDifficulty > 60 ? '#f5222d' : clusterStats.avgDifficulty > 40 ? '#fa8c16' : '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Content Pieces"
                  value={clusterStats.contentCount}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Keywords"
                  value={clusterStats.keywordCount}
                  prefix={<SearchOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Competitors"
                  value={clusterStats.competitorCount}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Content Gaps"
                  value={clusterStats.gapCount}
                  prefix={<LinkOutlined />}
                  valueStyle={{ color: clusterStats.gapCount > 0 ? '#fa8c16' : '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {selectedCluster && (
          <SEOKnowledgeGraph 
            initialCluster={selectedCluster}
            width="100%"
            height="calc(100vh - 200px)"
          />
        )}
      </Content>
    </Layout>
  );
};

export default SEOClustersPage;