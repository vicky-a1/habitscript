interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'crisis' | 'assessment';
}

interface BotResponse {
  message: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  recommendations?: string[];
  requiresProfessionalHelp?: boolean;
}

interface UserInfo {
  name?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  pronouns?: string;
  location?: string;
  language?: string;
  emergencyContact?: string;
}

interface AssessmentData {
  moodRating: number;
  reasonForVisit: string;
  energyLevel: number;
  sleepQuality: number;
  appetiteChanges: boolean;
  socialSupport: number;
  stressLevel: number;
  copingStrategies: string[];
  safetyRisk: boolean;
  selfHarmThoughts: boolean;
  suicidalIdeation: boolean;
}

import { groqFallbackService, GroqFallbackResult } from './groqFallbackService';

class MentalHealthBotService {
  private apiKeys = {
    groq: import.meta.env.VITE_GROQ_API_KEY,
    openai: undefined, // Not available in browser environment
    anthropic: undefined, // Not available in browser environment
    // Add other API keys as needed
  };

  // Simplified fallback for non-Groq providers
  private fallbackModels = [
    { provider: 'groq', model: 'primary' }, // Will use groqFallbackService
    { provider: 'openai', model: 'gpt-4' },
    { provider: 'openai', model: 'gpt-4-turbo' },
    { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
    { provider: 'anthropic', model: 'claude-3-5-haiku-20241022' },
    { provider: 'openai', model: 'gpt-3.5-turbo' },
    { provider: 'local', model: 'fallback-response' }
  ];

  private systemPrompt = `Role: Compassionate mental-health expert (30+ yrs). As an AI companion provide empathetic, evidence-based support and screening for children, teens, and adults. Do NOT prescribe, diagnose, or replace care.

Objective: Collect core personal data only what required like name age; run an age-appropriate assessment; detect risks (anxiety, depression, hopelessness, self-harm, psychosis, abuse) and escalate; offer validation and coping strategies; generate a concise report; suggest professional help.

Context: First contact. Users type "START". Tone: playful (children), respectful (teens), professional (adults). Use clear, nonjudgmental language.

On "START": greet by age and collect: name; DOB (DD/MM/YYYY) → compute age; gender/pronouns; location; language; emergency contact (optional, ask consent). Confirm and request permission.

Assessment (age-adapted): mood (1–10), reason for visit, energy; emotion regulation; sleep/appetite/somatic symptoms; social supports; school/work functioning; stressors and coping; safety: self-harm, feeling unsafe, life-worth. Trigger crisis protocol for concerning answers.

Crisis protocol: detect imminent risk (suicidal intent/plan, self-harm, harm to others, psychosis, abuse, severe panic). Steps: safety check; advise emergency services; provide local hotlines; offer to stay connected; follow mandated reporting. For moderate issues validate and recommend professional care.

Support: stay empathetic; offer evidence-based coping (breathing, sleep routine, activity, social contact, journaling, limit distressing media). Tailor to age/culture.

Report: auto-generate header, DOB/age, session info; brief impression; key concerns and severity; strengths; domain findings; risk level; 24–48h actions; self-care; follow-up and professional guidance (URGENT/RECOMMENDED/OPTIONAL). Close with encouragement.

Safeguards: respect privacy; obtain consent before sharing; never prescribe; escalate when needed; adapt pacing. End: "You've taken a brave step today. Help is available."`;

  private crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'self harm',
    'hurt myself', 'cutting', 'overdose', 'jump off', 'hang myself',
    'worthless', 'hopeless', 'no point', 'better off dead', 'planning to hurt',
    'voices telling me', 'hallucinations', 'paranoid', 'everyone against me'
  ];

  async sendMessage(userMessage: string, conversationHistory: Message[]): Promise<BotResponse> {
    try {
      // Analyze message for crisis indicators
      const riskLevel = this.assessRiskLevel(userMessage, conversationHistory);
      
      // If high risk, return immediate crisis response
      if (riskLevel === 'HIGH') {
        return this.getCrisisResponse(userMessage);
      }

      // Build conversation context
      const context = this.buildConversationContext(conversationHistory);
      
      // Try each fallback model until one succeeds
      for (const model of this.fallbackModels) {
        try {
          const response = await this.callModel(model, userMessage, context);
          if (response) {
            return {
              message: response,
              riskLevel,
              recommendations: this.generateRecommendations(userMessage, riskLevel),
              requiresProfessionalHelp: riskLevel !== 'LOW'
            };
          }
        } catch (error) {
          console.warn(`Model ${model.provider}/${model.model} failed:`, error);
          continue;
        }
      }

      // Final fallback response
      return this.getFallbackResponse();
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return this.getFallbackResponse();
    }
  }

