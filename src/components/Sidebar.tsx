import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  HelpCircle, 
  CreditCard, 
  MessageSquare, 
  Languages, 
  BarChart3, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Summarize', href: '/summarize', icon: FileText },
  { name: 'Quiz', href: '/quiz', icon: HelpCircle },
  { name: 'Flashcards', href: '/flashcards', icon: CreditCard },
  { name: 'Tutor', href: '/tutor', icon: MessageSquare },
  { name: 'Translate', href: '/translate', icon: Languages },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full glass-card rounded-none lg:rounded-r-2xl border-l-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold gradient-text">StudyGenie</h1>
                <p className="text-xs text-muted-foreground">AI Study Assistant</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-lg glow-effect"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
                onClick={() => {
                  // Close sidebar on mobile when item is clicked
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass-card p-4 rounded-xl">
              <p className="text-xs text-center text-muted-foreground">
                Built at <span className="gradient-text font-semibold">SUNHACKS 2025</span>
                <br />
                GenAI Track
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}