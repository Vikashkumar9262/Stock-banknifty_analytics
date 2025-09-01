import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsCards = () => {
  const metricsData = [
    {
      id: 'accuracy',
      title: 'Model Accuracy',
      value: '94.7%',
      change: '+2.3%',
      trend: 'up',
      sparklineData: [
        { value: 92.1 }, { value: 92.8 }, { value: 93.2 }, { value: 93.9 },
        { value: 94.1 }, { value: 94.5 }, { value: 94.7 }
      ],
      icon: 'Target',
      color: 'text-success'
    },
    {
      id: 'confidence',
      title: 'Prediction Confidence',
      value: '87.2%',
      change: '+1.8%',
      trend: 'up',
      sparklineData: [
        { value: 85.1 }, { value: 85.8 }, { value: 86.2 }, { value: 86.9 },
        { value: 87.1 }, { value: 87.0 }, { value: 87.2 }
      ],
      icon: 'TrendingUp',
      color: 'text-primary'
    },
    {
      id: 'convergence',
      title: 'Training Convergence',
      value: 'Stable',
      change: 'Epoch 847',
      trend: 'stable',
      sparklineData: [
        { value: 0.045 }, { value: 0.041 }, { value: 0.038 }, { value: 0.035 },
        { value: 0.033 }, { value: 0.032 }, { value: 0.031 }
      ],
      icon: 'Activity',
      color: 'text-success'
    },
    {
      id: 'quality',
      title: 'Data Quality Score',
      value: '98.9%',
      change: '-0.1%',
      trend: 'down',
      sparklineData: [
        { value: 99.1 }, { value: 99.0 }, { value: 98.9 }, { value: 99.0 },
        { value: 98.8 }, { value: 98.9 }, { value: 98.9 }
      ],
      icon: 'Database',
      color: 'text-warning'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      case 'stable': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {metricsData?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-sm transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
              <Icon name={metric?.icon} size={20} className={metric?.color} />
            </div>
            <div className="h-8 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric?.sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{metric?.title}</h3>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-foreground">{metric?.value}</span>
              <div className={`flex items-center space-x-1 ${getTrendColor(metric?.trend)}`}>
                <Icon name={getTrendIcon(metric?.trend)} size={14} />
                <span className="text-sm font-medium">{metric?.change}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetricsCards;