import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

// Chat Message interface
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string | Date;
}

// Request/Response types
interface SendMessageRequest {
  courseId: string;
  message: string;
}

interface SendMessageResponse {
  success: boolean;
  data: {
    message: string;
    response: string;
    timestamp: string;
  };
}

interface ChatContextType {
  chatHistory: ChatMessage[];
  isLoadingHistory: boolean;
  isLoadingMessage: boolean;
  isError: boolean;
  getChatHistory: (courseId: string) => Promise<ChatMessage[]>;
  sendMessage: (courseId: string, message: string) => Promise<SendMessageResponse>;
  clearChatHistory: (courseId: string) => Promise<void>;
  refetchChatHistory: (courseId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Fetch chat history for a specific course
  const useChatHistory = (courseId: string) => {
    return useQuery<ChatMessage[]>({
      queryKey: ['chatHistory', courseId],
      queryFn: async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/chat/history/${courseId}`,
          { withCredentials: true }
        );
        return res.data?.data || res.data || [];
      },
      enabled: !!courseId,
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ courseId, message }: SendMessageRequest) => {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/chat/ask/${courseId}`,
        { message },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate chat history for this course
      queryClient.invalidateQueries({ queryKey: ['chatHistory', variables.courseId] });
    },
    onError: (err) => {
      const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const message = error.response?.data?.message || error.message;
      
      if (error.response?.status === 403) {
        toast('Access Denied', { 
          description: 'You must be enrolled in this course to use the assistant' 
        });
      } else {
        toast('Chat Error', { description: message });
      }
    },
  });

  // Clear chat history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/chat/history/${courseId}`,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory', courseId] });
      toast('Chat history cleared');
    },
    onError: (err) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast('Failed to clear history', { 
        description: error.response?.data?.message || error.message 
      });
    },
  });

  // Helper function to get chat history
  const getChatHistory = async (courseId: string): Promise<ChatMessage[]> => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/chat/history/${courseId}`,
        { withCredentials: true }
      );
      return res.data?.data || res.data || [];
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return [];
    }
  };
  // Helper function to send message
  const sendMessage = async (courseId: string, message: string): Promise<SendMessageResponse> => {
    return await sendMessageMutation.mutateAsync({ courseId, message });
  };

  // Helper function to clear chat history
  const clearChatHistory = async (courseId: string): Promise<void> => {
    await clearHistoryMutation.mutateAsync(courseId);
  };

  // Helper function to refetch chat history
  const refetchChatHistory = (courseId: string) => {
    queryClient.invalidateQueries({ queryKey: ['chatHistory', courseId] });
  };

  const value: ChatContextType = {
    chatHistory: [], // Not used in context, but kept for interface compatibility
    isLoadingHistory: false,
    isLoadingMessage: sendMessageMutation.isPending,
    isError: false,
    getChatHistory,
    sendMessage,
    clearChatHistory,
    refetchChatHistory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

// Hook to fetch chat history for a specific course (can be used independently)
export const useChatHistory = (courseId: string) => {
  return useQuery<ChatMessage[]>({
    queryKey: ['chatHistory', courseId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/chat/history/${courseId}`,
        { withCredentials: true }
      );
      return res.data?.data || res.data || [];
    },
    enabled: !!courseId,
    staleTime: 30 * 1000,
  });
};
