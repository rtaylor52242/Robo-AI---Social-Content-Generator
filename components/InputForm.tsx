
import React from 'react';
import { useState } from 'react';
import { Tone } from '../types';
import { TONES } from '../constants';

interface InputFormProps {
  onSubmit: (idea: string, tone: Tone) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<Tone>(TONES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onSubmit(idea, tone);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-dark-card p-6 md:p-8 rounded-2xl shadow-lg border border-dark-border">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="idea" className="block text-lg font-semibold mb-2 text-light-text">
            1. Enter your content idea
          </label>
          <textarea
            id="idea"
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., The launch of our new productivity app..."
            className="w-full bg-gray-800 border border-dark-border rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3 text-light-text">
            2. Select the tone
          </label>
          <div className="flex flex-wrap gap-3">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  tone === t
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="w-full flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            '✨ Generate Content'
          )}
        </button>
      </form>
    </div>
  );
}
