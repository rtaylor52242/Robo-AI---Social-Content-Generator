
import React from 'react';
import { GenerationHistoryItem } from '../types';

interface HistoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  history: GenerationHistoryItem[];
  onSelect: (item: GenerationHistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export default function HistoryModal({ isVisible, onClose, history, onSelect, onDelete, onClear }: HistoryModalProps) {
  if (!isVisible) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div
        className="bg-dark-card rounded-2xl shadow-xl border border-dark-border max-w-3xl w-full mx-auto flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-dark-border flex justify-between items-center shrink-0">
          <h2 id="history-modal-title" className="text-2xl font-bold text-light-text bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
            Generation History
          </h2>
          <div className="flex gap-4">
             {history.length > 0 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('Are you sure you want to clear all history?')) onClear();
                    }}
                    className="text-sm text-red-400 hover:text-red-300 font-semibold"
                >
                    Clear All
                </button>
            )}
            <button
                onClick={onClose}
                className="text-medium-text hover:text-light-text transition-colors"
                aria-label="Close history modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-grow">
          {history.length === 0 ? (
            <div className="text-center text-medium-text py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">No history yet.</p>
              <p className="text-sm">Generate some content and it will appear here!</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 border border-dark-border rounded-xl p-4 hover:border-brand-primary transition-colors cursor-pointer group relative"
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded">
                            {formatDate(item.timestamp)}
                        </span>
                        <span className="text-xs text-medium-text">
                            • {item.posts.length} Posts
                        </span>
                     </div>
                    <h3 className="font-semibold text-light-text line-clamp-2 mb-2">{item.idea}</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tones.map((tone, idx) => (
                        <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                          {tone}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-medium-text hover:text-red-400 p-2 transition-all"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-between">
                     <div className="flex -space-x-2 overflow-hidden">
                        {item.posts.slice(0, 5).map((post, i) => (
                            <img 
                                key={i}
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800 object-cover"
                                src={post.imageUrl}
                                alt={post.platform}
                            />
                        ))}
                     </div>
                     <span className="text-sm font-medium text-brand-primary group-hover:underline">
                        View Results &rarr;
                     </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
