"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AIChatBot from '@/components/ai/AIChatBot';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, BookOpen, MessageSquare, Edit, Lightbulb, Award, ListChecks, Info } from 'lucide-react';
import ThemeAwareLogo from '@/components/ui/ThemeAwareLogo';
import { Badge } from "@/components/ui/badge";

interface LoggedTrade {
  id: string;
  security: string;
  type: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  status: "Open" | "Closed";
  outcome?: "Win" | "Loss" | "Breakeven";
  notes?: string;
  emotion?: string;
  tags?: string[];
}

const mockLoggedTradesForReview: LoggedTrade[] = [
  { id: "t1", security: "AAPL", type: "Buy", entryPrice: 169.50, exitPrice: 171.00, quantity: 10, pnl: 15.00, status: "Closed", outcome: "Win", notes: "Good entry on support, followed plan.", emotion: "Confident", tags: ["Support Play", "Followed Plan"] },
  { id: "t2", security: "TSLA", type: "Sell Short", entryPrice: 192.00, exitPrice: 195.00, quantity: 5, pnl: -15.00, status: "Closed", outcome: "Loss", notes: "Held too long, didn't respect stop. Revenge traded after initial small loss.", emotion: "Frustrated", tags: ["Over-held", "Stop Ignored", "Revenge Trade"] },
  { id: "t3", security: "NVDA", type: "Buy Call", entryPrice: 2.50, exitPrice: 3.50, quantity: 3, pnl: 300.00, status: "Closed", outcome: "Win", notes: "Caught the momentum play perfectly. Scaled out too early.", emotion: "Excited", tags: ["Momentum", "Scaled Out Early"] },
  { id: "t4", security: "MSFT", type: "Buy", entryPrice: 420.00, quantity: 5, status: "Open", notes: "New position based on earnings expectation.", emotion: "Hopeful" },
];

interface PostMarketRoutineItem {
  id: string;
  text: string;
  details: string;
  completed: boolean;
  defaultPrompt: string;
}

const initialPostMarketRoutine: PostMarketRoutineItem[] = [
  { id: "pmr1", text: "Review All Trades Taken Today", details: "Analyze each trade (winners and losers) – entry, exit, management, and outcome.", completed: false, defaultPrompt: "Caddie, let's start reviewing my trades from today. What's the best way to approach this analysis for each trade?" },
  { id: "pmr2", text: "Identify Winning/Losing Patterns", details: "Note any recurring patterns in successful trades or mistakes made.", completed: false, defaultPrompt: "Caddie, help me identify any winning or losing patterns from my trading activity today. What should I look for?" },
  { id: "pmr3", text: "Evaluate Performance vs. Trading Plan", details: "Did you follow your rules? Where did you deviate?", completed: false, defaultPrompt: "Caddie, how can I objectively evaluate my performance today against my trading plan? What are key questions to ask myself?" },
  { id: "pmr4", text: "Update Trade Journal", details: "Ensure all trades are logged with detailed notes, screenshots, and reflections.", completed: false, defaultPrompt: "Caddie, what are the essential elements I must include in my trade journal for today's trades to make it most effective for learning?" },
  { id: "pmr5", text: "Analyze Overall Market Conditions", details: "Review the day's market action, key moves, and any changes in sentiment.", completed: false, defaultPrompt: "Caddie, can you help me summarize the overall market conditions and key themes from today's session?" },
  { id: "pmr6", text: "Adjust Holdings (if applicable)", details: "Make any necessary adjustments to swing or longer-term positions based on the day's close.", completed: false, defaultPrompt: "Caddie, based on today's market close, what factors should I consider when deciding whether to adjust my swing or longer-term holdings?" },
  { id: "pmr7", text: "Update Watchlist", details: "Add/remove symbols, refine price levels of interest based on today's action.", completed: false, defaultPrompt: "Caddie, what's a good process for updating my watchlist after today's market action? What criteria should I use?" },
  { id: "pmr8", text: "Plan for Tomorrow", details: "Note key levels, potential setups, and any adjustments to your strategy for the next trading day.", completed: false, defaultPrompt: "Caddie, let's start planning for tomorrow. What are the key things I should focus on based on today's post-market analysis?" },
  { id: "pmr9", text: "Continue Learning", details: "Review educational material, read market analysis, or research specific concepts related to the day's trading.", completed: false, defaultPrompt: "Caddie, can you suggest some learning resources or topics that would be relevant based on my trading activity and the market today?" },
];

