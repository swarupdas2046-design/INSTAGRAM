import React, { useEffect } from "react";
import PostCard from "../components/PostCard";
import { UsePost } from "../hooks/UsePost";

// ==============================================================================
// 🌍 EXPLORE / REELS DISCOVERY PAGE
// Hinglish: Yeh page sabhi users ke posts dikhata hai - followed aur non-followed dono.
// Navigation me "Reels" click karne par yahi page open hoga.
// ==============================================================================
const Explore = () => {
  const { loading, feed, GetExploreFeed } = UsePost();

  useEffect(() => {
    // Explore page load hone par global discovery feed fetch karte hain
    GetExploreFeed();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-3" />
        <span className="text-zinc-400 text-sm">Loading explore...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4">
      <div className="max-w-[470px] mx-auto px-0">
        {/* Header */}
        <div className="px-4 mb-4">
          <h1 className="text-white text-lg font-bold">Explore</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Discover posts from everyone</p>
        </div>

        {!feed || feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-zinc-600 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No posts to explore yet</p>
          </div>
        ) : (
          feed.map((post) => (
            <PostCard key={post._id} user={post.user} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
