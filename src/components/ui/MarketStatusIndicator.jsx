import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const MarketStatusIndicator = ({ className = '' }) => {
  const [marketStatus, setMarketStatus] = useState('OPEN');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date();
      const hour = now?.getHours();
      const day = now?.getDay();
      
      // Weekend check
      if (day === 0 || day === 6) {
        setMarketStatus('CLOSED');
      } else if (hour >= 9 && hour < 16) {
        setMarketStatus('OPEN');
      } else if (hour >= 4 && hour < 9) {
        setMarketStatus('PRE-MARKET');
      } else if (hour >= 16 && hour < 20) {
        setMarketStatus('AFTER-HOURS');
      } else {
        setMarketStatus('CLOSED');
      }
      
      setLastUpdate(now);
    };

    // Simulate connection status changes
    const simulateConnection = () => {
      const random = Math.random();
      if (random > 0.95) {
        setConnectionStatus('disconnected');
        setTimeout(() => setConnectionStatus('connected'), 2000);
      }
    };

    updateMarketStatus();
    const statusInterval = setInterval(updateMarketStatus, 60000); // Update every minute
    const connectionInterval = setInterval(simulateConnection, 10000); // Check connection every 10 seconds

    return () => {
      clearInterval(statusInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  const getMarketStatusConfig = () => {
    switch (marketStatus) {
      case 'OPEN':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'Circle',
          pulse: true
        };
      case 'PRE-MARKET': case'AFTER-HOURS':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'Clock',
          pulse: false
        };
      case 'CLOSED':
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          icon: 'Square',
          pulse: false
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          icon: 'AlertCircle',
          pulse: false
        };
    }
  };

  const getConnectionStatusConfig = () => {
    return connectionStatus === 'connected'
      ? {
          color: 'text-success',
          icon: 'Wifi',
          pulse: true
        }
      : {
          color: 'text-error',
          icon: 'WifiOff',
          pulse: false
        };
  };

  const marketConfig = getMarketStatusConfig();
  const connectionConfig = getConnectionStatusConfig();

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Market Status */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${marketConfig?.bgColor} ${marketConfig?.borderColor}`}>
        <div className="flex items-center space-x-1.5">
          <div className={`w-2 h-2 rounded-full ${
            marketConfig?.pulse ? 'bg-success animate-pulse-gentle' : 'bg-current'
          } ${marketConfig?.color}`} />
          <span className={`text-sm font-mono font-medium ${marketConfig?.color}`}>
            {marketStatus}
          </span>
        </div>
      </div>
      {/* Connection Status */}
      <div className="flex items-center space-x-1.5 px-2 py-1 rounded">
        <Icon 
          name={connectionConfig?.icon} 
          size={14} 
          className={`${connectionConfig?.color} ${connectionConfig?.pulse ? 'animate-pulse-gentle' : ''}`}
        />
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {connectionStatus === 'connected' ? 'Live' : 'Offline'}
        </span>
      </div>
      {/* Last Update Time */}
      <div className="hidden md:flex items-center space-x-1 text-xs text-muted-foreground">
        <Icon name="Clock" size={12} />
        <span className="font-mono">{formatTime(lastUpdate)}</span>
      </div>
    </div>
  );
};

export default MarketStatusIndicator;