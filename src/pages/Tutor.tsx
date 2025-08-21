import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Tutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI study tutor. Ask me any questions about your study materials, and I'll help you understand the concepts better.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const botResponses = [
        "That's an excellent question! Let me break this down for you:\n\n• This concept relates to fundamental principles we discussed earlier\n• The key insight here is understanding the relationship between different elements\n• Consider how this applies to real-world scenarios\n\nWould you like me to provide more specific examples or clarify any particular aspect?",
        
        "Great question! Here's how I would approach this:\n\n**Step 1**: Identify the core components\n**Step 2**: Analyze their interactions\n**Step 3**: Apply the underlying principles\n\nThis method helps you build a systematic understanding. What part would you like to explore further?",
        
        "I can see you're thinking deeply about this topic! Let me provide some context:\n\n🎯 **Key Point**: This is a foundational concept that connects to several other areas\n📚 **Study Tip**: Try relating this to examples you encounter daily\n💡 **Memory Aid**: Create mental associations with familiar concepts\n\nDoes this help clarify things for you?",
        
        "Excellent observation! You're touching on an important aspect here. Let me elaborate:\n\n• This principle is widely applicable across different domains\n• Understanding it will help you tackle similar problems more effectively\n• The underlying logic follows a consistent pattern\n\nWhat specific application of this concept interests you most?"
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      toast({
        title: "Response Generated",
        description: "Your AI tutor has provided a detailed explanation.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from tutor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-3">AI Study Tutor</h1>
        <p className="text-muted-foreground text-lg">
          Ask questions and get personalized explanations for your study materials
        </p>
      </div>

      {/* Chat Container */}
      <Card className="glass-card h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Interactive Q&A Session</span>
          </CardTitle>
          <CardDescription>
            Ask any questions about your study materials and get detailed explanations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 animate-fade-in ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-accent text-accent-foreground rounded-br-sm'
                      : 'glass-card rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {message.text}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="glass-card p-4 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Tutor is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your tutor any question about your studies..."
              className="flex-1 glass-card border-primary/20 focus:border-primary/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="gradient-btn px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Questions to Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Explain this concept in simple terms",
              "What are the key points I should remember?",
              "Can you give me a real-world example?",
              "How does this relate to other topics?"
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="glass-card text-left justify-start h-auto p-4 hover:scale-105 transition-transform duration-200"
                onClick={() => setInputMessage(question)}
                disabled={isLoading}
              >
                <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}