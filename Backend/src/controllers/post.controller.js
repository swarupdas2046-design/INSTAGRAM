import {
  allPostService,
  getExploreFeedService,
  getFollowingFeedService,
  getPostLikesService,
  getSavedPostsService,
  getUserPostsService,
  likePostService,
  postDetailsService,
  PostService,
  savePostService,
  unlikePostService,
  unsavePostService,
} from "../services/post.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==============================================================================
// 📸 POST CONTROLLER - INSTAGRAM CLONE (FULL-STACK INTEGRATED)
// ==============================================================================

/**
 * @desc Create new post
 * @route POST /api/post/
 */
export const PostController = asyncHandler(async (req, res) => {
  const post = await PostService(req.user, req.files, req.body.caption);

  return res
    .status(200)
    .json(new ApiResponse("Post Created Successfully", post));
});

/**
 * @desc Logged-in user ke apne posts fetch karna
 * @route GET /api/post/all-posts
 */
export const getAllPost = asyncHandler(async (req, res) => {
  const allPosts = await allPostService(req.user);

  return res
    .status(200)
    .json(new ApiResponse("Posts Fetched Successfully", allPosts));
});

/**
 * @desc Specific post detail
 * @route GET /api/post/detail/:id
 */
export const postDetails = asyncHandler(async (req, res) => {
  const data = await postDetailsService(req.params.id, req.user);

  return res
    .status(200)
    .json(new ApiResponse("Post Fetched Successfully", data));
});

/**
 * @desc Like a post
 * @route POST /api/post/like/:id
 */
export const likePostController = asyncHandler(async (req, res) => {
  const result = await likePostService(req.params.id, req.user.username);

  return res
    .status(200)
    .json(new ApiResponse(result.message || "Post Liked Successfully", result));
});

/**
 * @desc Unlike a post
 * @route POST /api/post/unlike/:id
 */
export const unlikePostController = asyncHandler(async (req, res) => {
  const result = await unlikePostService(req.params.id, req.user.username);

  return res
    .status(200)
    .json(new ApiResponse(result.message || "Post Unliked Successfully", result));
});

/**
 * @desc Get users who liked a post
 * @route GET /api/post/likes/:id
 */
export const getPostLikesController = asyncHandler(async (req, res) => {
  const users = await getPostLikesService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse("Users who liked fetched successfully", users));
});

/**
 * @desc HOME FEED: Followed users ke posts
 * @route GET /api/post/feed
 */
export const getFeesController = asyncHandler(async (req, res) => {
  const feed = await getFollowingFeedService(req.user);

  return res
    .status(200)
    .json(new ApiResponse("Feed fetched Successfully", feed));
});

/**
 * @desc GLOBAL EXPLORE FEED / REELS DISCOVERY
 * @route GET /api/post/explore
 */
export const getExploreFeedController = asyncHandler(async (req, res) => {
  const explorePosts = await getExploreFeedService(req.user);

  return res
    .status(200)
    .json(new ApiResponse("Explore feed fetched Successfully", explorePosts));
});

/**
 * @desc User profile ke posts by username
 * @route GET /api/post/user/:username
 */
export const getUserPostsController = asyncHandler(async (req, res) => {
  const posts = await getUserPostsService(req.params.username, req.user.username);

  return res
    .status(200)
    .json(new ApiResponse("User posts fetched Successfully", posts));
});

/**
 * @desc Save/bookmark a post
 * @route POST /api/post/save/:id
 */
export const savePostController = asyncHandler(async (req, res) => {
  const result = await savePostService(req.params.id, req.user.username);

  return res
    .status(200)
    .json(new ApiResponse(result.message || "Post saved successfully", result));
});

/**
 * @desc Remove saved/bookmarked post
 * @route POST /api/post/unsave/:id
 */
export const unsavePostController = asyncHandler(async (req, res) => {
  const result = await unsavePostService(req.params.id, req.user.username);

  return res
    .status(200)
    .json(new ApiResponse(result.message || "Post removed from saved", result));
});

/**
 * @desc Current user's saved posts
 * @route GET /api/post/saved
 */
export const getSavedPostsController = asyncHandler(async (req, res) => {
  const posts = await getSavedPostsService(req.user);

  return res
    .status(200)
    .json(new ApiResponse("Saved posts fetched successfully", posts));
});
