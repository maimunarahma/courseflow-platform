import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, XCircle, Award, RotateCcw, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { cn } from '../lib/utils';
import { useQuizzes } from '../hooks/use-quiz';

export default function Quiz() {
  const { courseId} = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { quizzes, createQuizMutation, isLoading, isError } = useQuizzes(courseId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [previousQuizIds, setPreviousQuizIds] = useState<string[]>([]);
  const MAX_REGENERATIONS = 2;

  console.log("Quizzes from hook:", quizzes);
  
  // Automatically generate quiz if empty or invalid
  useEffect(() => {
    if (!isLoading && 
        (!Array.isArray(quizzes) || quizzes.length === 0) && 
        courseId && 
        !isGenerating && 
        !createQuizMutation.isPending) {
      setIsGenerating(true);
      createQuizMutation.mutate(
        { course: { _id: courseId } },
        {
          onSuccess: () => {
            console.log('Quiz generated successfully');
            setIsGenerating(false);
          },
          onError: (error) => {
            console.error('Failed to generate quiz:', error);
            setIsGenerating(false);
          }
        }
      );
    }
  }, [quizzes.length, isLoading, courseId, isGenerating, createQuizMutation]);

// Select the specific quiz by quizId or get first quiz
const quiz = useMemo(() => {
  if (!Array.isArray(quizzes) || quizzes.length === 0) return null;
  return quizzes[0];
}, [quizzes]);

const questions = quiz?.questions || [];

console.log(quiz)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  console.log(selectedAnswers);

  // Show loading state
  if (isLoading || createQuizMutation.isPending || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto border-2 border-primary/20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {!Array.isArray(quizzes) || quizzes.length === 0 ? 'Generating Your Quiz' : 'Loading Quiz'}
            </h2>
            <p className="text-muted-foreground">
              {!Array.isArray(quizzes) || quizzes.length === 0
                ? 'AI is creating personalized questions for you...' 
                : 'Preparing your assessment...'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>

          {(!Array.isArray(quizzes) || quizzes.length === 0) && (
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>This may take a few moments...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (isError || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl mb-4">Quiz not found</h1>
          <p className="text-muted-foreground mb-4">
            {!Array.isArray(quizzes) || quizzes.length === 0
              ? 'Failed to generate quiz. Please try again.' 
              : 'The requested quiz could not be found.'}
          </p>
          <div className="flex gap-3 justify-center">
            {(!Array.isArray(quizzes) || quizzes.length === 0) && (
              <Button 
                onClick={() => {
                  setIsGenerating(true);
                  createQuizMutation.mutate({ course: { _id: courseId } });
                }}
                disabled={createQuizMutation.isPending}
                className="gradient-primary"
              >
                {createQuizMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to={`/dashboard`}>Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Add safety check for question and ensure we have questions
  if (!questions || questions.length === 0) {
    return null; // Will be caught by the quiz check above
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  // Convert options object to array if needed
  const optionsArray = question?.options 
    ? (Array.isArray(question.options) 
        ? question.options 
        : Object.values(question.options))
    : [];

  const handleSelectAnswer = (answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmit = () => setSubmitted(true);

 const calculateScore = () => {
  let correct = 0;
  questions.forEach((q, i) => {
    const selectedIndex = selectedAnswers[i];
    if (selectedIndex !== null && selectedIndex !== undefined) {
      const optionsArr = Array.isArray(q.options) ? q.options : Object.values(q.options);
      if (optionsArr[selectedIndex] === q.correctAnswer) {
        correct++;
      }
    }
  });
  return correct;
};


  const handleRetry = () => {
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setSubmitted(false);
  };

  const handleRegenerate = () => {
    if (courseId && !isGenerating && !createQuizMutation.isPending && regenerateCount < MAX_REGENERATIONS) {
      setIsGenerating(true);
      setSelectedAnswers([]);
      setCurrentQuestion(0);
      setSubmitted(false);
      
      // Add current quiz ID to previous list to avoid duplicates
      if (quiz?._id) {
        setPreviousQuizIds(prev => [...prev, quiz._id]);
      }
      
      createQuizMutation.mutate(
        { 
          course: { _id: courseId },
          regenerate: true, // Flag to indicate regeneration
          previousQuizId: quiz?._id // Send current quiz ID to backend
        },
        {
          onSuccess: () => {
            console.log('Quiz regenerated successfully');
            setRegenerateCount(prev => prev + 1);
            setIsGenerating(false);
          },
          onError: (error) => {
            console.error('Failed to regenerate quiz:', error);
            setIsGenerating(false);
          }
        }
      );
    }
  };

  if (submitted) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto py-8">
          <Card className="overflow-hidden">
            <div className={cn('p-8 text-center', passed ? 'gradient-primary' : 'bg-destructive')}>
              <Award className="h-16 w-16 mx-auto mb-4 text-primary-foreground" />
              <h1 className="font-display text-3xl text-primary-foreground mb-2">
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h1>
              <p className="text-primary-foreground/80">
                {passed ? 'You passed the quiz!' : 'You need 70% to pass.'}
              </p>
            </div>

            <CardContent className="p-8">
              <div className="text-center mb-8">
                <p className="text-5xl font-display font-bold mb-2">{percentage}%</p>
                <p className="text-muted-foreground">{score} out of {questions.length} correct</p>
              </div>

              <div className="space-y-4">
                {questions.map((q, i) => {
              const optionsArr = Array.isArray(q.options) ? q.options : Object.values(q.options);
              const isCorrect = selectedAnswers[i] !== null && selectedAnswers[i] !== undefined && optionsArr[selectedAnswers[i]!] === q.correctAnswer;

                  return (
                    <div
                      key={q._id}
                      className={cn(
                        'p-4 rounded-lg border',
                        isCorrect ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium mb-1">{q.question || q.text}</p>
                          <p className="text-sm text-muted-foreground">
                            Correct: {q.correctAnswer}
                          </p>
                          {!isCorrect && selectedAnswers[i] !== null && selectedAnswers[i] !== undefined && (
                            <p className="text-sm text-destructive">
                              Your answer: {optionsArr[selectedAnswers[i]!]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" className="flex-1" onClick={handleRetry}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry Quiz
                </Button>
                <Button className="flex-1 gradient-primary" asChild>
                  <Link to={`/learn/${courseId}`}>Continue Course</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/learn/${courseId}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Course
          </Link>
          <h1 className="font-display text-2xl mb-2">{quiz?.title || 'Course Quiz'}</h1>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground">{currentQuestion + 1} / {questions.length}</span>
          </div>
          
          {/* Regenerate Quiz Button */}
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleRegenerate}
              disabled={isGenerating || createQuizMutation.isPending || regenerateCount >= MAX_REGENERATIONS}
              variant="outline"
              size="sm"
            >
              {isGenerating || createQuizMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate Quiz
                </>
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              {regenerateCount >= MAX_REGENERATIONS 
                ? '⚠️ Maximum regenerations reached (2/2)' 
                : `${regenerateCount}/${MAX_REGENERATIONS} regenerations used`}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{question?.question || question?.text}</p>

            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString()}
              onValueChange={(value) => handleSelectAnswer(parseInt(value))}
            >
              {optionsArray.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer',
                    selectedAnswers[currentQuestion] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => handleSelectAnswer(index)}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</Button>
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswers.filter((a) => a !== null).length !== questions.length}
                  className="gradient-primary"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
