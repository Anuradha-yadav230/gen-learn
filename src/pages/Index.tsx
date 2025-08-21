import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileText, 
  HelpCircle, 
  CreditCard, 
  MessageSquare, 
  Languages, 
  BarChart3,
  ArrowRight,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { gsap } from 'gsap';

const features = [
  {
    icon: Upload,
    title: 'Upload Notes',
    description: 'Upload PDFs, images, or documents to create personalized study guides',
    href: '/upload',
    color: 'text-blue-400'
  },
  {
    icon: FileText,
    title: 'AI Summarizer',
    description: 'Transform lengthy texts into concise, structured summaries',
    href: '/summarize',
    color: 'text-purple-400'
  },
  {
    icon: HelpCircle,
    title: 'Quiz Generator',
    description: 'Generate personalized quizzes from your study materials',
    href: '/quiz',
    color: 'text-cyan-400'
  },
  {
    icon: CreditCard,
    title: 'Interactive Flashcards',
    description: 'Create flip cards with smooth 3D animations for active recall',
    href: '/flashcards',
    color: 'text-green-400'
  },
  {
    icon: MessageSquare,
    title: 'AI Tutor',
    description: 'Ask questions and get personalized explanations instantly',
    href: '/tutor',
    color: 'text-orange-400'
  },
  {
    icon: Languages,
    title: 'Multilingual Translation',
    description: 'Translate study materials into multiple languages',
    href: '/translate',
    color: 'text-pink-400'
  },
  {
    icon: BarChart3,
    title: 'Progress Dashboard',
    description: 'Track your learning journey with detailed analytics',
    href: '/dashboard',
    color: 'text-indigo-400'
  }
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children,
        { opacity: 0, y: 100, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }

    // Features animation
    featuresRef.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref,
          { opacity: 0, y: 50, rotateX: 45 },
          { 
            opacity: 1, 
            y: 0, 
            rotateX: 0, 
            duration: 0.8, 
            delay: 1.2 + index * 0.1, 
            ease: "power2.out" 
          }
        );
      }
    });

    // Floating animation for hero elements
    gsap.to('.float-element', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.5
    });
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <div ref={heroRef} className="text-center py-16 px-4">
        <div className="float-element">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">📚 StudyGenie</span>
          </h1>
        </div>
        
        <div className="float-element">
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Personalized Study Guide Generator
          </p>
        </div>
        
        <div className="float-element">
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Harness the power of AI to transform your study materials into interactive guides, 
            quizzes, flashcards, and multilingual content for enhanced learning.
          </p>
        </div>

        <div className="float-element flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/upload">
            <Button className="gradient-btn text-lg px-8 py-6 hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="glass-card text-lg px-8 py-6 hover:scale-105 transition-transform duration-200">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="glass-card p-6 rounded-2xl glow-effect">
            <Brain className="w-10 h-10 text-accent mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">7+</div>
            <div className="text-muted-foreground">AI-Powered Features</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <Languages className="w-10 h-10 text-accent mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">10+</div>
            <div className="text-muted-foreground">Supported Languages</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <Zap className="w-10 h-10 text-accent mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">∞</div>
            <div className="text-muted-foreground">Study Possibilities</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text mb-4">Powerful Study Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to supercharge your learning experience with cutting-edge AI technology
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link 
              key={feature.title}
              to={feature.href}
            >
              <Card 
                ref={el => featuresRef.current[index] = el!}
                className="glass-card h-full hover:scale-105 hover:glow-effect transition-all duration-300 cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform duration-200`} />
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                  <CardTitle className="group-hover:gradient-text transition-all duration-200">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-border">
        <p className="text-muted-foreground">
          Built at <span className="gradient-text font-semibold">SUNHACKS 2025</span> – GenAI Track
        </p>
      </div>
    </div>
  );
};

export default Index;
