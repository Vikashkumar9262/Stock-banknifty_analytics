# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

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

Build the application for production:

```bash
npm run build
```

## 🔄 Integration

The frontend automatically integrates with the Python backend:

1. **Automatic Fallback**: If Python backend is unavailable, falls back to original service
2. **Real-time Updates**: WebSocket integration for live data
3. **Enhanced Data**: Additional technical indicators and market analysis
4. **Performance**: Faster data fetching with Python's async capabilities