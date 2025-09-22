# InnerSparks MindBloom 🧠✨

> AI-powered mindfulness and personal growth platform

## 🚦 Production Status

⚠️ **Not Production Ready**

**Required Actions Before Production:**
- [ ] Configure `VITE_GROQ_API_KEY` environment variable
- [ ] Set up `VITE_SENTRY_DSN` for error tracking
- [ ] Configure production API endpoints
- [ ] Verify SSL certificates and domain configuration
- [ ] Complete security audit and penetration testing
- [ ] Set up monitoring and alerting systems

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Requirements](#system-requirements)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Production Readiness Checklist](#production-readiness-checklist)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Project Overview

InnerSparks MindBloom is a modern React-based web application that provides AI-powered mindfulness and personal growth tools. The platform features:

- **AI-Powered Mentoring**: Intelligent guidance using Groq API
- **Student Journaling**: Secure, private journaling with analytics
- **Teacher Dashboard**: Comprehensive student progress monitoring
- **Mental Health Support**: Integrated wellness tools and resources
- **Premium Features**: Advanced analytics and personalized insights

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI Components
- **State Management**: React Context + Custom Hooks
- **Build Tool**: Vite with SWC
- **Deployment**: Netlify (Primary), Vercel (Alternative)
- **Monitoring**: Sentry for error tracking
- **AI Integration**: Groq API for language models

---

## 💻 System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn 1.22.0+)
- **Git**: 2.30.0 or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Recommended Requirements
- **Node.js**: 20.0.0 or higher
- **RAM**: 8GB or more
- **Storage**: 2GB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Development Tools
- **Code Editor**: VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vicky-a1/habitscript.git
cd habitscript
```

### 2. Install Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

### 5. Verify Installation

1. Open your browser to the development URL
2. Check that the application loads without errors
3. Verify the browser console shows no critical errors
4. Test basic navigation between pages

---

## ⚙️ Configuration

### Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file based on `.env.example`:

#### Required Variables

```bash
# API Configuration (REQUIRED)
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_API_BASE_URL=https://api.innersparks.com

# Error Tracking (REQUIRED for production)
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_SENTRY_ENVIRONMENT=production
```

#### Optional Variables

```bash
# Application Metadata
VITE_APP_NAME=InnerSparks MindBloom
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-powered mindfulness and personal growth platform

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
VITE_ENABLE_PREMIUM_FEATURES=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_MIXPANEL_TOKEN=your_mixpanel_token

# Security
VITE_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Configuration Files

#### `vite.config.ts`
- Build configuration and optimization settings
- Development server configuration
- Plugin configuration (React, component tagger)
- Path aliases and module resolution

#### `tailwind.config.ts`
- Tailwind CSS customization
- Theme configuration
- Custom utilities and components

#### `tsconfig.json`
- TypeScript compiler options
- Module resolution settings
- Type checking configuration

### Custom Settings

#### Build Optimization
The application includes several build optimizations:

- **Code Splitting**: Vendor libraries are split into separate chunks
- **Tree Shaking**: Unused code is automatically removed
- **Minification**: Production builds are minified using Terser
- **Source Maps**: Available in development mode for debugging

#### Security Headers
Configured in `netlify.toml` and `vercel.json`:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- XSS Protection
- Referrer Policy

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build:dev        # Build for development
npm run preview          # Preview production build locally

# Production
npm run build            # Build for production
npm run build:prod       # Build for production (explicit)
npm run preview:prod     # Build and preview production

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run type-check       # Run TypeScript type checking

# Testing & Validation
npm run test:build       # Run type-check, lint, and build
npm run validate:workflow # Validate GitHub workflow

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:netlify   # Deploy to Netlify

# Utilities
npm run clean            # Clean build directory
```

### Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in the `src/` directory
3. **Test Changes**: Verify in browser with hot reload
4. **Type Check**: `npm run type-check`
5. **Lint Code**: `npm run lint:fix`
6. **Build Test**: `npm run test:build`
7. **Commit Changes**: Follow conventional commit format

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── auth/           # Authentication components
│   ├── habits/         # Habit tracking components
│   ├── journal/        # Journaling components
│   └── mental-health/  # Mental health tools
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Page components
├── services/           # API services and external integrations
└── main.tsx           # Application entry point
```

---

## 🚀 Deployment

### Netlify Deployment (Recommended)

#### Prerequisites
- Netlify account
- GitHub repository connected to Netlify
- Environment variables configured in Netlify dashboard

#### Step-by-Step Guide

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "feat: prepare for deployment"
   git push origin main
   ```

2. **Configure Netlify**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build:prod`
     - **Publish directory**: `dist`
     - **Node version**: `18`

3. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   VITE_GROQ_API_KEY=your_actual_groq_api_key
   VITE_SENTRY_DSN=your_actual_sentry_dsn
   VITE_API_BASE_URL=https://your-api-domain.com
   VITE_SENTRY_ENVIRONMENT=production
   ```

4. **Deploy**
   ```bash
   # Trigger deployment
   git push origin main
   ```

5. **Verify Deployment**
   - Check build logs in Netlify dashboard
   - Visit your deployed site URL
   - Test all major functionality
   - Verify environment variables are working

#### Build Command Specifications

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build:prod"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
```

#### Post-Deployment Verification

1. **Functional Testing**
   - [ ] Homepage loads correctly
   - [ ] Navigation works between all pages
   - [ ] AI chat functionality works (requires API key)
   - [ ] Journal features are accessible
   - [ ] Authentication flows work properly

2. **Performance Testing**
   - [ ] Page load times < 3 seconds
   - [ ] Lighthouse score > 90
   - [ ] No console errors in production
   - [ ] Mobile responsiveness verified

3. **Security Testing**
   - [ ] HTTPS enabled and working
   - [ ] Security headers present
   - [ ] No sensitive data exposed in client
   - [ ] CSP policies working correctly

### Alternative: Vercel Deployment

#### Quick Deploy
```bash
npm run deploy:vercel
```

#### Manual Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel dashboard

### GitHub Actions CI/CD

The repository includes automated deployment via GitHub Actions:

```yaml
# .github/workflows/deploy.yml
- Runs on push to main branch
- Executes type checking and linting
- Builds the application
- Deploys to configured platforms
```

---

## ✅ Production Readiness Checklist

### 🔧 Environment Configuration
- [ ] **API Keys Configured**
  - [ ] `VITE_GROQ_API_KEY` set with valid key
  - [ ] API key has sufficient quota/limits
  - [ ] API endpoints are accessible from production domain

- [ ] **Error Tracking Setup**
  - [ ] `VITE_SENTRY_DSN` configured
  - [ ] Sentry project created and configured
  - [ ] Error alerts configured for critical issues

- [ ] **Environment Variables**
  - [ ] All required variables set in deployment platform
  - [ ] No sensitive data in client-side code
  - [ ] Production URLs configured correctly

### 🏗️ Build & Performance
- [ ] **Build Process**
  - [ ] `npm run build:prod` completes without errors
  - [ ] TypeScript compilation passes (`npm run type-check`)
  - [ ] Linting passes (`npm run lint`)
  - [ ] Bundle size optimized (< 1MB gzipped)

- [ ] **Performance Optimizations**
  - [ ] Code splitting implemented
  - [ ] Lazy loading for routes
  - [ ] Image optimization
  - [ ] CDN configured for static assets

### 🔒 Security Measures
- [ ] **Security Headers**
  - [ ] Content Security Policy (CSP) configured
  - [ ] X-Frame-Options set to SAMEORIGIN
  - [ ] X-Content-Type-Options set to nosniff
  - [ ] HTTPS enforced (HSTS headers)

- [ ] **Data Protection**
  - [ ] No API keys or secrets in client code
  - [ ] Input validation on all forms
  - [ ] XSS protection enabled
  - [ ] CSRF protection where applicable

### 🌐 API & Endpoints
- [ ] **API Integration**
  - [ ] All API endpoints tested and working
  - [ ] Error handling for API failures
  - [ ] Rate limiting considerations
  - [ ] Fallback mechanisms for API downtime

- [ ] **External Services**
  - [ ] Groq API integration tested
  - [ ] Sentry error reporting working
  - [ ] Analytics tracking (if enabled)

### 📊 Monitoring & Analytics
- [ ] **Error Monitoring**
  - [ ] Sentry configured and receiving errors
  - [ ] Alert thresholds set for critical errors
  - [ ] Error reporting dashboard accessible

- [ ] **Performance Monitoring**
  - [ ] Core Web Vitals tracking
  - [ ] Page load time monitoring
  - [ ] User experience metrics

### 🧪 Testing & Quality Assurance
- [ ] **Functional Testing**
  - [ ] All user flows tested end-to-end
  - [ ] Cross-browser compatibility verified
  - [ ] Mobile responsiveness tested
  - [ ] Accessibility standards met (WCAG 2.1 AA)

- [ ] **Load Testing**
  - [ ] Application tested under expected load
  - [ ] Database performance verified
  - [ ] CDN performance tested

### 🚀 Deployment & Infrastructure
- [ ] **Deployment Pipeline**
  - [ ] CI/CD pipeline configured and tested
  - [ ] Automated testing in pipeline
  - [ ] Rollback strategy defined
  - [ ] Blue-green deployment capability

- [ ] **Infrastructure**
  - [ ] SSL certificates valid and auto-renewing
  - [ ] Domain configuration correct
  - [ ] CDN configured for global distribution
  - [ ] Backup and disaster recovery plan

### 📋 Documentation & Support
- [ ] **Documentation**
  - [ ] User documentation complete
  - [ ] API documentation updated
  - [ ] Deployment runbook created
  - [ ] Incident response procedures documented

- [ ] **Support Systems**
  - [ ] Support contact information available
  - [ ] Issue tracking system configured
  - [ ] User feedback collection mechanism

---

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### Environment Variable Issues
```bash
# Verify variables are loaded
npm run dev
# Check browser console for undefined variables
```

#### API Connection Issues
- Verify `VITE_GROQ_API_KEY` is set correctly
- Check API endpoint accessibility
- Verify CORS configuration
- Check network connectivity

#### Deployment Issues
- Verify build command in deployment platform
- Check environment variables in deployment dashboard
- Review build logs for specific errors
- Ensure Node.js version matches requirements

### Getting Help

1. **Check Documentation**: Review this README and existing docs
2. **Search Issues**: Check GitHub issues for similar problems
3. **Create Issue**: Open a new GitHub issue with:
   - Detailed problem description
   - Steps to reproduce
   - Environment information
   - Error messages and logs

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`
5. Make changes and test thoroughly
6. Run quality checks: `npm run test:build`
7. Commit with conventional format: `git commit -m "feat: add new feature"`
8. Push and create a pull request

### Code Standards
- Follow TypeScript best practices
- Use Prettier for code formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Groq** for AI language model integration

---

**Made with ❤️ by the InnerSparks Team**

For questions or support, please [open an issue](https://github.com/vicky-a1/habitscript/issues) or contact our team.