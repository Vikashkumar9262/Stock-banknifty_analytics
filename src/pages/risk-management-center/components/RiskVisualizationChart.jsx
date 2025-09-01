import React, { useState } from 'react';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RiskVisualizationChart = () => {
  const [activeView, setActiveView] = useState('volatility');
  const [timeframe, setTimeframe] = useState('1M');

  const volatilityData = [
    { date: '2025-08-01', volatility: 18.5, var: 2.1, drawdown: -5.2, exposure: 85 },
    { date: '2025-08-05', volatility: 22.3, var: 2.4, drawdown: -7.8, exposure: 82 },
    { date: '2025-08-10', volatility: 19.7, var: 2.2, drawdown: -6.1, exposure: 88 },
    { date: '2025-08-15', volatility: 25.1, var: 2.8, drawdown: -9.3, exposure: 79 },
    { date: '2025-08-20', volatility: 21.4, var: 2.5, drawdown: -8.1, exposure: 83 },
    { date: '2025-08-25', volatility: 17.9, var: 2.0, drawdown: -4.7, exposure: 91 },
    { date: '2025-08-30', volatility: 20.2, var: 2.3, drawdown: -6.5, exposure: 86 }
  ];

  const correlationData = [
    { sector: 'Banking', correlation: 0.85, risk: 'High' },
    { sector: 'Financial Services', correlation: 0.72, risk: 'Medium' },
    { sector: 'Insurance', correlation: 0.68, risk: 'Medium' },
    { sector: 'NBFC', correlation: 0.79, risk: 'High' },
    { sector: 'Housing Finance', correlation: 0.74, risk: 'Medium' }
  ];

  const exposureData = [
    { name: 'HDFC Bank', value: 18.5, risk: 'low' },
    { name: 'ICICI Bank', value: 16.2, risk: 'medium' },
    { name: 'Axis Bank', value: 14.8, risk: 'medium' },
    { name: 'SBI', value: 12.3, risk: 'high' },
    { name: 'Kotak Bank', value: 11.7, risk: 'low' },
    { name: 'IndusInd Bank', value: 9.4, risk: 'high' },
    { name: 'Others', value: 17.1, risk: 'medium' }
  ];

  const viewOptions = [
    { id: 'volatility', label: 'Volatility Surface', icon: 'TrendingUp' },
    { id: 'correlation', label: 'Correlation Matrix', icon: 'Grid3X3' },
    { id: 'exposure', label: 'Exposure Breakdown', icon: 'PieChart' }
  ];

  const timeframeOptions = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#64748B';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="text-popover-foreground font-medium">
                {typeof entry?.value === 'number' ? entry?.value?.toFixed(2) : entry?.value}
                {entry?.dataKey === 'volatility' && '%'}
                {entry?.dataKey === 'var' && '%'}
                {entry?.dataKey === 'drawdown' && '%'}
                {entry?.dataKey === 'exposure' && '%'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderVolatilityChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={volatilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
        />
        <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="volatility"
          fill="var(--color-primary)"
          fillOpacity={0.1}
          stroke="var(--color-primary)"
          strokeWidth={2}
          name="Volatility (%)"
        />
        <Line
          type="monotone"
          dataKey="var"
          stroke="var(--color-warning)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
          name="VaR (%)"
        />
        <Bar
          dataKey="drawdown"
          fill="var(--color-error)"
          fillOpacity={0.7}
          name="Max Drawdown (%)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderCorrelationMatrix = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {correlationData?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Building2" size={16} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{item?.sector}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{item?.correlation}</div>
                <div className={`text-xs ${
                  item?.risk === 'High' ? 'text-error' : 
                  item?.risk === 'Medium' ? 'text-warning' : 'text-success'
                }`}>
                  {item?.risk} Risk
                </div>
              </div>
              <div 
                className="w-16 h-2 rounded-full bg-muted"
                style={{
                  background: `linear-gradient(to right, var(--color-success) 0%, var(--color-warning) 50%, var(--color-error) 100%)`
                }}
              >
                <div 
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${item?.correlation * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExposureBreakdown = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        {exposureData?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getRiskColor(item?.risk) }}
              />
              <span className="text-sm font-medium text-foreground">{item?.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{item?.value}%</div>
              <div className="text-xs text-muted-foreground capitalize">{item?.risk} risk</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={exposureData}>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload?.length) {
                  const data = payload?.[0]?.payload;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium text-popover-foreground">{data?.name}</p>
                      <p className="text-xs text-muted-foreground">Exposure: {data?.value}%</p>
                      <p className="text-xs capitalize" style={{ color: getRiskColor(data?.risk) }}>
                        {data?.risk} Risk
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={4}>
              {exposureData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry?.risk)} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Risk Visualization</h3>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            {viewOptions?.map((option) => (
              <Button
                key={option?.id}
                variant={activeView === option?.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView(option?.id)}
                iconName={option?.icon}
                className="text-xs"
              >
                {option?.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
            {timeframeOptions?.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium rounded transition-micro ${
                  timeframe === tf
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="min-h-[400px]">
        {activeView === 'volatility' && renderVolatilityChart()}
        {activeView === 'correlation' && renderCorrelationMatrix()}
        {activeView === 'exposure' && renderExposureBreakdown()}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="RefreshCw" size={12} />
              <span>Auto-refresh: 5min</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="ghost" size="sm" iconName="Maximize2">
              Fullscreen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskVisualizationChart;