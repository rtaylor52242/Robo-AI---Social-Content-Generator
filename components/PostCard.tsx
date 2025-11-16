
import React from 'react';
import { useState, useEffect } from 'react';
import { GeneratedPost } from '../types';
import { PLATFORM_CONFIG } from '../constants';

interface PostCardProps {
  post: GeneratedPost;
}

// Helper function to convert a data URL string into a Blob object
const dataURLtoBlob = (dataUrl: string): Blob | null => {
  try {
    const arr = dataUrl.split(',');
    if (arr.length < 2) return null;
    
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error("Error converting data URL to Blob", e);
    return null;
  }
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [copiedType, setCopiedType] = useState<null | 'text' | 'all'>(null);
  const [canShare, setCanShare] = useState(false);

  const platformInfo = PLATFORM_CONFIG[post.platform];

  useEffect(() => {
    // Check for Web Share API support on the client-side
    if (typeof navigator !== 'undefined' && navigator.share) {
      setCanShare(true);
    }
  }, []);

  const showCopiedMessage = (type: 'text' | 'all') => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(post.text);
      showCopiedMessage('text');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    }
  };

  const handleCopyAll = async () => {
    try {
      if (!navigator.clipboard.write || typeof ClipboardItem === 'undefined') {
        alert('Your browser does not support copying images and text together.');
        return;
      }
      
      const blob = dataURLtoBlob(post.imageUrl);
      if (!blob) {
        throw new Error('Could not convert image data for copying.');
      }
      
      const textBlob = new Blob([post.text], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
          'text/plain': textBlob,
        }),
      ]);
      showCopiedMessage('all');
    } catch (err) {
      console.error('Failed to copy image and text: ', err);
      alert('Failed to copy image and text.');
    }
  };
  
  const handleShare = async () => {
    try {
        const blob = dataURLtoBlob(post.imageUrl);
        if (!blob) {
            throw new Error('Could not process image for sharing.');
        }

        const file = new File([blob], 'social-image.png', { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: `Post for ${post.platform}`,
                text: post.text,
                files: [file],
            });
        } else {
            // Fallback for browsers that support sharing but not files.
            // Avoid sharing the massive data URL in the text body.
             await navigator.share({
                title: `Post for ${post.platform}`,
                text: `${post.text}\n\n(Image is included where supported)`,
             });
        }
    } catch (err) {
      // Don't show an alert if the user cancels the share dialog
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Failed to share:', err);
        alert('Failed to share content.');
      }
    }
  };


  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
  );

  const CopiedIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="bg-dark-card rounded-xl shadow-lg overflow-hidden border border-dark-border flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-4 flex items-center gap-3 border-b border-dark-border">
        <span className={`p-2 rounded-full ${platformInfo.color}`}>
          {platformInfo.icon}
        </span>
        <h3 className="font-bold text-xl">{post.platform}</h3>
      </div>
      
      <div className="aspect-w-1 aspect-h-1 bg-gray-900">
        <img 
          src={post.imageUrl} 
          alt={`AI-generated image for ${post.platform}`} 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <p className="text-medium-text whitespace-pre-wrap flex-grow mb-4">{post.text}</p>
        <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2">
            <button
                onClick={handleCopyText}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-light-text font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                {copiedType === 'text' ? <CopiedIcon /> : <CopyIcon />}
                {copiedType === 'text' ? 'Copied Text' : 'Copy Text'}
            </button>
            <button
                onClick={handleCopyAll}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-light-text font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                {copiedType === 'all' ? <CopiedIcon /> : <CopyIcon />}
                {copiedType === 'all' ? 'Copied All' : 'Copy All'}
            </button>
            {canShare && (
                <button
                    onClick={handleShare}
                    className="flex-1 bg-brand-secondary hover:bg-brand-primary text-light-text font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                    <ShareIcon />
                    Share
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