  private assessRiskLevel(message: string, history: Message[]): 'LOW' | 'MODERATE' | 'HIGH' {
    const lowerMessage = message.toLowerCase();
    
    // Check for immediate crisis indicators
    const hasCrisisKeywords = this.crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (hasCrisisKeywords) {
      return 'HIGH';
    }

    // Check for moderate risk indicators
    const moderateRiskKeywords = [
      'depressed', 'anxious', 'panic', 'overwhelmed', 'stressed',
      'can\'t cope', 'breaking down', 'falling apart', 'lost hope',
      'nothing matters', 'tired of living', 'give up'
    ];

    const hasModerateRisk = moderateRiskKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (hasModerateRisk) {
      return 'MODERATE';
    }

    return 'LOW';
  }

  private getCrisisResponse(message: string): BotResponse {
    return {
      message: `I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out for immediate help:

🚨 **IMMEDIATE HELP:**
• Call 988 (Suicide Prevention Lifeline) - Available 24/7
• Text HOME to 741741 (Crisis Text Line)
• Call 911 if you're in immediate danger

**International:**
• UK: 116 123 (Samaritans)
• Canada: 1-833-456-4566
• Australia: 13 11 14 (Lifeline)

You are not alone, and there are people who want to help you through this. Would you like me to stay with you while you reach out for help?

Remember: You've taken a brave step by sharing this. Help is available, and you are not alone.`,
      riskLevel: 'HIGH',
      recommendations: [
        'Contact emergency services immediately',
        'Call 988 or local crisis hotline',
        'Reach out to trusted friend or family member',
        'Go to nearest emergency room if in immediate danger'
      ],
      requiresProfessionalHelp: true
    };
  }

  private buildConversationContext(history: Message[]): string {
    const recentMessages = history.slice(-6); // Last 6 messages for context
    return recentMessages.map(msg => 
      `${msg.sender}: ${msg.content}`
    ).join('\n');
  }

  private async callModel(model: any, userMessage: string, context: string): Promise<string | null> {
    switch (model.provider) {
      case 'groq':
        return this.callGroq(model.model, userMessage, context);
      case 'openai':
        return this.callOpenAI(model.model, userMessage, context);
      case 'anthropic':
        return this.callAnthropic(model.model, userMessage, context);
      case 'local':
        return this.getLocalFallback(userMessage);
      default:
        return null;
    }
  }

  private async callGroq(model: string, userMessage: string, context: string): Promise<string | null> {
    try {
      const result = await groqFallbackService.generateCompletion(
        `Context: ${context}\n\nUser: ${userMessage}`,
        this.systemPrompt,
        {
          maxTokens: 1000,
          temperature: 0.7
        }
      );
      
      console.log(`✅ Mental Health Bot response using model: ${result.modelUsed} in ${result.totalDuration}ms`);
      return result.response;
    } catch (error) {
      console.error('Groq fallback service error:', error);
      return null;
    }
  }

  private async callOpenAI(model: string, userMessage: string, context: string): Promise<string | null> {
    // Placeholder for OpenAI implementation
    // Would require OpenAI API key and proper implementation
    return null;
  }

  private async callAnthropic(model: string, userMessage: string, context: string): Promise<string | null> {
    // Placeholder for Anthropic implementation
    // Would require Anthropic API key and proper implementation
    return null;
  }

