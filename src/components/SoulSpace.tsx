import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Sparkles, 
  Moon, 
  Sun, 
  Flower, 
  Mountain, 
  Waves, 
  Star,
  Clock,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Lightbulb,
  Compass,
  Shield,
  Bot,
  Phone,
  Users
} from "lucide-react";
import MentalHealthSupport from "./mental-health/MentalHealthSupport";
import ChatPage from "./ChatPage";

interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  type: 'breathing' | 'mindfulness' | 'gratitude' | 'loving-kindness';
  description: string;
  icon: any;
}

interface SpiritualQuote {
  text: string;
  author: string;
  category: string;
}

export function SoulSpace() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showMentalHealthSupport, setShowMentalHealthSupport] = useState(false);
  const [showChatPage, setShowChatPage] = useState(false);

  // If chat page is requested, render it instead of the main SoulSpace
  if (showChatPage) {
    return <ChatPage onBack={() => setShowChatPage(false)} />;
  }

  const meditationSessions: MeditationSession[] = [
    {
      id: 'breathing',
      title: 'Mindful Breathing',
      duration: 5,
      type: 'breathing',
      description: 'Focus on your breath to center your mind and find inner peace',
      icon: Waves
    },
    {
      id: 'gratitude',
      title: 'Gratitude Reflection',
      duration: 10,
      type: 'gratitude',
      description: 'Cultivate appreciation for the blessings in your life',
      icon: Heart
    },
    {
      id: 'mindfulness',
      title: 'Present Moment Awareness',
      duration: 15,
      type: 'mindfulness',
      description: 'Develop awareness of the present moment without judgment',
      icon: Mountain
    },
    {
      id: 'loving-kindness',
      title: 'Loving Kindness Meditation',
      duration: 12,
      type: 'loving-kindness',
      description: 'Send love and compassion to yourself and others',
      icon: Flower
    }
  ];

  const spiritualQuotes: SpiritualQuote[] = [
    {
      text: "The soul becomes dyed with the color of its thoughts.",
      author: "Marcus Aurelius",
      category: "wisdom"
    },
    {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha",
      category: "peace"
    },
    {
      text: "The present moment is the only time over which we have dominion.",
      author: "Thich Nhat Hanh",
      category: "mindfulness"
    },
    {
      text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
      author: "Rumi",
      category: "love"
    },
    {
      text: "The quieter you become, the more you are able to hear.",
      author: "Rumi",
      category: "silence"
    }
  ];

  const reflectionPrompts = [
    "What am I most grateful for in this moment?",
    "How can I show more compassion to myself today?",
    "What does my soul need right now?",
    "How can I align my actions with my deepest values?",
    "What brings me true peace and joy?",
    "How can I be of service to others today?"
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Compass },
    { id: 'meditation', label: 'Meditation', icon: Mountain },
    { id: 'reflection', label: 'Reflection', icon: BookOpen },
    { id: 'wisdom', label: 'Wisdom', icon: Lightbulb },
    { id: 'mental-health', label: 'Mental Health', icon: Shield }
  ];

  const startSession = (sessionId: string) => {
    setActiveSession(sessionId);
    setSessionTime(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setSessionTime(0);
    setIsPlaying(false);
  };

  const endSession = () => {
    setActiveSession(null);
    setSessionTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomQuote = () => {
    return spiritualQuotes[Math.floor(Math.random() * spiritualQuotes.length)];
  };

  const getRandomPrompt = () => {
    return reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
  };

  const todaysQuote = getRandomQuote();
  const todaysPrompt = getRandomPrompt();

  if (activeSession) {
    const session = meditationSessions.find(s => s.id === activeSession);
    if (!session) return null;

    const progress = (sessionTime / (session.duration * 60)) * 100;
    const Icon = session.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 bg-white/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{session.title}</h2>
            <p className="text-gray-600">{session.description}</p>
          </div>

          <div className="space-y-4">
            <div className="text-4xl font-mono text-purple-600">
              {formatTime(sessionTime)}
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500">
              {session.duration} minute session
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={togglePlayPause}
              className="bg-purple-600"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              onClick={resetSession}
              variant="outline"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={endSession}
              variant="outline"
            >
              End Session
            </Button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700 italic">
              "{todaysQuote.text}"
            </p>
            <p className="text-xs text-purple-600 mt-2">— {todaysQuote.author}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">SoulSpace</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A sacred space for spiritual reflection, meditation, and inner growth. 
          Connect with your deeper self through mindful practices.
        </p>
      </div>

      {/* Categories */}
      <div className="flex justify-center gap-2 flex-wrap">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Inspiration */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Daily Inspiration</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700 italic mb-2">
                  "{todaysQuote.text}"
                </p>
                <p className="text-sm text-gray-500">— {todaysQuote.author}</p>
                <Badge className="mt-2 bg-purple-100 text-purple-700">
                  {todaysQuote.category}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Reflection Prompt */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Soul Reflection</h3>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-700 mb-3">{todaysPrompt}</p>
              <Button size="sm" className="bg-blue-600">
                Start Reflecting
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Mental Health Support Section */}
      {(selectedCategory === 'all' || selectedCategory === 'mental-health') && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Mental Health Support</h3>
              <Badge className="bg-green-100 text-green-800 text-xs">Free & Confidential</Badge>
            </div>
            <p className="text-gray-600">
              Your mental health matters. Access free support, talk to our AI companion, or get professional help when you need it.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4 bg-white hover:shadow-md transition-shadow">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-800">AI Companion</h4>
                  <p className="text-sm text-gray-600">24/7 mental health support with our compassionate AI</p>
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600"
                    onClick={() => setShowChatPage(true)}
                  >
                    Chat Now
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 bg-white hover:shadow-md transition-shadow">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-800">Crisis Support</h4>
                  <p className="text-sm text-gray-600">Immediate help when you need it most</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600"
                  >
                    Call 988
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 bg-white hover:shadow-md transition-shadow">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-800">Support Groups</h4>
                  <p className="text-sm text-gray-600">Connect with others who understand</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowMentalHealthSupport(true)}
                  >
                    Find Groups
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Remember</span>
              </div>
              <p className="text-sm text-green-700">
                You are not alone. Seeking help is a sign of strength, not weakness. 
                Our support is completely free and confidential.
              </p>
            </div>
            
            <Button 
              onClick={() => setShowMentalHealthSupport(true)}
              className="w-full bg-green-600"
            >
              <Shield className="w-4 h-4 mr-2" />
              Access Mental Health Support
            </Button>
          </div>
        </Card>
      )}

      {/* Meditation Sessions */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Guided Meditations</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {meditationSessions.map((session) => {
              const Icon = session.icon;
              return (
                <Card key={session.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{session.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{session.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{session.description}</p>
                    <Button 
                      onClick={() => startSession(session.id)}
                      size="sm" 
                      className="w-full bg-green-600"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Spiritual Practices */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-4 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-800">Morning Intention</h4>
            <p className="text-sm text-gray-600">Set a sacred intention for your day</p>
            <Button size="sm" variant="outline">Practice</Button>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-800">Evening Gratitude</h4>
            <p className="text-sm text-gray-600">Reflect on the day's blessings</p>
            <Button size="sm" variant="outline">Practice</Button>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-800">Self-Compassion</h4>
            <p className="text-sm text-gray-600">Practice loving kindness toward yourself</p>
            <Button size="sm" variant="outline">Practice</Button>
          </div>
        </Card>
      </div>
      
      {/* Mental Health Support Modal */}
      {showMentalHealthSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Mental Health Support
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMentalHealthSupport(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-4">
              <MentalHealthSupport />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}