import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Lightbulb, 
  Target, 
  Star,
  BookOpen,
  Sparkles,
  Award,
  ArrowRight
} from "lucide-react";
import { AdvancedInsights } from "@/hooks/useAdvancedAnalytics";

interface AIInsightsProps {
  insights: AdvancedInsights;
  isAnalyzing: boolean;
  onAcceptRecommendation: (recommendation: string) => void;
}

export default function AIInsights({ insights, isAnalyzing, onAcceptRecommendation }: AIInsightsProps) {
  if (isAnalyzing) {
    return (
      <Card className="p-6 text-center shadow-soft">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-primary animate-pulse" />
          <Sparkles className="w-6 h-6 text-primary-glow animate-pulse" />
        </div>
        <h3 className="text-lg font-medium text-primary-dark mb-2">AI Analyzing Your Journey...</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our advanced AI is processing your entries to provide personalized insights
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
        </div>
      </Card>
    );
  }

  const { emotionalPattern, writingMetrics, personalGrowth, recommendations } = insights;

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="p-6 bg-gradient-primary text-white shadow-medium">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
            <p className="text-sm opacity-90">Personalized analysis of your journaling journey</p>
          </div>
        </div>
      </Card>

      {/* Emotional Pattern Analysis */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <h3 className="text-lg font-medium text-primary-dark">Emotional Intelligence</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-card-soft rounded-lg">
            <div className="text-2xl font-bold text-primary-dark mb-1">
              {emotionalPattern.dominant}
            </div>
            <div className="text-xs text-muted-foreground">Dominant Emotion</div>
          </div>
          
          <div className="text-center p-4 bg-card-soft rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className={`w-4 h-4 ${
                emotionalPattern.trend === 'improving' ? 'text-green-500' : 
                emotionalPattern.trend === 'declining' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <div className="text-lg font-bold text-primary-dark capitalize">
                {emotionalPattern.trend}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Emotional Trend</div>
          </div>
          
          <div className="text-center p-4 bg-card-soft rounded-lg">
            <div className="text-2xl font-bold text-primary-dark mb-1">
              {Math.round(emotionalPattern.stability * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Emotional Stability</div>
            <Progress value={emotionalPattern.stability * 100} className="h-1 mt-2" />
          </div>
        </div>
      </Card>

      {/* Writing Analytics */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-medium text-primary-dark">Writing Analytics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Length</span>
              <span className="text-sm font-medium text-primary-dark">
                {Math.round(writingMetrics.averageLength)} words
              </span>
            </div>
            <Progress value={Math.min(100, (writingMetrics.averageLength / 200) * 100)} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Complexity</span>
              <span className="text-sm font-medium text-primary-dark">
                {Math.round(writingMetrics.complexity * 100)}%
              </span>
            </div>
            <Progress value={writingMetrics.complexity * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expressiveness</span>
              <span className="text-sm font-medium text-primary-dark">
                {Math.round(writingMetrics.expressiveness * 100)}%
              </span>
            </div>
            <Progress value={writingMetrics.expressiveness * 100} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Personal Growth Tracking */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-medium text-primary-dark">Personal Growth Journey</h3>
        </div>
        
        <div className="space-y-4">
          {personalGrowth.valuesEvolution.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-primary-dark mb-2">Values Evolution</h4>
              <div className="flex items-center gap-2">
                {personalGrowth.valuesEvolution.map((value, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">{value}</Badge>
                    {index < personalGrowth.valuesEvolution.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {personalGrowth.breakthroughMoments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-primary-dark mb-2">Breakthrough Moments</h4>
              <div className="space-y-2">
                {personalGrowth.breakthroughMoments.map((moment, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {moment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6 shadow-soft border-primary-light border-2">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-medium text-primary-dark">Personalized Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {recommendations.promptSuggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-primary-dark mb-3">Suggested Prompts</h4>
              <div className="space-y-2">
                {recommendations.promptSuggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card-soft rounded-lg">
                    <span className="text-sm text-primary-dark flex-1">{suggestion}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onAcceptRecommendation(suggestion)}
                      className="ml-2"
                    >
                      Try It
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {recommendations.focusAreas.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-primary-dark mb-2">Recommended Focus Areas</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.focusAreas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {recommendations.celebratedStrengths.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-primary-dark mb-2">Your Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.celebratedStrengths.map((strength, index) => (
                  <Badge key={index} variant="default" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}