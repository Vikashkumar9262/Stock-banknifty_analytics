import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

import { cn } from '../../utils/cn';

const StockSearch = ({ 
  onStockSelect, 
  selectedStock = { symbol: 'BANKNIFTY', name: 'Bank Nifty' },
  className 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Popular Indian stocks and indices for autocomplete
  const stockDatabase = [
    // Indices
    { symbol: 'NIFTY', name: 'Nifty 50', type: 'Index' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', type: 'Index' },
    { symbol: 'NIFTYNXT50', name: 'Nifty Next 50', type: 'Index' },
    { symbol: 'NIFTYIT', name: 'Nifty IT', type: 'Index' },
    { symbol: 'NIFTYPHARMA', name: 'Nifty Pharma', type: 'Index' },
    { symbol: 'NIFTYAUTO', name: 'Nifty Auto', type: 'Index' },
    { symbol: 'NIFTYMETAL', name: 'Nifty Metal', type: 'Index' },
    { symbol: 'NIFTYENERGY', name: 'Nifty Energy', type: 'Index' },
    
    // Banking Stocks
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', type: 'Banking' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', type: 'Banking' },
    { symbol: 'SBIN', name: 'State Bank of India', type: 'Banking' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd', type: 'Banking' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', type: 'Banking' },
    { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', type: 'Banking' },
    { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd', type: 'Banking' },
    { symbol: 'PNB', name: 'Punjab National Bank', type: 'Banking' },
    
    // IT Stocks
    { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'IT' },
    { symbol: 'INFY', name: 'Infosys Ltd', type: 'IT' },
    { symbol: 'WIPRO', name: 'Wipro Ltd', type: 'IT' },
    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', type: 'IT' },
    { symbol: 'TECHM', name: 'Tech Mahindra Ltd', type: 'IT' },
    { symbol: 'LTI', name: 'Larsen & Toubro Infotech', type: 'IT' },
    
    // Auto Stocks
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', type: 'Auto' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', type: 'Auto' },
    { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', type: 'Auto' },
    { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', type: 'Auto' },
    { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', type: 'Auto' },
    { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', type: 'Auto' },
    
    // Pharma Stocks
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', type: 'Pharma' },
    { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories', type: 'Pharma' },
    { symbol: 'CIPLA', name: 'Cipla Ltd', type: 'Pharma' },
    { symbol: 'DIVISLAB', name: 'Divis Laboratories Ltd', type: 'Pharma' },
    { symbol: 'BIOCON', name: 'Biocon Ltd', type: 'Pharma' },
    { symbol: 'LUPIN', name: 'Lupin Ltd', type: 'Pharma' },
    
    // FMCG Stocks
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', type: 'FMCG' },
    { symbol: 'ITC', name: 'ITC Ltd', type: 'FMCG' },
    { symbol: 'NESTLEIND', name: 'Nestle India Ltd', type: 'FMCG' },
    { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', type: 'FMCG' },
    { symbol: 'DABUR', name: 'Dabur India Ltd', type: 'FMCG' },
    { symbol: 'GODREJCP', name: 'Godrej Consumer Products', type: 'FMCG' },
    
    // Energy & Oil
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', type: 'Energy' },
    { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation', type: 'Energy' },
    { symbol: 'BPCL', name: 'Bharat Petroleum Corporation', type: 'Energy' },
    { symbol: 'IOC', name: 'Indian Oil Corporation Ltd', type: 'Energy' },
    { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd', type: 'Energy' },
    
    // Metals & Mining
    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', type: 'Metal' },
    { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', type: 'Metal' },
    { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', type: 'Metal' },
    { symbol: 'VEDL', name: 'Vedanta Ltd', type: 'Metal' },
    { symbol: 'COALINDIA', name: 'Coal India Ltd', type: 'Metal' },
    { symbol: 'SAIL', name: 'Steel Authority of India', type: 'Metal' },
    
    // Telecom
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', type: 'Telecom' },
    { symbol: 'IDEA', name: 'Vodafone Idea Ltd', type: 'Telecom' },
    { symbol: 'JIO', name: 'Reliance Jio Infocomm', type: 'Telecom' }
  ];

  useEffect(() => {
    if (query?.length >= 2) {
      const filtered = stockDatabase?.filter(stock =>
        stock?.symbol?.toLowerCase()?.includes(query?.toLowerCase()) ||
        stock?.name?.toLowerCase()?.includes(query?.toLowerCase())
      )?.slice(0, 8); // Limit to 8 results for better UX
      setFilteredStocks(filtered);
      setFocusedIndex(-1);
    } else {
      setFilteredStocks([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setQuery(e?.target?.value);
    setIsOpen(true);
  };

  const handleStockSelect = (stock) => {
    setQuery('');
    setIsOpen(false);
    onStockSelect?.(stock);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredStocks?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredStocks?.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e?.preventDefault();
        if (focusedIndex >= 0 && filteredStocks?.[focusedIndex]) {
          handleStockSelect(filteredStocks?.[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        searchRef?.current?.blur();
        break;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Index': 'text-primary bg-primary/10',
      'Banking': 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
      'IT': 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
      'Auto': 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
      'Pharma': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
      'FMCG': 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
      'Energy': 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
      'Metal': 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
      'Telecom': 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted/30';
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 px-2 py-1 bg-muted/30 rounded">
          <Icon name="Search" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Stock:</span>
        </div>
        
        <div className="relative min-w-[180px]">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
            <Icon 
              name={selectedStock?.type === 'Index' ? 'TrendingUp' : 'Building'} 
              size={14} 
              className="text-primary" 
            />
            <span className="text-sm font-medium text-primary">
              {selectedStock?.symbol}
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-0.5 hover:bg-primary/10 rounded"
              title="Search stocks"
            >
              <Icon name="ChevronDown" size={12} className="text-primary" />
            </button>
          </div>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-[100]">
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={16} 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search stocks..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {filteredStocks?.length > 0 ? (
                  filteredStocks?.map((stock, index) => (
                    <button
                      key={stock?.symbol}
                      onClick={() => handleStockSelect(stock)}
                      className={cn(
                        'w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-micro border-b border-border last:border-b-0',
                        focusedIndex === index && 'bg-muted/50'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon 
                          name={stock?.type === 'Index' ? 'TrendingUp' : 'Building'} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                        <div>
                          <div className="font-medium text-foreground text-sm">
                            {stock?.symbol}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {stock?.name}
                          </div>
                        </div>
                      </div>
                      <div className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        getTypeColor(stock?.type)
                      )}>
                        {stock?.type}
                      </div>
                    </button>
                  ))
                ) : query?.length >= 2 ? (
                  <div className="p-3 text-center text-muted-foreground text-sm">
                    <Icon name="Search" size={16} className="mx-auto mb-2" />
                    No stocks found for "{query}"
                  </div>
                ) : (
                  <div className="p-3 text-center text-muted-foreground text-sm">
                    <Icon name="Search" size={16} className="mx-auto mb-2" />
                    Type 2+ characters to search
                  </div>
                )}
              </div>
              
              {filteredStocks?.length > 0 && (
                <div className="p-2 border-t border-border text-xs text-muted-foreground text-center">
                  Use ↑↓ arrow keys to navigate, Enter to select, Esc to close
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockSearch;