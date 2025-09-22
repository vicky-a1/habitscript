import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingPage from "@/components/LandingPage";
import StudentJournal from "@/components/StudentJournal";
import TeacherDashboard from "@/components/TeacherDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'student' | 'teacher'>('landing');

  if (currentView === 'landing') {
    return (
      <div>
        <LandingPage 
          onStartStudent={() => setCurrentView('student')}
          onStartTeacher={() => setCurrentView('teacher')}
        />
        {/* Navigation for demo purposes */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          <Button 
            onClick={() => setCurrentView('student')}
            className="shadow-strong"
          >
            Try Student View
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('teacher')}
            className="shadow-strong"
          >
            Try Teacher View
          </Button>
        </div>
      </div>
    );
  }

  if (currentView === 'student') {
    return (
      <StudentJournal onBack={() => setCurrentView('landing')} />
    );
  }

  if (currentView === 'teacher') {
    return (
      <TeacherDashboard onBack={() => setCurrentView('landing')} />
    );
  }

  return null;
};

export default Index;