  private getLocalFallback(userMessage: string): string {
    const responses = [
      "I hear you, and I want you to know that your feelings are valid. It takes courage to reach out and share what you're going through.",
      "Thank you for trusting me with your thoughts. While I'm having some technical difficulties right now, I want you to know that support is available.",
      "I'm here to listen and support you. If you're in crisis, please don't hesitate to call 988 for immediate help.",
      "Your mental health matters, and seeking support shows strength. Let's work together to find healthy ways to cope with what you're experiencing."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           "\n\nIf you need immediate help, please call 988 or text HOME to 741741. You are not alone.";
  }

  private generateRecommendations(message: string, riskLevel: string): string[] {
    const baseRecommendations = [
      "Practice deep breathing exercises",
      "Maintain a regular sleep schedule",
      "Stay connected with supportive friends or family",
      "Consider journaling your thoughts and feelings"
    ];

    if (riskLevel === 'MODERATE') {
      return [
        ...baseRecommendations,
        "Consider speaking with a mental health professional",
        "Explore local support groups",
        "Limit exposure to stressful media or situations"
      ];
    }

    if (riskLevel === 'HIGH') {
      return [
        "Seek immediate professional help",
        "Contact crisis support services",
        "Reach out to trusted individuals in your support network",
        "Consider emergency mental health services"
      ];
    }

    return baseRecommendations;
  }

  private getFallbackResponse(): BotResponse {
    return {
      message: "I'm experiencing some technical difficulties right now, but I want you to know that I'm here for you. Your mental health and wellbeing are important.\n\nIf you're in crisis or need immediate support:\n• Call 988 (Suicide Prevention Lifeline)\n• Text HOME to 741741 (Crisis Text Line)\n• Call 911 if you're in immediate danger\n\nYou are not alone, and help is available. Please don't hesitate to reach out to professional support services.",
      riskLevel: 'MODERATE',
      recommendations: [
        "Contact professional mental health services",
        "Reach out to trusted friends or family",
        "Call crisis support if needed"
      ],
      requiresProfessionalHelp: true
    };
  }

  async generateReport(userInfo: UserInfo, assessmentData: AssessmentData, conversationSummary: string): Promise<string> {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    return `
# Mental Health Assessment Report

**Session Date:** ${currentDate}
**Session Time:** ${currentTime}

## User Information
- **Name:** ${userInfo.name || 'Not provided'}
- **Age:** ${userInfo.age || 'Not provided'}
- **Gender:** ${userInfo.gender || 'Not provided'}
- **Location:** ${userInfo.location || 'Not provided'}

## Session Summary
${conversationSummary}

## Assessment Results
- **Mood Rating:** ${assessmentData.moodRating}/10
- **Energy Level:** ${assessmentData.energyLevel}/10
- **Sleep Quality:** ${assessmentData.sleepQuality}/10
- **Social Support:** ${assessmentData.socialSupport}/10
- **Stress Level:** ${assessmentData.stressLevel}/10

## Key Concerns
- **Reason for Visit:** ${assessmentData.reasonForVisit}
- **Safety Risk:** ${assessmentData.safetyRisk ? 'Yes' : 'No'}
- **Self-Harm Thoughts:** ${assessmentData.selfHarmThoughts ? 'Yes' : 'No'}
- **Suicidal Ideation:** ${assessmentData.suicidalIdeation ? 'Yes' : 'No'}

## Risk Assessment
**Risk Level:** ${this.calculateOverallRisk(assessmentData)}

## Recommendations
### Immediate (24-48 hours)
- Follow up with mental health professional
- Implement daily self-care routine
- Maintain social connections

### Self-Care Strategies
- Practice mindfulness and breathing exercises
- Maintain regular sleep schedule
- Engage in physical activity
- Limit stressful media consumption

## Professional Follow-up
**Urgency:** ${this.determineProfessionalUrgency(assessmentData)}

---
*This report is confidential and should be shared only with appropriate mental health professionals with user consent.*
`;
  }

  private calculateOverallRisk(assessment: AssessmentData): 'LOW' | 'MODERATE' | 'HIGH' {
    if (assessment.suicidalIdeation || assessment.selfHarmThoughts || assessment.safetyRisk) {
      return 'HIGH';
    }
    
    const lowMoodIndicators = [
      assessment.moodRating <= 3,
      assessment.energyLevel <= 3,
      assessment.sleepQuality <= 3,
      assessment.stressLevel >= 8,
      assessment.socialSupport <= 3
    ].filter(Boolean).length;
    
    if (lowMoodIndicators >= 3) {
      return 'MODERATE';
    }
    
    return 'LOW';
  }

  private determineProfessionalUrgency(assessment: AssessmentData): 'URGENT' | 'RECOMMENDED' | 'OPTIONAL' {
    if (assessment.suicidalIdeation || assessment.selfHarmThoughts || assessment.safetyRisk) {
      return 'URGENT';
    }
    
    if (assessment.moodRating <= 4 || assessment.stressLevel >= 7) {
      return 'RECOMMENDED';
    }
    
    return 'OPTIONAL';
  }
}

export const mentalHealthBotService = new MentalHealthBotService();
export default mentalHealthBotService;