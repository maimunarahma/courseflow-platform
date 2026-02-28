import { useState } from 'react';
import { Code2, Loader2, CheckCircle2, AlertTriangle, Info, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface CodeReviewResult {
  review: string;
  courseTitle?: string;
  language?: string;
  timestamp?: string;
}

export const AICodeReview = ({ courseId }: { courseId: string }) => {
  console.log(courseId)
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState<CodeReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const { toast } = useToast();

  const handleReview = async () => {
    if (!code.trim()) {
      toast({
        title: 'No Code Provided',
        description: 'Please paste your code to get AI feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsReviewing(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/codeReview/submit/${courseId}`,
        { code, language },
        { withCredentials: true }
      );

      // Handle response - backend returns { success, data: { review } }
      const reviewData = response.data.data || response.data;
      setReview(reviewData);
      
      toast({
        title: '🤖 Code Review Complete!',
        description: 'AI has analyzed your code.',
      });
    } catch (error: any) {
      console.error('Failed to review code:', error);
      toast({
        title: 'Review Failed',
        description: error.response?.data?.message || 'Failed to review code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReviewing(false);
    }
  };

  // Parse markdown-style review to extract sections
  const parseReview = (reviewText: string) => {
    const sections: { [key: string]: string } = {};
    const lines = reviewText.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('##')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.replace(/^##\s*\d*\.?\s*/, '').trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    });

    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          AI Code Review
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Programming Language</label>
          <div className="flex gap-2 flex-wrap">
            {['javascript', 'typescript', 'python', 'java', 'cpp', 'react'].map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Your Code</label>
          <Textarea
            placeholder="Paste your code here for AI review..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleReview}
          disabled={isReviewing || !code.trim()}
          className="w-full gradient-primary"
        >
          {isReviewing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Code...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Code Review
            </>
          )}
        </Button>

        {review && review.review && (
          <div className="space-y-4 mt-6">
            <ScrollArea className="h-[500px] rounded-md border p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {/* Display raw markdown content with proper formatting */}
                {review.review.split('\n').map((line, index) => {
                  // Section headers (##)
                  if (line.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-lg font-bold mt-6 mb-3 text-primary flex items-center gap-2">
                        {line.includes('✅') && <CheckCircle2 className="h-5 w-5 text-success" />}
                        {line.includes('🔧') && <AlertTriangle className="h-5 w-5 text-warning" />}
                        {line.includes('⚠️') && <AlertTriangle className="h-5 w-5 text-destructive" />}
                        {line.includes('💡') && <Sparkles className="h-5 w-5 text-accent" />}
                        {line.includes('📚') && <Info className="h-5 w-5 text-info" />}
                        {line.includes('🎯') && <Star className="h-5 w-5 text-warning" />}
                        {line.replace(/^##\s*\d*\.?\s*/, '')}
                      </h3>
                    );
                  }
                  
                  // Bold text (***text***)
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={index} className="mb-2 text-foreground">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i} className="text-primary font-semibold">{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  
                  // List items (- or *)
                  if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return (
                      <li key={index} className="ml-4 mb-2 text-muted-foreground">
                        {line.replace(/^[\s-*]+/, '')}
                      </li>
                    );
                  }
                  
                  // Code blocks (```)
                  if (line.startsWith('```')) {
                    return null; // Handle code blocks separately if needed
                  }
                  
                  // Star ratings (⭐)
                  if (line.includes('⭐')) {
                    return (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <span className="text-warning">{line}</span>
                      </div>
                    );
                  }
                  
                  // Empty lines
                  if (line.trim() === '') {
                    return <div key={index} className="h-2" />;
                  }
                  
                  // Regular paragraphs
                  return (
                    <p key={index} className="mb-2 text-foreground leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Metadata footer */}
            {(review.courseTitle || review.language) && (
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-4">
                  {review.courseTitle && (
                    <span>📚 {review.courseTitle}</span>
                  )}
                  {review.language && (
                    <Badge variant="outline" className="text-xs">
                      {review.language}
                    </Badge>
                  )}
                </div>
                {review.timestamp && (
                  <span>{new Date(review.timestamp).toLocaleString()}</span>
                )}
              </div>
            )}
          </div>
        )}

        {review && !review.review && (
          <div className="text-center py-8 text-muted-foreground">
            <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Paste your code and get instant AI feedback</p>
            <p className="text-sm mt-2">Detects bugs, best practices, and suggests improvements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
