// AI Mentor Service - Groq API Integration for Journal Analysis
import { groqFallbackService, GroqFallbackResult } from './groqFallbackService';
import { monitorApiCall, addBreadcrumb, logError } from '@/lib/sentry';

// The comprehensive AI mentor prompt as provided
const AI_MENTOR_PROMPT = `Role: 
You are a senior prompt engineer and compassionate teacher—expert in habit formation, moral education, and behavior change. You are also a scholar of world religions, Panchatantra and folk tales, major self-help books, and modern behavioral science. You design safe, concise, motivating system responses that build good habits, strong character, moral values, and ethical living—helping students and adults become good citizens. 

Objective: 
Analyze an entire daily journal entry as a single unit and generate a concise, action-oriented feedback report that: 
Provides one unified Assessment of the full entry (✅/⚠️/⛔ + one-line reason). 
Highlights and reinforces any character-building, moral, or ethical actions. 
Supplies Positive Quotes (up to two, paraphrased; do not name scriptures). 
Includes a brief Science Check when relevant: [neuroscience/RCT/meta-analysis/public-health]—one-line risk + one-line safer alternative. 
Offers concrete Suggestion for improving any suboptimal actions tomorrow using "If… then…" implementation intentions. 
Rewards good actions with praise + badge/emoji. 
Inserts definitions of character building, moral values, and ethical values if the journal lacks clear examples (always varied). 
Detects missing core values with confidence (High/Medium/Low) and proposes 2–3 micro-habits (If… then…) to strengthen them. 
Ends with one final Encouragement line + badge/emoji. 
Concludes with a rotating short ending covering: 
Character building lesson or anecdote 
Moral values tip 
Ethical values suggestion 

Metadata Handling: 
Front-end passes metadata: language, age group (child/teen/adult), religion ("All Religions"/"Universal Ethics"). 
Never ask for metadata; always respond in English, adapting tone and depth. 

Output Structure: 

Unified Assessment 
Assessment: ⬜ Provide a clear, unified assessment of the full journal entry (✅/⚠️/⛔ + one-line reason) that addresses all key thoughts, emotions, actions, and ethical considerations from the entry. 

Date header 
Date: YYYY-MM-DD — Day. 
Unified Assessment block (≤20 lines): 
Assessment: ✅/⚠️/⛔ + one-line reason. 
Positive Quote(s): one uplifting quote or proverb + optional paraphrased teaching. 
Science Check (if applicable): [neuroscience/RCT/meta-analysis/public-health]—one-line risk + one-line safer alternative. 
Suggestion: If…, then… implementation intention for tomorrow. 
Reward: one praise line + badge/emoji. 
Values Definitions (only if no clear examples): 
– Character building: brief varied definition. 
– Moral values: brief varied definition. 
– Ethical values: brief varied definition. 
Overall Values Insight: 
– Missing core values (list + confidence). 
– 2–3 micro-habits (If…, then…) to strengthen each missing value. 
Final Encouragement: 
– One encouraging line + badge/emoji. 
Rotating Short Ending (varied each reply): 
– Character building lesson or anecdote. 
– Moral values tip. 
– Ethical values suggestion. 

Formatting & Tone: 
Keep each section ≤20 lines. 
Use "If… then…" for suggestions. 
Adapt tone: children = simple/playful; teens = direct/respectful; adults = concise/empathetic. 
Vary quotes, praise templates, and endings; avoid repetition. 
For "All Religions," include at most two paraphrased scripture parallels if directly relevant. 
For harmful content (⛔), clearly state risk, provide safer alternative, and run safety escalation if needed. 
Prioritize brevity and clarity—no per-sentence analysis. 

Privacy & Safety: 
Journaling is private; minors require parental consent for sharing. 
Self-harm or imminent danger → display crisis helplines and emergency steps. 
Hate or extremist content → refuse, de-escalate, and provide safe resources. 

Final Checklist: 
Single Assessment block for the entire entry. 
Include positive quote(s), science check, suggestion, reward. 
Add definitions if values missing. 
Overall values insight with micro-habits. 
Final encouragement + badge and rotating ending. 
No metadata questions; maintain variation and brevity. 
Check sources and adjust as needed per entry.`;

export interface JournalAnalysisRequest {
  journalText: string;
  mood: number;
  values: string[];
  userAge?: number;
  userReligion?: string;
  previousEntries?: string[];
}

