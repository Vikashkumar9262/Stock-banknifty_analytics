# 🚀 Deployment Guide

This guide covers deploying BankNifty Analytics to various platforms.

## 📋 Prerequisites

- GitHub repository set up
- Node.js 18+ installed
- Python 3.8+ installed
- Git configured

## 🌐 Frontend Deployment

### GitHub Pages (Free)

1. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created by GitHub Actions)
   - Folder: `/ (root)`

2. **Automatic Deployment:**
   - Push to `main` branch
   - GitHub Actions will auto-deploy to `gh-pages`
   - Site available at: `https://username.github.io/repository-name`

### Vercel (Recommended)

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables:**
   ```bash
   REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
   ```

3. **Custom Domain (Optional):**
   - Add domain in Vercel dashboard
   - Update DNS records

### Netlify

1. **Connect Repository:**
   - Link GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`

2. **Environment Variables:**
   - Add in Netlify dashboard
   - Same as Vercel

## 🐍 Backend Deployment

### Railway (Recommended)

1. **Connect Repository:**
   - Go to [Railway.app](https://railway.app)
   - Connect GitHub repository
   - Select backend directory

2. **Environment Variables:**
   ```bash
   HOST=0.0.0.0
   PORT=8000
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

3. **Auto-deploy:**
   - Railway auto-deploys on push to main
   - Provides HTTPS URL

### Heroku

1. **Create App:**
   ```bash
   # Install Heroku CLI
   heroku create your-app-name
   ```

2. **Add Procfile:**
   ```bash
   # backend/Procfile
   web: uvicorn main:app --host 0.00.0 --port $PORT
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **Environment Variables:**
   ```bash
   heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

### DigitalOcean App Platform

1. **Create App:**
   - Connect GitHub repository
   - Select Python runtime
   - Set build command: `pip install -r requirements.txt`
   - Set run command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables:**
   - Add in DigitalOcean dashboard

## 🔧 Full-Stack Deployment

### Option 1: Vercel + Railway

1. **Frontend (Vercel):**
   - Deploy React app
   - Set backend URL environment variable

2. **Backend (Railway):**
   - Deploy Python backend
   - Update CORS origins

3. **Connect:**
   - Update frontend environment variables
   - Test integration

### Option 2: GitHub Pages + Railway

1. **Frontend (GitHub Pages):**
   - Enable GitHub Pages
   - GitHub Actions auto-deploy

2. **Backend (Railway):**
   - Deploy Python backend
   - Update CORS origins

3. **Connect:**
   - Update frontend environment variables
   - Test integration

## 🌍 Environment Configuration

### Frontend Environment

Create `.env.production`:

```bash
REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
REACT_APP_BACKEND_WS_URL=wss://your-backend-url.railway.app/ws
REACT_APP_GITHUB_URL=https://github.com/yourusername/banknifty-analytics
```

### Backend Environment

Create `backend/.env`:

```bash
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=https://your-frontend-domain.com
LOG_LEVEL=INFO
YF_TIMEOUT=30
YF_CACHE_TTL=30
WS_UPDATE_INTERVAL=5
```

## 🔒 Security Considerations

### CORS Configuration

Update backend CORS origins:

```python
# backend/main.py
origins = [
    "http://localhost:3000",
    "http://localhost:4028",
    "https://your-frontend-domain.com",
    "https://username.github.io"
]
```

### Environment Variables

- Never commit `.env` files
- Use platform-specific secret management
- Rotate API keys regularly

## 📊 Monitoring & Analytics

### Frontend Analytics

1. **Google Analytics:**
   ```bash
   REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
   ```

2. **Error Tracking:**
   - Sentry integration
   - LogRocket for session replay

### Backend Monitoring

1. **Health Checks:**
   - `/health` endpoint
   - Uptime monitoring

2. **Logging:**
   - Structured logging
   - Error tracking

## 🚀 CI/CD Pipeline

### GitHub Actions

The project includes automated deployment:

1. **On Push to Main:**
   - Build frontend
   - Test backend
   - Deploy to GitHub Pages

2. **Manual Deployment:**
   ```bash
   # Trigger workflow manually
   # Go to Actions tab > Deploy workflow > Run workflow
   ```

## 🔄 Update Process

### Frontend Updates

1. **Development:**
   ```bash
   npm start
   # Make changes
   npm test
   npm run build
   ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   # Auto-deploys via GitHub Actions
   ```

### Backend Updates

1. **Development:**
   ```bash
   cd backend
   python start.py
   # Make changes
   python test_backend.py
   ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "feat: new API endpoint"
   git push origin main
   # Auto-deploys via Railway/Heroku
   ```

## 🧪 Testing Deployment

### Frontend Testing

1. **Build Test:**
   ```bash
   npm run build
   npm run serve
   ```

2. **Production Test:**
   - Visit deployed URL
   - Test all features
   - Check console for errors

### Backend Testing

1. **Local Test:**
   ```bash
   cd backend
   python test_backend.py
   ```

2. **Production Test:**
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check `ALLOWED_ORIGINS` in backend
   - Verify frontend URL is included

2. **Build Failures:**
   - Check Node.js version
   - Verify all dependencies installed

3. **Backend Not Starting:**
   - Check port availability
   - Verify Python version
   - Check environment variables

### Debug Commands

```bash
# Frontend
npm run build --verbose
npm run serve

# Backend
cd backend
python -c "import main; print('Backend imports successfully')"
uvicorn main:app --reload --log-level debug
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [GitHub Pages Documentation](https://pages.github.com)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

**Happy Deploying! 🚀✨**
