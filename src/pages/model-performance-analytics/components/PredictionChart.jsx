import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceLine } from 'recharts';
import Button from '../../../components/ui/Button';


const PredictionChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [showErrorBands, setShowErrorBands] = useState(true);
  const [showAccuracyZones, setShowAccuracyZones] = useState(false);

  const timeframes = [
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '3M', label: '3M' },
    { id: '6M', label: '6M' },
    { id: '1Y', label: '1Y' }
  ];

  // Mock data for actual vs predicted prices
  const chartData = [
    { date: '2025-08-01', actual: 51250, predicted: 51180, upperBound: 51380, lowerBound: 50980, accuracy: 94.2 },
    { date: '2025-08-02', actual: 51420, predicted: 51390, upperBound: 51590, lowerBound: 51190, accuracy: 95.1 },
    { date: '2025-08-03', actual: 51180, predicted: 51220, upperBound: 51420, lowerBound: 51020, accuracy: 93.8 },
    { date: '2025-08-04', actual: 51680, predicted: 51650, upperBound: 51850, lowerBound: 51450, accuracy: 96.2 },
    { date: '2025-08-05', actual: 51890, predicted: 51920, upperBound: 52120, lowerBound: 51720, accuracy: 95.7 },
    { date: '2025-08-06', actual: 51750, predicted: 51780, upperBound: 51980, lowerBound: 51580, accuracy: 94.9 },
    { date: '2025-08-07', actual: 52100, predicted: 52080, upperBound: 52280, lowerBound: 51880, accuracy: 95.8 },
    { date: '2025-08-08', actual: 52350, predicted: 52320, upperBound: 52520, lowerBound: 52120, accuracy: 96.1 },
    { date: '2025-08-09', actual: 52180, predicted: 52210, upperBound: 52410, lowerBound: 52010, accuracy: 94.7 },
    { date: '2025-08-10', actual: 52450, predicted: 52480, upperBound: 52680, lowerBound: 52280, accuracy: 95.3 },
    { date: '2025-08-11', actual: 52680, predicted: 52650, upperBound: 52850, lowerBound: 52450, accuracy: 96.0 },
    { date: '2025-08-12', actual: 52520, predicted: 52540, upperBound: 52740, lowerBound: 52340, accuracy: 95.2 },
    { date: '2025-08-13', actual: 52780, predicted: 52750, upperBound: 52950, lowerBound: 52550, accuracy: 95.9 },
    { date: '2025-08-14', actual: 52950, predicted: 52980, upperBound: 53180, lowerBound: 52780, accuracy: 94.8 },
    { date: '2025-08-15', actual: 53120, predicted: 53100, upperBound: 53300, lowerBound: 52900, accuracy: 96.3 },
    { date: '2025-08-16', actual: 52890, predicted: 52920, upperBound: 53120, lowerBound: 52720, accuracy: 95.1 },
    { date: '2025-08-17', actual: 53180, predicted: 53150, upperBound: 53350, lowerBound: 52950, accuracy: 95.7 },
    { date: '2025-08-18', actual: 53350, predicted: 53380, upperBound: 53580, lowerBound: 53180, accuracy: 94.9 },
    { date: '2025-08-19', actual: 53520, predicted: 53490, upperBound: 53690, lowerBound: 53290, accuracy: 96.1 },
    { date: '2025-08-20', actual: 53680, predicted: 53720, upperBound: 53920, lowerBound: 53520, accuracy: 95.4 },
    { date: '2025-08-21', actual: 53450, predicted: 53480, upperBound: 53680, lowerBound: 53280, accuracy: 95.8 },
    { date: '2025-08-22', actual: 53720, predicted: 53690, upperBound: 53890, lowerBound: 53490, accuracy: 96.2 },
    { date: '2025-08-23', actual: 53890, predicted: 53920, upperBound: 54120, lowerBound: 53720, accuracy: 94.7 },
    { date: '2025-08-24', actual: 54050, predicted: 54080, upperBound: 54280, lowerBound: 53880, accuracy: 95.5 },
    { date: '2025-08-25', actual: 53920, predicted: 53950, upperBound: 54150, lowerBound: 53750, accuracy: 95.9 },
    { date: '2025-08-26', actual: 54180, predicted: 54150, upperBound: 54350, lowerBound: 53950, accuracy: 96.0 },
    { date: '2025-08-27', actual: 54350, predicted: 54380, upperBound: 54580, lowerBound: 54180, accuracy: 94.8 },
    { date: '2025-08-28', actual: 54520, predicted: 54490, upperBound: 54690, lowerBound: 54290, accuracy: 95.6 },
    { date: '2025-08-29', actual: 54680, predicted: 54720, upperBound: 54920, lowerBound: 54520, accuracy: 95.2 },
    { date: '2025-08-30', actual: 54850, predicted: 54820, upperBound: 55020, lowerBound: 54620, accuracy: 96.1 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Actual:</span>
              <span className="text-sm font-mono text-foreground">₹{data?.actual?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Predicted:</span>
              <span className="text-sm font-mono text-primary">₹{data?.predicted?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Accuracy:</span>
              <span className="text-sm font-mono text-success">{data?.accuracy}%</span>
            </div>
            {showErrorBands && (
              <>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-xs text-muted-foreground">Upper:</span>
                  <span className="text-sm font-mono text-muted-foreground">₹{data?.upperBound?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-xs text-muted-foreground">Lower:</span>
                  <span className="text-sm font-mono text-muted-foreground">₹{data?.lowerBound?.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Actual vs Predicted Prices</h3>
          <p className="text-sm text-muted-foreground">LSTM model performance with confidence intervals</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/20 rounded-lg p-1">
            {timeframes?.map((timeframe) => (
              <Button
                key={timeframe?.id}
                variant={selectedTimeframe === timeframe?.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe?.id)}
                className="h-8 px-3"
              >
                {timeframe?.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showErrorBands ? "default" : "outline"}
              size="sm"
              onClick={() => setShowErrorBands(!showErrorBands)}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Error Bands
            </Button>
            
            <Button
              variant={showAccuracyZones ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAccuracyZones(!showAccuracyZones)}
              iconName="Target"
              iconPosition="left"
            >
              Accuracy Zones
            </Button>
          </div>
        </div>
      </div>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `₹${(value / 1000)?.toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {showErrorBands && (
              <>
                <Line
                  type="monotone"
                  dataKey="upperBound"
                  stroke="var(--color-muted-foreground)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Upper Bound"
                />
                <Line
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="var(--color-muted-foreground)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Lower Bound"
                />
              </>
            )}
            
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={false}
              name="Actual Price"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              name="Predicted Price"
            />
            
            {showAccuracyZones && (
              <>
                <ReferenceLine y={52000} stroke="var(--color-warning)" strokeDasharray="3 3" />
                <ReferenceLine y={55000} stroke="var(--color-warning)" strokeDasharray="3 3" />
              </>
            )}
            
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.1}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;