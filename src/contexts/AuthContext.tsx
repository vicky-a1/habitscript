import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setUserContext, addBreadcrumb, logError } from '@/lib/sentry';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  interests?: string[];
  role: UserRole;
  joinedAt: Date;
  lastActivity?: Date;
  sessionToken?: string;
}

export interface TeacherCredentials {
  email: string;
  password: string;
  teacherId: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  loginTeacher: (credentials: TeacherCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  sessionValid: boolean;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionValid, setSessionValid] = useState<boolean>(true);

  // Session timeout duration (30 minutes for teachers, 2 hours for students)
  const getSessionTimeout = (role: UserRole): number => {
    switch (role) {
      case 'teacher':
        return 30 * 60 * 1000; // 30 minutes
      case 'admin':
        return 15 * 60 * 1000; // 15 minutes
      default:
        return 2 * 60 * 60 * 1000; // 2 hours for students
    }
  };

  // Generate secure session token
  const generateSessionToken = (): string => {
    return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
  };

  // Validate session based on last activity and role
  const validateSession = (userData: User): boolean => {
    if (!userData.lastActivity || !userData.sessionToken) return false;
    
    const now = new Date().getTime();
    const lastActivity = new Date(userData.lastActivity).getTime();
    const timeout = getSessionTimeout(userData.role);
    
    return (now - lastActivity) < timeout;
  };

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Convert date strings back to Date objects
        userData.joinedAt = new Date(userData.joinedAt);
        if (userData.lastActivity) {
          userData.lastActivity = new Date(userData.lastActivity);
        }
        
        // Validate session
        if (validateSession(userData)) {
          // Update last activity
          userData.lastActivity = new Date();
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          setSessionValid(true);
        } else {
          // Session expired
          localStorage.removeItem('currentUser');
          setSessionValid(false);
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
        setSessionValid(false);
      }
    }
  }, []);

  // Auto-logout on session timeout
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      if (!validateSession(user)) {
        logout();
        setSessionValid(false);
      }
    };

    // Check session every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const login = (userData: User) => {
    const userWithSession = {
      ...userData,
      lastActivity: new Date(),
      sessionToken: generateSessionToken(),
    };
    setUser(userWithSession);
    setSessionValid(true);
    localStorage.setItem('currentUser', JSON.stringify(userWithSession));
    
    // Set Sentry user context for error tracking
    setUserContext({
      id: userWithSession.id,
      role: userWithSession.role,
      email: userWithSession.email,
    });
    
    // Add breadcrumb for login event
    addBreadcrumb(`User logged in: ${userWithSession.role}`, 'auth', 'info');
  };

  // Secure teacher login with validation
  const loginTeacher = async (credentials: TeacherCredentials): Promise<boolean> => {
    try {
      // Simulate secure teacher authentication
      // In production, this would make an API call to verify credentials
      const validTeachers = [
        { email: 'teacher@school.edu', password: 'SecureTeacher123!', teacherId: 'T001', name: 'Ms. Sarah Johnson' },
        { email: 'admin@school.edu', password: 'AdminSecure456!', teacherId: 'A001', name: 'Dr. Michael Chen' },
      ];

      const teacher = validTeachers.find(
        t => t.email === credentials.email && 
             t.password === credentials.password && 
             t.teacherId === credentials.teacherId
      );

      if (teacher) {
        const teacherUser: User = {
          id: teacher.teacherId,
          name: teacher.name,
          email: teacher.email,
          role: teacher.teacherId.startsWith('A') ? 'admin' : 'teacher',
          joinedAt: new Date(),
          lastActivity: new Date(),
          sessionToken: generateSessionToken(),
        };

        setUser(teacherUser);
        setSessionValid(true);
        localStorage.setItem('currentUser', JSON.stringify(teacherUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Teacher login error:', error);
      logError(error as Error, { 
        context: 'teacher_login',
        email: credentials.email,
        teacherId: credentials.teacherId 
      });
      return false;
    }
  };

  const logout = () => {
    // Add breadcrumb for logout event
    if (user) {
      addBreadcrumb(`User logged out: ${user.role}`, 'auth', 'info');
    }
    
    setUser(null);
    setSessionValid(false);
    localStorage.removeItem('currentUser');
    
    // Clear Sentry user context
    setUserContext({ id: '', role: '', email: '' });
    
    // Clear any sensitive data from memory
    if (user?.role === 'teacher' || user?.role === 'admin') {
      // Additional cleanup for teacher sessions
      sessionStorage.clear();
    }
  };

  const refreshSession = () => {
    if (user && validateSession(user)) {
      const updatedUser = {
        ...user,
        lastActivity: new Date(),
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setSessionValid(true);
    } else {
      logout();
    }
  };

  const value = {
    user,
    login,
    loginTeacher,
    logout,
    isAuthenticated: !!user && sessionValid,
    isTeacher: !!user && user.role === 'teacher' && sessionValid,
    isStudent: !!user && user.role === 'student' && sessionValid,
    sessionValid,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
