import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between p-4 glass-card border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-lg">📚</span>
          </div>
          <h1 className="text-lg font-semibold gradient-text">StudyGenie</h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main content */}
        <main className="flex-1">
          <div className="h-full p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}