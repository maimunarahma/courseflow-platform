import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, FileText, Upload, CheckCircle, Clock, 
  ExternalLink, AlertCircle, Send 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAssignments, mockCourses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Assignment() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<'link' | 'text'>('link');

  const assignment = mockAssignments.find((a) => a.id === id);
  
  const course = mockCourses.find((c) => 
    c.syllabus.some((mod) => mod.assignmentId === id)
  );

  const existingSubmission = assignment?.submissions.find((s) => s.userId === user?.id);

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl mb-2">Assignment not found</h1>
            <p className="text-muted-foreground mb-6">
              This assignment doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasLinkSubmission = submissionType === 'link' && submissionLink.trim();
    const hasTextSubmission = submissionType === 'text' && submissionText.trim();
    
    if (!hasLinkSubmission && !hasTextSubmission) {
      toast({
        title: 'Submission required',
        description: submissionType === 'link' 
          ? 'Please provide a valid Google Drive or GitHub link.'
          : 'Please enter your text submission.',
        variant: 'destructive',
      });
      return;
    }

    // Validate URL format for link submissions
    if (submissionType === 'link') {
      try {
        new URL(submissionLink);
      } catch {
        toast({
          title: 'Invalid URL',
          description: 'Please enter a valid URL.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setHasSubmitted(true);
    toast({
      title: 'Assignment submitted! 🎉',
      description: 'Your instructor will review your submission soon.',
    });
    
    setIsSubmitting(false);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          {course && (
            <Link
              to={`/learn/${course._id}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to {course.title}
            </Link>
          )}
        </div>

        {/* Header Card */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="h-3 w-3" />
                    Assignment
                  </Badge>
                  {existingSubmission?.grade !== undefined && (
                    <Badge variant="outline" className={getGradeColor(existingSubmission.grade)}>
                      Grade: {existingSubmission.grade}/100
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl md:text-3xl font-display">
                  {assignment.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {assignment.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submission Section */}
            {existingSubmission || hasSubmitted ? (
              <Card className="border-success/30 bg-success/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    Submission Received
                  </CardTitle>
                  <CardDescription>
                    Submitted on {new Date(existingSubmission?.submittedAt || new Date()).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {existingSubmission?.content && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">Your submission</Label>
                      <div className="p-4 bg-background rounded-lg border">
                        {existingSubmission.content.startsWith('http') ? (
                          <a 
                            href={existingSubmission.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {existingSubmission.content}
                          </a>
                        ) : (
                          <p className="text-sm">{existingSubmission.content}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {existingSubmission?.grade !== undefined ? (
                    <div className="p-6 bg-background rounded-xl border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Your Grade</span>
                        <span className={`font-display text-4xl font-bold ${getGradeColor(existingSubmission.grade)}`}>
                          {existingSubmission.grade}
                          <span className="text-lg text-muted-foreground">/100</span>
                        </span>
                      </div>
                      <Progress 
                        value={existingSubmission.grade} 
                        className="h-3"
                      />
                      {existingSubmission.feedback && (
                        <div className="pt-4 border-t space-y-2">
                          <Label className="text-muted-foreground text-sm">Instructor Feedback</Label>
                          <p className="text-sm bg-secondary/50 p-4 rounded-lg">
                            {existingSubmission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                      <Clock className="h-5 w-5 text-muted-foreground animate-pulse" />
                      <div>
                        <p className="font-medium text-sm">Pending Review</p>
                        <p className="text-xs text-muted-foreground">
                          Your instructor will grade this submission soon
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Submit Your Work
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred submission method below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs value={submissionType} onValueChange={(v) => setSubmissionType(v as 'link' | 'text')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="link" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Link Submission
                        </TabsTrigger>
                        <TabsTrigger value="text" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Text Submission
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="link" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="link">Google Drive / GitHub Link</Label>
                          <Input
                            id="link"
                            type="url"
                            placeholder="https://drive.google.com/file/d/... or https://github.com/..."
                            value={submissionLink}
                            onChange={(e) => setSubmissionLink(e.target.value)}
                            className="h-12"
                          />
                          <p className="text-xs text-muted-foreground">
                            Make sure your link is publicly accessible or shared with the instructor
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="text" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="text">Your Answer</Label>
                          <Textarea
                            id="text"
                            placeholder="Type your answer here..."
                            rows={8}
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            className="resize-none"
                          />
                          <p className="text-xs text-muted-foreground">
                            {submissionText.length}/5000 characters
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <Button 
                      type="submit" 
                      className="w-full h-12 gap-2 gradient-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Assignment
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            {course && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Course
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link to={`/learn/${course._id}`}>
                      Return to Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  💡 Submission Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Double-check your work before submitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Ensure shared links have proper permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Include comments in your code for clarity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Test your solution before submission</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
