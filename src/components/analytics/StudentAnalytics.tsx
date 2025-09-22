import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Heart,
  BarChart3,
  Flame,
  Star
} from "lucide-react";

interface StudentAnalyticsProps {
  streak: number;
  totalDays: number;
  moodTrend: number;
  topValues: string[];
  weeklyProgress: number[];
}

export default function StudentAnalytics({ 
  streak, 
  totalDays, 
  moodTrend, 
  topValues, 
  weeklyProgress 
}: StudentAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  
  const level = Math.floor(totalDays / 7) + 1;
  const progressToNextLevel = ((totalDays % 7) / 7) * 100;
  const averageMood = weeklyProgress.reduce((a, b) => a + b, 0) / weeklyProgress.length || 0;
  
  const achievements = [
    { title: "First Steps", description: "Completed first journal entry", unlocked: totalDays >= 1 },
    { title: "Week Warrior", description: "7 days of consistent journaling", unlocked: streak >= 7 },
    { title: "Mood Master", description: "Maintained positive mood for 5 days", unlocked: averageMood >= 4 },
    { title: "Values Explorer", description: "Explored 5 different values", unlocked: topValues.length >= 5 },
    { title: "Reflection Hero", description: "30 days of journaling", unlocked: totalDays >= 30 },
  ];

  const moodLabels = ["Very Low", "Low", "Okay", "Good", "Very Good"];
  const currentMoodLabel = moodLabels[Math.round(averageMood) - 1] || "Getting Started";

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center shadow-soft">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <div className="text-2xl font-bold text-primary-dark">{streak}</div>
          </div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </Card>
        
        <Card className="p-4 text-center shadow-soft">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <div className="text-2xl font-bold text-primary-dark">{level}</div>
          </div>
          <div className="text-xs text-muted-foreground">Current Level</div>
        </Card>
        
        <Card className="p-4 text-center shadow-soft">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div className="text-2xl font-bold text-primary-dark">{totalDays}</div>
          </div>
          <div className="text-xs text-muted-foreground">Total Days</div>
        </Card>
        
        <Card className="p-4 text-center shadow-soft">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <div className="text-2xl font-bold text-primary-dark">{averageMood.toFixed(1)}</div>
          </div>
          <div className="text-xs text-muted-foreground">Avg Mood</div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-4 shadow-soft">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-primary-dark">Level {level}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressToNextLevel)}% to Level {level + 1}
            </span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {7 - (totalDays % 7)} more days to reach Level {level + 1}
          </p>
        </div>
      </Card>

      {/* Mood Trend */}
      <Card className="p-4 shadow-soft">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-medium text-primary-dark">Mood Trend</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {currentMoodLabel}
            </Badge>
          </div>
          
          <div className="flex items-end gap-1 h-20">
            {weeklyProgress.map((mood, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t min-h-2 transition-smooth"
                  style={{ height: `${(mood / 5) * 100}%` }}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Values */}
      <Card className="p-4 shadow-soft">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-primary-dark">Values You've Explored</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topValues.map((value, index) => (
              <Badge 
                key={value} 
                variant={index < 3 ? "default" : "secondary"} 
                className="text-xs"
              >
                {value}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-4 shadow-soft">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-primary-dark">Achievements</span>
          </div>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div 
                key={achievement.title}
                className={`flex items-center gap-3 p-2 rounded-lg transition-smooth ${
                  achievement.unlocked 
                    ? 'bg-primary-light/20 border border-primary-light' 
                    : 'bg-muted/20 border border-muted'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {achievement.unlocked ? '✓' : '○'}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-primary-dark' : 'text-muted-foreground'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}