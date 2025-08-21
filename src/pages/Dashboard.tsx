import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Trophy, 
  Target, 
  Calendar, 
  Clock, 
  BookOpen, 
  Brain, 
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { gsap } from 'gsap';

interface StudyData {
  subject: string;
  progress: number;
  timeSpent: number;
  quizzesCompleted: number;
  accuracy: number;
}

const mockStudyData: StudyData[] = [
  { subject: 'Mathematics', progress: 85, timeSpent: 245, quizzesCompleted: 12, accuracy: 88 },
  { subject: 'Science', progress: 72, timeSpent: 198, quizzesCompleted: 9, accuracy: 91 },
  { subject: 'History', progress: 93, timeSpent: 156, quizzesCompleted: 15, accuracy: 85 },
  { subject: 'Literature', progress: 67, timeSpent: 132, quizzesCompleted: 7, accuracy: 79 },
  { subject: 'Geography', progress: 78, timeSpent: 89, quizzesCompleted: 5, accuracy: 94 }
];

const weeklyActivity = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 62 },
  { day: 'Wed', minutes: 38 },
  { day: 'Thu', minutes: 55 },
  { day: 'Fri', minutes: 71 },
  { day: 'Sat', minutes: 28 },
  { day: 'Sun', minutes: 40 }
];

const achievements = [
  { id: 1, title: 'Quiz Master', description: 'Completed 10 quizzes', icon: '🏆', unlocked: true },
  { id: 2, title: 'Speed Reader', description: 'Read 50 summaries', icon: '⚡', unlocked: true },
  { id: 3, title: 'Polyglot', description: 'Translated to 5 languages', icon: '🌍', unlocked: true },
  { id: 4, title: 'Study Streak', description: 'Studied 7 days in a row', icon: '🔥', unlocked: false },
  { id: 5, title: 'Flash Master', description: 'Created 100 flashcards', icon: '💡', unlocked: false },
  { id: 6, title: 'AI Tutor', description: 'Asked 25 questions', icon: '🤖', unlocked: true }
];

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);
  const chartsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Animate progress bars
    statsRef.current.forEach((ref, index) => {
      if (ref) {
        const progressBar = ref.querySelector('.progress-bar');
        if (progressBar) {
          gsap.fromTo(progressBar,
            { width: '0%' },
            { width: `${mockStudyData[index]?.progress || 0}%`, duration: 1.5, delay: 0.5, ease: "power2.out" }
          );
        }
      }
    });

    // Animate charts
    chartsRef.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref,
          { height: '0px' },
          { 
            height: `${(weeklyActivity[index]?.minutes || 0) * 2}px`, 
            duration: 1, 
            delay: 1 + index * 0.1, 
            ease: "power2.out" 
          }
        );
      }
    });
  }, []);

  const totalStudyTime = mockStudyData.reduce((acc, data) => acc + data.timeSpent, 0);
  const totalQuizzes = mockStudyData.reduce((acc, data) => acc + data.quizzesCompleted, 0);
  const averageAccuracy = Math.round(mockStudyData.reduce((acc, data) => acc + data.accuracy, 0) / mockStudyData.length);
  const studyStreak = 5;

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-3">Progress Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Track your learning journey and celebrate achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
            <p className="text-xs text-muted-foreground">+2.5h from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <Trophy className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">+8 from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{averageAccuracy}%</div>
            <p className="text-xs text-muted-foreground">+3% from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{studyStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Progress */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Subject Progress</span>
            </CardTitle>
            <CardDescription>Your progress across different subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockStudyData.map((subject, index) => (
              <div key={subject.subject} ref={el => statsRef.current[index] = el!}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                </div>
                <div className="relative">
                  <Progress value={0} className="w-full h-3" />
                  <div 
                    className="progress-bar absolute top-0 left-0 h-3 bg-gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: '0%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{subject.timeSpent} min studied</span>
                  <span>{subject.accuracy}% accuracy</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Weekly Activity</span>
            </CardTitle>
            <CardDescription>Minutes studied each day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-40 space-x-2">
              {weeklyActivity.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center flex-1">
                  <div 
                    ref={el => chartsRef.current[index] = el!}
                    className="bg-gradient-secondary rounded-t-lg w-full min-h-[4px]"
                    style={{ height: '0px' }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                  <span className="text-xs font-medium">{day.minutes}m</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Your learning milestones and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`glass-card p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                  achievement.unlocked ? 'glow-effect' : 'opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="bg-gradient-accent text-accent-foreground">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Heatmap */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Knowledge Heatmap</span>
          </CardTitle>
          <CardDescription>Visual representation of your study patterns over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 100 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-sm ${
                  Math.random() > 0.7 
                    ? 'bg-primary' 
                    : Math.random() > 0.4 
                    ? 'bg-primary/60' 
                    : Math.random() > 0.2 
                    ? 'bg-primary/30' 
                    : 'bg-muted'
                }`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
            <span>Less active</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-muted rounded-sm"></div>
              <div className="w-3 h-3 bg-primary/30 rounded-sm"></div>
              <div className="w-3 h-3 bg-primary/60 rounded-sm"></div>
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
            </div>
            <span>More active</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
              <BookOpen className="w-8 h-8 text-accent mb-2" />
              <h4 className="font-medium mb-1">Resume Mathematics</h4>
              <p className="text-sm text-muted-foreground">Continue where you left off</p>
            </div>
            <div className="glass-card p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
              <Brain className="w-8 h-8 text-accent mb-2" />
              <h4 className="font-medium mb-1">Practice Quiz</h4>
              <p className="text-sm text-muted-foreground">Test your knowledge</p>
            </div>
            <div className="glass-card p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
              <Target className="w-8 h-8 text-accent mb-2" />
              <h4 className="font-medium mb-1">Review Flashcards</h4>
              <p className="text-sm text-muted-foreground">Strengthen memory</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}