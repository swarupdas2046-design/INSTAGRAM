import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

// ==============================================================================
// 📡 POST API SERVICE
// ==============================================================================
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/post`,
  withCredentials: true,
});

// Home feed (followed users ke posts)
export const getFeed = async () => {
  const response = await axiosInstance.get("/feed");
  return response.data;
};

// Explore / discovery feed (saare users ke posts)
export const getExploreFeed = async () => {
  const response = await axiosInstance.get("/explore");
  return response.data;
};

// User profile posts by username
export const getUserPosts = async (username) => {
  const response = await axiosInstance.get(`/user/${username}`);
  return response.data;
};

// Current user ke saved/bookmarked posts
export const getSavedPostsApi = async () => {
  const response = await axiosInstance.get("/saved");
  return response.data;
};

// Create post with images
export const uploadPost = async (imageFiles, caption) => {
  const payload = new FormData();
  payload.append("caption", caption || "");
  if (Array.isArray(imageFiles)) {
    imageFiles.forEach((file) => {
      payload.append("imageUrl", file);
    });
  } else if (imageFiles) {
    payload.append("imageUrl", imageFiles);
  }
  const response = await axiosInstance.post("/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Like a post
export const likePostApi = async (postId) => {
  const response = await axiosInstance.post(`/like/${postId}`);
  return response.data;
};

// Unlike a post
export const unlikePostApi = async (postId) => {
  const response = await axiosInstance.post(`/unlike/${postId}`);
  return response.data;
};

// Save/bookmark a post
export const savePostApi = async (postId) => {
  const response = await axiosInstance.post(`/save/${postId}`);
  return response.data;
};

// Remove post from saved/bookmarks
export const unsavePostApi = async (postId) => {
  const response = await axiosInstance.post(`/unsave/${postId}`);
  return response.data;
};

// Get users who liked a post
export const getPostLikesApi = async (postId) => {
  const response = await axiosInstance.get(`/likes/${postId}`);
  return response.data;
};

// Get comments for a post
export const getPostCommentsApi = async (postId) => {
  const response = await axiosInstance.get(`/comments/${postId}`);
  return response.data;
};

// Add a comment to a post
export const addCommentApi = async (postId, text) => {
  const response = await axiosInstance.post(`/comment/${postId}`, { text });
  return response.data;
};

// Delete a comment
export const deleteCommentApi = async (commentId) => {
  const response = await axiosInstance.delete(`/comment/${commentId}`);
  return response.data;
};
