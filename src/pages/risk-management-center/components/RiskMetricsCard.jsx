import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskMetricsCard = ({ title, value, change, changeType, threshold, icon, unit = '', description }) => {
  const isBreached = threshold && Math.abs(parseFloat(value)) > threshold;
  const changeColor = changeType === 'positive' ? 'text-success' : changeType === 'negative' ? 'text-error' : 'text-muted-foreground';
  
  return (
    <div className={`bg-card border rounded-lg p-6 transition-smooth hover:shadow-lg ${isBreached ? 'border-error/50 bg-error/5' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isBreached ? 'bg-error/10' : 'bg-primary/10'}`}>
            <Icon name={icon} size={20} className={isBreached ? 'text-error' : 'text-primary'} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground/80 mt-1">{description}</p>
            )}
          </div>
        </div>
        {isBreached && (
          <div className="flex items-center space-x-1 text-error">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-xs font-medium">BREACH</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-semibold ${isBreached ? 'text-error' : 'text-foreground'}`}>
            {value}{unit}
          </span>
          {change && (
            <div className={`flex items-center space-x-1 ${changeColor}`}>
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={14} 
              />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        
        {threshold && (
          <div className="text-xs text-muted-foreground">
            Threshold: {threshold}{unit}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskMetricsCard;