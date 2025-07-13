import React, { useCallback, useState, useEffect } from 'react';
import { KnowledgeGraph, NodeProps } from '../KnowledgeGraph';
import { SEODataService } from '../services/seoDataService';
import { SEOEntity } from '../types/seo';
import { Card, Statistic, Row, Col, Tag, Button, Modal, Descriptions, message } from 'antd';
import { 
  SearchOutlined, 
  TrophyOutlined, 
  LinkOutlined, 
  FileTextOutlined,
  UserOutlined,
  BulbOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';

interface SEOKnowledgeGraphProps {
  initialCluster: SEOEntity;
  width?: string | number;
  height?: string | number;
}

const SEOKnowledgeGraph: React.FC<SEOKnowledgeGraphProps> = ({
  initialCluster,
  width = "100%",
  height = "80vh"
}) => {
  const [seoDataService] = useState(new SEODataService());
  const [selectedEntity, setSelectedEntity] = useState<SEOEntity | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const explore = useCallback(async (id: string, node: NodeProps) => {
    try {
      setLoading(true);
      console.log('Exploring node:', id, node);
      
      const data = await seoDataService.getTopicCluster(id);
      
      console.log('Fetched data:', data);
      
      if (data.inside.length === 0 && data.outside.length === 0) {
        message.info(`No additional data found for ${node.name}`);
      } else {
        message.success(`Loaded ${data.inside.length + data.outside.length} related entities from MotherDuck`);
      }
      
      return {
        inside: data.inside,
        outside: data.outside,
        edges: data.edges
      };
    } catch (error) {
      console.error('Error exploring SEO data:', error);
      message.error(`Failed to load data from MotherDuck: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw to prevent fallback behavior
    } finally {
      setLoading(false);
    }
  }, [seoDataService]);

  const handleNodeInfo = useCallback((node: any) => {
    console.log('Node info clicked:', node);
    setSelectedEntity(node as SEOEntity);
    setModalVisible(true);
  }, []);

  const handleNodeAddon = useCallback(async (node: any) => {
    console.log('Adding to SEO strategy:', node);
    message.success(`Added "${node.name}" to SEO strategy`);
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'topic_cluster': return '🎯';
      case 'pillar_page': return '📄';
      case 'cluster_content': return '📝';
      case 'keyword': return '🔍';
      case 'intent': return '💡';
      case 'competitor': return '🏆';
      case 'content_gap': return '⚡';
      default: return '📊';
    }
  };

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'informational': return '#1890ff';
      case 'navigational': return '#52c41a';
      case 'transactional': return '#f5222d';
      case 'commercial': return '#fa8c16';
      default: return '#d9d9d9';
    }
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return '#d9d9d9';
    if (difficulty < 30) return '#52c41a';
    if (difficulty < 60) return '#fa8c16';
    return '#f5222d';
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px'
        }}>
          Loading data from MotherDuck...
        </div>
      )}

      <KnowledgeGraph
        explore={explore}
        basicDistence={120}
        width={width}
        height={height}
        position={{ x: 400, y: 300 }}
        node={initialCluster}
        onClickInfo={handleNodeInfo}
        onClickAddon={handleNodeAddon}
        showNodeMenu={true}
        showHelper={true}
        showFilter={true}
        enableAutoExplore={true}
        style={{ 
          background: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRadius: '8px'
        }}
        edgeConfig={{
          stroke: '#d9d9d9',
          strokeWidth: 2,
          hoveredColor: '#1890ff',
          descriptionSize: 12,
          flyLineEffect: 'arrow'
        }}
        typeConfig={{
          topic_cluster: {
            radius: 30,
            fill: '#1890ff',
            nameSize: 14,
            typeSize: 10,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#096dd9' }
          },
          pillar_page: {
            radius: 25,
            fill: '#52c41a',
            nameSize: 12,
            typeSize: 9,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#389e0d' }
          },
          cluster_content: {
            radius: 20,
            fill: '#fa8c16',
            nameSize: 11,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#d46b08' }
          },
          keyword: {
            radius: 18,
            fill: '#722ed1',
            nameSize: 10,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#531dab' }
          },
          intent: {
            radius: 16,
            fill: '#eb2f96',
            nameSize: 10,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#c41d7f' }
          },
          competitor: {
            radius: 22,
            fill: '#f5222d',
            nameSize: 11,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#cf1322' }
          },
          content_gap: {
            radius: 19,
            fill: '#faad14',
            nameSize: 10,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#d48806' }
          }
        }}
      />

      <Modal
        title={
          <span>
            {getNodeIcon(selectedEntity?.type || '')} {selectedEntity?.name}
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="strategy" 
            type="primary" 
            onClick={() => handleNodeAddon(selectedEntity)}
          >
            Add to Strategy
          </Button>
        ]}
        width={600}
      >
        {selectedEntity && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Type">
              <Tag color={getIntentColor(selectedEntity.intent)}>
                {selectedEntity.type.replace('_', ' ').toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Search Intent">
              <Tag color={getIntentColor(selectedEntity.intent)}>
                {selectedEntity.intent || 'Mixed'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Search Volume">
              {selectedEntity.searchVolume?.toLocaleString() || 'N/A'} monthly searches
            </Descriptions.Item>
            <Descriptions.Item label="Keyword Difficulty">
              <span style={{ color: getDifficultyColor(selectedEntity.difficulty) }}>
                {selectedEntity.difficulty || 'N/A'}/100
              </span>
            </Descriptions.Item>
            {selectedEntity.url && (
              <Descriptions.Item label="URL" span={2}>
                <a href={selectedEntity.url} target="_blank" rel="noopener noreferrer">
                  {selectedEntity.url}
                </a>
              </Descriptions.Item>
            )}
            {selectedEntity.metadata?.cpc && (
              <Descriptions.Item label="CPC">
                ${selectedEntity.metadata.cpc}
              </Descriptions.Item>
            )}
            {selectedEntity.metadata?.ranking_position && (
              <Descriptions.Item label="Current Ranking">
                Position {selectedEntity.metadata.ranking_position}
              </Descriptions.Item>
            )}
            {selectedEntity.metadata?.traffic_potential && (
              <Descriptions.Item label="Traffic Potential" span={2}>
                {selectedEntity.metadata.traffic_potential.toLocaleString()} monthly visits
              </Descriptions.Item>
            )}
            {selectedEntity.metadata?.shared_keywords && (
              <Descriptions.Item label="Shared Keywords" span={2}>
                {selectedEntity.metadata.shared_keywords} keywords in common
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SEOKnowledgeGraph;