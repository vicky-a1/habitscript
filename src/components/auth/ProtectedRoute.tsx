import { ReactNode, useEffect, useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { teacherAuthService } from '@/services/teacherAuthService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertTriangle, Clock } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: ReactNode;
  onUnauthorized?: () => void;
}

interface AccessDeniedProps {
  reason: string;
  onRetry?: () => void;
  showLogin?: boolean;
}

const AccessDenied = ({ reason, onRetry, showLogin }: AccessDeniedProps) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
    <Card className="max-w-md w-full p-8 text-center border-red-200 shadow-lg">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
        <p className="text-red-600 mb-4">{reason}</p>
        <div className="flex items-center justify-center gap-2 text-sm text-red-500">
          <Shield className="w-4 h-4" />
          <span>This area is protected by security measures</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {showLogin && (
          <Button 
            onClick={onRetry}
            className="w-full bg-red-600"
          >
            Try Teacher Login
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
          className="w-full border-red-200 text-red-600"
        >
          Return to Home
        </Button>
      </div>
      
      <div className="mt-6 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4" />
          <span>If you believe this is an error, contact your administrator</span>
        </div>
      </div>
    </Card>
  </div>
);

const SessionExpired = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
    <Card className="max-w-md w-full p-8 text-center border-yellow-200 shadow-lg">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-yellow-800 mb-2">Session Expired</h2>
        <p className="text-yellow-600 mb-4">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={onRefresh}
          className="w-full bg-yellow-600"
        >
          Login Again
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
          className="w-full border-yellow-200 text-yellow-600"
        >
          Return to Home
        </Button>
      </div>
    </Card>
  </div>
);

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallback, 
  onUnauthorized 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, sessionValid, logout, refreshSession } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      setIsValidating(true);
      
      try {
        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          teacherAuthService.logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', undefined, {
            requiredRole,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          });
          setAccessGranted(false);
          setIsValidating(false);
          return;
        }

        // Check session validity
        if (!sessionValid || !teacherAuthService.validateSession(user)) {
          teacherAuthService.logSecurityEvent('INVALID_SESSION_ACCESS', user.id, {
            requiredRole,
            sessionExpired: true,
          });
          logout();
          setAccessGranted(false);
          setIsValidating(false);
          return;
        }

        // Check role-based access
        if (requiredRole) {
          const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          const hasRequiredRole = requiredRoles.includes(user.role);
          
          if (!hasRequiredRole) {
            teacherAuthService.logSecurityEvent('INSUFFICIENT_PRIVILEGES', user.id, {
              userRole: user.role,
              requiredRole: requiredRoles,
              accessDenied: true,
            });
            setAccessGranted(false);
            setIsValidating(false);
            onUnauthorized?.();
            return;
          }
        }

        // Log successful access
        teacherAuthService.logSecurityEvent('AUTHORIZED_ACCESS', user.id, {
          requiredRole,
          userRole: user.role,
          accessGranted: true,
        });

        // Refresh session activity
        refreshSession();
        setAccessGranted(true);
        
      } catch (error) {
        console.error('Access validation error:', error);
        teacherAuthService.logSecurityEvent('ACCESS_VALIDATION_ERROR', user?.id, {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        setAccessGranted(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [isAuthenticated, user, sessionValid, requiredRole, refreshSession, logout, onUnauthorized]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Validating access permissions...</p>
        </Card>
      </div>
    );
  }

  // Handle different access denial scenarios
  if (!isAuthenticated || !user) {
    if (fallback) return <>{fallback}</>;
    return (
      <AccessDenied 
        reason="You must be logged in to access this area."
        showLogin={true}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!sessionValid) {
    return (
      <SessionExpired 
        onRefresh={() => window.location.reload()}
      />
    );
  }

  if (requiredRole && !accessGranted) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const roleText = requiredRoles.join(' or ');
    
    if (fallback) return <>{fallback}</>;
    return (
      <AccessDenied 
        reason={`This area is restricted to ${roleText} accounts only. Your current role (${user.role}) does not have sufficient privileges.`}
        onRetry={() => logout()}
        showLogin={false}
      />
    );
  }

  // Access granted - render protected content
  return <>{children}</>;
};

// Convenience components for specific roles
export const TeacherOnlyRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) => (
  <ProtectedRoute requiredRole="teacher" {...props}>
    {children}
  </ProtectedRoute>
);

export const AdminOnlyRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) => (
  <ProtectedRoute requiredRole="admin" {...props}>
    {children}
  </ProtectedRoute>
);

export const TeacherOrAdminRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) => (
  <ProtectedRoute requiredRole={['teacher', 'admin']} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;