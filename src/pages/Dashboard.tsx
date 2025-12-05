import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, ArrowRight, Play } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

import { useEnrollments } from '@/hooks/use-enroll';
import { useCourses } from '@/hooks/use-courses';

export default function Dashboard() {
  const { user } = useAuth();
  const {courses} = useCourses();
  const { enrollments } = useEnrollments();
  console.log(enrollments)
 

  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, c: any) => acc + (c?.progress || 0), 0) / enrollments.length)
    : 0;

  const stats = [
    { label: 'Courses Enrolled', value: enrollments.length, icon: BookOpen, color: 'text-primary' },
    { label: 'Hours Learned', value: '24', icon: Clock, color: 'text-accent' },
    { label: 'Certificates', value: '1', icon: Award, color: 'text-warning' },
    { label: 'Average Progress', value: `${totalProgress}%`, icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <>
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">My Courses</h2>
            <Button asChild variant="outline">
              <Link to="/courses">
                Browse More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {enrollments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((item: any) => {
                const courseData = item.course || item;
                const progress = item.progress || 0;
                if (!courseData) return null;

                return (
                  <Card key={courseData._id} className="overflow-hidden group">
                    <div className="relative">
                      <img
                        src={courseData.thumbnail || '/placeholder.svg'}
                        alt={courseData.title || 'Course'}
                        className="w-full h-40 object-cover"
                      />
                      <Link
                        to={`/learn/${courseData._id}`}
                        className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary-foreground ml-1" />
                        </div>
                      </Link>
                    </div> 
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-2 line-clamp-2">{courseData.title}</h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={courseData.instructorAvatar || ''} />
                          <AvatarFallback className="text-xs">
                            {courseData.instructor?.charAt(0) || 'I'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{courseData.instructor}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <Button asChild className="w-full mt-4" variant="secondary">
                        <Link to={`/learn/${courseData._id}`}>
                          Continue Learning
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
                <Button asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommended Courses */}
        <div>
          <h2 className="font-display text-2xl mb-6">Recommended for You</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((c) => !enrollments.some((e) => e._id === c._id))
              .slice(0, 3)
              .map((course) => (
                <Card key={course._id} className="overflow-hidden hover:shadow-card transition-shadow">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-lg">${course.price}</span>
                      <Button asChild size="sm">
                        <Link to={`/courses/${course._id}`}>View Course</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
