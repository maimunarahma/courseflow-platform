import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { cn } from '../lib/utils';
import { useQuizzes } from '../hooks/use-quiz';

export default function Quiz() {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  const { quizzes, isLoading, isError } = useQuizzes(courseId);
console.log("Quizzes from hook:", quizzes);

  // Select the specific quiz by quizId
 const quiz = useMemo(() => 
  quizzes.find(q => q.questions.some(question => question.id === quizId)),
  [quizzes, quizId]
);


  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  console.log(selectedAnswers)
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError || !quiz) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl mb-4">Quiz not found</h1>
        <Button asChild>
          <Link to={`/dashboard`}>Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleSelectAnswer = (answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmit = () => setSubmitted(true);

 const calculateScore = () => {
  let correct = 0;
  quiz.questions.forEach((q, i) => {
    const selectedIndex = selectedAnswers[i];
    if (selectedIndex !== null && q.options[selectedIndex] === q.correctAnswer) {
      correct++;
    }
  });
  return correct;
};


  const handleRetry = () => {
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setSubmitted(false);
  };

  if (submitted) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);
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
                <p className="text-muted-foreground">{score} out of {quiz.questions.length} correct</p>
              </div>

              <div className="space-y-4">
                {quiz.questions.map((q, i) => {
              const isCorrect = selectedAnswers[i] !== null && q.options[selectedAnswers[i]!] === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
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
                          <p className="font-medium mb-1">{q.text}</p>
                          <p className="text-sm text-muted-foreground">
                            Correct: {q.correctAnswer}
                          </p>
                          {!isCorrect && selectedAnswers[i] !== null && (
                            <p className="text-sm text-destructive">
                              Your answer: {q.options[selectedAnswers[i]!]}
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
          <h1 className="font-display text-2xl mb-2">{quiz.title}</h1>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground">{currentQuestion + 1} / {quiz.questions.length}</span>
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{question.text}</p>

            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString()}
              onValueChange={(value) => handleSelectAnswer(parseInt(value))}
            >
              {question.options.map((option, index) => (
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
              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswers.filter((a) => a !== null).length !== quiz.questions.length}
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
