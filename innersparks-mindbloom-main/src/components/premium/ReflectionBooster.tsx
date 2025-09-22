import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Target, 
  Zap, 
  Star,
  Trophy,
  Brain,
  Heart,
  Lightbulb,
  Crown,
  Flame
} from "lucide-react";

interface ReflectionBoosterProps {
  streak: number;
  totalEntries: number;
  moodTrend: number;
  onActivateBooster: (type: string) => void;
}

export default function ReflectionBooster({ 
  streak, 
  totalEntries, 
  moodTrend, 
  onActivateBooster 
}: ReflectionBoosterProps) {
  const [selectedBooster, setSelectedBooster] = useState<string | null>(null);
  const [powerLevel, setPowerLevel] = useState(0);

  useEffect(() => {
    // Calculate power level based on user progress
    const streakPower = Math.min(streak * 2, 40);
    const entriesPower = Math.min(totalEntries * 1.5, 30);
    const moodPower = Math.min(moodTrend * 10, 30);
    setPowerLevel(streakPower + entriesPower + moodPower);
  }, [streak, totalEntries, moodTrend]);

  const boosters = [
    {
      id: 'deep-dive',
      name: 'Deep Dive Mode',
      description: 'Unlock profound self-discovery with advanced reflection prompts',
      icon: Brain,
      power: 25,
      color: 'bg-purple-500',
      benefits: ['Enhanced self-awareness', 'Deeper emotional insights', 'Advanced growth tracking']
    },
    {
      id: 'momentum-builder',
      name: 'Momentum Builder',
      description: 'Supercharge your habit formation with targeted challenges',
      icon: Zap,
      power: 20,
      color: 'bg-yellow-500',
      benefits: ['Accelerated habit building', 'Streak multipliers', 'Achievement unlocks']
    },
    {
      id: 'wisdom-seeker',
      name: 'Wisdom Seeker',
      description: 'Access timeless wisdom and philosophical reflections',
      icon: Star,
      power: 30,
      color: 'bg-blue-500',
      benefits: ['Ancient wisdom integration', 'Philosophical depth', 'Cultural insights']
    },
    {
      id: 'heart-connect',
      name: 'Heart Connect',
      description: 'Strengthen emotional intelligence and empathy',
      icon: Heart,
      power: 15,
      color: 'bg-red-500',
      benefits: ['Emotional mastery', 'Empathy development', 'Relationship insights']
    }
  ];

  const canActivate = (requiredPower: number) => powerLevel >= requiredPower;

  return (
    <div className="space-y-6">
      {/* Power Level Display */}
      <Card className="p-6 bg-gradient-primary text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Reflection Power</h3>
            <p className="text-white/80 text-sm">Unlock boosters with consistent journaling</p>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6" />
            <span className="text-2xl font-bold">{Math.round(powerLevel)}</span>
          </div>
        </div>
        <Progress value={powerLevel} className="h-2 bg-white/20" />
        <div className="flex justify-between text-xs mt-2 text-white/70">
          <span>Novice</span>
          <span>Expert</span>
          <span>Master</span>
        </div>
      </Card>

      {/* Booster Cards */}
      <div className="grid gap-4">
        <h3 className="text-lg font-medium text-primary-dark flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Reflection Boosters
        </h3>
        
        {boosters.map((booster) => {
          const Icon = booster.icon;
          const isUnlocked = canActivate(booster.power);
          
          return (
            <Card 
              key={booster.id}
              className={`p-5 transition-all duration-300 cursor-pointer ${
                isUnlocked 
                  ? 'shadow-medium hover:shadow-strong hover:scale-[1.02]' 
                  : 'opacity-60 grayscale'
              } ${selectedBooster === booster.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => isUnlocked && setSelectedBooster(booster.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${booster.color} rounded-full flex items-center justify-center ${
                  !isUnlocked ? 'bg-gray-400' : ''
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-primary-dark">{booster.name}</h4>
                    <div className="flex items-center gap-1">
                      {isUnlocked ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Flame className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <Target className="w-3 h-3 mr-1" />
                          {booster.power} power
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {booster.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-primary-dark">Benefits:</div>
                    <div className="flex flex-wrap gap-1">
                      {booster.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedBooster === booster.id && isUnlocked && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button 
                    onClick={() => onActivateBooster(booster.id)}
                    className="w-full bg-primary hover:bg-primary-dark"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Activate {booster.name}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Progress Tips */}
      <Card className="p-4 bg-gradient-subtle">
        <div className="flex items-start gap-3">
          <Trophy className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-primary-dark mb-1">Unlock More Power</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Maintain daily streaks (+2 power per day)</li>
              <li>• Complete reflections (+1.5 power per entry)</li>
              <li>• Improve mood trends (+10 power per point)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}