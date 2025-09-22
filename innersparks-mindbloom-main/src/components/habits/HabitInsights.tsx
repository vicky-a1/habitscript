import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Brain, 
  Lightbulb, 
  Target,
  Calendar,
  Clock,
  Sparkles,
  BarChart3
} from "lucide-react";

export default function HabitInsights() {
  const insights = [
    {
      id: 1,
      type: 'pattern',
      title: 'Morning Consistency',
      description: 'You complete 85% more habits when you start before 9 AM',
      suggestion: 'Try moving your evening habits to morning routine',
      confidence: 92,
      icon: <Clock className="w-5 h-5 text-primary" />
    },
    {
      id: 2,
      type: 'trend',
      title: 'Mood Connection',
      description: 'Your mood improves by 40% on days you complete gratitude practice',
      suggestion: 'Consider making gratitude your keystone habit',
      confidence: 88,
      icon: <Brain className="w-5 h-5 text-success" />
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'Weekend Gap',
      description: 'Your habit completion drops 60% on weekends',
      suggestion: 'Create a special weekend habit routine',
      confidence: 75,
      icon: <Calendar className="w-5 h-5 text-warning" />
    }
  ];

  const habitCorrelations = [
    { habit1: 'Morning Gratitude', habit2: 'Reading', correlation: 0.82, impact: 'positive' },
    { habit1: 'Kind Action', habit2: 'Exercise', correlation: 0.67, impact: 'positive' },
    { habit1: 'Late Screen Time', habit2: 'Morning Energy', correlation: -0.74, impact: 'negative' }
  ];

  const weeklyStats = {
    consistencyScore: 78,
    improvementTrend: '+12%',
    strongestDay: 'Tuesday',
    weakestDay: 'Saturday',
    bestTime: '7-9 AM',
    totalMinutes: 145
  };

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          This Week's Performance
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.consistencyScore}%</div>
            <div className="text-sm text-muted-foreground">Consistency</div>
            <Progress value={weeklyStats.consistencyScore} className="mt-2 h-2" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{weeklyStats.improvementTrend}</div>
            <div className="text-sm text-muted-foreground">vs Last Week</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">{weeklyStats.strongestDay}</div>
            <div className="text-sm text-muted-foreground">Best Day</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">{weeklyStats.totalMinutes}m</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI-Powered Insights
        </h3>
        
        {insights.map((insight) => (
          <Card key={insight.id} className="p-4 transition-smooth hover:shadow-medium">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {insight.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-foreground">{insight.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {insight.confidence}% confident
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground font-medium">Suggestion:</span>
                  <span className="text-sm text-muted-foreground">{insight.suggestion}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Habit Correlations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          Habit Connections
        </h3>
        <div className="space-y-3">
          {habitCorrelations.map((correlation, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  correlation.impact === 'positive' ? 'bg-success' : 'bg-destructive'
                }`} />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {correlation.habit1} → {correlation.habit2}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {correlation.impact === 'positive' ? 'Reinforces each other' : 'Conflicts with each other'}
                  </div>
                </div>
              </div>
              <Badge variant={correlation.impact === 'positive' ? 'default' : 'destructive'}>
                {Math.abs(correlation.correlation * 100).toFixed(0)}%
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Personal Records */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          Personal Records
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-primary rounded-lg text-white">
            <div className="text-2xl font-bold">21 days</div>
            <div className="text-sm opacity-90">Longest streak</div>
            <div className="text-xs opacity-75 mt-1">Reading habit</div>
          </div>
          <div className="p-4 bg-success rounded-lg text-white">
            <div className="text-2xl font-bold">5 habits</div>
            <div className="text-sm opacity-90">Best single day</div>
            <div className="text-xs opacity-75 mt-1">Last Tuesday</div>
          </div>
          <div className="p-4 bg-warning rounded-lg text-white">
            <div className="text-2xl font-bold">78%</div>
            <div className="text-sm opacity-90">Best week rate</div>
            <div className="text-xs opacity-75 mt-1">Week of March 15</div>
          </div>
          <div className="p-4 bg-accent rounded-lg text-white">
            <div className="text-2xl font-bold">12 hrs</div>
            <div className="text-sm opacity-90">Total habit time</div>
            <div className="text-xs opacity-75 mt-1">This month</div>
          </div>
        </div>
      </Card>
    </div>
  );
}