const PostMarketPage = () => {
  const [tradesForReview, setTradesForReview] = useState<LoggedTrade[]>(mockLoggedTradesForReview);
  const [selectedTradeForDiscussion, setSelectedTradeForDiscussion] = useState<LoggedTrade | null>(null);
  const [postMarketRoutine, setPostMarketRoutine] = useState<PostMarketRoutineItem[]>(initialPostMarketRoutine);
  const [aiCommentary, setAiCommentary] = useState<string | null>(null);
  const [lastCommentaryFetchTime, setLastCommentaryFetchTime] = useState<number>(0);

  const [chatKey, setChatKey] = useState(`postmarket-general-${Date.now()}`);
  const [initialMessageForAI, setInitialMessageForAI] = useState<string | undefined>("The market is closed! I'm your Trade Caddie. It's time for our Post-Market Debrief. Let's turn today's experiences into tomorrow's edge. You can start with the checklist, discuss a trade, or ask for an overall summary.");
  const [isChatReady, setIsChatReady] = useState(false);

  useEffect(() => {
    setIsChatReady(true);
  }, []);

  const fetchAiCommentary = useCallback(async () => {
    console.log("Attempting to fetch AI post-market commentary...");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Provide a brief, insightful tip or reflection point for a day trader who is now in their post-market analysis session. Keep it concise (1-2 sentences).",
          history: [] 
        }),
      });
      if (!response.ok) {
        throw new Error(`AI commentary request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.response) {
        setAiCommentary(data.response);
        setLastCommentaryFetchTime(Date.now());
        console.log("AI Post-Market Commentary fetched: ", data.response);
      } else if (data.error) {
        console.error("Error in AI commentary response:", data.error);
        setAiCommentary("Caddie is thinking... (Error fetching commentary)");
      }
    } catch (error) {
      console.error("Failed to fetch AI post-market commentary:", error);
      setAiCommentary("Could not fetch post-market commentary at this time.");
    }
  }, []);

  useEffect(() => {
    const commentaryInterval = 30 * 60 * 1000; // 30 minutes, can be adjusted for post-market
    if (Date.now() - lastCommentaryFetchTime > commentaryInterval) {
        fetchAiCommentary();
    }
    const timerId = setInterval(() => {
        fetchAiCommentary();
    }, commentaryInterval);
    return () => clearInterval(timerId);
  }, [fetchAiCommentary, lastCommentaryFetchTime]);

  const handleSelectTradeForDiscussion = (trade: LoggedTrade) => {
    setSelectedTradeForDiscussion(trade);
    let prompt = `Let's discuss my ${trade.security} ${trade.type} trade. `;
    if (trade.status === "Closed") {
      prompt += `It was a ${trade.outcome} with a P&L of $${trade.pnl?.toFixed(2)}. Entry: $${trade.entryPrice.toFixed(2)}, Exit: $${trade.exitPrice?.toFixed(2)}.`;
    } else {
      prompt += `It's currently an open position. Entry: $${trade.entryPrice.toFixed(2)}.`;
    }
    if(trade.notes) prompt += ` My notes: \"${trade.notes}\".`;
    if(trade.emotion) prompt += ` I felt: ${trade.emotion}.`;
    prompt += ` What are your key takeaways from this trade? What went well, and what could be improved? I'm here to help you analyze it objectively with AI insights.`;
    
    setInitialMessageForAI(prompt);
    setChatKey(`postmarket-trade-${trade.id}-${Date.now()}`);
  };

  const requestOverallSummary = () => {
    let closedTrades = tradesForReview.filter(t => t.status === "Closed");
    let overallPnl = closedTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
    let winCount = closedTrades.filter(t => t.outcome === "Win").length;
    let lossCount = closedTrades.filter(t => t.outcome === "Loss").length;
    let summaryPrompt = `Okay, let's look at the big picture for my closed trades today. I had ${closedTrades.length} closed trades. ${winCount} wins and ${lossCount} losses, with a net P&L of $${overallPnl.toFixed(2)}. What are your overall reflections on the day based on these results? What patterns do you notice in my execution or psychology? I can help analyze this with you.`;
    
    setInitialMessageForAI(summaryPrompt);
    setChatKey(`postmarket-summary-${Date.now()}`);
    setSelectedTradeForDiscussion(null); 
  };

  const handleRoutineItemToggle = (itemId: string) => {
    setPostMarketRoutine(prevRoutine =>
      prevRoutine.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAskCaddieForRoutine = (prompt: string) => {
    setInitialMessageForAI(prompt);
    setChatKey(`postmarket-routine-${Date.now()}`);
  };

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 md:py-6 space-y-6 text-foreground">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <BookOpen size={32} className="text-primary"/>
            <CardTitle className="text-2xl sm:text-3xl text-primary">Trade Caddie: Post-Market Debrief</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Reflect, learn, and improve with your AI trading mentor. Let's analyze today's performance to build tomorrow's success.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: AI Chat & Routine Checklist */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-background/70 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center"><MessageSquare size={22} className="mr-2"/>Caddie's Review Corner</CardTitle>
                  <CardDescription className="text-muted-foreground">Let's break down your trades and decisions.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {isChatReady && (
                    <AIChatBot
                        key={chatKey}
                        conversationId={chatKey}
                        aiPersonaName="Trade Caddie (Post-Market)"
                        aiPersonaImageComponent ={
                            <ThemeAwareLogo 
                                alt="Trade Caddie AI Persona" 
                                width={40} 
                                height={40} 
                                className="rounded-full object-contain mr-2"
                            />
                        }
                        initialMessage={initialMessageForAI}
                        showUserInput={true}
                        containerClassName="h-[400px] sm:h-full"
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-background/70 border border-border rounded-lg">
                <CardHeader className="pb-3 border-b border-border">
                    <CardTitle className="text-xl font-medium flex items-center text-primary"><ListChecks size={22} className="mr-2 text-primary"/>Post-Market Routine</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">Your checklist for a thorough post-market analysis.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    <ScrollArea className="h-[300px]">
                        {postMarketRoutine.map(item => (
                            <div key={item.id} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-md border border-border/50 mb-2">
                                <Checkbox 
                                    id={`routine-${item.id}`} 
                                    checked={item.completed} 
                                    onCheckedChange={() => handleRoutineItemToggle(item.id)}
                                    className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                                <div className="flex-grow">
                                    <label htmlFor={`routine-${item.id}`} className={`font-medium text-foreground ${item.completed ? 'line-through text-muted-foreground' : ''}`}>{item.text}</label>
                                    <p className={`text-xs text-muted-foreground ${item.completed ? 'line-through' : ''}`}>{item.details}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleAskCaddieForRoutine(item.defaultPrompt)} className="ml-auto text-primary border-primary hover:bg-primary/10">Ask Caddie</Button>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
              </Card>
              
              {aiCommentary && (
                <Card className="bg-background/70 border-primary/50 rounded-lg border-l-4">
                    <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-lg font-medium flex items-center text-primary"><Info size={20} className="mr-2"/>Caddie's Reflection Point</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                        <p className="text-sm text-foreground">{aiCommentary}</p>
                    </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Trade Review & Learning */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-background/70">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Today's Trades for Review</CardTitle>
                  <CardDescription className="text-muted-foreground">Select a trade to discuss with your Caddie, or request an overall summary.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={requestOverallSummary} variant="outline" className="mb-3 w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                    <Award size={16} className="mr-2"/>Discuss Overall Day Performance
                  </Button>
                  <ScrollArea className="h-[250px] w-full rounded-md border border-border p-3 bg-muted/20">
                    {tradesForReview.length > 0 ? tradesForReview.map(trade => (
                      <div 
                        key={trade.id} 
                        className={`p-3 mb-2 border-b border-border last:border-b-0 bg-card rounded-md shadow-sm hover:bg-accent/30 transition-colors cursor-pointer ${selectedTradeForDiscussion?.id === trade.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleSelectTradeForDiscussion(trade)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <span className="font-semibold text-base text-foreground">{trade.security} ({trade.type})</span>
                            {trade.status === "Closed" && trade.outcome === "Win" && 
                              <CheckCircle size={18} className="ml-2 text-green-500 dark:text-green-400" />}
                            {trade.status === "Closed" && trade.outcome === "Loss" && 
                              <XCircle size={18} className="ml-2 text-red-500 dark:text-red-400" />}
                             {trade.status === "Open" && <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">(Open)</span>}
                          </div>
                          {trade.status === "Closed" && trade.pnl !== undefined && (
                            <span className={`font-semibold text-sm ${trade.pnl >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                              ${trade.pnl.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Entry: ${trade.entryPrice.toFixed(2)} {trade.status === "Closed" && trade.exitPrice ? `| Exit: $${trade.exitPrice.toFixed(2)}` : ""} | Qty: {trade.quantity}</p>
                        {trade.tags && trade.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                                {trade.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                            </div>
                        )}
                        {selectedTradeForDiscussion?.id === trade.id && (
                            <p className="text-xs mt-1.5 text-primary italic">Discussing this trade with your Caddie now...</p>
                        )}
                      </div>
                    )) : <p className="text-sm text-muted-foreground text-center py-4">No trades logged for review today. Let's make sure to log them tomorrow!</p>}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-background/70">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center"><Lightbulb size={22} className="mr-2"/>Caddie's Key Learnings & Next Steps</CardTitle>
                  <CardDescription className="text-muted-foreground">Actionable insights from today to prepare for tomorrow. AI will populate this based on your chat.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/30 rounded-lg space-y-3 min-h-[100px]">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                      {/* This would be dynamically updated based on AI chat in a real app */}
                      Key Learning: Patience in waiting for A+ setups is crucial. Avoided FOMO on a choppy day.
                      Next Step: Review watchlist for potential gap plays tomorrow morning. Focus on sectors showing relative strength.
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostMarketPage;

