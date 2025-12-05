import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  course: {
    _id: string;
  
  };
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export const useQuizzes = (courseId?: string) => {
  const queryClient = useQueryClient();

  const { data: quizzes = [], isLoading, isError, refetch } = useQuery<Quiz[]>({
    queryKey: ['quizzes', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/quiz/${courseId}`,
        { withCredentials: true }
      );
      return res.data.data; // <-- this now matches backend
    },
  });

  // Create quiz
  const createQuizMutation = useMutation({
    mutationFn: async (quizData: Partial<Quiz>) => {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/quiz`, quizData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', courseId] });
    },
  });

  // Update quiz
  const updateQuizMutation = useMutation({
    mutationFn: async ({ id, quizData }: { id: string; quizData: Partial<Quiz> }) => {
      const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/quizzes/${id}`, quizData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', courseId] });
    },
  });

  // Delete quiz
  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/quizzes/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', courseId] });
    },
  });

return {
  quizzes,
  isLoading,
  isError,
  refetch,
  createQuizMutation,
  updateQuizMutation,
  deleteQuizMutation
};
};
