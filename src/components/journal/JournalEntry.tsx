import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Sparkles,
  Shield,
  Mic,
  Type,
  Globe2,
  Star,
  BookOpen,
  Save,
  Brain,
  Loader2
} from "lucide-react";
import { JournalPrompt } from "./JournalPrompts";
import { aiMentorService, JournalAnalysisResponse } from "@/services/aiMentorService";

interface JournalEntryProps {
  prompt: JournalPrompt;
  onComplete: (entry: {
    mood: number;
    text: string;
    values: string[];
    inputMethod: 'text' | 'voice';
    timeSpent: number;
  }) => void;
  onBack: () => void;
  existingEntry?: {
    text: string;
    mood: number;
  };
}

// Using the correct interface from the service
type AIAnalysisResult = JournalAnalysisResponse;

const moodEmojis = [
  { emoji: "😢", label: "Very Low", value: 1, color: "text-red-500" },
  { emoji: "😕", label: "Low", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Okay", value: 3, color: "text-yellow-500" },
  { emoji: "🙂", label: "Good", value: 4, color: "text-green-500" },
  { emoji: "😊", label: "Very Good", value: 5, color: "text-emerald-500" },
];

export default function JournalEntry({ prompt, onComplete, onBack, existingEntry }: JournalEntryProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalText, setJournalText] = useState("");
  const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text');
  const [startTime] = useState(Date.now());
  const [isListening, setIsListening] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (journalText.trim().length > 10) {
      setAutoSaveStatus('saving');
      try {
        // Save to localStorage as draft
        const draftData = {
          text: journalText,
          mood: selectedMood,
          timestamp: Date.now(),
          promptId: prompt.id
        };
        localStorage.setItem('journal-draft', JSON.stringify(draftData));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(null), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(null), 3000);
      }
    }
  }, [journalText, selectedMood, prompt.id]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 10000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Load existing entry or draft on component mount
  useEffect(() => {
    // First, check if we have existing entry data
    if (existingEntry) {
      setJournalText(existingEntry.text);
      setSelectedMood(existingEntry.mood);
      return;
    }
    
    // Otherwise, load draft from localStorage
    const draft = localStorage.getItem('journal-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        if (draftData.promptId === prompt.id && Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) {
          setJournalText(draftData.text || '');
          setSelectedMood(draftData.mood || null);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [prompt.id, existingEntry]);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleContinue = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSaveAndSubmit = async () => {
    if (selectedMood && journalText.trim()) {
      setIsSaving(true);
      try {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        await onComplete({
          mood: selectedMood,
          text: journalText.trim(),
          values: prompt.values,
          inputMethod,
          timeSpent
        });
        // Clear draft after successful submission
        localStorage.removeItem('journal-draft');
      } catch (error) {
        console.error('Failed to save journal entry:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!journalText.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await aiMentorService.analyzeJournalEntry({
        journalText: journalText.trim(),
        mood: selectedMood || 3,
        values: prompt.values,
        userAge: 25, // This could come from user profile
        userReligion: 'All Religions/Universal Ethics'
      });

      setAiAnalysis(analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Show error message to user
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = prompt.language === 'hindi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setJournalText(prev => prev + (prev ? ' ' : '') + transcript);
        setInputMethod('voice');
      };

      recognition.start();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-md mx-auto space-y-4 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-primary-dark" />
            <span className="text-sm font-medium text-primary-dark">
              {prompt.language === 'hindi' ? 'हिंदी' : 'English'}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStep} of 2</span>
            <span>{Math.round((currentStep / 2) * 100)}% complete</span>
          </div>
          <Progress value={(currentStep / 2) * 100} className="h-2" />
        </div>

        {/* Step 1: Mood Check */}
        {currentStep === 1 && (
          <Card className="p-6 shadow-medium animate-slide-up">
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary-dark" />
                  <span className="text-sm font-medium text-primary-dark">Today's Reflection: {prompt.title}</span>
                </div>
                <h2 className="text-xl font-medium mb-2 text-primary-dark">How are you feeling today?</h2>
                <p className="text-sm text-muted-foreground">
                  Choose the emoji that best represents your current mood
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      selectedMood === mood.value
                        ? 'border-primary bg-primary-light/20 shadow-md'
                        : 'border-gray-200 hover:border-primary-light'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{mood.emoji}</div>
                    <div className={`text-xs font-medium ${mood.color}`}>
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedMood}
                  className="flex-1 bg-primary hover:bg-primary-dark"
                >
                  Continue to Writing
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Journal Writing */}
        {currentStep === 2 && !showAnalysis && (
          <Card className="p-6 shadow-medium animate-slide-up">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2 text-primary-dark">Your Daily Reflection</h2>
                <p className="text-sm text-muted-foreground mb-2">
                    Write your day in 5-10 points. Share your experiences, thoughts, and feelings.
                  </p>

                  {/* Show the prompt story and questions */}
                  <div className="bg-card-soft p-3 rounded-lg border-l-4 border-primary mb-2 text-left">
                  <p className="text-sm leading-relaxed text-foreground mb-2">
                    {[
                      "✨ Transform your thoughts into powerful insights through journaling",
                      "🌱 Discover patterns in your daily experiences and grow mindfully",
                      "💭 Turn everyday moments into meaningful self-reflection",
                      "🚀 Unlock your potential through the power of written reflection",
                      "🎯 Build clarity and purpose through intentional journaling",
                      "🌟 Create positive change by documenting your journey"
                    ][Math.floor(Math.random() * 6)]}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-3 h-3 text-primary-dark" />
                      <span className="text-xs font-medium text-primary-dark">Daily Journal Guide:</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        1
                      </div>
                      <p className="text-xs text-foreground">Write about your emotions, experiences, and thoughts from today</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        2
                      </div>
                      <p className="text-xs text-foreground">Focus on what you learned, felt grateful for, or want to improve</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card-soft p-2 rounded-lg border-l-4 border-primary-light">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary-dark mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Your journal is private and secure. Auto-saves every 10 seconds.
                  </p>
                </div>
              </div>

              {/* Auto-save status */}
              {autoSaveStatus && (
                <div className="flex items-center gap-2 text-xs">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                      <span className="text-blue-600">Saving...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <Save className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">Auto-saved</span>
                    </>
                  )}
                  {autoSaveStatus === 'error' && (
                    <span className="text-red-600">Save failed - please try again</span>
                  )}
                </div>
              )}

              {/* Input Method Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={inputMethod === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMethod('text')}
                  className="flex-1"
                >
                  <Type className="w-4 h-4 mr-1" />
                  Type
                </Button>
                <Button
                  variant={inputMethod === 'voice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={startVoiceInput}
                  className="flex-1"
                  disabled={isListening}
                >
                  <Mic className={`w-4 h-4 mr-1 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
                  {isListening ? 'Listening...' : 'Voice'}
                </Button>
              </div>

              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write about your day:
• What made me feel good today?
• What challenges did I face?
• What am I grateful for?

Let your thoughts flow naturally..."
                className="min-h-48 sm:min-h-56 resize-none text-foreground text-sm sm:text-base"
              />

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs text-muted-foreground">
                <span>{journalText.length} characters</span>
                <span className="text-center sm:text-right">Min 50 characters for meaningful reflection</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <Button
                  onClick={handleSaveAndSubmit}
                  disabled={journalText.length < 50 || isSaving}
                  className="flex-1 bg-primary hover:bg-primary-dark min-w-0"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save & Submit
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleAnalyzeWithAI}
                  disabled={journalText.length < 50 || isAnalyzing}
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-600 min-w-0 text-xs sm:text-sm"
                  title="Get AI-powered insights and recommendations based on your journal entry"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      <span className="hidden sm:inline">Analyzing...</span>
                      <span className="sm:hidden">AI...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Analyze with Mentor</span>
                      <span className="sm:hidden">AI Mentor</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Remove old Step 3 - now integrated into Step 2 */}
        {false && (
          <Card className="p-6 shadow-medium animate-slide-up">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2 text-primary-dark">Your Daily Reflection</h2>
                <p className="text-sm text-muted-foreground">
                  Write your day in 5-10 points or more - your thoughts are safe and private
                </p>
              </div>

              <div className="bg-card-soft p-3 rounded-lg border-l-4 border-primary-light">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary-dark mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Your journal is private and secure. Auto-saves every 10 seconds.
                  </p>
                </div>
              </div>

              {/* Auto-save status */}
              {autoSaveStatus && (
                <div className="flex items-center gap-2 text-xs">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                      <span className="text-blue-600">Saving...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <Save className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">Auto-saved</span>
                    </>
                  )}
                  {autoSaveStatus === 'error' && (
                    <span className="text-red-600">Save failed - please try again</span>
                  )}
                </div>
              )}

              {/* Input Method Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={inputMethod === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMethod('text')}
                  className="flex-1"
                >
                  <Type className="w-4 h-4 mr-1" />
                  Type
                </Button>
                <Button
                  variant={inputMethod === 'voice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={startVoiceInput}
                  className="flex-1"
                  disabled={isListening}
                >
                  <Mic className={`w-4 h-4 mr-1 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
                  {isListening ? 'Listening...' : 'Voice'}
                </Button>
              </div>

              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write about your day in points:
• What happened today that made me feel good?
• What challenges did I face and how did I handle them?
• What am I grateful for today?
• What would I like to improve tomorrow?
• How did I live my values today?

Let your thoughts flow naturally..."
                className="min-h-40 resize-none text-foreground"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{journalText.length} characters</span>
                <span>Min 50 characters for meaningful reflection</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={handleSaveAndSubmit}
                  disabled={journalText.length < 50 || isSaving}
                  className="flex-1 bg-primary hover:bg-primary-dark"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save & Submit
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleAnalyzeWithAI}
                  disabled={journalText.length < 50 || isAnalyzing}
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-600"
                  title="Get AI-powered insights and recommendations based on your journal entry"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze with AI Mentor
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* AI Analysis Display */}
        {showAnalysis && aiAnalysis && (
          <Card className="p-4 sm:p-6 shadow-medium animate-slide-up">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-medium mb-2 text-primary-dark">AI Mentor Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  {aiAnalysis.date} — {aiAnalysis.dayName}
                </p>
              </div>

              {/* Action Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold text-primary-dark">Action-by-Action Analysis:</h3>
                {aiAnalysis.actions.map((action, index) => (
                  <div key={index} className="bg-card-soft p-3 sm:p-4 rounded-lg border-l-4 border-primary-light">
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div><strong>Action:</strong> {action.action}</div>
                      <div className="flex items-center gap-2">
                        <strong>Assessment:</strong>
                        <span className="text-lg">{action.assessment.type}</span>
                        <span>{action.assessment.reason}</span>
                      </div>
                      {action.scripture && (
                        <div><strong>Scripture/Source:</strong> {action.scripture}</div>
                      )}
                      {action.scienceCheck && (
                        <div><strong>Science Check:</strong> {action.scienceCheck.verdict} - {action.scienceCheck.evidence}</div>
                      )}
                      <div><strong>Mindset Analysis:</strong> {action.mindsetAnalysis}</div>
                      <div><strong>Suggestion:</strong> {action.suggestion}</div>
                      <div className="text-primary-dark font-medium">{action.encouragement}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Insights */}
              {aiAnalysis.overallInsights.length > 0 && (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Key Insights:</h3>
                  <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                    {aiAnalysis.overallInsights.map((insight, index) => (
                      <li key={index}>• {insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {aiAnalysis.recommendations.length > 0 && (
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Recommendations:</h3>
                  <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveAndSubmit}
                  disabled={isSaving}
                  className="flex-1 bg-primary hover:bg-primary-dark"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save & Complete
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowAnalysis(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Edit
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Remove old Step 4 - completion handled in Step 2 */}
        {false && (
          <Card className="p-6 shadow-medium animate-slide-up text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>

              <div>
                <h2 className="text-xl font-medium mb-2 text-primary-dark">Beautiful reflection! ✨</h2>
                <p className="text-sm text-muted-foreground">
                  You've explored meaningful values through this reflection
                </p>
              </div>

              <div className="bg-card-soft p-4 rounded-lg">
                <div className="text-sm font-medium mb-2 text-primary-dark">Today you explored:</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {prompt.values.map((value) => (
                    <Badge key={value} className="text-xs bg-primary text-primary-foreground">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-primary-light/20 p-3 rounded-lg">
                <Sparkles className="w-4 h-4 inline mr-1 text-primary-dark" />
                "Every small step counts. Your journey of self-discovery matters."
              </div>

              <Button onClick={handleSaveAndSubmit} className="w-full bg-primary hover:bg-primary-dark">
                Complete Today's Journey
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}