import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TechnicalIndicatorsPanel = ({ onIndicatorToggle, activeIndicators = [] }) => {
  const [expandedCategory, setExpandedCategory] = useState('momentum');

  const indicatorCategories = {
    momentum: {
      label: 'Momentum Oscillators',
      icon: 'TrendingUp',
      indicators: [
        {
          id: 'rsi',
          name: 'RSI',
          fullName: 'Relative Strength Index',
          value: 67.8,
          signal: 'neutral',
          period: 14,
          overbought: 70,
          oversold: 30
        },
        {
          id: 'stochastic',
          name: 'Stochastic',
          fullName: 'Stochastic Oscillator',
          value: 72.3,
          signal: 'overbought',
          period: 14,
          kPeriod: 3,
          dPeriod: 3
        },
        {
          id: 'williams',
          name: 'Williams %R',
          fullName: 'Williams Percent Range',
          value: -23.4,
          signal: 'bullish',
          period: 14
        }
      ]
    },
    trend: {
      label: 'Trend Indicators',
      icon: 'BarChart3',
      indicators: [
        {
          id: 'macd',
          name: 'MACD',
          fullName: 'Moving Average Convergence Divergence',
          value: 245.67,
          signal: 'bullish',
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9
        },
        {
          id: 'adx',
          name: 'ADX',
          fullName: 'Average Directional Index',
          value: 34.2,
          signal: 'trending',
          period: 14
        },
        {
          id: 'parabolic',
          name: 'Parabolic SAR',
          fullName: 'Parabolic Stop and Reverse',
          value: 48234.56,
          signal: 'bullish',
          acceleration: 0.02,
          maximum: 0.2
        }
      ]
    },
    volume: {
      label: 'Volume Analysis',
      icon: 'BarChart2',
      indicators: [
        {
          id: 'obv',
          name: 'OBV',
          fullName: 'On-Balance Volume',
          value: 1234567,
          signal: 'bullish',
          trend: 'increasing'
        },
        {
          id: 'adline',
          name: 'A/D Line',
          fullName: 'Accumulation/Distribution Line',
          value: 987654,
          signal: 'neutral',
          trend: 'sideways'
        },
        {
          id: 'cmf',
          name: 'CMF',
          fullName: 'Chaikin Money Flow',
          value: 0.15,
          signal: 'bullish',
          period: 20
        }
      ]
    }
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'bullish': return 'text-success';
      case 'bearish': return 'text-error';
      case 'overbought': return 'text-warning';
      case 'oversold': return 'text-warning';
      case 'trending': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'bullish': return 'TrendingUp';
      case 'bearish': return 'TrendingDown';
      case 'overbought': return 'AlertTriangle';
      case 'oversold': return 'AlertTriangle';
      case 'trending': return 'Activity';
      default: return 'Minus';
    }
  };

  const formatValue = (value, indicator) => {
    if (indicator?.id === 'rsi' || indicator?.id === 'stochastic' || indicator?.id === 'adx') {
      return value?.toFixed(1);
    }
    if (indicator?.id === 'williams') {
      return value?.toFixed(1) + '%';
    }
    if (indicator?.id === 'cmf') {
      return value?.toFixed(2);
    }
    if (indicator?.id === 'parabolic') {
      return '₹' + value?.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    }
    return value?.toLocaleString('en-IN');
  };

  const handleIndicatorToggle = (indicatorId) => {
    onIndicatorToggle?.(indicatorId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Technical Indicators</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          onClick={() => console.log('Open indicator settings')}
        >
          Configure
        </Button>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {Object.entries(indicatorCategories)?.map(([categoryKey, category]) => (
          <div key={categoryKey} className="border border-border rounded-lg">
            <button
              onClick={() => setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-micro rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <Icon name={category?.icon} size={18} className="text-primary" />
                <span className="font-medium text-foreground">{category?.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({category?.indicators?.length})
                </span>
              </div>
              <Icon 
                name={expandedCategory === categoryKey ? 'ChevronUp' : 'ChevronDown'} 
                size={16} 
                className="text-muted-foreground"
              />
            </button>

            {expandedCategory === categoryKey && (
              <div className="border-t border-border">
                {category?.indicators?.map((indicator) => {
                  const isActive = activeIndicators?.includes(indicator?.id);
                  
                  return (
                    <div key={indicator?.id} className="p-3 border-b border-border last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleIndicatorToggle(indicator?.id)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-micro ${
                              isActive 
                                ? 'bg-primary border-primary' :'border-muted-foreground hover:border-primary'
                            }`}
                          >
                            {isActive && <Icon name="Check" size={10} color="white" />}
                          </button>
                          <span className="font-medium text-sm text-foreground">
                            {indicator?.name}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Icon 
                              name={getSignalIcon(indicator?.signal)} 
                              size={12} 
                              className={getSignalColor(indicator?.signal)}
                            />
                            <span className={`text-xs font-medium ${getSignalColor(indicator?.signal)}`}>
                              {indicator?.signal?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-mono text-foreground">
                          {formatValue(indicator?.value, indicator)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {indicator?.fullName}
                      </div>
                      {/* Indicator-specific parameters */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {indicator?.period && (
                          <span className="px-2 py-1 bg-muted/50 rounded text-muted-foreground">
                            Period: {indicator?.period}
                          </span>
                        )}
                        {indicator?.overbought && (
                          <span className="px-2 py-1 bg-warning/10 text-warning rounded">
                            OB: {indicator?.overbought}
                          </span>
                        )}
                        {indicator?.oversold && (
                          <span className="px-2 py-1 bg-warning/10 text-warning rounded">
                            OS: {indicator?.oversold}
                          </span>
                        )}
                        {indicator?.fastPeriod && (
                          <span className="px-2 py-1 bg-muted/50 rounded text-muted-foreground">
                            Fast: {indicator?.fastPeriod}
                          </span>
                        )}
                        {indicator?.slowPeriod && (
                          <span className="px-2 py-1 bg-muted/50 rounded text-muted-foreground">
                            Slow: {indicator?.slowPeriod}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            onClick={() => console.log('Reset indicators')}
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            onClick={() => console.log('Save preset')}
            className="flex-1"
          >
            Save Preset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicatorsPanel;