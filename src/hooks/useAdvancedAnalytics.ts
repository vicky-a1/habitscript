import { useState, useEffect, useMemo } from 'react';

export interface JournalEntry {
  date: string;
  mood: number;
  values: string[];
  text: string;
  timeSpent: number;
  streak: number;
  emotions?: string[];
  insights?: string[];
  wordCount?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  themes?: string[];
}

export interface AdvancedInsights {
  emotionalPattern: {
    dominant: string;
    trend: 'improving' | 'stable' | 'declining';
    stability: number;
  };
  writingMetrics: {
    averageLength: number;
    complexity: number;
    expressiveness: number;
  };
  personalGrowth: {
    valuesEvolution: string[];
    thematicProgression: string[];
    breakthroughMoments: string[];
  };
  recommendations: {
    promptSuggestions: string[];
    focusAreas: string[];
    celebratedStrengths: string[];
  };
}

export function useAdvancedAnalytics(entries: JournalEntry[]) {
  const [insights, setInsights] = useState<AdvancedInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const enhancedEntries = useMemo(() => {
    return entries.map(entry => ({
      ...entry,
      wordCount: entry.text.split(' ').length,
      sentiment: analyzeSentiment(entry.text),
      emotions: extractEmotions(entry.text),
      themes: extractThemes(entry.text, entry.values),
    }));
  }, [entries]);

  const generateInsights = useMemo(() => {
    if (enhancedEntries.length < 3) return null;

    const recentEntries = enhancedEntries.slice(0, 7);
    const allMoods = enhancedEntries.map(e => e.mood);
    const allValues = enhancedEntries.flatMap(e => e.values);
    const allThemes = enhancedEntries.flatMap(e => e.themes || []);

    // Emotional Pattern Analysis
    const moodVariance = calculateVariance(allMoods);
    const moodTrend = calculateTrend(allMoods);
    const dominantEmotion = findMostFrequent(enhancedEntries.flatMap(e => e.emotions || []));

    // Writing Metrics
    const avgLength = enhancedEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0) / enhancedEntries.length;
    const complexity = calculateComplexity(enhancedEntries);
    const expressiveness = calculateExpressiveness(enhancedEntries);

    // Personal Growth Tracking
    const valuesEvolution = trackValuesEvolution(enhancedEntries);
    const thematicProgression = trackThematicProgression(allThemes);
    const breakthroughMoments = identifyBreakthroughs(enhancedEntries);

    // AI-Powered Recommendations
    const promptSuggestions = generatePromptSuggestions(enhancedEntries);
    const focusAreas = identifyFocusAreas(enhancedEntries);
    const celebratedStrengths = identifyCelebratedStrengths(enhancedEntries);

    return {
      emotionalPattern: {
        dominant: dominantEmotion,
        trend: (moodTrend > 0.1 ? 'improving' : moodTrend < -0.1 ? 'declining' : 'stable') as 'improving' | 'stable' | 'declining',
        stability: Math.max(0, 1 - moodVariance / 2),
      },
      writingMetrics: {
        averageLength: avgLength,
        complexity,
        expressiveness,
      },
      personalGrowth: {
        valuesEvolution,
        thematicProgression,
        breakthroughMoments,
      },
      recommendations: {
        promptSuggestions,
        focusAreas,
        celebratedStrengths,
      },
    };
  }, [enhancedEntries]);

  useEffect(() => {
    if (generateInsights) {
      setIsAnalyzing(true);
      // Simulate AI processing time
      const timer = setTimeout(() => {
        setInsights(generateInsights);
        setIsAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [generateInsights]);

  return { insights, isAnalyzing, enhancedEntries };
}

// Helper functions for advanced analysis
function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['happy', 'joy', 'love', 'excited', 'grateful', 'peaceful', 'confident', 'proud', 'hopeful', 'blessed'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'disappointed', 'stressed', 'overwhelmed', 'lonely', 'afraid'];
  
  const words = text.toLowerCase().split(/\s+/);
  const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
  const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractEmotions(text: string): string[] {
  const emotionMap = {
    'happy': ['happy', 'joy', 'cheerful', 'delighted'],
    'calm': ['peaceful', 'serene', 'tranquil', 'relaxed'],
    'excited': ['excited', 'thrilled', 'enthusiastic', 'energetic'],
    'grateful': ['grateful', 'thankful', 'appreciative', 'blessed'],
    'confident': ['confident', 'strong', 'capable', 'empowered'],
    'anxious': ['anxious', 'worried', 'nervous', 'stressed'],
    'sad': ['sad', 'melancholy', 'down', 'blue'],
    'frustrated': ['frustrated', 'annoyed', 'irritated', 'upset'],
  };

  const text_lower = text.toLowerCase();
  const emotions: string[] = [];

  Object.entries(emotionMap).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => text_lower.includes(keyword))) {
      emotions.push(emotion);
    }
  });

  return emotions;
}

function extractThemes(text: string, values: string[]): string[] {
  const themeKeywords = {
    'family': ['family', 'parents', 'siblings', 'relatives', 'home'],
    'friendship': ['friends', 'friendship', 'companion', 'peer'],
    'education': ['school', 'study', 'learn', 'exam', 'teacher'],
    'health': ['health', 'exercise', 'food', 'sleep', 'wellness'],
    'creativity': ['art', 'music', 'write', 'create', 'imagine'],
    'spirituality': ['prayer', 'meditation', 'faith', 'spiritual', 'divine'],
    'career': ['work', 'job', 'career', 'profession', 'ambition'],
    'nature': ['nature', 'trees', 'garden', 'environment', 'outdoor'],
  };

  const text_lower = text.toLowerCase();
  const themes: string[] = [];

  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    if (keywords.some(keyword => text_lower.includes(keyword))) {
      themes.push(theme);
    }
  });

  // Add values as themes
  themes.push(...values);

  return [...new Set(themes)];
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
  return variance;
}

