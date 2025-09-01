import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MarketStatusIndicator from '../../components/ui/MarketStatusIndicator';
import RiskMetricsCard from './components/RiskMetricsCard';
import AlertsFeed from './components/AlertsFeed';
import RiskVisualizationChart from './components/RiskVisualizationChart';
import ScenarioAnalysisTable from './components/ScenarioAnalysisTable';
import RiskControlPanel from './components/RiskControlPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RiskManagementCenter = () => {
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Mock risk metrics data
  const riskMetrics = [
    {
      title: 'Value at Risk (VaR)',
      value: '2.8',
      unit: '%',
      change: '+0.3%',
      changeType: 'negative',
      threshold: 2.5,
      icon: 'TrendingDown',
      description: '95% confidence, 1-day horizon'
    },
    {
      title: 'Maximum Drawdown',
      value: '12.4',
      unit: '%',
      change: '-1.2%',
      changeType: 'positive',
      threshold: 15,
      icon: 'ArrowDown',
      description: 'Peak-to-trough decline'
    },
    {
      title: 'Sharpe Ratio',
      value: '1.85',
      unit: '',
      change: '+0.15',
      changeType: 'positive',
      threshold: null,
      icon: 'Target',
      description: 'Risk-adjusted returns'
    },
    {
      title: 'Portfolio Beta',
      value: '1.12',
      unit: '',
      change: '+0.08',
      changeType: 'negative',
      threshold: 1.2,
      icon: 'Activity',
      description: 'Market sensitivity'
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        setRefreshTime(new Date());
      }, 300000); // 5 minutes
    }
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const handleManualRefresh = () => {
    setRefreshTime(new Date());
  };

  const handleExportData = () => {
    console.log('Exporting risk data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Risk Management Center</h1>
                <p className="text-muted-foreground">
                  Comprehensive portfolio risk assessment and exposure monitoring
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <MarketStatusIndicator />
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManualRefresh}
                    iconName="RefreshCw"
                  >
                    Refresh
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    iconName="Download"
                  >
                    Export
                  </Button>
                  
                  <Button
                    variant={isAutoRefresh ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                    iconName="Clock"
                  >
                    Auto-refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Control Panel */}
          <div className="mb-8">
            <RiskControlPanel />
          </div>

          {/* Key Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {riskMetrics?.map((metric, index) => (
              <RiskMetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                unit={metric?.unit}
                change={metric?.change}
                changeType={metric?.changeType}
                threshold={metric?.threshold}
                icon={metric?.icon}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
            {/* Risk Visualization Chart - 12 columns */}
            <div className="xl:col-span-3">
              <RiskVisualizationChart />
            </div>

            {/* Alerts Feed - 4 columns */}
            <div className="xl:col-span-1">
              <AlertsFeed />
            </div>
          </div>

          {/* Scenario Analysis Table */}
          <div className="mb-8">
            <ScenarioAnalysisTable />
          </div>

          {/* Footer Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>Last updated: {refreshTime?.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={16} />
                  <span>Data source: NSE Real-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} />
                  <span>Risk engine: Active</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Users" size={16} />
                  <span>Portfolio Managers & Risk Analysts</span>
                </div>
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span>System Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiskManagementCenter;