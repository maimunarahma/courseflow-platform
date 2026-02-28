/**
 * AI Quiz Generator Component
 * Auto-generates quiz questions from lesson content using AI
 */

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { aiService, QuizQuestion } from '@/services/ai.service';
import { useToast } from '@/hooks/use-toast';

interface AIQuizGeneratorProps {
  courseTitle: string;
  lessonTitle: string;
  lessonContent: string;
  onComplete?: (score: number) => void;
}

export function AIQuizGenerator({
  courseTitle,
  lessonTitle,
  lessonContent,
  onComplete,
}: AIQuizGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generatedQuestions = await aiService.generateQuiz(
        courseTitle,
        lessonContent,
        5 // Generate 5 questions
      );
      setQuestions(generatedQuestions);
      setSelectedAnswers(new Array(generatedQuestions.length).fill(-1));
      setCurrentQuestionIndex(0);
      setShowResults(false);
      toast({
        title: '✨ Quiz Generated!',
        description: `${generatedQuestions.length} AI-powered questions ready`,
      });
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Could not generate quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    if (onComplete) {
      onComplete(finalScore);
    }

    toast({
      title: `Quiz Complete! 🎉`,
      description: `You scored ${finalScore}%`,
    });
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  if (questions.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Quiz Generator</CardTitle>
          </div>
          <CardDescription>
            Generate a personalized quiz based on "{lessonTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gradient-primary w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>Review your answers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-primary/5 rounded-lg">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <p className="text-muted-foreground">
              {score >= 80
                ? '🎉 Excellent work!'
                : score >= 60
                ? '👍 Good job!'
                : '💪 Keep practicing!'}
            </p>
          </div>

          {questions.map((q, qIndex) => {
            const userAnswer = selectedAnswers[qIndex];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div key={qIndex} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">
                      {qIndex + 1}. {q.question}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your answer: <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                        {q.options[userAnswer]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-success mb-2">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground italic">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              Retry Quiz
            </Button>
            <Button onClick={handleGenerate} className="flex-1 gradient-primary">
              <Sparkles className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = selectedAnswers.every((a) => a !== -1);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">{currentQuestion.question}</h3>

          <RadioGroup
            value={selectedAnswers[currentQuestionIndex]?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex-1 gradient-primary"
            >
              Submit Quiz
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          💡 Answer all questions to submit
        </p>
      </CardContent>
    </Card>
  );
}