export interface ActionAnalysis {
  action: string;
  assessment: {
    type: '✅' | '⚠️' | '⛔';
    reason: string;
  };
  scripture?: string;
  scienceCheck?: {
    verdict: 'Correct' | 'Incorrect' | 'Risky';
    evidence: string;
    alternative: string;
  };
  mindsetAnalysis: string;
  suggestion: string;
  encouragement: string;
}

export interface JournalAnalysisResponse {
  date: string;
  dayName: string;
  actions: ActionAnalysis[];
  overallInsights: string[];
  recommendations: string[];
  patterns: string[];
}

class AImentorService {
  private async callGroqAPI(prompt: string): Promise<GroqFallbackResult> {
    try {
      return await groqFallbackService.generateCompletion(
        prompt,
        AI_MENTOR_PROMPT,
        {
          temperature: 0.7,
          maxTokens: 2048,
          topP: 1,
          stream: false
        }
      );
    } catch (error) {
      console.error('AI Mentor Service Error:', error);
      throw error;
    }
  }

  private async checkApiHealth(): Promise<boolean> {
    return await groqFallbackService.checkApiHealth();
  }

  async analyzeJournalEntry(request: JournalAnalysisRequest): Promise<JournalAnalysisResponse> {
    return await monitorApiCall('journal-analysis', async () => {
      addBreadcrumb('Starting journal analysis', 'ai-mentor', 'info');
      
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

      const analysisPrompt = `
Please analyze this journal entry:

Journal Text: "${request.journalText}"
Mood Rating: ${request.mood}/5
Values Explored: ${request.values.join(', ')}
${request.userAge ? `User Age: ${request.userAge}` : ''}
${request.userReligion ? `User Religion: ${request.userReligion}` : 'Religion: All Religions/Universal Ethics'}

Please provide structured feedback following the exact format specified in your instructions. Break down the journal entry into discrete actions and analyze each one individually.
`;

      // Always try API first - prioritize API responses over fallback
      try {
        console.log('🚀 Attempting Groq API analysis...');
        addBreadcrumb('Calling Groq API for analysis', 'ai-mentor', 'info');
        
        const result = await this.callGroqAPI(analysisPrompt);
        
        console.log('📝 Raw API Response:', result.response.substring(0, 200) + '...');
        console.log(`✅ Analysis completed using model: ${result.modelUsed} in ${result.totalDuration}ms`);
        
        addBreadcrumb(`Analysis completed with ${result.modelUsed}`, 'ai-mentor', 'info');
        
        // Parse the API response
        const parsedResponse = this.parseAnalysisResponse(result.response, dateStr, dayName);
        
        // If we got any meaningful response from API, use it
        if (result.response && result.response.length > 50) {
        console.log('✅ API analysis successful - using API response');
        return parsedResponse;
      } else {
        console.log('⚠️ API response too short, using fallback');
        addBreadcrumb('API response too short, using fallback', 'ai-mentor', 'warning');
      }
    } catch (error) {
      console.error('❌ API failed, using fallback:', error);
      logError(error as Error, { 
        context: 'journal_analysis_api_failure',
        journalLength: request.journalText.length,
        mood: request.mood,
        valuesCount: request.values.length
      });
      addBreadcrumb('API failed, using fallback analysis', 'ai-mentor', 'warning');
    }

    // Fallback system with enhanced analysis
    console.log('🔄 Using enhanced fallback analysis system...');
    addBreadcrumb('Using fallback analysis system', 'ai-mentor', 'info');
    
    const actions = this.createFallbackAnalysis(request.journalText, request.mood);
    
    // Generate contextual insights based on mood and content
    const overallInsights = this.generateContextualInsights(request);
    const recommendations = this.generatePersonalizedRecommendations(request);
    const patterns = this.identifyPatterns(request.journalText, request.mood);

    addBreadcrumb('Journal analysis completed successfully', 'ai-mentor', 'info');

    return {
      date: dateStr,
      dayName: dayName,
      actions: actions,
      overallInsights,
      recommendations,
      patterns
    };
    });
  }

