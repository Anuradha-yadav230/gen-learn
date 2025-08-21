import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CreditCard, ArrowLeft, ArrowRight, RotateCcw, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

interface FlashCard {
  id: number;
  front: string;
  back: string;
}

const mockFlashcards: FlashCard[] = [
  {
    id: 1,
    front: "What is Active Recall?",
    back: "A learning technique where you actively stimulate memory during the learning process by testing yourself on the material without looking at the source."
  },
  {
    id: 2,
    front: "Spaced Repetition",
    back: "A learning technique that incorporates increasing intervals of time between subsequent review of previously learned material to exploit the psychological spacing effect."
  },
  {
    id: 3,
    front: "Pomodoro Technique",
    back: "A time management method where work is broken down into intervals of 25 minutes separated by short breaks of 5 minutes."
  },
  {
    id: 4,
    front: "Elaborative Interrogation",
    back: "A learning strategy that involves generating explanations for why an explicitly stated fact or concept is true."
  },
  {
    id: 5,
    front: "Interleaving",
    back: "A learning technique where different topics or types of problems are mixed together during practice, rather than studying them in blocks."
  }
];

export default function Flashcards() {
  const [inputText, setInputText] = useState('');
  const [numCards, setNumCards] = useState(10);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  const generateFlashcards = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate flashcards from.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const cards = mockFlashcards.slice(0, Math.min(numCards, mockFlashcards.length));
      setFlashcards(cards);
      setCurrentCard(0);
      setIsFlipped(false);

      toast({
        title: "Flashcards Generated!",
        description: `Created ${cards.length} flashcards from your content.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const flipCard = () => {
    if (!cardRef.current) return;
    
    setIsFlipped(!isFlipped);
    
    gsap.to(cardRef.current, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: "power2.inOut"
    });
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      if (cardRef.current) {
        gsap.set(cardRef.current, { rotateY: 0 });
      }
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
      if (cardRef.current) {
        gsap.set(cardRef.current, { rotateY: 0 });
      }
    }
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCard(0);
    setIsFlipped(false);
    if (cardRef.current) {
      gsap.set(cardRef.current, { rotateY: 0 });
    }
    
    toast({
      title: "Cards Shuffled!",
      description: "Flashcards have been randomly shuffled.",
    });
  };

  const resetFlashcards = () => {
    setFlashcards([]);
    setCurrentCard(0);
    setIsFlipped(false);
    setInputText('');
  };

  const progress = flashcards.length > 0 ? ((currentCard + 1) / flashcards.length) * 100 : 0;

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-3">AI Flashcard Generator</h1>
        <p className="text-muted-foreground text-lg">
          Create interactive flashcards with 3D flip animations
        </p>
      </div>

      {flashcards.length === 0 ? (
        /* Input Card */
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Generate Flashcards</span>
            </CardTitle>
            <CardDescription>
              Enter your study material and specify how many flashcards you'd like
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your study content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] glass-card border-primary/20 focus:border-primary/50"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Number of Cards</label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={numCards}
                  onChange={(e) => setNumCards(parseInt(e.target.value) || 10)}
                  className="glass-card"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={generateFlashcards}
                  disabled={isGenerating}
                  className="gradient-btn w-full sm:w-auto"
                >
                  {isGenerating ? 'Generating...' : 'Generate Cards'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Flashcard Viewer */
        <div className="space-y-6">
          {/* Progress and Controls */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Card {currentCard + 1} of {flashcards.length}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={shuffleCards}>
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetFlashcards}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
          </Card>

          {/* Flashcard */}
          <div className="perspective-1000 flex justify-center">
            <div 
              ref={cardRef}
              className="relative w-full max-w-2xl h-80 cursor-pointer"
              onClick={flipCard}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div className={`absolute inset-0 glass-card rounded-2xl p-8 flex items-center justify-center text-center glow-effect ${isFlipped ? 'backface-hidden' : ''}`}>
                <div>
                  <div className="text-sm text-accent font-medium mb-4">FRONT</div>
                  <h3 className="text-2xl font-bold mb-4">{flashcards[currentCard]?.front}</h3>
                  <p className="text-muted-foreground">Click to flip</p>
                </div>
              </div>

              {/* Back */}
              <div 
                className={`absolute inset-0 glass-card rounded-2xl p-8 flex items-center justify-center text-center glow-effect ${!isFlipped ? 'backface-hidden' : ''}`}
                style={{ transform: 'rotateY(180deg)' }}
              >
                <div>
                  <div className="text-sm text-secondary font-medium mb-4">BACK</div>
                  <p className="text-lg leading-relaxed">{flashcards[currentCard]?.back}</p>
                  <p className="text-muted-foreground mt-4">Click to flip back</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={prevCard}
              disabled={currentCard === 0}
              variant="outline"
              className="glass-card"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={flipCard} className="gradient-btn">
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </Button>
            
            <Button 
              onClick={nextCard}
              disabled={currentCard === flashcards.length - 1}
              variant="outline"
              className="glass-card"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Card Counter */}
          <div className="text-center text-muted-foreground">
            Use arrow keys to navigate • Space bar to flip
          </div>
        </div>
      )}
    </div>
  );
}