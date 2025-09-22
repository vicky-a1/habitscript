import { TeacherCredentials, User, UserRole } from '@/contexts/AuthContext';

export interface AuthAttempt {
  timestamp: Date;
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  sessionTimeout: number; // in minutes
  requireStrongPassword: boolean;
  enableAuditLogging: boolean;
}

class TeacherAuthService {
  private authAttempts: Map<string, AuthAttempt[]> = new Map();
  private lockedAccounts: Map<string, Date> = new Map();
  
  private readonly securityConfig: SecurityConfig = {
    maxLoginAttempts: 3,
    lockoutDuration: 15, // 15 minutes
    sessionTimeout: 30, // 30 minutes
    requireStrongPassword: true,
    enableAuditLogging: true,
  };

  // Simulated teacher database - In production, this would be a secure API call
  private readonly teacherDatabase = [
    {
      id: 'T001',
      email: 'teacher@school.edu',
      password: 'SecureTeacher123!', // In production, this would be hashed
      name: 'Ms. Sarah Johnson',
      department: 'Mathematics',
      role: 'teacher' as UserRole,
      isActive: true,
      lastLogin: null,
      permissions: ['view_students', 'manage_classes', 'generate_reports'],
    },
    {
      id: 'T002',
      email: 'science.teacher@school.edu',
      password: 'ScienceSecure456!',
      name: 'Dr. Emily Rodriguez',
      department: 'Science',
      role: 'teacher' as UserRole,
      isActive: true,
      lastLogin: null,
      permissions: ['view_students', 'manage_classes', 'generate_reports'],
    },
    {
      id: 'A001',
      email: 'admin@school.edu',
      password: 'AdminSecure789!',
      name: 'Dr. Michael Chen',
      department: 'Administration',
      role: 'admin' as UserRole,
      isActive: true,
      lastLogin: null,
      permissions: ['view_students', 'manage_classes', 'generate_reports', 'manage_teachers', 'system_admin'],
    },
  ];

  /**
   * Validates password strength
   */
  public validatePasswordStrength(password: string): boolean {
    if (!this.securityConfig.requireStrongPassword) return true;
    
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  /**
   * Checks if account is locked due to failed attempts
   */
  private isAccountLocked(email: string): boolean {
    const lockTime = this.lockedAccounts.get(email);
    if (!lockTime) return false;
    
    const now = new Date();
    const lockDuration = this.securityConfig.lockoutDuration * 60 * 1000; // Convert to milliseconds
    
    if (now.getTime() - lockTime.getTime() > lockDuration) {
      // Lock period expired, remove from locked accounts
      this.lockedAccounts.delete(email);
      this.authAttempts.delete(email);
      return false;
    }
    
    return true;
  }

  /**
   * Records authentication attempt
   */
  private recordAuthAttempt(email: string, success: boolean): void {
    if (!this.securityConfig.enableAuditLogging) return;
    
    const attempt: AuthAttempt = {
      timestamp: new Date(),
      email,
      success,
      ipAddress: 'localhost', // In production, get real IP
      userAgent: navigator.userAgent,
    };
    
    const attempts = this.authAttempts.get(email) || [];
    attempts.push(attempt);
    
    // Keep only recent attempts (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentAttempts = attempts.filter(a => a.timestamp > oneDayAgo);
    
    this.authAttempts.set(email, recentAttempts);
    
    // Check for too many failed attempts
    if (!success) {
      const recentFailures = recentAttempts.filter(a => !a.success && a.timestamp > new Date(Date.now() - 60 * 60 * 1000)); // Last hour
      
      if (recentFailures.length >= this.securityConfig.maxLoginAttempts) {
        this.lockedAccounts.set(email, new Date());
        console.warn(`Account locked due to multiple failed attempts: ${email}`);
      }
    }
  }

  /**
   * Validates teacher credentials securely
   */
  public async validateCredentials(credentials: TeacherCredentials): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      // Input validation
      if (!credentials.email || !credentials.password || !credentials.teacherId) {
        return { success: false, error: 'All fields are required' };
      }

      // Check if account is locked
      if (this.isAccountLocked(credentials.email)) {
        this.recordAuthAttempt(credentials.email, false);
        return { 
          success: false, 
          error: `Account temporarily locked. Please try again in ${this.securityConfig.lockoutDuration} minutes.` 
        };
      }

      // Validate password strength
      if (!this.validatePasswordStrength(credentials.password)) {
        this.recordAuthAttempt(credentials.email, false);
        return { 
          success: false, 
          error: 'Password does not meet security requirements' 
        };
      }

      // Find teacher in database
      const teacher = this.teacherDatabase.find(
        t => t.email.toLowerCase() === credentials.email.toLowerCase() && 
             t.id === credentials.teacherId &&
             t.isActive
      );

      if (!teacher) {
        this.recordAuthAttempt(credentials.email, false);
        return { success: false, error: 'Invalid credentials' };
      }

      // Verify password (in production, use proper password hashing)
      if (teacher.password !== credentials.password) {
        this.recordAuthAttempt(credentials.email, false);
        return { success: false, error: 'Invalid credentials' };
      }

      // Successful authentication
      this.recordAuthAttempt(credentials.email, true);
      
      // Clear any previous failed attempts
      this.authAttempts.delete(credentials.email);
      this.lockedAccounts.delete(credentials.email);

      // Create user object
      const user: User = {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        joinedAt: new Date(),
        lastActivity: new Date(),
        sessionToken: this.generateSecureToken(),
      };

      return { success: true, user };

    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication service unavailable' };
    }
  }

  /**
   * Generates a secure session token
   */
  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Gets authentication attempts for audit purposes
   */
  public getAuthAttempts(email: string): AuthAttempt[] {
    return this.authAttempts.get(email) || [];
  }

  /**
   * Checks if user has specific permission
   */
  public hasPermission(userId: string, permission: string): boolean {
    const teacher = this.teacherDatabase.find(t => t.id === userId);
    return teacher?.permissions.includes(permission) || false;
  }

  /**
   * Validates session token
   */
  public validateSession(user: User): boolean {
    if (!user.sessionToken || !user.lastActivity) return false;
    
    const now = new Date();
    const lastActivity = new Date(user.lastActivity);
    const sessionTimeout = this.securityConfig.sessionTimeout * 60 * 1000; // Convert to milliseconds
    
    return (now.getTime() - lastActivity.getTime()) < sessionTimeout;
  }

  /**
   * Logs security events for audit trail
   */
  public logSecurityEvent(event: string, userId?: string, details?: any): void {
    if (!this.securityConfig.enableAuditLogging) return;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId,
      details,
      userAgent: navigator.userAgent,
    };
    
    console.log('Security Event:', logEntry);
    // In production, send to secure logging service
  }
}

export const teacherAuthService = new TeacherAuthService();