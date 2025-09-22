import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Sparkles,
  Target,
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  BarChart3,
  History,
  Brain,
  Lightbulb,
  CheckCircle,
  Users,
  Trophy,
  Globe,
  ChevronDown,
  Plus,
  Search,
  Filter,
  Save,
  Shield
} from "lucide-react";
import { useJournalData, useJournalService } from "@/hooks/useJournalService";
import { journalPrompts, getPromptForDay, JournalPrompt } from "./journal/JournalPrompts";
import JournalEntry from "./journal/JournalEntry";
import StudentAnalytics from "./analytics/StudentAnalytics";
import { useAdvancedAnalytics, AdvancedInsights } from "@/hooks/useAdvancedAnalytics";
import AIInsights from "./advanced/AIInsights";
import AdaptivePrompts from "./advanced/AdaptivePrompts";
import HabitTracker from "./habits/HabitTracker";
import HabitInsights from "./habits/HabitInsights";
import ReflectionBooster from "./premium/ReflectionBooster";
import LifePatterns from "./insights/LifePatterns";
import { aiMentorService } from "@/services/aiMentorService";
import { SoulSpace } from "./SoulSpace";
import ReflectionModal from "./journal/ReflectionModal";

interface StudentJournalProps {
  onBack?: () => void;
}

