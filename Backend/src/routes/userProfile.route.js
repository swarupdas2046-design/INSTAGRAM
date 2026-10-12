import express from "express";
import multer from "multer";
import {
  getUserProfileController,
  searchUsersController,
  updateUserProfileController,
} from "../controllers/userProfile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userProfileRouter = express.Router();

// Profile image ke liye multer setup (memory storage - ImageKit pe upload hoga)
const Upload = multer({ storage: multer.memoryStorage() });

// ==============================================================================
// 👤 USER PROFILE ROUTES
// Base: /api/user
// ==============================================================================

// Search users by username or name
userProfileRouter.get("/search", authMiddleware, searchUsersController);

// Get public profile by username
userProfileRouter.get("/profile/:username", authMiddleware, getUserProfileController);

// Update own profile (bio, name, profile image)
userProfileRouter.put(
  "/profile",
  authMiddleware,
  Upload.single("profileImage"),
  updateUserProfileController
);

export default userProfileRouter;
