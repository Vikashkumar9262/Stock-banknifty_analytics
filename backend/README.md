# 🐍 BankNifty Analytics Python Backend

A high-performance Python backend service for fetching live Yahoo Finance data using FastAPI and yfinance library.

## 🚀 Features

- **Real-time Data**: Live quotes, charts, and technical indicators
- **WebSocket Support**: Real-time streaming updates
- **Technical Analysis**: RSI, MACD, ATR, Bollinger Bands, VWAP
- **Indian Market Support**: Optimized for NSE indices and stocks
- **Fallback System**: Graceful degradation when APIs fail
- **High Performance**: Async/await architecture with FastAPI
- **CORS Enabled**: Ready for frontend integration

## 📋 Prerequisites

- Python 3.8+
- pip package manager
- Internet connection for Yahoo Finance API

## 🛠️ Installation

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your preferences
# Default values are usually fine for development
```

## 🚀 Running the Service

### Option 1: Using the Startup Script (Recommended)
```bash
python start.py
```

### Option 2: Direct Uvicorn
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Using Python Module
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 🌐 API Endpoints

### Health Check
- **GET** `/health` - Service health status

### Stock Data
- **POST** `/api/quote` - Get real-time quote for a symbol
- **POST** `/api/quotes` - Get quotes for multiple symbols
- **POST** `/api/chart` - Get historical chart data
- **POST** `/api/technical-indicators` - Get technical indicators

### Search
- **GET** `/api/search/{query}` - Search for symbols

### WebSocket
- **WS** `/ws` - Real-time data streaming

## 📊 API Usage Examples

### Get Quote for BankNifty
```bash
curl -X POST "http://localhost:8000/api/quote" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BANKNIFTY", "period": "1d", "interval": "5m"}'
```

### Get Multiple Quotes
```bash
curl -X POST "http://localhost:8000/api/quotes" \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["NIFTY", "BANKNIFTY", "TCS"]}'
```

### Get Technical Indicators
```bash
curl -X POST "http://localhost:8000/api/technical-indicators" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BANKNIFTY", "period": "1mo"}'
```

## 🔌 WebSocket Usage

### Connect and Subscribe
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
  // Subscribe to symbol updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    symbol: 'BANKNIFTY'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

## 📈 Supported Symbols

### NSE Indices
- `NIFTY` → `^NIFTY.NS`
- `BANKNIFTY` → `^BANKNIFTY.NS`
- `NIFTYNXT50` → `^NIFTYNXT50.NS`
- `NIFTYIT` → `^NIFTYIT.NS`
- `NIFTYPHARMA` → `^NIFTYPHARMA.NS`
- `NIFTYAUTO` → `^NIFTYAUTO.NS`
- `NIFTYMETAL` → `^NIFTYMETAL.NS`
- `NIFTYENERGY` → `^NIFTYENERGY.NS`

### Popular Stocks
- `HDFCBANK.NS`, `ICICIBANK.NS`, `SBIN.NS`
- `TCS.NS`, `INFY.NS`, `WIPRO.NS`
- `RELIANCE.NS`, `TATAMOTORS.NS`

## 🧮 Technical Indicators

### Available Indicators
- **RSI** (Relative Strength Index) - 14 period
- **MACD** (Moving Average Convergence Divergence) - 12,26,9
- **ATR** (Average True Range) - 14 period
- **Bollinger Bands** - 20 period, 2 standard deviations
- **VWAP** (Volume Weighted Average Price)

### Calculation Methods
- **RSI**: Standard 14-period calculation
- **MACD**: Exponential Moving Averages
- **ATR**: True Range with rolling mean
- **Bollinger Bands**: Simple Moving Average ± standard deviation

## ⚙️ Configuration

### Environment Variables
```bash
# Server Configuration
HOST=0.0.0.0          # Server host
PORT=8000             # Server port
RELOAD=true           # Auto-reload for development

# Logging
LOG_LEVEL=INFO        # Logging level

# CORS Settings
ALLOWED_ORIGINS=http://localhost:4028,http://localhost:3000

# Yahoo Finance API Settings
YF_TIMEOUT=30         # API timeout in seconds
YF_CACHE_TTL=30       # Cache TTL in seconds

# WebSocket Settings
WS_UPDATE_INTERVAL=5  # Update interval in seconds
```

## 🔧 Development

### Project Structure
```
backend/
├── main.py              # Main FastAPI application
├── start.py             # Startup script
├── requirements.txt     # Python dependencies
├── env.example         # Environment template
└── README.md           # This file
```

### Adding New Features
1. **New Endpoints**: Add routes in `main.py`
2. **New Indicators**: Extend `YahooFinanceService` class
3. **New Data Sources**: Implement new service classes

### Testing
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # macOS/Linux

# Kill process or change port in .env
```

#### 2. Yahoo Finance API Errors
- Check internet connection
- Verify symbol format
- Check API rate limits
- Fallback data will be used automatically

#### 3. CORS Issues
- Verify `ALLOWED_ORIGINS` in `.env`
- Check frontend URL matches allowed origins
- Restart backend after CORS changes

#### 4. WebSocket Connection Issues
- Ensure backend is running
- Check firewall settings
- Verify WebSocket URL in frontend

### Logs
- Check console output for detailed logs
- Log level can be adjusted in `.env`
- WebSocket connections are logged

## 📚 API Documentation

Once the service is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **Update Frontend Service**: Use `pythonBackendService.js`
2. **Environment Variables**: Set `REACT_APP_BACKEND_URL`
3. **Fallback Support**: Automatic fallback to original service
4. **Real-time Updates**: WebSocket integration for live data

## 📈 Performance Tips

- **Caching**: Built-in caching for API responses
- **Batch Operations**: Use `/api/quotes` for multiple symbols
- **WebSocket**: Subscribe to symbols for real-time updates
- **Error Handling**: Graceful fallbacks prevent crashes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the BankNifty Analytics platform.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console logs
4. Create an issue in the repository

---

**Happy Trading! 📈💰**
