import {
  allPostService,
  likePostService,
  postDetailsService,
  PostService,
} from "../services/post.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ------------- Create Post Controller --------------
export const PostController = asyncHandler(async (req, res) => {
  const post = await PostService(req.user, req.file, req.body.caption);

  return res
    .status(200)
    .json(new ApiResponse("Post Created SuccessFully", post));
});

// ------------- Get All Posts that are created by the user --------------
export const getAllPost = asyncHandler(async (req, res) => {
  const allPosts = await allPostService(req.user);
  // const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse("Posts Fetched Successfully", allPosts));
});

// ------------- Get Single Post that is created by the user --------------
export const postDetails = asyncHandler(async (req, res) => {
  const data = await postDetailsService(req.params.id, req.user);

  return res
    .status(200)
    .json(new ApiResponse("Post Fetched Successfully", data));
});

export const likePostController = asyncHandler(async (req, res) => {
  const like = await likePostService(req.params.id, req.user.username);

  return res.status(200).json(new ApiResponse("Post Liked Successfully", like));
});
