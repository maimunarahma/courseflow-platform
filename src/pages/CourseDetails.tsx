import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Clock, Users, Star, BookOpen, PlayCircle, CheckCircle, 
  Award, Globe, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, mockEnrollments } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const course = mockCourses.find((c) => c.id === id);
  const isEnrolled = user && mockEnrollments.some((e) => e.courseId === id && e.userId === user.id);

  if (!course) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl mb-4">Course not found</h1>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (isEnrolled) {
      navigate(`/learn/${id}`);
      return;
    }

    // Mock enrollment
    toast({
      title: 'Enrollment Successful!',
      description: `You've been enrolled in ${course.title}`,
    });
    navigate(`/learn/${id}`);
  };

  const totalLessons = course.syllabus.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const discountPercent = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-foreground text-background py-12 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline" className="border-background/30 text-background">
                  {course.level}
                </Badge>
              </div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="text-lg text-background/80 max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-background/60">({course.reviewsCount.toLocaleString()} reviews)</span>
                </div>
                <span className="flex items-center gap-1 text-background/60">
                  <Users className="h-4 w-4" />
                  {course.enrolledCount.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1 text-background/60">
                  <Globe className="h-4 w-4" />
                  English
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructorAvatar} />
                  <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-background/80">{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Sticky Card */}
            <div className="lg:row-span-2">
              <div className="sticky top-24 bg-card text-card-foreground rounded-2xl shadow-elevated overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl font-bold">${course.price}</span>
                    {course.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.originalPrice}
                        </span>
                        <Badge className="bg-destructive text-destructive-foreground">
                          {discountPercent}% OFF
                        </Badge>
                      </>
                    )}
                  </div>

                  <Button 
                    onClick={handleEnroll} 
                    className="w-full gradient-primary hover:opacity-90 transition-opacity" 
                    size="lg"
                  >
                    {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration} of content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="lg:max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl mb-6">Course Content</h2>
            <p className="text-muted-foreground mb-8">
              {course.syllabus.length} modules • {totalLessons} lessons • {course.duration} total length
            </p>

            <Accordion type="multiple" defaultValue={['mod-1']} className="space-y-4">
              {course.syllabus.map((module, moduleIndex) => (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className="border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {moduleIndex + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{module.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons
                          {module.quizId && ' • Quiz'}
                          {module.assignmentId && ' • Assignment'}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 ml-12">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.isPreview ? (
                              <PlayCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={lesson.isPreview ? 'text-primary' : ''}>
                              {lesson.title}
                            </span>
                            {lesson.isPreview && (
                              <Badge variant="outline" className="text-xs">Preview</Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
                      {module.quizId && (
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30">
                          <Award className="h-4 w-4 text-warning" />
                          <span>Module Quiz</span>
                        </div>
                      )}
                      {module.assignmentId && (
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30">
                          <BookOpen className="h-4 w-4 text-accent" />
                          <span>Assignment</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
}
