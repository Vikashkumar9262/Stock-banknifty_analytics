import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MarketStatusIndicator from '../../components/ui/MarketStatusIndicator';
import ModelVersionSelector from './components/ModelVersionSelector';
import MetricToggle from './components/MetricToggle';
import PerformanceMetricsCards from './components/PerformanceMetricsCards';
import PredictionChart from './components/PredictionChart';
import ModelDiagnostics from './components/ModelDiagnostics';
import ModelComparisonGrid from './components/ModelComparisonGrid';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ModelPerformanceAnalytics = () => {
  const [selectedVersion, setSelectedVersion] = useState('v2.3.1');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeMetrics, setActiveMetrics] = useState(['mse', 'rmse', 'mae', 'r2']);
  const [showNotifications, setShowNotifications] = useState(false);
  const [retrainingProgress, setRetrainingProgress] = useState(null);

  // Mock retraining progress simulation
  useEffect(() => {
    const simulateRetraining = () => {
      if (Math.random() > 0.95) {
        setRetrainingProgress({
          status: 'running',
          progress: 0,
          currentEpoch: 1,
          totalEpochs: 500,
          eta: '2h 15m'
        });

        // Simulate progress updates
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 5;
          if (progress >= 100) {
            setRetrainingProgress({
              status: 'completed',
              progress: 100,
              currentEpoch: 500,
              totalEpochs: 500,
              eta: '0m'
            });
            clearInterval(interval);
            setTimeout(() => setRetrainingProgress(null), 5000);
          } else {
            setRetrainingProgress(prev => ({
              ...prev,
              progress,
              currentEpoch: Math.floor((progress / 100) * 500),
              eta: `${Math.floor((100 - progress) * 2.5)}m`
            }));
          }
        }, 1000);
      }
    };

    const timer = setInterval(simulateRetraining, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleMetricToggle = (metricId) => {
    setActiveMetrics(prev => 
      prev?.includes(metricId)
        ? prev?.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleExportData = () => {
    console.log('Exporting model performance data...');
    // Implement export functionality
  };

  const handleViewLogs = () => {
    console.log('Opening detailed training logs...');
    // Implement logs modal
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Breadcrumb and Status */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <Breadcrumb />
            <MarketStatusIndicator />
          </div>

          {/* Model Controls */}
          <div className="space-y-4 mb-6">
            <ModelVersionSelector
              selectedVersion={selectedVersion}
              onVersionChange={setSelectedVersion}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
            
            <MetricToggle
              activeMetrics={activeMetrics}
              onMetricToggle={handleMetricToggle}
            />
          </div>

          {/* Performance Metrics Cards */}
          <div className="mb-6">
            <PerformanceMetricsCards />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
            {/* Prediction Chart - 8 columns */}
            <div className="xl:col-span-8">
              <PredictionChart />
            </div>

            {/* Model Diagnostics - 4 columns */}
            <div className="xl:col-span-4">
              <ModelDiagnostics />
            </div>
          </div>

          {/* Model Comparison Grid */}
          <div className="mb-6">
            <ModelComparisonGrid />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date()?.toLocaleTimeString('en-IN', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              {retrainingProgress && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-lg">
                  <Icon 
                    name={retrainingProgress?.status === 'completed' ? 'CheckCircle' : 'RefreshCw'} 
                    size={14} 
                    className={`${retrainingProgress?.status === 'completed' ? 'text-success' : 'text-primary animate-spin'}`}
                  />
                  <span className="text-sm text-primary">
                    {retrainingProgress?.status === 'completed' 
                      ? 'Retraining completed' 
                      : `Retraining: ${Math.floor(retrainingProgress?.progress)}% (${retrainingProgress?.eta} remaining)`
                    }
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewLogs}
                iconName="FileText"
                iconPosition="left"
              >
                View Logs
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                iconName="Bell"
                iconPosition="left"
              >
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Toast Notifications */}
      {retrainingProgress && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-card border border-border rounded-lg shadow-elevation-lg p-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <Icon 
                name={retrainingProgress?.status === 'completed' ? 'CheckCircle' : 'RefreshCw'} 
                size={20} 
                className={`mt-0.5 ${retrainingProgress?.status === 'completed' ? 'text-success' : 'text-primary animate-spin'}`}
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {retrainingProgress?.status === 'completed' ? 'Training Complete' : 'Model Retraining'}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {retrainingProgress?.status === 'completed' 
                    ? 'New model version v2.3.2 is ready for deployment'
                    : `Epoch ${retrainingProgress?.currentEpoch}/${retrainingProgress?.totalEpochs} • ETA: ${retrainingProgress?.eta}`
                  }
                </p>
                {retrainingProgress?.status !== 'completed' && (
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-smooth"
                      style={{ width: `${retrainingProgress?.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRetrainingProgress(null)}
                iconName="X"
                className="h-6 w-6 p-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelPerformanceAnalytics;