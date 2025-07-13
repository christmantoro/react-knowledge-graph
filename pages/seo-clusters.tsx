import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { 
  Search, 
  Plus, 
  Database, 
  Link, 
  FileText, 
  Trophy, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import SEOKnowledgeGraph from '../components/SEOKnowledgeGraph';
import { SEOEntity } from '../types/seo';
import { SEODataService } from '../services/seoDataService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useToast } from '../components/ui/toast';
import { Spinner } from '../components/ui/spinner';

const SEOClustersPage: NextPage = () => {
  const [clusters, setClusters] = useState<SEOEntity[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<SEOEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clusterStats, setClusterStats] = useState<any>(null);
  const [seoDataService] = useState(new SEODataService());
  const { showToast } = useToast();

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
        showToast({
          title: "Success",
          description: `Loaded ${clusterData.length} topic clusters from MotherDuck`,
          variant: "success"
        });
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
      showToast({
        title: "Error",
        description: "Failed to load cluster statistics",
        variant: "destructive"
      });
    }
  };

  const handleClusterChange = (clusterId: string) => {
    const cluster = clusters.find(c => c.id === clusterId);
    if (cluster) {
      setSelectedCluster(cluster);
    }
  };

  const createNewCluster = () => {
    showToast({
      title: "Coming Soon",
      description: "New cluster creation feature coming soon!",
      variant: "default"
    });
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      await loadTopicClusters();
      showToast({
        title: "Success",
        description: "Successfully connected to MotherDuck!",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Connection Failed",
        description: "Failed to connect to MotherDuck. Please check your token and database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Connecting to MotherDuck...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>MotherDuck Connection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Unable to load SEO data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please check your MotherDuck configuration and ensure your database contains the required SEO schema.
            </p>
            <Button onClick={testConnection} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test MotherDuck Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Topic Clusters
            </h1>
            
            <Select value={selectedCluster?.id} onValueChange={handleClusterChange}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Select a topic cluster" />
              </SelectTrigger>
              <SelectContent>
                {clusters.map(cluster => (
                  <SelectItem key={cluster.id} value={cluster.id}>
                    {cluster.name} ({cluster.searchVolume?.toLocaleString() || 'N/A'} searches)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={testConnection}
              disabled={loading}
            >
              <Database className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
            <Button onClick={createNewCluster}>
              <Plus className="mr-2 h-4 w-4" />
              New Cluster
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-6 py-6">
        {/* Cluster Statistics */}
        {selectedCluster && clusterStats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Search Volume</p>
                    <p className="text-lg font-semibold">{clusterStats.totalSearchVolume.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">monthly</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    clusterStats.avgDifficulty > 60 ? 'bg-red-500' : 
                    clusterStats.avgDifficulty > 40 ? 'bg-orange-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Difficulty</p>
                    <p className="text-lg font-semibold">{clusterStats.avgDifficulty.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Content</p>
                    <p className="text-lg font-semibold">{clusterStats.contentCount}</p>
                    <p className="text-xs text-muted-foreground">pieces</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Keywords</p>
                    <p className="text-lg font-semibold">{clusterStats.keywordCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Competitors</p>
                    <p className="text-lg font-semibold">{clusterStats.competitorCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Content Gaps</p>
                    <p className={`text-lg font-semibold ${
                      clusterStats.gapCount > 0 ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {clusterStats.gapCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Knowledge Graph */}
        {selectedCluster && (
          <Card>
            <CardContent className="p-0">
              <SEOKnowledgeGraph 
                initialCluster={selectedCluster}
                width="100%"
                height="calc(100vh - 300px)"
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SEOClustersPage;