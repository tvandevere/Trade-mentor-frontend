"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";
import ThemeAwareLogo from "@/components/ui/ThemeAwareLogo"; // Assuming this is your theme-aware logo

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatBotProps {
  initialMessage?: string;
  initialPrompts?: string[];
  botPersonaName?: string;
  contextualSystemPrompt?: string; // New prop for tab-specific system prompts
}

const AIChatBot: React.FC<AIChatBotProps> = ({
  initialMessage,
  initialPrompts,
  botPersonaName = "Trade Caddie",
  contextualSystemPrompt = "You are Trade Caddie, a helpful AI assistant for traders."
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [currentPrompts, setCurrentPrompts] = useState<string[]>(initialPrompts || []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const addMessage = useCallback((text: string, sender: "user" | "ai") => {
    const newMessage: Message = {
      id: Date.now().toString(), // Simple ID generation
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  useEffect(() => {
    if (initialMessage) {
      addMessage(initialMessage, "ai");
    }
  }, [initialMessage, addMessage]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (textToSend.trim() === "") return;

    addMessage(textToSend, "user");
    if (!messageText) {
      setInputValue(""); // Clear input field only if it was user typed
    }
    setCurrentPrompts([]); // Clear prompts after user sends a message or clicks a prompt
    setIsLoading(true);

    // Prepare conversation history for the API
    const historyForAPI = messages.map(msg => ({
      sender: msg.sender,
      text: msg.text
    }));
    // Add the current user message to the history being sent
    historyForAPI.push({ sender: "user", text: textToSend });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend, // The current user message
          history: historyForAPI.slice(0, -1), // Send history *before* this message
          // We could also pass the contextualSystemPrompt here if the backend supports it
          // or the backend could infer it based on the API route or other parameters.
          // For now, the python script has a hardcoded system prompt.
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const data = await response.json();
      addMessage(data.response || "Sorry, I couldn\'t get a response.", "ai");
    } catch (error) {
      console.error("Error sending message to AI:", error);
      let errorMessage = "Sorry, something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      addMessage(errorMessage, "ai");
    }
    setIsLoading(false);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto bg-base-100 shadow-xl rounded-lg">
      <div className="p-4 border-b border-base-300 flex items-center">
        <ThemeAwareLogo width={40} height={40} className="mr-3" />
        <h2 className="text-xl font-semibold text-base-content">{botPersonaName}</h2>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-base-200/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow ${msg.sender === "user"
                  ? "bg-primary text-primary-content"
                  : "bg-base-300 text-base-content"}`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow bg-base-300 text-base-content">
              <p className="text-sm flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 animate-pulse" />
                <span>{botPersonaName} is thinking...</span>
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {currentPrompts && currentPrompts.length > 0 && !isLoading && (
        <div className="p-2 border-t border-base-300 bg-base-100">
          <div className="flex flex-wrap gap-2 justify-center">
            {currentPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="btn btn-outline btn-sm text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-base-300 bg-base-100">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            placeholder="Ask Trade Caddie..."
            className="input input-bordered w-full mr-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            className="btn btn-primary btn-square"
            disabled={isLoading}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;

