import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CorrelationMatrix = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [heatmapView, setHeatmapView] = useState(true);

  const assets = [
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', sector: 'Banking' },
    { symbol: 'NIFTY50', name: 'Nifty 50', sector: 'Broad Market' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' },
    { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking' },
    { symbol: 'SBIN', name: 'SBI', sector: 'Banking' },
    { symbol: 'KOTAKBANK', name: 'Kotak Bank', sector: 'Banking' },
    { symbol: 'INDUSINDBK', name: 'IndusInd Bank', sector: 'Banking' },
    { symbol: 'USDINR', name: 'USD/INR', sector: 'Currency' },
    { symbol: 'GOLD', name: 'Gold', sector: 'Commodity' }
  ];

  // Mock correlation data
  const correlationData = {
    'BANKNIFTY': { 'BANKNIFTY': 1.00, 'NIFTY50': 0.87, 'HDFCBANK': 0.92, 'ICICIBANK': 0.89, 'AXISBANK': 0.85, 'SBIN': 0.78, 'KOTAKBANK': 0.88, 'INDUSINDBK': 0.82, 'USDINR': -0.23, 'GOLD': -0.15 },
    'NIFTY50': { 'BANKNIFTY': 0.87, 'NIFTY50': 1.00, 'HDFCBANK': 0.79, 'ICICIBANK': 0.76, 'AXISBANK': 0.73, 'SBIN': 0.71, 'KOTAKBANK': 0.75, 'INDUSINDBK': 0.69, 'USDINR': -0.18, 'GOLD': -0.12 },
    'HDFCBANK': { 'BANKNIFTY': 0.92, 'NIFTY50': 0.79, 'HDFCBANK': 1.00, 'ICICIBANK': 0.84, 'AXISBANK': 0.81, 'SBIN': 0.74, 'KOTAKBANK': 0.86, 'INDUSINDBK': 0.77, 'USDINR': -0.21, 'GOLD': -0.14 },
    'ICICIBANK': { 'BANKNIFTY': 0.89, 'NIFTY50': 0.76, 'HDFCBANK': 0.84, 'ICICIBANK': 1.00, 'AXISBANK': 0.83, 'SBIN': 0.76, 'KOTAKBANK': 0.82, 'INDUSINDBK': 0.79, 'USDINR': -0.19, 'GOLD': -0.13 },
    'AXISBANK': { 'BANKNIFTY': 0.85, 'NIFTY50': 0.73, 'HDFCBANK': 0.81, 'ICICIBANK': 0.83, 'AXISBANK': 1.00, 'SBIN': 0.72, 'KOTAKBANK': 0.78, 'INDUSINDBK': 0.81, 'USDINR': -0.17, 'GOLD': -0.11 },
    'SBIN': { 'BANKNIFTY': 0.78, 'NIFTY50': 0.71, 'HDFCBANK': 0.74, 'ICICIBANK': 0.76, 'AXISBANK': 0.72, 'SBIN': 1.00, 'KOTAKBANK': 0.73, 'INDUSINDBK': 0.75, 'USDINR': -0.25, 'GOLD': -0.18 },
    'KOTAKBANK': { 'BANKNIFTY': 0.88, 'NIFTY50': 0.75, 'HDFCBANK': 0.86, 'ICICIBANK': 0.82, 'AXISBANK': 0.78, 'SBIN': 0.73, 'KOTAKBANK': 1.00, 'INDUSINDBK': 0.76, 'USDINR': -0.20, 'GOLD': -0.13 },
    'INDUSINDBK': { 'BANKNIFTY': 0.82, 'NIFTY50': 0.69, 'HDFCBANK': 0.77, 'ICICIBANK': 0.79, 'AXISBANK': 0.81, 'SBIN': 0.75, 'KOTAKBANK': 0.76, 'INDUSINDBK': 1.00, 'USDINR': -0.16, 'GOLD': -0.10 },
    'USDINR': { 'BANKNIFTY': -0.23, 'NIFTY50': -0.18, 'HDFCBANK': -0.21, 'ICICIBANK': -0.19, 'AXISBANK': -0.17, 'SBIN': -0.25, 'KOTAKBANK': -0.20, 'INDUSINDBK': -0.16, 'USDINR': 1.00, 'GOLD': 0.34 },
    'GOLD': { 'BANKNIFTY': -0.15, 'NIFTY50': -0.12, 'HDFCBANK': -0.14, 'ICICIBANK': -0.13, 'AXISBANK': -0.11, 'SBIN': -0.18, 'KOTAKBANK': -0.13, 'INDUSINDBK': -0.10, 'USDINR': 0.34, 'GOLD': 1.00 }
  };

  const timeframes = ['1W', '1M', '3M', '6M', '1Y'];

  const getCorrelationColor = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return value > 0 ? 'bg-success' : 'bg-error';
    if (absValue >= 0.6) return value > 0 ? 'bg-success/70' : 'bg-error/70';
    if (absValue >= 0.4) return value > 0 ? 'bg-success/50' : 'bg-error/50';
    if (absValue >= 0.2) return value > 0 ? 'bg-success/30' : 'bg-error/30';
    return 'bg-muted/30';
  };

  const getCorrelationTextColor = (value) => {
    const absValue = Math.abs(value);
    return absValue >= 0.5 ? 'text-white' : 'text-foreground';
  };

  const getCorrelationStrength = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return 'Very Strong';
    if (absValue >= 0.6) return 'Strong';
    if (absValue >= 0.4) return 'Moderate';
    if (absValue >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  const renderHeatmapCell = (rowAsset, colAsset, value) => {
    return (
      <div
        key={`${rowAsset}-${colAsset}`}
        className={`relative h-12 w-12 flex items-center justify-center text-xs font-mono rounded transition-all duration-200 hover:scale-110 cursor-pointer ${getCorrelationColor(value)} ${getCorrelationTextColor(value)}`}
        title={`${rowAsset} vs ${colAsset}: ${value?.toFixed(2)} (${getCorrelationStrength(value)})`}
      >
        {value?.toFixed(2)}
      </div>
    );
  };

  const renderTableView = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-muted-foreground border-b border-border">
                Asset
              </th>
              {assets?.map(asset => (
                <th key={asset?.symbol} className="p-2 text-center text-xs font-medium text-muted-foreground border-b border-border min-w-[80px]">
                  {asset?.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets?.map(rowAsset => (
              <tr key={rowAsset?.symbol} className="hover:bg-muted/30">
                <td className="p-2 text-sm font-medium text-foreground border-b border-border">
                  <div>
                    <div>{rowAsset?.symbol}</div>
                    <div className="text-xs text-muted-foreground">{rowAsset?.sector}</div>
                  </div>
                </td>
                {assets?.map(colAsset => {
                  const value = correlationData?.[rowAsset?.symbol]?.[colAsset?.symbol] || 0;
                  return (
                    <td key={colAsset?.symbol} className="p-2 text-center border-b border-border">
                      <span className={`font-mono text-sm ${
                        value > 0.7 ? 'text-success font-bold' :
                        value < -0.3 ? 'text-error font-bold': 'text-foreground'
                      }`}>
                        {value?.toFixed(2)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderHeatmapView = () => {
    return (
      <div className="space-y-4">
        {/* Asset labels */}
        <div className="flex items-center space-x-2 ml-32">
          {assets?.map(asset => (
            <div key={asset?.symbol} className="w-12 text-center">
              <div className="text-xs font-medium text-foreground transform -rotate-45 origin-bottom-left">
                {asset?.symbol}
              </div>
            </div>
          ))}
        </div>
        {/* Heatmap grid */}
        <div className="space-y-2">
          {assets?.map(rowAsset => (
            <div key={rowAsset?.symbol} className="flex items-center space-x-2">
              <div className="w-28 text-right">
                <div className="text-sm font-medium text-foreground">{rowAsset?.symbol}</div>
                <div className="text-xs text-muted-foreground">{rowAsset?.sector}</div>
              </div>
              <div className="flex space-x-1">
                {assets?.map(colAsset => {
                  const value = correlationData?.[rowAsset?.symbol]?.[colAsset?.symbol] || 0;
                  return renderHeatmapCell(rowAsset?.symbol, colAsset?.symbol, value);
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Correlation Matrix</h3>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {timeframes?.map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2 py-1 text-xs rounded transition-micro ${
                  selectedTimeframe === tf
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName={heatmapView ? 'Table' : 'Grid3X3'}
            onClick={() => setHeatmapView(!heatmapView)}
          >
            {heatmapView ? 'Table' : 'Heatmap'}
          </Button>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mb-6 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-success rounded"></div>
          <span className="text-xs text-muted-foreground">Strong Positive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-success/50 rounded"></div>
          <span className="text-xs text-muted-foreground">Moderate Positive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-muted/50 rounded"></div>
          <span className="text-xs text-muted-foreground">Neutral</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-error/50 rounded"></div>
          <span className="text-xs text-muted-foreground">Moderate Negative</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-error rounded"></div>
          <span className="text-xs text-muted-foreground">Strong Negative</span>
        </div>
      </div>
      {/* Matrix Content */}
      <div className="max-h-[calc(100vh-400px)] overflow-auto">
        {heatmapView ? renderHeatmapView() : renderTableView()}
      </div>
      {/* Key Insights */}
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={12} className="text-success" />
            <span className="text-muted-foreground">
              Highest correlation: BANKNIFTY-HDFCBANK (0.92)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="TrendingDown" size={12} className="text-error" />
            <span className="text-muted-foreground">
              Lowest correlation: BANKNIFTY-USDINR (-0.23)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={12} className="text-warning" />
            <span className="text-muted-foreground">
              Diversification: Gold shows negative correlation
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={12} className="text-primary" />
            <span className="text-muted-foreground">
              Banking sector highly correlated (0.72-0.92)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;