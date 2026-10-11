import React, { useState } from "react";

/**
 * ==============================================================================
 * 📸 POSTCARD COMPONENT - INSTAGRAM CLONE (FEED API DATA MAPPING EDITION)
 * ==============================================================================
 * 📌 FEED API COMPATIBILITY:
 * Maps real backend data structure from Feed API:
 * - `post.caption` -> Post text caption
 * - `post.imageUrl` -> Array of objects [{ url, fileId, _id }] ya direct URLs
 * - `user` (ya `post.user`) -> { username, profileImage, bio, email, _id }
 * - `post.createdAt` -> Dynamic relative timestamp calculation (e.g. 2h, 1d)
 * - `post.likes` & `post.comments` -> Real count or formatted defaults
 * ==============================================================================
 */

// ==============================================================================
// ⏱️ HELPER: RELATIVE TIME FORMATTER (e.g. "2h", "1d", "3w")
// ==============================================================================
const formatTimeAgo = (dateString) => {
  if (!dateString) return "2h";
  try {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  } catch {
    return "2h";
  }
};

const PostCard = ({ user, post }) => {
  // ============================================================================
  // 🧭 1. DATA EXTRACTION & FEED API MAPPING (BULLETPROOF NORMALIZATION)
  // ============================================================================

  // 1. Author Data: Parent se 'user' prop mile ya 'post.user' se aaye, dono handle karta hai
  const author = user || post?.user || {};
  const username = author?.username || "SOKA";
  const profileImage = author?.profileImage || "";

  // 2. Images Data Normalization:
  // Feed API sends: post.imageUrl = [ { url: 'https://...', fileId: '...', _id: '...' }, ... ]
  // Yeh parser handle karta hai:
  // - Array of Objects: [{ url: "..." }] -> extracts .url
  // - Array of Strings: ["https://..."] -> direct string
  // - Single String: post.imageUrl = "https://..."
  // - Fallback to post.images
  const rawImages = post?.imageUrl || post?.images || [];
  const images = (Array.isArray(rawImages) ? rawImages : [rawImages])
    .map((item) => (typeof item === "string" ? item : item?.url || ""))
    .filter(Boolean);

  // 3. Caption Data
  const caption = post?.caption || "";

  // 4. Relative Timestamp from post.createdAt
  const timeAgo = formatTimeAgo(post?.createdAt);

  // 5. Likes Count (Feed API array of likes ya number ya formatted string)
  const likesCount = Array.isArray(post?.likes)
    ? post.likes.length
    : typeof post?.likes === "number"
      ? post.likes
      : post?.likesCount || "353K";

  // ============================================================================
  // 🎛️ 2. LOCAL STATE MANAGEMENT
  // ============================================================================

  // Carousel slide tracking
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // User interactions (Like & Bookmark)
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Double tap pop-up heart animation
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  // Caption "more" / "less" toggle
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  // Inline comment input state
  const [commentText, setCommentText] = useState("");

  // Caption truncation length threshold
  const CAPTION_THRESHOLD = 75;
  const isLongCaption = caption.length > CAPTION_THRESHOLD;

  // ============================================================================
  // ⚡ 3. INTERACTION HANDLERS
  // ============================================================================

  // Carousel previous slide
  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Carousel next slide
  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : prev,
    );
  };

  // Double-click on media -> trigger heart animation & like
  const handleImageDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
    }
    setShowHeartOverlay(true);
    setTimeout(() => {
      setShowHeartOverlay(false);
    }, 900);
  };

  return (
    <div className="w-full max-w-[470px] mx-auto bg-black text-white font-sans border-b border-zinc-800/80 sm:border sm:border-zinc-800/70 sm:rounded-xl my-0 sm:my-4 overflow-hidden select-none">
      {/* 
        ======================================================================
        👤 HEADER SECTION (Mapped with Feed API: user.profileImage & user.username)
        ======================================================================
      */}
      <div className="flex items-center justify-between px-3.5 py-3">
        {/* Left Side: Avatar + Username + Verified Badge + Timestamp */}
        <div className="flex items-center gap-3">
          {/* User Profile Avatar with Instagram Story Gradient Ring */}
          <div className="p-[1.5px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200">
            {profileImage ? (
              <img
                src={profileImage}
                alt={username}
                className="w-8 h-8 rounded-full object-cover border-2 border-black"
                onError={(e) => {
                  // Fallback agar ImageKit URL load na ho sake
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              /* Fallback Initial Avatar */
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f85032] to-[#e73827] flex items-center justify-center text-white text-xs font-bold border-2 border-black">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          {/* Username & Metadata */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="font-semibold text-white hover:underline cursor-pointer tracking-tight">
              {username}
            </span>

            {/* Official Instagram Verified Badge (Matching Design) */}
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#d62976] text-white">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>

            {/* Dot Separator & Calculated TimeAgo */}
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-normal">{timeAgo}</span>
          </div>
        </div>

        {/* Right Side: Options Menu */}
        <button
          type="button"
          aria-label="More options"
          className="text-zinc-400 hover:text-white transition-colors p-1 rounded-full active:scale-95"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="6" cy="12" r="1.75" />
            <circle cx="18" cy="12" r="1.75" />
          </svg>
        </button>
      </div>

      {/* 
        ======================================================================
        🖼️ CAROUSEL MEDIA ENGINE (Mapped with post.imageUrl array)
        ======================================================================
      */}
      <div
        onDoubleClick={handleImageDoubleClick}
        className="relative w-full aspect-square bg-[#121212] overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {/* Dynamic Image Slides Track */}
        {images.length > 0 ? (
          <div
            className="flex w-full h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((imgUrl, idx) => (
              <div key={idx} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={imgUrl}
                  alt={`Post by ${username} - slide ${idx + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder Fallback (If no images returned) */
          <div className="w-full h-full bg-gradient-to-br from-[#2c2b30] via-[#1a191d] to-[#0f0e11] flex flex-col items-center justify-center p-6 text-zinc-500">
            <svg
              className="w-16 h-16 stroke-current stroke-1 fill-none mb-2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs">No image available</span>
          </div>
        )}

        {/* 
          --------------------------------------------------------------------
          ❤️ DOUBLE-TAP POPPING HEART OVERLAY
          --------------------------------------------------------------------
        */}
        {showHeartOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping duration-700">
            <svg
              className="w-28 h-28 text-white fill-[#ff3040] drop-shadow-[0_10px_25px_rgba(255,48,64,0.6)]"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}

        {/* 
          --------------------------------------------------------------------
          🔢 CAROUSEL IMAGE COUNTER PILL (e.g. 1/3)
          --------------------------------------------------------------------
        */}
        {images.length > 1 && (
          <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md pointer-events-none z-20">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}

        {/* 
          --------------------------------------------------------------------
          ◀️ PREVIOUS BUTTON (Appears when not on first slide)
          --------------------------------------------------------------------
        */}
        {images.length > 1 && currentImageIndex > 0 && (
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous image"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-lg transition-transform active:scale-90 z-20"
          >
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* 
          --------------------------------------------------------------------
          ▶️ NEXT BUTTON (Appears when not on last slide)
          --------------------------------------------------------------------
        */}
        {images.length > 1 && currentImageIndex < images.length - 1 && (
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next image"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-lg transition-transform active:scale-90 z-20"
          >
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* 
        ======================================================================
        🔘 ACTION BUTTONS ROW (Like, Comment, Share, Indicator Dots, Save)
        ======================================================================
      */}
      <div className="px-3.5 pt-3 pb-2 flex items-center justify-between relative">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Like Heart Button */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            aria-label={isLiked ? "Unlike" : "Like"}
            className="transition-transform active:scale-125 focus:outline-none"
          >
            {post.liked ? (
              <svg
                className="w-6 h-6 text-[#ff3040] fill-current animate-heartbeat"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white hover:text-zinc-400 stroke-current stroke-2 fill-none transition-colors"
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </button>

          {/* Comment Bubble Icon */}
          <button
            type="button"
            aria-label="Comment"
            className="text-white hover:text-zinc-400 active:scale-95 transition-all"
          >
            <svg
              className="w-6 h-6 stroke-current stroke-2 fill-none -rotate-90"
              viewBox="0 0 24 24"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </button>

          {/* Direct Share / Paper Airplane Icon */}
          <button
            type="button"
            aria-label="Share post"
            className="text-white hover:text-zinc-400 active:scale-95 transition-all"
          >
            <svg
              className="w-6 h-6 stroke-current stroke-2 fill-none"
              viewBox="0 0 24 24"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* 
          --------------------------------------------------------------------
          🎯 CENTER: DYNAMIC CAROUSEL DOT INDICATORS
          (Active dot is bright Instagram blue, inactive dots are subtle)
          --------------------------------------------------------------------
        */}
        {images.length > 1 && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentImageIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`rounded-full transition-all duration-300 ease-in-out ${
                  currentImageIndex === dotIdx
                    ? "w-1.5 h-1.5 bg-[#0095f6] scale-125"
                    : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        )}

        {/* Right Action: Bookmark / Save Post */}
        <button
          type="button"
          onClick={() => setIsSaved(!isSaved)}
          aria-label={isSaved ? "Remove from saved" : "Save post"}
          className="text-white hover:text-zinc-400 active:scale-95 transition-all focus:outline-none"
        >
          {isSaved ? (
            <svg
              className="w-6 h-6 fill-current text-white"
              viewBox="0 0 24 24"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 stroke-current stroke-2 fill-none"
              viewBox="0 0 24 24"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* 
        ======================================================================
        📊 LIKES, CAPTION (post.caption) & COMMENTS SECTION
        ======================================================================
      */}
      <div className="px-3.5 space-y-1.5 pb-2">
        {/* Likes Count */}
        <div className="text-sm font-semibold text-white tracking-tight">
          {typeof likesCount === "number"
            ? `${likesCount.toLocaleString()} likes`
            : `${likesCount} likes`}
        </div>

        {/* 
          --------------------------------------------------------------------
          📝 CAPTION ENGINE (Mapped to post.caption & username)
          --------------------------------------------------------------------
        */}
        <div className="text-sm text-zinc-100 leading-snug">
          <span className="font-semibold text-white mr-2 hover:underline cursor-pointer">
            {username}
          </span>

          {/* Render Caption Content */}
          <span className="text-zinc-200">
            {isLongCaption && !isCaptionExpanded
              ? `${caption.slice(0, CAPTION_THRESHOLD)}...`
              : caption}
          </span>

          {/* "more" / "less" Toggle Button */}
          {isLongCaption && (
            <button
              type="button"
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="ml-1.5 text-zinc-500 hover:text-zinc-300 text-xs font-normal transition-colors"
            >
              {isCaptionExpanded ? "less" : "more"}
            </button>
          )}
        </div>

        {/* View All Comments Link */}
        <div className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-400 cursor-pointer pt-0.5 transition-colors">
          View all 308 comments
        </div>

        {/* 
          --------------------------------------------------------------------
          💬 INLINE COMMENT INPUT ROW
          --------------------------------------------------------------------
        */}
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-900/90 mt-2">
          {/* Small User Avatar in Comment Box */}
          <div className="w-5 h-5 rounded-full overflow-hidden bg-gradient-to-tr from-[#f85032] to-[#e73827] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </div>

          {/* Comment text input */}
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
          />

          {/* Dynamic "Post" button appears only when text is entered */}
          {commentText.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setCommentText("")}
              className="text-xs font-semibold text-[#0095f6] hover:text-blue-400 transition-colors"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
