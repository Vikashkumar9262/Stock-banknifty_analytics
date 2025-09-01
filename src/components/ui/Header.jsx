import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ selectedStock }) => {
  const location = useLocation();
  const [marketStatus, setMarketStatus] = useState('OPEN');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const navigationItems = [
    {
      id: 'trading-hub',
      label: 'Trading Hub',
      path: '/trading-intelligence-dashboard',
      icon: 'TrendingUp',
      tooltip: 'Real-time market intelligence (Alt+1)',
      shortcut: 'Alt+1'
    },
    {
      id: 'technical-analysis',
      label: 'Technical Analysis',
      path: '/market-analysis-workbench',
      icon: 'BarChart3',
      tooltip: 'Advanced charting and pattern recognition (Alt+2)',
      shortcut: 'Alt+2'
    },
    {
      id: 'model-analytics',
      label: 'Model Analytics',
      path: '/model-performance-analytics',
      icon: 'Brain',
      tooltip: 'LSTM performance monitoring (Alt+3)',
      shortcut: 'Alt+3'
    },
    {
      id: 'risk-center',
      label: 'Risk Center',
      path: '/risk-management-center',
      icon: 'Shield',
      tooltip: 'Portfolio risk assessment (Alt+4)',
      shortcut: 'Alt+4'
    }
  ];

  const quickActions = [
    { id: 'export', label: 'Export', icon: 'Download' },
    { id: 'alerts', label: 'Alerts', icon: 'Bell' },
    { id: 'refresh', label: 'Refresh', icon: 'RefreshCw' }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.altKey) {
        const keyMap = {
          '1': '/trading-intelligence-dashboard',
          '2': '/market-analysis-workbench',
          '3': '/model-performance-analytics',
          '4': '/risk-management-center'
        };
        
        if (keyMap?.[e?.key]) {
          e?.preventDefault();
          window.location.href = keyMap?.[e?.key];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date();
      const hour = now?.getHours();
      const day = now?.getDay();
      
      if (day === 0 || day === 6) {
        setMarketStatus('CLOSED');
      } else if (hour >= 9 && hour < 16) {
        setMarketStatus('OPEN');
      } else if (hour >= 4 && hour < 9) {
        setMarketStatus('PRE-MARKET');
      } else {
        setMarketStatus('CLOSED');
      }
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getMarketStatusColor = () => {
    switch (marketStatus) {
      case 'OPEN': return 'text-success';
      case 'PRE-MARKET': return 'text-warning';
      case 'CLOSED': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'export':
        console.log('Export data');
        break;
      case 'alerts': console.log('Open alerts');
        break;
      case 'refresh':
        window.location?.reload();
        break;
      default:
        break;
    }
    setIsQuickActionsOpen(false);
  };

  // Get display name based on selected stock or default to BankNifty
  const getDisplayName = () => {
    if (selectedStock?.symbol) {
      return `${selectedStock?.name} Analytics`;
    }
    return 'BankNifty Analytics';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-background border-b border-border">
      <div className="w-full px-6 py-6">
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="var(--color-primary-foreground)" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{getDisplayName()}</h1>
                {selectedStock?.symbol && selectedStock?.symbol !== 'BANKNIFTY' && (
                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={selectedStock?.type === 'Index' ? 'TrendingUp' : 'Building'} 
                        size={12} 
                        className="text-primary" 
                      />
                      <span className="text-xs text-primary font-medium">{selectedStock?.symbol}</span>
                    </div>
                    <div className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      selectedStock?.type === 'Index' ? 'text-primary bg-primary/10' :
                      selectedStock?.type === 'Banking' ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20' :
                      selectedStock?.type === 'IT'? 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20' : 'text-muted-foreground bg-muted/30'
                    }`}>
                      {selectedStock?.type}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <a
                  key={item?.id}
                  href={item?.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-micro hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring ${
                    isActive 
                      ? 'text-primary bg-primary/10 font-medium' :'text-muted-foreground hover:text-foreground'
                  }`}
                  title={item?.tooltip}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon name={item?.icon} size={18} />
                  <span className="text-sm">{item?.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Market Status */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-card rounded-lg border">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-success animate-pulse-gentle' : 'bg-error'
              }`} />
              <span className={`text-sm font-mono ${getMarketStatusColor()}`}>
                {marketStatus}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                iconName="MoreHorizontal"
                className="lg:hidden"
                aria-expanded={isQuickActionsOpen}
                aria-haspopup="true"
              >
                More
              </Button>
              
              <div className="hidden lg:flex items-center space-x-1">
                {quickActions?.map((action) => (
                  <Button
                    key={action?.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction(action?.id)}
                    iconName={action?.icon}
                    title={action?.label}
                    className="transition-micro"
                  />
                ))}
              </div>

              {/* Mobile Quick Actions Dropdown */}
              {isQuickActionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-lg z-[1100] lg:hidden">
                  <div className="py-2">
                    {quickActions?.map((action) => (
                      <button
                        key={action?.id}
                        onClick={() => handleQuickAction(action?.id)}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 transition-micro"
                      >
                        <Icon name={action?.icon} size={16} />
                        <span>{action?.label}</span>
                      </button>
                    ))}
                    
                    {/* Mobile Navigation */}
                    <div className="border-t border-border mt-2 pt-2">
                      {navigationItems?.map((item) => {
                        const isActive = location?.pathname === item?.path;
                        return (
                          <a
                            key={item?.id}
                            href={item?.path}
                            className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-micro ${
                              isActive 
                                ? 'text-primary bg-primary/10 font-medium' :'text-popover-foreground hover:bg-muted/50'
                            }`}
                          >
                            <Icon name={item?.icon} size={16} />
                            <span>{item?.label}</span>
                          </a>
                        );
                      })}
                    </div>

                    {/* Mobile Market Status */}
                    <div className="border-t border-border mt-2 pt-2 px-4 py-2 md:hidden">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          connectionStatus === 'connected' ? 'bg-success animate-pulse-gentle' : 'bg-error'
                        }`} />
                        <span className={`text-sm font-mono ${getMarketStatusColor()}`}>
                          Market: {marketStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;