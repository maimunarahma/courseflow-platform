import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Course as MockCourse } from '@/types';
import { mockCourses } from '@/data/mockData';

export type Course = MockCourse;

interface CourseContextType {
  courses: Course[];
  isLoading: boolean;
  isError: boolean;
  addCourse: (courseData: Partial<Course>) => Promise<void>;
  getCourseById: (id: string) => Promise<Course | undefined>;
  updateCourse: (id: string, courseData: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  refetchCourses: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Fetch all courses - falls back to mock data if API fails
  const { data: courses = mockCourses, isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/courses`, {
          withCredentials: true,
        });
        return res.data;
      } catch {
        // Fallback to mock data
        return mockCourses;
      }
    },
  });

  // Add new course
  const addMutation = useMutation({
    mutationFn: async (courseData: Partial<Course>) => {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/courses/create`,
        courseData,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast('Course added successfully!');
    },
    onError: (err: any) => {
      toast('Failed to add course', { description: err?.response?.data?.message || err.message });
    },
  });

  // Get single course by id
  const getCourseById = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/courses/${id}`,
        { withCredentials: true }
      );
      return res.data;
    } catch {
      return courses.find((c) => c._id === id);
    }
  };

  // Update course
  const updateMutation = useMutation({
    mutationFn: async ({ id, courseData }: { id: string; courseData: Partial<Course> }) => {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/courses/${id}`,
        courseData,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast('Course updated successfully!');
    },
    onError: (err: any) => {
      toast('Failed to update course', { description: err?.response?.data?.message || err.message });
    },
  });

  // Delete course
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/courses/delete/${id}`,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast('Course deleted successfully!');
    },
    onError: (err: any) => {
      toast('Failed to delete course', { description: err?.response?.data?.message || err.message });
    },
  });

  const addCourse = async (courseData: Partial<Course>) => addMutation.mutateAsync(courseData);
  const updateCourse = async (id: string, courseData: Partial<Course>) =>
    updateMutation.mutateAsync({ id, courseData });
  const deleteCourse = async (id: string) => deleteMutation.mutateAsync(id);

  return (
    <CourseContext.Provider
      value={{
        courses,
        isLoading,
        isError,
        addCourse,
        getCourseById,
        updateCourse,
        deleteCourse,
        refetchCourses: refetch,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// Hook
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourses must be used within CourseProvider');
  return context;
};
