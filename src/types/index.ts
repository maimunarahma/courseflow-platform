export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  curriculum: Module[];
  category: string;
  tags: string[];
  duration: string;
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  syllabus: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quizId?: string;
  assignmentId?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isPreview?: boolean;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
  batchId?: string;
}

export interface Batch {
  id: string;
  courseId: string;
  name: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  enrolledCount: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Assignment {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;
  content: string;
  grade?: number;
  feedback?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
  answers: number[];
}