  private generateContextualInsights(request: JournalAnalysisRequest): string[] {
    const insights: string[] = [];
    const text = request.journalText.toLowerCase();
    
    // Mood-based insights
    if (request.mood >= 4) {
      insights.push('Your positive mood reflects healthy emotional patterns and good self-care');
    } else if (request.mood <= 2) {
      insights.push('Low mood periods are normal - acknowledging them is the first step to improvement');
      insights.push('Consider reaching out for support when you need it - connection helps healing');
    } else {
      insights.push('Neutral moods provide good opportunities for balanced self-reflection');
    }
    
    // Content-based insights
    if (text.includes('grateful') || text.includes('thankful')) {
      insights.push('Gratitude practice is scientifically proven to improve mental health and life satisfaction');
    }
    
    if (text.includes('challenge') || text.includes('difficult')) {
      insights.push('Facing challenges with awareness shows emotional maturity and growth potential');
    }
    
    if (text.includes('friend') || text.includes('family') || text.includes('social')) {
      insights.push('Social connections are fundamental to wellbeing and personal development');
    }
    
    // Default insights
    insights.push('Regular journaling builds self-awareness and emotional intelligence');
    insights.push('Your commitment to reflection demonstrates dedication to personal growth');
    
    return insights.slice(0, 4); // Limit to 4 insights
  }

  private generatePersonalizedRecommendations(request: JournalAnalysisRequest): string[] {
    const recommendations: string[] = [];
    const text = request.journalText.toLowerCase();
    
    // Mood-based recommendations
    if (request.mood <= 2) {
      recommendations.push('Practice one small self-care activity daily (walk, tea, music, etc.)');
      recommendations.push('Consider talking to someone you trust about how you\'re feeling');
    } else if (request.mood >= 4) {
      recommendations.push('Share your positive energy with others - it multiplies the joy');
      recommendations.push('Document what contributed to this good mood for future reference');
    }
    
    // Content-based recommendations
    if (text.includes('stress') || text.includes('overwhelm')) {
      recommendations.push('Try the 4-7-8 breathing technique when feeling overwhelmed');
      recommendations.push('Break large tasks into smaller, manageable steps');
    }
    
    if (text.includes('goal') || text.includes('improve')) {
      recommendations.push('Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)');
    }
    
    // Universal recommendations
    recommendations.push('Continue your daily journaling practice for consistent growth');
    recommendations.push('Try to journal at the same time each day to build a strong habit');
    recommendations.push('Focus on specific actions and their outcomes for deeper insights');
    
    return recommendations.slice(0, 4); // Limit to 4 recommendations
  }

  private identifyPatterns(journalText: string, mood: number): string[] {
    const patterns: string[] = [];
    const text = journalText.toLowerCase();
    
    // Emotional patterns
    if (mood >= 4) {
      patterns.push('Positive emotional regulation and mood management');
    } else if (mood <= 2) {
      patterns.push('Processing challenging emotions with self-awareness');
    }
    
    // Behavioral patterns
    if (text.includes('routine') || text.includes('habit')) {
      patterns.push('Building structured daily routines and habits');
    }
    
    if (text.includes('reflect') || text.includes('think')) {
      patterns.push('Regular self-reflection and mindfulness practice');
    }
    
    if (text.includes('goal') || text.includes('plan')) {
      patterns.push('Goal-oriented thinking and future planning');
    }
    
    // Default pattern
    patterns.push('Commitment to personal growth through journaling');
    
    return patterns.slice(0, 3); // Limit to 3 patterns
  }

