import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customPath = null }) => {
  const location = useLocation();
  
  const pathMapping = {
    '/trading-intelligence-dashboard': {
      label: 'Trading Hub',
      icon: 'TrendingUp',
      description: 'Real-time market intelligence and AI predictions'
    },
    '/market-analysis-workbench': {
      label: 'Technical Analysis',
      icon: 'BarChart3',
      description: 'Advanced charting and pattern recognition'
    },
    '/model-performance-analytics': {
      label: 'Model Analytics',
      icon: 'Brain',
      description: 'LSTM performance monitoring and optimization'
    },
    '/risk-management-center': {
      label: 'Risk Center',
      icon: 'Shield',
      description: 'Portfolio risk assessment and exposure monitoring'
    }
  };

  const currentPath = customPath || location?.pathname;
  const currentPage = pathMapping?.[currentPath];

  if (!currentPage) {
    return null;
  }

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/', icon: 'Home' },
    { 
      label: currentPage?.label, 
      path: currentPath, 
      icon: currentPage?.icon,
      description: currentPage?.description,
      current: true 
    }
  ];

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
      aria-label="Breadcrumb"
    >
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={item?.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
          )}
          
          {item?.current ? (
            <div className="flex items-center space-x-2">
              <Icon name={item?.icon} size={16} className="text-primary" />
              <div>
                <span className="text-foreground font-medium">{item?.label}</span>
                {item?.description && (
                  <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {item?.description}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <a
              href={item?.path}
              className="flex items-center space-x-1 hover:text-foreground transition-micro focus:outline-none focus:ring-2 focus:ring-ring rounded px-1 py-0.5"
            >
              <Icon name={item?.icon} size={14} />
              <span>{item?.label}</span>
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;