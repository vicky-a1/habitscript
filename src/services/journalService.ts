// Journal Service - Complete backend functionality for habitscript
export interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  values: string[];
  text: string;
  timeSpent: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  interests: string[];
  emotionalState: 'positive' | 'neutral' | 'negative';
  culturalContext: string;
  recentThemes: string[];
  joinedAt: Date;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  points: number;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'learning' | 'social';
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentCount: number;
  streak: number;
  isActive: boolean;
  createdAt: Date;
  completedDates: string[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalEntries: number;
  averageMood: number;
  topValues: string[];
  moodTrend: number[];
  insights: string[];
  achievements: string[];
  recommendations: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'mood' | 'values' | 'habits' | 'community';
  unlockedAt: Date;
  points: number;
}

class JournalService {
  private storageKey = 'habitscript-data';
  
  // Get all data from localStorage
  private getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {
      entries: [],
      profile: this.getDefaultProfile(),
      habits: [],
      achievements: [],
      weeklyReports: []
    };
  }

  // Save data to localStorage
  private saveData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private getDefaultProfile(): UserProfile {
    return {
      id: 'user-1',
      name: 'Arjun',
      email: 'arjun@example.com',
      age: 25,
      interests: ['reading', 'music', 'fitness', 'technology'],
      emotionalState: 'neutral',
      culturalContext: 'India',
      recentThemes: [],
      joinedAt: new Date(),
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      level: 1,
      points: 0
    };
  }

  // Journal Entry Methods
  async createEntry(entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    const data = this.getData();
    const entry: JournalEntry = {
      ...entryData,
      id: `entry-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    data.entries.unshift(entry);
    
    // Update profile stats
    data.profile.totalEntries++;
    data.profile.currentStreak = entryData.streak;
    data.profile.longestStreak = Math.max(data.profile.longestStreak, entryData.streak);
    data.profile.points += this.calculatePoints(entry);
    data.profile.level = Math.floor(data.profile.points / 100) + 1;
    
    // Update recent themes
    data.profile.recentThemes = [...new Set([...entryData.values, ...data.profile.recentThemes])].slice(0, 10);
    
    this.saveData(data);
    this.checkAchievements(data);
    
    return entry;
  }

  async getEntries(limit?: number): Promise<JournalEntry[]> {
    const data = this.getData();
    return limit ? data.entries.slice(0, limit) : data.entries;
  }

  async getEntry(id: string): Promise<JournalEntry | null> {
    const data = this.getData();
    return data.entries.find((entry: JournalEntry) => entry.id === id) || null;
  }

  async updateEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    const data = this.getData();
    const entryIndex = data.entries.findIndex((entry: JournalEntry) => entry.id === id);
    
    if (entryIndex === -1) return null;
    
    data.entries[entryIndex] = {
      ...data.entries[entryIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveData(data);
    return data.entries[entryIndex];
  }

  async deleteEntry(id: string): Promise<boolean> {
    const data = this.getData();
    const initialLength = data.entries.length;
    data.entries = data.entries.filter((entry: JournalEntry) => entry.id !== id);
    
    if (data.entries.length < initialLength) {
      data.profile.totalEntries--;
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Habit Methods
  async createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>): Promise<Habit> {
    const data = this.getData();
    const habit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date(),
      completedDates: []
    };

    data.habits.push(habit);
    this.saveData(data);
    return habit;
  }

  async getHabits(): Promise<Habit[]> {
    const data = this.getData();
    return data.habits || [];
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | null> {
    const data = this.getData();
    const habitIndex = data.habits.findIndex((habit: Habit) => habit.id === id);
    
    if (habitIndex === -1) return null;
    
    data.habits[habitIndex] = { ...data.habits[habitIndex], ...updates };
    this.saveData(data);
    return data.habits[habitIndex];
  }

  async completeHabit(id: string, date: string): Promise<boolean> {
    const data = this.getData();
    const habit = data.habits.find((h: Habit) => h.id === id);
    
    if (!habit) return false;
    
    if (!habit.completedDates.includes(date)) {
      habit.completedDates.push(date);
      habit.currentCount++;
      
      // Calculate streak
      const today = new Date();
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (habit.completedDates.includes(dateStr)) {
          streak++;
        } else {
          break;
        }
      }
      habit.streak = streak;
      
      data.profile.points += 10; // Points for habit completion
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Analytics Methods
  async getWeeklyReport(weekStart: string): Promise<WeeklyReport> {
    const data = this.getData();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekEntries = data.entries.filter((entry: JournalEntry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(weekStart) && entryDate <= weekEnd;
    });

    const moodTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dayEntry = weekEntries.find((entry: JournalEntry) => 
        entry.date === date.toISOString().split('T')[0]
      );
      return dayEntry?.mood || 0;
    });

    const allValues = weekEntries.flatMap((entry: JournalEntry) => entry.values);
    const valueCounts = allValues.reduce((acc: any, value: string) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    
    const topValues = Object.entries(valueCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([value]) => value);

    const averageMood = weekEntries.length > 0 
      ? weekEntries.reduce((sum: number, entry: JournalEntry) => sum + entry.mood, 0) / weekEntries.length
      : 0;

    const insights = this.generateWeeklyInsights(weekEntries, moodTrend, topValues);
    const achievements = this.getRecentAchievements(7);
    const recommendations = this.generateRecommendations(weekEntries, data.profile);

    return {
      weekStart,
      weekEnd: weekEnd.toISOString().split('T')[0],
      totalEntries: weekEntries.length,
      averageMood,
      topValues,
      moodTrend,
      insights,
      achievements: achievements.map(a => a.title),
      recommendations
    };
  }

  async getUserProfile(): Promise<UserProfile> {
    const data = this.getData();
    return data.profile;
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const data = this.getData();
    data.profile = { ...data.profile, ...updates };
    this.saveData(data);
    return data.profile;
  }

  // Achievement Methods
  async getAchievements(): Promise<Achievement[]> {
    const data = this.getData();
    return data.achievements || [];
  }

  private checkAchievements(data: any) {
    const achievements: Achievement[] = [];
    
    // First entry achievement
    if (data.profile.totalEntries === 1) {
      achievements.push({
        id: 'first-entry',
        title: 'First Steps',
        description: 'Completed your first journal entry',
        icon: '🌱',
        category: 'streak',
        unlockedAt: new Date(),
        points: 10
      });
    }

    // Streak achievements
    if (data.profile.currentStreak === 7) {
      achievements.push({
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day journaling streak',
        icon: '🔥',
        category: 'streak',
        unlockedAt: new Date(),
        points: 50
      });
    }

    if (data.profile.currentStreak === 30) {
      achievements.push({
        id: 'month-master',
        title: 'Month Master',
        description: 'Maintained a 30-day journaling streak',
        icon: '🏆',
        category: 'streak',
        unlockedAt: new Date(),
        points: 200
      });
    }

    // Level achievements
    if (data.profile.level === 5) {
      achievements.push({
        id: 'level-5',
        title: 'Rising Star',
        description: 'Reached level 5',
        icon: '⭐',
        category: 'streak',
        unlockedAt: new Date(),
        points: 100
      });
    }

    // Add new achievements
    achievements.forEach(achievement => {
      if (!data.achievements.find((a: Achievement) => a.id === achievement.id)) {
        data.achievements.push(achievement);
        data.profile.points += achievement.points;
      }
    });

    if (achievements.length > 0) {
      this.saveData(data);
    }
  }

  private calculatePoints(entry: JournalEntry): number {
    let points = 10; // Base points for entry
    points += entry.values.length * 2; // Points for values explored
    points += Math.floor(entry.timeSpent / 60) * 5; // Points for time spent
    if (entry.mood >= 4) points += 5; // Bonus for positive mood
    return points;
  }

  private generateWeeklyInsights(entries: JournalEntry[], moodTrend: number[], topValues: string[]): string[] {
    const insights: string[] = [];
    
    if (entries.length > 0) {
      const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
      if (avgMood >= 4) {
        insights.push("You had a particularly positive week with high mood scores!");
      } else if (avgMood <= 2) {
        insights.push("This week showed some challenges. Consider focusing on self-care activities.");
      }
    }

    if (topValues.length > 0) {
      insights.push(`Your top explored values this week were: ${topValues.slice(0, 3).join(', ')}`);
    }

    const moodImprovement = moodTrend[6] - moodTrend[0];
    if (moodImprovement > 1) {
      insights.push("Your mood showed significant improvement throughout the week!");
    }

    return insights;
  }

  private generateRecommendations(entries: JournalEntry[], profile: UserProfile): string[] {
    const recommendations: string[] = [];
    
    if (entries.length < 3) {
      recommendations.push("Try to journal more consistently this week for better insights");
    }

    const avgMood = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length 
      : 3;
    
    if (avgMood < 3) {
      recommendations.push("Consider exploring gratitude-focused prompts to boost your mood");
      recommendations.push("Try morning journaling sessions for a positive start to your day");
    }

    if (profile.recentThemes.length < 5) {
      recommendations.push("Explore a wider variety of values to gain deeper self-insights");
    }

    return recommendations;
  }

  private getRecentAchievements(days: number): Achievement[] {
    const data = this.getData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return (data.achievements || []).filter((achievement: Achievement) => 
      new Date(achievement.unlockedAt) >= cutoffDate
    );
  }

  // Search and Filter Methods
  async searchEntries(query: string): Promise<JournalEntry[]> {
    const data = this.getData();
    const lowercaseQuery = query.toLowerCase();
    
    return data.entries.filter((entry: JournalEntry) => 
      entry.text.toLowerCase().includes(lowercaseQuery) ||
      entry.values.some(value => value.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    const data = this.getData();
    return data.entries.filter((entry: JournalEntry) => 
      entry.date >= startDate && entry.date <= endDate
    );
  }

  async getEntriesByMoodRange(minMood: number, maxMood: number): Promise<JournalEntry[]> {
    const data = this.getData();
    return data.entries.filter((entry: JournalEntry) => 
      entry.mood >= minMood && entry.mood <= maxMood
    );
  }

  // Export/Import Methods
  async exportData(): Promise<string> {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Statistics Methods
  async getStatistics(): Promise<any> {
    const data = this.getData();
    const entries = data.entries;
    
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        averageMood: 0,
        totalTimeSpent: 0,
        mostCommonValues: [],
        moodDistribution: {},
        streakStats: { current: 0, longest: 0 }
      };
    }

    const totalTimeSpent = entries.reduce((sum: number, entry: JournalEntry) => sum + entry.timeSpent, 0);
    const averageMood = entries.reduce((sum: number, entry: JournalEntry) => sum + entry.mood, 0) / entries.length;
    
    const allValues = entries.flatMap((entry: JournalEntry) => entry.values);
    const valueCounts = allValues.reduce((acc: any, value: string) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonValues = Object.entries(valueCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([value, count]) => ({ value, count }));

    const moodDistribution = entries.reduce((acc: any, entry: JournalEntry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEntries: entries.length,
      averageMood: Math.round(averageMood * 100) / 100,
      totalTimeSpent,
      mostCommonValues,
      moodDistribution,
      streakStats: {
        current: data.profile.currentStreak,
        longest: data.profile.longestStreak
      }
    };
  }
}

export const journalService = new JournalService();