  private createFallbackAnalysis(journalText: string, mood: number = 3): ActionAnalysis[] {
    // Enhanced fallback analysis with pattern recognition and sentiment analysis
    const sentences = journalText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const text = journalText.toLowerCase();
    
    // Sentiment and pattern analysis
    const positiveWords = ['happy', 'grateful', 'thankful', 'appreciate', 'love', 'joy', 'excited', 'proud', 'accomplished', 'peaceful', 'content', 'blessed'];
    const challengeWords = ['difficult', 'hard', 'struggle', 'challenge', 'problem', 'stress', 'worry', 'anxious', 'frustrated', 'overwhelmed', 'tired', 'sad'];
    const growthWords = ['learn', 'grow', 'improve', 'develop', 'practice', 'try', 'goal', 'progress', 'better', 'change', 'effort', 'work'];
    const socialWords = ['friend', 'family', 'talk', 'share', 'help', 'support', 'together', 'connect', 'relationship', 'team', 'group'];
    const healthWords = ['exercise', 'walk', 'run', 'eat', 'sleep', 'rest', 'healthy', 'workout', 'meditation', 'breathe', 'relax'];
    const workWords = ['work', 'study', 'school', 'project', 'assignment', 'meeting', 'deadline', 'task', 'job', 'career', 'focus'];
    
    const actions: ActionAnalysis[] = [];
    
    // If no clear sentences, analyze the whole text as one action
    const textSegments = sentences.length > 0 ? sentences.slice(0, 4) : [journalText];
    
    textSegments.forEach((segment, index) => {
      const trimmedSegment = segment.trim();
      const segmentLower = trimmedSegment.toLowerCase();
      
      let assessment: ActionAnalysis['assessment'];
      let mindsetAnalysis: string;
      let suggestion: string;
      let encouragement: string;
      let scripture: string | undefined;
      let scienceCheck: ActionAnalysis['scienceCheck'] | undefined;
      
      // Advanced pattern matching
      const hasPositive = positiveWords.some(word => segmentLower.includes(word));
      const hasChallenge = challengeWords.some(word => segmentLower.includes(word));
      const hasGrowth = growthWords.some(word => segmentLower.includes(word));
      const hasSocial = socialWords.some(word => segmentLower.includes(word));
      const hasHealth = healthWords.some(word => segmentLower.includes(word));
      const hasWork = workWords.some(word => segmentLower.includes(word));
      
      // Determine primary category and response
      if (hasPositive && !hasChallenge) {
        assessment = { type: '✅', reason: 'Positive emotional experience' };
        mindsetAnalysis = 'Cultivating positive emotions and gratitude';
        suggestion = 'Continue nurturing these positive experiences and consider sharing them with others';
        encouragement = 'Your positive outlook is a strength that builds resilience! ✨';
        scripture = 'Philippians 4:8 - Focus on whatever is true, noble, right, pure, lovely, and admirable';
        scienceCheck = {
          verdict: 'Correct',
          evidence: 'Neuroscience research shows gratitude practices increase dopamine and serotonin',
          alternative: 'Keep a daily gratitude journal to strengthen these neural pathways'
        };
      } else if (hasChallenge && hasGrowth) {
        assessment = { type: '⚠️', reason: 'Constructively addressing challenges' };
        mindsetAnalysis = 'Growth mindset - viewing challenges as opportunities';
        suggestion = 'Break down this challenge into smaller, manageable steps you can tackle tomorrow';
        encouragement = 'Your willingness to grow through challenges shows real wisdom! 💪';
        scripture = 'James 1:2-4 - Consider it pure joy when you face trials, because they develop perseverance';
      } else if (hasChallenge) {
        assessment = { type: '⚠️', reason: 'Experiencing difficulties - needs attention' };
        mindsetAnalysis = 'Processing difficult emotions and situations';
        suggestion = 'Consider reaching out for support or breaking this challenge into smaller parts';
        encouragement = 'Acknowledging difficulties takes courage. You\'re stronger than you know! 🌟';
        scienceCheck = {
          verdict: 'Risky',
          evidence: 'Chronic stress without coping strategies can impact mental and physical health',
          alternative: 'Practice stress-reduction techniques like deep breathing or talking to someone you trust'
        };
      } else if (hasSocial) {
        assessment = { type: '✅', reason: 'Building meaningful connections' };
        mindsetAnalysis = 'Investing in relationships and community';
        suggestion = 'Continue nurturing these relationships with regular check-ins and quality time';
        encouragement = 'Strong relationships are the foundation of wellbeing! 🤝';
        scienceCheck = {
          verdict: 'Correct',
          evidence: 'Harvard Study of Adult Development shows strong relationships are key to happiness and health',
          alternative: 'Schedule regular time for meaningful conversations with people you care about'
        };
      } else if (hasHealth) {
        assessment = { type: '✅', reason: 'Prioritizing physical wellbeing' };
        mindsetAnalysis = 'Understanding the mind-body connection';
        suggestion = 'Build on this healthy habit by setting a specific time and goal for tomorrow';
        encouragement = 'Taking care of your body is taking care of your mind! 🏃‍♂️';
        scienceCheck = {
          verdict: 'Correct',
          evidence: 'Meta-analysis shows regular exercise reduces anxiety and depression by 20-30%',
          alternative: 'Even 10 minutes of daily movement can significantly impact mood and energy'
        };
      } else if (hasWork) {
        assessment = { type: '✅', reason: 'Engaging with responsibilities' };
        mindsetAnalysis = 'Balancing productivity with personal wellbeing';
        suggestion = 'Consider how to make this work more meaningful or efficient tomorrow';
        encouragement = 'Your dedication to your responsibilities shows character! 📚';
      } else if (hasGrowth) {
        assessment = { type: '✅', reason: 'Commitment to personal development' };
        mindsetAnalysis = 'Embracing continuous learning and improvement';
        suggestion = 'Set one specific, measurable goal based on what you want to learn or improve';
        encouragement = 'Your growth mindset is your superpower! Keep evolving! 🌱';
      } else {
        // Default positive assessment for general reflection
        assessment = { type: '✅', reason: 'Thoughtful self-reflection' };
        mindsetAnalysis = 'Developing self-awareness through reflection';
        suggestion = 'Continue this practice of mindful reflection to deepen self-understanding';
        encouragement = 'Self-reflection is the first step to wisdom! 🧠';
      }
      
      // Adjust based on mood if very low
      if (mood <= 2 && assessment.type === '✅') {
        assessment = { type: '⚠️', reason: 'Low mood needs gentle attention' };
        suggestion = 'Focus on one small, nurturing action for yourself tomorrow';
        encouragement = 'Even small steps count. You\'re doing better than you think! 💙';
      }
      
      actions.push({
        action: trimmedSegment,
        assessment,
        mindsetAnalysis,
        suggestion,
        encouragement,
        ...(scripture && { scripture }),
        ...(scienceCheck && { scienceCheck })
      });
    });
    
    return actions.length > 0 ? actions : [{
      action: "Daily reflection practice",
      assessment: { type: '✅', reason: 'Commitment to self-awareness' },
      mindsetAnalysis: 'Building the habit of mindful self-reflection',
      suggestion: 'Continue this daily practice and try to be more specific about your experiences',
      encouragement: 'Every moment of self-reflection is a step toward growth! 🌟'
    }];
  }

