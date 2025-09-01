import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import yahooFinanceService from '../../../services/yahooFinanceService';

const TradingChart = ({ 
  timeframe = '1h', 
  showPrediction = true, 
  showIndicators = true,
  symbol = '^NSEI',
  isLiveData = false
}) => {
  const [chartData, setChartData] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState(['RSI', 'MACD']);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('live');

  // Fetch real chart data from Yahoo Finance
  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      console.log(`Fetching chart data for ${symbol} with timeframe ${timeframe}`);
      
      // Map timeframe to Yahoo Finance parameters
      const timeframeMapping = {
        '1m': { period: '1d', interval: '1m' },
        '5m': { period: '1d', interval: '5m' },
        '15m': { period: '5d', interval: '15m' },
        '1h': { period: '5d', interval: '1h' },
        '4h': { period: '1mo', interval: '1d' },
        '1d': { period: '3mo', interval: '1d' }
      };

      const { period, interval } = timeframeMapping?.[timeframe] || { period: '5d', interval: '1h' };
      
      const data = await yahooFinanceService?.getChartData(symbol, period, interval);
      
      if (data && data?.length > 0) {
        setChartData(data);
        setDataSource(data?.[0]?.isFallback ? 'fallback' : 'live');
        console.log(`Chart data loaded: ${data?.length} points, source: ${data?.[0]?.isFallback ? 'fallback' : 'live'}`);
      } else {
        // Generate fallback data if no data received
        const fallbackData = yahooFinanceService?.generateFallbackChartData(50);
        setChartData(fallbackData);
        setDataSource('fallback');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Generate fallback data on error
      const fallbackData = yahooFinanceService?.generateFallbackChartData(50);
      setChartData(fallbackData);
      setDataSource('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [timeframe, symbol]);

  const indicators = [
    { id: 'RSI', name: 'RSI', color: '#F59E0B' },
    { id: 'MACD', name: 'MACD', color: '#8B5CF6' },
    { id: 'BB', name: 'Bollinger Bands', color: '#06B6D4' },
    { id: 'ATR', name: 'ATR', color: '#EF4444' }
  ];

  const toggleIndicator = (indicatorId) => {
    setSelectedIndicators(prev => 
      prev?.includes(indicatorId) 
        ? prev?.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm mb-1" style={{ color: entry?.color }}>
              {entry?.name}: ₹{entry?.value?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          ))}
          {data && (
            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
              <p>Open: ₹{data?.open?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              <p>High: ₹{data?.high?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              <p>Low: ₹{data?.low?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              <p>Volume: {data?.volume?.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-96">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <Icon name="BarChart3" size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground">Loading live chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  const getSymbolDisplayName = () => {
    switch (symbol) {
      case '^NSEI': return 'Nifty 50';
      case '^NSEBANK': return 'Bank Nifty';
      case '^BSESN': return 'BSE Sensex';
      default: return symbol;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">{getSymbolDisplayName()} Price Chart</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>({timeframe})</span>
              {dataSource === 'live' ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Live Data
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Demo Data
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {showIndicators && (
            <div className="flex items-center space-x-2">
              {indicators?.map((indicator) => (
                <Button
                  key={indicator?.id}
                  variant={selectedIndicators?.includes(indicator?.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleIndicator(indicator?.id)}
                  className="text-xs"
                >
                  {indicator?.name}
                </Button>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchChartData}
            iconName="RefreshCw"
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Main Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Actual Price Line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              name="Current Price"
            />
            
            {/* Prediction Line */}
            {showPrediction && (
              <>
                <Line
                  type="monotone"
                  dataKey="prediction"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="LSTM Prediction"
                />
                <Line
                  type="monotone"
                  dataKey="confidenceUpper"
                  stroke="var(--color-accent)"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  dot={false}
                  name="Confidence Upper"
                />
                <Line
                  type="monotone"
                  dataKey="confidenceLower"
                  stroke="var(--color-accent)"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  dot={false}
                  name="Confidence Lower"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Legend and Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span className="text-xs text-muted-foreground">Current Price</span>
          </div>
          {showPrediction && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-accent border-dashed border-t"></div>
              <span className="text-xs text-muted-foreground">LSTM Prediction</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-accent opacity-30"></div>
            <span className="text-xs text-muted-foreground">Confidence Band</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {chartData?.length} data points • Updated: {new Date()?.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default TradingChart;