import Groq from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is not configured');
}

const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export interface GroqModelConfig {
  id: string;
  name: string;
  maxTokens: number;
  isActive: boolean;
  priority: number;
}

export interface GroqRequestOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  timeout?: number;
}

export interface GroqFallbackResult {
  response: string;
  modelUsed: string;
  attemptCount: number;
  totalDuration: number;
  errors: string[];
}

export class GroqFallbackService {
  private maxRetries = 3;
  private baseRetryDelay = 1000; // 1 second
  private requestTimeout = 30000; // 30 seconds
  private apiHealthy = true;
  private lastApiCheck = 0;
  private healthCheckInterval = 5 * 60 * 1000; // 5 minutes
  
  // Updated fallback models in order of preference based on the provided list
  private fallbackModels: GroqModelConfig[] = [
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B Instant',
      maxTokens: 8192,
      isActive: true,
      priority: 1
    },
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B Versatile',
      maxTokens: 32768,
      isActive: true,
      priority: 2
    },
    {
      id: 'meta-llama/llama-guard-4-12b',
      name: 'Llama Guard 4 12B',
      maxTokens: 8192,
      isActive: true,
      priority: 3
    },
    {
      id: 'openai/gpt-oss-120b',
      name: 'GPT OSS 120B',
      maxTokens: 4096,
      isActive: true,
      priority: 4
    },
    {
      id: 'openai/gpt-oss-20b',
      name: 'GPT OSS 20B',
      maxTokens: 4096,
      isActive: true,
      priority: 5
    },
    {
      id: 'whisper-large-v3',
      name: 'Whisper Large V3',
      maxTokens: 4096,
      isActive: false, // Audio model, not for text generation
      priority: 6
    },
    {
      id: 'groq/compound',
      name: 'Groq Compound',
      maxTokens: 8192,
      isActive: true,
      priority: 7
    },
    {
      id: 'meta-llama/llama-4-maverick-17b-128e-instruct',
      name: 'Llama 4 Maverick 17B',
      maxTokens: 131072,
      isActive: true,
      priority: 8
    },
    {
      id: 'meta-llama/llama-4-scout-17b-16e-instruct',
      name: 'Llama 4 Scout 17B',
      maxTokens: 16384,
      isActive: true,
      priority: 9
    },
    {
      id: 'qwen/qwen3-32b',
      name: 'Qwen 3 32B',
      maxTokens: 32768,
      isActive: true,
      priority: 10
    }
  ];

  constructor() {
    this.logServiceInitialization();
  }

  private logServiceInitialization(): void {
    console.log('🚀 GroqFallbackService initialized');
    console.log(`📋 Available models: ${this.getActiveModels().length}`);
    console.log(`🔧 Configuration: maxRetries=${this.maxRetries}, timeout=${this.requestTimeout}ms`);
  }

  private getActiveModels(): GroqModelConfig[] {
    return this.fallbackModels
      .filter(model => model.isActive)
      .sort((a, b) => a.priority - b.priority);
  }

  private async callGroqAPI(
    messages: any[],
    options: GroqRequestOptions = {},
    retryCount = 0,
    modelIndex = 0
  ): Promise<GroqFallbackResult> {
    const startTime = Date.now();
    const activeModels = this.getActiveModels();
    const errors: string[] = [];
    
    if (modelIndex >= activeModels.length) {
      throw new Error(`No more models available. Tried ${activeModels.length} models.`);
    }

    const currentModel = activeModels[modelIndex];
    const attemptId = `${currentModel.id}-${retryCount + 1}`;
    
    try {
      console.log(`🔄 [${attemptId}] Attempting with model: ${currentModel.name}`);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log(`⏰ [${attemptId}] Request timeout after ${this.requestTimeout}ms`);
      }, options.timeout || this.requestTimeout);

      const completion = await groq.chat.completions.create({
        messages,
        model: currentModel.id,
        temperature: options.temperature || 0.7,
        max_tokens: Math.min(options.maxTokens || 2048, currentModel.maxTokens),
        top_p: options.topP || 1,
        stream: options.stream || false,
      });

      clearTimeout(timeoutId);
      
      let response: string;
      
      if (options.stream) {
        // Handle streaming response
        let fullResponse = '';
        for await (const chunk of completion as any) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullResponse += content;
        }
        response = fullResponse;
      } else {
        // Handle non-streaming response
        response = (completion as any).choices[0]?.message?.content;
      }
      
      if (!response || response.trim().length === 0) {
        throw new Error("Empty response from Groq API");
      }

      // Mark API as healthy on successful response
      this.apiHealthy = true;
      this.lastApiCheck = Date.now();
      
      const duration = Date.now() - startTime;
      console.log(`✅ [${attemptId}] Success in ${duration}ms`);
      
      return {
        response,
        modelUsed: currentModel.id,
        attemptCount: retryCount + 1,
        totalDuration: duration,
        errors
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const logMessage = `❌ [${attemptId}] Error: ${errorMessage}`;
      console.error(logMessage);
      errors.push(logMessage);
      
      // Try next model if available
      if (modelIndex + 1 < activeModels.length) {
        console.log(`🔄 [${attemptId}] Switching to next fallback model...`);
        return this.callGroqAPI(messages, options, 0, modelIndex + 1);
      }
      
      // Retry with same model if retries available
      if (retryCount < this.maxRetries) {
        const delay = this.baseRetryDelay * Math.pow(2, retryCount);
        console.log(`⏳ [${attemptId}] Retrying in ${delay}ms... (${retryCount + 1}/${this.maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callGroqAPI(messages, options, retryCount + 1, modelIndex);
      }
      
      // Mark API as unhealthy after all attempts failed
      this.apiHealthy = false;
      
      // All models and retries failed
      const totalDuration = Date.now() - startTime;
      throw new Error(
        `All Groq API models failed after ${this.maxRetries + 1} attempts each. ` +
        `Total duration: ${totalDuration}ms. Errors: ${errors.join('; ')}`
      );
    }
  }

  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    options: GroqRequestOptions = {}
  ): Promise<GroqFallbackResult> {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt
      });
    }
    
    messages.push({
      role: "user",
      content: prompt
    });

    return this.callGroqAPI(messages, options);
  }

  async generateChatCompletion(
    messages: any[],
    options: GroqRequestOptions = {}
  ): Promise<GroqFallbackResult> {
    return this.callGroqAPI(messages, options);
  }

  async checkApiHealth(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastApiCheck < this.healthCheckInterval && this.apiHealthy) {
      return this.apiHealthy;
    }

    try {
      console.log('🔍 Performing API health check...');
      await this.generateCompletion("Health check", undefined, { maxTokens: 10 });
      this.apiHealthy = true;
      console.log('✅ API health check passed');
    } catch (error) {
      console.error('❌ API health check failed:', error);
      this.apiHealthy = false;
    }
    
    this.lastApiCheck = now;
    return this.apiHealthy;
  }

  getModelStatus(): { model: GroqModelConfig; status: string }[] {
    return this.fallbackModels.map(model => ({
      model,
      status: model.isActive ? 'Active' : 'Inactive'
    }));
  }

  setModelActive(modelId: string, isActive: boolean): boolean {
    const model = this.fallbackModels.find(m => m.id === modelId);
    if (model) {
      model.isActive = isActive;
      console.log(`🔧 Model ${modelId} set to ${isActive ? 'active' : 'inactive'}`);
      return true;
    }
    console.warn(`⚠️ Model ${modelId} not found`);
    return false;
  }

  updateModelPriority(modelId: string, priority: number): boolean {
    const model = this.fallbackModels.find(m => m.id === modelId);
    if (model) {
      model.priority = priority;
      console.log(`🔧 Model ${modelId} priority updated to ${priority}`);
      return true;
    }
    console.warn(`⚠️ Model ${modelId} not found`);
    return false;
  }

  getApiHealthStatus(): {
    isHealthy: boolean;
    lastCheck: Date;
    activeModels: number;
    totalModels: number;
  } {
    return {
      isHealthy: this.apiHealthy,
      lastCheck: new Date(this.lastApiCheck),
      activeModels: this.getActiveModels().length,
      totalModels: this.fallbackModels.length
    };
  }
}

// Export singleton instance
export const groqFallbackService = new GroqFallbackService();