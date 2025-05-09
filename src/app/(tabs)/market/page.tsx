"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import AIChatBot from '@/components/ai/AIChatBot';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChartHorizontalBig, CandlestickChart, MessageCircle, Edit3 } from 'lucide-react';

// Placeholder for TradingView Chart (to be integrated)
const TradingViewChartPlaceholder = () => {
  return (
    <div className="w-full h-[350px] sm:h-[450px] bg-muted/30 border border-border/60 rounded-lg flex items-center justify-center shadow-inner">
      <div className="text-center">
        <CandlestickChart size={48} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground font-medium">Live Chart Area</p>
        <p className="text-xs text-muted-foreground">(TradingView Integration Pending)</p>
      </div>
    </div>
  );
};

// Mocked data for Market Tab
const mockTradeIdeas = [
  { id: "1", type: "Stock", security: "AAPL", idea: "AAPL showing strong support at $168. Potential bounce towards $175 if market holds.", source: "TA Algo", timestamp: "9:45 AM" },
  { id: "2", type: "Option", security: "QQQ", idea: "0DTE QQQ $430 Calls look attractive if we see a break above $432.50 with volume.", source: "VolFlow AI", timestamp: "10:02 AM" },
  { id: "3", type: "Stock", security: "NVDA", idea: "NVDA consolidating near highs. Watch for a volume-confirmed breakout or a pullback to $880 support.", source: "TrendMaster", timestamp: "10:15 AM" },
  { id: "4", type: "Option", security: "SPY", idea: "SPY Put Spread 505/500 for EOD hedge if market shows weakness at session highs.", source: "RiskGuard AI", timestamp: "10:30 AM" },
];

const mockInMarketThoughts = [
  "Good morning, traders! Market is opening with some mixed signals. Tech seems strong, but watch for broader market confirmation.",
  "Volume is a bit light on the open. Don't get caught in fakeouts. Wait for confirmation.",
  "AAPL is testing its pre-market highs. A break above could see a quick run.",
  "Remember your trading plan. Stick to your entries, exits, and risk management rules.",
  "QQQ 0DTE options are very active. High risk, high reward - manage position sizes accordingly if you're simulating trades."
];

const mockLoggedTrades = [
  { id: "t1", security: "AAPL", type: "Buy", entryPrice: 169.50, quantity: 10, status: "Open", currentPrice: 170.00, pnl: 5.00 },
  { id: "t2", security: "TSLA", type: "Sell Short", entryPrice: 192.00, quantity: 5, status: "Closed", exitPrice: 187.00, pnl: 25.00 },
  { id: "t3", security: "QQQ", type: "Buy Call", entryPrice: 1.20, quantity: 2, status: "Open", currentPrice: 1.50, pnl: 60.00 },
];

