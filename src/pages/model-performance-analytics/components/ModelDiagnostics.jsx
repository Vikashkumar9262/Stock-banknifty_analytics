import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ModelDiagnostics = () => {
  const [activeTab, setActiveTab] = useState('features');

  const featureImportance = [
    { feature: 'Close Price (t-1)', importance: 0.342, change: '+0.012' },
    { feature: 'Volume', importance: 0.189, change: '-0.003' },
    { feature: 'RSI', importance: 0.156, change: '+0.008' },
    { feature: 'MACD Signal', importance: 0.134, change: '+0.005' },
    { feature: 'Bollinger Upper', importance: 0.098, change: '-0.001' },
    { feature: 'ATR', importance: 0.081, change: '+0.002' }
  ];

  const hyperparameters = [
    { parameter: 'Learning Rate', current: '0.001', optimal: '0.0008', status: 'optimizing' },
    { parameter: 'Batch Size', current: '64', optimal: '128', status: 'optimal' },
    { parameter: 'Hidden Units', current: '256', optimal: '256', status: 'optimal' },
    { parameter: 'Dropout Rate', current: '0.2', optimal: '0.15', status: 'suboptimal' },
    { parameter: 'Sequence Length', current: '60', optimal: '60', status: 'optimal' },
    { parameter: 'L2 Regularization', current: '0.001', optimal: '0.0005', status: 'optimizing' }
  ];

  const correlationData = [
    { pair: 'Close-Volume', correlation: -0.23, strength: 'weak' },
    { pair: 'RSI-MACD', correlation: 0.67, strength: 'strong' },
    { pair: 'BB_Upper-ATR', correlation: 0.45, strength: 'moderate' },
    { pair: 'Volume-ATR', correlation: 0.34, strength: 'moderate' },
    { pair: 'Close-RSI', correlation: -0.12, strength: 'weak' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-success';
      case 'suboptimal': return 'text-warning';
      case 'optimizing': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimal': return 'CheckCircle';
      case 'suboptimal': return 'AlertTriangle';
      case 'optimizing': return 'RefreshCw';
      default: return 'Circle';
    }
  };

  const getCorrelationColor = (correlation) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'text-error';
    if (abs >= 0.5) return 'text-warning';
    if (abs >= 0.3) return 'text-primary';
    return 'text-muted-foreground';
  };

  const tabs = [
    { id: 'features', label: 'Feature Importance', icon: 'BarChart3' },
    { id: 'hyperparams', label: 'Hyperparameters', icon: 'Settings' },
    { id: 'correlation', label: 'Correlations', icon: 'Network' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Model Diagnostics</h3>
        
        <div className="flex space-x-1 bg-muted/20 rounded-lg p-1">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              iconName={tab?.icon}
              iconPosition="left"
              className="flex-1 justify-center"
            >
              <span className="hidden sm:inline">{tab?.label}</span>
              <span className="sm:hidden">{tab?.icon}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {activeTab === 'features' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-foreground">Feature Importance Rankings</h4>
              <Button variant="ghost" size="sm" iconName="Download" title="Export Data" />
            </div>
            
            {featureImportance?.map((item, index) => (
              <div key={item?.feature} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item?.feature}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-smooth"
                          style={{ width: `${item?.importance * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{(item?.importance * 100)?.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div className={`text-xs font-medium ${item?.change?.startsWith('+') ? 'text-success' : 'text-error'}`}>
                  {item?.change}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hyperparams' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-foreground">Hyperparameter Optimization</h4>
              <Button variant="ghost" size="sm" iconName="Play" title="Run Optimization" />
            </div>
            
            {hyperparameters?.map((param) => (
              <div key={param?.parameter} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getStatusIcon(param?.status)} 
                    size={16} 
                    className={getStatusColor(param?.status)}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{param?.parameter}</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {param?.current} | Optimal: {param?.optimal}
                    </p>
                  </div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  param?.status === 'optimal' ? 'bg-success/10 text-success' :
                  param?.status === 'suboptimal'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                }`}>
                  {param?.status}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'correlation' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-foreground">Feature Correlations</h4>
              <Button variant="ghost" size="sm" iconName="Maximize2" title="Expand Heatmap" />
            </div>
            
            {correlationData?.map((item) => (
              <div key={item?.pair} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-muted/20 flex items-center justify-center">
                    <Icon name="GitBranch" size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item?.pair}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item?.strength} correlation</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-mono font-medium ${getCorrelationColor(item?.correlation)}`}>
                    {item?.correlation > 0 ? '+' : ''}{item?.correlation?.toFixed(2)}
                  </div>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full rounded-full transition-smooth ${
                        Math.abs(item?.correlation) >= 0.7 ? 'bg-error' :
                        Math.abs(item?.correlation) >= 0.5 ? 'bg-warning' :
                        Math.abs(item?.correlation) >= 0.3 ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                      style={{ width: `${Math.abs(item?.correlation) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelDiagnostics;