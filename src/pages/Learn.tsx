import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle, PlayCircle,
  FileText, Award, Menu, X, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useEnrollments } from '@/hooks/use-enroll';

// Placeholder for saving progress (Replace with your actual useMutation hook)
const useSaveProgressMutation = () => {
  // In a real application, this would be a useMutation call using axios.post/patch
  const saveProgress = async (courseId: string, completedLessons: string[]) => {
    console.log(`[Mock Save] Saving progress for Course ${courseId}. Lessons:`, completedLessons.length);
    // await axios.patch(`${import.meta.env.VITE_SERVER_URL}/enroll/${courseId}/progress`, { ... });
    return { success: true, newProgress: completedLessons.length };
  };
  return { mutate: saveProgress };
}


export default function Learn() {
  const { id: courseId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { enrollments, refetchEnrollments } = useEnrollments();
  const { mutate: saveProgress } = useSaveProgressMutation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);


  // 1. CRITICAL FIX: Find the specific course/enrollment object by its ID
  const course = useMemo(() => {
    if (!enrollments) return null;
    // CORRECT: Search the enrollments array for the element whose _id matches the URL courseId
    return enrollments.find((e: any) => e._id === courseId);
  }, [enrollments, courseId]); // Added courseId to dependency array

  // 2. CRITICAL FIX: Flatten lessons ONLY for the currently selected course
  const allLessons = useMemo(() => {
    // Ensure course and syllabus exist before flatMap
    return course?.curriculum?.flatMap((mod: any) => mod.lessons) || [];
  }, [course]);


  // 3. State Initialization and Synchronization
  useEffect(() => {
    if (course && courseId) {
      // CRITICAL FIX: Initialize state from the course object's lessonCompleted field
      const initialCompleted = course.lessonCompleted || [];
      setCompletedLessons(initialCompleted);

      // Set first uncompleted lesson as current, or the very first lesson
      if (allLessons.length > 0) {
        const firstUncompleted = allLessons.find((l: any) => !initialCompleted.includes(l.id));
        const lessonToSet = firstUncompleted || allLessons[0];

        // Only set if a lesson hasn't been manually selected yet
        if (!currentLessonId) {
          setCurrentLessonId(lessonToSet.id);
        }
      }
    }
  }, [course, allLessons, currentLessonId, courseId]);


  // Handle initial loading and error states
  // Note: If enrollments is an empty array (user enrolled in nothing), course will be null.
  if (!enrollments) {
    return <div className="min-h-screen flex items-center justify-center">Loading Course Data...</div>;
  }

  // Handle course not found/not enrolled
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-4">Course not found or not enrolled</h1>
          <p className="text-muted-foreground mb-4">Enroll in this course to start learning.</p>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Navigation Logic
  const currentLesson = allLessons.find((l: any) => l.id === currentLessonId);
  const currentLessonIndex = allLessons.findIndex((l: any) => l.id === currentLessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  // Progress Calculation
  const progress = allLessons.length > 0
    ? Math.round((completedLessons.length / allLessons.length) * 100)
    : 0;

  const handleMarkComplete = async () => {
    if (currentLessonId && !completedLessons.includes(currentLessonId)) {
      const newCompletedLessons = [...completedLessons, currentLessonId];
      setCompletedLessons(newCompletedLessons); // Optimistic UI update

      try {
        // Save the new progress to the backend
        await saveProgress(courseId, newCompletedLessons);
        refetchEnrollments(); // Re-fetch enrollments to synchronize dashboard/other components

        toast({
          title: 'Lesson completed! 🎉',
          description: 'Your progress has been saved.',
        });

        // Auto-advance to next lesson
        if (nextLesson) {
          setTimeout(() => setCurrentLessonId(nextLesson.id), 500);
        }
      } catch (error) {
        // Handle error: revert UI state, show error toast
        setCompletedLessons(completedLessons);
        toast({
          title: 'Progress save failed ⚠️',
          description: 'Could not update progress on the server.',
          variant: 'destructive'
        });
      }
    }
  };

  // --- Render Logic ---

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <h2 className="font-display font-semibold line-clamp-2">{course.title}</h2>
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Course Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {course.curriculum.map((module: any, moduleIndex: number) => (
                <div key={module.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {moduleIndex + 1}
                    </span>
                    <span className="font-medium text-sm">{module.title}</span>
                  </div>

                  <div className="ml-8 space-y-1">
                    {module.lessons.map((lesson: any) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={cn(
                            'w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors',
                            isCurrent ? 'bg-primary/10 text-primary' : 'hover:bg-secondary',
                            isCompleted && !isCurrent && 'text-muted-foreground'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          ) : isCurrent ? (
                            <PlayCircle className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="line-clamp-1">{lesson.title}</span>
                          <span className="ml-auto text-xs text-muted-foreground">{lesson.duration}</span>
                        </button>
                      );
                    })}

                    {module.quizId && (
                      <Link
                        to={`/quiz/${course._id}/${module.quizId}`}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm hover:bg-secondary transition-colors"
                      >
                        <Award className="h-4 w-4 text-warning flex-shrink-0" />
                        <span>Quiz</span>
                      </Link>
                    )}

                    {module.assignmentId && (
                      <Link
                        to={`/assignment/${module.assignmentId}`}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm hover:bg-secondary transition-colors"
                      >
                        <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Assignment</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!prevLesson}
              onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!nextLesson}
              onClick={() => nextLesson && setCurrentLessonId(nextLesson.id)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </header>

        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          {currentLesson ? (
            <>
              <div className="aspect-video bg-foreground">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/X8BYu3dMKf0" title="YouTube video player"
                  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
              </div>

              <div className="p-6 border-t border-border">
                <div className="max-w-3xl">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="font-display text-2xl mb-2">{currentLesson.title}</h1>
                      <p className="text-muted-foreground">Duration: {currentLesson.duration}</p>
                    </div>

                    <Button
                      onClick={handleMarkComplete}
                      disabled={completedLessons.includes(currentLesson.id)}
                      className={cn(
                        completedLessons.includes(currentLesson.id)
                          ? 'bg-success hover:bg-success'
                          : 'gradient-primary hover:opacity-90'
                      )}
                    >
                      {completedLessons.includes(currentLesson.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        'Mark as Complete'
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    {nextLesson && (
                      <Button variant="outline" onClick={() => setCurrentLessonId(nextLesson.id)}>
                        Next: {nextLesson.title}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}