import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Send,
  AlertTriangle,
  Phone,
  MessageCircle,
  Heart,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { mentalHealthBotService } from '@/services/mentalHealthBotService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'crisis' | 'assessment';
}

interface MentalHealthBotProps {
  onClose: () => void;
}

const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'self harm',
  'hurt myself', 'cutting', 'overdose', 'jump off', 'hang myself',
  'worthless', 'hopeless', 'no point', 'better off dead'
];

const crisisResources = {
  immediate: [
    { name: "National Suicide Prevention Lifeline", number: "988", type: "call" },
    { name: "Crisis Text Line", number: "Text HOME to 741741", type: "text" }
  ],
  emergency: "If you're in immediate danger, please call 911 or go to your nearest emergency room."
};

export default function MentalHealthBot({ onClose }: MentalHealthBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const initializedRef = useRef(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!initializedRef.current) {
      setMessages([{
        id: '1',
        content: "Hello! I'm your mental health companion. I'm here to listen, support, and help you navigate your feelings. Everything we discuss is confidential. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectCrisis = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const handleCrisisResponse = () => {
    const crisisMessage: Message = {
      id: Date.now().toString(),
      content: `I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out for immediate help:

🚨 **IMMEDIATE HELP:**
• Call 988 (Suicide Prevention Lifeline) - Available 24/7
• Text HOME to 741741 (Crisis Text Line)
• Call 911 if you're in immediate danger

You are not alone, and there are people who want to help you through this. Would you like me to stay with you while you reach out for help?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'crisis'
    };
    setMessages(prev => [...prev, crisisMessage]);
    setCrisisDetected(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check for crisis indicators
    if (detectCrisis(inputMessage)) {
      handleCrisisResponse();
      setIsLoading(false);
      return;
    }

    try {
      // Call mental health bot service
      const conversationHistory = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp,
        type: msg.type
      }));
      
      const response = await mentalHealthBotService.sendMessage(inputMessage, conversationHistory);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date(),
        type: response.riskLevel === 'HIGH' ? 'crisis' : 'normal'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again, or if this is urgent, please call 988 for immediate support.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startAssessment = () => {
    const assessmentMessage: Message = {
      id: Date.now().toString(),
      content: "I'd like to do a brief check-in with you. This will help me understand how you're feeling and provide better support. On a scale of 1-10, how would you rate your mood today? (1 being very low, 10 being excellent)",
      sender: 'bot',
      timestamp: new Date(),
      type: 'assessment'
    };
    setMessages(prev => [...prev, assessmentMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Mental Health Companion</h3>
            <p className="text-sm text-gray-600">Confidential • Available 24/7</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Online
        </Badge>
      </div>

      {/* Crisis Banner */}
      {crisisDetected && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mb-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-900">Crisis Support Available</h4>
              <p className="text-red-800 text-sm">Remember: Call 988 or text HOME to 741741 for immediate help</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'bot' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'crisis' ? 'bg-red-100' : 'bg-gray-100'}`}>
                {message.type === 'crisis' ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <Bot className="w-4 h-4 text-gray-600" />}
              </div>
            )}
            <div className={`max-w-[85%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-600 text-white' : message.type === 'crisis' ? 'bg-red-50 border border-red-200 text-red-900' : 'bg-gray-100 text-gray-900'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-1 opacity-70 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="max-w-[85%] bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Input */}
      <div className="border-t bg-gray-50">
        <div className="p-4">
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={startAssessment}
              className="text-xs"
            >
              <Heart className="w-3 h-3 mr-1" />
              Mental Health Check
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-600 border-red-200"
            >
              <Phone className="w-3 h-3 mr-1" />
              Crisis Help: 988
            </Button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This conversation is confidential. In crisis? Call 988 immediately.
          </p>
        </div>
      </div>
    </div>
  );
}