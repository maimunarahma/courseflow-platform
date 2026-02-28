import { useState } from 'react';
import { Sparkles, Loader2, BookOpen, CheckCircle, Brain, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface StudyNotes {
  summary: string;
  keyPoints: string[];
  practiceExercises: Array<{
    question: string;
    hint: string;
  }>;
}

interface AIStudyNotesProps {
  lessonTitle: string;
  lessonContent?: string;
  courseTitle: string;
}

export function AIStudyNotes({ lessonTitle, lessonContent, courseTitle }: AIStudyNotesProps) {
  const [notes, setNotes] = useState<StudyNotes | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateNotes = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ai/generate-notes`,
        {
          lessonTitle,
          lessonContent: lessonContent || `Lesson about ${lessonTitle} from ${courseTitle}`,
          courseTitle,
        },
        { withCredentials: true }
      );

      setNotes(response.data.notes);
      toast({
        title: '✨ Study Notes Generated!',
        description: 'Your AI-powered study notes are ready.',
      });
    } catch (error: any) {
      console.error('Failed to generate notes:', error);
      toast({
        title: 'Generation Failed',
        description: error.response?.data?.message || 'Failed to generate study notes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Study Notes Generator
          </CardTitle>
          {!notes && (
            <Button
              onClick={generateNotes}
              disabled={isGenerating}
              className="gradient-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Notes
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {notes && (
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">
                <FileText className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="keypoints">
                <CheckCircle className="h-4 w-4 mr-2" />
                Key Points
              </TabsTrigger>
              <TabsTrigger value="practice">
                <BookOpen className="h-4 w-4 mr-2" />
                Practice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed">{notes.summary}</p>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="keypoints" className="mt-4">
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <ul className="space-y-3">
                  {notes.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="practice" className="mt-4">
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-4">
                  {notes.practiceExercises.map((exercise, index) => (
                    <div key={index} className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-semibold text-primary">Q{index + 1}:</span>
                        <p className="text-foreground flex-1">{exercise.question}</p>
                      </div>
                      <div className="ml-6 mt-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-accent">💡 Hint:</span> {exercise.hint}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button
              onClick={generateNotes}
              disabled={isGenerating}
              variant="outline"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate Notes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      )}

      {!notes && !isGenerating && (
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click "Generate Notes" to create AI-powered study materials</p>
            <p className="text-sm mt-2">Includes summary, key points, and practice exercises</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
