"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, MessageSquare, Share2, Send, Users2, BarChart2, TrendingUp, TrendingDown, Crown } from 'lucide-react'; // Added Crown for Leaderboard
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mocked data for Community Tab
const mockCommunityPosts = [
  {
    id: "post1",
    user: "AlphaTraderX",
    avatarFallback: "AT",
    timestamp: "2 hours ago",
    content: "Nailed that NVDA breakout this morning! Rode it for a quick +$150. The AI signals for increased volume were spot on. Anyone else catch it?",
    likes: 27,
    comments: [
      { id: "c1-1", user: "ScalperQueen", avatarFallback: "SQ", comment: "I did! Small size but a clean scalp. Thanks for the heads up on volume!", timestamp: "1 hour ago" },
      { id: "c1-2", user: "MockUser", avatarFallback: "MU", comment: "Awesome trade! I was watching it but was a bit hesitant to jump in. Regretting it now!", timestamp: "30 mins ago" },
    ]
  },
  {
    id: "post2",
    user: "OptionOracle",
    avatarFallback: "OO",
    timestamp: "5 hours ago",
    content: "Considering a short-term SPY put spread for a potential pullback. IV is still relatively low. What are your thoughts on market direction for the next few days?",
    likes: 12,
    comments: [
        { id: "c2-1", user: "SwingKing", avatarFallback: "SK", comment: "I'm leaning bullish but cautious. A small hedge might not be a bad idea.", timestamp: "4 hours ago" },
    ]
  },
  {
    id: "post3",
    user: "MentorBull", // AI Post
    avatarFallback: "MB",
    avatarImage: "/trade_mentor_ai_logo.png",
    timestamp: "6 hours ago",
    content: "Hey community! Quick tip: Remember to review your trades from yesterday. What was your biggest lesson? Sharing helps everyone learn! #TradingTips #LearnAndGrow",
    likes: 45,
    comments: []
  },
  {
    id: "post4",
    user: "SteadyEddie",
    avatarFallback: "SE",
    timestamp: "1 day ago",
    content: "Just finished the 'Essential Risk Management' article in the Education Hub. Highly recommend it for anyone looking to tighten up their trading plan!",
    likes: 35,
    comments: []
  },
];

const mockLeaderboardData = [
  { rank: 1, user: "AlphaTraderX", pnl: 1250.75, avgGain: 75.50, avgLoss: -30.20, winRate: "68%" },
  { rank: 2, user: "ScalperQueen", pnl: 980.20, avgGain: 25.10, avgLoss: -10.50, winRate: "75%" },
  { rank: 3, user: "OptionOracle", pnl: 750.00, avgGain: 150.00, avgLoss: -65.00, winRate: "55%" },
  { rank: 4, user: "MockUser", pnl: 450.50, avgGain: 50.25, avgLoss: -22.80, winRate: "60%" }, 
  { rank: 5, user: "SwingKing", pnl: 300.00, avgGain: 100.00, avgLoss: -40.00, winRate: "58%" },
];

