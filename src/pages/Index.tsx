import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/LandingPage';
import StudentJournal from '@/components/StudentJournal';
import TeacherLogin from '@/components/auth/TeacherLogin';
import { Button } from '@/components/ui/button';
import { Shield, User, Lock } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'student' | 'teacher-login'>('landing');
  const { isAuthenticated, isTeacher, user } = useAuth();
  const navigate = useNavigate();

  // Handle teacher access
  const handleTeacherAccess = () => {
    if (isAuthenticated && isTeacher) {
      // Already authenticated teacher, go directly to dashboard
      navigate('/teacher/dashboard');
    } else {
      // Show login form
      setCurrentView('teacher-login');
    }
  };

  const handleTeacherLoginSuccess = () => {
    navigate('/teacher/dashboard');
  };

  if (currentView === 'teacher-login') {
    return (
      <TeacherLogin 
        onSuccess={handleTeacherLoginSuccess}
        onCancel={() => setCurrentView('landing')}
        redirectTo="/teacher/dashboard"
      />
    );
  }

  if (currentView === 'student') {
    return <StudentJournal onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen">
      <LandingPage 
        onStudentClick={() => setCurrentView('student')}
        onTeacherClick={handleTeacherAccess}
      />
      
      {/* Security indicator for authenticated teachers only */}
      {isAuthenticated && isTeacher && (
        <div className="fixed bottom-6 right-6 bg-green-100 border border-green-300 rounded-lg p-3 text-center shadow-lg">
          <Lock className="w-4 h-4 text-green-600 mx-auto mb-1" />
          <div className="text-xs text-green-700 font-medium">
            Authenticated Teacher
          </div>
          <div className="text-xs text-green-600">
            {user?.name}
          </div>
          <Button
            onClick={() => navigate('/teacher/dashboard')}
            size="sm"
            className="mt-2 w-full bg-green-600 text-white"
          >
            <Shield className="w-3 h-3 mr-1" />
            Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
