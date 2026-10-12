import sendFile from "../config/imagekit.js";
import followModel from "../models/follow.model.js";
import { postModel } from "../models/post.model.js";
import { userModel } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

// ==============================================================================
// 👤 USER SERVICE - INSTAGRAM CLONE
// ==============================================================================

/**
 * @desc Kisi bhi user ka public profile fetch karta hai
 * Hinglish: followers count, following count aur posts count bhi calculate karte hain
 * taaki profile header me sahi numbers dikhen
 */
export const getUserProfileService = async (targetUsername, currentUsername) => {
  const user = await userModel.findOne({ username: targetUsername })
    .select("username name bio profileImage createdAt")
    .lean();

  if (!user) throw new ApiError("User not found", 404);

  // Followers count: jin logon ne is user ko follow kiya
  const followersCount = await followModel.countDocuments({
    followee: targetUsername,
    status: "accepted",
  });

  // Following count: ye user jin logon ko follow karta hai
  const followingCount = await followModel.countDocuments({
    follower: targetUsername,
    status: "accepted",
  });

  // Is user ke saare posts ki ginti
  const postsCount = await postModel.countDocuments({ user: user._id });

  // Check karo ki current logged-in user is profile ko follow karta hai ya nahi
  let isFollowing = false;
  if (currentUsername && currentUsername !== targetUsername) {
    const followRecord = await followModel.findOne({
      follower: currentUsername,
      followee: targetUsername,
      status: "accepted",
    });
    isFollowing = Boolean(followRecord);
  }

  return {
    ...user,
    followersCount,
    followingCount,
    postsCount,
    isFollowing,
  };
};

/**
 * @desc Logged-in user ka profile update karta hai (bio, name, profileImage)
 * Hinglish: Sirf authenticated user apna khud ka profile update kar sakta hai.
 * Agar naya image file aaya toh use ImageKit pe upload karke URL save karte hain.
 */
export const updateUserProfileService = async (userId, updateData, file) => {
  const { name, bio } = updateData;

  // Jo bhi fields update karni hain unhe object me collect karo
  const fieldsToUpdate = {};
  if (name !== undefined) fieldsToUpdate.name = name;
  if (bio !== undefined) fieldsToUpdate.bio = bio;

  // Agar naya profile photo upload kiya gaya hai
  if (file) {
    const uploadResponse = await sendFile(
      file.buffer,
      file.originalname,
      "profiles"
    );
    if (!uploadResponse || !uploadResponse.url) {
      throw new ApiError("Profile image upload failed", 500);
    }
    fieldsToUpdate.profileImage = uploadResponse.url;
  }

  // Database me update karke updated user return karte hain
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  ).select("username name bio profileImage email createdAt updatedAt");

  if (!updatedUser) throw new ApiError("User not found", 404);

  return updatedUser;
};

/**
 * @desc Username ya name se users search karta hai
 * Hinglish: Case-insensitive aur partial match support ke liye MongoDB regex use karte hain.
 * Khud ko results me nahi dikhata.
 */
export const searchUsersService = async (query, currentUsername) => {
  if (!query || !query.trim()) {
    throw new ApiError("Search query is required", 400);
  }

  const trimmedQuery = query.trim();

  // Partial match aur case-insensitive search ke liye regex
  const searchRegex = new RegExp(trimmedQuery, "i");

  const users = await userModel
    .find({
      username: { $ne: currentUsername }, // Khud ko exclude karein
      $or: [{ username: searchRegex }, { name: searchRegex }],
    })
    .select("username name bio profileImage")
    .limit(20)
    .lean();

  return users;
};
