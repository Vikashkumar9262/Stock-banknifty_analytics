import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScenarioAnalysisTable = () => {
  const [activeScenario, setActiveScenario] = useState('stress');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const scenarioData = {
    stress: [
      {
        id: 1,
        scenario: 'Market Crash (-30%)',
        probability: 5,
        portfolioImpact: -24.5,
        var: 4.8,
        expectedLoss: -2.1,
        timeToRecover: '18 months',
        severity: 'critical'
      },
      {
        id: 2,
        scenario: 'Banking Crisis (-20%)',
        probability: 12,
        portfolioImpact: -18.2,
        var: 3.9,
        expectedLoss: -1.8,
        timeToRecover: '12 months',
        severity: 'high'
      },
      {
        id: 3,
        scenario: 'Interest Rate Shock (+200bp)',
        probability: 25,
        portfolioImpact: -12.7,
        var: 2.8,
        expectedLoss: -1.2,
        timeToRecover: '8 months',
        severity: 'medium'
      },
      {
        id: 4,
        scenario: 'Regulatory Changes',
        probability: 35,
        portfolioImpact: -8.4,
        var: 2.1,
        expectedLoss: -0.9,
        timeToRecover: '6 months',
        severity: 'medium'
      },
      {
        id: 5,
        scenario: 'Economic Slowdown (-10%)',
        probability: 45,
        portfolioImpact: -6.8,
        var: 1.8,
        expectedLoss: -0.7,
        timeToRecover: '4 months',
        severity: 'low'
      }
    ],
    monte: [
      {
        id: 1,
        scenario: '95th Percentile Loss',
        probability: 95,
        portfolioImpact: -15.2,
        var: 3.2,
        expectedLoss: -1.5,
        timeToRecover: '10 months',
        severity: 'high'
      },
      {
        id: 2,
        scenario: '99th Percentile Loss',
        probability: 99,
        portfolioImpact: -22.8,
        var: 4.5,
        expectedLoss: -2.0,
        timeToRecover: '15 months',
        severity: 'critical'
      },
      {
        id: 3,
        scenario: 'Expected Loss',
        probability: 50,
        portfolioImpact: -3.2,
        var: 1.2,
        expectedLoss: -0.3,
        timeToRecover: '2 months',
        severity: 'low'
      },
      {
        id: 4,
        scenario: '75th Percentile Loss',
        probability: 75,
        portfolioImpact: -8.7,
        var: 2.4,
        expectedLoss: -0.8,
        timeToRecover: '5 months',
        severity: 'medium'
      }
    ]
  };

  const scenarioOptions = [
    { id: 'stress', label: 'Stress Tests', icon: 'AlertTriangle' },
    { id: 'monte', label: 'Monte Carlo', icon: 'BarChart3' }
  ];

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return { color: 'text-error', bgColor: 'bg-error/10', icon: 'AlertTriangle' };
      case 'high':
        return { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'AlertCircle' };
      case 'medium':
        return { color: 'text-primary', bgColor: 'bg-primary/10', icon: 'Info' };
      case 'low':
        return { color: 'text-success', bgColor: 'bg-success/10', icon: 'CheckCircle' };
      default:
        return { color: 'text-muted-foreground', bgColor: 'bg-muted/10', icon: 'Circle' };
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const data = [...scenarioData?.[activeScenario]];
    if (sortConfig?.key) {
      data?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [scenarioData, activeScenario, sortConfig]);

  const SortableHeader = ({ label, sortKey, className = '' }) => (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-micro ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={10} 
            className={sortConfig?.key === sortKey && sortConfig?.direction === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}
          />
          <Icon 
            name="ChevronDown" 
            size={10} 
            className={sortConfig?.key === sortKey && sortConfig?.direction === 'desc' ? 'text-primary' : 'text-muted-foreground/50'}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">Scenario Analysis</h3>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {scenarioOptions?.map((option) => (
                <Button
                  key={option?.id}
                  variant={activeScenario === option?.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveScenario(option?.id)}
                  iconName={option?.icon}
                >
                  {option?.label}
                </Button>
              ))}
            </div>
            
            <Button variant="outline" size="sm" iconName="Play">
              Run Analysis
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <SortableHeader label="Scenario" sortKey="scenario" />
              <SortableHeader label="Probability (%)" sortKey="probability" />
              <SortableHeader label="Portfolio Impact (%)" sortKey="portfolioImpact" />
              <SortableHeader label="VaR (%)" sortKey="var" />
              <SortableHeader label="Expected Loss (₹M)" sortKey="expectedLoss" />
              <SortableHeader label="Recovery Time" sortKey="timeToRecover" />
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData?.map((row) => {
              const severityConfig = getSeverityConfig(row?.severity);
              
              return (
                <tr key={row?.id} className="hover:bg-muted/10 transition-micro">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {row?.scenario}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-foreground">{row?.probability}%</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-smooth"
                          style={{ width: `${row?.probability}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${row?.portfolioImpact < 0 ? 'text-error' : 'text-success'}`}>
                      {row?.portfolioImpact > 0 ? '+' : ''}{row?.portfolioImpact}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-foreground font-mono">
                      {row?.var}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${row?.expectedLoss < 0 ? 'text-error' : 'text-success'}`}>
                      ₹{Math.abs(row?.expectedLoss)}M
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">
                      {row?.timeToRecover}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${severityConfig?.color} ${severityConfig?.bgColor}`}>
                      <Icon name={severityConfig?.icon} size={12} />
                      <span className="capitalize">{row?.severity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="xs" iconName="Eye">
                        Details
                      </Button>
                      <Button variant="ghost" size="xs" iconName="Download">
                        Export
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="text-xs text-muted-foreground">
            Showing {sortedData?.length} scenarios • Last updated: {new Date()?.toLocaleTimeString()}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
            <Button variant="ghost" size="sm" iconName="Settings">
              Configure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioAnalysisTable;