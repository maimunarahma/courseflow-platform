import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

// Enrollment interface
export interface Enrollment {
  _id: string;
  courseId: string;
  userId: string;
  enrolledAt: string;
}

interface EnrollmentContextType {
  enrollments: Enrollment[];
  isLoading: boolean;
  isError: boolean;
  checkIfEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => Promise<{ success: boolean; data?: any; message?: string }>; // UPDATED return type
  unenrollCourse: (courseId: string) => Promise<void>;
  refetchEnrollments: () => void;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Fetch all enrollments for the logged-in user

  const { data: enrollments = [], isLoading, isError, refetch } = useQuery<Enrollment[]>({
    queryKey: ['enrollments'],
    queryFn: async () => {

      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/enroll`, {
        withCredentials: true,
      });

      // FIX 2: Extract the 'courses' array from the response body to match the Enrollment[] type
      // If the backend returns a raw array, just return res.data
      return res.data.courses || res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  // Enroll in a course
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      // BACKEND CHECK: Ensure your server route is POST /api/v1/enroll
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/enroll/${courseId}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Update the cache immediately after successful mutation
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast('Enrollment successful! Proceed to payment/learning.');
      // We do NOT toast success here if the CourseDetails component handles the redirect/payment flow
      return data;
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || err.message;
      toast('Failed to enroll', { description: message });
      // Throw an error or return a specific failure object here if you need to catch it in the component
      throw new Error(message);
    },
  });

  // Unenroll mutation remains the same...
  const unenrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      // ... (unenroll logic)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast('Unenrolled successfully!');
    },
    onError: (err: any) => {
      toast('Failed to unenroll', { description: err?.response?.data?.message || err.message });
    },
  });

  // Helper function to check enrollment status locally
  const checkIfEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.courseId === courseId);
  };

  // MODIFIED: Wrapped mutation logic to return success status for CourseDetails component
  const enrollCourse = async (courseId: string) => {
    try {
      const data = await enrollMutation.mutateAsync(courseId);
      return { success: true, data };
    } catch (error: any) {
      // Catch the error thrown by the onError function above
      return { success: false, message: error.message };
    }
  };
  const unenrollCourse = async (courseId: string) => unenrollMutation.mutateAsync(courseId);

  return (
    <EnrollmentContext.Provider
      value={{
        enrollments,
        isLoading,
        isError,
        enrollCourse,
        unenrollCourse,
        refetchEnrollments: refetch,
        checkIfEnrolled, // ADDED: Provide the checker function
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollments = () => {
  const context = useContext(EnrollmentContext);
  if (!context) throw new Error('useEnrollments must be used within EnrollmentProvider');
  return context;
};