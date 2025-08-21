import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { HelpCircle, CheckCircle, X, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizState {
  questions: Question[];
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  showResults: boolean;
  score: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary benefit of spaced repetition in learning?",
    options: [
      "It makes studying faster",
      "It improves long-term memory retention",
      "It reduces study time",
      "It eliminates the need for practice"
    ],
    correctAnswer: 1,
    explanation: "Spaced repetition leverages the psychological spacing effect, which shows that information is better retained when learning sessions are spread out over time rather than massed together."
  },
  {
    id: 2,
    question: "Which study technique involves testing yourself without looking at materials?",
    options: [
      "Highlighting",
      "Re-reading",
      "Active recall",
      "Summarizing"
    ],
    correctAnswer: 2,
    explanation: "Active recall is the practice of retrieving information from memory without looking at the source material, which strengthens neural pathways and improves retention."
  },
  {
    id: 3,
    question: "What is the recommended study-to-break ratio for optimal focus?",
    options: [
      "25:5 (Pomodoro Technique)",
      "60:30",
      "90:15",
      "120:10"
    ],
    correctAnswer: 0,
    explanation: "The Pomodoro Technique recommends 25 minutes of focused study followed by a 5-minute break, which helps maintain concentration and prevents mental fatigue."
  }
];

export default function Quiz() {
  const [inputText, setInputText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    selectedAnswers: [],
    showResults: false,
    score: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (questionRef.current && quizState.questions.length > 0) {
      gsap.fromTo(questionRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [quizState.currentQuestion]);

  const generateQuiz = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate quiz questions from.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const questions = mockQuestions.slice(0, Math.min(numQuestions, mockQuestions.length));
      setQuizState({
        questions,
        currentQuestion: 0,
        selectedAnswers: new Array(questions.length).fill(null),
        showResults: false,
        score: 0
      });

      toast({
        title: "Quiz Generated!",
        description: `Created ${questions.length} questions from your text.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...quizState.selectedAnswers];
    newSelectedAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState(prev => ({ ...prev, selectedAnswers: newSelectedAnswers }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const score = quizState.selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === quizState.questions[index]?.correctAnswer ? 1 : 0);
    }, 0);

    setQuizState(prev => ({ ...prev, showResults: true, score }));

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${quizState.questions.length}`,
    });
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      selectedAnswers: [],
      showResults: false,
      score: 0
    });
    setInputText('');
  };

  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const progress = quizState.questions.length > 0 ? ((quizState.currentQuestion + 1) / quizState.questions.length) * 100 : 0;

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-3">Interactive Quiz Generator</h1>
        <p className="text-muted-foreground text-lg">
          Generate personalized quizzes from your study materials
        </p>
      </div>

      {quizState.questions.length === 0 && !quizState.showResults ? (
        /* Input Card */
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Generate Quiz</span>
            </CardTitle>
            <CardDescription>
              Enter your study content and specify how many questions you'd like
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your study material here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] glass-card border-primary/20 focus:border-primary/50"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Number of Questions</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                  className="glass-card"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={generateQuiz}
                  disabled={isGenerating}
                  className="gradient-btn w-full sm:w-auto"
                >
                  {isGenerating ? 'Generating...' : 'Generate Quiz'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : !quizState.showResults ? (
        /* Quiz Card */
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Question {quizState.currentQuestion + 1} of {quizState.questions.length}</CardTitle>
                <Button variant="outline" onClick={resetQuiz} size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
            <CardContent ref={questionRef}>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">{currentQuestion?.question}</h3>
                
                <div className="space-y-3">
                  {currentQuestion?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-xl transition-all duration-200 border-2 ${
                        quizState.selectedAnswers[quizState.currentQuestion] === index
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-muted glass-card hover:border-primary/50 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          quizState.selectedAnswers[quizState.currentQuestion] === index
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={nextQuestion}
                    disabled={quizState.selectedAnswers[quizState.currentQuestion] === null}
                    className="gradient-btn"
                  >
                    {quizState.currentQuestion === quizState.questions.length - 1 ? (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Finish Quiz
                      </>
                    ) : (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Results Card */
        <Card className="glass-card glow-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <div className="text-4xl font-bold gradient-text">
              {quizState.score} / {quizState.questions.length}
            </div>
            <CardDescription>
              {quizState.score === quizState.questions.length ? 'Perfect Score!' : 
               quizState.score >= quizState.questions.length * 0.8 ? 'Great Job!' :
               quizState.score >= quizState.questions.length * 0.6 ? 'Good Work!' : 'Keep Studying!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizState.questions.map((question, index) => (
                <div key={question.id} className="glass-card p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    {quizState.selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button onClick={resetQuiz} className="gradient-btn">
                <RotateCcw className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}