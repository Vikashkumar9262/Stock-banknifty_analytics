# 🚀 BankNifty Analytics

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-blue.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Ready-brightgreen.svg)](https://github.com/)

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications with a Python FastAPI backend for real-time financial data.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup
- **🐍 Python Backend** - FastAPI backend with Yahoo Finance integration for live market data

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- **Python 3.8+** (for backend)
- pip package manager

## 🛠️ Installation

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### 🐍 Python Backend Setup

The project now includes a Python backend for fetching live Yahoo Finance data:

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend:**
   ```bash
   # Windows
   start.bat

   # macOS/Linux
   ./start.sh

   # Or manually
   python start.py
   ```

5. **Verify backend is running:**
   - Backend URL: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── services/       # API services
│   │   ├── yahooFinanceService.js    # Original Yahoo Finance service
│   │   └── pythonBackendService.js   # New Python backend service
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── backend/            # 🐍 Python Backend
│   ├── main.py         # FastAPI application
│   ├── start.py        # Startup script
│   ├── requirements.txt # Python dependencies
│   ├── start.bat       # Windows startup script
│   ├── start.sh        # Unix startup script
│   ├── test_backend.py # Backend testing script
│   └── README.md       # Backend documentation
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 🐍 Backend Features

The Python backend provides:

- **Real-time Data**: Live quotes, charts, and technical indicators
- **WebSocket Support**: Real-time streaming updates
- **Technical Analysis**: RSI, MACD, ATR, Bollinger Bands, VWAP
- **Indian Market Support**: Optimized for NSE indices and stocks
- **Fallback System**: Graceful degradation when APIs fail
- **High Performance**: Async/await architecture with FastAPI

### Backend API Endpoints

- **GET** `/health` - Service health status
- **POST** `/api/quote` - Get real-time quote for a symbol
- **POST** `/api/quotes` - Get quotes for multiple symbols
- **POST** `/api/chart` - Get historical chart data
- **POST** `/api/technical-indicators` - Get technical indicators
- **GET** `/api/search/{query}` - Search for symbols
- **WS** `/ws` - Real-time data streaming

### Testing the Backend

```bash
cd backend
python test_backend.py
```

## 📦 Deployment

### Frontend Build

Build the application for production:

```bash
npm run build
```

### Backend Deployment

The Python backend can be deployed to various platforms:

#### Heroku
```bash
# Add Procfile
web: uvicorn main:app --host 0.0.0.0 --port $PORT

# Deploy
heroku create your-app-name
git push heroku main
```

#### Railway
```bash
# Connect your GitHub repo
# Railway will auto-deploy on push
```

#### Vercel (Frontend) + Railway (Backend)
```bash
# Frontend: Connect to Vercel
# Backend: Deploy to Railway
# Update CORS origins in backend
```

## 🚀 GitHub Deployment

### 1. Repository Setup

1. **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: BankNifty Analytics with Python Backend"
   git branch -M main
   git remote add origin https://github.com/yourusername/banknifty-analytics.git
   git push -u origin main
   ```

2. **Enable GitHub Pages (Optional):**
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)

### 2. Environment Variables

Create `.env.example` files for both frontend and backend:

```bash
# Frontend (.env.example)
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_GITHUB_URL=https://github.com/yourusername/banknifty-analytics

# Backend (backend/.env.example)
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:4028,http://localhost:3000
```

### 3. GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## 🔄 Integration

The frontend automatically integrates with the Python backend:

1. **Automatic Fallback**: If Python backend is unavailable, falls back to original service
2. **Real-time Updates**: WebSocket integration for live data
3. **Enhanced Data**: Additional technical indicators and market analysis
4. **Performance**: Faster data fetching with Python's async capabilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/yourusername/banknifty-analytics#readme)
- 🐛 [Report a Bug](https://github.com/yourusername/banknifty-analytics/issues)
- 💡 [Request a Feature](https://github.com/yourusername/banknifty-analytics/issues)
- 📧 [Contact](mailto:your-email@example.com)

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS
- Enhanced with Python FastAPI backend
- Deployed on GitHub

---

**Built with ❤️ on Rocket.new**

[⬆ Back to top](#-banknifty-analytics)
