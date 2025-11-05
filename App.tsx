
import React, 'react';
import { useState } from 'react';
import { Tone, GeneratedPost } from './types';
import { generateSocialPosts } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PostCard from './components/PostCard';
import Loader from './components/Loader';
import ErrorAlert from './components/ErrorAlert';

export default function App() {
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (idea: string, tone: Tone) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPosts(null);

    try {
      const posts = await generateSocialPosts(idea, tone);
      setGeneratedPosts(posts);
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

  return (
    <div className="min-h-screen bg-dark-bg font-sans text-light-text">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

        {isLoading && <Loader />}
        {error && <ErrorAlert message={error} />}

        {generatedPosts && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
              Your AI-Generated Content
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {generatedPosts.map((post) => (
                <PostCard key={post.platform} post={post} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
