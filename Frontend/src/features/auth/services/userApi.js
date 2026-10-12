import axios from "axios";

// ==============================================================================
// 📡 USER API SERVICE - Follow, Profile, Search
// ==============================================================================
const userAxios = axios.create({
  baseURL: "http://localhost:8000/api/user",
  withCredentials: true,
});

// Follow a user
export const followUserApi = async (username) => {
  const response = await userAxios.post(`/follow/${username}`);
  return response.data;
};

// Unfollow a user
export const unfollowUserApi = async (username) => {
  const response = await userAxios.post(`/unfollow/${username}`);
  return response.data;
};

// Get followers list
export const getFollowersApi = async (username) => {
  const response = await userAxios.get(`/followers/${username}`);
  return response.data;
};

// Get following list
export const getFollowingApi = async (username) => {
  const response = await userAxios.get(`/following/${username}`);
  return response.data;
};

// Get suggested users
export const getSuggestedUsersApi = async () => {
  const response = await userAxios.get("/suggested");
  return response.data;
};

// Check follow status
export const checkFollowStatusApi = async (username) => {
  const response = await userAxios.get(`/follow-status/${username}`);
  return response.data;
};

// Get user public profile
export const getUserProfileApi = async (username) => {
  const response = await userAxios.get(`/profile/${username}`);
  return response.data;
};

// Update own profile
export const updateUserProfileApi = async (formData) => {
  const response = await userAxios.put("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Search users
export const searchUsersApi = async (query) => {
  const response = await userAxios.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
};
