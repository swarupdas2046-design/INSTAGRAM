import sendFile from "../config/imagekit.js";
import { postModel } from "../models/post.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ------------- Create Post Controller --------------
export const PostController = asyncHandler(async (req, res) => {
  const User = req.user;
  const file = req.file;
  const { caption } = req.body;

  if (!file) throw new ApiError("Image is required", 400);

  const data = await sendFile(file.buffer, file.originalname, "posts");

  if (!data) throw new ApiError("Image Upload Failed", 500);

  const post = await postModel.create({
    user: User._id,
    caption,
    imageUrl: { url: data.url, fieldId: data.fileId },
  });

  return res
    .status(200)
    .json(new ApiResponse("Post Created SuccessFully", post));
});

// ------------- Get All Posts that are created by the user --------------
export const getAllPost = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log(user);

  const allPosts = await postModel.find({ user: user._id });

  if (!allPosts) throw new ApiError("Posts not found", 404);

  console.log(allPosts);

  return res
    .status(200)
    .json(new ApiResponse("Posts Fetched Successfully", allPosts));
});

// ------------- Get Single Post that is created by the user --------------
export const postDetails = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!postId) throw new ApiError("post not found", 404);

  const data = await postModel.findById(postId);

  if (!data) throw new ApiError("Post not found", 404);

  //-----------------check if the user is the owner of the post through equal method---------------------

  const isValid = data.user.equals(req.user._id);

  if (!isValid) throw new ApiError("forbidden access", 403);

  return res
    .status(200)
    .json(new ApiResponse("Post Fetched Successfully", data));
});
