import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Type, Smile, Send, Heart } from "lucide-react";
import { JournalPrompt } from "./JournalPrompts";

interface ReflectionModalProps {
  prompt: JournalPrompt;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reflection: { text: string; emojis: string[]; method: 'text' | 'emoji' }) => void;
}

const reflectionEmojis = [
  "😊", "😢", "😡", "😍", "🤔", "😴", "🤗", "😎", "🥺", "😤",
  "🙏", "💪", "❤️", "🌟", "🔥", "💡", "🎯", "🌈", "🦋", "🌸",
  "📚", "🎨", "🏆", "🎵", "⚽", "🍎", "🌱", "🕊️", "🌙", "☀️"
];

export default function ReflectionModal({ prompt, isOpen, onClose, onSubmit }: ReflectionModalProps) {
  const [inputMethod, setInputMethod] = useState<'text' | 'emoji'>('text');
  const [reflectionText, setReflectionText] = useState("");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleEmojiToggle = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  };

  const handleSubmit = () => {
    if (inputMethod === 'text' && reflectionText.trim()) {
      onSubmit({
        text: reflectionText.trim(),
        emojis: [],
        method: 'text'
      });
    } else if (inputMethod === 'emoji' && selectedEmojis.length > 0) {
      onSubmit({
        text: `Reflected with emojis: ${selectedEmojis.join(' ')}`,
        emojis: selectedEmojis,
        method: 'emoji'
      });
    }
    
    setIsSubmitted(true);
    setTimeout(() => {
      // Reset form
      setReflectionText("");
      setSelectedEmojis([]);
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const canSubmit = inputMethod === 'text' ? reflectionText.trim().length > 0 : selectedEmojis.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reflect on: {prompt.title}</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

          {/* Story */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-3">{prompt.story}</p>
          </div>

          {/* Values */}
          <div className="flex flex-wrap gap-2">
            {prompt.values.map((value) => (
              <Badge key={value} className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {value}
              </Badge>
            ))}
          </div>

          {/* Input Method Toggle */}
          <div className="flex gap-2">
            <Button
              variant={inputMethod === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMethod('text')}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={inputMethod === 'emoji' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMethod('emoji')}
              className="flex-1"
            >
              <Smile className="w-4 h-4 mr-2" />
              Emoji
            </Button>
          </div>

          {/* Text Input */}
          {inputMethod === 'text' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Share your thoughts:</label>
              <Textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write about your thoughts, feelings, or experiences related to this story..."
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 text-right">
                {reflectionText.length}/500 characters
              </div>
            </div>
          )}

          {/* Emoji Input */}
          {inputMethod === 'emoji' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Express with emojis:</label>
              <div className="grid grid-cols-6 gap-2">
                {reflectionEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiToggle(emoji)}
                    className={`p-2 text-xl rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedEmojis.includes(emoji)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {selectedEmojis.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-700 mb-2">Selected emojis:</p>
                  <div className="text-2xl space-x-1">
                    {selectedEmojis.map((emoji, index) => (
                      <span key={index}>{emoji}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          {prompt.questions && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Reflect on:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                {prompt.questions.map((question, index) => (
                  <li key={index}>• {question}</li>
                ))}
              </ul>
            </div>
          )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 bg-purple-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Reflection
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reflection Submitted!</h3>
              <p className="text-gray-600">Thank you for taking time to reflect on these important values.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}