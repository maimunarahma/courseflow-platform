import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

  const assignment = mockAssignments.find((a) => a.id === id);
  
  const course = mockCourses.find((c) => 
    c.syllabus.some((mod) => mod.assignmentId === id)
  );

  const existingSubmission = assignment?.submissions.find((s) => s.userId === user?.id);

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-4">Assignment not found</h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionLink && !submissionText) {
      toast({
        title: 'Submission required',
        description: 'Please provide a Google Drive link or text submission.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setHasSubmitted(true);
    toast({
      title: 'Assignment submitted!',
      description: 'Your instructor will review your submission.',
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          {course && (
            <Link
              to={`/learn/${course.id}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Link>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl mb-2">{assignment.title}</h1>
              <Badge variant="secondary">
                <FileText className="h-3 w-3 mr-1" />
                Assignment
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Assignment Description */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {assignment.description}
              </p>
            </CardContent>
          </Card>

          {/* Existing Submission or Submit Form */}
          {existingSubmission || hasSubmitted ? (
            <Card className="border-success">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  Submitted
                </CardTitle>
                <CardDescription>
                  Submitted on {new Date(existingSubmission?.submittedAt || new Date()).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingSubmission?.content && (
                  <div>
                    <Label className="text-muted-foreground">Your submission:</Label>
                    <p className="mt-1">{existingSubmission.content}</p>
                  </div>
                )}
                
                {existingSubmission?.grade !== undefined && (
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Grade</span>
                      <span className="font-display text-2xl font-bold">{existingSubmission.grade}/100</span>
                    </div>
                    {existingSubmission.feedback && (
                      <div>
                        <Label className="text-muted-foreground">Feedback:</Label>
                        <p className="mt-1 text-sm">{existingSubmission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {!existingSubmission?.grade && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Waiting for instructor review</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Work</CardTitle>
                <CardDescription>
                  Provide a Google Drive link to your work or submit text directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="link">Google Drive / GitHub Link</Label>
                    <Input
                      id="link"
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text">Text Submission</Label>
                    <Textarea
                      id="text"
                      placeholder="Enter your answer here..."
                      rows={6}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