  private parseAnalysisResponse(response: string, date: string, dayName: string): JournalAnalysisResponse {
    console.log('🔍 Parsing API response...');
    
    // Enhanced parser for the new unified assessment format
    const lines = response.split('\n').filter(line => line.trim());
    
    const actions: ActionAnalysis[] = [];
    let insights: string[] = [];
    let recommendations: string[] = [];
    let patterns: string[] = [];
    
    // Parse unified assessment format
    let unifiedAssessment: Partial<ActionAnalysis> = {
      action: "Journal Entry Analysis"
    };
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse unified Assessment
      if (trimmedLine.match(/^Assessment:/i)) {
        const assessmentText = trimmedLine.replace(/^Assessment:/i, '').trim();
        const type = assessmentText.includes('✅') ? '✅' : assessmentText.includes('⚠️') ? '⚠️' : assessmentText.includes('⛔') ? '⛔' : '✅';
        unifiedAssessment.assessment = {
          type,
          reason: assessmentText.replace(/[✅⚠️⛔—]/g, '').trim() || 'Positive reflection'
        };
      }
      // Parse Positive Quote(s)
      else if (trimmedLine.match(/^Positive Quote/i)) {
        unifiedAssessment.scripture = trimmedLine.split(':').slice(1).join(':').trim();
      }
      // Parse Science Check
      else if (trimmedLine.match(/^Science Check:/i)) {
        const scienceText = trimmedLine.replace(/^Science Check:/i, '').trim();
        unifiedAssessment.scienceCheck = {
          verdict: scienceText.includes('Correct') ? 'Correct' : scienceText.includes('Risky') ? 'Risky' : 'Incorrect',
          evidence: scienceText,
          alternative: 'Consider healthier alternatives'
        };
      }
      // Parse Suggestion (If... then... format)
      else if (trimmedLine.match(/^Suggestion:/i)) {
        unifiedAssessment.suggestion = trimmedLine.replace(/^Suggestion:/i, '').trim();
      }
      // Parse Reward/Encouragement
      else if (trimmedLine.match(/^(Reward|Final Encouragement):/i)) {
        unifiedAssessment.encouragement = trimmedLine.split(':').slice(1).join(':').trim() || 'Keep up the great work! 🌟';
      }
      // Parse Values Definitions
      else if (trimmedLine.match(/^– (Character building|Moral values|Ethical values):/i)) {
        insights.push(trimmedLine.replace(/^–\s*/, ''));
      }
      // Parse Missing core values and micro-habits
      else if (trimmedLine.match(/^– Missing core values/i) || trimmedLine.match(/^– \d+–\d+ micro-habits/i)) {
        recommendations.push(trimmedLine.replace(/^–\s*/, ''));
      }
      // Parse rotating endings (character, moral, ethical)
      else if (trimmedLine.match(/^– (Character building|Moral values|Ethical values)/i)) {
        patterns.push(trimmedLine.replace(/^–\s*/, ''));
      }
      // Extract general insights from content
      else if (trimmedLine.length > 20 && !trimmedLine.match(/^(Date|Assessment|Positive|Science|Suggestion|Reward|Final|–)/i)) {
        if (trimmedLine.toLowerCase().includes('insight') || trimmedLine.toLowerCase().includes('pattern')) {
          patterns.push(trimmedLine);
        } else if (trimmedLine.toLowerCase().includes('recommend') || trimmedLine.toLowerCase().includes('suggest') || trimmedLine.toLowerCase().includes('if')) {
          recommendations.push(trimmedLine);
        } else {
          insights.push(trimmedLine);
        }
      }
    }
    
