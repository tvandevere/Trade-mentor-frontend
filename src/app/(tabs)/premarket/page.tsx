"use client";

import React, { useState, useEffect } from 'react';
import MentorBullMascot from '@/components/ai/MentorBullMascot';
import ContextualTip from '@/components/ai/ContextualTip';
import DailyBriefingModal from '@/components/ai/DailyBriefingModal'; // Import the modal

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

const initialChecklistItems: ChecklistItem[] = [
  { id: '1', label: 'Market Overview Digested', completed: false },
  { id: '2', label: 'Watchlist Reviewed & Updated', completed: false },
  { id: '3', label: 'Key Support/Resistance Levels Identified', completed: false },
  { id: '4', label: 'Economic Calendar Checked for News', completed: false },
  { id: '5', label: 'Trading Plan for the Day Confirmed', completed: false },
];

const PreMarketPage = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklistItems);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false); // State for modal

  const handleChecklistItemToggle = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Mock logic to open modal on first visit (can be refined later)
  useEffect(() => {
    const hasSeenBriefing = sessionStorage.getItem('hasSeenPreMarketBriefing');
    if (!hasSeenBriefing) {
      setIsBriefingModalOpen(true);
      sessionStorage.setItem('hasSeenPreMarketBriefing', 'true');
    }
  }, []);

  return (
    <div className="container mx-auto p-4 text-white">
      <DailyBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        title="MentorBull's Pre-Market Briefing"
      >
        <p className="mb-3">
          Good morning, Trader! MentorBull here to get you ready for the day.
        </p>
        <p className="mb-3">
          Let's quickly go over the key things to focus on before the opening bell:
        </p>
        <ul className="list-disc list-inside mb-3 pl-4 space-y-1">
          <li><strong>Market Sentiment:</strong> Check the overnight futures and global indices.</li>
          <li><strong>Key News Catalysts:</strong> Any major economic releases or company-specific news?</li>
          <li><strong>Your Watchlist:</strong> Are there any pre-market movers? Any adjustments needed based on news?</li>
          <li><strong>Your Plan:</strong> Reconfirm your entry/exit points and risk management for potential trades.</li>
        </ul>
        <p>
          Use the checklist on this page to track your progress. Let's make it a great trading day!
        </p>
      </DailyBriefingModal>

      <h1 className="text-3xl font-bold mb-6 text-center">Pre-Market Preparation</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
        <MentorBullMascot size={80} />
        <ContextualTip message="Welcome to your Pre-Market hub! Let's ensure you're fully prepared before the market opens. Use the checklist below to guide your analysis." />
      </div>

      <button 
        onClick={() => setIsBriefingModalOpen(true)} 
        className="mb-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150 w-full md:w-auto">
        Show MentorBull's Briefing
      </button>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-sky-400">Your Pre-Market Checklist</h2>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center p-3 bg-gray-700 rounded-md shadow hover:bg-gray-600 transition-colors duration-150">
              <input
                type="checkbox"
                id={`checklist-${item.id}`}
                checked={item.completed}
                onChange={() => handleChecklistItemToggle(item.id)}
                className="form-checkbox h-5 w-5 text-sky-500 bg-gray-800 border-gray-600 rounded focus:ring-sky-600 focus:ring-offset-gray-800 mr-3 cursor-pointer"
              />
              <label htmlFor={`checklist-${item.id}`} className={`flex-grow text-lg ${item.completed ? 'line-through text-gray-500' : 'text-gray-200'} cursor-pointer`}>
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Placeholder for other pre-market content */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-3 text-sky-400">Market Pulse (Coming Soon)</h2>
            <p className="text-gray-400">
            MentorBull will provide a quick digest of overnight market movements and key news here.
            </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-3 text-sky-400">Focus Watchlist (Coming Soon)</h2>
            <p className="text-gray-400">
            Your prioritized watchlist for today's session will be displayed here, with quick notes from MentorBull.
            </p>
        </div>
      </div>
      
    </div>
  );
};

export default PreMarketPage;