const MarketPage = () => {
  const [tradeIdeaType, setTradeIdeaType] = React.useState("All");
  const [tradeSecurityInput, setTradeSecurityInput] = React.useState("");
  const [loggedTrades, setLoggedTrades] = React.useState(mockLoggedTrades);
  const [newTrade, setNewTrade] = React.useState({ security: "", type: "Buy", entryPrice: "", quantity: "" });

  const handleLogTrade = () => {
    if (newTrade.security && newTrade.entryPrice && newTrade.quantity) {
      const newEntry = {
        id: `t${loggedTrades.length + 1}`,
        ...newTrade,
        entryPrice: parseFloat(newTrade.entryPrice),
        quantity: parseInt(newTrade.quantity),
        status: "Open",
        currentPrice: parseFloat(newTrade.entryPrice), // Assume current price is entry price initially
        pnl: 0.00
      };
      setLoggedTrades([newEntry, ...loggedTrades]);
      setNewTrade({ security: "", type: "Buy", entryPrice: "", quantity: "" }); // Reset form
    }
  };

  const filteredTradeIdeas = mockTradeIdeas.filter(idea => 
    (tradeIdeaType === "All" || idea.type === tradeIdeaType) && 
    (tradeSecurityInput === "" || idea.security.toLowerCase().includes(tradeSecurityInput.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 md:py-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left">Market Central</h1>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl flex items-center"><CandlestickChart size={28} className="mr-2 text-primary"/>Live Market Chart</CardTitle>
          <CardDescription>Real-time price action and technical analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <TradingViewChartPlaceholder />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl flex items-center"><BarChartHorizontalBig size={24} className="mr-2 text-primary"/>AI Trade Signals</CardTitle>
            <CardDescription>Potential trade ideas generated by MentorBull.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
              <ToggleGroup type="single" defaultValue="All" value={tradeIdeaType} onValueChange={(value) => {if(value) setTradeIdeaType(value)}} className="w-full sm:w-auto">
                <ToggleGroupItem value="All" aria-label="All types" className="flex-1 sm:flex-initial">All</ToggleGroupItem>
                <ToggleGroupItem value="Stock" aria-label="Stock ideas" className="flex-1 sm:flex-initial">Stocks</ToggleGroupItem>
                <ToggleGroupItem value="Option" aria-label="Option ideas" className="flex-1 sm:flex-initial">Options</ToggleGroupItem>
              </ToggleGroup>
              <Input 
                type="text" 
                placeholder="Filter by Symbol (e.g., QQQ)" 
                value={tradeSecurityInput}
                onChange={(e) => setTradeSecurityInput(e.target.value)}
                className="bg-input text-foreground placeholder:text-muted-foreground flex-grow"
              />
            </div>
            <ScrollArea className="h-[200px] sm:h-[250px] w-full rounded-md border border-border/60 p-3 bg-muted/20 flex-grow">
              {filteredTradeIdeas.length > 0 ? filteredTradeIdeas.map(idea => (
                <div key={idea.id} className="p-3 mb-2 border-b border-border/40 last:border-b-0 bg-card rounded-md shadow-sm hover:bg-accent/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <span className="font-semibold text-base text-foreground">{idea.security}</span>
                      <Badge variant={idea.type === "Stock" ? "default" : "secondary"} className="ml-2">{idea.type}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{idea.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{idea.idea}</p>
                  <p className="text-xs text-muted-foreground italic">Source: {idea.source}</p>
                </div>
              )) : <p className="text-sm text-muted-foreground text-center py-4">No trade ideas match your criteria.</p>}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl flex items-center"><MessageCircle size={24} className="mr-2 text-primary"/>MentorBull's Live Feed</CardTitle>
            <CardDescription>Real-time market commentary and insights.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <AIChatBot 
              aiPersonaName="MentorBull"
              aiPersonaImage="/trade_mentor_ai_logo.png"
              initialMessages={mockInMarketThoughts.map((text, index) => ({
                id: `market-thought-${index}`,
                sender: 'ai',
                text: text,
                timestamp: new Date(Date.now() - (mockInMarketThoughts.length - index) * 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }))}
              contextualPrompt="What are your thoughts on the current market action?"
              showUserInput={true}
              containerClassName="h-[300px] sm:h-full" // Ensure bot takes available space
            />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl flex items-center"><Edit3 size={24} className="mr-2 text-primary"/>Trade Journal</CardTitle>
          <CardDescription>Log your trades to track performance and learn.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4 items-end">
            <Input placeholder="Symbol" value={newTrade.security} onChange={(e) => setNewTrade({...newTrade, security: e.target.value.toUpperCase()})} className="bg-input text-foreground placeholder:text-muted-foreground" />
            <Select value={newTrade.type} onValueChange={(value) => setNewTrade({...newTrade, type: value}) }>
              <SelectTrigger className="bg-input text-foreground"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Buy">Buy Long</SelectItem>
                <SelectItem value="Sell Short">Sell Short</SelectItem>
                <SelectItem value="Buy Call">Buy Call</SelectItem>
                <SelectItem value="Sell Call">Sell Call</SelectItem>
                <SelectItem value="Buy Put">Buy Put</SelectItem>
                <SelectItem value="Sell Put">Sell Put</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Entry Price" value={newTrade.entryPrice} onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})} className="bg-input text-foreground placeholder:text-muted-foreground" />
            <Input type="number" placeholder="Quantity" value={newTrade.quantity} onChange={(e) => setNewTrade({...newTrade, quantity: e.target.value})} className="bg-input text-foreground placeholder:text-muted-foreground" />
            <Button onClick={handleLogTrade} className="w-full lg:w-auto">Log Trade</Button>
          </div>
          <h3 className="text-lg font-semibold mb-3 mt-6">Recent Trades</h3>
          <ScrollArea className="h-[200px] sm:h-[250px] w-full rounded-md border border-border/60 bg-muted/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Entry</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loggedTrades.map(trade => (
                  <TableRow key={trade.id} className="hover:bg-accent/30 transition-colors">
                    <TableCell className="font-medium">{trade.security}</TableCell>
                    <TableCell>{trade.type}</TableCell>
                    <TableCell className="text-right">${trade.entryPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${trade.currentPrice?.toFixed(2) || '-'}</TableCell>
                    <TableCell className="text-right">{trade.quantity}</TableCell>
                    <TableCell><Badge variant={trade.status === "Open" ? "outline" : "secondary"}>{trade.status}</Badge></TableCell>
                    <TableCell className={`text-right font-medium ${trade.pnl >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{trade.pnl >=0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {loggedTrades.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No trades logged yet.</p>}
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
  );
};

export default MarketPage;

