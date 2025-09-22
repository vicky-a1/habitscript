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
// AI service temporarily disabled

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
}

interface AIAnalysisResult {
  analysis: string;
  insights: string[];
  recommendations: string[];
  patterns: string[];
}

const moodEmojis = [
  { emoji: "😢", label: "Very Low", value: 1, color: "text-red-500" },
  { emoji: "😕", label: "Low", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Okay", value: 3, color: "text-yellow-500" },
  { emoji: "🙂", label: "Good", value: 4, color: "text-green-500" },
  { emoji: "😊", label: "Very Good", value: 5, color: "text-emerald-500" },
];

export default function JournalEntry({ prompt, onComplete, onBack }: JournalEntryProps) {
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

  // Load draft on component mount
  useEffect(() => {
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
  }, [prompt.id]);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleContinue = () => {
    if (currentStep < 4) {
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
      // Mock AI analysis for now
      const mockAnalysis = {
        analysis: "Your reflection shows thoughtful consideration of your daily experiences.",
        insights: ["You demonstrate good self-awareness", "Your values are clearly reflected in your actions"],
        recommendations: ["Continue practicing mindfulness", "Consider setting specific goals for tomorrow"],
        patterns: ["Consistent positive attitude", "Strong focus on personal growth"]
      };

      setAiAnalysis(mockAnalysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('AI analysis failed:', error);
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
      <div className="max-w-md mx-auto space-y-6">
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
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Step 1: Prompt Display */}
        {currentStep === 1 && (
          <Card className="p-6 shadow-medium animate-slide-up">
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary-dark" />
                  <h2 className="text-xl font-medium text-primary-dark">{prompt.title}</h2>
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {prompt.values.map((value) => (
                    <Badge key={value} variant="outline" className="text-xs border-primary-dark text-primary-dark">
                      {value}
                    </Badge>
                  ))}
                </div>
                {prompt.region && (
                  <Badge variant="secondary" className="text-xs mb-4">
                    {prompt.region.charAt(0).toUpperCase() + prompt.region.slice(1)} India
                  </Badge>
                )}
              </div>
              
              <div className="bg-card-soft p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm leading-relaxed text-foreground">
                  {prompt.story}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary-dark" />
                  <span className="text-sm font-medium text-primary-dark">Reflect on these:</span>
                </div>
                {prompt.questions.map((question, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-foreground">{question}</p>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleContinue} className="w-full bg-primary hover:bg-primary-dark">
                Let's Reflect
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Mood Check */}
        {currentStep === 2 && (
          <Card className="p-6 shadow-medium animate-slide-up">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2 text-primary-dark">How are you feeling today?</h2>
                <p className="text-sm text-muted-foreground">
                  Choose the emoji that best describes your mood
                </p>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`p-4 rounded-lg border-2 transition-smooth ${
                      selectedMood === mood.value
                        ? 'border-primary bg-primary-light shadow-soft'
                        : 'border-border hover:border-primary-light hover:bg-card-soft'
                    }`}
                  >
                    <div className="text-3xl mb-1">{mood.emoji}</div>
                    <div className={`text-xs font-medium ${selectedMood === mood.value ? 'text-primary-dark' : 'text-muted-foreground'}`}>
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>
              
              <Button 
                onClick={handleContinue} 
                disabled={!selectedMood}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Journal Entry */}
        {currentStep === 3 && !showAnalysis && (
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
              <div className="flex gap-3">
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
                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
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
          <Card className="p-6 shadow-medium animate-slide-up">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-medium mb-2 text-primary-dark">AI Mentor Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  {aiAnalysis.date} — {aiAnalysis.dayName}
                </p>
              </div>

              {/* Action Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold text-primary-dark">Action-by-Action Analysis:</h3>
                {aiAnalysis.actions.map((action, index) => (
                  <div key={index} className="bg-card-soft p-4 rounded-lg border-l-4 border-primary-light">
                    <div className="space-y-2 text-sm">
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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Key Insights:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {aiAnalysis.overallInsights.map((insight, index) => (
                      <li key={index}>• {insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {aiAnalysis.recommendations.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Recommendations:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
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

        {/* Step 4: Completion */}
        {currentStep === 4 && !showAnalysis && (
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