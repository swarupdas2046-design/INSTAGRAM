import React, { useContext, useEffect } from "react";
import PostCard from "../components/PostCard";
import { UsePost } from "../hooks/UsePost";
import { AuthContext } from "../../AuthProvider";
import SuggestedUsers from "./SuggestedUsers";

// ==============================================================================
// 🏠 HOME FEED PAGE - Followed users ke posts + Suggested users
// ==============================================================================
const Feed = () => {
  const { loading, feed, GetAllFeed } = UsePost();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    GetAllFeed();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-3" />
        <span className="text-zinc-400 text-sm">Loading feed...</span>
      </div>
    );
  }

  // Agar feed empty hai (kisi ko follow nahi kiya) toh empty state aur suggested users dikhao
  const isEmpty = !feed || feed.length === 0;

  return (
    <div className="min-h-screen bg-black">
      <div className="flex max-w-5xl mx-auto">
        {/* Main Feed Column */}
        <div className="flex-1 max-w-[470px] mx-auto py-4">
          {isEmpty ? (
            // Empty state - Instagram-style message
            <div className="flex flex-col items-center justify-center px-6 pt-16 pb-10 text-center">
              {/* Illustration */}
              <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-900/20">
                <svg className="w-10 h-10 text-white stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Get fresh updates here
              </h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-xs leading-relaxed">
                When you follow accounts, their posts will appear here. Start following people to personalize your home feed.
              </p>
              {/* Suggested users shown prominently on empty state */}
              <div className="w-full">
                <p className="text-zinc-300 font-semibold text-sm mb-4 text-left">Suggested for you</p>
                <SuggestedUsers compact={false} />
              </div>
            </div>
          ) : (
            // Actual feed with posts
            <>
              {/* Mobile par desktop sidebar hidden hota hai, isliye suggestions feed ke upar dikhate hain. */}
              <div className="lg:hidden px-4 pb-4 mb-2 border-b border-zinc-900">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-500 text-xs font-semibold">Suggested for you</span>
                </div>
                <SuggestedUsers compact={true} />
              </div>

              {feed.map((post) => (
                <PostCard
                  key={post._id}
                  user={post.user}
                  post={post}
                />
              ))}
            </>
          )}
        </div>

        {/* Right Sidebar: Suggested users (desktop only, when feed has content) */}
        {!isEmpty && (
          <div className="hidden lg:block w-[320px] flex-shrink-0 py-6 pl-8 sticky top-0 self-start">
            {/* Current user info */}
            {user && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-500/30">
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{user.username}</p>
                  <p className="text-zinc-500 text-xs">{user.name || user.bio || ""}</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-500 text-xs font-semibold">Suggested for you</span>
            </div>
            <SuggestedUsers compact={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
