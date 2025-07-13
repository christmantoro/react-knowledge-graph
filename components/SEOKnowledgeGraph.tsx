import React, { useCallback, useState } from 'react';
import { KnowledgeGraph, NodeProps } from '../KnowledgeGraph';
import { SEODataService } from '../services/seoDataService';
import { SEOEntity } from '../types/seo';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useToast } from './ui/toast';
import { 
  Search, 
  Trophy, 
  Link, 
  FileText,
  User,
  Lightbulb,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

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
  const { showToast } = useToast();

  const explore = useCallback(async (id: string, node: NodeProps) => {
    try {
      setLoading(true);
      console.log('Exploring node:', id, node);
      
      const data = await seoDataService.getTopicCluster(id);
      
      console.log('Fetched data:', data);
      
      if (data.inside.length === 0 && data.outside.length === 0) {
        showToast({
          title: "No Data",
          description: `No additional data found for ${node.name}`,
          variant: "default"
        });
      } else {
        showToast({
          title: "Data Loaded",
          description: `Loaded ${data.inside.length + data.outside.length} related entities from MotherDuck`,
          variant: "success"
        });
      }
      
      return {
        inside: data.inside,
        outside: data.outside,
        edges: data.edges
      };
    } catch (error) {
      console.error('Error exploring SEO data:', error);
      showToast({
        title: "Error",
        description: `Failed to load data from MotherDuck: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [seoDataService, showToast]);

  const handleNodeInfo = useCallback((node: any) => {
    console.log('Node info clicked:', node);
    setSelectedEntity(node as SEOEntity);
    setModalVisible(true);
  }, []);

  const handleNodeAddon = useCallback(async (node: any) => {
    console.log('Adding to SEO strategy:', node);
    showToast({
      title: "Added to Strategy",
      description: `Added "${node.name}" to SEO strategy`,
      variant: "success"
    });
  }, [showToast]);

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
      case 'informational': return 'bg-blue-500';
      case 'navigational': return 'bg-green-500';
      case 'transactional': return 'bg-red-500';
      case 'commercial': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'text-gray-500';
    if (difficulty < 30) return 'text-green-500';
    if (difficulty < 60) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-md text-sm">
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
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px'
        }}
        edgeConfig={{
          stroke: '#d1d5db',
          strokeWidth: 2,
          hoveredColor: '#3b82f6',
          descriptionSize: 12,
          flyLineEffect: 'arrow'
        }}
        typeConfig={{
          topic_cluster: {
            radius: 30,
            fill: '#3b82f6',
            nameSize: 14,
            typeSize: 10,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#2563eb' }
          },
          pillar_page: {
            radius: 25,
            fill: '#10b981',
            nameSize: 12,
            typeSize: 9,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#059669' }
          },
          cluster_content: {
            radius: 20,
            fill: '#f59e0b',
            nameSize: 11,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#d97706' }
          },
          keyword: {
            radius: 18,
            fill: '#8b5cf6',
            nameSize: 10,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#7c3aed' }
          },
          intent: {
            radius: 16,
            fill: '#ec4899',
            nameSize: 10,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#db2777' }
          },
          competitor: {
            radius: 22,
            fill: '#ef4444',
            nameSize: 11,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#dc2626' }
          },
          content_gap: {
            radius: 19,
            fill: '#eab308',
            nameSize: 10,
            typeSize: 8,
            nameColor: '#ffffff',
            typeColor: '#ffffff',
            hoverStyle: { fill: '#ca8a04' }
          }
        }}
      />

      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{getNodeIcon(selectedEntity?.type || '')}</span>
              {selectedEntity?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntity && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">
                    <Badge className={getIntentColor(selectedEntity.intent)}>
                      {selectedEntity.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Search Intent</label>
                  <div className="mt-1">
                    <Badge className={getIntentColor(selectedEntity.intent)}>
                      {selectedEntity.intent || 'Mixed'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Search Volume</label>
                  <p className="text-lg font-semibold">
                    {selectedEntity.searchVolume?.toLocaleString() || 'N/A'} 
                    <span className="text-sm font-normal text-muted-foreground ml-1">monthly</span>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Keyword Difficulty</label>
                  <p className={`text-lg font-semibold ${getDifficultyColor(selectedEntity.difficulty)}`}>
                    {selectedEntity.difficulty || 'N/A'}/100
                  </p>
                </div>
              </div>

              {selectedEntity.url && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">URL</label>
                  <div className="mt-1">
                    <a 
                      href={selectedEntity.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {selectedEntity.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {selectedEntity.metadata && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {selectedEntity.metadata.cpc && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CPC</label>
                      <p className="text-lg font-semibold">${selectedEntity.metadata.cpc}</p>
                    </div>
                  )}
                  
                  {selectedEntity.metadata.ranking_position && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Current Ranking</label>
                      <p className="text-lg font-semibold">Position {selectedEntity.metadata.ranking_position}</p>
                    </div>
                  )}
                  
                  {selectedEntity.metadata.traffic_potential && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Traffic Potential</label>
                      <p className="text-lg font-semibold">
                        {selectedEntity.metadata.traffic_potential.toLocaleString()} 
                        <span className="text-sm font-normal text-muted-foreground ml-1">monthly visits</span>
                      </p>
                    </div>
                  )}
                  
                  {selectedEntity.metadata.shared_keywords && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Shared Keywords</label>
                      <p className="text-lg font-semibold">
                        {selectedEntity.metadata.shared_keywords} keywords in common
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalVisible(false)}>
              Close
            </Button>
            <Button onClick={() => handleNodeAddon(selectedEntity)}>
              Add to Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SEOKnowledgeGraph;