import express from "express";
import multer from "multer";
import { PostController } from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import ApiResponse from "../utils/apiResponse.js";
const Upload = multer({ storage: multer.memoryStorage() });
const postRouter = express.Router();

/**
 * -
 */

postRouter.post("/", authMiddleware,Upload.single("imageUrl"),PostController);

postRouter.get("/healthy",authMiddleware,(req,res)=>{
    const user = req.user
    return res.status(200).json(new ApiResponse("Server is healthy",user))
})

export default postRouter;
