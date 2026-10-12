import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { followUserApi, getSuggestedUsersApi, unfollowUserApi } from "../../auth/services/userApi";
import { toast, Zoom } from "react-toastify";

// ==============================================================================
// 👥 SUGGESTED USERS COMPONENT
// Hinglish: Yeh component un users ko suggest karta hai jinhe current user
// abhi follow nahi karta. 'compact' prop se sidebar ya full view control hota hai.
// ==============================================================================
const SuggestedUsers = ({ compact = true }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track karein ki kaun kaun follow ho gaye hain
  const [followedSet, setFollowedSet] = useState(new Set());
  const [loadingSet, setLoadingSet] = useState(new Set());

  useEffect(() => {
    const fetchSuggested = async () => {
      setLoading(true);
      try {
        const response = await getSuggestedUsersApi();
        setUsers(response.data || []);
      } catch (error) {
        console.log("Suggested users fetch error:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggested();
  }, []);

  const handleFollow = async (username) => {
    if (loadingSet.has(username)) return;

    // Optimistic update
    setLoadingSet((prev) => new Set(prev).add(username));

    try {
      if (followedSet.has(username)) {
        // Unfollow karna
        await unfollowUserApi(username);
        setFollowedSet((prev) => {
          const next = new Set(prev);
          next.delete(username);
          return next;
        });
        toast.info(`Unfollowed ${username}`, { theme: "dark", transition: Zoom });
      } else {
        // Follow karna
        await followUserApi(username);
        setFollowedSet((prev) => new Set(prev).add(username));
        toast.success(`Now following ${username}!`, { theme: "dark", transition: Zoom });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed", {
        theme: "dark",
        transition: Zoom,
      });
    } finally {
      setLoadingSet((prev) => {
        const next = new Set(prev);
        next.delete(username);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-5 h-5 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <p className="text-zinc-600 text-xs text-center py-4">
        No suggestions available right now
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${compact ? "" : "max-w-sm mx-auto"}`}>
      {users.slice(0, compact ? 5 : 15).map((user) => {
        const isFollowed = followedSet.has(user.username);
        const isLoading = loadingSet.has(user.username);

        return (
          <div key={user._id || user.username} className="flex items-center justify-between gap-3">
            {/* User Info */}
            <div
              onClick={() => navigate(`/app/profile/${user.username}`)}
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-zinc-700">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992";
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user.username}</p>
                <p className="text-zinc-500 text-xs truncate">
                  {user.name || user.bio || "Suggested for you"}
                </p>
              </div>
            </div>

            {/* Follow / Following Button */}
            <button
              onClick={() => handleFollow(user.username)}
              disabled={isLoading}
              className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                isFollowed
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  : "text-[#0095f6] hover:text-blue-400"
              } disabled:opacity-50`}
            >
              {isLoading ? "..." : isFollowed ? "Following" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
