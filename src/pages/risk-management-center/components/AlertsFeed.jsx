import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsFeed = () => {
  const [alerts] = useState([
    {
      id: 1,
      severity: 'critical',
      title: 'VaR Threshold Breach',
      message: 'Portfolio VaR exceeded 2.5% threshold at 2.8%',
      timestamp: new Date(Date.now() - 300000),
      category: 'risk',
      actionRequired: true
    },
    {
      id: 2,
      severity: 'high',
      title: 'Correlation Spike',
      message: 'Banking sector correlation increased to 0.85',
      timestamp: new Date(Date.now() - 900000),
      category: 'correlation',
      actionRequired: false
    },
    {
      id: 3,
      severity: 'medium',
      title: 'Volatility Alert',
      message: 'BankNifty volatility above 20-day average',
      timestamp: new Date(Date.now() - 1800000),
      category: 'volatility',
      actionRequired: false
    },
    {
      id: 4,
      severity: 'low',
      title: 'Position Update',
      message: 'HDFC Bank position increased by 2%',
      timestamp: new Date(Date.now() - 3600000),
      category: 'position',
      actionRequired: false
    },
    {
      id: 5,
      severity: 'high',
      title: 'Drawdown Warning',
      message: 'Maximum drawdown approaching 15% limit',
      timestamp: new Date(Date.now() - 5400000),
      category: 'drawdown',
      actionRequired: true
    }
  ]);

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/30',
          icon: 'AlertTriangle'
        };
      case 'high':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          icon: 'AlertCircle'
        };
      case 'medium':
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          icon: 'Info'
        };
      case 'low':
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/30',
          icon: 'Bell'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/30',
          icon: 'Bell'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const handleAlertAction = (alertId, action) => {
    console.log(`Alert ${alertId}: ${action}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Settings">
              Configure
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {alerts?.map((alert) => {
          const config = getSeverityConfig(alert?.severity);
          
          return (
            <div
              key={alert?.id}
              className={`p-3 rounded-lg border transition-smooth hover:shadow-sm ${config?.bgColor} ${config?.borderColor}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 ${config?.color}`}>
                  <Icon name={config?.icon} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {alert?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTimestamp(alert?.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {alert?.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config?.color} ${config?.bgColor}`}>
                        {alert?.severity?.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {alert?.category}
                      </span>
                    </div>
                    
                    {alert?.actionRequired && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleAlertAction(alert?.id, 'acknowledge')}
                          className="text-xs"
                        >
                          Ack
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleAlertAction(alert?.id, 'resolve')}
                          className="text-xs"
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" fullWidth iconName="Archive">
          View All Alerts
        </Button>
      </div>
    </div>
  );
};

export default AlertsFeed;