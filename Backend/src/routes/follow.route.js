import express from "express";
import {
  acceptController,
  checkFollowStatusController,
  followRequestController,
  followUserController,
  getFollowersController,
  getFollowingController,
  getSuggestedUsersController,
  rejectController,
  unfollowUserController,
} from "../controllers/follow.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const followRouter = express.Router();

// ==============================================================================
// 👥 FOLLOW / USER SOCIAL ROUTES
// Base: /api/user
// ==============================================================================

// Follow & Unfollow
followRouter.post("/follow/:username", authMiddleware, followUserController);
followRouter.post("/unfollow/:username", authMiddleware, unfollowUserController);

// Followers & Following lists
followRouter.get("/followers/:username", authMiddleware, getFollowersController);
followRouter.get("/following/:username", authMiddleware, getFollowingController);

// Suggested users (for home page sidebar)
followRouter.get("/suggested", authMiddleware, getSuggestedUsersController);

// Check if current user follows a specific user
followRouter.get("/follow-status/:username", authMiddleware, checkFollowStatusController);

// Follow request management (backward compatibility)
followRouter.get("/follow/follow-requests", authMiddleware, followRequestController);
followRouter.post("/follow/accept-request/:username", authMiddleware, acceptController);
followRouter.post("/follow/reject-request/:username", authMiddleware, rejectController);

export default followRouter;
