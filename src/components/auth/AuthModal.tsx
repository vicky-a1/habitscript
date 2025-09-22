import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  BookOpen,
  Heart,
  X
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserData) => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  age: number;
  interests: string[];
  role: 'student' | 'teacher' | 'admin';
  joinedAt: Date;
}

const interests = [
  "Reading", "Writing", "Music", "Art", "Sports", "Technology", 
  "Travel", "Cooking", "Photography", "Meditation", "Yoga", "Dancing"
];

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    selectedInterests: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!isLoginMode) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (!formData.age) {
        newErrors.age = "Age is required";
      } else if (parseInt(formData.age) < 10 || parseInt(formData.age) > 100) {
        newErrors.age = "Age must be between 10 and 100";
      }
      if (formData.selectedInterests.length === 0) {
        newErrors.interests = "Please select at least one interest";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isLoginMode) {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('journalUsers') || '[]');
      const user = existingUsers.find((u: any) => u.email === formData.email);
      
      if (user) {
        onLogin(user);
      } else {
        setErrors({ email: "User not found. Please register first." });
        setIsLoading(false);
        return;
      }
    } else {
      // Register new user
      const newUser: UserData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        interests: formData.selectedInterests,
        role: 'student',
        joinedAt: new Date()
      };
      
      // Save to localStorage
      const existingUsers = JSON.parse(localStorage.getItem('journalUsers') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === formData.email);
      
      if (userExists) {
        setErrors({ email: "User already exists. Please login instead." });
        setIsLoading(false);
        return;
      }
      
      existingUsers.push(newUser);
      localStorage.setItem('journalUsers', JSON.stringify(existingUsers));
      onLogin(newUser);
    }
    
    setIsLoading(false);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isLoginMode ? 'Welcome Back' : 'Join habitscript'}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {!isLoginMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    min="10"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  />
                  {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Interests (Select at least one)</Label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={formData.selectedInterests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          formData.selectedInterests.includes(interest)
                            ? 'bg-purple-600 text-white'
                            : ''
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  {errors.interests && <p className="text-sm text-red-600">{errors.interests}</p>}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLoginMode ? <BookOpen className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="p-0 ml-1 h-auto text-purple-600 hover:text-purple-700"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setErrors({});
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    age: "",
                    selectedInterests: []
                  });
                }}
              >
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
