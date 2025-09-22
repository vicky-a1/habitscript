// Mental Health API Service with fallback models

export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  pronouns: string;
  location: string;
  language: string;
  emergencyContact?: string;
}

export interface AssessmentResult {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  concerns: string[];
  recommendations: string[];
  requiresUrgentCare: boolean;
}

class MentalHealthAPI {
  private primaryAPIKey = import.meta.env.VITE_GROQ_API_KEY;
  
  private fallbackModels = [
    { name: 'groq', endpoint: 'https://api.groq.com/openai/v1/chat/completions' },
    { name: 'gpt-4.1', endpoint: 'https://api.openai.com/v1/chat/completions' },
    { name: 'gpt-4.1-mini', endpoint: 'https://api.openai.com/v1/chat/completions' },
    { name: 'claude-3.5-sonnet', endpoint: 'https://api.anthropic.com/v1/messages' },
    { name: 'claude-3.5-haiku', endpoint: 'https://api.anthropic.com/v1/messages' },
    { name: 'llama-3.1-70b-chat', endpoint: 'https://api.together.xyz/v1/chat/completions' },
    { name: 'llama-3.1-8b-chat', endpoint: 'https://api.together.xyz/v1/chat/completions' },
    { name: 'mistral-large', endpoint: 'https://api.mistral.ai/v1/chat/completions' },
    { name: 'command-r-plus', endpoint: 'https://api.cohere.ai/v1/chat' },
    { name: 'gemini-1.5-pro', endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent' }
  ];

  private systemPrompt = `🧠 Mental Health Companion

Role: You are a compassionate mental-health expert with 30+ years of clinical experience. As an AI companion, provide empathetic, evidence-based support and screening for children, teens, and adults.

❌ Do NOT prescribe, diagnose, or replace professional care.
✅ Your role is to screen, support, escalate, and encourage.

Objectives:
- Provide empathetic validation & coping strategies
- Detect risks: anxiety, depression, hopelessness, self-harm, psychosis, abuse
- Suggest professional help or crisis services when needed
- Use age-appropriate, nonjudgmental, plain language

Crisis Protocol:
- Identify imminent risk: suicidal intent/plan, self-harm, harm to others, psychosis, abuse, severe panic
- Provide immediate safety guidance and crisis hotlines
- Recommend emergency services when appropriate

Support Strategies:
- Breathing & grounding exercises
- Sleep routine guidance
- Healthy activity & daily structure
- Social connection encouragement
- Journaling / self-expression
- Limit distressing media

Always close with encouragement: "You've taken a brave step today. Help is available, and you are not alone."`;

  async sendMessage(message: string, userProfile?: UserProfile, conversationHistory: ChatMessage[] = []): Promise<APIResponse> {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    // Try each fallback model in sequence
    for (let i = 0; i < this.fallbackModels.length; i++) {
      try {
        const response = await this.callModel(this.fallbackModels[i], messages);
        if (response.success) {
          return response;
        }
      } catch (error) {
        console.warn(`Model ${this.fallbackModels[i].name} failed:`, error);
        continue;
      }
    }

    // If all models fail, return fallback response
    return {
      success: true,
      data: {
        message: "I'm here to listen and support you. While I'm experiencing some technical difficulties right now, please know that your feelings are valid and help is available. If you're in crisis, please contact emergency services or a crisis hotline immediately. Would you like me to provide some crisis resources?"
      }
    };
  }

  private async callModel(model: any, messages: any[]): Promise<APIResponse> {
    // Simulate API call - in real implementation, this would make actual HTTP requests
    // For demo purposes, return a mock response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const mockResponses = [
      "Thank you for sharing that with me. I can hear that you're going through a difficult time, and I want you to know that your feelings are completely valid. It takes courage to reach out for support.",
      "I'm here to listen and support you. What you're experiencing sounds challenging, and it's important that you're taking steps to care for your mental health.",
      "Your wellbeing matters, and I'm glad you're here talking with me today. Let's explore some ways we can help you feel more supported and stable.",
      "I appreciate you trusting me with what you're going through. Mental health challenges can feel overwhelming, but there are effective ways to manage and improve how you're feeling."
    ];

    return {
      success: true,
      data: {
        message: mockResponses[Math.floor(Math.random() * mockResponses.length)]
      }
    };
  }

