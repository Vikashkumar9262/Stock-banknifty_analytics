import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, subtitle, loading = false }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:bg-card/80 transition-micro">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={20} className="text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={14} />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-semibold text-foreground font-mono">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default KPICard;