const moodEmojis = [
  { emoji: "😢", label: "Very Low", value: 1, color: "text-red-500" },
  { emoji: "😕", label: "Low", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Okay", value: 3, color: "text-yellow-500" },
  { emoji: "🙂", label: "Good", value: 4, color: "text-green-500" },
  { emoji: "😊", label: "Very Good", value: 5, color: "text-emerald-500" },
];

export default function StudentJournal({ onBack }: StudentJournalProps) {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'daily-journal' | 'weekly-reports' | 'growth-dashboard' | 'rankings' | 'community' | 'wisdom-stories' | 'soulspace' | 'ai-mentor'>('daily-journal');
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<JournalPrompt | null>(null);
  const [currentExistingEntry, setCurrentExistingEntry] = useState<{ text: string; mood: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [selectedReflectionPrompt, setSelectedReflectionPrompt] = useState<JournalPrompt | null>(null);

  // Redirect to landing if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your journal.</p>
          <Button onClick={onBack} className="bg-purple-600">
            Go Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  // Use the new backend service
  const { entries, profile, habits, achievements, loading, refreshData } = useJournalData();
  const journalService = useJournalService();

  // Advanced analytics hook
  const { insights, isAnalyzing, enhancedEntries } = useAdvancedAnalytics(entries || []);
  
  const today = new Date().toISOString().split('T')[0];
  const hasJournaledToday = entries?.some(entry => entry.date === today) || false;

  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayEntry = entries?.find(entry => entry.date === date.toISOString().split('T')[0]);
    return dayEntry?.mood || 0;
  });

  const todaysPrompt = getPromptForDay(Math.floor(Date.now() / (1000 * 60 * 60 * 24)));

  // Error handling
  if (!todaysPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading journal prompts. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const startJournaling = (prompt: JournalPrompt, existingEntry?: { text: string; mood: number }) => {
    setCurrentPrompt(prompt);
    setCurrentExistingEntry(existingEntry || null);
    setShowJournalEntry(true);
  };

  const handleJournalComplete = async (entryData: {
    mood: number;
    text: string;
    values: string[];
    inputMethod: 'text' | 'voice';
    timeSpent: number;
  }) => {
    try {
      const newEntry = {
        date: today,
        mood: entryData.mood,
        values: entryData.values,
        text: entryData.text,
        timeSpent: entryData.timeSpent,
        streak: hasJournaledToday ? (profile?.currentStreak || 0) : (profile?.currentStreak || 0) + 1
      };

      // If there's already an entry for today, update it instead of creating a new one
      const todayEntry = entries?.find(entry => entry.date === today);
      if (todayEntry) {
        await journalService.updateEntry(todayEntry.id, newEntry);
      } else {
        await journalService.createEntry(newEntry);
      }
      await refreshData();

      setShowJournalEntry(false);
      setCurrentPrompt(null);
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      // You could add a toast notification here
    }
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (showJournalEntry && currentPrompt) {
    return (
      <JournalEntry
        prompt={currentPrompt}
        existingEntry={currentExistingEntry}
        onComplete={handleJournalComplete}
        onBack={() => {
          setShowJournalEntry(false);
          setCurrentPrompt(null);
          setCurrentExistingEntry(null);
        }}
      />
    );
  }

  const sidebarItems = [
    { id: 'daily-journal', label: 'Daily Journal', icon: BookOpen, color: 'text-purple-600' },
    { id: 'weekly-reports', label: 'Weekly Reports', icon: BarChart3, color: 'text-gray-600' },
    { id: 'growth-dashboard', label: 'Growth Dashboard', icon: Trophy, color: 'text-gray-600' },
    { id: 'rankings', label: 'Rankings', icon: Target, color: 'text-gray-600' },
    { id: 'community', label: 'Community', icon: Users, color: 'text-gray-600' },
    { id: 'wisdom-stories', label: 'Wisdom Stories', icon: BookOpen, color: 'text-gray-600' },
    { id: 'soulspace', label: 'SoulSpace', icon: Sparkles, color: 'text-gray-600' },
    { id: 'ai-mentor', label: 'AI Mentor', icon: Brain, color: 'text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white shadow-sm border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col lg:min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">habitscript</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2 lg:space-y-2 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-50 text-purple-600 border border-purple-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="font-medium hidden sm:inline lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t lg:border-t border-gray-100 lg:mt-auto hidden lg:block">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {user.interests.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
            {user.interests.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.interests.length - 3}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile user info */}
            <div className="flex items-center gap-3 lg:hidden">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentView === 'daily-journal' && (
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="lg:hidden text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {currentView === 'daily-journal' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-6 text-center bg-white shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <div className="text-2xl font-bold text-gray-900">{profile?.currentStreak || 0}</div>
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </Card>
                <Card className="p-6 text-center bg-white shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div className="text-2xl font-bold text-gray-900">{profile?.totalEntries || 0}</div>
                  </div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </Card>
                <Card className="p-6 text-center bg-white shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <div className="text-2xl font-bold text-gray-900">{profile?.level || 1}</div>
                  </div>
                  <div className="text-sm text-gray-600">Level</div>
                </Card>
              </div>

              {/* Today's Status */}
              {hasJournaledToday ? (
                <div className="space-y-6 mb-8">
                  <Card className="p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Today's Reflection Complete! 🎉</h3>
                    <p className="text-gray-600 mb-4">You've successfully completed today's journaling journey.</p>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Streak: {profile?.currentStreak || 0} days
                    </Badge>
                  </Card>

                  {/* Display Today's Journal Entry */}
                  {(() => {
                    const todayEntry = entries?.find(entry => entry.date === today);
                    if (todayEntry) {
                      return (
                        <Card className="p-6 bg-white shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">Today's Journal Entry</h4>
                            <div className="flex items-center gap-2">
                              <div className="text-2xl">{moodEmojis.find(m => m.value === todayEntry.mood)?.emoji || '😊'}</div>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                {todayEntry.timeSpent}min
                              </Badge>
                            </div>
                          </div>

                          <div className="prose prose-sm max-w-none">
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 overflow-hidden">
                              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
                                {todayEntry.text}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {todayEntry.values.map((value) => (
                              <Badge key={value} className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">
                              Written on {new Date(todayEntry.createdAt).toLocaleString()}
                            </span>
                            <Button
                              onClick={() => startJournaling(todaysPrompt, { text: todayEntry.text, mood: todayEntry.mood })}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Write More
                            </Button>
                          </div>
                        </Card>
                      );
                    }
                    return null;
                  })()}
                </div>
              ) : (
                <Card className="p-10 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border border-purple-100 mb-8 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Today's Journey</h3>
                    <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                      Transform your daily experiences into meaningful insights. Write your day in 5-10 points and discover patterns that shape your growth.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <Save className="w-4 h-4" />
                        <span>Auto-saves</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Private & Secure</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        <span>AI Mentor</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => startJournaling(todaysPrompt)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                    disabled={loading}
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    {loading ? 'Loading...' : 'Start Today\'s Journey'}
                  </Button>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    ✨ Your thoughts are private and secure. Only you can see your personal reflections.
                  </p>
                </Card>
              )}

              {/* Featured Prompts */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Explore More Values</h3>
                <div className="grid gap-4">
                  {journalPrompts.slice(0, 3).map((prompt) => (
                    <Card key={prompt.id} className="p-6 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{prompt.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{prompt.story.substring(0, 120)}...</p>
                        </div>
                        <div className="ml-4">
                          {prompt.region && (
                            <Badge variant="outline" className="text-xs">
                              {prompt.region}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {prompt.values.slice(0, 2).map((value) => (
                            <Badge key={value} className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedReflectionPrompt(prompt);
                            setShowReflectionModal(true);
                          }}
                          className="border-purple-200 text-purple-600 hover:bg-purple-50"
                        >
                          Reflect
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'weekly-reports' && (
            <div className="max-w-4xl mx-auto">
              <StudentAnalytics
                streak={profile?.currentStreak || 0}
                totalDays={entries?.length || 0}
                moodTrend={entries?.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / Math.max(entries?.slice(-7).length || 1, 1)}
                topValues={entries?.flatMap(entry => entry.values).reduce((acc, value) => {
                  acc[value] = (acc[value] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>) ? Object.keys(entries?.flatMap(entry => entry.values).reduce((acc, value) => {
                  acc[value] = (acc[value] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)).sort((a, b) =>
                  (entries?.flatMap(entry => entry.values).reduce((acc, value) => {
                    acc[value] = (acc[value] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)[b] || 0) -
                  (entries?.flatMap(entry => entry.values).reduce((acc, value) => {
                    acc[value] = (acc[value] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)[a] || 0)
                ).slice(0, 5) : []}
                weeklyProgress={entries?.slice(-7).map(entry => entry.mood) || [3, 3, 3, 3, 3, 3, 3]}
              />
            </div>
          )}

          {currentView === 'growth-dashboard' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <HabitTracker />
              <ReflectionBooster
                streak={profile?.currentStreak || 0}
                totalEntries={profile?.totalEntries || 0}
                moodTrend={weeklyProgress.reduce((a, b) => a + b, 0) / weeklyProgress.length || 0}
                onActivateBooster={(type) => {
                  const customPrompt: JournalPrompt = {
                    id: `booster-${type}-${Date.now()}`,
                    title: `${type.replace('-', ' ')} Session`,
                    story: `This enhanced reflection session will help you explore deeper insights and accelerate your personal growth.`,
                    questions: [`How can you apply the power of ${type.replace('-', ' ')} to transform your daily habits?`],
                    values: ['growth', 'transformation', 'wisdom'],
                    difficulty: 'advanced',
                    estimatedTime: 20,
                    aiGenerated: true
                  };
                  startJournaling(customPrompt);
                }}
              />
            </div>
          )}

          {currentView === 'rankings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Rankings & Achievements</h3>
                <p className="text-gray-600 mb-6">Track your progress and compare with the community</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="text-2xl font-bold text-yellow-700">#{Math.floor(Math.random() * 100) + 1}</div>
                    <div className="text-sm text-yellow-600">Global Rank</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700">{profile?.points || 0}</div>
                    <div className="text-sm text-purple-600">Points Earned</div>
                  </div>
                </div>
              </Card>
              
              {/* Achievements */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Recent Achievements</h3>
                <div className="grid gap-4">
                  {achievements?.slice(0, 5).map((achievement) => (
                    <Card key={achievement.id} className="p-4 bg-white shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                          +{achievement.points} pts
                        </Badge>
                      </div>
                    </Card>
                  )) || (
                    <Card className="p-8 text-center bg-gray-50">
                      <p className="text-gray-600">Start journaling to unlock achievements!</p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'community' && (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                <Users className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-600">Connect with fellow journalers and share your growth journey</p>
              </Card>
            </div>
          )}

          {currentView === 'wisdom-stories' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Wisdom Stories</h2>
              <div className="grid gap-6">
                {journalPrompts.slice(0, 6).map((prompt) => (
                  <Card key={prompt.id} className="p-6 bg-white shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">{prompt.title}</h4>
                    <p className="text-gray-600 mb-4">{prompt.story.substring(0, 200)}...</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {prompt.values.slice(0, 3).map((value) => (
                          <Badge key={value} className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            {value}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedReflectionPrompt(prompt);
                          setShowReflectionModal(true);
                        }}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Explore
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentView === 'soulspace' && (
            <div className="max-w-4xl mx-auto">
              <SoulSpace />
            </div>
          )}

          {currentView === 'ai-mentor' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {insights ? (
                <>
                  <AIInsights
                    insights={insights}
                    isAnalyzing={isAnalyzing}
                    onAcceptRecommendation={(recommendation) => {
                      const customPrompt: JournalPrompt = {
                        id: `recommendation-${Date.now()}`,
                        title: 'AI Recommended Reflection',
                        story: `Based on your journaling patterns, this reflection is specifically designed for your growth journey.`,
                        questions: [recommendation],
                        values: ['growth', 'self-awareness', 'wisdom'],
                        difficulty: 'intermediate',
                        estimatedTime: 15,
                        aiGenerated: true
                      };
                      startJournaling(customPrompt);
                    }}
                  />
                  <LifePatterns
                    patterns={[
                      {
                        id: 'morning-mood',
                        name: 'Morning Mood Elevation',
                        description: 'Your mood consistently improves during morning journaling sessions',
                        strength: 85,
                        trend: 'increasing',
                        insights: [
                          'Morning reflections correlate with 23% higher daily mood scores',
                          'Gratitude-focused entries show strongest positive impact'
                        ],
                        recommendations: [
                          'Continue morning journaling routine',
                          'Focus on gratitude themes for optimal mood boost'
                        ],
                        frequency: 'Daily',
                        category: 'emotional'
                      },
                      {
                        id: 'value-consistency',
                        name: 'Values Alignment Growth',
                        description: 'Increasing alignment between stated values and daily actions',
                        strength: 72,
                        trend: 'increasing',
                        insights: [
                          'Values-based reflections lead to more purposeful decisions',
                          '15% improvement in value-action alignment over 30 days'
                        ],
                        recommendations: [
                          'Set weekly value-based goals',
                          'Track daily value-aligned actions'
                        ],
                        frequency: 'Weekly',
                        category: 'behavioral'
                      }
                    ]}
                    onExplorePattern={(patternId) => {
                      console.log('Exploring pattern:', patternId);
                    }}
                  />
                  <HabitInsights />
                </>
              ) : (
                <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Mentor</h3>
                  <p className="text-gray-600 mb-6">
                    Complete at least 3 journal entries to unlock deep insights and life pattern analysis
                  </p>
                  <Button
                    onClick={() => setCurrentView('daily-journal')}
                    className="bg-purple-600 text-white"
                  >
                    Start Journaling
                  </Button>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Reflection Modal */}
      {selectedReflectionPrompt && (
        <ReflectionModal
          prompt={selectedReflectionPrompt}
          isOpen={showReflectionModal}
          onClose={() => {
            setShowReflectionModal(false);
            setSelectedReflectionPrompt(null);
          }}
          onSubmit={(reflection) => {
            console.log('Reflection submitted:', reflection);
            // You can add logic here to save the reflection
            alert(`Reflection submitted: ${reflection.method === 'text' ? reflection.text : 'Emojis: ' + reflection.emojis.join(' ')}`);
            setShowReflectionModal(false);
            setSelectedReflectionPrompt(null);
          }}
        />
      )}
    </div>
  );
}