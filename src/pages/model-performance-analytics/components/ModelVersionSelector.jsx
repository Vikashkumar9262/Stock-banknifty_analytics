import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const ModelVersionSelector = ({ selectedVersion, onVersionChange, selectedPeriod, onPeriodChange }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const modelVersions = [
    { value: 'v2.3.1', label: 'LSTM v2.3.1 (Current)', description: 'Latest production model' },
    { value: 'v2.3.0', label: 'LSTM v2.3.0', description: 'Previous stable version' },
    { value: 'v2.2.8', label: 'LSTM v2.2.8', description: 'Legacy model for comparison' },
    { value: 'v2.1.5', label: 'LSTM v2.1.5', description: 'Baseline model' }
  ];

  const trainingPeriods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '180d', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
        <div className="w-full sm:w-64">
          <Select
            label="Model Version"
            options={modelVersions}
            value={selectedVersion}
            onChange={onVersionChange}
            className="w-full"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select
            label="Training Period"
            options={trainingPeriods}
            value={selectedPeriod}
            onChange={onPeriodChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          loading={isRefreshing}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh Data
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          title="Model Settings"
        />
      </div>
    </div>
  );
};

export default ModelVersionSelector;