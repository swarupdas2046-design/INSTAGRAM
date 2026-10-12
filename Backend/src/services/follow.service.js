import followModel from "../models/follow.model.js";
import { userModel } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

// ==============================================================================
// 👥 FOLLOW SERVICE - INSTAGRAM CLONE (ENHANCED EDITION)
// ==============================================================================

/**
 * @desc User ko follow karta hai
 * Hinglish: Instagram style follow - instant 'accepted' relationship banata hai
 */
export const followUserService = async (followerName, followeeName) => {
  // 1. Khud ko follow nahi kar sakte
  if (followeeName === followerName) {
    throw new ApiError("You can't follow yourself", 400);
  }

  // 2. Check karein ki target followee exist karta hai ya nahi
  const isExisted = await userModel.findOne({ username: followeeName });
  if (!isExisted) throw new ApiError("User not found", 404);

  // 3. Duplicate follow check
  const isAlreadyFollow = await followModel.findOne({
    followee: followeeName,
    follower: followerName,
  });

  if (isAlreadyFollow) {
    throw new ApiError("You are already following this user", 409);
  }

  // 4. Follow record create kar rahe hain (status default: 'accepted')
  const followData = await followModel.create({
    followee: followeeName,
    follower: followerName,
    status: "accepted",
  });

  return {
    followData,
    followeeName,
  };
};

/**
 * @desc User ko unfollow karta hai
 */
export const unfollowUserService = async (followerName, followeeName) => {
  const isExisted = await userModel.findOne({ username: followeeName });
  if (!isExisted) throw new ApiError("User not found", 404);

  const isFollowed = await followModel.findOne({
    followee: followeeName,
    follower: followerName,
  });

  if (!isFollowed) {
    throw new ApiError("You are not following this user", 400);
  }

  await followModel.findByIdAndDelete(isFollowed._id);

  return followeeName;
};

/**
 * @desc Kisi specific user ke followers ki list fetch karta hai
 * Hinglish: Jis user ke followers chahiye, unke saare 'follower' usernames nikal kar
 * unki profile info (avatar, name, bio) return karta hai.
 */
export const getFollowersService = async (targetUsername) => {
  const targetUser = await userModel.findOne({ username: targetUsername });
  if (!targetUser) throw new ApiError("User not found", 404);

  const followRecords = await followModel
    .find({ followee: targetUsername, status: "accepted" })
    .lean();

  const followerUsernames = followRecords.map((f) => f.follower);

  const users = await userModel
    .find({ username: { $in: followerUsernames } })
    .select("username profileImage name bio")
    .lean();

  return users;
};

/**
 * @desc Kisi specific user ki following list fetch karta hai
 * Hinglish: Jis user ki following list chahiye, unke saare 'followee' usernames nikal kar
 * unki profile info return karta hai.
 */
export const getFollowingService = async (targetUsername) => {
  const targetUser = await userModel.findOne({ username: targetUsername });
  if (!targetUser) throw new ApiError("User not found", 404);

  const followRecords = await followModel
    .find({ follower: targetUsername, status: "accepted" })
    .lean();

  const followingUsernames = followRecords.map((f) => f.followee);

  const users = await userModel
    .find({ username: { $in: followingUsernames } })
    .select("username profileImage name bio")
    .lean();

  return users;
};

/**
 * @desc Suggested users fetch karta hai
 * Hinglish: 1) Logged-in user khud suggest nahi hona chahiye
 *           2) Jin users ko wo pehle se follow kar raha hai, wo suggest nahi hone chahiye
 */
export const getSuggestedUsersService = async (currentUsername) => {
  // Current user ki following list nikal rahe hain
  const currentFollowing = await followModel
    .find({ follower: currentUsername, status: "accepted" })
    .lean();

  const excludedUsernames = [
    currentUsername,
    ...currentFollowing.map((f) => f.followee),
  ];

  // Database se suggestions fetch karte hain
  const suggestedUsers = await userModel
    .find({ username: { $nin: excludedUsernames } })
    .select("username profileImage name bio")
    .limit(15)
    .lean();

  return suggestedUsers;
};

/**
 * @desc Check if current user follows target user
 */
export const checkFollowStatusService = async (currentUsername, targetUsername) => {
  const follow = await followModel.findOne({
    follower: currentUsername,
    followee: targetUsername,
    status: "accepted",
  });

  return { isFollowing: Boolean(follow) };
};

// Existing follow request services preserved for backward compatibility
export const allFollowUserService = async (followeeName) => {
  const allRequest = await followModel.find({
    followee: followeeName,
    status: "pending",
  });
  return allRequest;
};

export const acceptFollowUserService = async (followerName, followeeName) => {
  const requestData = await followModel.findOne({
    follower: followerName,
    status: "pending",
    followee: followeeName,
  });

  if (!requestData) throw new ApiError("Request not found", 404);

  const acceptedRequested = await followModel.findByIdAndUpdate(
    requestData._id,
    { status: "accepted" },
    { new: true }
  );

  return acceptedRequested;
};

export const rejectFollowUserService = async (followeeName, followerName) => {
  const requestData = await followModel.findOne({
    follower: followerName,
    status: "pending",
    followee: followeeName,
  });

  if (!requestData) throw new ApiError("Request not found", 404);

  await followModel.findByIdAndDelete(requestData._id);
  return null;
};