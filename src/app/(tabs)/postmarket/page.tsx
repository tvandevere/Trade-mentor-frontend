"use client";

import React, { useState, useEffect } from 'react';
import { DailyDebriefingModal } from '@/components/ai/DailyDebriefingModal';
import { MentorBullMascot } from '@/components/ai/MentorBullMascot';
import { ContextualTip } from '@/components/ai/ContextualTip';

const PostMarketPage = () => {
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false);
  const [showInitialTip, setShowInitialTip] = useState(false);

  // Simulate showing the modal automatically on first visit (for demo purposes)
  useEffect(() => {
    const hasVisitedPostMarket = sessionStorage.getItem('hasVisitedPostMarket');
    if (!hasVisitedPostMarket) {
      setShowInitialTip(true);
      sessionStorage.setItem('hasVisitedPostMarket', 'true');
    }
  }, []);

  const openDebriefModal = () => setIsDebriefModalOpen(true);
  const closeDebriefModal = () => setIsDebriefModalOpen(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <MentorBullMascot size={60} />
        <h1 style={{ marginLeft: '15px', fontSize: '2em', color: '#1a237e' }}>Post-Market Analysis</h1>
      </div>

      {showInitialTip && (
        <ContextualTip 
          message="Welcome to your Post-Market Debrief! Click the button below to start your review with MentorBull."
          onClose={() => setShowInitialTip(false)}
          isVisible={showInitialTip}
          style={{ marginBottom: '20px' }}
        />
      )}

      <p style={{ fontSize: '1.1em', lineHeight: 1.6, marginBottom: '20px' }}>
        The trading day is over. Now is the crucial time to review your performance, understand your decisions, and prepare for tomorrow. MentorBull is here to guide you through this process.
      </p>

      <button 
        onClick={openDebriefModal}
        style={{
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          padding: '15px 30px', 
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1.1em',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
      >
        Start MentorBull Debrief
      </button>

      <DailyDebriefingModal isOpen={isDebriefModalOpen} onClose={closeDebriefModal} />

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h2 style={{ fontSize: '1.5em', color: '#1a237e', marginBottom: '15px' }}>Key Areas for Review:</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>Review executed trades and their outcomes.</li>
          <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>Analyze adherence to your trading plan.</li>
          <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>Identify emotional influences on your decisions.</li>
          <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>Note any lessons learned and adjustments for next session.</li>
        </ul>
      </div>

    </div>
  );
};

export default PostMarketPage;

