
import React from 'react';

interface HistoryButtonProps {
  onClick: () => void;
}

export default function HistoryButton({ onClick }: HistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 bg-brand-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-colors duration-300 z-50 group"
      aria-label="Show history"
      title="View History"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-7 w-7 group-hover:scale-110 transition-transform" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );
}
