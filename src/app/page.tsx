"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, BarChart2, ShieldCheck, CheckCircle, BookOpen, Users, Brain, TrendingUp } from 'lucide-react'; // Restoring all icons as we are trying to restore full page

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/trade_mentor_ai_logo.png" 
              alt="Trade Mentor AI Logo" 
              width={36} 
              height={36}
              className="rounded-sm object-contain"
            />
            <span className="font-bold text-lg text-primary">Trade Mentor AI</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Testimonials</Link>
          </nav>
          <Button asChild variant="default">
            <Link href="/auth/login">Login / Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section - Corrected background image path */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="absolute inset-0 opacity-5 bg-[url(/trade_mentor_ai_logo.png)] bg-no-repeat bg-center bg-contain" style={{ backgroundSize: '60%', filter: 'blur(120px)' }}></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Elevate Your Trading with <span className="text-primary">MentorBull</span>, Your AI Guide
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground">
              Stop trading alone. Get personalized AI-driven insights, structured learning, and continuous support to navigate the markets with confidence and precision.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-primary/30 transition-shadow">
                <Link href="/auth/register">Start Your Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="#features">Discover Features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Your Trading Day, Supercharged by AI</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                MentorBull guides you through a structured trading routine, from market open to close, turning complexity into clarity.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <Card className="p-6 bg-card rounded-xl shadow-lg hover:shadow-primary/10 transition-shadow flex flex-col items-start">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Zap size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pre-Market Power-Up</h3>
                <p className="text-muted-foreground text-sm">
                  Wake up to AI-curated market overviews, key levels for your watchlist, and a personalized game plan for the day ahead. No more morning guesswork.
                </p>
              </Card>
              <Card className="p-6 bg-card rounded-xl shadow-lg hover:shadow-primary/10 transition-shadow flex flex-col items-start">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <BarChart2 size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">In-Market Intelligence</h3>
                <p className="text-muted-foreground text-sm">
                  Receive real-time trade ideas, sentiment analysis, and crucial alerts. MentorBull helps you manage trades, emotions, and opportunities as they unfold.
                </p>
              </Card>
              <Card className="p-6 bg-card rounded-xl shadow-lg hover:shadow-primary/10 transition-shadow flex flex-col items-start">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Post-Market Mastery</h3>
                <p className="text-muted-foreground text-sm">
                  Debrief your day with MentorBull. Analyze performance, understand mistakes, reinforce wins, and get tailored learning resources to grow faster.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Everything You Need to Succeed</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Trade Mentor AI is more than just signals; it's a comprehensive platform for trader development.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-left p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-start h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <Brain size={28} className="text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">Proactive AI Mentor</CardTitle>
                <CardContent className="text-sm text-muted-foreground p-0">
                  MentorBull doesn’t wait for questions. It proactively offers insights, education, and guidance based on market conditions and your activity.
                </CardContent>
              </Card>
              <Card className="text-left p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-start h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <TrendingUp size={28} className="text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">Data-Driven Trade Ideas</CardTitle>
                <CardContent className="text-sm text-muted-foreground p-0">
                  Discover high-probability setups with AI-vetted trade ideas, complete with entry, exit, and risk parameters.
                </CardContent>
              </Card>
              <Card className="text-left p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-start h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <BookOpen size={28} className="text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">Personalized Learning Paths</CardTitle>
                <CardContent className="text-sm text-muted-foreground p-0">
                  Access a curated library of educational content. MentorBull suggests resources based on your trades and learning needs.
                </CardContent>
              </Card>
              <Card className="text-left p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-start h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <Users size={28} className="text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">Community & Leaderboard</CardTitle>
                <CardContent className="text-sm text-muted-foreground p-0">
                  (Coming Soon) Learn with peers, share insights, and track your progress against the community in a supportive environment.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Placeholder */}
        <section id="testimonials" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Loved by Traders Like You</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        See how Trade Mentor AI is helping others achieve their trading goals.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="p-6 bg-card rounded-xl shadow-lg">
                        <p className="text-muted-foreground italic mb-4">"MentorBull has completely changed my pre-market routine. I feel so much more prepared and confident now!"</p>
                        <div className="flex items-center">
                            {/* Placeholder for avatar */}
                            <div className="w-10 h-10 rounded-full bg-muted mr-3"></div> 
                            <div>
                                <p className="font-semibold text-foreground">Sarah L.</p>
                                <p className="text-xs text-muted-foreground">Day Trader</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-card rounded-xl shadow-lg">
                        <p className="text-muted-foreground italic mb-4">"The AI trade ideas are surprisingly accurate, and the post-market review helps me learn from every trade. Highly recommend!"</p>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
                            <div>
                                <p className="font-semibold text-foreground">Mike P.</p>
                                <p className="text-xs text-muted-foreground">Swing Trader</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Ready to Unlock Your Trading Edge?</h2>
            <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
              Join Trade Mentor AI today. Your first 7 days are on us. Experience the future of trader development.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-primary/30 transition-shadow">
                <Link href="/auth/register">Claim Your Free Trial</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Image src="/trade_mentor_ai_logo.png" alt="Trade Mentor AI Small Logo" width={24} height={24} className="rounded-sm"/>
            <p className="font-semibold text-foreground">Trade Mentor AI</p>
          </div>
          <p>&copy; {new Date().getFullYear()} Trade Mentor AI. All Rights Reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

