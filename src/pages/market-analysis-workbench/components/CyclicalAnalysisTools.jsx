import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CyclicalAnalysisTools = () => {
  const [selectedCycle, setSelectedCycle] = useState('daily');
  const [analysisType, setAnalysisType] = useState('returns');

  const cycleTypes = [
    { id: 'daily', label: 'Daily Patterns', icon: 'Clock' },
    { id: 'weekly', label: 'Weekly Cycles', icon: 'Calendar' },
    { id: 'monthly', label: 'Monthly Trends', icon: 'CalendarDays' },
    { id: 'quarterly', label: 'Quarterly Cycles', icon: 'CalendarRange' }
  ];

  // Mock cyclical data
  const dailyPatterns = [
    { time: '09:15', avgReturn: 0.12, volume: 85, volatility: 1.8, trades: 1250 },
    { time: '09:30', avgReturn: 0.08, volume: 92, volatility: 2.1, trades: 1450 },
    { time: '10:00', avgReturn: 0.05, volume: 78, volatility: 1.6, trades: 1180 },
    { time: '10:30', avgReturn: 0.03, volume: 65, volatility: 1.4, trades: 980 },
    { time: '11:00', avgReturn: 0.02, volume: 58, volatility: 1.2, trades: 850 },
    { time: '11:30', avgReturn: 0.01, volume: 52, volatility: 1.1, trades: 780 },
    { time: '12:00', avgReturn: -0.01, volume: 48, volatility: 1.0, trades: 720 },
    { time: '12:30', avgReturn: -0.02, volume: 45, volatility: 0.9, trades: 680 },
    { time: '13:00', avgReturn: 0.01, volume: 55, volatility: 1.2, trades: 820 },
    { time: '13:30', avgReturn: 0.03, volume: 68, volatility: 1.5, trades: 1020 },
    { time: '14:00', avgReturn: 0.06, volume: 82, volatility: 1.8, trades: 1280 },
    { time: '14:30', avgReturn: 0.09, volume: 95, volatility: 2.2, trades: 1520 },
    { time: '15:00', avgReturn: 0.15, volume: 110, volatility: 2.5, trades: 1780 },
    { time: '15:15', avgReturn: 0.18, volume: 125, volatility: 2.8, trades: 2050 },
    { time: '15:25', avgReturn: 0.22, volume: 140, volatility: 3.2, trades: 2350 }
  ];

  const weeklyPatterns = [
    { day: 'Monday', avgReturn: 0.15, volume: 100, volatility: 2.1, sentiment: 68 },
    { day: 'Tuesday', avgReturn: 0.08, volume: 85, volatility: 1.8, sentiment: 72 },
    { day: 'Wednesday', avgReturn: 0.05, volume: 78, volatility: 1.6, sentiment: 70 },
    { day: 'Thursday', avgReturn: 0.12, volume: 92, volatility: 1.9, sentiment: 74 },
    { day: 'Friday', avgReturn: 0.18, volume: 110, volatility: 2.3, sentiment: 76 }
  ];

  const monthlyPatterns = [
    { period: 'Week 1', avgReturn: 0.25, volume: 95, volatility: 2.0, performance: 'strong' },
    { period: 'Week 2', avgReturn: 0.12, volume: 82, volatility: 1.7, performance: 'moderate' },
    { period: 'Week 3', avgReturn: 0.08, volume: 75, volatility: 1.5, performance: 'weak' },
    { period: 'Week 4', avgReturn: 0.18, volume: 88, volatility: 1.9, performance: 'strong' },
    { period: 'Month End', avgReturn: 0.32, volume: 105, volatility: 2.4, performance: 'very strong' }
  ];

  const quarterlyPatterns = [
    { quarter: 'Q1', avgReturn: 2.8, volume: 88, volatility: 18.5, trend: 'bullish' },
    { quarter: 'Q2', avgReturn: 1.2, volume: 75, volatility: 16.2, trend: 'neutral' },
    { quarter: 'Q3', avgReturn: -0.5, volume: 68, volatility: 19.8, trend: 'bearish' },
    { quarter: 'Q4', avgReturn: 3.5, volume: 95, volatility: 21.2, trend: 'bullish' }
  ];

  const getCurrentData = () => {
    switch (selectedCycle) {
      case 'daily': return dailyPatterns;
      case 'weekly': return weeklyPatterns;
      case 'monthly': return monthlyPatterns;
      case 'quarterly': return quarterlyPatterns;
      default: return dailyPatterns;
    }
  };

  const getXAxisKey = () => {
    switch (selectedCycle) {
      case 'daily': return 'time';
      case 'weekly': return 'day';
      case 'monthly': return 'period';
      case 'quarterly': return 'quarter';
      default: return 'time';
    }
  };

  const getYAxisKey = () => {
    switch (analysisType) {
      case 'returns': return 'avgReturn';
      case 'volume': return 'volume';
      case 'volatility': return 'volatility';
      default: return 'avgReturn';
    }
  };

  const getYAxisLabel = () => {
    switch (analysisType) {
      case 'returns': return selectedCycle === 'quarterly' ? 'Avg Return (%)' : 'Avg Return (%)';
      case 'volume': return 'Relative Volume';
      case 'volatility': return 'Volatility (%)';
      default: return 'Avg Return (%)';
    }
  };

  const getLineColor = () => {
    switch (analysisType) {
      case 'returns': return 'var(--color-primary)';
      case 'volume': return 'var(--color-warning)';
      case 'volatility': return 'var(--color-error)';
      default: return 'var(--color-primary)';
    }
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'avgReturn') {
      return [`${value?.toFixed(2)}%`, 'Average Return'];
    }
    if (name === 'volume') {
      return [`${value}%`, 'Relative Volume'];
    }
    if (name === 'volatility') {
      return [`${value?.toFixed(1)}%`, 'Volatility'];
    }
    return [value, name];
  };

  const getCycleInsights = () => {
    switch (selectedCycle) {
      case 'daily':
        return [
          { icon: 'Clock', text: 'Opening 15 minutes show highest volatility', color: 'text-warning' },
          { icon: 'TrendingUp', text: 'Best returns typically in last hour', color: 'text-success' },
          { icon: 'Activity', text: 'Lunch hour (12-1 PM) shows lowest activity', color: 'text-muted-foreground' },
          { icon: 'Zap', text: 'Pre-close surge drives volume spikes', color: 'text-primary' }
        ];
      case 'weekly':
        return [
          { icon: 'Calendar', text: 'Monday shows strong opening momentum', color: 'text-success' },
          { icon: 'TrendingUp', text: 'Friday typically ends with positive bias', color: 'text-success' },
          { icon: 'BarChart3', text: 'Mid-week consolidation is common', color: 'text-muted-foreground' },
          { icon: 'Activity', text: 'Thursday shows increased institutional activity', color: 'text-primary' }
        ];
      case 'monthly':
        return [
          { icon: 'CalendarDays', text: 'First week shows strongest performance', color: 'text-success' },
          { icon: 'TrendingDown', text: 'Third week typically weakest', color: 'text-error' },
          { icon: 'Zap', text: 'Month-end rebalancing drives volume', color: 'text-warning' },
          { icon: 'Target', text: 'Expiry week shows increased volatility', color: 'text-primary' }
        ];
      case 'quarterly':
        return [
          { icon: 'CalendarRange', text: 'Q1 and Q4 show strongest returns', color: 'text-success' },
          { icon: 'TrendingDown', text: 'Q3 historically weakest quarter', color: 'text-error' },
          { icon: 'Activity', text: 'Results season drives volatility spikes', color: 'text-warning' },
          { icon: 'BarChart3', text: 'Year-end rally effect in Q4', color: 'text-primary' }
        ];
      default:
        return [];
    }
  };

  const getPerformanceColor = (value) => {
    if (analysisType === 'returns') {
      return value > 0 ? 'text-success' : 'text-error';
    }
    return 'text-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Cyclical Analysis</h3>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {['returns', 'volume', 'volatility']?.map(type => (
              <button
                key={type}
                onClick={() => setAnalysisType(type)}
                className={`px-2 py-1 text-xs rounded transition-micro capitalize ${
                  analysisType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => console.log('Export cyclical data')}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-60px)]">
        {/* Cycle Type Selector */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Analysis Period</h4>
          <div className="space-y-2">
            {cycleTypes?.map(cycle => (
              <button
                key={cycle?.id}
                onClick={() => setSelectedCycle(cycle?.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  selectedCycle === cycle?.id
                    ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 text-foreground'
                }`}
              >
                <Icon name={cycle?.icon} size={18} />
                <span className="font-medium">{cycle?.label}</span>
              </button>
            ))}
          </div>

          {/* Key Insights */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Key Insights</h4>
            <div className="space-y-2">
              {getCycleInsights()?.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-muted/30 rounded">
                  <Icon name={insight?.icon} size={14} className={insight?.color} />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {insight?.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">
                {cycleTypes?.find(c => c?.id === selectedCycle)?.label} - {getYAxisLabel()}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="TrendingUp" size={12} />
                <span>Historical Average</span>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getCurrentData()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey={getXAxisKey()}
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                    tickFormatter={(value) => 
                      analysisType === 'returns' ? `${value?.toFixed(1)}%` : 
                      analysisType === 'volume' ? `${value}%` : 
                      `${value?.toFixed(1)}%`
                    }
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={getYAxisKey()}
                    stroke={getLineColor()}
                    strokeWidth={2}
                    dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: getLineColor() }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistics Table */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Performance Statistics</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-muted-foreground">Period</th>
                    <th className="text-right p-2 text-muted-foreground">Avg Return</th>
                    <th className="text-right p-2 text-muted-foreground">Volume</th>
                    <th className="text-right p-2 text-muted-foreground">Volatility</th>
                    <th className="text-right p-2 text-muted-foreground">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentData()?.slice(0, 5)?.map((item, index) => {
                    const periodKey = getXAxisKey();
                    const returnValue = item?.avgReturn || 0;
                    const score = (returnValue > 0 ? 'Positive' : 'Negative');
                    
                    return (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="p-2 font-medium text-foreground">{item?.[periodKey]}</td>
                        <td className={`p-2 text-right font-mono ${getPerformanceColor(returnValue)}`}>
                          {returnValue?.toFixed(2)}%
                        </td>
                        <td className="p-2 text-right font-mono text-foreground">
                          {item?.volume}%
                        </td>
                        <td className="p-2 text-right font-mono text-foreground">
                          {item?.volatility?.toFixed(1)}%
                        </td>
                        <td className={`p-2 text-right ${getPerformanceColor(returnValue)}`}>
                          {score}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyclicalAnalysisTools;