#!/bin/bash

# Netlify Deployment Script
set -e

echo "🚀 Starting Netlify deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Build the application
echo "📦 Building application..."
npm run build:prod

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Deployment completed successfully!"
echo "🔗 Your application is now live on Netlify"