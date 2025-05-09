"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIChatBotProps {
  initialMessages?: Message[];
  aiPersonaName?: string;
  aiPersonaImage?: string; // Path to the bull image, or a generic AI icon
  contextualPrompt?: string; // e.g., "What are your thoughts on today's market?"
}

const AIChatBot: React.FC<AIChatBotProps> = ({
  initialMessages = [],
  aiPersonaName = "MentorBull", // Default name for our bull AI
  aiPersonaImage = "/trade_mentor_ai_logo.png", // Using the CORRECTED logo path as default
  contextualPrompt
}) => {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = React.useState("");
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Add contextual prompt if provided and no initial messages exist that are similar
    if (contextualPrompt && messages.length === 0) {
      setMessages([
        {
          id: `ai-init-${Date.now()}`,
          sender: 'ai',
          text: contextualPrompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [contextualPrompt, messages.length]);

 React.useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div'); // Target the inner div for scrolling
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      const newUserMessage: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);
      setUserInput("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `That's a great question, MockUser! Regarding "${userInput.substring(0, 20)}...", I think... (mocked AI response from ${aiPersonaName})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...newMessages, aiResponse]);
      }, 1200);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3">
            {/* Using the bull logo as the AI persona image */}
            <AvatarImage src={aiPersonaImage} alt={aiPersonaName} />
            <AvatarFallback>{aiPersonaName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h4 className="font-semibold text-lg">Chat with {aiPersonaName}</h4>
        </div>
        <ScrollArea className="h-[250px] w-full rounded-md border bg-muted/20 p-3 mb-3" ref={scrollAreaRef}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-2 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-muted-foreground text-center">No messages yet. Ask {aiPersonaName} something!</p>}
        </ScrollArea>
        <div className="flex items-center space-x-2">
          <Textarea
            placeholder={`Ask ${aiPersonaName} anything...`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[50px] resize-none"
          />
          <Button onClick={handleSendMessage} className="self-end">Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatBot;