  async assessRisk(userResponses: any): Promise<AssessmentResult> {
    // Crisis keywords for risk assessment
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
      'hurt myself', 'cut myself', 'self harm', 'want to die', 'no point',
      'hopeless', 'worthless', 'burden', 'can\'t go on', 'give up'
    ];

    const responses = Object.values(userResponses).join(' ').toLowerCase();
    const hasCrisisIndicators = crisisKeywords.some(keyword => responses.includes(keyword));
    
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    let concerns: string[] = [];
    let recommendations: string[] = [];
    let requiresUrgentCare = false;

    if (hasCrisisIndicators) {
      riskLevel = 'HIGH';
      requiresUrgentCare = true;
      concerns.push('Crisis indicators detected', 'Immediate safety concerns');
      recommendations.push(
        'Contact emergency services immediately',
        'Reach out to crisis hotline',
        'Ensure immediate safety and supervision'
      );
    } else if (userResponses.moodRating <= 3 || userResponses.energyLevel <= 3) {
      riskLevel = 'MODERATE';
      concerns.push('Low mood indicators', 'Decreased energy levels');
      recommendations.push(
        'Consider professional counseling',
        'Establish daily routine',
        'Connect with support network'
      );
    } else {
      recommendations.push(
        'Continue self-care practices',
        'Maintain social connections',
        'Monitor mood changes'
      );
    }

    return {
      riskLevel,
      concerns,
      recommendations,
      requiresUrgentCare
    };
  }

  async generateReport(userProfile: UserProfile, assessment: any, conversationSummary: string): Promise<APIResponse> {
    const riskAssessment = await this.assessRisk(assessment);
    
    const report = {
      sessionDate: new Date().toISOString(),
      userInfo: {
        name: userProfile.name,
        age: userProfile.age,
        gender: userProfile.gender,
        location: userProfile.location
      },
      sessionSummary: conversationSummary,
      keyConcerns: riskAssessment.concerns,
      riskLevel: riskAssessment.riskLevel,
      recommendations: riskAssessment.recommendations,
      requiresUrgentCare: riskAssessment.requiresUrgentCare,
      followUpGuidance: riskAssessment.requiresUrgentCare ? 'URGENT' : 
                       riskAssessment.riskLevel === 'MODERATE' ? 'RECOMMENDED' : 'OPTIONAL',
      selfCareStrategies: [
        'Practice deep breathing exercises',
        'Maintain regular sleep schedule',
        'Engage in physical activity',
        'Connect with supportive friends/family',
        'Limit alcohol and substance use',
        'Practice mindfulness or meditation'
      ]
    };

    return {
      success: true,
      data: { report }
    };
  }

  getCrisisResources(): any {
    return {
      emergency: {
        us: '911',
        uk: '999',
        international: 'Local Emergency Services'
      },
      crisisHotlines: {
        us: {
          'National Suicide Prevention Lifeline': '988',
          'Crisis Text Line': 'Text HOME to 741741',
          'SAMHSA National Helpline': '1-800-662-4357'
        },
        uk: {
          'Samaritans': '116 123',
          'Crisis Text Line UK': 'Text SHOUT to 85258'
        },
        international: {
          'International Association for Suicide Prevention': 'https://www.iasp.info/resources/Crisis_Centres/'
        }
      },
      onlineResources: [
        'National Alliance on Mental Illness (NAMI)',
        'Mental Health America',
        'Crisis Text Line',
        'BetterHelp',
        'SAMHSA Treatment Locator'
      ]
    };
  }
}

export const mentalHealthAPI = new MentalHealthAPI();
export default mentalHealthAPI;