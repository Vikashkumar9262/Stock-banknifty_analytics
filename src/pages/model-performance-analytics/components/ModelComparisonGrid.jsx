import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ModelComparisonGrid = () => {
  const [sortBy, setSortBy] = useState('accuracy');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedModels, setSelectedModels] = useState([]);

  const sortOptions = [
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'mse', label: 'MSE' },
    { value: 'rmse', label: 'RMSE' },
    { value: 'mae', label: 'MAE' },
    { value: 'r2', label: 'R² Score' },
    { value: 'timestamp', label: 'Training Date' }
  ];

  const modelVersions = [
    {
      id: 'v2.3.1',
      version: 'LSTM v2.3.1',
      status: 'production',
      accuracy: 94.7,
      mse: 0.0031,
      rmse: 0.0557,
      mae: 0.0423,
      r2: 0.9847,
      trainingDate: '2025-08-30T14:30:00Z',
      deploymentDate: '2025-08-31T09:00:00Z',
      dataPoints: 125000,
      epochs: 847,
      trainingTime: '4h 23m',
      features: 12,
      parameters: '2.1M'
    },
    {
      id: 'v2.3.0',
      version: 'LSTM v2.3.0',
      status: 'stable',
      accuracy: 93.2,
      mse: 0.0038,
      rmse: 0.0617,
      mae: 0.0456,
      r2: 0.9821,
      trainingDate: '2025-08-25T16:45:00Z',
      deploymentDate: '2025-08-26T10:15:00Z',
      dataPoints: 120000,
      epochs: 756,
      trainingTime: '3h 58m',
      features: 11,
      parameters: '1.9M'
    },
    {
      id: 'v2.2.8',
      version: 'LSTM v2.2.8',
      status: 'archived',
      accuracy: 91.8,
      mse: 0.0045,
      rmse: 0.0671,
      mae: 0.0489,
      r2: 0.9798,
      trainingDate: '2025-08-20T12:20:00Z',
      deploymentDate: '2025-08-21T08:30:00Z',
      dataPoints: 115000,
      epochs: 692,
      trainingTime: '3h 34m',
      features: 10,
      parameters: '1.7M'
    },
    {
      id: 'v2.2.5',
      version: 'LSTM v2.2.5',
      status: 'archived',
      accuracy: 90.4,
      mse: 0.0052,
      rmse: 0.0721,
      mae: 0.0512,
      r2: 0.9776,
      trainingDate: '2025-08-15T09:15:00Z',
      deploymentDate: '2025-08-16T11:45:00Z',
      dataPoints: 110000,
      epochs: 634,
      trainingTime: '3h 12m',
      features: 9,
      parameters: '1.5M'
    },
    {
      id: 'v2.1.5',
      version: 'LSTM v2.1.5',
      status: 'baseline',
      accuracy: 88.9,
      mse: 0.0061,
      rmse: 0.0781,
      mae: 0.0547,
      r2: 0.9751,
      trainingDate: '2025-08-10T15:30:00Z',
      deploymentDate: '2025-08-11T13:20:00Z',
      dataPoints: 105000,
      epochs: 578,
      trainingTime: '2h 56m',
      features: 8,
      parameters: '1.3M'
    },
    {
      id: 'v2.0.3',
      version: 'LSTM v2.0.3',
      status: 'deprecated',
      accuracy: 86.7,
      mse: 0.0074,
      rmse: 0.0860,
      mae: 0.0598,
      r2: 0.9718,
      trainingDate: '2025-08-05T11:10:00Z',
      deploymentDate: '2025-08-06T14:50:00Z',
      dataPoints: 100000,
      epochs: 512,
      trainingTime: '2h 41m',
      features: 7,
      parameters: '1.1M'
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'production':
        return { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' };
      case 'stable':
        return { color: 'text-primary', bg: 'bg-primary/10', icon: 'Circle' };
      case 'archived':
        return { color: 'text-warning', bg: 'bg-warning/10', icon: 'Archive' };
      case 'baseline':
        return { color: 'text-secondary', bg: 'bg-secondary/10', icon: 'Target' };
      case 'deprecated':
        return { color: 'text-muted-foreground', bg: 'bg-muted/10', icon: 'XCircle' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted/10', icon: 'Circle' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedModels = [...modelVersions]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];
    
    if (sortBy === 'timestamp' || sortBy === 'trainingDate') {
      aValue = new Date(a.trainingDate)?.getTime();
      bValue = new Date(b.trainingDate)?.getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleModelSelect = (modelId) => {
    setSelectedModels(prev => 
      prev?.includes(modelId) 
        ? prev?.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on models:`, selectedModels);
    // Implement bulk actions here
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="border-b border-border p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Model Performance Comparison</h3>
            <p className="text-sm text-muted-foreground">Compare metrics across different model versions</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-32"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              />
            </div>

            {selectedModels?.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedModels?.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('compare')}
                  iconName="GitCompare"
                >
                  Compare
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                  iconName="Download"
                >
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      setSelectedModels(modelVersions?.map(m => m?.id));
                    } else {
                      setSelectedModels([]);
                    }
                  }}
                />
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Model Version</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Accuracy</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">MSE</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">RMSE</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">MAE</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">R²</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Training Date</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Epochs</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedModels?.map((model) => {
              const statusConfig = getStatusConfig(model?.status);
              const isSelected = selectedModels?.includes(model?.id);
              
              return (
                <tr 
                  key={model?.id} 
                  className={`border-b border-border hover:bg-muted/10 transition-micro ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      checked={isSelected}
                      onChange={() => handleModelSelect(model?.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Icon name="Brain" size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{model?.version}</p>
                        <p className="text-xs text-muted-foreground">{model?.parameters} params</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.bg} ${statusConfig?.color}`}>
                      <Icon name={statusConfig?.icon} size={12} />
                      <span className="capitalize">{model?.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono font-medium text-foreground">{model?.accuracy}%</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono text-muted-foreground">{model?.mse?.toFixed(4)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono text-muted-foreground">{model?.rmse?.toFixed(4)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono text-muted-foreground">{model?.mae?.toFixed(4)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono text-muted-foreground">{model?.r2?.toFixed(4)}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-foreground">{formatDate(model?.trainingDate)}</p>
                      <p className="text-xs text-muted-foreground">{model?.trainingTime}</p>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono text-muted-foreground">{model?.epochs}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        title="View Details"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        title="Download Model"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreHorizontal"
                        title="More Actions"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelComparisonGrid;