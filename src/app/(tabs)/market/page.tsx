"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import AIChatBot from '@/components/ai/AIChatBot';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CandlestickChart, MessageCircle, Edit3, Zap, TrendingUp, Brain, ListChecks, Info } from 'lucide-react';
import ThemeAwareLogo from '@/components/ui/ThemeAwareLogo';

// Placeholder for TradingView Chart
const TradingViewChartPlaceholder = () => {
  return (
    <div className="w-full h-[350px] sm:h-[450px] bg-muted/30 border border-border rounded-lg flex items-center justify-center shadow-inner">
      <div className="text-center">
        <CandlestickChart size={48} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground font-medium">Live Chart Area</p>
        <p className="text-xs text-muted-foreground">(TradingView Integration Pending)</p>
      </div>
    </div>
  );
};

interface TradeIdea {
  id: string;
  type: "Stock" | "Option";
  security: string;
  idea: string;
  rationale?: string;
  source: string;
  timestamp: string;
  urgency?: "High" | "Medium" | "Low";
}

const mockTradeIdeas: TradeIdea[] = [
  { id: "1", type: "Stock", security: "AAPL", idea: "AAPL showing relative strength, potential for upside if market holds.", rationale: "Holding above key moving averages.", source: "Caddie Scan", timestamp: "9:45 AM", urgency: "Medium" },
  { id: "2", type: "Option", security: "QQQ", idea: "Consider 0DTE QQQ calls if key resistance breaks.", rationale: "High volatility expected today.", source: "Caddie Scan", timestamp: "10:02 AM", urgency: "High" },
  { id: "3", type: "Stock", security: "NVDA", idea: "NVDA consolidating, watch for breakout or breakdown.", rationale: "Recent news catalyst, volume increasing.", source: "Caddie Scan", timestamp: "10:15 AM", urgency: "Medium" },
];

interface LoggedTrade {
  id: string;
  security: string;
  type: string;
  entryPrice: number;
  quantity: number;
  status: "Open" | "Closed";
  currentPrice?: number;
  exitPrice?: number;
  pnl?: number;
}

const mockLoggedTrades: LoggedTrade[] = [];

interface MarketRoutineItem {
  id: string;
  text: string;
  details: string;
  completed: boolean;
  defaultPrompt: string;
}

const initialMarketRoutine: MarketRoutineItem[] = [
  { id: "mr1", text: "Review Account Balance & Open Positions", details: "Check current buying power, margin, and status of any open trades.", completed: false, defaultPrompt: "Caddie, can you give me a quick overview of what to look for when reviewing my account balance and open positions during the market session?" },
  { id: "mr2", text: "Assess Current Market Trend", details: "Observe overall market direction (e.g., S&P 500, Nasdaq) and sector trends.", completed: false, defaultPrompt: "Caddie, what are the key indicators for assessing the current market trend right now?" },
  { id: "mr3", text: "Monitor Key Support/Resistance Levels", details: "Watch price action around pre-identified significant levels for your watched assets.", completed: false, defaultPrompt: "Caddie, how should I effectively monitor key support and resistance levels for my watchlist during active trading?" },
  { id: "mr4", text: "Scan for Entry/Exit Signals", details: "Look for trade setups based on your strategy (e.g., breakouts, pullbacks, indicator signals).", completed: false, defaultPrompt: "Caddie, what are some common entry and exit signals I should be scanning for based on typical day trading strategies?" },
  { id: "mr5", text: "Manage Active Trades", details: "Monitor open positions, adjust stop-losses if necessary according to your plan, consider taking profits.", completed: false, defaultPrompt: "Caddie, can you provide some best practices for managing active trades, especially regarding stop-losses and profit-taking?" },
  { id: "mr6", text: "Log New Trades", details: "Record details of any new trades taken (entry price, size, stop-loss, rationale).", completed: false, defaultPrompt: "Caddie, what are the most crucial details to include when logging a new trade for effective post-market review?" },
  { id: "mr7", text: "Stay Aware of News/Events", details: "Keep an eye on any breaking news or economic releases that could impact the market or your positions.", completed: false, defaultPrompt: "Caddie, what are reliable sources or methods for staying aware of market-moving news and events during the trading day?" },
  { id: "mr8", text: "Maintain Trading Psychology", details: "Stick to your trading plan, avoid emotional decisions, take breaks if needed.", completed: false, defaultPrompt: "Caddie, what are some practical tips for maintaining good trading psychology and avoiding emotional decisions when the market is active?" },
];

