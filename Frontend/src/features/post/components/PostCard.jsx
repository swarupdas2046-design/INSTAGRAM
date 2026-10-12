import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthProvider";
import { UsePost } from "../hooks/UsePost";

// ==============================================================================
// ⏱️ RELATIVE TIME HELPER
// ==============================================================================
const formatTimeAgo = (dateString) => {
  if (!dateString) return "2h";
  try {
    const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return `${Math.floor(diff / 604800)}w`;
  } catch {
    return "2h";
  }
};

// ==============================================================================
// 💬 COMMENTS MODAL COMPONENT
// ==============================================================================
const CommentsModal = ({ postId, onClose, fetchComments, submitComment, deleteComment, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchComments(postId);
      setComments(data);
      setLoading(false);
    };
    load();
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    const comment = await submitComment(postId, newComment.trim());
    if (comment) {
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    const success = await deleteComment(postId, commentId);
    if (success) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h3 className="font-semibold text-white text-sm">Comments</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-zinc-500 text-center text-sm py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <div
                  onClick={() => { navigate(`/app/profile/${comment.user?.username}`); onClose(); }}
                  className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={comment.user?.profileImage}
                    alt={comment.user?.username}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
                  />
                </div>
                <div className="flex-1">
                  <span
                    onClick={() => { navigate(`/app/profile/${comment.user?.username}`); onClose(); }}
                    className="font-semibold text-white text-xs mr-2 cursor-pointer hover:underline"
                  >
                    {comment.user?.username}
                  </span>
                  <span className="text-zinc-200 text-sm">{comment.text}</span>
                  <div className="text-zinc-600 text-xs mt-1">{formatTimeAgo(comment.createdAt)}</div>
                </div>
                {/* Sirf apne comment delete kar sakte hain */}
                {currentUser && comment.user?._id === currentUser._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="border-t border-zinc-800 px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={currentUser?.profileImage}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
            />
          </div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          {newComment.trim() && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="text-xs font-semibold text-[#0095f6] hover:text-blue-400 transition-colors disabled:opacity-50"
            >
              {submitting ? "..." : "Post"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// ❤️ LIKES MODAL COMPONENT
// ==============================================================================
const LikesModal = ({ postId, onClose, fetchLikes }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchLikes(postId);
      setUsers(data);
      setLoading(false);
    };
    load();
  }, [postId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#1a1a1a] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h3 className="font-semibold text-white text-sm">Likes</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-zinc-500 text-center text-sm py-8">No likes yet</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id || user.username}
                onClick={() => { navigate(`/app/profile/${user.username}`); onClose(); }}
                className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
                  />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{user.username}</div>
                  {user.name && <div className="text-zinc-500 text-xs">{user.name}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 📸 POST CARD COMPONENT - MAIN
// ==============================================================================
const PostCard = ({ user: userProp, post: postProp }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const {
    handleLike,
    handleUnlike,
    handleSavePost,
    handleUnsavePost,
    fetchPostLikes,
    fetchPostComments,
    submitComment,
    deleteComment,
  } = UsePost();

  // ---------------------------------------------------------------------------
  // Data Normalization
  // ---------------------------------------------------------------------------
  const author = userProp || postProp?.user || {};
  const username = author?.username || "user";
  const profileImage = author?.profileImage || "";

  const rawImages = postProp?.imageUrl || postProp?.images || [];
  const images = (Array.isArray(rawImages) ? rawImages : [rawImages])
    .map((item) => (typeof item === "string" ? item : item?.url || ""))
    .filter(Boolean);

  const caption = postProp?.caption || "";
  const timeAgo = formatTimeAgo(postProp?.createdAt);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------
  const [isLiked, setIsLiked] = useState(postProp?.liked || false);
  const [likesCount, setLikesCount] = useState(postProp?.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(postProp?.commentsCount || 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(postProp?.saved || false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const CAPTION_THRESHOLD = 80;
  const isLongCaption = caption.length > CAPTION_THRESHOLD;

  useEffect(() => {
    setIsLiked(postProp?.liked || false);
    setLikesCount(postProp?.likesCount || 0);
    setCommentsCount(postProp?.commentsCount || 0);
    setIsSaved(postProp?.saved || false);
  }, [postProp?._id, postProp?.liked, postProp?.likesCount, postProp?.commentsCount, postProp?.saved]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((p) => (p > 0 ? p - 1 : p));
  };
  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((p) => (p < images.length - 1 ? p + 1 : p));
  };

  const handleImageDoubleClick = () => {
    if (!isLiked) toggleLike();
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 900);
  };

  const toggleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    if (isLiked) {
      setIsLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
      const result = await handleUnlike(postProp._id);
      if (result !== null) {
        setLikesCount(result.likesCount);
      } else {
        // Revert on failure
        setIsLiked(true);
        setLikesCount((c) => c + 1);
      }
    } else {
      setIsLiked(true);
      setLikesCount((c) => c + 1);
      const result = await handleLike(postProp._id);
      if (result !== null) {
        setLikesCount(result.likesCount);
      } else {
        setIsLiked(false);
        setLikesCount((c) => Math.max(0, c - 1));
      }
    }
    setLikeLoading(false);
  };

  const handleInlineComment = async () => {
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    const comment = await submitComment(postProp._id, commentText.trim());
    if (comment) {
      setCommentText("");
      setCommentsCount((c) => c + 1);
    }
    setSubmittingComment(false);
  };

  const handleCommentFromModal = async (postId, text) => {
    const comment = await submitComment(postId, text);
    if (comment) setCommentsCount((c) => c + 1);
    return comment;
  };

  const handleDeleteCommentFromModal = async (postId, commentId) => {
    const success = await deleteComment(postId, commentId);
    if (success) setCommentsCount((c) => Math.max(0, c - 1));
    return success;
  };

  const toggleSave = async () => {
    if (saveLoading) return;
    setSaveLoading(true);

    if (isSaved) {
      setIsSaved(false);
      const result = await handleUnsavePost(postProp._id);
      if (result === null) setIsSaved(true);
    } else {
      setIsSaved(true);
      const result = await handleSavePost(postProp._id);
      if (result === null) setIsSaved(false);
    }

    setSaveLoading(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Comments Modal */}
      {showCommentsModal && (
        <CommentsModal
          postId={postProp._id}
          onClose={() => setShowCommentsModal(false)}
          fetchComments={fetchPostComments}
          submitComment={handleCommentFromModal}
          deleteComment={handleDeleteCommentFromModal}
          currentUser={currentUser}
        />
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <LikesModal
          postId={postProp._id}
          onClose={() => setShowLikesModal(false)}
          fetchLikes={fetchPostLikes}
        />
      )}

      <div className="w-full max-w-[470px] mx-auto bg-black text-white font-sans border-b border-zinc-800/80 sm:border sm:border-zinc-800/70 sm:rounded-xl my-0 sm:my-4 overflow-hidden select-none">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-3">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate(`/app/profile/${username}`)}
              className="p-[1.5px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 rounded-full cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                src={profileImage || "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"}
                alt={username}
                className="w-8 h-8 rounded-full object-cover border-2 border-black"
                onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span
                onClick={() => navigate(`/app/profile/${username}`)}
                className="font-semibold text-white hover:underline cursor-pointer"
              >
                {username}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 text-xs">{timeAgo}</span>
            </div>
          </div>
          <button className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors active:scale-95">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="6" cy="12" r="1.75" />
              <circle cx="18" cy="12" r="1.75" />
            </svg>
          </button>
        </div>

        {/* Image Carousel */}
        <div
          onDoubleClick={handleImageDoubleClick}
          className="relative w-full aspect-square bg-[#121212] overflow-hidden flex items-center justify-center cursor-pointer"
        >
          {images.length > 0 ? (
            <div
              className="flex w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((imgUrl, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0">
                  <img
                    src={imgUrl}
                    alt={`Post ${idx + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 text-xs">
              No image
            </div>
          )}

          {/* Heart overlay on double tap */}
          {showHeartOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
              <svg className="w-28 h-28 text-white fill-[#ff3040] drop-shadow-[0_10px_25px_rgba(255,48,64,0.6)]" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}

          {/* Carousel counter */}
          {images.length > 1 && (
            <div className="absolute top-3.5 right-3.5 bg-black/70 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full pointer-events-none z-20">
              {currentImageIndex + 1}/{images.length}
            </div>
          )}

          {images.length > 1 && currentImageIndex > 0 && (
            <button onClick={handlePrevSlide} className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-lg z-20 active:scale-90">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
          )}
          {images.length > 1 && currentImageIndex < images.length - 1 && (
            <button onClick={handleNextSlide} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-lg z-20 active:scale-90">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          )}
        </div>

        {/* Actions Row */}
        <div className="px-3.5 pt-3 pb-2 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <button
              onClick={toggleLike}
              disabled={likeLoading}
              className="transition-transform active:scale-125 focus:outline-none disabled:opacity-70"
            >
              {isLiked ? (
                <svg className="w-6 h-6 text-[#ff3040] fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white hover:text-zinc-400 stroke-current stroke-2 fill-none transition-colors" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
            </button>

            {/* Comment button */}
            <button
              onClick={() => setShowCommentsModal(true)}
              className="text-white hover:text-zinc-400 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6 stroke-current stroke-2 fill-none -rotate-90" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>

            {/* Share */}
            <button className="text-white hover:text-zinc-400 active:scale-95 transition-all">
              <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Carousel dots */}
          {images.length > 1 && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentImageIndex(dotIdx)}
                  className={`rounded-full transition-all duration-300 ${currentImageIndex === dotIdx ? "w-1.5 h-1.5 bg-[#0095f6] scale-125" : "w-1.5 h-1.5 bg-zinc-600"}`}
                />
              ))}
            </div>
          )}

          {/* Bookmark */}
          <button
            onClick={toggleSave}
            disabled={saveLoading}
            className="text-white hover:text-zinc-400 active:scale-95 transition-all disabled:opacity-60"
          >
            {isSaved ? (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Stats & Caption */}
        <div className="px-3.5 space-y-1.5 pb-2">
          {/* Likes count - clickable to show who liked */}
          <button
            onClick={() => likesCount > 0 && setShowLikesModal(true)}
            className="text-sm font-semibold text-white tracking-tight hover:text-zinc-300 transition-colors text-left"
          >
            {likesCount.toLocaleString()} {likesCount === 1 ? "like" : "likes"}
          </button>

          {/* Caption */}
          {caption && (
            <div className="text-sm text-zinc-100 leading-snug">
              <span
                onClick={() => navigate(`/app/profile/${username}`)}
                className="font-semibold text-white mr-2 hover:underline cursor-pointer"
              >
                {username}
              </span>
              <span className="text-zinc-200">
                {isLongCaption && !isCaptionExpanded
                  ? `${caption.slice(0, CAPTION_THRESHOLD)}...`
                  : caption}
              </span>
              {isLongCaption && (
                <button
                  onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                  className="ml-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                >
                  {isCaptionExpanded ? "less" : "more"}
                </button>
              )}
            </div>
          )}

          {/* View all comments link */}
          {commentsCount > 0 && (
            <button
              onClick={() => setShowCommentsModal(true)}
              className="text-xs text-zinc-500 hover:text-zinc-400 cursor-pointer transition-colors block text-left"
            >
              View all {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
            </button>
          )}

          {/* Inline comment input */}
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-900/90 mt-2">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={currentUser?.profileImage || "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
              />
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInlineComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
            />
            {commentText.trim().length > 0 && (
              <button
                onClick={handleInlineComment}
                disabled={submittingComment}
                className="text-xs font-semibold text-[#0095f6] hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                {submittingComment ? "..." : "Post"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
