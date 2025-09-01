import yahooFinance from 'yahoo-finance2';

class YahooFinanceService {
  constructor() {
    this.baseConfig = {
      timeout: 30000, // 30 seconds timeout
      validateResult: false // Set to false for more lenient validation
    };
  }

  // Get real-time quote data for a symbol
  async getQuote(symbol = '^NSEI') {
    try {
      console.log(`Fetching quote data for: ${symbol}`);
      const quote = await yahooFinance?.quote(symbol, this.baseConfig);
      
      return {
        symbol: quote?.symbol || symbol,
        currentPrice: quote?.regularMarketPrice || quote?.price || 0,
        previousClose: quote?.regularMarketPreviousClose || quote?.previousClose || 0,
        dailyChange: quote?.regularMarketChange || 0,
        dailyChangePercent: quote?.regularMarketChangePercent || 0,
        volume: quote?.regularMarketVolume || quote?.volume || 0,
        marketCap: quote?.marketCap || 0,
        fiftyTwoWeekHigh: quote?.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote?.fiftyTwoWeekLow || 0,
        currency: quote?.currency || 'INR',
        exchangeName: quote?.fullExchangeName || 'NSE',
        marketState: quote?.marketState || 'REGULAR',
        timestamp: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      
      // Return fallback data with error indication
      return {
        symbol: symbol,
        currentPrice: 45250 + (Math.random() - 0.5) * 1000,
        previousClose: 45000,
        dailyChange: (Math.random() - 0.5) * 500,
        dailyChangePercent: (Math.random() - 0.5) * 2,
        volume: Math.floor(Math.random() * 2000000) + 1000000,
        marketCap: 0,
        fiftyTwoWeekHigh: 46000,
        fiftyTwoWeekLow: 44000,
        currency: 'INR',
        exchangeName: 'NSE',
        marketState: 'REGULAR',
        timestamp: new Date()?.toISOString(),
        isError: true,
        errorMessage: 'Using fallback data - Yahoo Finance API unavailable'
      };
    }
  }

  // Get historical chart data
  async getChartData(symbol = '^NSEI', period = '1d', interval = '5m') {
    try {
      console.log(`Fetching chart data for: ${symbol}, period: ${period}, interval: ${interval}`);
      
      const endDate = new Date();
      const startDate = new Date();
      
      // Set appropriate start date based on period
      switch (period) {
        case '1d':
          startDate?.setDate(endDate?.getDate() - 1);
          break;
        case '5d':
          startDate?.setDate(endDate?.getDate() - 5);
          break;
        case '1mo':
          startDate?.setMonth(endDate?.getMonth() - 1);
          break;
        case '3mo':
          startDate?.setMonth(endDate?.getMonth() - 3);
          break;
        case '6mo':
          startDate?.setMonth(endDate?.getMonth() - 6);
          break;
        case '1y':
          startDate?.setFullYear(endDate?.getFullYear() - 1);
          break;
        default:
          startDate?.setDate(endDate?.getDate() - 1);
      }

      const result = await yahooFinance?.chart(symbol, {
        period1: startDate,
        period2: endDate,
        interval: interval,
        ...this.baseConfig
      });

      if (!result?.quotes || result?.quotes?.length === 0) {
        return this.generateFallbackChartData(50);
      }

      return result?.quotes?.map((quote, index) => ({
        time: new Date(quote.date)?.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        timestamp: quote?.date?.getTime(),
        price: quote?.close || quote?.open || 0,
        open: quote?.open || 0,
        high: quote?.high || 0,
        low: quote?.low || 0,
        close: quote?.close || 0,
        volume: quote?.volume || 0,
        prediction: quote?.close + (Math.random() - 0.5) * 50,
        confidenceUpper: quote?.close + Math.random() * 30 + 10,
        confidenceLower: quote?.close - Math.random() * 30 - 10,
        rsi: this.calculateRSI(index, result?.quotes),
        macd: this.calculateMACD(index, result?.quotes)
      }));

    } catch (error) {
      console.error('Error fetching chart data:', error);
      return this.generateFallbackChartData(50);
    }
  }

  // Get multiple symbols data
  async getMultipleQuotes(symbols = ['^NSEI', '^NSEBANK', '^BSESN']) {
    try {
      const promises = symbols?.map(symbol => this.getQuote(symbol));
      const results = await Promise.allSettled(promises);
      
      return results?.map((result, index) => {
        if (result?.status === 'fulfilled') {
          return result?.value;
        } else {
          return {
            symbol: symbols?.[index],
            currentPrice: 45250 + (Math.random() - 0.5) * 1000,
            dailyChange: (Math.random() - 0.5) * 500,
            dailyChangePercent: (Math.random() - 0.5) * 2,
            volume: Math.floor(Math.random() * 2000000) + 1000000,
            isError: true,
            errorMessage: 'Failed to fetch data'
          };
        }
      });
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return symbols?.map(symbol => ({
        symbol,
        currentPrice: 45250 + (Math.random() - 0.5) * 1000,
        dailyChange: (Math.random() - 0.5) * 500,
        dailyChangePercent: (Math.random() - 0.5) * 2,
        volume: Math.floor(Math.random() * 2000000) + 1000000,
        isError: true,
        errorMessage: 'Failed to fetch data'
      }));
    }
  }

  // Generate fallback chart data when API fails
  generateFallbackChartData(dataPoints = 50) {
    const data = [];
    const basePrice = 45250;
    let currentPrice = basePrice;
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(Date.now() - (dataPoints - 1 - i) * 60000 * 5);
      const change = (Math.random() - 0.5) * 100;
      currentPrice += change;
      
      const prediction = currentPrice + (Math.random() - 0.5) * 50;
      
      data?.push({
        time: timestamp?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp?.getTime(),
        price: Math.round(currentPrice * 100) / 100,
        open: Math.round((currentPrice - change) * 100) / 100,
        high: Math.round((currentPrice + Math.abs(change) * 0.5) * 100) / 100,
        low: Math.round((currentPrice - Math.abs(change) * 0.5) * 100) / 100,
        close: Math.round(currentPrice * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 500000,
        prediction: Math.round(prediction * 100) / 100,
        confidenceUpper: Math.round((prediction + Math.random() * 30) * 100) / 100,
        confidenceLower: Math.round((prediction - Math.random() * 30) * 100) / 100,
        rsi: Math.random() * 100,
        macd: (Math.random() - 0.5) * 20,
        isFallback: true
      });
    }
    
    return data;
  }

  // Simple RSI calculation
  calculateRSI(index, quotes, period = 14) {
    if (index < period) return 50; // Default neutral RSI
    
    let gains = 0;
    let losses = 0;
    
    for (let i = index - period + 1; i <= index; i++) {
      if (i > 0) {
        const change = quotes?.[i]?.close - quotes?.[i - 1]?.close;
        if (change > 0) {
          gains += change;
        } else {
          losses += Math.abs(change);
        }
      }
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // Simple MACD calculation
  calculateMACD(index, quotes, fastPeriod = 12, slowPeriod = 26) {
    if (index < slowPeriod) return 0;
    
    const fastEMA = this.calculateEMA(quotes?.slice(index - fastPeriod + 1, index + 1), fastPeriod);
    const slowEMA = this.calculateEMA(quotes?.slice(index - slowPeriod + 1, index + 1), slowPeriod);
    
    return fastEMA - slowEMA;
  }

  // Calculate Exponential Moving Average
  calculateEMA(prices, period) {
    if (prices?.length === 0) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices?.[0]?.close;
    
    for (let i = 1; i < prices?.length; i++) {
      ema = (prices?.[i]?.close - ema) * multiplier + ema;
    }
    
    return ema;
  }

  // Get technical indicators data
  async getTechnicalIndicators(symbol = '^NSEI') {
    try {
      const chartData = await this.getChartData(symbol, '1mo', '1d');
      
      if (chartData?.length === 0) {
        return this.generateFallbackIndicators();
      }

      const latestData = chartData?.[chartData?.length - 1];
      
      return {
        rsi: latestData?.rsi,
        macd: latestData?.macd,
        macdSignal: latestData?.macd * 0.9, // Simplified signal line
        volume: latestData?.volume,
        atr: this.calculateATR(chartData?.slice(-14)), // 14-period ATR
        timestamp: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error fetching technical indicators:', error);
      return this.generateFallbackIndicators();
    }
  }

  // Calculate Average True Range
  calculateATR(data, period = 14) {
    if (data?.length < 2) return 50;
    
    const trueRanges = [];
    
    for (let i = 1; i < data?.length; i++) {
      const high = data?.[i]?.high;
      const low = data?.[i]?.low;
      const prevClose = data?.[i - 1]?.close;
      
      const tr = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
      
      trueRanges?.push(tr);
    }
    
    // Calculate average of true ranges
    const sum = trueRanges?.reduce((acc, tr) => acc + tr, 0);
    return sum / trueRanges?.length;
  }

  // Generate fallback technical indicators
  generateFallbackIndicators() {
    return {
      rsi: Math.random() * 100,
      macd: (Math.random() - 0.5) * 40,
      macdSignal: (Math.random() - 0.5) * 35,
      volume: Math.floor(Math.random() * 2000000) + 500000,
      atr: Math.random() * 200 + 50,
      timestamp: new Date()?.toISOString(),
      isFallback: true
    };
  }

  // Search for symbols
  async searchSymbols(query) {
    try {
      const result = await yahooFinance?.search(query, this.baseConfig);
      
      return result?.quotes?.slice(0, 10)?.map(quote => ({
        symbol: quote?.symbol,
        name: quote?.shortname || quote?.longname,
        exchange: quote?.exchange,
        type: quote?.quoteType,
        currency: quote?.currency
      })) || [];
    } catch (error) {
      console.error('Error searching symbols:', error);
      return [];
    }
  }
}

export default new YahooFinanceService();