const MarketPage = () => {
  const [tradeIdeaType, setTradeIdeaType] = useState<"All" | "Stock" | "Option">("All");
  const [tradeSecurityInput, setTradeSecurityInput] = useState("");
  const [loggedTrades, setLoggedTrades] = useState<LoggedTrade[]>(mockLoggedTrades);
  const [newTrade, setNewTrade] = useState({ security: "", type: "Buy", entryPrice: "", quantity: "" });
  const [marketRoutine, setMarketRoutine] = useState<MarketRoutineItem[]>(initialMarketRoutine);
  const [aiCommentary, setAiCommentary] = useState<string | null>(null);
  const [lastCommentaryFetchTime, setLastCommentaryFetchTime] = useState<number>(0);

  const [chatKey, setChatKey] = useState(`market-general-${Date.now()}`);
  const [initialMessageForAI, setInitialMessageForAI] = useState<string | undefined>("Welcome to Market Central! I'm your Trade Caddie, powered by live AI. The market is open! How can I assist you? We can look for trade ideas, discuss market sentiment, or log your trades.");
  const [isChatReady, setIsChatReady] = useState(false);

  useEffect(() => {
    setIsChatReady(true);
  }, []);

  const fetchAiCommentary = useCallback(async () => {
    console.log("Attempting to fetch AI commentary...");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Provide a brief, relevant market insight or tip for a day trader who is currently in their market session. Keep it concise (1-2 sentences).",
          history: [] // No history needed for general commentary
        }),
      });
      if (!response.ok) {
        throw new Error(`AI commentary request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.response) {
        setAiCommentary(data.response);
        setLastCommentaryFetchTime(Date.now());
        console.log("AI Commentary fetched: ", data.response);
      } else if (data.error) {
        console.error("Error in AI commentary response:", data.error);
        setAiCommentary("Caddie is thinking... (Error fetching commentary)");
      }
    } catch (error) {
      console.error("Failed to fetch AI commentary:", error);
      setAiCommentary("Could not fetch market commentary at this time.");
    }
  }, []);

  useEffect(() => {
    const commentaryInterval = 30 * 60 * 1000; // 30 minutes
    // Fetch initial commentary
    if (Date.now() - lastCommentaryFetchTime > commentaryInterval) {
        fetchAiCommentary();
    }
    const timerId = setInterval(() => {
        fetchAiCommentary();
    }, commentaryInterval);
    return () => clearInterval(timerId);
  }, [fetchAiCommentary, lastCommentaryFetchTime]);

  const handleLogTrade = () => {
    if (newTrade.security && newTrade.entryPrice && newTrade.quantity) {
      const newEntry: LoggedTrade = {
        id: `t${Date.now()}`,
        security: newTrade.security,
        type: newTrade.type,
        entryPrice: parseFloat(newTrade.entryPrice),
        quantity: parseInt(newTrade.quantity),
        status: "Open",
        currentPrice: parseFloat(newTrade.entryPrice),
        pnl: 0.00
      };
      setLoggedTrades(prevTrades => [newEntry, ...prevTrades]);
      setNewTrade({ security: "", type: "Buy", entryPrice: "", quantity: "" });

      const logContextPrompt = `I've just logged a trade: ${newEntry.quantity} of ${newEntry.security} (${newEntry.type}) at $${newEntry.entryPrice}. What are your initial thoughts on this trade given the current market? Or what should I be mindful of?`;
      setInitialMessageForAI(logContextPrompt);
      setChatKey(`market-log-trade-${newEntry.id}-${Date.now()}`);
    }
  };

  const filteredTradeIdeas = mockTradeIdeas.filter(idea =>
    (tradeIdeaType === "All" || idea.type === tradeIdeaType) &&
    (tradeSecurityInput === "" || idea.security.toLowerCase().includes(tradeSecurityInput.toLowerCase()))
  );

  const handleTradeIdeaDiscuss = (idea: TradeIdea) => {
    const discussContextPrompt = `Let's discuss this trade idea: ${idea.type} for ${idea.security} - "${idea.idea}". The rationale is: "${idea.rationale || 'N/A'}". What are your detailed thoughts on this, including potential risks, rewards, and entry/exit strategies?`;
    setInitialMessageForAI(discussContextPrompt);
    setChatKey(`market-discuss-idea-${idea.id}-${Date.now()}`);
  };

  const handleGeneralMarketQuery = () => {
    setInitialMessageForAI("What's your current take on the overall market sentiment today? Any key levels or news events I should be aware of for major indices like SPY or QQQ?");
    setChatKey(`market-general-query-${Date.now()}`);
  };

  const handleRoutineItemToggle = (itemId: string) => {
    setMarketRoutine(prevRoutine =>
      prevRoutine.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAskCaddieForRoutine = (prompt: string) => {
    setInitialMessageForAI(prompt);
    setChatKey(`market-routine-${Date.now()}`);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:py-8 space-y-8 text-foreground">
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card border border-border rounded-lg">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp size={28} className="text-primary"/>
            </div>
            <div>
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-primary">Trade Caddie: Market Central</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                    Your AI partner for live market action, trade ideas, and in-market guidance. Let's navigate together!
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Chart, Trade Journal, and In-Market Routine */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-background/70 border border-border rounded-lg">
                        <CardHeader className="pb-3 border-b border-border">
                            <CardTitle className="text-xl font-medium flex items-center text-primary"><CandlestickChart size={24} className="mr-2 text-primary"/>Live Market Chart</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">Real-time price action. (TradingView Integration Pending)</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            <TradingViewChartPlaceholder />
                        </CardContent>
                    </Card>

                    <Card className="bg-background/70 border border-border rounded-lg">
                        <CardHeader className="pb-3 border-b border-border">
                            <CardTitle className="text-xl font-medium flex items-center text-primary"><ListChecks size={22} className="mr-2 text-primary"/>In-Market Routine</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">Your checklist for navigating the active market session.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {marketRoutine.map(item => (
                                <div key={item.id} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-md border border-border/50">
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
                        </CardContent>
                    </Card>
                    
                    {aiCommentary && (
                        <Card className="bg-background/70 border-primary/50 rounded-lg border-l-4">
                            <CardHeader className="pb-2 pt-3">
                                <CardTitle className="text-lg font-medium flex items-center text-primary"><Info size={20} className="mr-2"/>Caddie's Market Pulse</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3 pt-0">
                                <p className="text-sm text-foreground">{aiCommentary}</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="bg-background/70 border border-border rounded-lg">
                        <CardHeader className="pb-3 border-b border-border">
                            <CardTitle className="text-xl font-medium flex items-center text-primary"><Edit3 size={22} className="mr-2 text-primary"/>Your Trade Journal</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">Log your trades. Your Caddie will help analyze them post-market.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 items-end">
                                <Input placeholder="Symbol" value={newTrade.security} onChange={(e) => setNewTrade({...newTrade, security: e.target.value.toUpperCase()})} className="bg-input text-foreground placeholder:text-muted-foreground rounded-md" />
                                <Select value={newTrade.type} onValueChange={(value) => setNewTrade({...newTrade, type: value as string}) }>
                                <SelectTrigger className="bg-input text-foreground rounded-md"><SelectValue placeholder="Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Buy">Buy Long</SelectItem>
                                    <SelectItem value="Sell Short">Sell Short</SelectItem>
                                    <SelectItem value="Buy Call">Buy Call</SelectItem>
                                    <SelectItem value="Sell Call">Sell Call</SelectItem>
                                    <SelectItem value="Buy Put">Buy Put</SelectItem>
                                    <SelectItem value="Sell Put">Sell Put</SelectItem>
                                </SelectContent>
                                </Select>
                                <Input type="number" placeholder="Entry Price" value={newTrade.entryPrice} onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})} className="bg-input text-foreground placeholder:text-muted-foreground rounded-md" />
                                <Input type="number" placeholder="Quantity" value={newTrade.quantity} onChange={(e) => setNewTrade({...newTrade, quantity: e.target.value})} className="bg-input text-foreground placeholder:text-muted-foreground rounded-md" />
                                <Button onClick={handleLogTrade} className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-md btn-primary-glow">Log Trade</Button>
                            </div>
                            <h3 className="text-md font-semibold mb-2 mt-6 text-foreground">Recent Trades:</h3>
                            <ScrollArea className="h-[160px] w-full rounded-md border border-border bg-muted/20 p-1">
                                <Table>
                                <TableHeader>
                                    <TableRow className="border-b-border">
                                    <TableHead className="text-foreground font-semibold">Symbol</TableHead>
                                    <TableHead className="text-foreground font-semibold">Type</TableHead>
                                    <TableHead className="text-right text-foreground font-semibold">Entry</TableHead>
                                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                                    <TableHead className="text-right text-foreground font-semibold">PnL</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loggedTrades.map(trade => (
                                    <TableRow key={trade.id} className="hover:bg-accent/10 transition-colors border-b-border">
                                        <TableCell className="font-medium text-foreground py-3">{trade.security}</TableCell>
                                        <TableCell className="text-foreground py-3">{trade.type}</TableCell>
                                        <TableCell className="text-right text-foreground py-3">${trade.entryPrice.toFixed(2)}</TableCell>
                                        <TableCell className="py-3"><Badge variant={trade.status === "Open" ? "outline" : "secondary"} className={`font-medium ${trade.status === "Open" ? "border-primary text-primary" : "bg-secondary text-secondary-foreground"}`}>{trade.status}</Badge></TableCell>
                                        <TableCell className={`text-right font-semibold py-3 ${trade.pnl && trade.pnl >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{trade.pnl ? (trade.pnl >=0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`) : '-'}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                                {loggedTrades.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No trades logged yet. Your Caddie can help you find opportunities!</p>}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: AI Chat and Trade Radar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card border border-border rounded-lg h-full">
                        <CardHeader className="pb-3 border-b border-border">
                            <CardTitle className="text-xl font-medium flex items-center text-primary"><MessageCircle size={22} className="mr-2 text-primary"/>Chat with your Caddie</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">Your AI assistant for market hours. Ask anything!</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col p-4">
                            {isChatReady && (
                                <AIChatBot
                                    key={chatKey} // Force re-render with new initial message
                                    conversationId={chatKey} // Unique ID for conversation context
                                    initialMessage={initialMessageForAI}
                                    aiPersonaName="Trade Caddie (Market)"
                                    aiPersonaImageComponent ={
                                        <ThemeAwareLogo
                                            alt="Trade Caddie AI Persona"
                                            width={40}
                                            height={40}
                                            className="rounded-full object-contain mr-2"
                                        />
                                    }
                                    showUserInput={true}
                                    containerClassName="h-[350px] sm:h-full flex-grow"
                                />
                            )}
                        </CardContent>
                    </Card>
                    <Card className="bg-background/70 border border-border rounded-lg">
                        <CardHeader className="pb-3 border-b border-border">
                            <CardTitle className="text-xl font-medium flex items-center text-primary"><Zap size={22} className="mr-2 text-primary"/>Caddie's Trade Radar</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">Potential opportunities based on Caddie's scans. (Illustrative)</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <ToggleGroup type="single" defaultValue="All" value={tradeIdeaType} onValueChange={(value: "All" | "Stock" | "Option") => value && setTradeIdeaType(value)} className="w-full sm:w-auto">
                                    <ToggleGroupItem value="All" aria-label="All types" className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary">All</ToggleGroupItem>
                                    <ToggleGroupItem value="Stock" aria-label="Stocks only" className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary">Stocks</ToggleGroupItem>
                                    <ToggleGroupItem value="Option" aria-label="Options only" className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary">Options</ToggleGroupItem>
                                </ToggleGroup>
                                <Input placeholder="Filter by Symbol (e.g. AAPL)" value={tradeSecurityInput} onChange={(e) => setTradeSecurityInput(e.target.value)} className="flex-grow bg-input text-foreground placeholder:text-muted-foreground rounded-md" />
                            </div>
                            <ScrollArea className="h-[200px] w-full rounded-md border border-border bg-muted/20 p-1">
                                {filteredTradeIdeas.length > 0 ? (
                                    filteredTradeIdeas.map(idea => (
                                        <div key={idea.id} className="p-3 mb-2 rounded-md bg-background/50 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-foreground">{idea.security} <Badge variant="outline" className={`ml-1 text-xs ${idea.type === "Stock" ? "border-blue-500 text-blue-500" : "border-purple-500 text-purple-500"}`}>{idea.type}</Badge></h4>
                                                {idea.urgency && <Badge variant={idea.urgency === "High" ? "destructive" : (idea.urgency === "Medium" ? "warning" : "default")} className="text-xs">{idea.urgency}</Badge>}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{idea.idea}</p>
                                            {idea.rationale && <p className="text-xs text-muted-foreground/80 italic mb-2">Rationale: {idea.rationale}</p>}
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-muted-foreground">Source: {idea.source} @ {idea.timestamp}</p>
                                                <Button variant="ghost" size="sm" onClick={() => handleTradeIdeaDiscuss(idea)} className="text-primary hover:bg-primary/10 h-8 px-2">Discuss <MessageCircle size={14} className="ml-1.5"/></Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-10">No trade ideas matching your criteria. Caddie is always scanning!</p>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPage;

