import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import {
  Sparkles,
  Shield,
  Users,
  Target,
  Heart,
  BookOpen,
  TrendingUp,
  Lock,
  Smile,
  Download,
  Send,
  LogIn,
  UserPlus,
  LogOut
} from "lucide-react";

interface LandingPageProps {
  onStudentClick: () => void;
  onTeacherClick: () => void;
}

export default function LandingPage({ onStudentClick, onTeacherClick }: LandingPageProps) {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [demoForm, setDemoForm] = useState({
    schoolName: "",
    contactName: "",
    email: "",
    phone: "",
    studentCount: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Auth Header */}
        <div className="absolute top-4 right-4 z-10">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-gray-600 border-gray-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-gray-600 border-gray-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="bg-purple-600 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold"
                  style={{ fontFamily: 'cursive', color: 'rgb(147, 51, 234)' }}>
                habitscript
              </h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl text-foreground font-medium max-w-3xl mx-auto">
                Turn your journal into good habits
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform daily journaling into powerful habit formation. Build consistent, positive habits through reflective practice, mindful tracking, and personalized insights.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Habit Tracking</Badge>
              <Badge variant="secondary">Privacy Protected</Badge>
              <Badge variant="secondary">Progress Analytics</Badge>
              <Badge variant="secondary">Daily Growth</Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg px-8" onClick={onStudentClick}>
                <BookOpen className="w-5 h-5 mr-2" />
                Start Student Journey
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" onClick={onTeacherClick}>
                <Users className="w-5 h-5 mr-2" />
                Teacher Access
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold mb-4">Transform Journaling Into Lasting Habits</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Habit Script combines reflective journaling with scientific habit formation principles to create positive, lasting behavioral changes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Experience */}
          <Card className="p-6 shadow-medium hover:shadow-strong transition-smooth">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-3">Habit Formation</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Transform daily journaling into powerful habit-building practice with guided prompts that reinforce positive behaviors and mindful living.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" />
                <span>Habit tracking with progress visualization</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" />
                <span>Reflective prompts for behavior change</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" />
                <span>Streak building and milestone rewards</span>
              </li>
            </ul>
          </Card>

          {/* Privacy & Safety */}
          <Card className="p-6 shadow-medium hover:shadow-strong transition-smooth">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-3">Smart Analytics</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              AI-powered insights analyze your journal patterns to suggest personalized habits and track your growth journey with complete privacy.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" />
                <span>Personal habit pattern analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" />
                <span>Behavior trend identification</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" />
                <span>Personalized improvement suggestions</span>
              </li>
            </ul>
          </Card>

          {/* Teacher Insights */}
          <Card className="p-6 shadow-medium hover:shadow-strong transition-smooth">
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <h4 className="text-lg font-semibold mb-3">Progress Tracking</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Monitor habit formation progress with detailed analytics, streak tracking, and milestone celebrations to maintain motivation.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-success rounded-full" />
                <span>Daily habit completion tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-success rounded-full" />
                <span>Long-term behavior pattern analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-success rounded-full" />
                <span>Personalized coaching recommendations</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-card-soft py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Measurable Habit Formation Success</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Habit Script creates lasting behavioral changes that transform daily routines into powerful growth opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-strong transition-smooth">
                <Smile className="w-10 h-10 drop-shadow-sm" style={{color: 'rgb(147, 51, 234)'}} />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black">Habit Consistency</h4>
              <p className="text-black leading-relaxed">
                Build reliable daily routines that stick and grow stronger over time
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-strong transition-smooth">
                <Target className="w-10 h-10 drop-shadow-sm" style={{color: 'rgb(147, 51, 234)'}} />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black">Behavioral Change</h4>
              <p className="text-black leading-relaxed">
                Transform negative patterns into positive, life-enhancing behaviors
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-strong transition-smooth">
                <Users className="w-10 h-10 drop-shadow-sm" style={{color: 'rgb(147, 51, 234)'}} />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black">Goal Achievement</h4>
              <p className="text-black leading-relaxed">
                Reach personal milestones through systematic habit building
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium group-hover:shadow-strong transition-smooth">
                <BookOpen className="w-10 h-10 drop-shadow-sm" style={{color: 'rgb(147, 51, 234)'}} />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black">Mindful Growth</h4>
              <p className="text-black leading-relaxed">
                Develop self-awareness and intentional living practices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <Card className="p-8 shadow-strong bg-gradient-primary text-white">
          <h3 className="text-2xl font-semibold mb-4 text-black">Ready to transform habits through journaling?</h3>
            <p className="mb-6 opacity-90 leading-relaxed text-black">
              Join the growing community using Habit Script to build lasting positive habits through reflective practice.
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="lg" className="text-lg px-8 bg-white text-black border-gray-300 shadow-sm">
                  <Send className="w-5 h-5 mr-2" style={{color: 'rgb(147, 51, 234)'}} />
                  Request School Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Habit Script Demo</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    alert("Demo request submitted! Our team will contact you within 24 hours.");
                  }, 1000);
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={demoForm.schoolName}
                      onChange={(e) => setDemoForm({...demoForm, schoolName: e.target.value})}
                      placeholder="Delhi Public School..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person</Label>
                    <Input
                      id="contactName"
                      value={demoForm.contactName}
                      onChange={(e) => setDemoForm({...demoForm, contactName: e.target.value})}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                        placeholder="name@school.edu"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentCount">Number of Students</Label>
                    <Input
                      id="studentCount"
                      value={demoForm.studentCount}
                      onChange={(e) => setDemoForm({...demoForm, studentCount: e.target.value})}
                      placeholder="e.g., 150 students (grades 6-8)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Notes (Optional)</Label>
                    <Textarea
                      id="message"
                      value={demoForm.message}
                      onChange={(e) => setDemoForm({...demoForm, message: e.target.value})}
                      placeholder="Tell us about your habit-building goals..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Request Demo"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button 
              variant="default" 
              size="lg" 
              className="text-lg px-8 text-white shadow-sm"
              style={{backgroundColor: 'rgb(147, 51, 234)', borderColor: 'rgb(147, 51, 234)'}}
              onClick={() => {
                // Create a simple program guide download
                const guide = `
Habit Script Program Guide

Overview:
- Privacy-first habit formation platform
- 5-7 minute daily journaling sessions
- Behavior-focused prompts and tracking
- Personal analytics and progress insights

Benefits:
✓ Improved habit consistency
✓ Behavioral change through reflection
✓ Goal achievement tracking
✓ Mindful growth practices

Implementation:
- Mobile app for personal use (Android/Web)
- Web dashboard for progress tracking
- Weekly habit reports
- Personalized coaching suggestions

Contact us for a personalized demo!
`;
                const blob = new Blob([guide], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'HabitScript-Program-Guide.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-5 h-5 mr-2 text-white" />
              Download Program Guide
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Habit Script</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Turn your journal into good habits, one reflection at a time.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/about')}
              className="text-gray-600 hover:text-primary"
            >
              About
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/privacy')}
              className="text-gray-600 hover:text-primary"
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/faq')}
              className="text-gray-600 hover:text-primary"
            >
              FAQ
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2025 Habit Script. Privacy-first journaling for social-emotional learning.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={(userData) => {
          login(userData);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}