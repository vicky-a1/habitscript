import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Brain, 
  Target, 
  Heart, 
  Lightbulb,
  BookOpen,
  Globe2,
  Star,
  Shuffle
} from "lucide-react";
import { JournalPrompt } from "../journal/JournalPrompts";

interface AdaptivePromptsProps {
  userProfile: {
    age: number;
    interests: string[];
    emotionalState: 'positive' | 'neutral' | 'negative';
    culturalContext: string;
    recentThemes: string[];
  };
  onPromptSelect: (prompt: JournalPrompt) => void;
}

export default function AdaptivePrompts({ userProfile, onPromptSelect }: AdaptivePromptsProps) {
  const [currentPrompts, setCurrentPrompts] = useState<JournalPrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAdaptivePrompts = useCallback(() => {
    setIsGenerating(true);
    
    // Simulate AI prompt generation based on user profile
    setTimeout(() => {
      const adaptivePrompts = createPersonalizedPrompts(userProfile);
      setCurrentPrompts(adaptivePrompts);
      setIsGenerating(false);
    }, 1500);
  }, [userProfile]);

  useEffect(() => {
    generateAdaptivePrompts();
  }, [generateAdaptivePrompts]);

  const createPersonalizedPrompts = (profile: typeof userProfile): JournalPrompt[] => {
    const basePrompts: JournalPrompt[] = [
      {
        id: 'adaptive-1',
        title: 'Personal Growth Reflection',
        story: getPersonalizedStory(profile.emotionalState, profile.culturalContext),
        question: getPersonalizedQuestion(profile.recentThemes),
        values: getRelevantValues(profile.interests),
        region: profile.culturalContext as "north" | "south" | "east" | "west" | "central" | string,
        difficulty: profile.age > 16 ? 'intermediate' : 'beginner',
        estimatedTime: profile.age > 16 ? 15 : 10,
        culturalContext: getCulturalContext(profile.culturalContext),
        aiGenerated: true,
        adaptiveLevel: calculateAdaptiveLevel(profile)
      },
      {
        id: 'adaptive-2', 
        title: 'Values in Action',
        story: getActionBasedStory(profile.interests),
        question: 'How did you demonstrate your core values in a recent decision or action?',
        values: profile.interests.slice(0, 3),
        region: profile.culturalContext as "north" | "south" | "east" | "west" | "central" | string,
        difficulty: 'intermediate',
        estimatedTime: 12,
        culturalContext: getCulturalContext(profile.culturalContext),
        aiGenerated: true,
        adaptiveLevel: calculateAdaptiveLevel(profile)
      },
      {
        id: 'adaptive-3',
        title: 'Future Self Visualization',
        story: getFutureVisionStory(profile.age),
        question: 'What would your future self want you to know about living meaningfully?',
        values: ['wisdom', 'growth', 'purpose'],
        region: profile.culturalContext as "north" | "south" | "east" | "west" | "central" | string,
        difficulty: profile.age > 18 ? 'advanced' : 'intermediate',
        estimatedTime: 20,
        culturalContext: getCulturalContext(profile.culturalContext),
        aiGenerated: true,
        adaptiveLevel: calculateAdaptiveLevel(profile)
      }
    ];

    return basePrompts;
  };

  const getPersonalizedStory = (emotionalState: string, culturalContext: string): string => {
    const stories = {
      positive: {
        'India': 'During Diwali celebrations, Priya felt overwhelmed by gratitude as she watched her grandmother teach her younger cousins traditional rangoli patterns. The intergenerational bond and cultural continuity filled her with deep joy...',
        default: 'Sarah noticed how her morning routine of gratitude journaling had transformed her entire outlook. Each day seemed brighter as she consciously appreciated small moments...'
      },
      neutral: {
        'India': 'Arjun sat by the Ganges during his evening walk, observing the daily rhythms of life around him. Vendors closing shops, children playing cricket, elderly people feeding pigeons - the ordinary felt profound...',
        default: 'Alex found themselves reflecting during a quiet afternoon, watching clouds drift across the sky. Sometimes the most important insights come in moments of stillness...'
      },
      negative: {
        'India': 'After a difficult day, Meera remembered her grandfather\'s words: "Beta, even the lotus grows from muddy water." She realized that challenges often lead to unexpected growth...',
        default: 'During a challenging period, Jamie discovered that writing about difficulties helped transform pain into wisdom and resilience...'
      }
    };

    return stories[emotionalState as keyof typeof stories]?.[culturalContext] || 
           stories[emotionalState as keyof typeof stories]?.default || 
           stories.neutral.default;
  };

  const getPersonalizedQuestion = (recentThemes: string[]): string => {
    if (recentThemes.includes('family')) {
      return 'How have your family relationships shaped your core values, and what legacy do you want to create?';
    }
    if (recentThemes.includes('education')) {
      return 'What have you learned about yourself through your educational journey, beyond academic knowledge?';
    }
    if (recentThemes.includes('friendship')) {
      return 'How do your closest friendships reflect and strengthen your most important values?';
    }
    return 'What recent experience has taught you something valuable about what matters most to you?';
  };

  const getRelevantValues = (interests: string[]): string[] => {
    const valueMap: Record<string, string[]> = {
      'arts': ['creativity', 'beauty', 'expression'],
      'sports': ['perseverance', 'teamwork', 'health'],
      'technology': ['innovation', 'learning', 'progress'],
      'nature': ['harmony', 'peace', 'sustainability'],
      'music': ['passion', 'rhythm', 'emotion'],
      'reading': ['wisdom', 'knowledge', 'imagination'],
      'cooking': ['nourishment', 'tradition', 'sharing'],
      'travel': ['adventure', 'curiosity', 'openness']
    };

    const relevantValues = interests.flatMap(interest => valueMap[interest] || []);
    return [...new Set(relevantValues)].slice(0, 4);
  };

  const getActionBasedStory = (interests: string[]): string => {
    if (interests.includes('arts')) {
      return 'Through creating art, Maya discovered that her values of authenticity and expression guided every brushstroke. Her paintings became a reflection of her deepest beliefs...';
    }
    if (interests.includes('sports')) {
      return 'On the cricket field, Raj learned that his values of fairness and teamwork meant more than winning. A moment of sportsmanship taught him about character...';
    }
    return 'In pursuing their passion, Alex realized that their actions naturally aligned with their core values, creating a sense of purpose and authenticity...';
  };

  const getFutureVisionStory = (age: number): string => {
    if (age < 16) {
      return 'Imagine meeting your 25-year-old self. They smile warmly and tell you about the beautiful journey ahead, shaped by the values you\'re discovering now...';
    }
    if (age < 20) {
      return 'Your 30-year-old self appears with wisdom in their eyes, having lived through various experiences. They want to share what truly mattered in building a meaningful life...';
    }
    return 'Envision your wisest self, decades from now, looking back on this moment. What would they want you to understand about living with purpose and authenticity?';
  };

  const getCulturalContext = (region: string): string => {
    const contexts: Record<string, string> = {
      'India': 'Drawing from India\'s rich philosophical traditions of dharma (righteous living), seva (selfless service), and the interconnectedness of all beings...',
      'default': 'Considering diverse wisdom traditions and universal human values that transcend cultural boundaries...'
    };
    return contexts[region] || contexts.default;
  };

  const calculateAdaptiveLevel = (profile: typeof userProfile): number => {
    let level = 1;
    if (profile.age > 16) level += 1;
    if (profile.recentThemes.length > 3) level += 1;
    if (profile.emotionalState === 'positive') level += 0.5;
    return Math.min(5, level);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-primary text-white shadow-medium">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-semibold">AI-Adaptive Prompts</h2>
            <p className="text-sm opacity-90">Personalized for your journey and cultural context</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Heart className="w-3 h-3 mr-1" />
            {userProfile.emotionalState}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Globe2 className="w-3 h-3 mr-1" />
            {userProfile.culturalContext}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Target className="w-3 h-3 mr-1" />
            Level {Math.round(calculateAdaptiveLevel(userProfile))}
          </Badge>
        </div>
      </Card>

      {/* Generate New Prompts */}
      <Card className="p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary-dark">
              Prompts Adapted for You
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateAdaptivePrompts}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle className="w-4 h-4 mr-2" />
                New Prompts
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Adaptive Prompts List */}
      <div className="space-y-4">
        {isGenerating ? (
          <Card className="p-6 text-center shadow-soft">
            <Brain className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">
              AI is creating personalized prompts based on your profile...
            </p>
          </Card>
        ) : (
          currentPrompts.map((prompt) => (
            <Card key={prompt.id} className="p-5 shadow-soft hover:shadow-medium transition-smooth border-primary-light border">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-primary-dark">{prompt.title}</h4>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      <Star className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {prompt.story.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted-foreground">Cultural Context:</span>
                    <span className="text-xs text-primary-dark">{prompt.culturalContext?.substring(0, 50)}...</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {prompt.values.slice(0, 3).map((value) => (
                    <Badge key={value} variant="secondary" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">
                    {prompt.estimatedTime}min
                  </Badge>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onPromptSelect(prompt)}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Journey
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}