import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StockSearch from '../../../components/ui/StockSearch';

const CustomizableToolbar = ({ 
  onIndicatorAdd, 
  onDrawingToolSelect, 
  onChartStyleChange, 
  onWorkspaceSave, 
  onWorkspaceLoad,
  onStockChange,
  selectedStock
}) => {
  const [activeDrawingTool, setActiveDrawingTool] = useState(null);
  const [showIndicatorLibrary, setShowIndicatorLibrary] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [chartStyle, setChartStyle] = useState('candlestick');

  const drawingTools = [
    { id: 'trendline', name: 'Trend Line', icon: 'TrendingUp' },
    { id: 'horizontal', name: 'Horizontal Line', icon: 'Minus' },
    { id: 'vertical', name: 'Vertical Line', icon: 'Separator' },
    { id: 'rectangle', name: 'Rectangle', icon: 'Square' },
    { id: 'circle', name: 'Circle', icon: 'Circle' },
    { id: 'fibonacci', name: 'Fibonacci', icon: 'GitBranch' },
    { id: 'arrow', name: 'Arrow', icon: 'ArrowRight' },
    { id: 'text', name: 'Text', icon: 'Type' }
  ];

  const indicatorLibrary = [
    {
      category: 'Trend',
      indicators: [
        { id: 'sma', name: 'Simple Moving Average', shortName: 'SMA' },
        { id: 'ema', name: 'Exponential Moving Average', shortName: 'EMA' },
        { id: 'bollinger', name: 'Bollinger Bands', shortName: 'BB' },
        { id: 'ichimoku', name: 'Ichimoku Cloud', shortName: 'ICH' }
      ]
    },
    {
      category: 'Momentum',
      indicators: [
        { id: 'rsi', name: 'Relative Strength Index', shortName: 'RSI' },
        { id: 'macd', name: 'MACD', shortName: 'MACD' },
        { id: 'stochastic', name: 'Stochastic', shortName: 'STOCH' },
        { id: 'williams', name: 'Williams %R', shortName: '%R' }
      ]
    },
    {
      category: 'Volume',
      indicators: [
        { id: 'volume', name: 'Volume', shortName: 'VOL' },
        { id: 'obv', name: 'On Balance Volume', shortName: 'OBV' },
        { id: 'vwap', name: 'VWAP', shortName: 'VWAP' },
        { id: 'mfi', name: 'Money Flow Index', shortName: 'MFI' }
      ]
    }
  ];

  const chartStyles = [
    { id: 'candlestick', name: 'Candlestick', icon: 'BarChart3' },
    { id: 'line', name: 'Line', icon: 'TrendingUp' },
    { id: 'area', name: 'Area', icon: 'Activity' },
    { id: 'heikin', name: 'Heikin Ashi', icon: 'BarChart2' }
  ];

  const workspaces = [
    { id: 'default', name: 'Default Workspace', lastModified: '2025-01-01 14:30' },
    { id: 'scalping', name: 'Scalping Setup', lastModified: '2025-01-01 12:15' },
    { id: 'swing', name: 'Swing Trading', lastModified: '2024-12-31 16:45' },
    { id: 'analysis', name: 'Deep Analysis', lastModified: '2024-12-30 11:20' }
  ];

  const handleDrawingToolSelect = (toolId) => {
    setActiveDrawingTool(activeDrawingTool === toolId ? null : toolId);
    onDrawingToolSelect?.(toolId);
  };

  const handleIndicatorAdd = (indicatorId) => {
    onIndicatorAdd?.(indicatorId);
    setShowIndicatorLibrary(false);
  };

  const handleChartStyleChange = (styleId) => {
    setChartStyle(styleId);
    onChartStyleChange?.(styleId);
  };

  const handleWorkspaceSave = () => {
    const workspaceName = prompt('Enter workspace name:');
    if (workspaceName) {
      onWorkspaceSave?.(workspaceName);
      setShowWorkspaceMenu(false);
    }
  };

  const handleWorkspaceLoad = (workspaceId) => {
    onWorkspaceLoad?.(workspaceId);
    setShowWorkspaceMenu(false);
  };

  const handleStockSelect = (stock) => {
    onStockChange?.(stock);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left Section - Stock Search & Drawing Tools */}
        <div className="flex items-center space-x-4">
          {/* Stock Search */}
          <StockSearch 
            selectedStock={selectedStock}
            onStockSelect={handleStockSelect}
          />
          
          {/* Drawing Tools Separator */}
          <div className="h-6 w-px bg-border"></div>
          
          {/* Drawing Tools */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-muted/30 rounded">
              <Icon name="Pencil" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Drawing:</span>
            </div>
            
            {drawingTools?.slice(0, 5)?.map(tool => (
              <Button
                key={tool?.id}
                variant={activeDrawingTool === tool?.id ? 'default' : 'ghost'}
                size="sm"
                iconName={tool?.icon}
                onClick={() => handleDrawingToolSelect(tool?.id)}
                title={tool?.name}
                className="transition-micro"
              />
            ))}
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                onClick={() => console.log('More drawing tools')}
                title="More Tools"
              />
            </div>
          </div>
        </div>

        {/* Center Section - Chart Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-muted/30 rounded">
            <Icon name="BarChart3" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Style:</span>
          </div>
          
          {chartStyles?.map(style => (
            <Button
              key={style?.id}
              variant={chartStyle === style?.id ? 'default' : 'ghost'}
              size="sm"
              iconName={style?.icon}
              onClick={() => handleChartStyleChange(style?.id)}
              title={style?.name}
              className="transition-micro"
            />
          ))}
        </div>

        {/* Right Section - Indicators & Workspace */}
        <div className="flex items-center space-x-2">
          {/* Indicators */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={() => setShowIndicatorLibrary(!showIndicatorLibrary)}
            >
              Indicators
            </Button>
            
            {showIndicatorLibrary && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <h4 className="font-medium text-foreground">Technical Indicators</h4>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {indicatorLibrary?.map(category => (
                    <div key={category?.category} className="p-3 border-b border-border last:border-b-0">
                      <h5 className="text-sm font-medium text-muted-foreground mb-2">
                        {category?.category}
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {category?.indicators?.map(indicator => (
                          <button
                            key={indicator?.id}
                            onClick={() => handleIndicatorAdd(indicator?.id)}
                            className="flex items-center justify-between p-2 text-sm rounded hover:bg-muted/50 transition-micro"
                          >
                            <span className="text-foreground">{indicator?.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {indicator?.shortName}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Workspace */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              iconName="Layout"
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            >
              Workspace
            </Button>
            
            {showWorkspaceMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <h4 className="font-medium text-foreground">Workspaces</h4>
                </div>
                
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Save"
                    onClick={handleWorkspaceSave}
                    className="w-full justify-start mb-2"
                  >
                    Save Current Workspace
                  </Button>
                  
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="text-xs text-muted-foreground mb-2 px-2">Load Workspace:</div>
                    {workspaces?.map(workspace => (
                      <button
                        key={workspace?.id}
                        onClick={() => handleWorkspaceLoad(workspace?.id)}
                        className="w-full flex items-center justify-between p-2 text-sm rounded hover:bg-muted/50 transition-micro"
                      >
                        <div className="text-left">
                          <div className="text-foreground">{workspace?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {workspace?.lastModified}
                          </div>
                        </div>
                        <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1 border-l border-border pl-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              onClick={() => console.log('Undo')}
              title="Undo"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCw"
              onClick={() => console.log('Redo')}
              title="Redo"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              onClick={() => console.log('Clear all')}
              title="Clear All"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={() => console.log('Export chart')}
              title="Export"
            />
          </div>
        </div>
      </div>
      
      {/* Active Tool Indicator */}
      {activeDrawingTool && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Info" size={14} className="text-primary" />
            <span className="text-muted-foreground">
              Active tool: <span className="text-primary font-medium">
                {drawingTools?.find(t => t?.id === activeDrawingTool)?.name}
              </span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setActiveDrawingTool(null)}
              className="ml-auto"
            >
              Deselect
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizableToolbar;