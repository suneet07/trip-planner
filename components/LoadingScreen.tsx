
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Mapping out your adventure...",
  "Consulting the local guides...",
  "Checking for the best food spots...",
  "Calculating the optimal path...",
  "Finding the perfect stays...",
  "Polishing your itinerary..."
];

const LoadingScreen: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[500px] animate-pulse">
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 transition-all duration-500">
        {MESSAGES[msgIdx]}
      </h3>
      <p className="text-slate-400 max-w-xs mx-auto">
        Great journeys take a moment to prepare. We're crafting something special just for you.
      </p>

      <div className="mt-12 flex gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
