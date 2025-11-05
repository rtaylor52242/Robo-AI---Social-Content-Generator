
import React from 'react';
import { useState } from 'react';
import { GeneratedPost } from '../types';
import { PLATFORM_CONFIG } from '../constants';

interface PostCardProps {
  post: GeneratedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);
  const platformInfo = PLATFORM_CONFIG[post.platform];

  const handleCopy = () => {
    navigator.clipboard.writeText(post.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-dark-card rounded-xl shadow-lg overflow-hidden border border-dark-border flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-4 flex items-center gap-3 border-b border-dark-border">
        <span className={`p-2 rounded-full ${platformInfo.color}`}>
          {platformInfo.icon}
        </span>
        <h3 className="font-bold text-xl">{post.platform}</h3>
      </div>
      
      <div className="aspect-w-1 aspect-h-1">
        <img 
          src={post.imageUrl} 
          alt={`AI-generated image for ${post.platform}`} 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <p className="text-medium-text whitespace-pre-wrap flex-grow mb-4">{post.text}</p>
        <button
          onClick={handleCopy}
          className="mt-auto w-full bg-gray-700 hover:bg-gray-600 text-light-text font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Text
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
