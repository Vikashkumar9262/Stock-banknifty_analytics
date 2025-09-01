import React from 'react';
import Button from '../../../components/ui/Button';

const MetricToggle = ({ activeMetrics, onMetricToggle }) => {
  const metrics = [
    { id: 'mse', label: 'MSE', description: 'Mean Squared Error' },
    { id: 'rmse', label: 'RMSE', description: 'Root Mean Squared Error' },
    { id: 'mae', label: 'MAE', description: 'Mean Absolute Error' },
    { id: 'r2', label: 'R²', description: 'R-squared Score' },
    { id: 'mape', label: 'MAPE', description: 'Mean Absolute Percentage Error' },
    { id: 'directional', label: 'Directional', description: 'Directional Accuracy' }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-card border border-border rounded-lg">
      <div className="w-full mb-2">
        <h3 className="text-sm font-medium text-foreground">Performance Metrics</h3>
        <p className="text-xs text-muted-foreground">Toggle metrics to display in charts</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {metrics?.map((metric) => (
          <Button
            key={metric?.id}
            variant={activeMetrics?.includes(metric?.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onMetricToggle(metric?.id)}
            title={metric?.description}
            className="transition-smooth"
          >
            {metric?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MetricToggle;