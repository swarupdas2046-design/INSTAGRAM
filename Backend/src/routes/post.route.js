import express from "express";
import multer from "multer";
import { getAllPost, PostController, postDetails } from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import ApiResponse from "../utils/apiResponse.js";
const Upload = multer({ storage: multer.memoryStorage() });
const postRouter = express.Router();

/**
 * - api's: [
 *      http://localhost:3000/api/post/
 *      http://localhost:3000/api/post/all-posts
 *      http://localhost:3000/api/post/detail/:id
 * ]
 * - All methods are protected by auth middleware
 * - access -> Only Authenticated Users
 */

postRouter.post("/", authMiddleware,Upload.single("imageUrl"),PostController);

postRouter.get("/all-posts",authMiddleware,getAllPost)

postRouter.get("/detail/:id",authMiddleware,postDetails)

export default postRouter;
