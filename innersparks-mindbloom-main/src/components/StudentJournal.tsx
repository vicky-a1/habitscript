import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ChevronDown
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { journalPrompts, getPromptForDay, JournalPrompt } from "./journal/JournalPrompts";
import JournalEntry from "./journal/JournalEntry";

const moodEmojis = [
  { emoji: "😢", label: "Very Low", value: 1 },
  { emoji: "😕", label: "Low", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Very Good", value: 5 },
];

interface JournalEntryData {
  date: string;
  mood: number;
  values: string[];
  text: string;
  timeSpent: number;
  streak: number;
}

interface StudentJournalProps {
  onBack?: () => void;
}

export default function StudentJournal({ onBack }: StudentJournalProps) {
  const [currentView, setCurrentView] = useState<'daily-journal' | 'weekly-reports' | 'growth-dashboard' | 'rankings' | 'community' | 'wisdom-stories' | 'ai-mentor'>('daily-journal');
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<JournalPrompt | null>(null);
  
  const [entries, setEntries] = useLocalStorage<JournalEntryData[]>('journal-entries', []);
  const [streak, setStreak] = useLocalStorage('current-streak', 0);
  const [totalDays, setTotalDays] = useLocalStorage('total-days', 0);
  const [userProfile, setUserProfile] = useLocalStorage('user-profile', {
    age: 16,
    interests: ['reading', 'music', 'sports'],
    emotionalState: 'neutral' as 'positive' | 'neutral' | 'negative',
    culturalContext: 'India',
    recentThemes: []
  });

  // Mock insights for now
  const insights = entries.length >= 3 ? { mockInsight: true } : null;
  const isAnalyzing = false;
  
  const today = new Date().toISOString().split('T')[0];
  const hasJournaledToday = entries.some(entry => entry.date === today);
  
  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayEntry = entries.find(entry => entry.date === date.toISOString().split('T')[0]);
    return dayEntry?.mood || 0;
  });
  
  const allValues = [...new Set(entries.flatMap(entry => entry.values))];
  const todaysPrompt = getPromptForDay(Math.floor(Date.now() / (1000 * 60 * 60 * 24)));

  const startJournaling = (prompt: JournalPrompt) => {
    setCurrentPrompt(prompt);
    setShowJournalEntry(true);
  };

  const handleJournalComplete = (entryData: {
    mood: number;
    text: string;
    values: string[];
    inputMethod: 'text' | 'voice';
    timeSpent: number;
  }) => {
    const newEntry: JournalEntryData = {
      date: today,
      mood: entryData.mood,
      values: entryData.values,
      text: entryData.text,
      timeSpent: entryData.timeSpent,
      streak: hasJournaledToday ? streak : streak + 1
    };
    
    setEntries(prev => [newEntry, ...prev.filter(e => e.date !== today)]);
    if (!hasJournaledToday) {
      setStreak(prev => prev + 1);
      setTotalDays(prev => prev + 1);
    }
    
    setShowJournalEntry(false);
    setCurrentPrompt(null);
  };

  if (showJournalEntry && currentPrompt) {
    return (
      <JournalEntry
        prompt={currentPrompt}
        onComplete={handleJournalComplete}
        onBack={() => {
          setShowJournalEntry(false);
          setCurrentPrompt(null);
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
    { id: 'ai-mentor', label: 'AI Mentor', icon: Brain, color: 'text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Flourish</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white">
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-teal-500 text-white text-sm">A</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Arjun</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'daily-journal' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-6 text-center bg-white shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <div className="text-2xl font-bold text-gray-900">{streak}</div>
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </Card>
                <Card className="p-6 text-center bg-white shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div className="text-2xl font-bold text-gray-900">{totalDays}</div>
                  </div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </Card>
                <Card className="p-6 text-center bg-white shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <div className="text-2xl font-bold text-gray-900">{Math.floor(totalDays / 7) + 1}</div>
                  </div>
                  <div className="text-sm text-gray-600">Level</div>
                </Card>
              </div>

              {/* Today's Status */}
              {hasJournaledToday ? (
                <Card className="p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-8">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Today's Reflection Complete! 🎉</h3>
                  <p className="text-gray-600 mb-4">You've successfully completed today's journaling journey.</p>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Streak: {streak} days
                  </Badge>
                </Card>
              ) : (
                <Card className="p-8 bg-white shadow-sm border border-gray-100 mb-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Today's Reflection Awaits</h3>
                    <p className="text-gray-600">
                      Ready to explore meaningful values through journaling?
                    </p>
                  </div>
                  <Button 
                    onClick={() => startJournaling(todaysPrompt)} 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Today's Journey
                  </Button>
                </Card>
              )}

              {/* Featured Prompts */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Explore More Values</h3>
                <div className="grid gap-6">
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
                          onClick={() => startJournaling(prompt)}
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
              <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Weekly Reports</h3>
                <p className="text-gray-600">Track your weekly progress and insights</p>
              </Card>
            </div>
          )}

          {currentView === 'growth-dashboard' && (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Dashboard</h3>
                <p className="text-gray-600">Monitor your personal growth journey</p>
              </Card>
            </div>
          )}

          {currentView === 'rankings' && (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Rankings & Achievements</h3>
                <p className="text-gray-600 mb-6">Track your progress and compare with the community</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="text-2xl font-bold text-yellow-700">#{Math.floor(Math.random() * 100) + 1}</div>
                    <div className="text-sm text-yellow-600">Global Rank</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700">{Math.floor(totalDays * 1.5)}</div>
                    <div className="text-sm text-purple-600">Points Earned</div>
                  </div>
                </div>
              </Card>
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
                        onClick={() => startJournaling(prompt)}
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

          {currentView === 'ai-mentor' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {insights ? (
                <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Mentor Insights</h3>
                  <p className="text-gray-600 mb-6">
                    Based on your {entries.length} journal entries, here are personalized insights for your growth.
                  </p>
                  <Button 
                    onClick={() => startJournaling(todaysPrompt)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Get AI Recommendation
                  </Button>
                </Card>
              ) : (
                <Card className="p-8 text-center bg-white shadow-sm border border-gray-100">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Mentor</h3>
                  <p className="text-gray-600 mb-6">
                    Complete at least 3 journal entries to unlock deep insights and life pattern analysis
                  </p>
                  <Button 
                    onClick={() => setCurrentView('daily-journal')}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Start Journaling
                  </Button>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}