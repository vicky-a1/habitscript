# 🚀 Deployment Guide

This guide covers all deployment options for the InnerSparks MindBloom application.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

## 🔧 Environment Setup

### 1. Environment Variables

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

Required environment variables:
- `VITE_GROQ_API_KEY`: Your Groq API key for AI functionality
- `VITE_API_BASE_URL`: Base URL for your API endpoints

### 2. Install Dependencies

```bash
npm install
```

## 🏗️ Build Process

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Test Build Process
```bash
npm run test:build
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Quick Deploy
1. Install Vercel CLI: `npm install -g vercel`
2. Run deployment script: `./scripts/deploy-vercel.sh`
3. Follow the prompts to configure your project

#### Manual Setup
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_GROQ_API_KEY`
   - `VITE_API_BASE_URL`
3. Deploy automatically on push to main branch

#### Configuration
- Build command: `npm run build:prod`
- Output directory: `dist`
- Node.js version: 18.x

### Option 2: Netlify

#### Quick Deploy
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run deployment script: `./scripts/deploy-netlify.sh`
3. Configure your site settings

#### Manual Setup
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build:prod`
   - Publish directory: `dist`
3. Set environment variables in Netlify dashboard

### Option 3: Docker

#### Local Docker Deployment
```bash
# Build and run with script
./scripts/deploy-docker.sh

# Or manually
docker build -t innersparks-mindbloom .
docker run -d -p 80:80 --name innersparks-mindbloom innersparks-mindbloom
```

#### Docker Compose
```bash
# Production
docker-compose up -d

# Development
docker-compose --profile dev up -d
```

#### Docker Hub
Images are automatically built and pushed to Docker Hub via GitHub Actions.

### Option 4: AWS S3 + CloudFront

1. Build the application:
   ```bash
   npm run build:prod
   ```

2. Upload `dist/` contents to S3 bucket

3. Configure CloudFront distribution:
   - Origin: Your S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → `/index.html` (for SPA routing)

4. Set up Route 53 for custom domain (optional)

### Option 5: GitHub Pages

1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. The workflow will automatically deploy on push to main

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for automated deployment:

- **Main branch**: Deploys to production (Vercel)
- **Develop branch**: Deploys to staging (Netlify)
- **Pull requests**: Runs tests and builds

### Required Secrets

Set these secrets in your GitHub repository:

#### Vercel
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

#### Netlify
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

#### Docker Hub
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

#### Environment Variables
- `VITE_GROQ_API_KEY`
- `VITE_API_BASE_URL`
- `VITE_GROQ_API_KEY_STAGING` (for staging)
- `VITE_API_BASE_URL_STAGING` (for staging)

## 🔍 Health Checks

### Application Health
- Health endpoint: `/health` (Docker deployments)
- Build verification: `npm run test:build`

### Performance Monitoring
- Lighthouse CI integration available
- Bundle size analysis with `npm run build`

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all environment variables are set
   - Run `npm run type-check` for TypeScript errors

2. **Routing Issues**
   - Ensure SPA routing is configured (handled in platform configs)
   - Check that all routes redirect to `index.html`

3. **API Connection Issues**
   - Verify `VITE_GROQ_API_KEY` is set correctly
   - Check CORS settings if using custom API

4. **Performance Issues**
   - Enable gzip compression (configured in nginx.conf)
   - Verify static asset caching headers
   - Check bundle size with build analysis

### Debug Commands

```bash
# Check build output
npm run build && ls -la dist/

# Verify environment variables
echo $VITE_GROQ_API_KEY

# Test production build locally
npm run preview:prod

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## 📊 Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: Google PageSpeed Insights, GTmetrix
- **Errors**: Sentry, LogRocket
- **Analytics**: Google Analytics, Mixpanel

### Metrics to Monitor
- Page load times
- Core Web Vitals
- Error rates
- API response times
- User engagement

## 🔐 Security

### Security Headers
All deployment configurations include:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### Best Practices
- Never commit API keys to version control
- Use environment variables for sensitive data
- Enable HTTPS for all deployments
- Regularly update dependencies
- Monitor for security vulnerabilities

## 📞 Support

For deployment issues:
1. Check this documentation
2. Review GitHub Actions logs
3. Check platform-specific documentation
4. Create an issue in the repository

---

**Happy Deploying! 🎉**