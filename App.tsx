
import React from 'react';
import { useState, useEffect } from 'react';
import { Tone, GeneratedPost, GenerationHistoryItem, SocialPlatform } from './types';
import { generateSocialPosts } from './services/geminiService';
import { getHistory, saveHistoryItem, deleteHistoryItem, clearHistory } from './services/storageService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PostCard from './components/PostCard';
import Loader from './components/Loader';
import ErrorAlert from './components/ErrorAlert';
import HelpButton from './components/HelpButton';
import HelpModal from './components/HelpModal';
import HistoryButton from './components/HistoryButton';
import HistoryModal from './components/HistoryModal';
import PreviewModal from './components/PreviewModal';

export default function App() {
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHelpVisible, setIsHelpVisible] = useState<boolean>(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [currentIdea, setCurrentIdea] = useState<string>('');
  const [ideaCopied, setIdeaCopied] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleGenerate = async (idea: string, tones: Tone[]) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPosts(null);
    setCurrentIdea(idea); // Set current idea

    try {
      const posts = await generateSocialPosts(idea, tones);
      setGeneratedPosts(posts);
      
      // Check for partial failures (images that failed to generate)
      const failedPlatforms = posts
        .filter(p => p.imageError)
        .map(p => p.platform);

      if (failedPlatforms.length > 0) {
        setError(`Warning: Image generation failed for ${failedPlatforms.join(', ')}. Placeholder images were used instead.`);
      }
      
      // Save to history
      const newItem: GenerationHistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        idea,
        tones,
        posts
      };
      const updatedHistory = saveHistoryItem(newItem);
      setHistory(updatedHistory);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: GenerationHistoryItem) => {
    setGeneratedPosts(item.posts);
    setCurrentIdea(item.idea); // Set current idea from history
    setIsHistoryVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
      const updated = clearHistory();
      setHistory(updated);
  };

  const handlePostUpdate = (platform: SocialPlatform, updates: Partial<GeneratedPost>) => {
    if (!generatedPosts) return;
    
    setGeneratedPosts(prev => 
      prev ? prev.map(post => 
        post.platform === platform ? { ...post, ...updates } : post
      ) : null
    );
  };

  const handleCopyIdea = async () => {
      if (!currentIdea) return;
      try {
          await navigator.clipboard.writeText(currentIdea);
          setIdeaCopied(true);
          setTimeout(() => setIdeaCopied(false), 2000);
      } catch (err) {
          console.error("Failed to copy idea", err);
      }
  };

  return (
    <div className="min-h-screen bg-dark-bg font-sans text-light-text">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

        {isLoading && <Loader />}
        {error && <ErrorAlert message={error} />}

        {generatedPosts && (
          <div className="mt-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-dark-border pb-4">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
                Your AI-Generated Content
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopyIdea}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg border border-gray-700"
                        title="Copy Original Idea"
                    >
                        {ideaCopied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        )}
                        {ideaCopied ? "Copied!" : "Copy Idea"}
                    </button>
                    <button
                        onClick={() => setIsPreviewVisible(true)}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg border border-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Feed Preview
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {generatedPosts.map((post) => (
                <PostCard 
                  key={post.platform} 
                  post={post} 
                  onUpdate={handlePostUpdate}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <HistoryButton onClick={() => setIsHistoryVisible(true)} />
      <HistoryModal 
        isVisible={isHistoryVisible} 
        onClose={() => setIsHistoryVisible(false)} 
        history={history}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
      />

      <PreviewModal 
        isVisible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
        posts={generatedPosts || []}
      />

      <HelpButton onClick={() => setIsHelpVisible(true)} />
      <HelpModal isVisible={isHelpVisible} onClose={() => setIsHelpVisible(false)} />
    </div>
  );
}
