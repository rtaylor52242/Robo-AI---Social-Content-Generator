
import React from 'react';

interface HelpModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function HelpModal({ isVisible, onClose }: HelpModalProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="bg-dark-card rounded-2xl shadow-xl border border-dark-border max-w-2xl w-full mx-auto p-6 md:p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="help-modal-title" className="text-2xl font-bold text-light-text bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
            How to Use the App
          </h2>
          <button
            onClick={onClose}
            className="text-medium-text hover:text-light-text transition-colors"
            aria-label="Close help modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-medium-text">
          <div>
            <h3 className="font-semibold text-light-text text-lg mb-1">Step 1: Enter Your Idea</h3>
            <p>
              In the first text box, type the core idea for your social media posts. This could be a product launch, a company announcement, a special offer, or any topic you want to share. Be as descriptive as you like!
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-light-text text-lg mb-1">Step 2: Choose Your Tones</h3>
            <p>
              Select up to three tones that best fit the mood you want to convey. The AI will blend these tones and adapt its writing style based on your choices, from 'Professional' for a formal audience to 'Witty' for more engaging content.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-light-text text-lg mb-1">Step 3: Generate Content</h3>
            <p>
              Click the '✨ Generate Content' button. The AI will get to work, crafting unique text and generating custom images for LinkedIn, Twitter/X, and Instagram. This process might take a few moments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-light-text text-lg mb-1">Step 4: Copy Your Post</h3>
            <p>
              Once the posts appear, you can easily copy the text for any platform by clicking the 'Copy Text' button at the bottom of each card. The text is now ready to be pasted directly into your social media.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}