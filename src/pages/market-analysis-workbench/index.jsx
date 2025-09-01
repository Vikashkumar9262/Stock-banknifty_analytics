import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MarketStatusIndicator from '../../components/ui/MarketStatusIndicator';
import CustomizableToolbar from './components/CustomizableToolbar';
import MultiTimeframeChartGrid from './components/MultiTimeframeChartGrid';
import TechnicalIndicatorsPanel from './components/TechnicalIndicatorsPanel';
import PatternRecognitionEngine from './components/PatternRecognitionEngine';
import CorrelationMatrix from './components/CorrelationMatrix';
import MarketSentimentIndicators from './components/MarketSentimentIndicators';
import CyclicalAnalysisTools from './components/CyclicalAnalysisTools';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MarketAnalysisWorkbench = () => {
  const [activeIndicators, setActiveIndicators] = useState(['rsi', 'macd']);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [activePanel, setActivePanel] = useState('indicators');
  const [workspaceLayout, setWorkspaceLayout] = useState('default');
  const [selectedStock, setSelectedStock] = useState({ 
    symbol: 'BANKNIFTY', 
    name: 'Bank Nifty', 
    type: 'Index' 
  });

  const panelOptions = [
    { id: 'indicators', label: 'Technical Indicators', icon: 'TrendingUp' },
    { id: 'patterns', label: 'Pattern Recognition', icon: 'Target' },
    { id: 'correlation', label: 'Correlation Matrix', icon: 'Grid3X3' },
    { id: 'sentiment', label: 'Market Sentiment', icon: 'Heart' },
    { id: 'cyclical', label: 'Cyclical Analysis', icon: 'RotateCw' }
  ];

  const layoutOptions = [
    { id: 'default', label: 'Default Layout', icon: 'Layout' },
    { id: 'focus', label: 'Chart Focus', icon: 'Maximize2' },
    { id: 'analysis', label: 'Deep Analysis', icon: 'Search' }
  ];

  const handleIndicatorToggle = (indicatorId) => {
    setActiveIndicators(prev => 
      prev?.includes(indicatorId)
        ? prev?.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const handleIndicatorAdd = (indicatorId) => {
    if (!activeIndicators?.includes(indicatorId)) {
      setActiveIndicators(prev => [...prev, indicatorId]);
    }
  };

  const handlePatternSelect = (pattern) => {
    setSelectedPattern(pattern);
  };

  const handleDrawingToolSelect = (toolId) => {
    console.log('Drawing tool selected:', toolId);
  };

  const handleChartStyleChange = (styleId) => {
    console.log('Chart style changed:', styleId);
  };

  const handleWorkspaceSave = (workspaceName) => {
    console.log('Workspace saved:', workspaceName);
  };

  const handleWorkspaceLoad = (workspaceId) => {
    console.log('Workspace loaded:', workspaceId);
  };

  const handleStockChange = (stock) => {
    setSelectedStock(stock);
    console.log('Stock changed to:', stock);
    // Here you would typically trigger data refetch or update charts
  };

  // Mock data generator based on selected stock
  const generateMockData = () => {
    const basePrice = selectedStock?.symbol === 'NIFTY' ? 22000 : 
                     selectedStock?.symbol === 'BANKNIFTY'? 48000 : selectedStock?.symbol?.includes('BANK') ? Math.floor(Math.random() * 2000) + 1500 :
                     selectedStock?.symbol?.includes('IT') ? Math.floor(Math.random() * 4000) + 2000 :
                     Math.floor(Math.random() * 3000) + 500;
    
    const change = (Math.random() - 0.5) * 4; // -2% to +2%
    const volume = Math.floor(Math.random() * 5000000) + 1000000; // 1M to 6M
    const volatility = Math.random() * 30 + 10; // 10% to 40%
    const rsi = Math.floor(Math.random() * 100);
    const patterns = Math.floor(Math.random() * 8) + 1;

    return {
      price: `₹${basePrice?.toLocaleString()}`,
      change: `${change >= 0 ? '+' : ''}${change?.toFixed(1)}%`,
      volume: `${(volume / 1000000)?.toFixed(1)}M`,
      volatility: `${volatility?.toFixed(1)}%`,
      rsi: rsi?.toString(),
      patterns: patterns?.toString(),
      changeColor: change >= 0 ? 'text-success' : 'text-destructive'
    };
  };

  const mockData = generateMockData();

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'indicators':
        return (
          <TechnicalIndicatorsPanel
            onIndicatorToggle={handleIndicatorToggle}
            activeIndicators={activeIndicators}
          />
        );
      case 'patterns':
        return (
          <PatternRecognitionEngine
            onPatternSelect={handlePatternSelect}
          />
        );
      case 'correlation':
        return <CorrelationMatrix />;
      case 'sentiment':
        return <MarketSentimentIndicators />;
      case 'cyclical':
        return <CyclicalAnalysisTools />;
      default:
        return (
          <TechnicalIndicatorsPanel
            onIndicatorToggle={handleIndicatorToggle}
            activeIndicators={activeIndicators}
          />
        );
    }
  };

  const getLayoutClasses = () => {
    switch (workspaceLayout) {
      case 'focus':
        return 'grid-cols-1 lg:grid-cols-4'; // Chart takes 3 cols, panel takes 1
      case 'analysis':
        return 'grid-cols-1 lg:grid-cols-2'; // Equal split
      default:
        return 'grid-cols-1 lg:grid-cols-3'; // Chart takes 2 cols, panel takes 1
    }
  };

  const getChartSpan = () => {
    switch (workspaceLayout) {
      case 'focus':
        return 'lg:col-span-3';
      case 'analysis':
        return 'lg:col-span-1';
      default:
        return 'lg:col-span-2';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header selectedStock={selectedStock} />
      <main className="pt-24 pb-8">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Breadcrumb />
              <div className="flex items-center space-x-4 mt-2">
                <h1 className="text-2xl font-bold text-foreground">Market Analysis Workbench</h1>
                <MarketStatusIndicator />
              </div>
              {/* Current Stock Indicator */}
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-muted-foreground">Analyzing:</span>
                <div className="flex items-center space-x-2 px-2 py-1 bg-primary/10 border border-primary/20 rounded">
                  <Icon 
                    name={selectedStock?.type === 'Index' ? 'TrendingUp' : 'Building'} 
                    size={14} 
                    className="text-primary" 
                  />
                  <span className="text-sm font-medium text-primary">
                    {selectedStock?.name} ({selectedStock?.symbol})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Layout Selector */}
              <div className="flex items-center space-x-1 px-2 py-1 bg-muted/30 rounded">
                <Icon name="Layout" size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Layout:</span>
              </div>
              {layoutOptions?.map(layout => (
                <Button
                  key={layout?.id}
                  variant={workspaceLayout === layout?.id ? 'default' : 'ghost'}
                  size="sm"
                  iconName={layout?.icon}
                  onClick={() => setWorkspaceLayout(layout?.id)}
                  title={layout?.label}
                />
              ))}
            </div>
          </div>

          {/* Customizable Toolbar */}
          <CustomizableToolbar
            onIndicatorAdd={handleIndicatorAdd}
            onDrawingToolSelect={handleDrawingToolSelect}
            onChartStyleChange={handleChartStyleChange}
            onWorkspaceSave={handleWorkspaceSave}
            onWorkspaceLoad={handleWorkspaceLoad}
            onStockChange={handleStockChange}
            selectedStock={selectedStock}
          />

          {/* Main Content Grid */}
          <div className={`grid gap-6 ${getLayoutClasses()}`}>
            {/* Charts Section */}
            <div className={`space-y-6 ${getChartSpan()}`}>
              <MultiTimeframeChartGrid
                activeIndicators={activeIndicators}
                selectedPattern={selectedPattern}
                selectedStock={selectedStock}
              />
            </div>

            {/* Analysis Panel */}
            <div className="space-y-4">
              {/* Panel Selector */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-foreground">Analysis Tools</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    onClick={() => console.log('Panel settings')}
                  />
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {panelOptions?.map(panel => (
                    <button
                      key={panel?.id}
                      onClick={() => setActivePanel(panel?.id)}
                      className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-micro ${
                        activePanel === panel?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted/50 text-foreground'
                      }`}
                    >
                      <Icon name={panel?.icon} size={16} />
                      <span className="truncate">{panel?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Panel Content */}
              <div className="flex-1">
                {renderActivePanel()}
              </div>
            </div>
          </div>

          {/* Quick Stats Bar - Dynamic Data */}
          <div className="mt-6 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">
                {selectedStock?.name} ({selectedStock?.symbol}) - Live Data
              </h3>
              <Icon name="RefreshCw" size={14} className="text-muted-foreground animate-spin" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-success">{mockData?.price}</div>
                <div className="text-xs text-muted-foreground">Current Price</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${mockData?.changeColor}`}>{mockData?.change}</div>
                <div className="text-xs text-muted-foreground">Day Change</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{mockData?.volume}</div>
                <div className="text-xs text-muted-foreground">Volume</div>
              </div>
              <div>
                <div className="text-lg font-bold text-warning">{mockData?.volatility}</div>
                <div className="text-xs text-muted-foreground">Volatility</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{mockData?.rsi}</div>
                <div className="text-xs text-muted-foreground">RSI</div>
              </div>
              <div>
                <div className="text-lg font-bold text-success">{mockData?.patterns}</div>
                <div className="text-xs text-muted-foreground">Patterns</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketAnalysisWorkbench;