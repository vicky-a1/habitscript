import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  Calendar,
  Target,
  Zap,
  Award,
  Clock,
  Plus
} from "lucide-react";
import { useJournalData, useJournalService } from "@/hooks/useJournalService";

export default function HabitTracker() {
  const { habits, loading, refreshData } = useJournalData();
  const journalService = useJournalService();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'health' as 'health' | 'productivity' | 'mindfulness' | 'learning' | 'social',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    targetCount: 1
  });

  const today = new Date().toISOString().split('T')[0];

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;
    
    await journalService.createHabit({
      ...newHabit,
      currentCount: 0,
      streak: 0,
      isActive: true
    });
    
    await refreshData();
    setShowAddDialog(false);
    setNewHabit({
      name: '',
      description: '',
      category: 'health',
      frequency: 'daily',
      targetCount: 1
    });
  };

  const toggleHabit = async (habitId: string) => {
    const habit = habits?.find(h => h.id === habitId);
    if (!habit) return;

    const isCompletedToday = habit.completedDates.includes(today);
    
    if (isCompletedToday) {
      // Remove today's completion
      const updatedDates = habit.completedDates.filter(date => date !== today);
      await journalService.updateHabit(habitId, {
        completedDates: updatedDates,
        currentCount: Math.max(0, habit.currentCount - 1)
      });
    } else {
      // Mark as completed today
      await journalService.completeHabit(habitId, today);
    }
    
    await refreshData();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mindfulness': return <Zap className="w-4 h-4 text-purple-600" />;
      case 'health': return <Target className="w-4 h-4 text-green-600" />;
      case 'learning': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'social': return <Award className="w-4 h-4 text-pink-600" />;
      case 'productivity': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      mindfulness: "bg-purple-100 text-purple-700 border-purple-200",
      learning: "bg-blue-100 text-blue-700 border-blue-200",
      health: "bg-green-100 text-green-700 border-green-200",
      productivity: "bg-orange-100 text-orange-700 border-orange-200",
      social: "bg-pink-100 text-pink-700 border-pink-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const totalStreakDays = habits?.reduce((sum, habit) => sum + habit.streak, 0) || 0;
  const completedToday = habits?.filter(h => h.completedDates.includes(today)).length || 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Habit Tracker</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Habit Name</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Exercise"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <Input
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., 30 minutes of cardio"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select value={newHabit.category} onValueChange={(value: any) => setNewHabit(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddHabit} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  Add Habit
                </Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-white shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{completedToday}</div>
          <div className="text-sm text-gray-600">Today</div>
        </Card>
        <Card className="p-4 text-center bg-white shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{totalStreakDays}</div>
          <div className="text-sm text-gray-600">Total Streaks</div>
        </Card>
        <Card className="p-4 text-center bg-white shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{habits?.length || 0}</div>
          <div className="text-sm text-gray-600">Active Habits</div>
        </Card>
        <Card className="p-4 text-center bg-white shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">
            {habits && habits.length > 0 ? Math.round((habits.reduce((sum, h) => sum + h.currentCount, 0) / habits.reduce((sum, h) => sum + h.targetCount, 0)) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Progress</div>
        </Card>
      </div>

      {/* Habit List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Today's Habits
        </h3>
        
        {habits && habits.length > 0 ? habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(today);
          
          return (
            <Card key={habit.id} className="p-4 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleHabit(habit.id)}
                    className="p-1 h-auto"
                  >
                    {isCompletedToday ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </Button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(habit.category)}
                      <h4 className="font-semibold text-gray-900">{habit.name}</h4>
                      <Badge className={getCategoryColor(habit.category)}>
                        {habit.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{habit.streak} day streak</span>
                      </div>
                      <div className="flex-1 max-w-32">
                        <Progress 
                          value={(habit.currentCount / habit.targetCount) * 100} 
                          className="h-2"
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {habit.currentCount}/{habit.targetCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        }) : (
          <Card className="p-8 text-center bg-gray-50">
            <p className="text-gray-600 mb-4">No habits yet. Start building positive habits!</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Habit
            </Button>
          </Card>
        )}
      </div>

      {/* Achievements */}
      {habits && habits.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {habits.filter(h => h.streak >= 7).length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-900">7+ day streak achieved!</span>
              </div>
            )}
            {habits.reduce((sum, h) => sum + h.currentCount, 0) >= 10 && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-900">10+ habits completed</span>
              </div>
            )}
            {habits.length >= 3 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-900">Multiple habits active!</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}