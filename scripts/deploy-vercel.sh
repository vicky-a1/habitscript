#!/bin/bash

# Vercel Deployment Script
set -e

echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the application
echo "📦 Building application..."
npm run build:prod

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
echo "🔗 Your application is now live on Vercel"