import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, ArrowRight, Copy, Volume2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦' }
];

const mockTranslations: Record<string, Record<string, string>> = {
  'en': {
    'hi': 'यह एक उदाहरण अनुवाद है जो दिखाता है कि कैसे आपका टेक्स्ट हिंदी में अनुवादित होगा। यह AI-संचालित अनुवाद प्रणाली संदर्भ और व्याकरण को समझती है।',
    'mr': 'हे एक उदाहरण भाषांतर आहे जे दर्शवते की तुमचा मजकूर मराठीत कसा भाषांतरित होईल. ही AI-चालित भाषांतर प्रणाली संदर्भ आणि व्याकरण समजते.',
    'es': 'Esta es una traducción de ejemplo que muestra cómo se traduciría tu texto al español. Este sistema de traducción impulsado por IA comprende el contexto y la gramática.',
    'fr': 'Ceci est un exemple de traduction qui montre comment votre texte serait traduit en français. Ce système de traduction alimenté par l\'IA comprend le contexte et la grammaire.'
  }
};

export default function Translate() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);
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

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to translate.",
        variant: "destructive"
      });
      return;
    }

    if (sourceLang === targetLang) {
      toast({
        title: "Same Language",
        description: "Please select different source and target languages.",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const translation = mockTranslations[sourceLang]?.[targetLang] || 
        `This is a translated version of your text in ${languages.find(l => l.code === targetLang)?.name}. The AI translation system maintains context and proper grammar structure for accurate communication.`;
      
      setTranslatedText(translation);

      // Animate result appearance
      if (resultRef.current) {
        gsap.fromTo(resultRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }

      toast({
        title: "Translation Complete!",
        description: `Text translated from ${languages.find(l => l.code === sourceLang)?.name} to ${languages.find(l => l.code === targetLang)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Translation failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    const tempText = sourceText;
    
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(tempText);

    toast({
      title: "Languages Swapped",
      description: "Source and target languages have been switched.",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Translation copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const speakText = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive"
      });
    }
  };

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-3">Multilingual Translator</h1>
        <p className="text-muted-foreground text-lg">
          Translate your study materials into multiple languages with AI precision
        </p>
      </div>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5" />
                <span>Source Text</span>
              </div>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-48 glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[300px] glass-card border-primary/20 focus:border-primary/50 resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {sourceText.length} characters
              </div>
              <div className="flex space-x-2">
                {sourceText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakText(sourceText, sourceLang)}
                    className="glass-card"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5" />
                <span>Translation</span>
              </div>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-48 glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[300px] glass-card border-primary/20 p-3 rounded-md">
              {translatedText ? (
                <div ref={resultRef} className="whitespace-pre-wrap leading-relaxed">
                  {translatedText}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Translation will appear here...
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {translatedText.length} characters
              </div>
              <div className="flex space-x-2">
                {translatedText && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakText(translatedText, targetLang)}
                      className="glass-card"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(translatedText)}
                      className="glass-card"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={swapLanguages}
          className="glass-card"
          disabled={isTranslating}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Swap Languages
        </Button>
        
        <Button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="gradient-btn"
        >
          {isTranslating ? (
            <>
              <Languages className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              Translate
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Quick Phrases */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quick Phrases for Students</CardTitle>
          <CardDescription>
            Click on any phrase to translate it instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "What does this mean?",
              "Can you explain this concept?",
              "I don't understand this part",
              "Please repeat that",
              "How do you pronounce this?",
              "What is the main idea?"
            ].map((phrase, index) => (
              <Button
                key={index}
                variant="outline"
                className="glass-card text-left justify-start h-auto p-3 hover:scale-105 transition-transform duration-200"
                onClick={() => setSourceText(phrase)}
                disabled={isTranslating}
              >
                <span className="text-sm">{phrase}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}