"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AIChatBot from '@/components/ai/AIChatBot';
import { BookOpen, PlayCircle, Zap, TrendingUp, CheckCircle } from 'lucide-react'; // Removed RadioButtonUnchecked as it's not used
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data for Education Tab
const mockLearningPaths = [
  {
    id: "lp1",
    title: "Beginner Trader Essentials",
    description: "Understand market basics, technical analysis, and risk management.",
    icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    progress: 60,
    modules: [
      { id: "m1_1", title: "Introduction to Stock Markets", completed: true },
      { id: "m1_2", title: "Basic Chart Patterns", completed: true },
      { id: "m1_3", title: "Understanding Risk vs. Reward", completed: false },
      { id: "m1_4", title: "Introduction to Options Trading", completed: false },
    ]
  },
  {
    id: "lp2",
    title: "Advanced Options Strategies",
    description: "Explore spreads, condors, and volatility trading.",
    icon: <Zap className="w-8 h-8 text-purple-500" />,
    progress: 25,
    modules: [
      { id: "m2_1", title: "Vertical Spreads Explained", completed: true },
      { id: "m2_2", title: "Iron Condors for Income", completed: false },
      { id: "m2_3", title: "Trading Vega and Implied Volatility", completed: false },
    ]
  },
  {
    id: "lp3",
    title: "Day Trading Momentum Stocks",
    description: "Learn to identify and trade fast-moving stocks.",
    icon: <TrendingUp className="w-8 h-8 text-green-500" />,
    progress: 0,
    modules: [
      { id: "m3_1", title: "Scanning for Momentum Plays", completed: false },
      { id: "m3_2", title: "Entry and Exit Tactics", completed: false },
      { id: "m3_3", title: "Managing Risk in Volatile Stocks", completed: false },
    ]
  },
];

const mockMentorRecommendations = [
  "MentorBull: Welcome to the Education Hub, MockUser! I see you're making good progress on 'Beginner Trader Essentials'.",
  "MentorBull: Based on your recent interest in options during our market chats, you might find the 'Advanced Options Strategies' path particularly insightful next.",
  "MentorBull: Remember, consistent learning is key to long-term success. What topic are you curious about today?"
];

// Placeholder for RadioButtonUnchecked if it's needed later or was a typo
const RadioButtonUnchecked = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const EducationPage = () => {
  const [selectedPath, setSelectedPath] = React.useState(mockLearningPaths[0]);

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 md:py-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left">Education Hub</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* MentorBull Interaction & Learning Path Suggestions */}
        <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3 mb-2">
                <img src="/trade_mentor_ai_logo.png" alt="MentorBull Icon" className="w-10 h-10 rounded-full" />
                <CardTitle className="text-xl sm:text-2xl">MentorBull Academy</CardTitle>
            </div>
            <CardDescription>Your AI-guided learning journey.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <AIChatBot 
              aiPersonaName="MentorBull"
              aiPersonaImage="/trade_mentor_ai_logo.png"
              initialMessages={mockMentorRecommendations.map((text, index) => ({
                id: `edu-chat-${index}`,
                sender: 'ai',
                text: text.replace("MentorBull: ", ""),
                timestamp: new Date(Date.now() - (mockMentorRecommendations.length - index) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }))}
              contextualPrompt="What would you like to learn or review today?"
              showUserInput={true}
              containerClassName="h-[250px] sm:h-full"
            />
          </CardContent>
        </Card>

        {/* Learning Paths & Content Display */}
        <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl">Your Learning Paths</CardTitle>
            <CardDescription>Explore curated content to enhance your trading skills.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLearningPaths.map(path => (
                <button 
                  key={path.id} 
                  onClick={() => setSelectedPath(path)}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${selectedPath?.id === path.id ? 'bg-primary/10 border-primary shadow-md' : 'bg-card hover:bg-accent/50 border-border/60'}`}
                >
                  <div className="flex items-center mb-2">
                    {path.icon}
                    <h3 className="ml-3 font-semibold text-md text-foreground">{path.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-tight">{path.description}</p>
                  <Progress value={path.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{path.progress}% complete</p>
                </button>
              ))}
            </div>
            
            {selectedPath && (
              <div className="mt-6 pt-6 border-t border-border/60">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Modules in: {selectedPath.title}</h3>
                <ScrollArea className="h-[200px] sm:h-[250px] w-full rounded-md border border-border/60 p-3 bg-muted/20">
                  {selectedPath.modules.map(module => (
                    <div key={module.id} className="p-3 mb-2 border-b border-border/40 last:border-b-0 bg-card rounded-md shadow-sm flex items-center justify-between hover:bg-accent/30 transition-colors">
                      <div className="flex items-center">
                        {module.completed ? <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> : <RadioButtonUnchecked className="w-5 h-5 mr-2 text-muted-foreground" />}
                        <span className={`text-sm ${module.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{module.title}</span>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        {module.completed ? 'Review' : 'Start'}
                        <PlayCircle className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
                <div className="mt-4 p-4 bg-muted/40 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Content for selected module will appear here.</p>
                  <p className="text-xs text-muted-foreground">(Video player, article text, or quiz placeholder)</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationPage;

