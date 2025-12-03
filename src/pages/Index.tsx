import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users, BookOpen, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { CourseCard } from '@/components/courses/CourseCard';
import { mockCourses } from '@/data/mockData';

const stats = [
  { icon: Users, value: '50K+', label: 'Active Students' },
  { icon: BookOpen, value: '500+', label: 'Expert Courses' },
  { icon: Award, value: '95%', label: 'Completion Rate' },
  { icon: TrendingUp, value: '4.8', label: 'Average Rating' },
];

const features = [
  'Learn from industry experts',
  'Hands-on projects & assignments',
  'Certificate of completion',
  'Lifetime access to content',
  '24/7 community support',
  'Money-back guarantee',
];

export default function Index() {
  const featuredCourses = mockCourses.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(250_84%_54%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(172_66%_50%/0.1),transparent_50%)]" />
        
        <div className="container relative py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                New courses added weekly
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                Unlock Your Potential with{' '}
                <span className="text-gradient">Expert-Led</span> Courses
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg">
                Join thousands of learners mastering in-demand skills. From web development to data science, 
                learn at your own pace with industry professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gradient-primary hover:opacity-90 transition-opacity">
                  <Link to="/courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/courses/course-1">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {features.slice(0, 3).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                  alt="Students learning"
                  className="rounded-2xl shadow-elevated"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-elevated border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-2xl">12,543</p>
                    <p className="text-xs text-muted-foreground">Students enrolled this month</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-elevated border border-border">
                <div className="flex items-center gap-2">
                  <Award className="h-8 w-8 text-warning" />
                  <div>
                    <p className="font-semibold">Top Rated</p>
                    <p className="text-xs text-muted-foreground">Platform of 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="font-display text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-2">Featured Courses</h2>
              <p className="text-muted-foreground">Hand-picked courses to accelerate your career</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, index) => (
              <div key={course.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4">Why Choose CourseMaster?</h2>
            <p className="text-muted-foreground">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CheckCircle className="h-8 w-8 text-success mb-4" />
                <p className="font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
                Join over 50,000 students already learning on CourseMaster. 
                Start your journey today with our free trial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
