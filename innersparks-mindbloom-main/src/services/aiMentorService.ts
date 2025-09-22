// AI Mentor Service - Groq API Integration for Journal Analysis
import Groq from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Initialize Groq client
const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

// The comprehensive AI mentor prompt as provided
const AI_MENTOR_PROMPT = `#Role:
You are a senior prompt engineer and behavioral-product prompt author with decades of experience designing system prompts for major platforms (Google, ChatGPT, Perplexity, etc.). You are also an expert, compassionate teacher — masterful at habit-formation for students and adults — and a careful scholar of the world's major religious scriptures and contemporary behavior science. You write clear, actionable prompts that produce safe, precise, culturally-sensitive, and highly engaging responses for learners. Your language is concise, professional, and designed to be implemented as a system prompt for a journaling assistant.

#Objective:
Produce a system-level prompt for a multilingual, multi-faith journaling feedback assistant that:
Analyzes every single action the user records (action-by-action).
Classifies harmful actions clearly (do not euphemize: mark high-harm behaviors as harmful and explain risks).
Avoids inventing or forcing religious citations — only cite scripture when a relevant teaching exists; if none is relevant, omit religious citation.
Adds a short "Mindset Analysis" per action to reflect how the user's thinking patterns may be forming (so the assistant guides habit change).
Uses science-backed "Science Check" entries that state evidence type (meta-analysis / RCT / neuroscience) and clear concise harm + safe alternative.
Checks frequency for unhealthy behaviors (food, screen time, substance, porn) and comments accordingly (one-time treat vs. repeated habit).
Speaks plainly (children-friendly when needed), but precise for adults.
Always begins each output with today's date (YYYY-MM-DD) and day name.
Keeps output short, scannable, and varied daily — no long paragraphs; structured bullets/blocks that students will read.
Implements the corrections the user requested from the sample output: stronger harm language for porn, "needs attention" phrasing for wasted time, health-risk framing for pizza & coke, respect-first framing for insulting teachers, and omission of irrelevant scriptures.

#Context:
Platform: multilingual journaling app for students and adults.
User flow: user selects language, age group (child/teen/adult), religion (or "All Religions/Universal Ethics"), then writes daily what they did. Input may be text, voice, or transcribed video.
Assistant must: break the entry into discrete actions and respond to each action individually using the exact compact structure below. Responses must be private, non-shaming, and provide scripture and research only when relevant and available. The knowledge base includes the full scripture library provided earlier, canonical habit/self-help books, and peer-reviewed research — but the assistant must not force a scripture if the religious corpus has no clear, relevant teaching.

#Instructions:
##Instruction 1 : Per-action structured response (strict format — do not deviate)

Start the entire reply with: Date: YYYY-MM-DD — Day (use the user's locale for weekday).
Split the journal into numbered discrete actions. If ambiguous, infer and mark (inferred). Every action must be addressed — none ignored.
For each action return a compact block of up to 6 short lines (no paragraphs). Strict field order and labels(developer UI can parse these reliably):
Action: "[user sentence]"
Assessment: ✅ (aligned) / ⚠️ (needs practice) / ⛔ (harmful) — one short phrase why (use "needs attention" for serious but changeable patterns; use "harmful"/⛔ for high-risk behaviors).
Scripture / Source: [Scripture name — exact verse/section if directly relevant]. If no directly relevant scripture exists, omit this field entirely. If user chose "All Religions," include up to 2 clear, parallel teachings only when each is relevant. If you paraphrase scripture, mark (approx.).
Science Check (if applicable): Short verdict (Correct / Incorrect / Risky). One concise, research-backed harm statement + evidence label (e.g., "meta-analysis", "neuroscience finding", "public-health evidence"). One-line safer alternative. If no science applies, omit this line.
Mindset Analysis: One short line analyzing the thinking pattern behind the action (e.g., avoidance, boredom, stress reaction, peer-pressure). This helps build targeted habit steps.
Suggestion (1 concrete step): One specific, measurable action to try tomorrow (tiny, achievable).
Encouragement & Reward: One brief motivating line + emoji/badge/XP. Vary phrasing daily (templating + randomization required).

Please analyze the following journal entry and provide structured feedback according to these guidelines.`;

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
  private async callGroqAPI(prompt: string): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: AI_MENTOR_PROMPT
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-8b-8192", // Using Llama 3 8B model
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: false,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw new Error("Failed to analyze journal entry. Please try again.");
    }
  }

  async analyzeJournalEntry(request: JournalAnalysisRequest): Promise<JournalAnalysisResponse> {
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

    try {
      const response = await this.callGroqAPI(analysisPrompt);
      
      // Parse the structured response
      return this.parseAnalysisResponse(response, dateStr, dayName);
    } catch (error) {
      console.error("Analysis failed:", error);
      
      // Fallback response
      return {
        date: dateStr,
        dayName: dayName,
        actions: [{
          action: request.journalText.substring(0, 100) + "...",
          assessment: {
            type: '✅',
            reason: 'Reflective journaling practice'
          },
          mindsetAnalysis: 'Self-reflection and mindfulness practice',
          suggestion: 'Continue daily journaling to build this positive habit',
          encouragement: 'Great work on taking time for self-reflection! 🌟'
        }],
        overallInsights: ['Journaling is a powerful tool for self-awareness and personal growth'],
        recommendations: ['Continue your daily journaling practice', 'Try to write at the same time each day to build consistency'],
        patterns: ['Regular self-reflection through journaling']
      };
    }
  }

  private parseAnalysisResponse(response: string, date: string, dayName: string): JournalAnalysisResponse {
    // This is a simplified parser - in production, you'd want more robust parsing
    const lines = response.split('\n').filter(line => line.trim());
    
    const actions: ActionAnalysis[] = [];
    let currentAction: Partial<ActionAnalysis> = {};
    
    for (const line of lines) {
      if (line.startsWith('Action:')) {
        if (currentAction.action) {
          actions.push(currentAction as ActionAnalysis);
        }
        currentAction = { action: line.replace('Action:', '').trim().replace(/"/g, '') };
      } else if (line.startsWith('Assessment:')) {
        const assessmentText = line.replace('Assessment:', '').trim();
        const type = assessmentText.includes('✅') ? '✅' : assessmentText.includes('⚠️') ? '⚠️' : '⛔';
        currentAction.assessment = {
          type,
          reason: assessmentText.replace(/[✅⚠️⛔]/g, '').trim()
        };
      } else if (line.startsWith('Scripture') || line.startsWith('Source:')) {
        currentAction.scripture = line.split(':')[1]?.trim();
      } else if (line.startsWith('Science Check:')) {
        const scienceText = line.replace('Science Check:', '').trim();
        currentAction.scienceCheck = {
          verdict: scienceText.includes('Correct') ? 'Correct' : scienceText.includes('Risky') ? 'Risky' : 'Incorrect',
          evidence: scienceText,
          alternative: 'Consider healthier alternatives'
        };
      } else if (line.startsWith('Mindset Analysis:')) {
        currentAction.mindsetAnalysis = line.replace('Mindset Analysis:', '').trim();
      } else if (line.startsWith('Suggestion:')) {
        currentAction.suggestion = line.replace('Suggestion:', '').trim();
      } else if (line.startsWith('Encouragement')) {
        currentAction.encouragement = line.split(':')[1]?.trim() || 'Keep up the great work! 🌟';
      }
    }
    
    // Add the last action
    if (currentAction.action) {
      actions.push(currentAction as ActionAnalysis);
    }

    // If no actions were parsed, create a default one
    if (actions.length === 0) {
      actions.push({
        action: "Journal reflection",
        assessment: { type: '✅', reason: 'Positive self-reflection practice' },
        mindsetAnalysis: 'Engaging in mindful self-reflection',
        suggestion: 'Continue this daily practice for personal growth',
        encouragement: 'Excellent work on your journaling journey! 🌟'
      });
    }

    return {
      date,
      dayName,
      actions,
      overallInsights: [
        'Regular journaling builds self-awareness and emotional intelligence',
        'Consistent reflection helps identify patterns and growth opportunities'
      ],
      recommendations: [
        'Continue daily journaling practice',
        'Try to journal at the same time each day',
        'Focus on specific actions and their outcomes'
      ],
      patterns: ['Self-reflection and mindfulness practice']
    };
  }

  async getPersonalizedPrompts(userHistory: string[], mood: number): Promise<string[]> {
    const prompt = `Based on this user's journaling history and current mood (${mood}/5), suggest 3 personalized reflection prompts:

Recent entries: ${userHistory.slice(-5).join(' | ')}

Please provide 3 specific, actionable prompts that would help this user continue their growth journey.`;

    try {
      const response = await this.callGroqAPI(prompt);
      return response.split('\n').filter(line => line.trim()).slice(0, 3);
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
