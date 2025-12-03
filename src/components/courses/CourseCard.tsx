import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const discountPercent = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discountPercent > 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              {discountPercent}% OFF
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-background/90 backdrop-blur"
          >
            {course.level}
          </Badge>
        </div>

        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs font-normal">
              {course.category}
            </Badge>
          </div>

          <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.instructorAvatar} />
              <AvatarFallback className="text-xs">{course.instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{course.instructor}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.lessonsCount} lessons
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.enrolledCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-semibold">{course.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({course.reviewsCount.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${course.originalPrice}
                </span>
              )}
              <span className="font-display font-bold text-lg text-primary">
                ${course.price}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
