import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PatternRecognitionEngine = ({ onPatternSelect }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [filterType, setFilterType] = useState('all');

  const detectedPatterns = [
    {
      id: 'hs-001',
      name: 'Head and Shoulders',
      type: 'reversal',
      probability: 78.5,
      status: 'forming',
      timeframe: '1D',
      targetPrice: 49850,
      currentPrice: 48234,
      stopLoss: 47800,
      riskReward: 2.3,
      completionDate: '2025-01-05',
      description: `Classic head and shoulders pattern forming with left shoulder at ₹47,800, head at ₹48,900, and right shoulder currently developing.\nPattern suggests potential bearish reversal with target around ₹49,850.`,
      confidence: 'high',
      volume: 'confirming'
    },
    {
      id: 'tri-002',
      name: 'Ascending Triangle',
      type: 'continuation',
      probability: 85.2,
      status: 'confirmed',
      timeframe: '4H',
      targetPrice: 49200,
      currentPrice: 48234,
      stopLoss: 47900,
      riskReward: 2.9,
      completionDate: '2025-01-03',
      description: `Strong ascending triangle pattern with horizontal resistance at ₹48,500 and rising support line.\nBreakout confirmed with increased volume, targeting ₹49,200.`,
      confidence: 'very high',
      volume: 'strong'
    },
    {
      id: 'flag-003',
      name: 'Bull Flag',
      type: 'continuation',
      probability: 72.8,
      status: 'developing',
      timeframe: '1H',
      targetPrice: 48800,
      currentPrice: 48234,
      stopLoss: 48000,
      riskReward: 2.4,
      completionDate: '2025-01-02',
      description: `Bull flag pattern developing after strong upward move.\nConsolidation phase showing tight range with declining volume.`,
      confidence: 'medium',
      volume: 'declining'
    },
    {
      id: 'wedge-004',
      name: 'Rising Wedge',
      type: 'reversal',
      probability: 68.9,
      status: 'early',
      timeframe: '1D',
      targetPrice: 47500,
      currentPrice: 48234,
      stopLoss: 48500,
      riskReward: 2.7,
      completionDate: '2025-01-08',
      description: `Rising wedge pattern in early formation stage.\nBoth support and resistance lines converging with decreasing volume.`,
      confidence: 'medium',
      volume: 'decreasing'
    }
  ];

  const timeframes = ['1H', '4H', '1D', '1W'];
  const filterTypes = [
    { value: 'all', label: 'All Patterns' },
    { value: 'reversal', label: 'Reversal' },
    { value: 'continuation', label: 'Continuation' }
  ];

  const getPatternTypeColor = (type) => {
    return type === 'reversal' ? 'text-warning' : 'text-primary';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success';
      case 'forming': return 'text-warning';
      case 'developing': return 'text-primary';
      case 'early': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'very high': return 'text-success';
      case 'high': return 'text-primary';
      case 'medium': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-success';
    if (probability >= 70) return 'text-primary';
    if (probability >= 60) return 'text-warning';
    return 'text-error';
  };

  const filteredPatterns = detectedPatterns?.filter(pattern => {
    const timeframeMatch = selectedTimeframe === 'all' || pattern?.timeframe === selectedTimeframe;
    const typeMatch = filterType === 'all' || pattern?.type === filterType;
    return timeframeMatch && typeMatch;
  });

  const handlePatternClick = (pattern) => {
    onPatternSelect?.(pattern);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Pattern Recognition</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground">AI Powered</span>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Timeframe:</span>
          <div className="flex space-x-1">
            {timeframes?.map((tf) => (
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
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          <div className="flex space-x-1">
            {filterTypes?.map((filter) => (
              <button
                key={filter?.value}
                onClick={() => setFilterType(filter?.value)}
                className={`px-2 py-1 text-xs rounded transition-micro ${
                  filterType === filter?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {filter?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Pattern List */}
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {filteredPatterns?.map((pattern) => (
          <div
            key={pattern?.id}
            onClick={() => handlePatternClick(pattern)}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-micro cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-foreground">{pattern?.name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${getPatternTypeColor(pattern?.type)} bg-current/10`}>
                  {pattern?.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(pattern?.status)} bg-current/10`}>
                  {pattern?.status}
                </span>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getProbabilityColor(pattern?.probability)}`}>
                  {pattern?.probability}%
                </div>
                <div className="text-xs text-muted-foreground">{pattern?.timeframe}</div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {pattern?.description}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Target:</span>
                <div className="font-mono text-success">
                  ₹{pattern?.targetPrice?.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Stop Loss:</span>
                <div className="font-mono text-error">
                  ₹{pattern?.stopLoss?.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">R:R Ratio:</span>
                <div className="font-mono text-primary">
                  1:{pattern?.riskReward}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Confidence:</span>
                <div className={`font-medium ${getConfidenceColor(pattern?.confidence)}`}>
                  {pattern?.confidence}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} />
                  <span>Est. {pattern?.completionDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Volume2" size={12} />
                  <span>Volume: {pattern?.volume}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                onClick={(e) => {
                  e?.stopPropagation();
                  console.log('View pattern details:', pattern?.id);
                }}
              >
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filteredPatterns?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No patterns found for selected filters</p>
        </div>
      )}
      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">
              {detectedPatterns?.filter(p => p?.status === 'confirmed')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Confirmed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {detectedPatterns?.filter(p => p?.status === 'forming')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Forming</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {detectedPatterns?.filter(p => p?.probability >= 75)?.length}
            </div>
            <div className="text-xs text-muted-foreground">High Prob</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternRecognitionEngine;