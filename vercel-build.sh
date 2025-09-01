#!/bin/bash

# Vercel Build Script - Frontend Only
echo "🚀 Starting Vercel build for BankNifty Analytics Frontend..."

# Ensure we're in the right directory
echo "📁 Current directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. This should be a Node.js project."
    exit 1
fi

# Check if backend directory exists and warn
if [ -d "backend" ]; then
    echo "⚠️  Warning: backend/ directory detected but will be ignored for frontend build"
fi

# Install Node.js dependencies only
echo "📦 Installing Node.js dependencies..."
npm install

# Build the React app
echo "🏗️  Building React application..."
npm run build

# Verify build output
if [ -d "build" ]; then
    echo "✅ Build successful! Output directory: build/"
    ls -la build/
else
    echo "❌ Build failed! build/ directory not found."
    exit 1
fi

echo "🎉 Frontend build completed successfully!"
