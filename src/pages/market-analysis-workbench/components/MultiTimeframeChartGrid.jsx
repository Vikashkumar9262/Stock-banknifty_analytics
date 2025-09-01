import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MultiTimeframeChartGrid = ({ activeIndicators = [], selectedPattern = null }) => {
  const [selectedChart, setSelectedChart] = useState(0);
  const [chartType, setChartType] = useState('candlestick');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeframes = [
    { id: '1H', label: '1 Hour', interval: '1h' },
    { id: '4H', label: '4 Hours', interval: '4h' },
    { id: '1D', label: '1 Day', interval: '1d' },
    { id: '1W', label: '1 Week', interval: '1w' }
  ];

  // Mock OHLC data for different timeframes
  const generateMockData = (timeframe, points = 100) => {
    const data = [];
    const basePrice = 48234;
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = points; i >= 0; i--) {
      const timestamp = new Date(now);
      
      switch (timeframe) {
        case '1H':
          timestamp?.setHours(timestamp?.getHours() - i);
          break;
        case '4H':
          timestamp?.setHours(timestamp?.getHours() - (i * 4));
          break;
        case '1D':
          timestamp?.setDate(timestamp?.getDate() - i);
          break;
        case '1W':
          timestamp?.setDate(timestamp?.getDate() - (i * 7));
          break;
      }

      const volatility = Math.random() * 200 - 100;
      const open = currentPrice;
      const high = open + Math.random() * 150;
      const low = open - Math.random() * 150;
      const close = open + volatility;
      
      currentPrice = close;

      data?.push({
        timestamp: timestamp?.getTime(),
        time: timestamp?.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          day: timeframe === '1D' || timeframe === '1W' ? '2-digit' : undefined,
          month: timeframe === '1W' ? 'short' : undefined
        }),
        open: Math.max(open, 45000),
        high: Math.max(high, Math.max(open, close)),
        low: Math.min(low, Math.min(open, close)),
        close: Math.max(close, 45000),
        volume: Math.floor(Math.random() * 1000000) + 500000,
        // Technical indicators
        rsi: Math.random() * 100,
        macd: Math.random() * 500 - 250,
        sma20: currentPrice + (Math.random() * 200 - 100),
        ema12: currentPrice + (Math.random() * 150 - 75)
      });
    }
    
    return data?.sort((a, b) => a?.timestamp - b?.timestamp);
  };

  const [chartData, setChartData] = useState({
    '1H': generateMockData('1H', 24),
    '4H': generateMockData('4H', 48),
    '1D': generateMockData('1D', 90),
    '1W': generateMockData('1W', 52)
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setChartData(prev => {
        const updated = { ...prev };
        Object.keys(updated)?.forEach(tf => {
          const lastPoint = updated?.[tf]?.[updated?.[tf]?.length - 1];
          const newPoint = {
            ...lastPoint,
            timestamp: Date.now(),
            time: new Date()?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            close: lastPoint?.close + (Math.random() * 100 - 50),
            volume: Math.floor(Math.random() * 1000000) + 500000
          };
          updated[tf] = [...updated?.[tf]?.slice(1), newPoint];
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Open:</span>
              <span className="font-mono">₹{data?.open?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">High:</span>
              <span className="font-mono text-success">₹{data?.high?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Low:</span>
              <span className="font-mono text-error">₹{data?.low?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Close:</span>
              <span className="font-mono">₹{data?.close?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-mono">{data?.volume?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = (timeframe, index) => {
    const data = chartData?.[timeframe?.id] || [];
    
    return (
      <div 
        key={timeframe?.id}
        className={`bg-card border border-border rounded-lg p-4 transition-all duration-300 ${
          selectedChart === index ? 'ring-2 ring-primary' : ''
        } ${isFullscreen && selectedChart !== index ? 'hidden' : ''}`}
        onClick={() => setSelectedChart(index)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-foreground">{timeframe?.label}</h4>
            <span className="text-xs text-muted-foreground">BankNifty</span>
            {selectedPattern && (
              <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded">
                {selectedPattern?.name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-sm font-mono text-foreground">
              ₹{data?.[data?.length - 1]?.close?.toLocaleString('en-IN') || '48,234'}
            </div>
            <Icon name="TrendingUp" size={14} className="text-success" />
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={10}
                tick={{ fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={10}
                tick={{ fill: 'var(--color-muted-foreground)' }}
                tickFormatter={(value) => `₹${(value / 1000)?.toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Main price line */}
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--color-primary)' }}
              />
              
              {/* Technical indicators */}
              {activeIndicators?.includes('sma20') && (
                <Line 
                  type="monotone" 
                  dataKey="sma20" 
                  stroke="var(--color-warning)" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
              
              {activeIndicators?.includes('ema12') && (
                <Line 
                  type="monotone" 
                  dataKey="ema12" 
                  stroke="var(--color-success)" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Chart controls */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName={chartType === 'candlestick' ? 'BarChart3' : 'TrendingUp'}
              onClick={() => setChartType(chartType === 'candlestick' ? 'line' : 'candlestick')}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Maximize2"
              onClick={() => setIsFullscreen(!isFullscreen)}
            />
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Activity" size={12} />
            <span>Live</span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-foreground">Multi-Timeframe Analysis</h3>
          {selectedPattern && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 rounded-lg">
              <Icon name="Target" size={14} className="text-warning" />
              <span className="text-sm text-warning">Pattern: {selectedPattern?.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isFullscreen ? 'default' : 'outline'}
            size="sm"
            iconName={isFullscreen ? 'Minimize2' : 'Maximize2'}
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => console.log('Export charts')}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Chart Grid */}
      <div className={`grid gap-4 transition-all duration-300 ${
        isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
      }`}>
        {timeframes?.map((timeframe, index) => renderChart(timeframe, index))}
      </div>
      {/* Synchronized Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Sync Controls:</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="RotateCcw"
                onClick={() => console.log('Reset zoom')}
              >
                Reset Zoom
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Move"
                onClick={() => console.log('Sync crosshair')}
              >
                Sync Crosshair
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Zap" size={14} />
            <span>Auto-sync enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiTimeframeChartGrid;