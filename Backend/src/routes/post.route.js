import express from "express";
import multer from "multer";
import {
  getAllPost,
  likePostController,
  PostController,
  postDetails,
} from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const Upload = multer({ storage: multer.memoryStorage() });
const postRouter = express.Router();

/**
 * - api's: [
 *      http://localhost:3000/api/post/
 *      http://localhost:3000/api/post/all-posts
 *      http://localhost:3000/api/post/detail/:id
 *      http://localhost:3000/api/post/like/:id
 * ]
 * - All methods are protected by auth middleware
 * - access -> Only Authenticated Users
 */

postRouter.post("/", authMiddleware, Upload.single("imageUrl"), PostController);

/**
 * @route GET /api/post/all-posts
 * @access authenticated user only
 * @description returns all posts that belong to the authenticated user
 */
postRouter.get("/all-posts", authMiddleware, getAllPost);

/**
 * @route GET /api/post/detail/:id
 * @access authenticated user only
 * @description returns an detail of a specific post by id in the request params
 */

postRouter.get("/detail/:id", authMiddleware, postDetails);

/**
 * @route POST /api/post/like/:id
 * @access authenticated user only
 * @description like a post with the given id in the request params
 */
postRouter.post("/like/:id", authMiddleware, likePostController);

export default postRouter;
