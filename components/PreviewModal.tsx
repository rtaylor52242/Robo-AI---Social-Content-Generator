
import React, { useState } from 'react';
import { GeneratedPost, SocialPlatform } from '../types';
import { PLATFORM_CONFIG } from '../constants';

interface PreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  posts: GeneratedPost[];
}

// --- Shared Icons ---
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
);
const AvatarPlaceholder = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
        You
    </div>
);

// --- Platform Mockups ---

const LinkedInMockup = ({ post }: { post: GeneratedPost }) => (
  <div className="bg-gray-900 text-gray-100 rounded-lg border border-gray-700 font-sans max-w-md mx-auto overflow-hidden">
    <div className="p-4 pb-2 flex gap-3">
      <AvatarPlaceholder />
      <div>
        <div className="font-semibold text-sm">Your Name</div>
        <div className="text-xs text-gray-400">Industry Expert • 1h</div>
      </div>
    </div>
    <div className="px-4 py-2 text-sm whitespace-pre-wrap">{post.text}</div>
    <div className="mt-2 w-full relative" style={{ aspectRatio: '4/3' }}>
      <img src={post.imageUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
    </div>
    <div className="px-4 py-2 border-t border-gray-700 flex justify-between text-gray-400">
      <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 rounded"><span className="text-lg">👍</span> Like</div>
      <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 rounded"><span className="text-lg">💬</span> Comment</div>
      <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 rounded"><span className="text-lg">🔁</span> Repost</div>
      <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 rounded"><span className="text-lg">✈️</span> Send</div>
    </div>
  </div>
);

const TwitterMockup = ({ post }: { post: GeneratedPost }) => (
  <div className="bg-black text-white border border-gray-800 rounded-lg font-sans max-w-md mx-auto p-4">
    <div className="flex gap-3">
      <div className="shrink-0"><AvatarPlaceholder /></div>
      <div className="w-full">
        <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm">Your Name</span>
            <span className="text-gray-500 text-sm">@yourhandle · 2h</span>
        </div>
        <div className="text-sm mt-1 whitespace-pre-wrap mb-3">{post.text}</div>
        <div className="w-full rounded-xl border border-gray-800 overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
            <img src={post.imageUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex justify-between mt-3 text-gray-500 max-w-xs">
            <CommentIcon />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <HeartIcon />
            <ShareIcon />
        </div>
      </div>
    </div>
  </div>
);

const InstagramMockup = ({ post }: { post: GeneratedPost }) => (
  <div className="bg-black text-white border border-gray-800 rounded-lg font-sans max-w-sm mx-auto overflow-hidden">
    <div className="p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] shrink-0">
         <div className="w-full h-full rounded-full bg-black p-[2px]">
            <AvatarPlaceholder />
         </div>
      </div>
      <span className="text-sm font-semibold">your_brand</span>
    </div>
    <div className="w-full relative" style={{ aspectRatio: '1/1' }}>
        <img src={post.imageUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
    </div>
    <div className="p-3">
      <div className="flex justify-between mb-3">
        <div className="flex gap-4">
          <HeartIcon />
          <CommentIcon />
          <ShareIcon />
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
      </div>
      <div className="text-sm">
        <span className="font-semibold mr-2">your_brand</span>
        <span className="whitespace-pre-wrap">{post.text}</span>
      </div>
    </div>
  </div>
);

const FacebookMockup = ({ post }: { post: GeneratedPost }) => (
  <div className="bg-gray-900 text-gray-100 rounded-lg border border-gray-700 font-sans max-w-md mx-auto overflow-hidden">
    <div className="p-3 flex gap-2 items-center">
      <AvatarPlaceholder />
      <div>
        <div className="font-semibold text-sm">Your Page</div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
             2h • <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16"><path d="M8 0a8 8 0 100 16A8 8 0 008 0z" /></svg>
        </div>
      </div>
    </div>
    <div className="px-3 pb-2 text-sm whitespace-pre-wrap">{post.text}</div>
    <div className="w-full relative" style={{ aspectRatio: '16/9' }}>
        <img src={post.imageUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
    </div>
    <div className="p-3 border-t border-gray-700 mt-2 flex justify-around text-gray-400 text-sm font-medium">
      <div className="flex items-center gap-2">Like</div>
      <div className="flex items-center gap-2">Comment</div>
      <div className="flex items-center gap-2">Share</div>
    </div>
  </div>
);

const WhatsAppMockup = ({ post }: { post: GeneratedPost }) => (
  <div className="bg-[#0b141a] rounded-lg border border-gray-800 font-sans max-w-sm mx-auto h-[500px] relative overflow-hidden flex flex-col">
    <div className="bg-[#202c33] p-3 flex items-center gap-3 z-20">
         <div className="text-brand-primary"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></div>
         <AvatarPlaceholder />
         <div className="font-semibold text-gray-100">Group Chat</div>
    </div>
    <div className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-50 absolute inset-0 top-14 z-0"></div>
    <div className="relative z-10 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-[#202c33] self-start rounded-lg rounded-tl-none p-2 max-w-[85%] text-gray-100 shadow-sm">
            <div className="mb-1 rounded-lg overflow-hidden relative w-full" style={{ aspectRatio: '1/1' }}>
                 <img src={post.imageUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="text-sm whitespace-pre-wrap">{post.text}</div>
            <div className="text-[10px] text-gray-400 text-right mt-1">12:30 PM</div>
        </div>
    </div>
  </div>
);

const TikTokMockup = ({ post }: { post: GeneratedPost }) => (
  <div className="bg-black text-white border border-gray-800 rounded-lg font-sans max-w-xs mx-auto relative overflow-hidden" style={{ aspectRatio: '9/16' }}>
     <img src={post.imageUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover opacity-80" />
     <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
     
     <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center">
        <AvatarPlaceholder />
        <div className="flex flex-col items-center"><HeartIcon /><span className="text-xs font-bold">12.5K</span></div>
        <div className="flex flex-col items-center"><CommentIcon /><span className="text-xs font-bold">842</span></div>
        <div className="flex flex-col items-center"><div className="bg-white/20 p-2 rounded-full"><ShareIcon /></div><span className="text-xs font-bold">Share</span></div>
     </div>

     <div className="absolute bottom-4 left-4 right-16">
        <div className="font-bold mb-1">@your_account</div>
        <div className="text-sm text-shadow whitespace-pre-wrap line-clamp-4">{post.text}</div>
        <div className="flex items-center gap-2 mt-2 text-xs font-bold">
             <div className="w-4 h-4 rounded-full bg-gray-200 animate-spin"></div> Original Sound - Your Music
        </div>
     </div>
  </div>
);

const ThreadsMockup = ({ post }: { post: GeneratedPost }) => (
  <div className="bg-[#101010] text-white border border-gray-800 rounded-lg font-sans max-w-md mx-auto p-4">
      <div className="flex gap-3">
          <div className="flex flex-col items-center gap-2 shrink-0">
              <AvatarPlaceholder />
              <div className="w-0.5 flex-grow bg-gray-800 my-2 rounded-full"></div>
          </div>
          <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">your_username</span>
                  <div className="flex items-center gap-3 text-gray-500">
                      <span className="text-sm">4h</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z" /></svg>
                  </div>
              </div>
              <div className="text-sm mb-3 whitespace-pre-wrap">{post.text}</div>
              <div className="rounded-xl overflow-hidden border border-gray-800 mb-3 relative w-full" style={{ aspectRatio: '3/4' }}>
                  <img src={post.imageUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex gap-4">
                  <HeartIcon />
                  <CommentIcon />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <ShareIcon />
              </div>
          </div>
      </div>
  </div>
);


// --- Main Modal ---

export default function PreviewModal({ isVisible, onClose, posts }: PreviewModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);

  if (!isVisible) return null;

  // Initialize selection
  if (!selectedPlatform && posts.length > 0) {
      setSelectedPlatform(posts[0].platform);
  }

  const activePost = posts.find(p => p.platform === selectedPlatform) || posts[0];

  const renderMockup = () => {
      if (!activePost) return <div className="text-center p-10">No post available</div>;

      switch (activePost.platform) {
          case SocialPlatform.LinkedIn: return <LinkedInMockup post={activePost} />;
          case SocialPlatform.Twitter: return <TwitterMockup post={activePost} />;
          case SocialPlatform.Instagram: return <InstagramMockup post={activePost} />;
          case SocialPlatform.Facebook: return <FacebookMockup post={activePost} />;
          case SocialPlatform.WhatsApp: return <WhatsAppMockup post={activePost} />;
          case SocialPlatform.TikTok: return <TikTokMockup post={activePost} />;
          case SocialPlatform.Threads: return <ThreadsMockup post={activePost} />;
          default: return <div className="text-center p-10">Preview not available for this platform.</div>;
      }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-dark-card rounded-2xl shadow-2xl border border-dark-border w-full max-w-6xl h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar for Platform Selection */}
        <div className="bg-gray-900 md:w-64 md:border-r border-b md:border-b-0 border-dark-border flex md:flex-col overflow-x-auto md:overflow-y-auto scrollbar-hide shrink-0">
            <div className="p-4 font-bold text-lg border-b border-dark-border hidden md:block text-center bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
                Feed Preview
            </div>
            {posts.map((post) => {
                const config = PLATFORM_CONFIG[post.platform];
                const isSelected = selectedPlatform === post.platform;
                return (
                    <button
                        key={post.platform}
                        onClick={() => setSelectedPlatform(post.platform)}
                        className={`flex items-center gap-3 p-4 transition-colors whitespace-nowrap ${
                            isSelected 
                            ? 'bg-gray-800 border-l-4 border-brand-primary text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-4 border-transparent'
                        }`}
                    >
                        <span className={`p-1.5 rounded-full ${config.color} text-white scale-75`}>
                            {React.cloneElement(config.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { width: 16, height: 16 })}
                        </span>
                        <span className="font-medium">{post.platform}</span>
                    </button>
                );
            })}
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-[#111] flex flex-col relative">
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={onClose}
                    className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-neutral-950">
                <div className="w-full max-w-lg animate-fade-in">
                     {renderMockup()}
                </div>
            </div>
            
            {/* Mobile close button if header is hidden/overlayed */}
            <div className="md:hidden p-4 border-t border-dark-border bg-dark-card flex justify-center">
                 <button onClick={onClose} className="text-sm font-bold text-medium-text uppercase tracking-wider">Close Preview</button>
            </div>
        </div>
      </div>
    </div>
  );
}
