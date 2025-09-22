# GitHub Secrets Configuration

This document lists all the required GitHub repository secrets that need to be configured for the CI/CD pipeline to work properly.

## Required Secrets

### Application Environment Variables

#### Production Environment (Vercel Deployment)
- `VITE_GROQ_API_KEY` - Your Groq API key for production
- `VITE_API_BASE_URL` - Base URL for your production API

#### Staging Environment (Netlify Deployment)
- `VITE_GROQ_API_KEY_STAGING` - Your Groq API key for staging
- `VITE_API_BASE_URL_STAGING` - Base URL for your staging API

### Vercel Deployment Secrets
- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### Netlify Deployment Secrets
- `NETLIFY_AUTH_TOKEN` - Your Netlify authentication token
- `NETLIFY_SITE_ID` - Your Netlify site ID

### Docker Hub Secrets
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token

### Automatically Available Secrets
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions (no configuration needed)

## How to Configure Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name listed above
5. Enter the corresponding value for each secret

## Getting the Required Values

### Vercel Secrets
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. **VERCEL_TOKEN**: Account Settings → Tokens → Create Token
3. **VERCEL_ORG_ID**: Team Settings → General → Team ID
4. **VERCEL_PROJECT_ID**: Project Settings → General → Project ID

### Netlify Secrets
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. **NETLIFY_AUTH_TOKEN**: User Settings → Applications → Personal access tokens
3. **NETLIFY_SITE_ID**: Site Settings → General → Site details → Site ID

### Docker Hub Secrets
1. Go to [Docker Hub](https://hub.docker.com/)
2. **DOCKER_USERNAME**: Your Docker Hub username
3. **DOCKER_PASSWORD**: Account Settings → Security → Access Tokens → New Access Token

### API Keys
- **VITE_GROQ_API_KEY**: Get from [Groq Console](https://console.groq.com/)
- **VITE_API_BASE_URL**: Your backend API URL (e.g., `https://api.yourdomain.com`)

## Security Best Practices

1. **Never commit secrets to your repository**
2. **Use different API keys for production and staging**
3. **Regularly rotate your tokens and keys**
4. **Use minimal permissions for service tokens**
5. **Monitor secret usage in your deployment logs**

## Troubleshooting

If your deployment fails:

1. **Check secret names** - They must match exactly (case-sensitive)
2. **Verify secret values** - Ensure no extra spaces or characters
3. **Check token permissions** - Ensure tokens have required scopes
4. **Review workflow logs** - Look for specific error messages

## Workflow Triggers

- **Main branch**: Deploys to Vercel (production) and builds Docker image
- **Develop branch**: Deploys to Netlify (staging)
- **Pull requests**: Runs tests only (no deployment)