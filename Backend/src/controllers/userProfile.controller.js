import multer from "multer";
import {
  getUserProfileService,
  searchUsersService,
  updateUserProfileService,
} from "../services/userProfile.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==============================================================================
// 👤 USER PROFILE CONTROLLER - INSTAGRAM CLONE
// ==============================================================================

/**
 * @desc Public user profile fetch
 * @route GET /api/user/profile/:username
 */
export const getUserProfileController = asyncHandler(async (req, res) => {
  const targetUsername = req.params.username;
  const currentUsername = req.user.username;

  const profile = await getUserProfileService(targetUsername, currentUsername);

  return res
    .status(200)
    .json(new ApiResponse("Profile fetched successfully", profile));
});

/**
 * @desc Logged-in user apna profile update karta hai
 * @route PUT /api/user/profile
 * Hinglish: req.user se authenticated identity leni chahiye, kabhi bhi
 * client-supplied userId par trust nahi karna chahiye
 */
export const updateUserProfileController = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Auth middleware se trusted user id
  const { name, bio } = req.body;
  const file = req.file; // Optional: naya profile photo

  const updatedUser = await updateUserProfileService(
    userId,
    { name, bio },
    file
  );

  return res
    .status(200)
    .json(new ApiResponse("Profile updated successfully", updatedUser));
});

/**
 * @desc User search by username or name
 * @route GET /api/user/search?q=...
 */
export const searchUsersController = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const currentUsername = req.user.username;

  const users = await searchUsersService(query, currentUsername);

  return res
    .status(200)
    .json(new ApiResponse("Search results fetched successfully", users));
});
