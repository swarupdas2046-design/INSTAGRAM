import express from "express";
import multer from "multer";
import {
  addCommentController,
  deleteCommentController,
  getPostCommentsController,
} from "../controllers/comment.controller.js";
import {
  getAllPost,
  getExploreFeedController,
  getFeesController,
  getPostLikesController,
  getSavedPostsController,
  getUserPostsController,
  likePostController,
  PostController,
  postDetails,
  savePostController,
  unlikePostController,
  unsavePostController,
} from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const Upload = multer({ storage: multer.memoryStorage() });
const postRouter = express.Router();

// ==============================================================================
// 📸 POST & COMMENT ROUTES
// ==============================================================================

// Create post (max 5 images)
postRouter.post("/", authMiddleware, Upload.array("imageUrl", 5), PostController);

// Current user ke apne posts
postRouter.get("/all-posts", authMiddleware, getAllPost);

// Home feed (posts from followed accounts)
postRouter.get("/feed", authMiddleware, getFeesController);

// Explore / Discovery feed (posts from all users)
postRouter.get("/explore", authMiddleware, getExploreFeedController);

// User profile posts by username
postRouter.get("/user/:username", authMiddleware, getUserPostsController);

// Current user's saved posts
postRouter.get("/saved", authMiddleware, getSavedPostsController);

// Post details by id
postRouter.get("/detail/:id", authMiddleware, postDetails);

// Like & Unlike post
postRouter.post("/like/:id", authMiddleware, likePostController);
postRouter.post("/unlike/:id", authMiddleware, unlikePostController);

// Save & Unsave post
postRouter.post("/save/:id", authMiddleware, savePostController);
postRouter.post("/unsave/:id", authMiddleware, unsavePostController);

// Users who liked a post
postRouter.get("/likes/:id", authMiddleware, getPostLikesController);

// Comments for a post
postRouter.get("/comments/:id", authMiddleware, getPostCommentsController);
postRouter.post("/comment/:id", authMiddleware, addCommentController);
postRouter.delete("/comment/:commentId", authMiddleware, deleteCommentController);

export default postRouter;
