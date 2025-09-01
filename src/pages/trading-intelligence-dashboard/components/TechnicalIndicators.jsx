import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import yahooFinanceService from '../../../services/yahooFinanceService';

const TechnicalIndicators = ({ symbol = '^NSEI', isLiveData = false }) => {
  const [activeIndicator, setActiveIndicator] = useState('RSI');
  const [indicatorData, setIndicatorData] = useState([]);
  const [technicalData, setTechnicalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const indicators = [
    {
      id: 'RSI',
      name: 'RSI',
      fullName: 'Relative Strength Index',
      color: '#F59E0B',
      type: 'oscillator',
      range: [0, 100],
      levels: [30, 70]
    },
    {
      id: 'MACD',
      name: 'MACD',
      fullName: 'Moving Average Convergence Divergence',
      color: '#8B5CF6',
      type: 'momentum',
      range: null,
      levels: [0]
    },
    {
      id: 'Volume',
      name: 'Volume',
      fullName: 'Trading Volume',
      color: '#06B6D4',
      type: 'volume',
      range: null,
      levels: []
    },
    {
      id: 'ATR',
      name: 'ATR',
      fullName: 'Average True Range',
      color: '#EF4444',
      type: 'volatility',
      range: null,
      levels: []
    }
  ];

  // Fetch live technical indicators data
  const fetchTechnicalData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching technical indicators for:', symbol);
      
      // Get chart data for indicators calculation
      const chartData = await yahooFinanceService?.getChartData(symbol, '1mo', '1d');
      
      if (chartData && chartData?.length > 0) {
        // Set chart data for indicators display
        setIndicatorData(chartData);
        
        // Get technical indicators summary
        const techData = await yahooFinanceService?.getTechnicalIndicators(symbol);
        setTechnicalData(techData);
        
        console.log('Technical data loaded:', techData);
      } else {
        // Generate fallback data
        const fallbackData = generateFallbackIndicatorData();
        setIndicatorData(fallbackData);
        setTechnicalData(yahooFinanceService?.generateFallbackIndicators());
      }
    } catch (error) {
      console.error('Error fetching technical indicators:', error);
      // Generate fallback data on error
      const fallbackData = generateFallbackIndicatorData();
      setIndicatorData(fallbackData);
      setTechnicalData(yahooFinanceService?.generateFallbackIndicators());
    } finally {
      setIsLoading(false);
    }
  };

  // Generate fallback indicator data when live data is unavailable
  const generateFallbackIndicatorData = () => {
    const data = [];
    
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(Date.now() - (29 - i) * 60000 * 60); // hourly data
      
      data?.push({
        time: timestamp?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp?.getTime(),
        RSI: Math.random() * 100,
        MACD: (Math.random() - 0.5) * 40,
        MACDSignal: (Math.random() - 0.5) * 35,
        MACDHistogram: (Math.random() - 0.5) * 10,
        Volume: Math.floor(Math.random() * 2000000) + 500000,
        ATR: Math.random() * 200 + 50,
        price: 45250 + (Math.random() - 0.5) * 500,
        isFallback: true
      });
    }
    
    return data;
  };

  useEffect(() => {
    fetchTechnicalData();
  }, [symbol]);

  const getCurrentIndicator = () => {
    return indicators?.find(ind => ind?.id === activeIndicator);
  };

  const getIndicatorValue = (data, indicatorId) => {
    switch (indicatorId) {
      case 'RSI':
        return data?.RSI;
      case 'MACD':
        return data?.MACD;
      case 'Volume':
        return data?.Volume;
      case 'ATR':
        return data?.ATR;
      default:
        return 0;
    }
  };

  const getIndicatorStatus = (value, indicator) => {
    if (indicator?.id === 'RSI') {
      if (value > 70) return { status: 'Overbought', color: 'text-error' };
      if (value < 30) return { status: 'Oversold', color: 'text-success' };
      return { status: 'Neutral', color: 'text-muted-foreground' };
    }
    
    if (indicator?.id === 'MACD') {
      if (value > 0) return { status: 'Bullish', color: 'text-success' };
      return { status: 'Bearish', color: 'text-error' };
    }
    
    if (indicator?.id === 'Volume') {
      const avgVolume = indicatorData?.reduce((sum, item) => sum + (item?.Volume || 0), 0) / indicatorData?.length;
      if (value > avgVolume * 1.5) return { status: 'High Volume', color: 'text-primary' };
      if (value < avgVolume * 0.5) return { status: 'Low Volume', color: 'text-muted-foreground' };
      return { status: 'Normal Volume', color: 'text-foreground' };
    }
    
    return { status: 'Normal', color: 'text-muted-foreground' };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.name === 'Volume' 
                ? `${(entry?.value / 1000000)?.toFixed(1)}M`
                : entry?.value?.toFixed(2)
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const currentIndicator = getCurrentIndicator();
    
    if (currentIndicator?.id === 'Volume') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={indicatorData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000000)?.toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="Volume"
              fill={currentIndicator?.color}
              opacity={0.7}
              name="Volume"
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (currentIndicator?.id === 'MACD') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={indicatorData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="MACD"
              stroke={currentIndicator?.color}
              fill={currentIndicator?.color}
              fillOpacity={0.3}
              name="MACD"
            />
            <Area
              type="monotone"
              dataKey="MACDSignal"
              stroke="#10B981"
              fill="transparent"
              strokeWidth={2}
              name="Signal"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={indicatorData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="time" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            domain={currentIndicator?.range || ['dataMin', 'dataMax']}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference lines for levels */}
          {currentIndicator?.levels?.map((level, index) => (
            <defs key={index}>
              <line
                x1="0%"
                y1={`${100 - (level / (currentIndicator?.range?.[1] - currentIndicator?.range?.[0])) * 100}%`}
                x2="100%"
                y2={`${100 - (level / (currentIndicator?.range?.[1] - currentIndicator?.range?.[0])) * 100}%`}
                stroke="var(--color-muted-foreground)"
                strokeDasharray="2 2"
                opacity={0.5}
              />
            </defs>
          ))}
          
          <Area
            type="monotone"
            dataKey={currentIndicator?.id}
            stroke={currentIndicator?.color}
            fill={currentIndicator?.color}
            fillOpacity={0.3}
            name={currentIndicator?.name}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-80">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const currentIndicator = getCurrentIndicator();
  const latestData = indicatorData?.[indicatorData?.length - 1];
  const currentValue = latestData ? getIndicatorValue(latestData, activeIndicator) : 0;
  const status = getIndicatorStatus(currentValue, currentIndicator);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">{currentIndicator?.fullName}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Technical Analysis</p>
              {technicalData?.isFallback ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Demo Data
                </span>
              ) : isLiveData ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Live Data
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Historical Data
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-semibold text-foreground">
              {currentIndicator?.id === 'Volume' 
                ? `${(currentValue / 1000000)?.toFixed(1)}M`
                : currentValue?.toFixed(2)
              }
            </div>
            <div className={`text-sm font-medium ${status?.color}`}>
              {status?.status}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTechnicalData}
            iconName="RefreshCw"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Indicator Tabs */}
      <div className="flex items-center space-x-2 mb-6">
        {indicators?.map((indicator) => (
          <Button
            key={indicator?.id}
            variant={activeIndicator === indicator?.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveIndicator(indicator?.id)}
            className="text-xs"
          >
            {indicator?.name}
          </Button>
        ))}
      </div>
      
      {/* Chart */}
      <div className="h-64 w-full">
        {renderChart()}
      </div>
      
      {/* Indicator Info */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: currentIndicator?.color }}
            ></div>
            <span>{currentIndicator?.name}</span>
          </div>
          <span>•</span>
          <span>{symbol}</span>
          <span>•</span>
          <span>{indicatorData?.length} data points</span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date()?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;