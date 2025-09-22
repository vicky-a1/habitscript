import { useState, useEffect } from 'react';
import { journalService, JournalEntry, UserProfile, Habit, WeeklyReport, Achievement } from '../services/journalService';

export const useJournalService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsync = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    
    // Journal Entry Methods
    createEntry: (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) =>
      handleAsync(() => journalService.createEntry(entryData)),
    
    getEntries: (limit?: number) =>
      handleAsync(() => journalService.getEntries(limit)),
    
    getEntry: (id: string) =>
      handleAsync(() => journalService.getEntry(id)),
    
    updateEntry: (id: string, updates: Partial<JournalEntry>) =>
      handleAsync(() => journalService.updateEntry(id, updates)),
    
    deleteEntry: (id: string) =>
      handleAsync(() => journalService.deleteEntry(id)),
    
    // Habit Methods
    createHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) =>
      handleAsync(() => journalService.createHabit(habitData)),
    
    getHabits: () =>
      handleAsync(() => journalService.getHabits()),
    
    updateHabit: (id: string, updates: Partial<Habit>) =>
      handleAsync(() => journalService.updateHabit(id, updates)),
    
    completeHabit: (id: string, date: string) =>
      handleAsync(() => journalService.completeHabit(id, date)),
    
    // Analytics Methods
    getWeeklyReport: (weekStart: string) =>
      handleAsync(() => journalService.getWeeklyReport(weekStart)),
    
    getUserProfile: () =>
      handleAsync(() => journalService.getUserProfile()),
    
    updateUserProfile: (updates: Partial<UserProfile>) =>
      handleAsync(() => journalService.updateUserProfile(updates)),
    
    getAchievements: () =>
      handleAsync(() => journalService.getAchievements()),
    
    // Search Methods
    searchEntries: (query: string) =>
      handleAsync(() => journalService.searchEntries(query)),
    
    getEntriesByDateRange: (startDate: string, endDate: string) =>
      handleAsync(() => journalService.getEntriesByDateRange(startDate, endDate)),
    
    getEntriesByMoodRange: (minMood: number, maxMood: number) =>
      handleAsync(() => journalService.getEntriesByMoodRange(minMood, maxMood)),
    
    // Statistics
    getStatistics: () =>
      handleAsync(() => journalService.getStatistics()),
    
    // Export/Import
    exportData: () =>
      handleAsync(() => journalService.exportData()),
    
    importData: (jsonData: string) =>
      handleAsync(() => journalService.importData(jsonData))
  };
};

// Hook for real-time data
export const useJournalData = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [entriesData, profileData, habitsData, achievementsData] = await Promise.all([
        journalService.getEntries(),
        journalService.getUserProfile(),
        journalService.getHabits(),
        journalService.getAchievements()
      ]);
      
      setEntries(entriesData);
      setProfile(profileData);
      setHabits(habitsData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    entries,
    profile,
    habits,
    achievements,
    loading,
    refreshData
  };
};