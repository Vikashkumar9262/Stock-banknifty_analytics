import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const MarketControls = ({
  onTimeframeChange,
  onPredictionToggle,
  onAutoRefreshToggle,
  onSymbolChange,
  onRefresh,
  selectedSymbol = '^NSEI',
  lastUpdated = new Date(),
  isLiveData = false
}) => {
  const [showPrediction, setShowPrediction] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('1h');

  const timeframes = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1d' }
  ];

  const symbols = [
    { value: '^NSEI', label: 'Nifty 50', description: 'NSE Nifty 50 Index' },
    { value: '^NSEBANK', label: 'Bank Nifty', description: 'NSE Bank Nifty Index' },
    { value: '^BSESN', label: 'BSE Sensex', description: 'BSE Sensex Index' },
    { value: 'RELIANCE.NS', label: 'Reliance', description: 'Reliance Industries' },
    { value: 'TCS.NS', label: 'TCS', description: 'Tata Consultancy Services' },
    { value: 'HDFCBANK.NS', label: 'HDFC Bank', description: 'HDFC Bank Limited' },
    { value: 'INFY.NS', label: 'Infosys', description: 'Infosys Limited' },
    { value: 'ICICIBANK.NS', label: 'ICICI Bank', description: 'ICICI Bank Limited' }
  ];

  const handleTimeframeClick = (timeframe) => {
    setActiveTimeframe(timeframe);
    onTimeframeChange?.(timeframe);
  };

  const handlePredictionToggle = (checked) => {
    setShowPrediction(checked);
    onPredictionToggle?.(checked);
  };

  const handleAutoRefreshToggle = (checked) => {
    setAutoRefresh(checked);
    onAutoRefreshToggle?.(checked);
  };

  const handleSymbolChange = (newSymbol) => {
    onSymbolChange?.(newSymbol);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffMs = now - lastUpdated;
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) {
      return `${diffSecs}s ago`;
    } else if (diffSecs < 3600) {
      return `${Math.floor(diffSecs / 60)}m ago`;
    } else {
      return `${Math.floor(diffSecs / 3600)}h ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Left side - Symbol and Timeframe controls */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          {/* Symbol Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
            <Select
              value={selectedSymbol}
              onValueChange={handleSymbolChange}
              options={symbols?.map(symbol => ({
                value: symbol?.value,
                label: symbol?.label,
                description: symbol?.description
              }))}
              placeholder="Select Symbol"
              className="min-w-[140px]"
            />
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground mr-2">Timeframe:</span>
            {timeframes?.map((timeframe) => (
              <Button
                key={timeframe?.value}
                variant={activeTimeframe === timeframe?.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeClick(timeframe?.value)}
                className="text-xs min-w-[40px]"
              >
                {timeframe?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Right side - Toggle controls and status */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          {/* Toggle Controls */}
          <div className="flex items-center space-x-4">
            <Checkbox
              id="show-prediction"
              checked={showPrediction}
              onCheckedChange={handlePredictionToggle}
              label="Show Predictions"
              className="text-sm"
            />
            
            <Checkbox
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={handleAutoRefreshToggle}
              label="Auto Refresh"
              className="text-sm"
            />
          </div>

          {/* Status and Refresh */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${
                isLiveData ? 'bg-green-500' : 'bg-yellow-500'
              } ${autoRefresh ? 'animate-pulse' : ''}`}></div>
              <span>{getTimeSinceUpdate()}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center space-x-1"
            >
              <Icon name="RefreshCw" size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Data Source Indicator */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Database" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Data Source: {isLiveData ? 'Yahoo Finance API (Live)' : 'Demo/Fallback Data'}
          </span>
        </div>
        
        {autoRefresh && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>Updates every 30s</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketControls;