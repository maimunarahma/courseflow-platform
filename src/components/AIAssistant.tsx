/**
 * AI Learning Assistant Chat Component
 * Features: Chat history persistence, demo questions, dark theme, greeting
 */

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/hooks/use-chat';

interface AIAssistantProps {
  courseId: string;
  courseTitle?: string;
  className?: string;
}

const DEMO_QUESTIONS = [
  "📚 Explain the key concepts in simple terms",
  "💡 Give me a real-world example",
  "🎯 What are common mistakes to avoid?"
];

export function AIAssistant({ courseId, courseTitle = "this course", className }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp?: string }>>([
    {
      role: 'assistant',
      content: `Hello! 👋 I'm your AI learning assistant for **${courseTitle}**.\n\nI'm here to help you master this course. Feel free to ask me anything!`
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sendMessage, isLoadingMessage } = useChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoadingMessage) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Use chat hook to send message
      const response = await sendMessage(courseId, userMessage);

      // Extract response from backend format
      const aiResponse = response.data?.response || 'No response received';
      
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        timestamp: response.data?.timestamp || new Date().toISOString()
      }]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      
      // Remove the user message if request failed
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const handleDemoQuestion = (question: string) => {
    // Remove emoji and send
    const cleanQuestion = question.replace(/^[^\s]+\s/, '');
    setInput(cleanQuestion);
    setTimeout(() => handleSend(cleanQuestion), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-110 z-50',
          className
        )}
        size="icon"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col z-50 backdrop-blur-xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white">AI Learning Assistant</h3>
            <p className="text-xs text-slate-400">Always here to help ✨</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-2 animate-in fade-in slide-in-from-bottom-2',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-md',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-800 text-slate-100 border border-slate-700/50'
                )}
              >
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {isLoadingMessage && (
            <div className="flex gap-2 justify-start animate-in fade-in">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-slate-800 border border-slate-700/50">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Demo Questions - Show when no messages */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 space-y-2">
          <p className="text-xs text-slate-400 mb-2">Quick start questions:</p>
          {DEMO_QUESTIONS.map((question, index) => (
            <button
              key={index}
              onClick={() => handleDemoQuestion(question)}
              disabled={isLoadingMessage}
              className="w-full text-left px-3 py-2 text-xs rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/30 hover:border-indigo-500/50 transition-all disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            disabled={isLoadingMessage}
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoadingMessage}
            size="icon"
            className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg"
          >
            {isLoadingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          💡 Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
