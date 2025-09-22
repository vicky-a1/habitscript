import { useState, useEffect } from 'react';
import { useAuth, TeacherCredentials } from '@/contexts/AuthContext';
import { teacherAuthService } from '@/services/teacherAuthService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface TeacherLoginProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  redirectTo?: string;
}

export const TeacherLogin = ({ onSuccess, onCancel, redirectTo }: TeacherLoginProps) => {
  const { loginTeacher, isAuthenticated, isTeacher } = useAuth();
  const [credentials, setCredentials] = useState<TeacherCredentials>({
    email: '',
    password: '',
    teacherId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated as teacher
  useEffect(() => {
    if (isAuthenticated && isTeacher) {
      onSuccess?.();
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    }
  }, [isAuthenticated, isTeacher, onSuccess, redirectTo]);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        const now = new Date();
        if (now >= lockoutTime) {
          setLockoutTime(null);
          setAttempts(0);
          setError('');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!credentials.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Teacher ID validation
    if (!credentials.teacherId) {
      errors.teacherId = 'Teacher ID is required';
    } else if (!/^[TA]\d{3}$/.test(credentials.teacherId)) {
      errors.teacherId = 'Teacher ID must be in format T001 or A001';
    }

    // Password validation
    if (!credentials.password) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime) {
      setError('Account is temporarily locked. Please wait before trying again.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use the secure authentication service
      const result = await teacherAuthService.validateCredentials(credentials);
      
      if (result.success && result.user) {
        // Use the enhanced login method
        const loginSuccess = await loginTeacher(credentials);
        
        if (loginSuccess) {
          teacherAuthService.logSecurityEvent('SUCCESSFUL_LOGIN', result.user.id, {
            email: credentials.email,
            timestamp: new Date().toISOString(),
          });
          
          setAttempts(0);
          onSuccess?.();
          
          if (redirectTo) {
            window.location.href = redirectTo;
          }
        } else {
          throw new Error('Login failed after validation');
        }
      } else {
        setAttempts(prev => prev + 1);
        setError(result.error || 'Invalid credentials');
        
        // Implement progressive lockout
        if (attempts >= 2) { // After 3 failed attempts
          const lockDuration = 15 * 60 * 1000; // 15 minutes
          setLockoutTime(new Date(Date.now() + lockDuration));
          setError('Too many failed attempts. Account locked for 15 minutes.');
        }
        
        teacherAuthService.logSecurityEvent('FAILED_LOGIN_ATTEMPT', undefined, {
          email: credentials.email,
          attempts: attempts + 1,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Authentication service is currently unavailable. Please try again later.');
      
      teacherAuthService.logSecurityEvent('LOGIN_ERROR', undefined, {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: credentials.email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TeacherCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getRemainingLockoutTime = (): string => {
    if (!lockoutTime) return '';
    
    const now = new Date();
    const remaining = Math.max(0, lockoutTime.getTime() - now.getTime());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Teacher Portal</h1>
          <p className="text-gray-600">Secure access for educators only</p>
        </div>

        {/* Security Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This is a secure area. All login attempts are monitored and logged.
          </AlertDescription>
        </Alert>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Lockout Timer */}
        {lockoutTime && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Account locked. Time remaining: {getRemainingLockoutTime()}
            </AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="teacher@school.edu"
                className={`pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
                disabled={isLoading || !!lockoutTime}
                autoComplete="email"
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Teacher ID Field */}
          <div className="space-y-2">
            <Label htmlFor="teacherId" className="text-sm font-medium text-gray-700">
              Teacher ID
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="teacherId"
                type="text"
                value={credentials.teacherId}
                onChange={(e) => handleInputChange('teacherId', e.target.value.toUpperCase())}
                placeholder="T001"
                className={`pl-10 ${validationErrors.teacherId ? 'border-red-300' : ''}`}
                disabled={isLoading || !!lockoutTime}
                autoComplete="username"
              />
            </div>
            {validationErrors.teacherId && (
              <p className="text-sm text-red-600">{validationErrors.teacherId}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your secure password"
                className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-300' : ''}`}
                disabled={isLoading || !!lockoutTime}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={isLoading || !!lockoutTime}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 disabled:opacity-50"
            disabled={isLoading || !!lockoutTime}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Authenticating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Secure Login
              </div>
            )}
          </Button>

          {/* Cancel Button */}
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </form>

        {/* Security Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Protected by enterprise-grade security</p>
          <p>All access attempts are logged and monitored</p>
        </div>
      </Card>
    </div>
  );
};

export default TeacherLogin;