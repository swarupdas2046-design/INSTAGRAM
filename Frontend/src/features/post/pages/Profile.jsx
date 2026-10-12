import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../AuthProvider";
import {
  followUserApi,
  getFollowersApi,
  getFollowingApi,
  getUserProfileApi,
  unfollowUserApi,
  updateUserProfileApi,
} from "../../auth/services/userApi";
import { UsePost } from "../hooks/UsePost";
import { toast, Zoom } from "react-toastify";
import PostCard from "../components/PostCard";

// ==============================================================================
// 📷 PROFILE GRID POST THUMBNAIL
// ==============================================================================
const PostThumbnail = ({ post, onClick }) => {
  const firstImage =
    typeof post?.imageUrl?.[0] === "object"
      ? post.imageUrl[0].url
      : post?.imageUrl?.[0] || "";

  return (
    <div
      onClick={() => onClick(post)}
      className="relative aspect-square bg-zinc-900 overflow-hidden cursor-pointer group"
    >
      <img
        src={firstImage}
        alt="post"
        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-200"
        loading="lazy"
        onError={(e) => { e.currentTarget.src = ""; }}
      />
      {/* Hover overlay with likes & comments */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6">
        <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {post?.likesCount || 0}
        </div>
        <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post?.commentsCount || 0}
        </div>
      </div>
      {/* Multi-image indicator */}
      {post?.imageUrl?.length > 1 && (
        <div className="absolute top-2 right-2">
          <svg className="w-4 h-4 text-white fill-white drop-shadow-md" viewBox="0 0 24 24">
            <path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zm-9 11l-5-4 1.41-1.41L12 11.17l7.59-7.58L21 5l-9 9z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// 👤 FOLLOWERS / FOLLOWING MODAL
// ==============================================================================
const UserListModal = ({ title, users, onClose, navigate }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm bg-[#1a1a1a] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[70vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors">
          <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {users.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">No users yet</p>
        ) : (
          users.map((u) => (
            <div
              key={u._id || u.username}
              onClick={() => { navigate(`/app/profile/${u.username}`); onClose(); }}
              className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={u.profileImage}
                  alt={u.username}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
                />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{u.username}</p>
                {u.name && <p className="text-zinc-500 text-xs">{u.name}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

// ==============================================================================
// PROFILE POST DETAIL MODAL
// ==============================================================================
const ProfilePostModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-sm px-0 sm:px-4 py-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 z-[95] text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-zinc-900 transition-colors"
        aria-label="Close post"
      >
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="w-full max-w-[520px] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile grid se post open karne par existing feed card reuse kar rahe hain. */}
        <PostCard user={post.user} post={post} />
      </div>
    </div>
  );
};

// ==============================================================================
// ✏️ EDIT PROFILE MODAL
// ==============================================================================
const EditProfileModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || "");
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }
      const response = await updateUserProfileApi(formData);
      if (response && response.data) {
        onSave(response.data);
        toast.success("Profile updated!", { theme: "dark", transition: Zoom });
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed", {
        theme: "dark",
        transition: Zoom,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#1a1a1a] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h3 className="text-white font-semibold text-sm">Edit Profile</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-zinc-700">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
              />
            </div>
            <label className="text-[#0095f6] text-sm font-semibold cursor-pointer hover:text-blue-400 transition-colors">
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 text-xs font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-zinc-500 text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-zinc-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 text-xs font-semibold">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-zinc-500 text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#0095f6] hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 👤 PROFILE PAGE - MAIN COMPONENT
// ==============================================================================
const Profile = () => {
  const { username: paramUsername } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUserState } = useContext(AuthContext);
  const { GetSavedPosts, GetUserPosts } = UsePost();

  // Determine karna ki kiska profile dekhna hai
  const targetUsername = paramUsername || currentUser?.username;
  const isOwnProfile = targetUsername === currentUser?.username;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // posts | saved
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(false);

  // Profile + posts ek saath load karna
  useEffect(() => {
    if (!targetUsername) return;
    loadProfile();
    loadPosts();
  }, [targetUsername]);

  useEffect(() => {
    if (activeTab === "saved" && isOwnProfile) {
      loadSavedPosts();
    }
  }, [activeTab, isOwnProfile]);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await getUserProfileApi(targetUsername);
      if (response && response.data) {
        setProfile(response.data);
        setIsFollowing(response.data.isFollowing || false);
      }
    } catch (error) {
      console.log("Profile load error:", error.response?.data);
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadPosts = async () => {
    const data = await GetUserPosts(targetUsername);
    setPosts(data);
  };

  const loadSavedPosts = async () => {
    setLoadingSavedPosts(true);
    const data = await GetSavedPosts();
    setSavedPosts(data);
    setLoadingSavedPosts(false);
  };

  // Follow / Unfollow toggle
  const handleFollowToggle = async () => {
    if (followLoading || isOwnProfile) return;
    setFollowLoading(true);

    try {
      if (isFollowing) {
        await unfollowUserApi(targetUsername);
        setIsFollowing(false);
        setProfile((prev) =>
          prev ? { ...prev, followersCount: Math.max(0, (prev.followersCount || 0) - 1) } : prev
        );
        toast.info(`Unfollowed ${targetUsername}`, { theme: "dark" });
      } else {
        await followUserApi(targetUsername);
        setIsFollowing(true);
        setProfile((prev) =>
          prev ? { ...prev, followersCount: (prev.followersCount || 0) + 1 } : prev
        );
        toast.success(`Now following ${targetUsername}!`, { theme: "dark" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed", { theme: "dark" });
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShowFollowers = async () => {
    try {
      const res = await getFollowersApi(targetUsername);
      setFollowersList(res.data || []);
    } catch { setFollowersList([]); }
    setShowFollowersModal(true);
  };

  const handleShowFollowing = async () => {
    try {
      const res = await getFollowingApi(targetUsername);
      setFollowingList(res.data || []);
    } catch { setFollowingList([]); }
    setShowFollowingModal(true);
  };

  // Edit Profile save ho gaya - state update karna
  const handleProfileSave = (updatedUser) => {
    setProfile((prev) => prev ? { ...prev, ...updatedUser } : prev);
    // Global auth context update karna taaki Navbar pe bhi reflect ho
    if (updateUserState && isOwnProfile) {
      updateUserState({ ...currentUser, ...updatedUser });
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-3">
        <p className="text-zinc-400">User not found</p>
        <button onClick={() => navigate(-1)} className="text-[#0095f6] text-sm">Go back</button>
      </div>
    );
  }

  return (
    <>
      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileSave}
        />
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <UserListModal
          title="Followers"
          users={followersList}
          onClose={() => setShowFollowersModal(false)}
          navigate={navigate}
        />
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <UserListModal
          title="Following"
          users={followingList}
          onClose={() => setShowFollowingModal(false)}
          navigate={navigate}
        />
      )}

      {/* Profile post detail modal */}
      {selectedPost && (
        <ProfilePostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      <div className="min-h-screen bg-black text-white max-w-4xl mx-auto px-4 pb-16">
        {/* Profile Header */}
        <div className="flex items-start gap-6 sm:gap-10 pt-8 pb-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="p-[2px] bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 rounded-full">
              <img
                src={profile.profileImage}
                alt={profile.username}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-[3px] border-black"
                onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-xl font-light text-white tracking-tight">{profile.username}</h1>
              {/* Action buttons */}
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-1.5 bg-[#363636] hover:bg-[#444] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Edit profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 ${
                    isFollowing
                      ? "bg-[#363636] hover:bg-[#444] text-white"
                      : "bg-[#0095f6] hover:bg-blue-500 text-white"
                  }`}
                >
                  {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 sm:gap-8 mb-4">
              <div className="text-center sm:text-left">
                <span className="text-white font-semibold">{profile.postsCount || posts.length}</span>
                <span className="text-zinc-400 text-sm ml-1">posts</span>
              </div>
              <button onClick={handleShowFollowers} className="hover:opacity-70 transition-opacity">
                <span className="text-white font-semibold">{profile.followersCount || 0}</span>
                <span className="text-zinc-400 text-sm ml-1">followers</span>
              </button>
              <button onClick={handleShowFollowing} className="hover:opacity-70 transition-opacity">
                <span className="text-white font-semibold">{profile.followingCount || 0}</span>
                <span className="text-zinc-400 text-sm ml-1">following</span>
              </button>
            </div>

            {/* Name & Bio */}
            {profile.name && (
              <p className="text-white text-sm font-semibold mb-0.5">{profile.name}</p>
            )}
            {profile.bio && (
              <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Posts / Saved Tabs */}
        <div className="border-t border-zinc-800 flex items-center justify-center gap-8">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1.5 py-3 text-xs font-semibold tracking-widest uppercase border-t-2 transition-colors ${
              activeTab === "posts"
                ? "border-white text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
            </svg>
            Posts
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-1.5 py-3 text-xs font-semibold tracking-widest uppercase border-t-2 transition-colors ${
                activeTab === "saved"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <svg className="w-3.5 h-3.5 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Saved
            </button>
          )}
        </div>

        {/* Posts Grid */}
        {activeTab === "posts" && (
          posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-zinc-600">
              <div className="w-16 h-16 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                <svg className="w-8 h-8 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">
                {isOwnProfile ? "Share your first photo" : "No posts yet"}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/app/createPost")}
                  className="text-[#0095f6] text-sm font-semibold hover:text-blue-400"
                >
                  Create post
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
              {posts.map((post) => (
                <PostThumbnail
                  key={post._id}
                  post={post}
                  onClick={setSelectedPost}
                />
              ))}
            </div>
          )
        )}

        {/* Saved tab */}
        {activeTab === "saved" && (
          loadingSavedPosts ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : savedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-zinc-600">
              <div className="w-16 h-16 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                <svg className="w-8 h-8 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Only you can see what you've saved</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
              {savedPosts.map((post) => (
                <PostThumbnail
                  key={post._id}
                  post={post}
                  onClick={setSelectedPost}
                />
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Profile;