function calculateTrend(numbers: number[]): number {
  if (numbers.length < 2) return 0;
  const recent = numbers.slice(0, Math.ceil(numbers.length / 2));
  const older = numbers.slice(Math.floor(numbers.length / 2));
  const recentAvg = recent.reduce((sum, n) => sum + n, 0) / recent.length;
  const olderAvg = older.reduce((sum, n) => sum + n, 0) / older.length;
  return recentAvg - olderAvg;
}

function findMostFrequent<T>(array: T[]): T {
  const frequency: Record<string, number> = {};
  array.forEach(item => {
    const key = String(item);
    frequency[key] = (frequency[key] || 0) + 1;
  });
  
  const mostFrequent = Object.entries(frequency).reduce((max, [key, count]) => 
    count > max.count ? { key, count } : max, { key: '', count: 0 });
  
  return mostFrequent.key as T;
}

function calculateComplexity(entries: JournalEntry[]): number {
  // Based on sentence structure, vocabulary diversity, etc.
  const avgSentenceLength = entries.reduce((sum, entry) => {
    const sentences = entry.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWords = sentences.reduce((s, sentence) => s + sentence.split(' ').length, 0) / sentences.length || 0;
    return sum + avgWords;
  }, 0) / entries.length;

  return Math.min(1, avgSentenceLength / 15); // Normalized to 0-1
}

function calculateExpressiveness(entries: JournalEntry[]): number {
  // Based on emotional words, descriptive language, etc.
  const emotionalWords = ['feel', 'emotion', 'heart', 'soul', 'deeply', 'intense', 'beautiful', 'amazing', 'wonderful'];
  
  const avgEmotionalDensity = entries.reduce((sum, entry) => {
    const words = entry.text.toLowerCase().split(/\s+/);
    const emotionalCount = words.filter(word => emotionalWords.some(ew => word.includes(ew))).length;
    return sum + (emotionalCount / words.length);
  }, 0) / entries.length;

  return Math.min(1, avgEmotionalDensity * 10); // Normalized to 0-1
}

function trackValuesEvolution(entries: JournalEntry[]): string[] {
  const timeSegments = 3;
  const segmentSize = Math.ceil(entries.length / timeSegments);
  const evolution: string[] = [];

  for (let i = 0; i < timeSegments; i++) {
    const segment = entries.slice(i * segmentSize, (i + 1) * segmentSize);
    const topValue = findMostFrequent(segment.flatMap(e => e.values));
    if (topValue) evolution.push(topValue);
  }

  return evolution;
}

function trackThematicProgression(themes: string[]): string[] {
  // Track how themes evolve over time
  const progression = findMostFrequent(themes);
  return progression ? [progression] : [];
}

function identifyBreakthroughs(entries: JournalEntry[]): string[] {
  // Identify entries with significant mood improvements or insights
  const breakthroughs: string[] = [];
  
  for (let i = 1; i < entries.length; i++) {
    const moodImprovement = entries[i-1].mood - entries[i].mood;
    if (moodImprovement >= 2) {
      breakthroughs.push(`Significant mood improvement on ${entries[i-1].date}`);
    }
  }

  return breakthroughs.slice(0, 3); // Limit to top 3
}

function generatePromptSuggestions(entries: JournalEntry[]): string[] {
  const recentThemes = entries.slice(0, 5).flatMap(e => e.themes || []);
  const dominantTheme = findMostFrequent(recentThemes);
  
  const suggestions = [
    `Explore your relationship with ${dominantTheme} more deeply`,
    'Reflect on a moment that challenged your perspective',
    'Write about three things you learned about yourself recently',
    'Describe your ideal day and what values it reflects',
    'Think about how you\'ve grown in the past month',
  ];

  return suggestions;
}

function identifyFocusAreas(entries: JournalEntry[]): string[] {
  const sentiments = entries.map(e => e.sentiment);
  const negativeCount = sentiments.filter(s => s === 'negative').length;
  const ratio = negativeCount / sentiments.length;

  const areas: string[] = [];
  
  if (ratio > 0.3) areas.push('Emotional Well-being');
  if (entries.some(e => e.themes?.includes('education'))) areas.push('Academic Growth');
  if (entries.some(e => e.themes?.includes('family'))) areas.push('Relationships');
  
  return areas.slice(0, 3);
}

function identifyCelebratedStrengths(entries: JournalEntry[]): string[] {
  const positiveEntries = entries.filter(e => e.sentiment === 'positive');
  const strengths: string[] = [];
  
  if (positiveEntries.length > entries.length * 0.6) {
    strengths.push('Positive Outlook');
  }
  
  const avgWordCount = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0) / entries.length;
  if (avgWordCount > 100) {
    strengths.push('Thoughtful Expression');
  }
  
  const uniqueValues = new Set(entries.flatMap(e => e.values)).size;
  if (uniqueValues > 5) {
    strengths.push('Values Exploration');
  }

  return strengths;
}