const CommunityPage = () => {
  const [posts, setPosts] = React.useState(mockCommunityPosts);
  const [newPostContent, setNewPostContent] = React.useState("");
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null); // Post ID
  const [replyContent, setReplyContent] = React.useState("");

  const handleCreatePost = () => {
    if (newPostContent.trim() !== "") {
      const newPost = {
        id: `post${posts.length + Math.random()}`,
        user: "MockUser", 
        avatarFallback: "MU",
        timestamp: "Just now",
        content: newPostContent,
        likes: 0,
        comments: []
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
    }
  };

  const handleAddComment = (postId: string) => {
    if (replyContent.trim() === "") return;
    setPosts(posts.map(p => {
        if (p.id === postId) {
            return {
                ...p,
                comments: [...p.comments, {id: `c${Math.random()}`, user: "MockUser", avatarFallback: "MU", comment: replyContent, timestamp: "Just now"}]
            };
        }
        return p;
    }));
    setReplyContent("");
    setReplyingTo(null);
  };

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 md:py-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left flex items-center"><Users2 size={30} className="mr-2 text-primary"/>Community Connect</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed & Post Creation - Takes 2/3 on larger screens */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">Share Your Insights</CardTitle>
                <CardDescription>Connect with fellow traders, discuss strategies, and share your market observations.</CardDescription>
                </CardHeader>
                <CardContent>
                <Textarea 
                    placeholder="What's on your mind, MockUser? Share a trade idea, ask a question, or start a discussion..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="mb-3 min-h-[100px] bg-input text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={handleCreatePost} size="lg"><Send size={18} className="mr-2"/>Post to Community</Button>
                </CardContent>
            </Card>

            <h2 className="text-xl sm:text-2xl font-semibold pt-4 border-t border-border/60">Recent Discussions</h2>
            <ScrollArea className="h-[calc(100vh-550px)] sm:h-[calc(100vh-500px)] pr-2">
                <div className="space-y-6">
                {posts.map(post => (
                    <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/70">
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border-2 border-border/60">
                            <AvatarImage src={post.avatarImage || `https://avatar.vercel.sh/${post.user.replace(" ", "")}.png?size=44`} alt={post.user} />
                            <AvatarFallback>{post.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base sm:text-lg font-semibold text-foreground">{post.user}</CardTitle>
                            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3 border-t border-border/60 pt-3">
                        <Button variant="ghost" size="sm" className="p-1 h-auto text-muted-foreground hover:text-primary group">
                            <ThumbsUp size={16} className="mr-1.5 group-hover:fill-primary/20"/> Like ({post.likes})
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto text-muted-foreground hover:text-primary group" onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}>
                            <MessageSquare size={16} className="mr-1.5 group-hover:fill-primary/20"/> Comment ({post.comments.length})
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto text-muted-foreground hover:text-primary group">
                            <Share2 size={16} className="mr-1.5"/> Share
                        </Button>
                        </div>
                        {replyingTo === post.id && (
                            <div className="mt-3 mb-2 flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://avatar.vercel.sh/MockUser.png?size=32`} alt="MockUser" />
                                    <AvatarFallback>MU</AvatarFallback>
                                </Avatar>
                                <Input 
                                    value={replyContent} 
                                    onChange={(e) => setReplyContent(e.target.value)} 
                                    placeholder={`Reply to ${post.user}...`} 
                                    className="flex-grow bg-input text-foreground placeholder:text-muted-foreground h-9 text-sm"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                />
                                <Button size="sm" onClick={() => handleAddComment(post.id)} disabled={!replyContent.trim()}>Reply</Button>
                            </div>
                        )}
                        {post.comments.length > 0 && (
                        <div className="ml-0 mt-3 space-y-3 pt-3 border-t border-border/40">
                            {post.comments.map((comment) => (
                            <div key={comment.id} className="text-xs flex items-start space-x-2">
                                <Avatar className="h-7 w-7 mt-0.5">
                                <AvatarImage src={`https://avatar.vercel.sh/${comment.user.replace(" ", "")}.png?size=28`} alt={comment.user} />
                                <AvatarFallback className="text-xs">{comment.avatarFallback}</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted/40 p-2 rounded-md flex-1">
                                <span className="font-semibold text-foreground">{comment.user}</span>
                                <span className="text-muted-foreground/80 ml-1.5 text-[11px]">({comment.timestamp})</span>
                                <p className="text-foreground/90 mt-0.5 leading-snug">{comment.comment}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </CardContent>
                    </Card>
                ))}
                </div>
                {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No community posts yet. Be the first to share!</p>}
            </ScrollArea>
        </div>

        {/* Leaderboard - Takes 1/3 on larger screens */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-2">
                        <Crown size={24} className="text-yellow-500" />
                        <CardTitle className="text-xl sm:text-2xl">Community Leaderboard</CardTitle>
                    </div>
                    <CardDescription>See how you stack up against fellow traders. (Mock Data)</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px] sm:h-[350px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[50px]">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Total P&L</TableHead>
                                <TableHead className="text-right hidden md:table-cell">Win Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLeaderboardData.map((trader) => (
                                <TableRow key={trader.rank} className="hover:bg-accent/30 transition-colors">
                                    <TableCell className="font-medium text-center">{trader.rank === 1 ? <Crown size={18} className="mx-auto text-yellow-400"/> : trader.rank}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={`https://avatar.vercel.sh/${trader.user.replace(" ", "")}.png?size=28`} alt={trader.user} />
                                                <AvatarFallback className="text-xs">{trader.user.substring(0,2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-foreground">{trader.user}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`text-right font-semibold ${trader.pnl >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                        {trader.pnl >= 0 ? `+$${trader.pnl.toFixed(2)}` : `-$${Math.abs(trader.pnl).toFixed(2)}`}
                                    </TableCell>
                                    <TableCell className="text-right hidden md:table-cell text-sm text-muted-foreground">{trader.winRate}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <Button variant="link" className="text-xs mt-3 p-0 h-auto">View Full Leaderboard & Your Detailed Stats</Button>
                </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Top Performing Strategies</CardTitle>
                    <CardDescription>Community-highlighted strategies this week. (Mock)</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div className="p-2 border rounded-md bg-card/50 hover:bg-accent/30">
                        <div className="font-semibold text-foreground flex items-center">
                          <span>Scalping SPX 0DTEs</span>
                          <Badge variant="secondary" className="ml-1">Options</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Avg. Win: +$85, Win Rate: 72%</p>
                    </div>
                    <div className="p-2 border rounded-md bg-card/50 hover:bg-accent/30">
                        <div className="font-semibold text-foreground flex items-center">
                          <span>Earnings Gap & Go</span>
                          <Badge variant="default" className="ml-1">Stocks</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Avg. Win: +$210, Win Rate: 65%</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

