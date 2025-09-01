import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const RiskControlPanel = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState('banknifty-main');
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [varThreshold, setVarThreshold] = useState('2.5');
  const [drawdownLimit, setDrawdownLimit] = useState('15');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoRebalance, setAutoRebalance] = useState(false);

  const portfolioOptions = [
    { value: 'banknifty-main', label: 'BankNifty Main Portfolio' },
    { value: 'banknifty-hedge', label: 'BankNifty Hedge Fund' },
    { value: 'banking-sector', label: 'Banking Sector Focus' },
    { value: 'diversified', label: 'Diversified Portfolio' }
  ];

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'aggressive', label: 'Aggressive' }
  ];

  const handleSaveSettings = () => {
    console.log('Saving risk settings:', {
      selectedPortfolio,
      riskTolerance,
      varThreshold,
      drawdownLimit,
      alertsEnabled,
      autoRebalance
    });
  };

  const handleEmergencyStop = () => {
    console.log('Emergency stop triggered');
  };

  const handleRebalance = () => {
    console.log('Manual rebalance triggered');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Risk Control Panel</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle" />
          <span className="text-sm text-muted-foreground">Active</span>
        </div>
      </div>
      <div className="space-y-6">
        {/* Portfolio Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Portfolio Configuration</h4>
          
          <Select
            label="Active Portfolio"
            options={portfolioOptions}
            value={selectedPortfolio}
            onChange={setSelectedPortfolio}
            description="Select the portfolio to monitor and manage"
          />

          <Select
            label="Risk Tolerance"
            options={riskToleranceOptions}
            value={riskTolerance}
            onChange={setRiskTolerance}
            description="Defines the overall risk appetite for the portfolio"
          />
        </div>

        {/* Risk Thresholds */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Risk Thresholds</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="VaR Threshold (%)"
              type="number"
              value={varThreshold}
              onChange={(e) => setVarThreshold(e?.target?.value)}
              description="Maximum acceptable Value at Risk"
              min="0"
              max="10"
              step="0.1"
            />

            <Input
              label="Max Drawdown (%)"
              type="number"
              value={drawdownLimit}
              onChange={(e) => setDrawdownLimit(e?.target?.value)}
              description="Maximum acceptable portfolio drawdown"
              min="0"
              max="50"
              step="1"
            />
          </div>
        </div>

        {/* Alert Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Alert & Automation</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Bell" size={16} className="text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">Real-time Alerts</div>
                  <div className="text-xs text-muted-foreground">Get notified when thresholds are breached</div>
                </div>
              </div>
              <button
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`w-10 h-6 rounded-full transition-smooth ${
                  alertsEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-smooth transform ${
                  alertsEnabled ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="RefreshCw" size={16} className="text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">Auto Rebalancing</div>
                  <div className="text-xs text-muted-foreground">Automatically rebalance when risk limits are exceeded</div>
                </div>
              </div>
              <button
                onClick={() => setAutoRebalance(!autoRebalance)}
                className={`w-10 h-6 rounded-full transition-smooth ${
                  autoRebalance ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-smooth transform ${
                  autoRebalance ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleRebalance}
              iconName="RotateCcw"
              className="justify-start"
            >
              Manual Rebalance
            </Button>
            
            <Button
              variant="outline"
              onClick={() => console.log('Generate report')}
              iconName="FileText"
              className="justify-start"
            >
              Generate Report
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleEmergencyStop}
              iconName="Square"
              className="justify-start"
            >
              Emergency Stop
            </Button>
          </div>
        </div>

        {/* Save Settings */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date()?.toLocaleString()}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                Reset to Default
              </Button>
              <Button onClick={handleSaveSettings} iconName="Save">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskControlPanel;