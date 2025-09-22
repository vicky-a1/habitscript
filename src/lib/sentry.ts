import * as Sentry from '@sentry/react';

// Sentry configuration for InnerSparks MindBloom
export const initSentry = () => {
  // Only initialize Sentry in production or when DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    
    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    
    // Set tracing origins to track API calls
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/api\.groq\.com/,
      /^https:\/\/.*\.vercel\.app/,
      /^https:\/\/.*\.netlify\.app/,
    ],
    
    // Performance monitoring sample rate (10% in production)
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    
    // Error sampling (capture all errors)
    sampleRate: 1.0,
    
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Additional configuration
    beforeSend(event, hint) {
      // Filter out non-critical errors in production
      if (import.meta.env.MODE === 'production') {
        // Don't send network errors that are likely user connectivity issues
        if (event.exception?.values?.[0]?.type === 'NetworkError') {
          return null;
        }
        
        // Don't send errors from browser extensions
        if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
          frame => frame.filename?.includes('extension://')
        )) {
          return null;
        }
      }
      
      return event;
    },
    
    // Set user context
    initialScope: {
      tags: {
        component: 'mindbloom-app',
      },
    },
  });
};

// Custom error boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Performance monitoring helpers
export const startSpan = (name: string, op: string) => {
  return Sentry.startSpan({ name, op }, (span) => span);
};

// Custom error logging
export const logError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};

// User context setting
export const setUserContext = (user: {
  id: string;
  role: string;
  email?: string;
}) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};

// Custom breadcrumb logging
export const addBreadcrumb = (message: string, category: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
};

// Performance monitoring for API calls
export const monitorApiCall = async <T>(
  apiName: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  return await Sentry.startSpan(
    { 
      name: `api.${apiName}`, 
      op: 'http' 
    },
    async (span) => {
      try {
        const result = await apiCall();
        span?.setStatus({ code: 1 }); // OK
        return result;
      } catch (error) {
        span?.setStatus({ code: 2 }); // INTERNAL_ERROR
        logError(error as Error, { apiName });
        throw error;
      }
    }
  );
};

export default Sentry;