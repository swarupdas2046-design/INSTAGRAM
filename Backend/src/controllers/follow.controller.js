import followModel from "../models/follow.model.js";
import {
  acceptFollowUserService,
  allFollowUserService,
  followUserService,
  rejectFollowUserService,
  unfollowUserService,
} from "../services/follow.service.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const followUserController = asyncHandler(async (req, res) => {
  const { followData, followeeName } = await followUserService(
    req.user.username,
    req.params.username,
  );

  return res
    .status(201)
    .json(
      new ApiResponse(`follow request sent to ${followeeName}`, followData),
    );
});

export const unfollowUserController = asyncHandler(async (req, res) => {
  const unfollowUser = await unfollowUserService(
    req.user.username,
    req.params.username,
  );

  return res
    .status(200)
    .json(new ApiResponse(`You have unfollowed ${unfollowUser}`));
});

// -------------- Follow Request Controller --------------
export const followRequestController = asyncHandler(async (req, res) => {
  const allRequest = await allFollowUserService(req.user.username);

  return res
    .status(200)
    .json(new ApiResponse("Request Fetched Successfully", allRequest));
});

// -------------- Accept Request Controller --------------
export const acceptController = asyncHandler(async (req, res) => {
  const acceptedRequested = await acceptFollowUserService(
    req.params.username,
    req.user.username,
  );

  return res
    .status(200)
    .json(new ApiResponse("Request Accepted Successfully", acceptedRequested));
});

// -------------- Reject Request Controller --------------
export const rejectController = asyncHandler(async (req, res) => {
  const response = await rejectFollowUserService(
    req.user.username,
    req.params.username,
  );

  return res
    .status(200)
    .json(new ApiResponse("Request Rejected Successfully", response));
});