    // Complete the unified assessment with defaults if needed
    this.completeActionDefaults(unifiedAssessment);
    actions.push(unifiedAssessment as ActionAnalysis);

    // If no structured format was found, extract from the response content
    if (!unifiedAssessment.assessment && response.length > 50) {
      console.log('📝 No structured format found, extracting from content...');
      const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      if (sentences.length > 0) {
        actions[0] = {
          action: "Journal Entry Analysis",
          assessment: { type: '✅', reason: 'AI-analyzed reflection' },
          mindsetAnalysis: sentences[1]?.trim().substring(0, 100) || 'Thoughtful self-reflection',
          suggestion: sentences[2]?.trim().substring(0, 100) || 'Continue this reflective practice',
          encouragement: 'Great work on your self-reflection journey! 🌟'
        };
      }
    }

    // Ensure we have at least one action with proper defaults
    if (actions.length === 0 || !actions[0].assessment) {
      actions[0] = {
        action: "Journal Entry Analysis",
        assessment: { type: '✅', reason: 'Positive self-reflection practice' },
        mindsetAnalysis: 'Engaging in mindful self-reflection',
        suggestion: 'Continue this daily practice for personal growth',
        encouragement: 'Excellent work on your journaling journey! 🌟'
      };
    }

    console.log(`✅ Parsed unified assessment from API response`);

    return {
      date,
      dayName,
      actions,
      overallInsights: insights.length > 0 ? insights.slice(0, 3) : [
        'Regular journaling builds self-awareness and emotional intelligence',
        'Consistent reflection helps identify patterns and growth opportunities'
      ],
      recommendations: recommendations.length > 0 ? recommendations.slice(0, 3) : [
        'Continue daily journaling practice',
        'Try to journal at the same time each day',
        'Focus on specific actions and their outcomes'
      ],
      patterns: patterns.length > 0 ? patterns.slice(0, 3) : ['Self-reflection and mindfulness practice']
    };
  }

  private completeActionDefaults(action: Partial<ActionAnalysis>): void {
    if (!action.assessment) {
      action.assessment = { type: '✅', reason: 'Positive reflection' };
    }
    if (!action.mindsetAnalysis) {
      action.mindsetAnalysis = 'Thoughtful self-reflection';
    }
    if (!action.suggestion) {
      action.suggestion = 'Continue this positive practice';
    }
    if (!action.encouragement) {
      action.encouragement = 'Keep up the great work! 🌟';
    }
  }

  async getPersonalizedPrompts(userHistory: string[], mood: number): Promise<string[]> {
    const prompt = `Based on this user's journaling history and current mood (${mood}/5), suggest 3 personalized reflection prompts:

Recent entries: ${userHistory.slice(-5).join(' | ')}

Please provide 3 specific, actionable prompts that would help this user continue their growth journey.`;

    try {
      const result = await this.callGroqAPI(prompt);
      return result.response.split('\n').filter(line => line.trim()).slice(0, 3);
    } catch (error) {
      console.error("Failed to get personalized prompts:", error);
      return [
        "What is one small action you can take today to improve your well-being?",
        "Reflect on a moment today when you felt most aligned with your values.",
        "What pattern in your behavior would you like to change, and what's one tiny step toward that change?"
      ];
    }
  }
}

export const aiMentorService = new AImentorService();
