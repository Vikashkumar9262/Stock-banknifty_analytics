import React, { useState, useEffect } from 'react';
import pythonBackendService from '../../services/pythonBackendService';
import yahooFinanceService from '../../services/yahooFinanceService';
import Button from './Button';
import Icon from '../AppIcon';

const PythonBackendDemo = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [selectedSymbol, setSelectedSymbol] = useState('BANKNIFTY');
  const [quoteData, setQuoteData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wsConnection, setWsConnection] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);

  const symbols = ['BANKNIFTY', 'NIFTY', 'TCS', 'INFY', 'HDFCBANK'];

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const isAvailable = await pythonBackendService.isBackendAvailable();
      setBackendStatus(isAvailable ? 'available' : 'unavailable');
    } catch (error) {
      setBackendStatus('unavailable');
    }
  };

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try Python backend first, fallback to original service
      const quote = await pythonBackendService.getQuoteWithFallback(
        selectedSymbol, 
        yahooFinanceService
      );
      setQuoteData(quote);
    } catch (error) {
      setError(`Failed to fetch quote: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const chart = await pythonBackendService.getChartData(selectedSymbol, '1d', '5m');
      setChartData(chart);
    } catch (error) {
      setError(`Failed to fetch chart data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndicators = async () => {
    setLoading(true);
    setError(null);
    try {
      const techIndicators = await pythonBackendService.getTechnicalIndicators(selectedSymbol);
      setIndicators(techIndicators);
    } catch (error) {
      setError(`Failed to fetch indicators: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const enhancedQuote = await pythonBackendService.getEnhancedQuote(selectedSymbol);
      setQuoteData(enhancedQuote.quote);
      setChartData(enhancedQuote.chartData);
      setIndicators(enhancedQuote.indicators);
      
      if (enhancedQuote.errors.length > 0) {
        setError(`Some data failed to load: ${enhancedQuote.errors.join(', ')}`);
      }
    } catch (error) {
      setError(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startWebSocket = () => {
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
      setRealTimeData(null);
      return;
    }

    try {
      const ws = pythonBackendService.createWebSocketConnection(
        selectedSymbol,
        (data) => {
          if (data.type === 'quote_update') {
            setRealTimeData(data.data);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          setError('WebSocket connection error');
        },
        () => {
          setWsConnection(null);
          setRealTimeData(null);
        }
      );
      setWsConnection(ws);
    } catch (error) {
      setError(`Failed to start WebSocket: ${error.message}`);
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'available': return 'text-success';
      case 'unavailable': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'available': return 'CheckCircle';
      case 'unavailable': return 'XCircle';
      default: return 'Loader';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">🐍 Python Backend Demo</h2>
        <div className="flex items-center space-x-2">
          <Icon name={getStatusIcon()} size={16} className={getStatusColor()} />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {backendStatus === 'available' ? 'Backend Available' : 
             backendStatus === 'unavailable' ? 'Backend Unavailable' : 'Checking...'}
          </span>
        </div>
      </div>

      {/* Symbol Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Symbol
        </label>
        <div className="flex flex-wrap gap-2">
          {symbols.map(symbol => (
            <Button
              key={symbol}
              variant={selectedSymbol === symbol ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSymbol(symbol)}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchQuote}
          loading={loading}
          iconName="TrendingUp"
        >
          Quote
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchChartData}
          loading={loading}
          iconName="BarChart3"
        >
          Chart Data
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchIndicators}
          loading={loading}
          iconName="Calculator"
        >
          Indicators
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={fetchAllData}
          loading={loading}
          iconName="Zap"
        >
          All Data
        </Button>
      </div>

      {/* WebSocket Control */}
      <div className="mb-6">
        <Button
          variant={wsConnection ? 'destructive' : 'secondary'}
          size="sm"
          onClick={startWebSocket}
          iconName={wsConnection ? 'Square' : 'Play'}
        >
          {wsConnection ? 'Stop Real-time' : 'Start Real-time'}
        </Button>
        {wsConnection && (
          <span className="ml-3 text-sm text-success">
            🔌 WebSocket Connected
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div className="space-y-4">
        {/* Quote Data */}
        {quoteData && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Quote Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-lg font-bold text-success">₹{quoteData.currentPrice}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Change</div>
                <div className={`text-lg font-bold ${quoteData.dailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {quoteData.dailyChange >= 0 ? '+' : ''}{quoteData.dailyChange} ({quoteData.dailyChangePercent}%)
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-bold text-foreground">{quoteData.volume?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Market State</div>
                <div className="text-lg font-bold text-primary">{quoteData.marketState}</div>
              </div>
            </div>
            {quoteData.isFallback && (
              <div className="mt-2 text-xs text-warning bg-warning/10 p-2 rounded">
                ⚠️ Using fallback data - API unavailable
              </div>
            )}
          </div>
        )}

        {/* Technical Indicators */}
        {indicators && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Technical Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">RSI</div>
                <div className="text-lg font-bold text-primary">{indicators.rsi}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">MACD</div>
                <div className="text-lg font-bold text-primary">{indicators.macd}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">ATR</div>
                <div className="text-lg font-bold text-primary">{indicators.atr}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-bold text-primary">{indicators.volume?.toLocaleString()}</div>
              </div>
            </div>
            {indicators.isFallback && (
              <div className="mt-2 text-xs text-warning bg-warning/10 p-2 rounded">
                ⚠️ Using fallback indicators
              </div>
            )}
          </div>
        )}

        {/* Chart Data Summary */}
        {chartData && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Chart Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Data Points</div>
                <div className="text-lg font-bold text-foreground">{chartData.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Latest Price</div>
                <div className="text-lg font-bold text-success">₹{chartData[chartData.length - 1]?.price}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time Range</div>
                <div className="text-lg font-bold text-foreground">
                  {chartData[0]?.time} - {chartData[chartData.length - 1]?.time}
                </div>
              </div>
            </div>
            {chartData[0]?.isFallback && (
              <div className="mt-2 text-xs text-warning bg-warning/10 p-2 rounded">
                ⚠️ Using fallback chart data
              </div>
            )}
          </div>
        )}

        {/* Real-time Updates */}
        {realTimeData && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-primary mb-3">🔄 Real-time Updates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Live Price</div>
                <div className="text-lg font-bold text-primary">₹{realTimeData.currentPrice}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Change</div>
                <div className={`text-lg font-bold ${realTimeData.dailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {realTimeData.dailyChange >= 0 ? '+' : ''}{realTimeData.dailyChange}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-bold text-foreground">{realTimeData.volume?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Updated</div>
                <div className="text-lg font-bold text-muted-foreground">
                  {new Date(realTimeData.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backend Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={14} />
            <span>Backend Information</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>• Base URL: {pythonBackendService.baseURL}</div>
            <div>• Status: {backendStatus}</div>
            <div>• WebSocket: {wsConnection ? 'Connected' : 'Disconnected'}</div>
            <div>• Fallback: {backendStatus === 'unavailable' ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonBackendDemo;
