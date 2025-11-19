
import React from 'react';
import { useState, useEffect } from 'react';
import { GeneratedPost, SocialPlatform } from '../types';
import { PLATFORM_CONFIG } from '../constants';

interface PostCardProps {
  post: GeneratedPost;
  onUpdate: (platform: SocialPlatform, updates: Partial<GeneratedPost>) => void;
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

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const [copiedType, setCopiedType] = useState<null | 'text' | 'all'>(null);
  const [canShare, setCanShare] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const platformInfo = PLATFORM_CONFIG[post.platform];

  useEffect(() => {
    // Check for Web Share API support on the client-side
    if (typeof navigator !== 'undefined' && navigator.share) {
      setCanShare(true);
    }
  }, []);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
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

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(post.text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const toggleEdit = () => {
    onUpdate(post.platform, { isEditable: !post.isEditable });
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

  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );

  const SaveIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
  
  const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  );

  return (
    <div className="bg-dark-card rounded-xl shadow-lg overflow-hidden border border-dark-border flex flex-col transform transition-transform duration-300 hover:shadow-brand-primary/20">
      <div className="p-4 flex items-center justify-between border-b border-dark-border">
        <div className="flex items-center gap-3">
            <span className={`p-2 rounded-full ${platformInfo.color}`}>
            {platformInfo.icon}
            </span>
            <h3 className="font-bold text-xl">{post.platform}</h3>
        </div>
        <button 
            onClick={toggleEdit}
            className="text-medium-text hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            title={post.isEditable ? "Save Changes" : "Edit Post"}
        >
            {post.isEditable ? <SaveIcon /> : <EditIcon />}
        </button>
      </div>
      
      <div className="aspect-w-1 aspect-h-1 bg-gray-900 relative">
        <img 
          src={post.imageUrl} 
          alt={`AI-generated image for ${post.platform}`} 
          className="w-full h-full object-cover" 
        />
        {post.imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Image Failed
                </div>
            </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow mb-4">
            {post.isEditable ? (
                <textarea 
                    value={post.text}
                    onChange={(e) => onUpdate(post.platform, { text: e.target.value })}
                    className="w-full h-full min-h-[120px] bg-gray-800 border border-gray-600 rounded-lg p-3 text-light-text focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                    autoFocus
                />
            ) : (
                <p className="text-medium-text whitespace-pre-wrap">{post.text}</p>
            )}
        </div>
        
        <div className="mt-auto pt-4 grid grid-cols-4 gap-2">
             <button
                onClick={handleSpeak}
                className={`col-span-1 font-semibold py-2 px-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                    isSpeaking
                    ? 'bg-brand-secondary text-white animate-pulse'
                    : 'bg-gray-700 hover:bg-gray-600 text-light-text'
                }`}
                title={isSpeaking ? "Stop Reading" : "Read Aloud"}
            >
                {isSpeaking ? <StopIcon /> : <SpeakerIcon />}
            </button>
            
            <button
                onClick={handleCopyText}
                className="col-span-1 bg-gray-700 hover:bg-gray-600 text-light-text font-semibold py-2 px-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                title="Copy Text"
                >
                {copiedType === 'text' ? <CopiedIcon /> : <CopyIcon />}
            </button>
            
            <button
                onClick={handleCopyAll}
                disabled={!!post.imageError}
                className={`col-span-1 font-semibold py-2 px-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                    post.imageError 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700 hover:bg-gray-600 text-light-text'
                }`}
                title="Copy Image & Text"
                >
                {copiedType === 'all' ? <CopiedIcon /> : <CopyIcon />}
            </button>
            
            {canShare && (
                <button
                    onClick={handleShare}
                    disabled={!!post.imageError}
                    className={`col-span-1 font-semibold py-2 px-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                         post.imageError 
                        ? 'bg-brand-secondary/50 text-gray-400 cursor-not-allowed' 
                        : 'bg-brand-secondary hover:bg-brand-primary text-light-text'
                    }`}
                    title="Share Post"
                    >
                    <ShareIcon />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
