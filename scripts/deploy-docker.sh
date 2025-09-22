#!/bin/bash

# Docker Deployment Script
set -e

echo "🐳 Starting Docker deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Build Docker image
echo "📦 Building Docker image..."
docker build -t innersparks-mindbloom:latest .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop innersparks-mindbloom 2>/dev/null || true
docker rm innersparks-mindbloom 2>/dev/null || true

# Run new container
echo "🚀 Starting new container..."
docker run -d \
  --name innersparks-mindbloom \
  --restart unless-stopped \
  -p 80:80 \
  innersparks-mindbloom:latest

echo "✅ Docker deployment completed successfully!"
echo "🔗 Your application is now running at http://localhost"
echo "📊 Container status:"
docker ps | grep innersparks-mindbloom