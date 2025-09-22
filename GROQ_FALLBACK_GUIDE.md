# Groq API Fallback Mechanism

## Overview

This implementation provides a robust fallback mechanism for the Groq API that ensures seamless operation even when individual models fail. The system automatically switches between models based on priority and handles errors gracefully.

## Features

✅ **Ordered Priority List**: Models are tried in order of preference  
✅ **Automatic Model Switching**: Seamless transition when a model fails  
✅ **Comprehensive Error Handling**: Detailed logging and error recovery  
✅ **Health Monitoring**: API health checks and status monitoring  
✅ **Configurable Timeouts**: Prevents hanging requests  
✅ **Retry Logic**: Exponential backoff for temporary failures  

## Supported Models

The fallback service supports the following Groq models in priority order:

1. **llama-3.1-8b-instant** (Primary) - Fast, efficient model for most tasks
2. **llama-3.3-70b-versatile** - More capable model for complex tasks
3. **meta-llama/llama-guard-4-12b** - Safety-focused model
4. **openai/gpt-oss-120b** - Large open-source model
5. **openai/gpt-oss-20b** - Medium open-source model
6. **whisper-large-v3** (Inactive by default) - Audio processing model
7. **groq/compound** - Groq's compound model
8. **meta-llama/llama-4-maverick-17b-128e-instruct** - Extended context model
9. **meta-llama/llama-4-scout-17b-16e-instruct** - Scout variant
10. **qwen/qwen3-32b** - Qwen model family

## Implementation Details

### Core Service: `groqFallbackService.ts`

```typescript
import { groqFallbackService } from './src/services/groqFallbackService';

// Basic completion
const result = await groqFallbackService.generateCompletion(
  "Your prompt here",
  "System prompt (optional)",
  {
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    timeout: 30000
  }
);

console.log(`Response: ${result.response}`);
console.log(`Model used: ${result.modelUsed}`);
console.log(`Duration: ${result.totalDuration}ms`);
```

### Updated Services

#### AI Mentor Service
- **File**: `src/services/aiMentorService.ts`
- **Changes**: Replaced direct Groq API calls with fallback service
- **Benefits**: Automatic model switching for journal analysis

#### Mental Health Bot Service
- **File**: `src/services/mentalHealthBotService.ts`
- **Changes**: Updated Groq provider to use fallback service
- **Benefits**: Reliable mental health support with fallback models

## Configuration

### Model Management

```typescript
// Check model status
const status = groqFallbackService.getModelStatus();

// Enable/disable a model
groqFallbackService.setModelActive('model-id', true);

// Update model priority
groqFallbackService.updateModelPriority('model-id', 1);

// Check API health
const isHealthy = await groqFallbackService.checkApiHealth();
```

### Request Options

```typescript
interface GroqRequestOptions {
  temperature?: number;    // 0.0 - 2.0 (default: 0.7)
  maxTokens?: number;      // Max tokens to generate (default: 2048)
  topP?: number;          // 0.0 - 1.0 (default: 1.0)
  stream?: boolean;       // Streaming response (default: false)
  timeout?: number;       // Request timeout in ms (default: 30000)
}
```

## Error Handling

The fallback mechanism handles several types of errors:

1. **Network Errors**: Automatic retry with exponential backoff
2. **Model Unavailable**: Switch to next priority model
3. **Rate Limiting**: Retry with delay
4. **Timeout**: Abort and try next model
5. **Empty Response**: Treat as error and fallback

### Error Flow

```
Request → Primary Model → Fail → Next Model → Fail → Retry → Success
                ↓                    ↓           ↓
            Log Error           Log Error   Final Error
```

## Monitoring and Logging

### Console Logs

The service provides detailed logging:

```
🚀 GroqFallbackService initialized
📋 Available models: 9
🔄 [llama-3.1-8b-instant-1] Attempting with model: Llama 3.1 8B Instant
✅ [llama-3.1-8b-instant-1] Success in 1250ms
```

### Health Status

```typescript
const healthStatus = groqFallbackService.getApiHealthStatus();
// Returns:
// {
//   isHealthy: boolean,
//   lastCheck: Date,
//   activeModels: number,
//   totalModels: number
// }
```

## Testing

### Browser Console Testing

1. Open browser console (F12)
2. Ensure the app is running (`npm run dev`)
3. Copy and paste the test script from `test-groq-fallback.js`
4. Run: `runAllTests()`

### Test Functions

```javascript
// Test AI Mentor with fallback
await testGroqFallback();

// Test Mental Health Bot with fallback
await testMentalHealthBot();

// Run all tests
await runAllTests();
```

## Performance Metrics

The fallback service tracks:

- **Response Time**: Total time including fallbacks
- **Model Used**: Which model successfully responded
- **Attempt Count**: Number of attempts made
- **Error History**: All errors encountered during the request

## Best Practices

### 1. Model Selection
- Keep high-performance models at the top of the priority list
- Disable models that are not suitable for your use case
- Regularly review model performance and adjust priorities

### 2. Error Handling
- Always handle the possibility of complete failure
- Implement local fallbacks for critical functionality
- Log errors for monitoring and debugging

### 3. Performance Optimization
- Set appropriate timeouts for your use case
- Use lower token limits when possible
- Monitor response times and adjust model priorities

### 4. Health Monitoring
- Regularly check API health status
- Implement alerts for prolonged API failures
- Have backup plans for extended outages

## Environment Variables

Ensure the following environment variable is set:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

## Troubleshooting

### Common Issues

1. **All Models Failing**
   - Check API key validity
   - Verify network connectivity
   - Check Groq service status

2. **Slow Response Times**
   - Review model priorities
   - Adjust timeout settings
   - Check for rate limiting

3. **Empty Responses**
   - Verify prompt format
   - Check model compatibility
   - Review token limits

### Debug Mode

Enable detailed logging by checking browser console for:
- Model attempt logs
- Error messages
- Performance metrics
- Health check results

## Migration Guide

### From Old Implementation

If migrating from the old implementation:

1. Replace direct Groq imports with fallback service
2. Update method calls to use new interface
3. Handle the new response format with metadata
4. Test thoroughly with your specific use cases

### Example Migration

**Before:**
```typescript
const response = await groq.chat.completions.create({...});
const text = response.choices[0]?.message?.content;
```

**After:**
```typescript
const result = await groqFallbackService.generateCompletion(prompt, systemPrompt);
const text = result.response;
console.log(`Used model: ${result.modelUsed}`);
```

## Support

For issues or questions:
1. Check the browser console for error logs
2. Review the health status of the API
3. Test with the provided test functions
4. Check the Groq API documentation for model-specific issues

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Compatibility**: Groq API v1