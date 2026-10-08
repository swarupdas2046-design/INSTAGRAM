import {
  followUserService,
  unfollowUserService,
} from "../services/follow.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const followUserController = asyncHandler(async (req, res) => {
  const { followData, followeeName } = await followUserService(
    req.user.username,
    req.params.username,
  );

  return res
    .status(201)
    .json(new ApiResponse(`you are followed ${followeeName}`, followData));
});

export const unfollowUserController = asyncHandler(async (req, res) => {
  const unfollowUser  = await unfollowUserService(
    req.user.username,
    req.params.username,
  );

  return res
    .status(200)
    .json(new ApiResponse(`You have unfollowed ${unfollowUser}`));
});
