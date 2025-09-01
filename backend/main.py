from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import yfinance as yf
import pandas as pd
import numpy as np
import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="BankNifty Analytics Backend",
    description="Python backend for fetching live Yahoo Finance data",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4028", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for data validation
class StockRequest(BaseModel):
    symbol: str
    period: str = "1d"
    interval: str = "5m"

class QuoteRequest(BaseModel):
    symbols: List[str]

class TechnicalIndicatorsRequest(BaseModel):
    symbol: str
    period: str = "1mo"

# Global WebSocket connections for real-time updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove broken connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

class YahooFinanceService:
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 30  # seconds

    def get_ticker(self, symbol: str):
        """Get yfinance ticker object with proper symbol formatting"""
        # Handle Indian market symbols
        if symbol in ['NIFTY', 'BANKNIFTY', 'NIFTYNXT50', 'NIFTYIT', 'NIFTYPHARMA', 'NIFTYAUTO', 'NIFTYMETAL', 'NIFTYENERGY']:
            # Add .NS suffix for NSE indices
            formatted_symbol = f"^{symbol}.NS"
        elif symbol in ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK', 'TCS', 'INFY', 'WIPRO']:
            # Add .NS suffix for NSE stocks
            formatted_symbol = f"{symbol}.NS"
        else:
            formatted_symbol = symbol
        
        return yf.Ticker(formatted_symbol)

    async def get_quote(self, symbol: str) -> Dict[str, Any]:
        """Get real-time quote data for a symbol"""
        try:
            ticker = self.get_ticker(symbol)
            info = ticker.info
            
            # Get current price data
            hist = ticker.history(period="1d", interval="1m")
            if hist.empty:
                raise Exception("No historical data available")

            current_price = hist['Close'].iloc[-1]
            previous_close = info.get('previousClose', current_price)
            daily_change = current_price - previous_close
            daily_change_percent = (daily_change / previous_close) * 100 if previous_close else 0

            quote_data = {
                "symbol": symbol,
                "currentPrice": round(current_price, 2),
                "previousClose": round(previous_close, 2),
                "dailyChange": round(daily_change, 2),
                "dailyChangePercent": round(daily_change_percent, 2),
                "volume": int(hist['Volume'].iloc[-1]) if 'Volume' in hist.columns else 0,
                "marketCap": info.get('marketCap', 0),
                "fiftyTwoWeekHigh": info.get('fiftyTwoWeekHigh', 0),
                "fiftyTwoWeekLow": info.get('fiftyTwoWeekLow', 0),
                "currency": info.get('currency', 'INR'),
                "exchangeName": info.get('fullExchangeName', 'NSE'),
                "marketState": info.get('marketState', 'REGULAR'),
                "timestamp": datetime.now().isoformat(),
                "bid": info.get('bid', 0),
                "ask": info.get('ask', 0),
                "open": float(hist['Open'].iloc[0]) if 'Open' in hist.columns else current_price,
                "high": float(hist['High'].max()) if 'High' in hist.columns else current_price,
                "low": float(hist['Low'].min()) if 'Low' in hist.columns else current_price
            }
            
            return quote_data

        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {str(e)}")
            # Return fallback data
            return self._generate_fallback_quote(symbol)

    async def get_chart_data(self, symbol: str, period: str = "1d", interval: str = "5m") -> List[Dict[str, Any]]:
        """Get historical chart data for a symbol"""
        try:
            ticker = self.get_ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                return self._generate_fallback_chart_data(50)

            chart_data = []
            for index, row in hist.iterrows():
                # Calculate technical indicators
                rsi = self._calculate_rsi(hist, index)
                macd = self._calculate_macd(hist, index)
                
                data_point = {
                    "time": index.strftime("%H:%M"),
                    "timestamp": int(index.timestamp() * 1000),
                    "price": round(row['Close'], 2),
                    "open": round(row['Open'], 2),
                    "high": round(row['High'], 2),
                    "low": round(row['Low'], 2),
                    "close": round(row['Close'], 2),
                    "volume": int(row['Volume']) if 'Volume' in row else 0,
                    "rsi": round(rsi, 2),
                    "macd": round(macd, 2),
                    "vwap": round(self._calculate_vwap(hist, index), 2)
                }
                chart_data.append(data_point)

            return chart_data

        except Exception as e:
            logger.error(f"Error fetching chart data for {symbol}: {str(e)}")
            return self._generate_fallback_chart_data(50)

    async def get_multiple_quotes(self, symbols: List[str]) -> List[Dict[str, Any]]:
        """Get quotes for multiple symbols concurrently"""
        tasks = [self.get_quote(symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        quotes = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Error fetching quote for {symbols[i]}: {str(result)}")
                quotes.append(self._generate_fallback_quote(symbols[i]))
            else:
                quotes.append(result)
        
        return quotes

    async def get_technical_indicators(self, symbol: str, period: str = "1mo") -> Dict[str, Any]:
        """Get comprehensive technical indicators"""
        try:
            ticker = self.get_ticker(symbol)
            hist = ticker.history(period=period, interval="1d")
            
            if hist.empty:
                return self._generate_fallback_indicators()

            # Calculate various technical indicators
            rsi = self._calculate_rsi(hist, len(hist) - 1)
            macd = self._calculate_macd(hist, len(hist) - 1)
            atr = self._calculate_atr(hist)
            bollinger_bands = self._calculate_bollinger_bands(hist)
            
            return {
                "symbol": symbol,
                "rsi": round(rsi, 2),
                "macd": round(macd, 2),
                "macdSignal": round(macd * 0.9, 2),  # Simplified signal line
                "atr": round(atr, 2),
                "bollingerUpper": round(bollinger_bands['upper'], 2),
                "bollingerMiddle": round(bollinger_bands['middle'], 2),
                "bollingerLower": round(bollinger_bands['lower'], 2),
                "volume": int(hist['Volume'].iloc[-1]) if 'Volume' in hist.columns else 0,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error fetching technical indicators for {symbol}: {str(e)}")
            return self._generate_fallback_indicators()

    async def search_symbols(self, query: str) -> List[Dict[str, Any]]:
        """Search for symbols using yfinance"""
        try:
            # Use yfinance search functionality
            results = yf.Tickers(query)
            symbols = []
            
            for ticker in results.tickers[:10]:  # Limit to 10 results
                try:
                    info = ticker.info
                    symbols.append({
                        "symbol": info.get('symbol', ''),
                        "name": info.get('shortName', info.get('longName', '')),
                        "exchange": info.get('exchange', ''),
                        "type": info.get('quoteType', ''),
                        "currency": info.get('currency', '')
                    })
                except:
                    continue
            
            return symbols

        except Exception as e:
            logger.error(f"Error searching symbols: {str(e)}")
            return []

    # Technical indicator calculations
    def _calculate_rsi(self, hist: pd.DataFrame, index: int, period: int = 14) -> float:
        """Calculate RSI (Relative Strength Index)"""
        if index < period:
            return 50.0
        
        changes = hist['Close'].diff()
        gains = changes.where(changes > 0, 0)
        losses = -changes.where(changes < 0, 0)
        
        avg_gain = gains.rolling(window=period).mean().iloc[index]
        avg_loss = losses.rolling(window=period).mean().iloc[index]
        
        if avg_loss == 0:
            return 100.0
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    def _calculate_macd(self, hist: pd.DataFrame, index: int, fast: int = 12, slow: int = 26) -> float:
        """Calculate MACD (Moving Average Convergence Divergence)"""
        if index < slow:
            return 0.0
        
        fast_ema = hist['Close'].ewm(span=fast).mean().iloc[index]
        slow_ema = hist['Close'].ewm(span=slow).mean().iloc[index]
        
        return fast_ema - slow_ema

    def _calculate_vwap(self, hist: pd.DataFrame, index: int) -> float:
        """Calculate VWAP (Volume Weighted Average Price)"""
        if 'Volume' not in hist.columns:
            return hist['Close'].iloc[index]
        
        subset = hist.iloc[:index + 1]
        vwap = (subset['Close'] * subset['Volume']).sum() / subset['Volume'].sum()
        return vwap

    def _calculate_atr(self, hist: pd.DataFrame, period: int = 14) -> float:
        """Calculate ATR (Average True Range)"""
        if len(hist) < 2:
            return 0.0
        
        high_low = hist['High'] - hist['Low']
        high_close = np.abs(hist['High'] - hist['Close'].shift())
        low_close = np.abs(hist['Low'] - hist['Close'].shift())
        
        true_range = np.maximum(high_low, np.maximum(high_close, low_close))
        atr = true_range.rolling(window=period).mean().iloc[-1]
        
        return atr

    def _calculate_bollinger_bands(self, hist: pd.DataFrame, period: int = 20, std_dev: int = 2) -> Dict[str, float]:
        """Calculate Bollinger Bands"""
        if len(hist) < period:
            return {"upper": 0, "middle": 0, "lower": 0}
        
        sma = hist['Close'].rolling(window=period).mean().iloc[-1]
        std = hist['Close'].rolling(window=period).std().iloc[-1]
        
        return {
            "upper": sma + (std_dev * std),
            "middle": sma,
            "lower": sma - (std_dev * std)
        }

    # Fallback data generators
    def _generate_fallback_quote(self, symbol: str) -> Dict[str, Any]:
        """Generate fallback quote data when API fails"""
        base_price = 45250 if 'BANKNIFTY' in symbol else 22000
        change = (np.random.random() - 0.5) * 1000
        
        return {
            "symbol": symbol,
            "currentPrice": round(base_price + change, 2),
            "previousClose": base_price,
            "dailyChange": round(change, 2),
            "dailyChangePercent": round((change / base_price) * 100, 2),
            "volume": np.random.randint(1000000, 6000000),
            "marketCap": 0,
            "fiftyTwoWeekHigh": base_price + 2000,
            "fiftyTwoWeekLow": base_price - 2000,
            "currency": "INR",
            "exchangeName": "NSE",
            "marketState": "REGULAR",
            "timestamp": datetime.now().isoformat(),
            "isFallback": True,
            "errorMessage": "Using fallback data - Yahoo Finance API unavailable"
        }

    def _generate_fallback_chart_data(self, data_points: int) -> List[Dict[str, Any]]:
        """Generate fallback chart data when API fails"""
        data = []
        base_price = 45250
        current_price = base_price
        
        for i in range(data_points):
            timestamp = datetime.now() - timedelta(minutes=(data_points - 1 - i) * 5)
            change = (np.random.random() - 0.5) * 100
            current_price += change
            
            data.append({
                "time": timestamp.strftime("%H:%M"),
                "timestamp": int(timestamp.timestamp() * 1000),
                "price": round(current_price, 2),
                "open": round(current_price - change, 2),
                "high": round(current_price + abs(change) * 0.5, 2),
                "low": round(current_price - abs(change) * 0.5, 2),
                "close": round(current_price, 2),
                "volume": np.random.randint(500000, 1500000),
                "rsi": np.random.random() * 100,
                "macd": (np.random.random() - 0.5) * 20,
                "vwap": round(current_price, 2),
                "isFallback": True
            })
        
        return data

    def _generate_fallback_indicators(self) -> Dict[str, Any]:
        """Generate fallback technical indicators when API fails"""
        return {
            "rsi": round(np.random.random() * 100, 2),
            "macd": round((np.random.random() - 0.5) * 40, 2),
            "macdSignal": round((np.random.random() - 0.5) * 35, 2),
            "atr": round(np.random.random() * 200 + 50, 2),
            "bollingerUpper": 46000,
            "bollingerMiddle": 45250,
            "bollingerLower": 44500,
            "volume": np.random.randint(500000, 2000000),
            "timestamp": datetime.now().isoformat(),
            "isFallback": True
        }

# Initialize the service
yf_service = YahooFinanceService()

# API Routes
@app.get("/")
async def root():
    return {"message": "BankNifty Analytics Backend API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/quote")
async def get_quote(request: StockRequest):
    """Get real-time quote for a single symbol"""
    try:
        quote = await yf_service.get_quote(request.symbol)
        return JSONResponse(content=quote)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quotes")
async def get_multiple_quotes(request: QuoteRequest):
    """Get real-time quotes for multiple symbols"""
    try:
        quotes = await yf_service.get_multiple_quotes(request.symbols)
        return JSONResponse(content=quotes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chart")
async def get_chart_data(request: StockRequest):
    """Get historical chart data for a symbol"""
    try:
        chart_data = await yf_service.get_chart_data(
            request.symbol, 
            request.period, 
            request.interval
        )
        return JSONResponse(content=chart_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/technical-indicators")
async def get_technical_indicators(request: TechnicalIndicatorsRequest):
    """Get technical indicators for a symbol"""
    try:
        indicators = await yf_service.get_technical_indicators(
            request.symbol, 
            request.period
        )
        return JSONResponse(content=indicators)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/search/{query}")
async def search_symbols(query: str):
    """Search for symbols"""
    try:
        symbols = await yf_service.search_symbols(query)
        return JSONResponse(content=symbols)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "subscribe":
                symbol = message.get("symbol")
                if symbol:
                    # Start streaming data for this symbol
                    await stream_symbol_data(websocket, symbol)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)

async def stream_symbol_data(websocket: WebSocket, symbol: str):
    """Stream real-time data for a specific symbol"""
    try:
        while True:
            # Get latest quote
            quote = await yf_service.get_quote(symbol)
            
            # Send data to client
            await websocket.send_text(json.dumps({
                "type": "quote_update",
                "symbol": symbol,
                "data": quote
            }))
            
            # Wait before next update
            await asyncio.sleep(5)  # Update every 5 seconds
            
    except Exception as e:
        logger.error(f"Error streaming data for {symbol}: {str(e)}")

# Background task for broadcasting market updates
@app.on_event("startup")
async def startup_event():
    logger.info("Starting BankNifty Analytics Backend...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down BankNifty Analytics Backend...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
