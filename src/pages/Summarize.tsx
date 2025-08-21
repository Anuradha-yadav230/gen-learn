import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

export default function Summarize() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('english');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to summarize.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSummary = `• **Key Concept**: The main topic discussed involves advanced study techniques and learning methodologies.

• **Primary Focus**: Understanding how to effectively retain and process information through structured approaches.

• **Important Points**: 
  - Active recall significantly improves memory retention
  - Spaced repetition helps with long-term learning
  - Practice testing enhances comprehension

• **Conclusion**: Implementing these evidence-based study strategies can dramatically improve academic performance and knowledge retention.

• **Action Items**: 
  - Create a study schedule incorporating spaced repetition
  - Use active recall techniques during study sessions
  - Regular self-testing to identify knowledge gaps`;

      setSummary(mockSummary);
      
      // Animate result appearance
      if (resultRef.current) {
        gsap.fromTo(resultRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }

      toast({
        title: "Summary Generated!",
        description: `Text summarized in ${language === 'english' ? 'English' : language === 'hindi' ? 'Hindi' : 'Marathi'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-3">AI Text Summarizer</h1>
        <p className="text-muted-foreground text-lg">
          Transform lengthy texts into concise, structured summaries
        </p>
      </div>

      {/* Input Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Input Text</span>
          </CardTitle>
          <CardDescription>
            Paste your text content and select the output language for summarization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your text here for summarization..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] glass-card border-primary/20 focus:border-primary/50"
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Output Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                  <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleSummarize}
                disabled={isLoading}
                className="gradient-btn w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Summarize
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Result */}
      {summary && (
        <Card ref={resultRef} className="glass-card glow-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>Generated Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {summary}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}