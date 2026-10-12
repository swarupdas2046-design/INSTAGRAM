import {
  acceptFollowUserService,
  allFollowUserService,
  checkFollowStatusService,
  followUserService,
  getFollowersService,
  getFollowingService,
  getSuggestedUsersService,
  rejectFollowUserService,
  unfollowUserService,
} from "../services/follow.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==============================================================================
// 👥 FOLLOW CONTROLLER - INSTAGRAM CLONE (ENHANCED)
// ==============================================================================

// User ko follow karta hai
export const followUserController = asyncHandler(async (req, res) => {
  const { followData, followeeName } = await followUserService(
    req.user.username,
    req.params.username
  );

  return res
    .status(201)
    .json(new ApiResponse(`You are now following ${followeeName}`, followData));
});

// User ko unfollow karta hai
export const unfollowUserController = asyncHandler(async (req, res) => {
  const unfollowUser = await unfollowUserService(
    req.user.username,
    req.params.username
  );

  return res
    .status(200)
    .json(new ApiResponse(`You have unfollowed ${unfollowUser}`, null));
});

// Kisi user ke followers ki list
export const getFollowersController = asyncHandler(async (req, res) => {
  const followers = await getFollowersService(req.params.username);

  return res
    .status(200)
    .json(new ApiResponse("Followers fetched successfully", followers));
});

// Kisi user ki following list
export const getFollowingController = asyncHandler(async (req, res) => {
  const following = await getFollowingService(req.params.username);

  return res
    .status(200)
    .json(new ApiResponse("Following fetched successfully", following));
});

// Suggested users for current logged-in user
export const getSuggestedUsersController = asyncHandler(async (req, res) => {
  const suggested = await getSuggestedUsersService(req.user.username);

  return res
    .status(200)
    .json(new ApiResponse("Suggested users fetched successfully", suggested));
});

// Check if current user follows target user
export const checkFollowStatusController = asyncHandler(async (req, res) => {
  const result = await checkFollowStatusService(
    req.user.username,
    req.params.username
  );

  return res
    .status(200)
    .json(new ApiResponse("Follow status fetched", result));
});

// -------------- Follow Request Controllers (backward compatibility) --------------
export const followRequestController = asyncHandler(async (req, res) => {
  const allRequest = await allFollowUserService(req.user.username);
  return res
    .status(200)
    .json(new ApiResponse("Request Fetched Successfully", allRequest));
});

export const acceptController = asyncHandler(async (req, res) => {
  const acceptedRequested = await acceptFollowUserService(
    req.params.username,
    req.user.username
  );
  return res
    .status(200)
    .json(new ApiResponse("Request Accepted Successfully", acceptedRequested));
});

export const rejectController = asyncHandler(async (req, res) => {
  const response = await rejectFollowUserService(
    req.user.username,
    req.params.username
  );
  return res
    .status(200)
    .json(new ApiResponse("Request Rejected Successfully", response));
});
