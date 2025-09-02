import axios from 'axios';

class PythonBackendService {
  constructor() {
    this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error('❌ Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Backend health check failed: ${error.message}`);
    }
  }

  // Get real-time quote for a single symbol
  async getQuote(symbol, period = '1d', interval = '5m') {
    try {
      const response = await this.api.post('/api/quote', {
        symbol,
        period,
        interval,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  // Get quotes for multiple symbols
  async getMultipleQuotes(symbols) {
    try {
      const response = await this.api.post('/api/quotes', {
        symbols,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      throw error;
    }
  }

  // Get historical chart data
  async getChartData(symbol, period = '1d', interval = '5m') {
    try {
      const response = await this.api.post('/api/chart', {
        symbol,
        period,
        interval,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching chart data for ${symbol}:`, error);
      throw error;
    }
  }

  // Get technical indicators
  async getTechnicalIndicators(symbol, period = '1mo') {
    try {
      const response = await this.api.post('/api/technical-indicators', {
        symbol,
        period,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching technical indicators for ${symbol}:`, error);
      throw error;
    }
    }

  // Search for symbols
  async searchSymbols(query) {
    try {
      const response = await this.api.get(`/api/search/${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching symbols:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time updates
  createWebSocketConnection(symbol, onMessage, onError, onClose) {
    try {
      const httpBase = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
      const isHttps = (typeof location !== 'undefined' && location.protocol === 'https:') || /^https:/i.test(httpBase);
      const wsBase = httpBase.replace(/^http(s)?:/i, isHttps ? 'wss:' : 'ws:');
      const ws = new WebSocket(`${wsBase}/ws`);
      
      ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        // Subscribe to symbol updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          symbol: symbol
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        onClose?.();
      };

      return ws;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      throw error;
    }
  }

  // Batch operations for multiple symbols
  async getBatchData(symbols, dataTypes = ['quote', 'chart', 'indicators']) {
    try {
      const batchPromises = [];

      symbols.forEach(symbol => {
        dataTypes.forEach(dataType => {
          switch (dataType) {
            case 'quote':
              batchPromises.push(this.getQuote(symbol));
              break;
            case 'chart':
              batchPromises.push(this.getChartData(symbol));
              break;
            case 'indicators':
              batchPromises.push(this.getTechnicalIndicators(symbol));
              break;
          }
        });
      });

      const results = await Promise.allSettled(batchPromises);
      
      // Process results and organize by symbol and data type
      const organizedResults = {};
      let resultIndex = 0;

      symbols.forEach(symbol => {
        organizedResults[symbol] = {};
        dataTypes.forEach(dataType => {
          const result = results[resultIndex++];
          if (result.status === 'fulfilled') {
            organizedResults[symbol][dataType] = result.value;
          } else {
            organizedResults[symbol][dataType] = {
              error: result.reason?.message || 'Failed to fetch data',
              isError: true
            };
          }
        });
      });

      return organizedResults;
    } catch (error) {
      console.error('Error in batch data fetch:', error);
      throw error;
    }
  }

  // Market overview for multiple indices
  async getMarketOverview() {
    try {
      const indices = ['NIFTY', 'BANKNIFTY', 'NIFTYIT', 'NIFTYPHARMA'];
      const quotes = await this.getMultipleQuotes(indices);
      
      // Calculate market sentiment
      const upCount = quotes.filter(q => q.dailyChangePercent > 0).length;
      const downCount = quotes.filter(q => q.dailyChangePercent < 0).length;
      const flatCount = quotes.filter(q => q.dailyChangePercent === 0).length;
      
      const marketSentiment = {
        bullish: upCount > downCount,
        bearish: downCount > upCount,
        neutral: upCount === downCount,
        upCount,
        downCount,
        flatCount,
        totalIndices: indices.length
      };

      return {
        indices: quotes,
        sentiment: marketSentiment,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market overview:', error);
      throw error;
    }
  }

  // Enhanced quote with additional data
  async getEnhancedQuote(symbol) {
    try {
      const [quote, indicators, chartData] = await Promise.allSettled([
        this.getQuote(symbol),
        this.getTechnicalIndicators(symbol),
        this.getChartData(symbol, '1d', '5m')
      ]);

      const enhancedQuote = {
        symbol,
        timestamp: new Date().toISOString(),
        quote: quote.status === 'fulfilled' ? quote.value : null,
        indicators: indicators.status === 'fulfilled' ? indicators.value : null,
        chartData: chartData.status === 'fulfilled' ? chartData.value : null,
        errors: []
      };

      // Collect any errors
      if (quote.status === 'rejected') {
        enhancedQuote.errors.push(`Quote: ${quote.reason?.message}`);
      }
      if (indicators.status === 'rejected') {
        enhancedQuote.errors.push(`Indicators: ${indicators.reason?.message}`);
      }
      if (chartData.status === 'rejected') {
        enhancedQuote.errors.push(`Chart: ${chartData.reason?.message}`);
      }

      return enhancedQuote;
    } catch (error) {
      console.error(`Error fetching enhanced quote for ${symbol}:`, error);
      throw error;
    }
  }

  // Utility method to check backend availability
  async isBackendAvailable() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Fallback to original service if backend is unavailable
  async getQuoteWithFallback(symbol, fallbackService) {
    try {
      if (await this.isBackendAvailable()) {
        return await this.getQuote(symbol);
      } else {
        console.warn('Python backend unavailable, using fallback service');
        return await fallbackService.getQuote(symbol);
      }
    } catch (error) {
      console.warn('Using fallback service due to error:', error);
      return await fallbackService.getQuote(symbol);
    }
  }
}

export default new PythonBackendService();
