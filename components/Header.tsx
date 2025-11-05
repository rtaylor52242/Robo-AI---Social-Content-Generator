import React from 'react';

export default function Header() {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
        Robo AI - Social Content Generator
      </h1>
      <p className="text-lg text-medium-text max-w-2xl mx-auto">
        Turn one idea into tailored posts for LinkedIn, Twitter/X, and Instagram, complete with unique, AI-generated images for each platform.
      </p>
    </header>
  );
}