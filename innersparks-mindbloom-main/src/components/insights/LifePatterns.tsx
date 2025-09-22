import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Repeat, 
  Clock, 
  Calendar,
  Target,
  Sparkles,
  ArrowRight,
  Zap,
  Eye,
  Lightbulb
} from "lucide-react";

interface LifePattern {
  id: string;
  name: string;
  description: string;
  strength: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  insights: string[];
  recommendations: string[];
  frequency: string;
  category: 'emotional' | 'behavioral' | 'social' | 'growth';
}

interface LifePatternsProps {
  patterns: LifePattern[];
  onExplorePattern: (patternId: string) => void;
}

export default function LifePatterns({ patterns, onExplorePattern }: LifePatternsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emotional': return '❤️';
      case 'behavioral': return '🔄';
      case 'social': return '👥';
      case 'growth': return '🌱';
      default: return '⭐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotional': return 'bg-red-100 text-red-700 border-red-200';
      case 'behavioral': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'social': return 'bg-green-100 text-green-700 border-green-200';
      case 'growth': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'stable': return <Target className="w-4 h-4 text-blue-500" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-orange-500 rotate-180" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const strongPatterns = patterns.filter(p => p.strength >= 70);
  const emergingPatterns = patterns.filter(p => p.strength >= 40 && p.strength < 70);
  const weakPatterns = patterns.filter(p => p.strength < 40);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-primary-dark flex items-center justify-center gap-2">
          <Eye className="w-6 h-6" />
          Life Pattern Analysis
        </h2>
        <p className="text-muted-foreground">
          Discover the hidden patterns shaping your daily experiences
        </p>
      </div>

      {/* Strong Patterns */}
      {strongPatterns.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-primary-dark">Strong Patterns</h3>
            <Badge className="bg-primary text-primary-foreground">
              {strongPatterns.length} found
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {strongPatterns.map((pattern) => (
              <Card key={pattern.id} className="p-5 shadow-medium hover:shadow-strong transition-smooth">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getCategoryIcon(pattern.category)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary-dark flex items-center gap-2">
                          {pattern.name}
                          {getTrendIcon(pattern.trend)}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pattern.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(pattern.category)}>
                      {pattern.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pattern Strength</span>
                      <span className="font-medium text-primary-dark">{pattern.strength}%</span>
                    </div>
                    <Progress value={pattern.strength} className="h-2" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-primary-dark mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Key Insights
                      </h5>
                      <ul className="space-y-1">
                        {pattern.insights.slice(0, 2).map((insight, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-primary mt-1">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-primary-dark mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Recommendations
                      </h5>
                      <ul className="space-y-1">
                        {pattern.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-success mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        {pattern.frequency}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last 30 days
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onExplorePattern(pattern.id)}
                      className="text-xs"
                    >
                      Explore
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Emerging Patterns */}
      {emergingPatterns.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-primary-dark">Emerging Patterns</h3>
            <Badge variant="outline">
              {emergingPatterns.length} developing
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {emergingPatterns.map((pattern) => (
              <Card key={pattern.id} className="p-4 shadow-soft hover:shadow-medium transition-smooth">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div className="text-xl">{getCategoryIcon(pattern.category)}</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-primary-dark text-sm flex items-center gap-1">
                          {pattern.name}
                          {getTrendIcon(pattern.trend)}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pattern.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Development</span>
                      <span className="font-medium text-primary-dark">{pattern.strength}%</span>
                    </div>
                    <Progress value={pattern.strength} className="h-1" />
                  </div>

                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onExplorePattern(pattern.id)}
                    className="w-full text-xs"
                  >
                    Track Progress
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-primary-dark">Pattern Summary</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-dark">{strongPatterns.length}</div>
              <div className="text-xs text-muted-foreground">Strong</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-dark">{emergingPatterns.length}</div>
              <div className="text-xs text-muted-foreground">Emerging</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-dark">{patterns.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Continue journaling to discover deeper patterns and insights about your life journey.
          </p>
        </div>
      </Card>
    </div>
  );
}